import assert from "node:assert/strict";
import { mkdir, readFile, writeFile, copyFile } from "node:fs/promises";
import { spawnSync, execFileSync } from "node:child_process";
import { createHash } from "node:crypto";
import path from "node:path";
import { zipSync } from "fflate";
import { compilePack, extractPack } from "@foundryvtt/foundryvtt-cli";
import { validateContentCatalog } from "./content.mjs";
import { deployRemote, smokeRemote } from "./remote.mjs";
import {
  root,
  moduleId,
  json,
  files,
  cleanOutput,
  safeRelative,
  validateManifest,
  validateArchive,
} from "./lib.mjs";

process.chdir(root);
const hash = (data) => createHash("sha256").update(data).digest("hex");
const load = async () => ({
  manifest: await json("module.json"),
  pkg: await json("package.json"),
  compatibility: await json("config/compatibility.json"),
  content: await json("config/content.json"),
});

async function manifestCheck() {
  const { manifest, pkg, compatibility } = await load();
  validateManifest(manifest, pkg, compatibility);
  for (const key of ["readme", "changelog", "license"])
    await readFile(manifest[key]);
}

async function contentCheck() {
  return validateContentCatalog();
}

async function referenceCheck() {
  await contentCheck();
  console.log(
    "Registered identities, source notices, description links and image hashes passed.",
  );
}

async function buildPacks() {
  const { docs } = await contentCheck();
  const { manifest } = await load();
  for (const pack of manifest.packs) {
    safeRelative(pack.name);
    safeRelative(pack.path);
    const compiled = path.join(".build/compiled-packs", pack.name);
    await compilePack(path.join("src/packs", pack.name), compiled);
    const extracted = path.join(".build/roundtrip", pack.name);
    await extractPack(compiled, extracted, {
      transformName: (doc) => `${doc._id}.json`,
    });
    const recoveredFiles = await files(extracted);
    const expectedDocs = docs.filter((entry) => entry.pack === pack.name);
    assert.equal(
      recoveredFiles.length,
      expectedDocs.length,
      "Compiled document count changed",
    );
    for (const { doc } of expectedDocs)
      assert.deepEqual(
        await json(path.join(extracted, `${doc._id}.json`)),
        doc,
        "Compiled source drift",
      );
    // LevelDB diagnostic logs carry timestamps and are not database content.
    // Package database files unchanged; keep diagnostics in the build workspace.
    await mkdir(path.join("dist", pack.path), { recursive: true });
    for (const file of await files(compiled)) {
      const name = path.basename(file);
      if (["LOG", "LOG.old", "LOCK"].includes(name)) continue;
      assert(
        /^(?:[0-9]+\.(?:ldb|log)|CURRENT|MANIFEST-[0-9]+)$/.test(name),
        "Unexpected compiler output",
      );
      await copyFile(file, path.join("dist", pack.path, name));
    }
  }
}

async function build() {
  await manifestCheck();
  await contentCheck();
  await referenceCheck();
  await cleanOutput("dist");
  await cleanOutput(".build");
  await mkdir("dist");
  await mkdir(".build");
  const allowlist = [
    "module.json",
    "README.md",
    "CHANGELOG.md",
    "LICENSE",
    "ATTRIBUTION.md",
    ...(await files("LICENSES")),
    ...(await files("docs")),
  ];
  for (const file of allowlist) {
    const target = path.join("dist", file);
    await mkdir(path.dirname(target), { recursive: true });
    await copyFile(file, target);
  }
  const { content } = await load();
  // Human-reviewable corresponding source for adapted upstream record data.
  const sourcePath = "src/packs/items/lycanthrope-hunters-kit.json";
  await mkdir("dist/sources/items", { recursive: true });
  await copyFile(sourcePath, "dist/sources/items/lycanthrope-hunters-kit.json");
  for (const asset of content.assets) {
    const target = path.join("dist", asset.path.slice("static/".length));
    await mkdir(path.dirname(target), { recursive: true });
    await copyFile(asset.path, target);
  }
  await buildPacks();
  const expected = {};
  for (const file of await files("dist")) {
    const name = path.relative("dist", file).split(path.sep).join("/");
    safeRelative(name);
    expected[name] = await readFile(file);
  }
  const zipInput = Object.fromEntries(
    Object.entries(expected).map(([name, bytes]) => [
      name,
      [bytes, { mtime: new Date(2000, 0, 1), os: 0, attrs: 0 }],
    ]),
  );
  const zip = zipSync(zipInput, { level: 9 });
  validateArchive(zip, expected);
  await writeFile(`.build/${moduleId}.zip`, zip);
  const commit = execFileSync("git", ["rev-parse", "HEAD"], {
    encoding: "utf8",
  }).trim();
  const dirty = Boolean(
    execFileSync("git", ["status", "--porcelain"], { encoding: "utf8" }).trim(),
  );
  await writeFile(
    ".build/build.json",
    JSON.stringify(
      {
        commit,
        dirty,
        version: (await load()).manifest.version,
        sha256: hash(zip),
        files: Object.fromEntries(
          Object.entries(expected).map(([name, bytes]) => [name, hash(bytes)]),
        ),
      },
      null,
      2,
    ) + "\n",
  );
  console.log(
    `Built foundation ZIP (${Object.keys(expected).length} files; dirty source: ${dirty}).`,
  );
  return hash(zip);
}

function run(args) {
  const child = spawnSync(process.execPath, args, {
    stdio: "inherit",
    cwd: root,
  });
  assert.equal(child.status, 0, `Command failed: node ${args.join(" ")}`);
}

async function lint() {
  for (const dir of ["scripts", "tests"]) {
    for (const file of await files(dir))
      if (file.endsWith(".mjs")) run(["--check", file]);
  }
}

async function main() {
  const task = process.argv[2];
  switch (task) {
    case "clean":
      await cleanOutput("dist");
      await cleanOutput(".build");
      break;
    case "manifest":
      await manifestCheck();
      break;
    case "content":
      await contentCheck();
      break;
    case "references":
      await referenceCheck();
      break;
    case "packs":
      await build();
      break;
    case "build":
      await build();
      break;
    case "lint":
      await lint();
      break;
    case "verify": {
      run(["node_modules/prettier/bin/prettier.cjs", "--check", "."]);
      await lint();
      run(["--test"]);
      const first = await build();
      const second = await build();
      assert.equal(first, second, "Clean rebuild changed the review archive");
      const verifiedBuild = await json(".build/build.json");
      await writeFile(
        ".build/verified.json",
        JSON.stringify(
          {
            commit: verifiedBuild.commit,
            sha256: verifiedBuild.sha256,
            dirty: verifiedBuild.dirty,
          },
          null,
          2,
        ) + "\n",
      );
      console.log(
        "Local foundation gate passed; see docs/TESTING.md for remote evidence and deferred PF1 content checks.",
      );
      break;
    }
    case "deploy":
      await deployRemote(process.argv.includes("--dry-run"));
      break;
    case "smoke":
      await smokeRemote(process.argv.includes("--semantic"));
      break;
    case "release":
      await manifestCheck();
      throw new Error(
        "Release blocked: no integration-test evidence, approved release version, or release URLs. See docs/TESTING.md.",
      );
    default:
      throw new Error("Unknown task");
  }
}

main().catch((error) => {
  console.error(error.message);
  process.exitCode = 1;
});
