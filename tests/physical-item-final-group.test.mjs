import assert from "node:assert/strict";
import test, { before } from "node:test";
import { json, moduleId } from "../scripts/lib.mjs";
import { containerTotals } from "../scripts/content.mjs";
let docs;
before(async () => {
  const rows = Object.values(
    await json("config/physical-item-reviews.json"),
  ).filter((r) => r.productionGroup === "physical-items-final-group");
  assert.equal(rows.length, 14);
  docs = new Map(
    await Promise.all(
      rows.map(async (r) => {
        const d = await json(r.output.file);
        return [d.name, d];
      }),
    ),
  );
});
test("Trash Bag separates its zero-value usable supply from the empty container", async () => {
  const d = docs.get("Trash Bag"),
    s = d.system;
  assert.equal(d.type, "container");
  assert.deepEqual(containerTotals(d), { price: 500, weight: 5 });
  assert.equal(s.price, 500);
  assert.equal(s.weight.value, 0);
  assert.equal(s.maxWeight, 5);
  const contents = Object.values(s.items);
  assert.equal(contents.length, 1);
  const c = contents[0];
  assert.equal(c.type, "loot");
  assert.equal(c.system.quantity, 5);
  assert.equal(c.system.price, 0);
  assert.equal(c.system.weight.value, 1);
  assert.match(c.system.description.value, /one unit.*three/i);
  assert.deepEqual(c.system.actions, []);
  const a = (await json("config/containers.json"))["trash-bag"];
  assert.equal(a.contents[0].id, c._id);
  assert.equal(a.maxWeight, 5);
});
test("rainbow shield uses native buckler armor while named crossbow retains attack and ammunition", () => {
  const d = docs.get("Disc of Rainbow Tears"),
    s = d.system;
  assert.equal(d.type, "equipment");
  assert.equal(s.subType, "shield");
  assert.equal(s.slot, "shield");
  assert.deepEqual(s.baseTypes, ["Buckler"]);
  assert.deepEqual(
    [s.armor.value, s.armor.enh, s.armor.acp, s.spellFailure, s.masterwork],
    [1, 2, 1, 5, true],
  );
  assert.equal(s.weight.value, 7);
  assert.equal(s.actions[0].activation.type, "full");
  assert.equal(s.actions[0].uses.autoDeductChargesCost, "0");
  assert.deepEqual(s.changes, []);
  const cross = docs.get("Leviathan Cross");
  assert.equal(cross.type, "weapon");
  assert.equal(cross.system.enh, 1);
  assert.deepEqual(cross.system.baseTypes, ["Light Crossbow"]);
  assert.equal(cross.system.ammo.type, "bolt");
  assert.equal(cross.system.actions[0].range.value, "80");
  assert.equal(
    cross.system.actions[0].damage.parts[0].formula,
    "sizeRoll(1, 8, @size)",
  );
  assert.equal(cross.system.actions[0].ability.critRange, 19);
  assert.equal(cross.system.weight.value, 9);
});
test("burn reduction and cohort creation consume items without creating actors or changing burn", () => {
  for (const [name, type] of [
    ["Burn Fragment", "nonaction"],
    ["Dragon’s Tooth", "standard"],
  ]) {
    const d = docs.get(name),
      s = d.system;
    assert.equal(s.uses.per, "single");
    assert.equal(s.quantity, 1);
    assert.equal(s.actions[0].activation.type, type);
    assert.equal(s.actions[0].uses.autoDeductChargesCost, "1");
    assert.deepEqual(s.changes, []);
  }
  assert.match(
    docs.get("Burn Fragment").flags[moduleId].selectedVariant,
    /3rd-level-or-lower/,
  );
  assert.equal(
    docs.get("Dragon’s Tooth").flags[moduleId].audit.links,
    "deferred",
  );
  const shard = docs.get("Burn Shard").system;
  assert.equal(shard.uses.per, "day");
  assert.equal(shard.uses.value, 1);
  assert.equal(shard.actions[0].uses.autoDeductChargesCost, "1");
});
test("cradle momentum and game wagers do not share daily counters with unrelated uses", () => {
  const c = docs.get("Cradle of the Marauder").system;
  assert.equal(c.uses.per, "day");
  assert.equal(c.uses.value, 3);
  assert.deepEqual(
    c.actions.map((a) => a.uses.autoDeductChargesCost),
    ["1", "0"],
  );
  assert.deepEqual(c.actions[0].duration, { value: "4", units: "minute" });
  assert.match(c.actions[1].notes.effect[0], /separate four-point momentum/);
  const cube = docs.get("Archmage’s Cube of Gaming");
  assert.equal(cube.system.uses.value, 1);
  assert.deepEqual(cube.system.actions, []);
  assert.equal(cube.flags[moduleId].audit.activation, "deferred");
});
test("armor upgrades stay separate from full suits and variant restrictions remain explicit", () => {
  for (const name of [
    "Burn Resistance (Armor Quality)",
    "Energizing (Armor Property)",
  ]) {
    const d = docs.get(name);
    assert.equal(d.type, "loot");
    assert.equal(d.system.subType, "gear");
    assert.equal(d.system.price, 10000);
    assert.equal(d.system.weight.value, 0);
    assert.equal(d.system.armor, undefined);
    assert.deepEqual(d.system.actions, []);
    assert.deepEqual(d.system.changes, []);
    assert.equal(d.flags[moduleId].audit.advanced, "deferred");
  }
  const stone = docs.get("Teardrop Ioun Stone");
  assert.equal(stone.system.price, 280);
  assert.match(
    stone.flags[moduleId].selectedVariant,
    /cracked, clear \(aether\)/,
  );
  assert.deepEqual(stone.system.changes, []);
  const crystal = docs.get("Crystal of Elemental Knowledge");
  assert.equal(crystal.system.price, 1000);
  assert.match(crystal.flags[moduleId].selectedVariant, /not selected/);
  assert.equal(crystal.flags[moduleId].audit.links, "deferred");
  const divine = docs.get("Divine Symbol");
  assert.equal(divine.system.slot, "slotless");
  assert.deepEqual(divine.system.changes, []);
  assert.equal(divine.system.aura.school, "");
});
