import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import test, { before } from "node:test";
import { json, moduleId } from "../scripts/lib.mjs";
let docs, evidence;
before(async () => {
  evidence = await json("research/physical-items-batch-3-compounds.json");
  const rows = Object.values(
    await json("config/physical-item-reviews.json"),
  ).filter((r) => r.productionGroup === "physical-items-batch-3-compounds");
  assert.equal(rows.length, 20);
  docs = new Map(
    await Promise.all(
      rows.map(async (r) => {
        const d = await json(r.output.file);
        return [d.flags[moduleId].sourceKey.split(":").at(-1), d];
      }),
    ),
  );
});
test("twenty compound doses preserve bodies and quantities without persistent actor effects", () => {
  for (const f of evidence.entries) {
    const d = docs.get(f.sourceKey.split(":").at(-1));
    assert.equal(d._id, f.id);
    assert.equal(
      createHash("sha256").update(d.system.description.value).digest("hex"),
      f.originalBodySha256,
    );
    assert.equal(d.type, "consumable");
    assert.equal(d.system.quantity, 1);
    assert.equal(d.system.uses.per, "single");
    assert.equal(d.system.uses.pricePerUse, 0);
    assert.deepEqual(d.system.changes, []);
    assert.deepEqual(d.system.contextNotes, []);
    assert.deepEqual(d.system.scriptCalls, []);
    assert.deepEqual(d.effects, []);
    assert.equal(d.system.actions.at(-1).uses.autoDeductChargesCost, "1");
  }
});
test("fixed Common Cure healing does not scale with actor CL or require extra doses", () => {
  const d = docs.get("common-cure").system;
  assert.equal(d.actions.length, 1);
  const a = d.actions[0];
  assert.equal(a.actionType, "heal");
  assert.deepEqual(a.damage.parts, [
    { formula: "1d8 + 1", types: ["positive"] },
  ]);
  assert.equal(a.activation.type, "standard");
  assert.equal(d.cl, 1);
  assert.equal(d.price, 50);
  assert.equal(a.uses.autoDeductChargesCost, "1");
});
test("one-minute animation and unimbued oil preserve preparation versus expenditure", () => {
  const animate = docs.get("animate-object-oil").system;
  assert.equal(animate.price, 300);
  assert.equal(animate.cl, 2);
  assert.equal(animate.actions[0].activation.type, "minute");
  assert.equal(animate.actions[0].activation.cost, 1);
  assert.deepEqual(animate.actions[0].duration, {
    value: "20",
    units: "minute",
  });
  assert.match(animate.actions[0].notes.effect[0], /at most Tiny/);
  const q = docs.get("quintessential-oil").system;
  assert.equal(q.actions.length, 2);
  assert.equal(q.actions[0].uses.autoDeductChargesCost, "0");
  assert.equal(q.actions[1].uses.autoDeductChargesCost, "1");
  assert.match(
    q.actions[0].notes.effect[0],
    /real spell points and actual casting time/,
  );
  assert.match(q.actions[1].notes.effect[0], /first creature target/);
});
test("tier and conditional limits do not import full spells or permanent bonuses", () => {
  const note = (slug) => docs.get(slug).system.actions.at(-1).notes.effect[0];
  assert.match(note("catfolk-guise-potion"), /No low-light vision/);
  assert.match(note("electric-oil"), /2d6/);
  assert.match(note("electric-oil"), /before one round/);
  assert.match(note("size-increase-potion"), /maximum Large/);
  assert.match(note("size-reduction-potion"), /minimum Tiny/);
  assert.match(note("renewal-elixir"), /min\(4, the drinker/);
  assert.match(note("renewal-elixir"), /once per day across all doses/);
  assert.match(note("cleansing-potion"), /one round only/);
  assert.match(note("hallow-word-oil"), /#44/);
});
test("prepared oil expires four hours after imbuing without imposing a stored-effect duration", () => {
  const [prepare, expend] = docs.get("quintessential-oil").system.actions;
  assert.deepEqual(prepare.duration, { value: "4", units: "hour" });
  assert.equal(expend.duration, undefined);
  assert.match(prepare.notes.effect[0], /starts after imbuing is complete/);
  assert.match(
    expend.notes.effect[0],
    /stored ability retains its own duration/,
  );
  assert.equal(prepare.uses.autoDeductChargesCost, "0");
  assert.equal(expend.uses.autoDeductChargesCost, "1");
});
test("dispel helpers use fixed item MSB and source effect counts, preserving published prices", () => {
  const lesser = docs.get("spell-cleansing-elixir-lesser").system;
  const greater = docs.get("spell-cleansing-elixir-greater").system;
  assert.equal(lesser.price, 250);
  assert.equal(greater.price, 1000);
  assert.match(lesser.description.value, /175 gp/);
  assert.match(lesser.actions[0].notes.effect[0], /one ongoing magical effect/);
  assert.match(lesser.actions[0].notes.effect[0], /1d20 \+ 5/);
  assert.match(greater.actions[0].notes.effect[0], /up to three ongoing/);
  assert.match(greater.actions[0].notes.effect[0], /1d20 \+ 10/);
  assert.equal(
    [...docs.values()].reduce((n, d) => n + d.system.actions.length, 0),
    21,
  );
});
