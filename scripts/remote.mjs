import assert from "node:assert/strict";
import path from "node:path";
import {
  readFile,
  writeFile,
  mkdir,
  lstat,
  realpath,
  rename,
  copyFile,
  readdir,
  unlink,
} from "node:fs/promises";
import { execFileSync } from "node:child_process";
import { createHash, randomUUID } from "node:crypto";
import { extractPack } from "@foundryvtt/foundryvtt-cli";
import {
  root,
  moduleId,
  json,
  files,
  safeRelative,
  validateArchive,
} from "./lib.mjs";

const digest = (bytes) => createHash("sha256").update(bytes).digest("hex");
const git = (...args) =>
  execFileSync("git", args, { cwd: root, encoding: "utf8" }).trim();
const exists = async (file) => {
  try {
    await lstat(file);
    return true;
  } catch (error) {
    if (error.code === "ENOENT") return false;
    throw error;
  }
};

export function resolveProfile(profile) {
  assert.equal(profile.profile, "spheres-test", "Unrecognized test profile");
  assert.equal(profile.moduleId, moduleId, "Wrong module target");
  assert.equal(
    profile.world,
    "additional-spheres-content-test",
    "Wrong test world",
  );
  assert.equal(profile.transport, "smb", "Only SMB is implemented");
  const value = profile.dataPath;
  assert(
    typeof value === "string" &&
      /^\\\\[a-zA-Z0-9.-]+\\[a-zA-Z0-9_-]+\\/.test(value),
    "Require a UNC data directory below a share",
  );
  const parts = value.slice(2).split("\\");
  assert(
    parts.length >= 3 &&
      parts.every((part) =>
        /^[a-zA-Z0-9_-]+(?:[ .][a-zA-Z0-9_-]+)*$/.test(part),
      ),
    "Unsafe data path",
  );
  assert(
    !parts
      .slice(2)
      .some((part) =>
        /^(?:data|worlds|systems|modules|users|home|homes)$/i.test(part),
      ),
    "Data path points to a protected or overly broad directory",
  );
  const url = new URL(profile.url);
  assert(
    ["http:", "https:"].includes(url.protocol) &&
      !url.username &&
      !url.password &&
      !url.search &&
      !url.hash &&
      url.pathname === "/",
    "Require an instance origin without credentials",
  );
  assert.equal(
    url.hostname.toLowerCase(),
    parts[0].toLowerCase(),
    "SMB and HTTP must identify the same host",
  );
  const target = path.win32.join(value, "Data", "modules", moduleId);
  assert.equal(
    target,
    profile.modulePath,
    "Module path must exactly match the configured data root",
  );
  return { ...profile, target };
}

export async function assertPlainDirectory(directory) {
  const stat = await lstat(directory);
  assert(
    stat.isDirectory() && !stat.isSymbolicLink(),
    "Refusing a linked or non-directory target",
  );
  assert.equal(
    path.resolve(await realpath(directory)).toLowerCase(),
    path.resolve(directory).toLowerCase(),
    "Resolved directory differs from configured target",
  );
}

export async function directoryHashes(directory) {
  await assertPlainDirectory(directory);
  const result = {};
  for (const file of await files(directory)) {
    const key = path.relative(directory, file).split(path.sep).join("/");
    safeRelative(key);
    result[key] = digest(await readFile(file));
  }
  return result;
}

export async function validateBuild(base = root) {
  assert.equal(
    git("status", "--porcelain"),
    "",
    "Deployment requires a clean worktree",
  );
  const build = await json(path.join(base, ".build/build.json"));
  const verified = await json(path.join(base, ".build/verified.json"));
  assert.equal(build.dirty, false, "Build was produced from dirty sources");
  assert.equal(build.commit, git("rev-parse", "HEAD"), "Build is stale");
  assert.deepEqual(
    verified,
    { commit: build.commit, sha256: build.sha256, dirty: false },
    "Run verify on the clean committed sources",
  );
  assert.deepEqual(
    await directoryHashes(path.join(base, "dist")),
    build.files,
    "dist differs from the verified build",
  );
  const archive = await readFile(path.join(base, `.build/${moduleId}.zip`));
  assert.equal(
    digest(archive),
    build.sha256,
    "Archive differs from verified build",
  );
  const expected = {};
  for (const name of Object.keys(build.files)) {
    safeRelative(name);
    expected[name] = await readFile(path.join(base, "dist", name));
  }
  validateArchive(archive, expected);
  return build;
}

