import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { root } from "./lib.mjs";

const oidPattern = /^[a-f0-9]{40}$/;
const packPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const maxBuffer = 256 * 1024 * 1024;

// Git reports blob sizes in bytes, including for UTF-8 documents. Do not split
// the body on newlines: descriptions and JSON formatting may contain them.
export function decodeGitBlobs(buffer, objectIds) {
  const bodies = [];
  let offset = 0;
  for (const oid of objectIds) {
    assert(oidPattern.test(oid), "Invalid source object ID");
    const end = buffer.indexOf(10, offset);
    assert(end >= offset, "Truncated Git batch header");
    const header = buffer.subarray(offset, end).toString("ascii");
    const match = /^([a-f0-9]{40}) blob (0|[1-9][0-9]*)$/.exec(header);
    assert(match && match[1] === oid, "Unexpected Git batch object");
    const size = Number(match[2]);
    assert(Number.isSafeInteger(size), "Invalid Git blob size");
    const bodyStart = end + 1;
    const bodyEnd = bodyStart + size;
    assert(
      bodyEnd < buffer.length && buffer[bodyEnd] === 10,
      "Truncated Git blob or missing terminator",
    );
    bodies.push(buffer.subarray(bodyStart, bodyEnd));
    offset = bodyEnd + 1;
  }
  assert.equal(offset, buffer.length, "Unexpected trailing Git batch data");
  return bodies;
}

export function readCommittedPackSources(
  commit,
  packNames,
  { cwd = root } = {},
) {
  assert(oidPattern.test(commit), "Require an immutable source commit");
  assert(
    Array.isArray(packNames) &&
      packNames.length > 0 &&
      packNames.every(
        (name) => typeof name === "string" && packPattern.test(name),
      ) &&
      new Set(packNames).size === packNames.length,
    "Invalid or duplicate source pack names",
  );
  const git = (args, input) =>
    execFileSync("git", args, { cwd, input, maxBuffer });
  const paths = packNames.map((name) => `src/packs/${name}`);
  const listing = git([
    "ls-tree",
    "-rz",
    "--full-tree",
    commit,
    "--",
    ...paths,
  ]).toString("utf8");
  const entries = listing
    .split("\0")
    .filter(Boolean)
    .map((line) => {
      const match = /^100644 blob ([a-f0-9]{40})\t(.+)$/.exec(line);
      assert(match, "Unexpected canonical source mode or type");
      const [, oid, file] = match;
      const pack = packNames.find((name) =>
        file.startsWith(`src/packs/${name}/`),
      );
      assert(
        pack && file.endsWith(".json"),
        "Unexpected canonical source path or format",
      );
      return { oid, file, pack };
    });
  const bodies = entries.length
    ? decodeGitBlobs(
        git(
          ["cat-file", "--batch"],
          entries.map(({ oid }) => oid).join("\n") + "\n",
        ),
        entries.map(({ oid }) => oid),
      )
    : [];
  const packs = Object.fromEntries(packNames.map((name) => [name, {}]));
  for (let i = 0; i < entries.length; i++) {
    const doc = JSON.parse(bodies[i].toString("utf8"));
    assert(/^[a-zA-Z0-9]{16}$/.test(doc._id), "Invalid canonical document ID");
    const expected = packs[entries[i].pack];
    const name = `${doc._id}.json`;
    assert(!Object.hasOwn(expected, name), "Duplicate canonical ID");
    expected[name] = doc;
  }
  return packs;
}
