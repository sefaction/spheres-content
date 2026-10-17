import assert from "node:assert/strict";
import test, { before } from "node:test";
import { json, moduleId } from "../scripts/lib.mjs";
import { validateMetamagicApparatus } from "../scripts/content.mjs";
let docs, profile;
before(async () => {
  profile = await json("research/metamagic-apparatus-profiles.json");
  const rows = Object.values(
    await json("config/physical-item-reviews.json"),
  ).filter((r) => r.productionGroup === "physical-items-batch-2-group-2");
  assert.equal(rows.length, 20);
  docs = new Map(
    await Promise.all(
      rows.map(async (r) => {
        const d = await json(r.output.file);
        return [d.name, d];
      }),
    ),
  );
});
test("Reaching uses five daily activations and permits repeating the same apparatus", () => {
  const d = docs.get("Reaching Metamagic Apparatus");
  assert.equal(d.system.uses.value, 5);
  assert.equal(d.system.uses.maxFormula, "5");
  assert.equal(d.system.uses.per, "day");
  assert.equal(
    d.flags[moduleId].metamagicApparatus.allowRepeatSameCasting,
    true,
  );
  assert.equal(d.system.actions[0].uses.autoDeductChargesCost, "1");
  assert.equal(d.system.actions[0].activation.type, "nonaction");
  assert.match(d.system.description.instructions, /one use per range step/);
});
test("persistence options share one item pool, and Fleeting dismissal spends no additional use", () => {
  for (const name of [
    "Extending Metamagic Apparatus",
    "Fleeting Metamagic Apparatus",
  ]) {
    const d = docs.get(name);
    assert.equal(d.system.uses.value, 3);
    assert.equal(
      d.system.actions[1].name,
      "Apply When Persisting Concentrated Effect",
    );
    assert.equal(d.system.actions[1].uses.autoDeductChargesCost, "1");
    assert.match(
      d.flags[moduleId].metamagicApparatus.additionalTiming,
      /spending a spell point/,
    );
    assert.match(
      d.system.actions[1].notes.effect[0],
      /Alternative to applying at initial casting/,
    );
  }
  const s = docs.get("Fleeting Metamagic Apparatus").system;
  assert.deepEqual(
    s.actions.map((a) => [a.activation.type, a.uses.autoDeductChargesCost]),
    [
      ["nonaction", "1"],
      ["nonaction", "1"],
      ["swift", "0"],
    ],
  );
  assert.match(s.description.instructions, /Halve duration/);
  assert.match(
    s.description.instructions,
    /counterspell removes it once active without/,
  );
});
test("Flaring preserves source ambiguity without an invented damage trigger or duration helper", () => {
  const d = docs.get("Flaring Metamagic Apparatus"),
    m = d.flags[moduleId];
  assert.equal(m.audit.advanced, "deferred");
  assert.equal(m.audit.changes, "deferred");
  assert.equal(m.metamagicApparatus.sourceAmbiguityIssue, 27);
  assert.match(d.system.description.value, /caster the spell/);
  assert.match(
    d.system.description.instructions,
    /no light-damage trigger or duration formula is assumed/,
  );
  assert.equal(d.system.actions[0].duration, undefined);
  assert.equal(d.system.actions[0].damage, undefined);
  assert.deepEqual(d.system.changes, []);
});
test("target-specific riders retain their limits and do not add global actor modifiers", () => {
  const checks = [
    ["Fearsome", /cannot upgrade shaken to frightened/],
    ["Focusing", /one creature before casting/],
    ["Furious", /once per target, on the first hit/],
    ["Horrifying Metamagic Apparatus, Major", /success instead causes shaken/],
    ["Horrifying Metamagic Apparatus, Minor", /Failure causes shaken/],
    ["Maximizing", /half the normally rolled result/],
    ["Merciful", /retaining its original damage type/],
    ["Persistent", /successful first save/],
    ["Piercing", /five lower against this talent/],
    ["Quickening", /two steps/],
    ["Scarring", /do not stack/],
  ];
  for (const [label, re] of checks) {
    const d = docs.get(
      label.includes("Metamagic Apparatus")
        ? label
        : label + " Metamagic Apparatus",
    );
    assert(d, label);
    assert.match(d.system.description.instructions, re);
    assert.deepEqual(d.system.changes, []);
    assert.equal(d.flags[moduleId].audit.compatibility, "deferred");
  }
});
test("source-specific apparatus validation rejects losing exceptional uses, timing or unresolved status", () => {
  for (const [name, mutate, expected] of [
    ["Reaching", (d) => (d.system.uses.value = 3), /daily uses changed/],
    [
      "Reaching",
      (d) => delete d.flags[moduleId].metamagicApparatus.allowRepeatSameCasting,
      /Repeated apparatus/,
    ],
    [
      "Extending",
      (d) => delete d.flags[moduleId].metamagicApparatus.additionalTiming,
      /Persistence activation/,
    ],
    [
      "Fleeting",
      (d) => (d.system.actions[2].uses.autoDeductChargesCost = "1"),
      /Free follow-up/,
    ],
    [
      "Flaring",
      (d) => (d.flags[moduleId].audit.advanced = "implemented"),
      /Unresolved source ambiguity/,
    ],
  ]) {
    const d = structuredClone(docs.get(name + " Metamagic Apparatus"));
    mutate(d);
    assert.throws(() => validateMetamagicApparatus(d, profile), expected);
  }
});
