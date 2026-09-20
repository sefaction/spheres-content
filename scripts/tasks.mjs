import assert from "node:assert/strict";
import { mkdir, readFile, writeFile, copyFile } from "node:fs/promises";
import { spawnSync, execFileSync } from "node:child_process";
import { createHash } from "node:crypto";
import path from "node:path";
import { zipSync } from "fflate";
import { compilePack } from "@foundryvtt/foundryvtt-cli";
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
  const { content, manifest } = await load();
  assert.deepEqual(
    content,
    { packs: [], sources: [], assets: [] },
    "Content intake is gated until the PF1 schema, source rights, and pack plan are reviewed",
  );
  assert.deepEqual(
    manifest.packs,
    [],
    "Register packs only after content intake is implemented",
  );
  const sourceFiles = await files("src/packs");
  assert.deepEqual(
    sourceFiles,
    [path.join("src", "packs", "README.md")],
    "Unregistered canonical content",
  );
  const assetFiles = await files("static");
  assert.deepEqual(
    assetFiles,
    [path.join("static", "README.md")],
    "Unregistered static assets",
  );
}

async function referenceCheck() {
  await contentCheck();
  // No content references can exist while intake is gated. Do not imply a PF1 schema check.
  console.log(
    "References: no registered content or assets; content intake gate enforced.",
  );
}

async function buildPacks() {
  await contentCheck();
  const { manifest } = await load();
  for (const pack of manifest.packs) {
    safeRelative(pack.name);
    safeRelative(pack.path);
    await compilePack(
      path.join("src/packs", pack.name),
      path.join("dist", pack.path),
    );
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
      await buildPacks();
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
      console.log(
        "Local foundation gate passed; Foundry acceptance and PF1 content schema checks are pending.",
      );
      break;
    }
    case "deploy":
    case "smoke":
      throw new Error(
        "Remote workflow is not configured. No connection or mutation attempted. See docs/REMOTE_TESTING.md.",
      );
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