async function loadProfile() {
  const file = path.join(root, ".local/remote.json");
  if (process.env.FVTT_DISABLE_REMOTE === "1" || !(await exists(file)))
    throw new Error(
      "Remote workflow is not configured. See docs/REMOTE_TESTING.md.",
    );
  assert.equal(process.platform, "win32", "SMB adapter requires Windows");
  const profile = resolveProfile(await json(file));
  // Check every component from the share root to the final modules parent.
  const pieces = profile.dataPath.slice(2).split("\\");
  let current = `\\\\${pieces[0]}\\${pieces[1]}\\`;
  await assertPlainDirectory(current);
  for (const part of [...pieces.slice(2), "Data", "modules"]) {
    current = path.join(current, part);
    await assertPlainDirectory(current);
  }
  const worldRoot = path.join(profile.dataPath, "Data", "worlds");
  await assertPlainDirectory(worldRoot);
  await assertPlainDirectory(path.join(worldRoot, profile.world));
  const world = await json(path.join(worldRoot, profile.world, "world.json"));
  assert.equal(world.id, profile.world, "Test world marker mismatch");
  assert.equal(world.system, "pf1", "Test world is not PF1");
  const target = await json(path.join(root, "config/compatibility.json"));
  assert.equal(
    world.coreVersion,
    target.target.foundry,
    "Test-world core version changed",
  );
  const systemRoot = path.join(profile.dataPath, "Data", "systems");
  await assertPlainDirectory(systemRoot);
  await assertPlainDirectory(path.join(systemRoot, "pf1"));
  const system = await json(path.join(systemRoot, "pf1", "system.json"));
  assert.equal(system.id, "pf1");
  assert.equal(
    system.version,
    target.target.pf1,
    "Installed PF1 version changed",
  );
  const frameworkPath = path.join(
    profile.dataPath,
    "Data",
    "modules",
    "pf1spheres",
  );
  await assertPlainDirectory(frameworkPath);
  const framework = await json(path.join(frameworkPath, "module.json"));
  assert.equal(framework.id, "pf1spheres", "Wrong framework module");
  assert.equal(
    framework.version,
    target.target.pf1spheres,
    "Installed Spheres framework version changed",
  );
  return profile;
}

export async function checkSetup(origin, requireSetup = true) {
  // Only HTTP reads; never log bodies, cookies, credentials, or the private URL.
  let location = new URL(origin);
  let landed = false;
  for (let redirects = 0; redirects < 5; redirects++) {
    const response = await fetch(location, {
      redirect: "manual",
      signal: AbortSignal.timeout(10000),
    });
    await response.body?.cancel();
    if ([301, 302, 303, 307, 308].includes(response.status)) {
      assert(response.headers.get("location"), "Missing redirect destination");
      location = new URL(response.headers.get("location"), location);
      assert.equal(
        location.origin,
        new URL(origin).origin,
        "Unexpected instance redirect",
      );
      continue;
    }
    assert.equal(response.status, 200, "Instance unavailable");
    landed = true;
    break;
  }
  assert(landed, "Too many instance redirects");
  if (requireSetup)
    assert(
      ["/setup", "/auth"].includes(location.pathname),
      "Return the instance to Setup before deployment",
    );
  return location.pathname;
}

export async function swapStaged({ stage, target, backup, move = rename }) {
  await assertPlainDirectory(stage);
  const hadTarget = await exists(target);
  if (hadTarget) {
    await assertPlainDirectory(target);
    assert(!(await exists(backup)), "Backup already exists");
    await move(target, backup);
  }
  try {
    await move(stage, target);
  } catch (error) {
    if (hadTarget) await move(backup, target);
    throw error;
  }
  return hadTarget;
}

