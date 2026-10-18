import assert from "node:assert/strict";
import test from "node:test";
import {
  classifyProductionEntry,
  createProductionPlan,
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
