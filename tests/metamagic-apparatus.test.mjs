import assert from "node:assert/strict";
import test, { before } from "node:test";
import { json, moduleId } from "../scripts/lib.mjs";
import { validateMetamagicApparatus } from "../scripts/content.mjs";
let docs, profile;
before(async () => {
  profile = await json("research/metamagic-apparatus-profiles.json");
  const rows = Object.values(
    await json("config/physical-item-reviews.json"),
  ).filter((r) => r.productionGroup === "physical-items-batch-2-group-1");
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
test("lesser apparatuses use sphere caster-level limits and daily uses instead of feat spell-point costs", () => {
  for (const [name, d] of docs) {
    if (name === "Cascading Metamagic Apparatus") continue;
    assert.equal(d.type, "equipment");
    assert.equal(d.system.subType, "wondrous");
    assert.equal(d.system.slot, "slotless");
    assert.equal(d.system.cl, 5);
    assert.equal(d.system.aura.school, "");
    assert.equal(d.system.weight.value, 5);
    assert.equal(d.system.uses.per, "day");
    assert.equal(d.system.uses.value, 3);
    assert.equal(d.system.uses.maxFormula, "3");
    const m = d.flags[moduleId].metamagicApparatus;
    assert.equal(m.tier, "lesser");
    assert.equal(m.maxSphereEffectCasterLevel, 7);
    assert.equal(m.featSpellPointCostAppliesToItem, false);
    assert.deepEqual(d.system.changes, []);
    assert.deepEqual(d.system.contextNotes, []);
    assert.equal(d.system.actions[0].activation.type, "nonaction");
    assert.equal(d.system.actions[0].uses.autoDeductChargesCost, "1");
  }
  assert.equal(
    docs.get("Brisk Metamagic Apparatus").flags[moduleId].metamagicApparatus
      .featSpellPointCost,
    0,
  );
  assert.equal(
    docs.get("Burrowing Metamagic Apparatus").flags[moduleId].metamagicApparatus
      .featSpellPointCost,
    3,
  );
});
test("Cascading keeps its normal-only tier and per-talent/combined caster-level restrictions", () => {
  const d = docs.get("Cascading Metamagic Apparatus"),
    m = d.flags[moduleId].metamagicApparatus;
  assert.equal(d.system.price, 20000);
  assert.equal(d.system.cl, 10);
  assert.equal(m.tier, "normal");
  assert.equal(m.normalOnly, true);
  assert.equal(m.maxSphereEffectCasterLevel, 7);
  assert.equal(m.maxCombinedCasterLevel, 9);
  assert.equal(d.system.uses.value, 3);
  assert.match(
    d.system.description.instructions,
    /shortest duration and longest casting time/,
  );
  assert.match(
    d.system.description.instructions,
    /persists without concentration/,
  );
});
test("Bouncing redirection is swift and does not double-charge the original casting", () => {
  const s = docs.get("Bouncing Metamagic Apparatus").system;
  assert.deepEqual(
    s.actions.map((a) => [a.activation.type, a.uses.autoDeductChargesCost]),
    [
      ["nonaction", "1"],
      ["swift", "0"],
    ],
  );
  assert.match(s.actions[1].notes.effect[0], /no effect at all/);
  assert.match(
    s.actions[1].notes.effect[0],
    /lesser effect.*prevents redirection/,
  );
});
test("aligned and elemental choices share their item pool and remain unselected", () => {
  for (const name of [
    "Aligned Metamagic Apparatus",
    "Elemental Metamagic Apparatus",
  ]) {
    const d = docs.get(name);
    assert.equal(d.system.uses.value, 3);
    assert.equal(d.system.actions.length, 2);
    assert.deepEqual(
      d.system.actions.map((a) => a.uses.autoDeductChargesCost),
      ["1", "1"],
    );
    assert.match(d.flags[moduleId].selectedVariant, /not yet selected/);
    assert.equal(d.flags[moduleId].audit.advanced, "deferred");
  }
  assert.match(
    docs.get("Aligned Metamagic Apparatus").system.description.instructions,
    /Weal and woe reverse/,
  );
  assert.match(
    docs.get("Elemental Metamagic Apparatus").system.description.instructions,
    /split damage equally/,
  );
});
test("conditional effects preserve restrictions instead of assigning always-on actor changes", () => {
  const checks = [
    ["Burrowing", /Required line of sight/],
    ["Concussive", /sphere talent’s caster level/],
    ["Consecrated", /no stacking with Maximize/],
    ["Contagious", /failed removal\/dispel check by five/],
    ["Contingent", /only one contingent talent/],
    ["Dazing", /allow a Will save/],
    ["Delayed", /up to five rounds/],
    ["Disruptive", /Only targets actually affected/],
    ["Empowering", /Do not modify saves/],
    ["Encouraging", /only morale bonuses/],
  ];
  for (const [name, re] of checks) {
    const d = docs.get(name + " Metamagic Apparatus");
    assert.match(d.system.description.instructions, re);
    assert.deepEqual(d.system.changes, []);
    assert.equal(d.flags[moduleId].audit.changes, "deferred");
    assert.equal(d.flags[moduleId].audit.compatibility, "deferred");
  }
});

test("apparatus validation rejects applying feat costs or replacing source-specific tiers and caps", () => {
  for (const [name, mutate, expected] of [
    ["Brisk", (d) => (d.system.uses.value = 0), /daily uses changed/],
    ["Aquatic", (d) => (d.system.cl = 17), /caster level changed/],
    [
      "Burrowing",
      (d) =>
        (d.flags[moduleId].metamagicApparatus.featSpellPointCostAppliesToItem =
          true),
      /Feat cost must not be charged/,
    ],
    [
      "Cascading",
      (d) => (d.flags[moduleId].metamagicApparatus.tier = "lesser"),
      /tier changed/,
    ],
    [
      "Cascading",
      (d) => (d.flags[moduleId].metamagicApparatus.maxCombinedCasterLevel = 13),
      /Combined caster-level limit/,
    ],
    [
      "Cascading",
      (d) =>
        (d.flags[moduleId].metamagicApparatus.maxSphereEffectCasterLevel = 13),
      /sphere caster-level limit/,
    ],
  ]) {
    const d = structuredClone(docs.get(name + " Metamagic Apparatus"));
    mutate(d);
    assert.throws(() => validateMetamagicApparatus(d, profile), expected);
  }
});
