import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { physicalReviewReport } from "./reuse-review.mjs";

const completedStates = new Set([
  "implemented",
  "not-needed",
  "not-applicable",
]);

export function classifyProductionEntry(entity, reuse) {
  const text = entity.descriptionText ?? "";
  const category = entity.category ?? "";
  const signals = Object.values(entity.audit ?? {}).flatMap(
    (facet) => facet?.signals ?? [],
  );
  const joined = `${text} ${signals.join(" ")}`.toLowerCase();

  let lane = "individual-review";
  if (/etherstaves?/.test(category.toLowerCase())) lane = "etherstaff-profile";
  else if (/power components?/i.test(category) || /power component/i.test(text))
    lane = "power-component-profile";
  else if (/^rings?$/i.test(category)) lane = "ring-profile";
  else if (/^potions?$/i.test(category)) lane = "consumable-profile";
  else if (reuse?.candidates?.length) lane = "reuse-decision";
  else if (/buildings?/.test(category.toLowerCase()))
    lane = "structure-profile";

  const hardSignals = [
    /container/,
    /charges?/,
    /per day/,
    /swift action/,
    /immediate action/,
    /free action/,
    /full[- ]round action/,
    /counts as a \+\d+ /,
  ];
  const complexity = hardSignals.some((pattern) => pattern.test(joined))
    ? "complex"
    : ["changes", "contextNotes", "usage", "links"].some(
          (facet) => !completedStates.has(entity.audit?.[facet]?.state),
        )
      ? "conditional"
      : "simple";

  return { lane, complexity };
}

export async function createProductionPlan({
  batchId = "physical-items-batch-1",
  limit = 20,
  offset = 0,
} = {}) {
  assert(Number.isInteger(limit) && limit > 0, "Invalid production-plan limit");
  assert(
    Number.isInteger(offset) && offset >= 0,
    "Invalid production-plan offset",
  );

  const batches = JSON.parse(
    await readFile("config/production-batches.json", "utf8"),
  );
  const batch = batches.batches?.[batchId];
  assert(batch, `Unknown production batch: ${batchId}`);

  const entities = (await readFile("research/intake/entities.jsonl", "utf8"))
    .trim()
    .split("\n")
    .map(JSON.parse);
  const bySourceKey = new Map(
    entities.map((entry) => [entry.sourceKey, entry]),
  );
  const reviews = JSON.parse(
    await readFile("config/audit-reviews.json", "utf8"),
  );
  const reuse = await physicalReviewReport();
  const reuseBySourceKey = new Map(
    reuse.entries.map((entry) => [entry.sourceKey, entry]),
  );

  const pending = batch.entries.filter(
    (entry) =>
      entry.status === "pending" &&
      !completedStates.has(reviews[entry.sourceKey]?.image?.state),
  );
  const selected = await Promise.all(
    pending.slice(offset, offset + limit).map(async (entry) => {
      const entity = bySourceKey.get(entry.sourceKey);
      assert(entity, `Missing intake entity: ${entry.sourceKey}`);
      const document = JSON.parse(await readFile(entry.file, "utf8"));
      const descriptionText = (document.system?.description?.value ?? "")
        .replace(/<[^>]*>/g, " ")
        .replace(/\s+/g, " ")
        .trim();
      const reuseEntry = reuseBySourceKey.get(entry.sourceKey) ?? null;
      const classification = classifyProductionEntry(
        { ...entity, descriptionText },
        reuseEntry,
      );
      return {
        sourceKey: entry.sourceKey,
        name: entry.name,
        file: entry.file,
        category: entity.category,
        lane: classification.lane,
        complexity: classification.complexity,
        reuse: reuseEntry?.review ?? "unavailable",
        candidates: (reuseEntry?.candidates ?? []).map(
          ({ name, uuid, decision }) => ({ name, uuid, decision }),
        ),
        needs: Object.fromEntries(
          Object.entries(entity.audit)
            .filter(([, facet]) => !completedStates.has(facet.state))
            .map(([name, facet]) => [name, facet.state]),
        ),
      };
    }),
  );

  const lanes = Object.groupBy(selected, (entry) => entry.lane);
  return {
    schemaVersion: 1,
    batch: batchId,
    issue: batch.issue,
    pending: pending.length,
    offset,
    requested: limit,
    selected: selected.length,
    acceptanceBoundary:
      "Run targeted validation while authoring; run one clean verify, remote deployment, representative Foundry acceptance, semantic audit, documentation update and CI cycle for this complete plan.",
    lanes: Object.fromEntries(
      Object.entries(lanes).map(([lane, entries]) => [
        lane,
        entries.map((entry) => entry.sourceKey),
      ]),
    ),
    entries: selected,
  };
}

if (process.argv[1]?.endsWith("production-plan.mjs")) {
  const args = Object.fromEntries(
    process.argv.slice(2).map((arg) => {
      assert(/^--[a-z-]+=.+$/.test(arg), "Use --name=value");
      const at = arg.indexOf("=");
      return [arg.slice(2, at), arg.slice(at + 1)];
    }),
  );
  assert(
    Object.keys(args).every((key) =>
      ["batch", "limit", "offset"].includes(key),
    ),
    "Unknown production-plan option",
  );
  const plan = await createProductionPlan({
    batchId: args.batch,
    limit: args.limit === undefined ? undefined : Number(args.limit),
    offset: args.offset === undefined ? undefined : Number(args.offset),
  });
  console.log(JSON.stringify(plan, null, 2));
}
