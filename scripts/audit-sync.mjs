import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { files, moduleId } from "./lib.mjs";
const rows = (await readFile("research/intake/entities.jsonl", "utf8"))
  .trim()
  .split("\n")
  .filter(Boolean)
  .map((l) => JSON.parse(l));
const plan = JSON.parse(
  await readFile("research/intake/promotion-plan.json", "utf8"),
).entries;
const docs = [];
for (const file of await files("src/packs")) {
  if (!file.endsWith(".json")) continue;
  const doc = JSON.parse(await readFile(file, "utf8"));
  docs.push({
    file: file.split(path.sep).join("/"),
    pack: file.split(path.sep)[2],
    doc,
  });
}
const byId = new Map(docs.map((d) => [d.doc._id, d]));
const byKey = new Map(
  docs.map((d) => [
    d.doc.flags[moduleId].intake?.auditKey ?? d.doc.flags[moduleId].sourceKey,
    d,
  ]),
);
for (const p of plan.filter((p) => p.state === "existing-preserved"))
  if (byId.has(p.id)) byKey.set(p.sourceKey, byId.get(p.id));
for (const p of plan.filter((p) => p.state === "duplicate"))
  if (byKey.has(p.canonicalKey))
    byKey.set(p.sourceKey, byKey.get(p.canonicalKey));
const ref = (d) => ({
  id: d.doc._id,
  pack: d.pack,
  uuid: `Compendium.${moduleId}.${d.pack}.Item.${d.doc._id}`,
  file: d.file,
});
const planned = new Map(plan.map((p) => [p.sourceKey, p]));
for (const e of rows) {
  const p = planned.get(e.sourceKey);
  e.intake = p
    ? { state: p.state, reason: p.reason ?? null }
    : { state: "unplanned" };
  const d = byKey.get(e.sourceKey);
  if (d) {
    e.canonical = ref(d);
    e.sourceChanged = d.doc.flags[moduleId].sourceSha256 !== e.pageSha256;
    const saved = d.doc.flags[moduleId].audit ?? {};
    if (!e.sourceChanged)
      for (const [f, state] of Object.entries(saved))
        if (e.audit[f]) e.audit[f].state = state;
    e.audit.image.state = d.doc.img.startsWith(`modules/${moduleId}/`)
      ? "implemented"
      : (saved.image ?? "needs-review");
    if (!e.sourceChanged) e.audit.rights.state = "implemented";
  }
  if (e.classPlan)
    for (const row of e.classPlan)
      for (const f of row.features)
        f.documents = f.candidates
          .filter((k) => byKey.has(k))
          .map((k) => ref(byKey.get(k)));
}
await writeFile(
  "research/intake/entities.jsonl",
  rows.map((e) => JSON.stringify(e)).join("\n") + "\n",
);
const summary = JSON.parse(
  await readFile("research/intake/summary.json", "utf8"),
);
summary.canonicalDocuments = docs.length;
summary.packCounts = Object.fromEntries(
  [...new Set(docs.map((d) => d.pack))]
    .sort()
    .map((p) => [p, docs.filter((d) => d.pack === p).length]),
);
summary.mappedCandidates = rows.filter((e) => e.canonical).length;
summary.holdReasons = Object.fromEntries(
  [...new Set(plan.filter((p) => p.state === "held").map((p) => p.reason))]
    .sort()
    .map((r) => [r, plan.filter((p) => p.reason === r).length]),
);
await writeFile(
  "research/intake/summary.json",
  JSON.stringify(summary, null, 2) + "\n",
);
console.log(
  JSON.stringify({
    canonical: docs.length,
    mappedCandidates: summary.mappedCandidates,
    packCounts: summary.packCounts,
  }),
);
