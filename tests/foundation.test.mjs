import assert from "node:assert/strict";
import { test } from "node:test";
import { mkdtemp, mkdir, writeFile, readFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { zipSync, strToU8 } from "fflate";
import { compilePack, extractPack } from "@foundryvtt/foundryvtt-cli";
import {
  root,
  json,
  safeRelative,
  validateArchive,
  validateManifest,
  cleanOutput,
} from "../scripts/lib.mjs";

test("rejects traversal, absolute paths, Windows drives, and ambiguous separators", () => {
  for (const name of [
    "",
    "../worlds",
    "/",
    "C:/Data",
    "packs\\x",
    "packs//x",
    "packs/./x",
    "packs/../x",
  ])
    assert.throws(() => safeRelative(name));
  assert.equal(safeRelative("packs/feats"), "packs/feats");
});

test("cleanup cannot target source or a parent directory", async () => {
  for (const name of ["src", ".git", "../", "C:/", ""])
    await assert.rejects(cleanOutput(name));
});

test("unverified foundation cannot silently claim compatibility or release URLs", async () => {
  const manifest = await json(path.join(root, "module.json"));
  const pkg = await json(path.join(root, "package.json"));
  const compatibility = await json(
    path.join(root, "config/compatibility.json"),
  );
  validateManifest(manifest, pkg, compatibility);
  assert.throws(() =>
    validateManifest(
      { ...manifest, compatibility: { verified: "13" } },
      pkg,
      compatibility,
    ),
  );
  assert.throws(() =>
    validateManifest(
      { ...manifest, download: "https://example.com/build.zip" },
      pkg,
      compatibility,
    ),
  );
});

test("archive rejects unallowlisted files and mismatching bytes", () => {
  const expected = { "module.json": strToU8("{}") };
  validateArchive(zipSync(expected), expected);
  assert.throws(() =>
    validateArchive(
      zipSync({ ...expected, ".env": strToU8("private") }),
      expected,
    ),
  );
  assert.throws(() =>
    validateArchive(zipSync({ "module.json": strToU8("changed") }), expected),
  );
  assert.throws(() =>
    validateArchive(zipSync({ "parent/module.json": strToU8("{}") }), expected),
  );
});

test("official compiler round-trips stable IDs and document links", async () => {
  // Synthetic tooling fixture, not imported rules and not a claim of PF1 schema validity.
  const temp = await mkdtemp(path.join(os.tmpdir(), "spheres-pack-test-"));
  const src = path.join(temp, "source");
  const output = path.join(temp, "pack");
  const extracted = path.join(temp, "extracted");
  await mkdir(src);
  const doc = {
    _key: "!items!TestDocument0001",
    _id: "TestDocument0001",
    name: "Tooling fixture",
    type: "feat",
    effects: [],
    system: {
      description: {
        value:
          "@UUID[Compendium.additional-spheres-content.fixture.Item.TestDocument0001]",
      },
    },
  };
  await writeFile(path.join(src, "fixture.json"), JSON.stringify(doc));
  await compilePack(src, output);
  await extractPack(output, extracted, { transformName: () => "fixture.json" });
  assert.deepEqual(
    JSON.parse(await readFile(path.join(extracted, "fixture.json"), "utf8")),
    doc,
  );
});

test("remote and release gates return failure without configured access", () => {
  for (const args of [
    ["deploy", "--dry-run"],
    ["deploy"],
    ["smoke"],
    ["release"],
  ]) {
    const result = spawnSync(process.execPath, ["scripts/tasks.mjs", ...args], {
      cwd: root,
      encoding: "utf8",
    });
    assert.equal(result.status, 1);
    assert.match(
      result.stderr,
      /Remote workflow is not configured|Release blocked/,
    );
  }
});
