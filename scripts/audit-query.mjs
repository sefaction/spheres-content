import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { facets } from "./content-audit.mjs";
const args = Object.fromEntries(
  process.argv.slice(2).map((a) => {
    assert(/^--[a-z-]+(?:=.*)?$/.test(a), "Use --name=value");
    const at = a.indexOf("=");
    return at < 0 ? [a.slice(2), true] : [a.slice(2, at), a.slice(at + 1)];
  }),
);
assert(
  Object.keys(args).every((k) =>
    [
      "needs",
      "kind",
      "search",
      "limit",
      "json",
      "class",
      "summary",
      "imported",
      "held",
      "pack",
    ].includes(k),
  ),
  "Unknown audit filter",
);
const all = (await readFile("research/intake/entities.jsonl", "utf8"))
  .trim()
  .split("\n")
  .filter(Boolean)
  .map((l) => JSON.parse(l));
let rows = all;
if (args.imported) {
  // The source ledger retains alternate appearances; the compendium work queue
  // should show each canonical document once, preferring its direct source.
  const unique = new Map();
  for (const e of rows.filter((e) => e.canonical)) {
    const key = e.canonical.uuid;
    if (!unique.has(key) || e.intake?.state !== "duplicate") unique.set(key, e);
  }
  rows = [...unique.values()];
}
if (args.held) rows = rows.filter((e) => e.intake?.state === "held");
if (args.pack) rows = rows.filter((e) => e.canonical?.pack === args.pack);
if (args.kind) rows = rows.filter((e) => e.kind === args.kind);
if (args.search)
  rows = rows.filter((e) =>
    e.name.toLowerCase().includes(args.search.toLowerCase()),
  );
if (args.needs) {
  assert(facets.includes(args.needs), "Unknown audit facet");
  rows = rows.filter(
    (e) =>
      !["implemented", "not-needed", "not-applicable"].includes(
        e.audit[args.needs].state,
      ),
  );
}
if (args.class) {
  rows = rows.filter(
    (e) =>
      e.kind === "class" && e.name.toLowerCase() === args.class.toLowerCase(),
  );
  console.log(
    JSON.stringify(
      rows.map((e) => ({
        name: e.name,
        edition: e.edition,
        url: e.url,
        classPlan: e.classPlan,
      })),
      null,
      2,
    ),
  );
} else if (args.summary || !Object.keys(args).length) {
  const summary = JSON.parse(
    await readFile("research/intake/summary.json", "utf8"),
  );
  console.log(
    JSON.stringify(
      {
        ...summary,
        facetStates: Object.fromEntries(
          facets.map((f) => [
            f,
            Object.fromEntries(
              [...new Set(rows.map((e) => e.audit[f].state))]
                .sort()
                .map((s) => [
                  s,
                  rows.filter((e) => e.audit[f].state === s).length,
                ]),
            ),
          ]),
        ),
      },
      null,
      2,
    ),
  );
} else {
  const limit = Number(args.limit ?? 30);
  assert(Number.isInteger(limit) && limit > 0, "Invalid limit");
  if (args.json)
    console.log(
      JSON.stringify(
        { matching: rows.length, entries: rows.slice(0, limit) },
        null,
        2,
      ),
    );
  else {
    console.log(
      `Matches: ${rows.length}; showing ${Math.min(rows.length, limit)}`,
    );
    for (const e of rows.slice(0, limit)) {
      console.log(`${e.kind} | ${e.name} | ${e.edition}`);
      console.log(`  ${e.sourceKey}`);
      console.log(`  ${e.url}`);
      if (e.canonical)
        console.log(`  ${e.canonical.uuid}\n  ${e.canonical.file}`);
      if (e.intake?.reason) console.log(`  Hold: ${e.intake.reason}`);
      if (args.needs)
        console.log(
          `  ${e.audit[args.needs].state}: ${e.audit[args.needs].signals.join("; ") || "No automatic signal; manual review is still required."}`,
        );
    }
  }
}
