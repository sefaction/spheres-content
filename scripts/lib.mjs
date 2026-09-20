import assert from "node:assert/strict";
import { readdir, readFile, lstat, realpath, rm } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { unzipSync } from "fflate";

export const root = fileURLToPath(new URL("../", import.meta.url));
export const moduleId = "additional-spheres-content";
export const json = async (file) => JSON.parse(await readFile(file, "utf8"));

export function safeRelative(value) {
  assert(typeof value === "string" && value.length > 0, "Empty path");
  assert(!value.includes("\\") && !value.includes(":"), "Nonportable path");
  assert(
    !value.startsWith("/") && !value.includes("\0"),
    "Absolute/invalid path",
  );
  assert(
    value.split("/").every((part) => part && part !== "." && part !== ".."),
    "Unsafe path component",
  );
  return value;
}

export async function files(directory) {
  const result = [];
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const full = path.join(directory, entry.name);
    assert(
      !entry.isSymbolicLink(),
      "Symlinks are not supported in build inputs or outputs",
    );
    if (entry.isDirectory()) result.push(...(await files(full)));
    else if (entry.isFile()) result.push(full);
    else throw new Error("Unsupported filesystem entry");
  }
  return result.sort();
}

export async function cleanOutput(name) {
  assert(
    ["dist", ".build"].includes(name),
    "Cleanup target is not generated output",
  );
  const base = await realpath(root);
  const target = path.resolve(base, name);
  assert(path.dirname(target) === base, "Cleanup escaped workspace");
  const stat = await lstat(target).catch((error) => {
    if (error.code !== "ENOENT") throw error;
    return null;
  });
  if (!stat) return;
  assert(stat.isDirectory() && !stat.isSymbolicLink(), "Unsafe cleanup target");
  assert((await realpath(target)) === target, "Redirected cleanup target");
  await files(target); // Reject nested links before recursive deletion.
  await rm(target, { recursive: true });
}

export function validateManifest(manifest, pkg, compatibility) {
  assert.equal(manifest.id, moduleId);
  assert.equal(manifest.version, pkg.version);
  assert(
    /^\d+\.\d+\.\d+(?:-[a-z0-9.]+)?$/.test(manifest.version),
    "Invalid module version",
  );
  assert(manifest.title && manifest.description && manifest.authors?.length);
  assert.equal(manifest.url, "https://github.com/sefaction/spheres-content");
  assert.equal(manifest.bugs, `${manifest.url}/issues`);
  assert.deepEqual(manifest.relationships, {
    systems: [{ id: "pf1", type: "system" }],
  });
  assert(Array.isArray(manifest.packs));
  // The bootstrap has no test evidence and must not advertise compatibility or releases.
  assert.equal(
    compatibility.tested,
    null,
    "Add evidence validation with the first tested compatibility profile",
  );
  assert.deepEqual(
    manifest.compatibility,
    {},
    "Untested compatibility claims are prohibited",
  );
  assert(
    !manifest.manifest && !manifest.download,
    "Release URLs require an approved release workflow",
  );
  for (const name of ["readme", "changelog", "license"])
    safeRelative(manifest[name]);
}

export function validateArchive(bytes, expected) {
  const entries = unzipSync(bytes);
  assert.deepEqual(
    Object.keys(entries).sort(),
    Object.keys(expected).sort(),
    "Archive file allowlist mismatch",
  );
  assert(entries["module.json"], "Archive must have module.json at its root");
  for (const [name, data] of Object.entries(entries)) {
    safeRelative(name);
    assert(
      Buffer.from(data).equals(Buffer.from(expected[name])),
      `Archive content mismatch: ${name}`,
    );
  }
  return entries;
}
