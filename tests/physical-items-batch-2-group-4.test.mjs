import assert from "node:assert/strict";
import test, { before } from "node:test";
import { json, moduleId } from "../scripts/lib.mjs";
import {
  containerTotals,
  validateLandSpeedBoots,
} from "../scripts/content.mjs";

let docs, containers;
before(async () => {
  containers = await json("config/containers.json");
  const rows = Object.values(
    await json("config/physical-item-reviews.json"),
  ).filter((r) => r.productionGroup === "physical-items-batch-2-group-4");
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

test("apparatus storage is empty native inventory with count and volume limits separate from pounds", () => {
  for (const [name, price, weight] of [
    ["Animate Wand Bracers", 4200, 1],
    ["Bandolier of Grenades", 900, 1],
    ["Bottomless Flask", 1000, 2],
  ]) {
    const d = docs.get(name);
    assert.equal(d.type, "container");
    assert.deepEqual(d.system.items, {});
    assert.deepEqual(d.system.actions, []);
    assert.deepEqual(containerTotals(d), { price, weight });
    assert.equal(d.system.maxWeight, null);
    assert.deepEqual(d.system.weight.reduction, { value: 0, percent: 0 });
    assert.deepEqual(containers[d.flags[moduleId].assembly].contents, []);
  }
  assert.deepEqual(containers["bandolier-of-grenades"].capacity, { slots: 5 });
  assert.deepEqual(containers["bottomless-flask"].capacity, {
    compartments: 5,
    gallonsPerCompartment: 20,
  });
  assert.match(
    docs.get("Bandolier of Grenades").system.description.instructions,
    /separate 6th-level/,
  );
  assert.match(
    docs.get("Animate Wand Bracers").system.description.instructions,
    /Illustrated wands are examples/,
  );
});

test("Striding boots use a nonstacking enhancement to land speed without adding springing or other movement", () => {
  const d = docs.get("Boots of Striding");
  validateLandSpeedBoots(d);
  for (const [field, value] of [
    ["target", "allSpeeds"],
    ["formula", "30"],
    ["type", "untyped"],
  ]) {
    const bad = structuredClone(d);
    bad.system.changes[0][field] = value;
    assert.throws(
      () => validateLandSpeedBoots(bad),
      /only ten enhancement feet/,
    );
  }
  assert.equal(d.system.changes.length, 1);
  assert.match(
    d.system.description.instructions,
    /no Acrobatics\/springing bonus/,
  );
});

test("Bludgeoner's Rod keeps ordinary mace damage separate from the conditional charged strike", () => {
  const d = docs.get("Bludgeoner’s Rod");
  assert.equal(d.type, "weapon");
  assert.equal(d.system.enh, 2);
  assert.equal(d.system.masterwork, true);
  assert.deepEqual(d.system.baseTypes, ["Light Mace"]);
  assert.equal(
    d.system.actions[0].damage.parts[0].formula,
    "sizeRoll(1, 6, @size)",
  );
  assert.equal(d.system.actions[0].damage.parts.length, 1);
  assert.equal(d.system.actions[1].activation.type, "move");
  assert.match(
    d.system.actions[1].notes.effect[0],
    /first attack before the end/,
  );
  assert.equal(d.system.uses.per, "");
});

test("Soulreaving's daily free use and external souls remain distinct resources", () => {
  const d = docs.get("Amulet of Soulreaving");
  assert.equal(d.system.uses.value, 1);
  assert.equal(d.system.uses.per, "day");
  assert.deepEqual(
    d.system.actions.map((a) => [
      a.activation.type,
      a.uses.autoDeductChargesCost,
    ]),
    [
      ["immediate", "0"],
      ["immediate", "1"],
    ],
  );
  assert.match(
    d.system.actions[0].notes.effect[0],
    /within 40 feet of the expended soul/,
  );
  assert.match(
    d.system.actions[1].notes.effect[0],
    /within forty feet of the wearer/,
  );
  assert.deepEqual(d.system.changes, []);
  const flask = docs.get("Crimson Flask");
  assert.equal(flask.system.uses.value, 0);
  assert.equal(flask.system.uses.maxFormula, "2");
  assert.equal(flask.system.uses.per, "charges");
  assert.deepEqual(
    flask.system.actions.map((a) => [
      a.activation.type,
      a.uses.autoDeductChargesCost,
    ]),
    [
      ["full", "0"],
      ["move", "0"],
      ["nonaction", "1"],
    ],
  );
  assert.deepEqual(flask.system.scriptCalls, []);
});

test("paired objects count as one complete priced set and preserve inherited limits", () => {
  const books = docs.get("Bonded Notebooks"),
    quills = docs.get("Bonded Quills");
  assert.equal(books.system.quantity, 1);
  assert.equal(books.system.price, 5000);
  assert.equal(books.system.weight.value, 2);
  assert.equal(quills.system.quantity, 1);
  assert.equal(quills.system.price, 5000);
  assert.match(quills.system.description.instructions, /without dripping/);
  assert.match(
    quills.system.description.instructions,
    /cannot duplicate scrolls/,
  );
  assert.deepEqual(quills.system.links.children, []);
});

test("crafted choices, conditional protections and the Weather aura discrepancy stay explicit", () => {
  for (const name of [
    "Amulet of Channeled Might",
    "Amulet of Channeled Might, Greater",
    "Brawler’s Vest",
    "Doomguard",
    "Dragonstone",
  ]) {
    const d = docs.get(name);
    assert.deepEqual(d.system.changes, []);
    assert.deepEqual(d.system.links.children, []);
    assert.equal(d.flags[moduleId].audit.advanced, "deferred");
  }
  for (const suffix of ["Minor", "Greater"]) {
    const d = docs.get("Cloak of Weather Resistance, " + suffix);
    assert.equal(d.system.cl, 5);
    assert.deepEqual(d.system.aura, { custom: true, school: "Weather" });
    assert.match(d.system.description.instructions, /issue #31/);
    assert.match(d.system.description.value, /moderate Weather/);
  }
});
