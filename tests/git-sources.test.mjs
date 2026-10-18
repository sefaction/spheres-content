import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { mkdtemp, mkdir, writeFile, unlink, realpath } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { test } from "node:test";
import {
  decodeGitBlobs,
  readCommittedPackSources,
} from "../scripts/git-sources.mjs";

async function fixture() {
  const cwd = await realpath(
    await mkdtemp(path.join(os.tmpdir(), "spheres-git-sources-")),
  );
  const git = (...args) =>
    execFileSync(
      "git",
      [
        "-c",
        `safe.directory=${cwd.replaceAll("\\", "/")}`,
        "-c",
        "user.name=Source Audit Test",
        "-c",
        "user.email=source-audit@example.invalid",
        ...args,
      ],
      { cwd, encoding: "utf8" },
    ).trim();
  git("init", "--quiet");
  git("config", "core.autocrlf", "false");
  const put = async (file, value) => {
    await mkdir(path.dirname(path.join(cwd, file)), { recursive: true });
    await writeFile(
      path.join(cwd, file),
      typeof value === "string" ? value : JSON.stringify(value, null, 2) + "\n",
    );
  };
  const commit = () => {
    git("add", ".");
    git("commit", "--quiet", "-m", "Source fixture");
    return git("rev-parse", "HEAD");
  };
  return { cwd, git, put, commit };
}

test("committed pack reads preserve full UTF-8 documents and ignore later commits and dirty files", async () => {
  const f = await fixture();
  const item = {
    _id: "1234567890abcdef",
    name: "Café 雪",
    system: { description: { value: "First line\nSecond line" } },
  };
  const folder = {
    _id: "fedcba0987654321",
    name: "Folder",
    _key: "!folders!fedcba0987654321",
  };
  const feat = { _id: "abcdef1234567890", name: "Original feat", type: "feat" };
  const itemFile = 'src/packs/items/nested/quoted "name" 雪.json';
  // Double quotes are not legal Windows filenames. Spaces and non-ASCII names
  // still exercise Git's NUL-delimited path handling on every supported runner.
  const portableItemFile =
    process.platform === "win32"
      ? "src/packs/items/nested/name 雪.json"
      : itemFile;
  await f.put(portableItemFile, item);
  await f.put("src/packs/items/folder.json", folder);
  await f.put("src/packs/feats/a.json", feat);
  await f.put("src/packs/README.md", "Not a pack document");
  await f.put(
    "src/packs/unrequested/not-json.txt",
    "Outside the selected packs",
  );
  const original = f.commit();
  const expected = {
    items: { "1234567890abcdef.json": item, "fedcba0987654321.json": folder },
    feats: { "abcdef1234567890.json": feat },
  };
  assert.deepEqual(
    readCommittedPackSources(original, ["items", "feats"], f),
    expected,
  );
  await f.put(portableItemFile, { ...item, name: "Later committed item" });
  const later = f.commit();
  await f.put(portableItemFile, { ...item, name: "Uncommitted change" });
  await f.put("src/packs/items/untracked.json", {
    _id: "aaaaaaaaaaaaaaaa",
    name: "Untracked",
  });
  assert.deepEqual(
    readCommittedPackSources(original, ["items", "feats"], f),
    expected,
  );
  assert.equal(
    readCommittedPackSources(later, ["items"], f).items[`${item._id}.json`]
      .name,
    "Later committed item",
  );
});

test("committed source reads reject duplicate IDs, unexpected formats and non-file modes", async () => {
  const f = await fixture();
  const doc = { _id: "1234567890abcdef", name: "Original" };
  await f.put("src/packs/items/a.json", doc);
  await f.put("src/packs/items/b.json", doc);
  assert.throws(
    () => readCommittedPackSources(f.commit(), ["items"], f),
    /Duplicate canonical ID/,
  );
  await unlink(path.join(f.cwd, "src/packs/items/b.json"));
  await f.put("src/packs/items/notes.txt", "Unexpected source format");
  assert.throws(
    () => readCommittedPackSources(f.commit(), ["items"], f),
    /source path or format/,
  );
  await unlink(path.join(f.cwd, "src/packs/items/notes.txt"));
  f.git("add", ".");
  f.git("update-index", "--chmod=+x", "src/packs/items/a.json");
  f.git("commit", "--quiet", "-m", "Executable source must be rejected");
  assert.throws(
    () => readCommittedPackSources(f.git("rev-parse", "HEAD"), ["items"], f),
    /source mode or type/,
  );
  for (const commit of ["HEAD", "--help", "", "a".repeat(39)])
    assert.throws(
      () => readCommittedPackSources(commit, ["items"], f),
      /immutable source commit/,
    );
  for (const packs of [
    [],
    [42],
    ["../worlds"],
    ["items", "items"],
    ["items/other"],
  ])
    assert.throws(
      () => readCommittedPackSources("a".repeat(40), packs, f),
      /source pack names/,
    );
});

test("Git batch decoding uses byte lengths and rejects wrong, incomplete or extra objects", () => {
  const oid = "a".repeat(40),
    other = "b".repeat(40);
  const body = Buffer.from('{"name":"Café 雪"}\n', "utf8");
  const framed = Buffer.concat([
    Buffer.from(`${oid} blob ${body.length}\n`),
    body,
    Buffer.from("\n"),
  ]);
  assert.deepEqual(decodeGitBlobs(framed, [oid]), [body]);
  assert.throws(
    () => decodeGitBlobs(framed, [other]),
    /Unexpected Git batch object/,
  );
  assert.throws(
    () => decodeGitBlobs(Buffer.from(`${oid} missing\n`), [oid]),
    /Unexpected Git batch object/,
  );
  assert.throws(
    () => decodeGitBlobs(Buffer.from(`${oid} tree 0\n\n`), [oid]),
    /Unexpected Git batch object/,
  );
  assert.throws(
    () => decodeGitBlobs(Buffer.from(oid), [oid]),
    /Truncated Git batch header/,
  );
  assert.throws(
    () => decodeGitBlobs(framed.subarray(0, -1), [oid]),
    /Truncated Git blob/,
  );
  assert.throws(
    () => decodeGitBlobs(Buffer.concat([framed, framed]), [oid]),
    /trailing Git batch data/,
  );
  assert.throws(
    () =>
      decodeGitBlobs(Buffer.from(`${oid} blob 9007199254740992\n\n`), [oid]),
    /Invalid Git blob size/,
  );
});