export async function deployRemote(dryRun = false) {
  const profile = await loadProfile();
  const build = await validateBuild();
  await checkSetup(profile.url);
  const current = (await exists(profile.target))
    ? await directoryHashes(profile.target)
    : {};
  if (await exists(profile.target))
    assert.equal(
      (await json(path.join(profile.target, "module.json"))).id,
      moduleId,
      "Existing module identity mismatch",
    );
  const changes = [
    ...new Set([...Object.keys(current), ...Object.keys(build.files)]),
  ]
    .sort()
    .filter((name) => current[name] !== build.files[name]);
  const operations = path.join(profile.dataPath, "Data", `.${moduleId}-deploy`);
  if (await exists(operations)) {
    await assertPlainDirectory(operations);
    assert(
      !(await exists(path.join(operations, "deploy.lock"))),
      "Deployment lock exists; reconcile prior transfer first",
    );
    const retained = (await readdir(operations)).filter((name) =>
      name.startsWith("backup-"),
    );
    assert(
      retained.length < 5,
      "Five rollback copies retained; review retention before another deployment",
    );
  }
  console.log(
    `Profile: ${profile.profile}; target: <configured-data>/Data/modules/${moduleId}`,
  );
  console.log(`Source commit: ${build.commit}; version: ${build.version}`);
  console.log(
    `${dryRun ? "Dry run" : "Deployment"}: ${changes.length} changed files`,
  );
  for (const name of changes) console.log(`  ${name}`);
  if (dryRun) return;
  if (!changes.length) {
    console.log("Installed bytes already match; no remote write.");
    return;
  }
  if (!(await exists(operations))) await mkdir(operations);
  await assertPlainDirectory(operations);
  const lock = path.join(operations, "deploy.lock");
  await writeFile(lock, build.commit, { flag: "wx" });
  const suffix = `${new Date().toISOString().replace(/[:.]/g, "-")}-${randomUUID()}`;
  const stage = path.join(operations, `stage-${suffix}`);
  const backup = path.join(operations, `backup-${suffix}`);
  try {
    await mkdir(stage);
    for (const name of Object.keys(build.files)) {
      safeRelative(name);
      const dest = path.join(stage, name);
      assert(
        path.relative(stage, dest) &&
          !path.relative(stage, dest).startsWith(".."),
        "Staging escaped target",
      );
      await mkdir(path.dirname(dest), { recursive: true });
      await copyFile(path.join(root, "dist", name), dest);
    }
    assert.deepEqual(
      await directoryHashes(stage),
      build.files,
      "Staged bytes differ from build",
    );
    assert.equal((await json(path.join(stage, "module.json"))).id, moduleId);
    await checkSetup(profile.url);
    await assertPlainDirectory(path.dirname(profile.target));
    const observed = (await exists(profile.target))
      ? await directoryHashes(profile.target)
      : {};
    assert.deepEqual(
      observed,
      current,
      "Installed module changed during staging",
    );
    const hadTarget = await swapStaged({
      stage,
      target: profile.target,
      backup,
    });
    assert.deepEqual(
      await directoryHashes(profile.target),
      build.files,
      "Installed byte verification failed; backup retained",
    );
    await writeFile(
      path.join(root, ".local/deployment.json"),
      JSON.stringify(
        {
          profile: profile.profile,
          commit: build.commit,
          version: build.version,
          sha256: build.sha256,
          files: build.files,
          deployedAt: new Date().toISOString(),
          backup: hadTarget ? backup : null,
        },
        null,
        2,
      ) + "\n",
    );
    console.log(
      "Deployment verified; receipt saved locally. No host or world restart performed.",
    );
  } finally {
    await unlink(lock);
  }
}

