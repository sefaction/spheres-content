import assert from "node:assert/strict";
import { test } from "node:test";
import { mkdtemp, mkdir, writeFile, readFile } from "node:fs/promises";
import path from "node:path";
import os from "node:os";
import {
  resolveProfile,
  swapStaged,
  directoryHashes,
} from "../scripts/remote.mjs";

const profile = {
  profile: "spheres-test",
  transport: "smb",
  moduleId: "additional-spheres-content",
  world: "additional-spheres-content-test",
  dataPath: "\\\\test-host\\test-share\\instance",
  modulePath:
    "\\\\test-host\\test-share\\instance\\Data\\modules\\additional-spheres-content",
  url: "http://test-host:30001",
};

test("SMB profile rejects wrong worlds, broad targets, traversal, and mismatched hosts", () => {
  assert.equal(resolveProfile(profile).target, profile.modulePath);
  for (const dataPath of [
    "",
    "C:\\",
    "\\\\host\\share",
    "\\\\host\\share\\..",
    "\\\\test-host\\test-share\\Data",
    "\\\\test-host\\test-share\\instance\\Data\\worlds",
    "\\\\host\\share\\%USERPROFILE%",
    "\\\\host\\share\\name.",
  ])
    assert.throws(() => resolveProfile({ ...profile, dataPath }));
  for (const override of [
    { world: "campaign" },
    { moduleId: "pf1" },
    { modulePath: "\\\\test-host\\test-share\\instance\\Data\\worlds" },
    { url: "http://another-host:30001" },
    { url: "http://user:secret@test-host:30001" },
  ])
    assert.throws(() => resolveProfile({ ...profile, ...override }));
});

async function fixture() {
  const base = await mkdtemp(path.join(os.tmpdir(), "spheres-swap-test-"));
  const stage = path.join(base, "stage");
  const target = path.join(base, "additional-spheres-content");
  const backup = path.join(base, "backup");
  await mkdir(stage);
  await mkdir(target);
  await writeFile(path.join(stage, "module.json"), "new");
  await writeFile(path.join(target, "module.json"), "old");
  return { stage, target, backup };
}

test("staged replacement preserves the previous module bytes", async () => {
  const input = await fixture();
  await swapStaged(input);
  assert.equal(
    await readFile(path.join(input.target, "module.json"), "utf8"),
    "new",
  );
  assert.equal(
    await readFile(path.join(input.backup, "module.json"), "utf8"),
    "old",
  );
  assert.notDeepEqual(
    await directoryHashes(input.target),
    await directoryHashes(input.backup),
  );
});

test("failed staging rename restores the original module", async () => {
  const input = await fixture();
  const { rename } = await import("node:fs/promises");
  await assert.rejects(
    swapStaged({
      ...input,
      move: async (from, to) => {
        if (from === input.stage) throw new Error("Simulated network failure");
        await rename(from, to);
      },
    }),
    /Simulated/,
  );
  assert.equal(
    await readFile(path.join(input.target, "module.json"), "utf8"),
    "old",
  );
  assert.equal(
    await readFile(path.join(input.stage, "module.json"), "utf8"),
    "new",
  );
});
