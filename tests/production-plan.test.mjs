import assert from "node:assert/strict";
import test from "node:test";
import {
  classifyProductionEntry,
  createProductionPlan,
  selectProductionEntries,
} from "../scripts/production-plan.mjs";

test("production planner selects one twenty-entry acceptance boundary", async () => {
  const plan = await createProductionPlan({ limit: 20 });
  assert.equal(plan.batch, "physical-items-batch-1");
  assert.equal(plan.selected, 20);
  assert.equal(new Set(plan.entries.map((entry) => entry.sourceKey)).size, 20);
  assert(plan.entries.every((entry) => entry.needs.image === "needed"));
  assert(
    plan.entries.every((entry) => entry.file.startsWith("src/packs/items/")),
  );
  assert.match(plan.acceptanceBoundary, /one clean verify/);
});

test("production planner groups shared profiles before individual mechanics", () => {
  assert.deepEqual(
    classifyProductionEntry(
      {
        category: "Etherstaves > Specific Etherstaves",
        descriptionText: "Recharge Cost 2; ten charges",
        audit: {},
      },
      { candidates: [] },
    ),
    { lane: "etherstaff-profile", complexity: "complex" },
  );
  assert.deepEqual(
    classifyProductionEntry(
      {
        category: "Planar Power Components",
        descriptionText: "one dose or a reusable focus",
        audit: { changes: { state: "needs-review", signals: [] } },
      },
      { candidates: [] },
    ),
    { lane: "power-component-profile", complexity: "conditional" },
  );
});

test("selection groups the full queue before applying limits and offsets", () => {
  const queue = [
    { sourceKey: "a", lane: "weapon-profile" },
    { sourceKey: "b", lane: "ring-profile" },
    { sourceKey: "c", lane: "weapon-profile" },
    { sourceKey: "d", lane: "ring-profile" },
    { sourceKey: "e", lane: "individual-review" },
  ];
  const original = structuredClone(queue);
  const first = selectProductionEntries(queue, { limit: 2 });
  assert.deepEqual(
    first.map((entry) => entry.sourceKey),
    ["b", "d"],
  );
  assert.deepEqual(
    selectProductionEntries(queue.toReversed(), { limit: 2 }),
    first,
  );
  const second = selectProductionEntries(queue, { limit: 2, offset: 2 });
  assert.deepEqual(
    second.map((entry) => entry.sourceKey),
    ["a", "c"],
  );
  const last = selectProductionEntries(queue, { limit: 2, offset: 4 });
  assert.equal(
    new Set([...first, ...second, ...last].map((entry) => entry.sourceKey))
      .size,
    queue.length,
  );
  assert.deepEqual(queue, original);
  assert.deepEqual(
    selectProductionEntries(queue, { limit: 2, order: "manifest" }),
    queue.slice(0, 2),
  );
  assert.deepEqual(selectProductionEntries([], { limit: 2 }), []);
  assert.throws(
    () => selectProductionEntries(queue, { order: "random" }),
    /Unknown.*order/,
  );
});

test("shared groups prefer larger queues while preserving frozen membership", async () => {
  const queue = [
    { sourceKey: "a", lane: "etherstaff-profile" },
    { sourceKey: "b", lane: "ring-profile" },
    { sourceKey: "c", lane: "ring-profile" },
    { sourceKey: "d", lane: "reuse-decision" },
  ];
  assert.deepEqual(
    selectProductionEntries(queue, { limit: 3 }).map(
      (entry) => entry.sourceKey,
    ),
    ["d", "b", "c"],
  );
  const grouped = await createProductionPlan({ limit: 100 });
  const manifest = await createProductionPlan({
    limit: 100,
    order: "manifest",
  });
  assert.deepEqual(
    grouped.entries.map((entry) => entry.sourceKey).sort(),
    manifest.entries.map((entry) => entry.sourceKey).sort(),
  );
  assert.equal(
    Object.values(grouped.queueLanes).reduce((sum, count) => sum + count, 0),
    grouped.pending,
  );
  assert.equal(grouped.order, "grouped");
});

test("category hints distinguish review work without inferring item mechanics", () => {
  for (const [category, lane] of [
    ["Ring Slot", "ring-profile"],
    ["Specific Magic Weapons", "weapon-profile"],
    ["Hands Slot", "wearable-profile"],
    ["gonzo-wondrous-items", "wondrous-item-review"],
    ["Magical Armor Qualities", "armor-property-review"],
    ["Containers", "container-review"],
    ["Unclassified", "individual-review"],
  ])
    assert.equal(
      classifyProductionEntry({ category, audit: {} }, null).lane,
      lane,
    );
});