export async function auditPackCopy(source, workspace, expected) {
  const before = await directoryHashes(source);
  await mkdir(workspace, { recursive: true });
  const snapshot = path.join(workspace, "database");
  await mkdir(snapshot);
  for (const name of Object.keys(before)) {
    assert(
      /^(?:[0-9]+\.(?:ldb|log)|CURRENT|MANIFEST-[0-9]+|LOG(?:\.old)?|LOCK)$/.test(
        name,
      ),
      "Unexpected pack file",
    );
    await copyFile(path.join(source, name), path.join(snapshot, name));
  }
  assert.deepEqual(
    await directoryHashes(snapshot),
    before,
    "Pack copy changed during transfer",
  );
  assert.deepEqual(
    await directoryHashes(source),
    before,
    "Pack changed during audit; return to Setup and retry",
  );
  const output = path.join(workspace, "documents");
  // Opening LevelDB can write operational metadata. Open only this local copy.
  await extractPack(snapshot, output, {
    transformName: (doc) => {
      assert(/^[a-zA-Z0-9]{16}$/.test(doc._id), "Unsafe installed document ID");
      return `${doc._id}.json`;
    },
  });
  const actual = {};
  for (const file of await files(output))
    actual[path.basename(file)] = await json(file);
  assert.deepEqual(
    actual,
    expected,
    "Installed pack documents differ from deployed canonical sources",
  );
  assert.deepEqual(
    await directoryHashes(source),
    before,
    "Pack changed during audit",
  );
}

export async function smokeRemote(semantic = false) {
  const profile = await loadProfile();
  const receipt = await json(path.join(root, ".local/deployment.json"));
  assert.equal(receipt.profile, profile.profile);
  const route = await checkSetup(profile.url, semantic);
  const content = JSON.parse(
    git("show", `${receipt.commit}:config/content.json`),
  );
  for (const asset of content.externalAssets ?? []) {
    safeRelative(asset.path);
    assert(
      /^(icons\/|systems\/pf1\/icons\/)/.test(asset.path),
      "Unreviewed external asset target",
    );
    const response = await fetch(new URL(asset.path, `${profile.url}/`), {
      redirect: "error",
    });
    assert(
      response.ok,
      `Required core/system image unavailable: ${asset.path}`,
    );
    assert.equal(
      digest(Buffer.from(await response.arrayBuffer())),
      asset.sha256,
      `Referenced image changed: ${asset.path}`,
    );
  }
  const installed = await directoryHashes(profile.target);
  if (!semantic)
    assert.deepEqual(
      installed,
      receipt.files,
      "Installed bytes differ from deployment receipt; after Foundry opens packs, return to Setup and use --semantic",
    );
  else {
    assert(/^[a-f0-9]{40}$/.test(receipt.commit), "Invalid receipt commit");
    const manifestText = git("show", `${receipt.commit}:module.json`);
    assert.equal(
      digest(Buffer.from(manifestText + "\n")),
      receipt.files["module.json"],
      "Receipt manifest does not match deployed commit",
    );
    const manifest = JSON.parse(manifestText);
    const isPack = (name) =>
      manifest.packs.some((pack) => name.startsWith(`${pack.path}/`));
    const nonPacks = (hashes) =>
      Object.fromEntries(
        Object.entries(hashes).filter(([name]) => !isPack(name)),
      );
    assert.deepEqual(
      nonPacks(installed),
      nonPacks(receipt.files),
      "Installed non-pack bytes differ from receipt",
    );
    const auditRoot = path.join(root, ".local", "pack-audits", randomUUID());
    for (const pack of manifest.packs) {
      safeRelative(pack.path);
      safeRelative(pack.name);
      const sources = git(
        "ls-tree",
        "-r",
        "--name-only",
        receipt.commit,
        `src/packs/${pack.name}`,
      )
        .split("\n")
        .filter(Boolean);
      const expected = {};
      for (const file of sources) {
        assert(file.endsWith(".json"), "Unexpected canonical source format");
        const doc = JSON.parse(git("show", `${receipt.commit}:${file}`));
        assert(!expected[`${doc._id}.json`], "Duplicate canonical ID");
        expected[`${doc._id}.json`] = doc;
      }
      await auditPackCopy(
        path.join(profile.target, pack.path),
        path.join(auditRoot, pack.name),
        expected,
      );
    }
    await checkSetup(profile.url);
    console.log(
      "Pack documents match deployed canonical sources; operational LevelDB files were checked through local copies only.",
    );
  }
  assert.equal(
    (await json(path.join(profile.target, "module.json"))).id,
    moduleId,
  );
  console.log(
    `Remote ${semantic ? "content audit" : "package hashes"} and PF1 test-world marker passed; route ${route}; commit ${receipt.commit}.`,
  );
  console.log(
    "Enable/disable/reload and console/log checks require Foundry UI acceptance.",
  );
}
