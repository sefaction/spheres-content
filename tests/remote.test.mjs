import assert from "node:assert/strict";
import { test } from "node:test";
import {
  mkdtemp,
  mkdir,
  writeFile,
  readFile,
  realpath,
} from "node:fs/promises";
import path from "node:path";
import os from "node:os";
import { createServer } from "node:http";
import { compilePack } from "@foundryvtt/foundryvtt-cli";
import {
  resolveProfile,
  swapStaged,
  directoryHashes,
  checkSetup,
  auditPackCopy,
} from "../scripts/remote.mjs";

test("semantic audit accepts LevelDB housekeeping but detects document drift without writing the source database", async () => {
  const base = await realpath(
    await mkdtemp(path.join(os.tmpdir(), "spheres-pack-audit-")),
  );
  const source = path.join(base, "source");
  const database = path.join(base, "database");
  await mkdir(source);
  const doc = {
    _id: "1234567890abcdef",
    _key: "!items!1234567890abcdef",
    name: "Test feat",
    type: "feat",
    effects: [],
  };
  await writeFile(path.join(source, "feat.json"), JSON.stringify(doc));
  await compilePack(source, database);
  await writeFile(path.join(database, "LOG"), "Operational timestamp changed");
  const before = await directoryHashes(database);
  await auditPackCopy(database, path.join(base, "valid"), {
    "1234567890abcdef.json": doc,
  });
  assert.deepEqual(await directoryHashes(database), before);
  await assert.rejects(
    auditPackCopy(database, path.join(base, "drift"), {
      "1234567890abcdef.json": { ...doc, name: "Changed feat" },
    }),
    /documents differ/,
  );
  await writeFile(path.join(database, "unexpected.js"), "unexpected");
  await assert.rejects(
    auditPackCopy(database, path.join(base, "unexpected"), {
      "1234567890abcdef.json": doc,
    }),
    /Unexpected pack file/,
  );
});

test("setup guard follows the authentication chain but rejects a running world and foreign redirects", async (context) => {
  let mode = "setup";
  const server = createServer((request, response) => {
    if (request.url === "/") {
      response.writeHead(302, {
        Location:
          mode === "foreign"
            ? "http://example.invalid/"
            : mode === "game"
              ? "/join"
              : "/setup",
      });
    } else if (request.url === "/setup")
      response.writeHead(302, { Location: "/auth" });
    else response.writeHead(200);
    response.end();
  });
  await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
  context.after(() => new Promise((resolve) => server.close(resolve)));
  const origin = `http://127.0.0.1:${server.address().port}`;
  assert.equal(await checkSetup(origin), "/auth");
  mode = "game";
  await assert.rejects(checkSetup(origin), /Return the instance to Setup/);
  assert.equal(await checkSetup(origin, false), "/join");
  mode = "foreign";
  await assert.rejects(checkSetup(origin), /Unexpected instance redirect/);
});

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
  // GitHub's Windows TEMP can use an 8.3 alias (RUNNER~1). Resolve the fixture
  // location rather than weakening the deployment guard's exact-path check.
  const base = await realpath(
    await mkdtemp(path.join(os.tmpdir(), "spheres-swap-test-")),
  );
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
