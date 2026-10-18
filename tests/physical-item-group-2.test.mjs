import assert from "node:assert/strict";
import test from "node:test";
import { readdir } from "node:fs/promises";
import { json } from "../scripts/lib.mjs";

async function group() {
  const reviews = await json("config/physical-item-reviews.json");
  const rows = Object.values(reviews).filter(
    (review) => review.productionGroup === "physical-items-group-2",
  );
  assert.equal(rows.length, 20);
  return new Map(
    await Promise.all(
      rows.map(async (review) => {
        const doc = await json(review.output.file);
        return [doc.name, doc];
      }),
    ),
  );
}

test("firearm spell-power helpers opt out of inherited bullet requirements", async () => {
  const directory = "src/packs/items/ethermagic-items";
  const weapons = [];
  for (const file of await readdir(directory)) {
    const doc = await json(`${directory}/${file}`);
    if (doc.type === "weapon" && doc.system.ammo?.type === "gunBullet")
      weapons.push(doc);
  }
  assert.equal(weapons.length, 4);
  for (const doc of weapons) {
    const [attack, power] = doc.system.actions;
    // PF1 11.11 inherits parent ammo on blank actions; its native "none"
    // sentinel bypasses both the availability check and ammo deduction.
    assert.equal(attack.ammo.type, "gunBullet", doc.name);
    assert.equal(attack.actionType, "rwak", doc.name);
    assert.equal(attack.uses.autoDeductChargesCost, "0", doc.name);
    assert.equal(power.ammo.type, "none", doc.name);
    assert.equal(power.damage, undefined, doc.name);
    assert.equal(power.actionType, undefined, doc.name);
    assert.equal(
      power.uses.autoDeductChargesCost,
      doc.name === "Sparkly's Glittergun" ? "0" : "1",
      doc.name,
    );
  }
});

test("Ethermagic firearms retain native attacks independently of daily powers", async () => {
  const docs = await group();
  for (const [name, base, enhancement, daily, die, range, hands, misfire] of [
    [
      "Fjodor's (Relatively) Faithful Friend",
      "Blunderbuss",
      2,
      1,
      8,
      "10",
      2,
      2,
    ],
    ["Murphy's Bane", "Pistol", 1, 3, 8, "20", 1, 1],
    ["Ripper Van Wiggle's Musket", "Musket", 2, 2, 12, "40", 2, 2],
  ]) {
    const doc = docs.get(name);
    assert.equal(doc.type, "weapon");
    assert.deepEqual(doc.system.baseTypes, [base]);
    assert.deepEqual(doc.system.weaponGroups, ["firearms"]);
    assert.equal(doc.system.subType, "exotic");
    assert.equal(doc.system.masterwork, true);
    assert.match(doc.system.description.unidentified, /Misfire/);
    assert.equal(doc.system.enh, enhancement);
    assert.equal(doc.system.hands, hands);
    assert.equal(doc.system.ammo.misfire, misfire);
    assert.equal(doc.system.uses.per, "day");
    assert.equal(doc.system.uses.value, daily);
    const [attack, power] = doc.system.actions;
    assert.equal(attack.actionType, "rwak");
    assert.equal(
      attack.damage.parts[0].formula,
      "sizeRoll(1, " + die + ", @size)",
    );
    assert.equal(attack.range.value, range);
    assert.equal(attack.uses.autoDeductChargesCost, "0");
    assert.equal(power.uses.autoDeductChargesCost, "1");
    assert.equal(
      power.activation.type,
      base === "Blunderbuss" ? "immediate" : "swift",
    );
    assert.deepEqual(doc.system.changes, []);
  }
});

test("cloak movement options and amulet orientation consume the correct resources", async () => {
  const docs = await group();
  const cloak = docs.get("Dashing Cloak");
  assert.equal(cloak.system.uses.value, 5);
  assert.equal(cloak.system.uses.per, "charges");
  assert.deepEqual(
    cloak.system.actions.map((action) => [
      action.activation.type,
      action.uses.autoDeductChargesCost,
    ]),
    [
      ["standard", "1"],
      ["move", "2"],
      ["swift", "3"],
    ],
  );
  assert.equal(cloak.system.aura.school, ""); // Warp is not silently mapped to a native school.
  const amulet = docs.get("Amulet of the Revealing Eye");
  assert.equal(amulet.system.uses.value, 3);
  const [reveal, orient] = amulet.system.actions;
  assert.deepEqual(reveal.measureTemplate, { type: "cone", size: "60" });
  assert.deepEqual(reveal.duration, { value: "3", units: "round" });
  assert.equal(reveal.uses.autoDeductChargesCost, "1");
  assert.equal(orient.uses.autoDeductChargesCost, "0");
  assert.equal(orient.activation.type, "free");
  assert.match(orient.notes.effect[0], /Once per turn/);
});

test("conditional kineticist bonuses remain bounded and variant profiles retain source values", async () => {
  const docs = await group();
  const expected = [
    ["Body Wraps of Kinetic Fist", 6, "body", 4000, 4],
    ["Bracers of Elemental Conversion", 10, "wrists", 12000, 2],
    ["Conduit Glove", 6, "hands", 1000, 0],
    ["Crown of Focused Power", 9, "head", 7000, 3],
    ["Focusing Glove", 5, "hands", 4000, 0],
    ["Kinetic Blademaster Glove", 6, "hands", 4000, 0],
    ["Robe of Burn Conversion", 15, "chest", 30000, 10],
    ["Robe of Elemental Resistance", 15, "body", 1000, 6],
    ["Vambraces of Overflowing Power", 6, "wrists", 1000, 2],
    ["Vest of Elemental Defense", 15, "chest", 2000, 4],
    ["Wraps of Suppressed Size", 12, "body", 32000, 1],
  ];
  for (const [name, cl, slot, price, weight] of expected) {
    const doc = docs.get(name);
    assert.deepEqual(
      [
        doc.type,
        doc.system.cl,
        doc.system.slot,
        doc.system.price,
        doc.system.weight.value,
      ],
      ["equipment", cl, slot, price, weight],
    );
    assert.deepEqual(doc.system.changes, []);
    assert.equal(
      doc.flags["additional-spheres-content"].audit.changes,
      "deferred",
    );
  }
  const crown = docs.get("Crown of Focused Power");
  assert.equal(crown.system.uses.value, 0);
  assert.equal(crown.system.uses.maxFormula, "1");
  assert.equal(crown.system.actions[0].uses.autoDeductChargesCost, "1");
  for (const name of ["Mender’s Etherstaff", "Revealer of the Void"]) {
    const staff = docs.get(name);
    assert.equal(staff.system.uses.value, 10);
    assert.equal(staff.system.uses.maxFormula, "10");
    assert.deepEqual(staff.system.actions, []);
  }
});
