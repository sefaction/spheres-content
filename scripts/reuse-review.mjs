import assert from "node:assert/strict";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { readFile, writeFile } from "node:fs/promises";
import { sha256 } from "./wiki-crawl.mjs";
import { slug } from "./wiki-extract.mjs";

export function nameTokens(name) {
  return slug(name).split("-").filter(Boolean).sort().join(" ");
}

export function findReuseCandidates(name, entries) {
  const exact = slug(name);
  const reordered = nameTokens(name);
  return entries
    .filter(
      (entry) =>
        slug(entry.name) === exact || nameTokens(entry.name) === reordered,
    )
    .map((entry) => ({
      ...entry,
      match: slug(entry.name) === exact ? "normalized-name" : "reordered-name",
    }))
    .sort((a, b) => a.uuid.localeCompare(b.uuid));
}

export function validateReviewOutput(review, doc) {
  assert(review?.output, "Missing physical-item output review");
  assert.equal(doc._id, review.output.id, "Reviewed physical identity changed");
  assert.equal(doc.type, review.output.type, "Reviewed physical type changed");
  assert.equal(
    sha256(JSON.stringify(doc)),
    review.output.sha256,
    "Reviewed physical content changed",
  );
  const meta = doc.flags["additional-spheres-content"];
  const selected =
    review.candidates.find((c) => c.uuid === review.output.sourceUuid) ??
    (review.adaptationSource?.uuid === review.output.sourceUuid
      ? review.adaptationSource
      : undefined);
  assert(selected?.decision === "adapt", "Unapproved reuse candidate");
  assert.equal(meta.reuse.sourceUuid, selected.uuid);
  assert.equal(meta.reuse.sourceSha256, selected.sha256);
  assert.equal(meta.reuse.sourceVersion, selected.version);
  assert.equal(meta.descriptionSha256, review.descriptionSha256);
  assert.equal(meta.sourceSha256, review.pageSha256);
}

export async function readReuseDocument(
  index,
  candidate,
  cache = ".local/reuse-index",
) {
  const pack = index.packs.find(
    (p) => p.provider === candidate.provider && p.pack === candidate.pack,
  );
  assert(
    pack && pack.version === candidate.version,
    "Reuse package snapshot mismatch",
  );
  assert(/^[a-f0-9]{64}$/.test(pack.fingerprint), "Invalid reuse fingerprint");
  const id = candidate.uuid.split(".").at(-1);
  for (const part of [candidate.provider, candidate.pack, id])
    assert(/^[a-zA-Z0-9_-]+$/.test(part), "Unsafe reuse identity");
  const base = path.join(
    cache,
    candidate.provider,
    candidate.pack,
    pack.fingerprint,
  );
  const complete = JSON.parse(
    await readFile(path.join(base, "complete.json"), "utf8"),
  );
  assert.equal(
    complete.fingerprint,
    pack.fingerprint,
    "Incomplete reuse snapshot",
  );
  assert(/^[a-f0-9-]{36}$/.test(complete.run), "Unsafe reuse run");
  const doc = JSON.parse(
    await readFile(
      path.join(base, complete.run, "documents", `${id}.json`),
      "utf8",
    ),
  );
  assert.equal(doc._id, id, "Reuse document identity mismatch");
  assert.equal(
    sha256(JSON.stringify(doc)),
    candidate.sha256,
    "Reuse document snapshot changed",
  );
  return doc;
}

export function reviewIsCurrent(review, entity, candidates) {
  return Boolean(
    review &&
    review.descriptionSha256 === entity.descriptionSha256 &&
    review.pageSha256 === entity.pageSha256 &&
    review.candidates.length === candidates.length &&
    review.candidates.every((old) =>
      candidates.some(
        (now) =>
          now.uuid === old.uuid &&
          now.sha256 === old.sha256 &&
          now.version === old.version,
      ),
    ),
  );
}

export async function physicalReviewReport() {
  const index = JSON.parse(
    await readFile(".local/reuse-index/index.json", "utf8"),
  );
  const reviews = JSON.parse(
    await readFile("config/physical-item-reviews.json", "utf8"),
  );
  const entities = (await readFile("research/intake/entities.jsonl", "utf8"))
    .trim()
    .split("\n")
    .map(JSON.parse);
  const byTokens = new Map();
  for (const entry of index.entries) {
    const key = nameTokens(entry.name);
    if (!byTokens.has(key)) byTokens.set(key, []);
    byTokens.get(key).push(entry);
  }
  const rows = [];
  for (const entity of entities.filter(
    (e) => e.kind === "item" && !e.legacy && e.intake.state !== "duplicate",
  )) {
    const candidates = findReuseCandidates(
      entity.name,
      byTokens.get(nameTokens(entity.name)) ?? [],
    );
    const review = reviews[entity.sourceKey];
    rows.push({
      sourceKey: entity.sourceKey,
      name: entity.name,
      url: entity.url,
      pageSha256: entity.pageSha256,
      descriptionSha256: entity.descriptionSha256,
      canonical: entity.canonical ?? null,
      intake: entity.intake,
      review: !review
        ? "needs-review"
        : reviewIsCurrent(review, entity, candidates)
          ? "reviewed"
          : "stale",
      decision: review?.decision ?? null,
      candidates: candidates.map((c) => ({
        name: c.name,
        uuid: c.uuid,
        provider: c.provider,
        version: c.version,
        sha256: c.sha256,
        match: c.match,
        type: c.type,
        img: c.img,
        hasDescription: c.hasDescription,
        physical: [
          "loot",
          "equipment",
          "weapon",
          "consumable",
          "container",
        ].includes(c.type),
        decision: reviewIsCurrent(review, entity, candidates)
          ? (review.candidates.find((r) => r.uuid === c.uuid)?.decision ?? null)
          : null,
      })),
    });
  }
  return {
    schemaVersion: 1,
    scope:
      "Current wiki physical candidates, including holds; source snapshots only, no world-owned packs. Candidate matches are not reuse approval.",
    summary: {
      entries: rows.length,
      withCandidates: rows.filter((r) => r.candidates.length).length,
      reviewed: rows.filter((r) => r.review === "reviewed").length,
      stale: rows.filter((r) => r.review === "stale").length,
      unavailablePacks: index.errors.length,
    },
    entries: rows,
  };
}

if (
  process.argv[1] &&
  path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)
) {
  const report = await physicalReviewReport();
  if (process.argv.includes("--write"))
    await writeFile(
      "research/physical-item-review.json",
      JSON.stringify(report, null, 2) + "\n",
    );
  const search = process.argv
    .find((a) => a.startsWith("--search="))
    ?.slice(9)
    ?.toLowerCase();
  const limit = Number(
    process.argv.find((a) => a.startsWith("--limit="))?.slice(8) ?? 20,
  );
  assert(Number.isInteger(limit) && limit > 0, "Invalid result limit");
  const rows = report.entries.filter(
    (r) =>
      (!search || r.name.toLowerCase().includes(search)) &&
      (!process.argv.includes("--matched") || r.candidates.length),
  );
  console.log(JSON.stringify(report.summary));
  for (const row of rows.slice(0, limit))
    console.log(
      process.argv.includes("--json")
        ? JSON.stringify(row)
        : `${row.name}: ${row.review}; ${row.candidates.length} candidates; ${row.intake.reason ?? row.intake.state}`,
    );
}
