import assert from "node:assert/strict";
import test, { before } from "node:test";
import { json, moduleId } from "../scripts/lib.mjs";
import { containerTotals } from "../scripts/content.mjs";

let docs;
before(async () => {
  const reviews = await json("config/physical-item-reviews.json");
  const rows = Object.values(reviews).filter(
    (r) => r.productionGroup === "physical-items-group-3",
  );
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

test("magical ammunition represents one expendable projectile, not a native bulk stack", () => {
  for (const [name, extraType, price, uuid] of [
    ["Blaster’s Bearing", "slingBullet", 940, "UWVXKSouid1jDJSm"],
    ["“Talky” Bullet", "gunBullet", 200, "w20dQkQPOe4sTiRT"],
  ]) {
    const d = docs.get(name),
      s = d.system;
    assert.equal(d.type, "loot");
    assert.equal(s.subType, "ammo");
    assert.equal(s.extraType, extraType);
    assert.equal(s.quantity, 1);
    assert.equal(s.price, price);
    assert.equal(s.weight.value, 0);
    assert.equal(s.abundant, false);
    assert.deepEqual(s.actions, []);
    assert.equal(s.enh, undefined); // Loot does not implement weapon enhancement.
    assert.equal(d.flags[moduleId].publishedEnhancement, 1);
    assert.equal(
      d.flags[moduleId].reuse.sourceUuid,
      `Compendium.pf1.weapons-and-ammo.Item.${uuid}`,
    );
    assert.equal(d.flags[moduleId].audit.compatibility, "deferred");
  }
});

test("Cave Bag is an empty native container; gem value does not become storage capacity", async () => {
  const d = docs.get("Cave Bag"),
    assemblies = await json("config/containers.json");
  assert.equal(d.type, "container");
  assert.deepEqual(d.system.items, {});
  assert.equal(d.system.maxWeight, null);
  assert.deepEqual(d.system.currency, { pp: 0, gp: 0, sp: 0, cp: 0 });
  assert.deepEqual(containerTotals(d), { price: 5000, weight: 0 });
  assert.equal(assemblies[d.flags[moduleId].assembly].containerId, d._id);
  assert.match(d.system.description.value, /10 cp/);
});

test("instrument weapon attacks use published instrument statistics and separate alternative damage", () => {
  for (const [name, die, crit, enhancement] of [
    ["Firekeys", 8, 19, 3],
    ["Thunderbolt Axe", 8, 19, 3],
    ["Thunder and Fury", 6, 20, 2],
  ]) {
    const d = docs.get(name),
      s = d.system,
      a = s.actions[0];
    assert.equal(d.type, "weapon");
    assert.equal(s.subType, "exotic");
    assert.equal(s.weaponSubtype, "2h");
    assert.equal(s.hands, 2);
    assert.equal(s.enh, enhancement);
    assert.equal(s.price, 60000);
    assert.equal(s.weight.value, 8); // Named magic-item weight overrides base instrument weight.
    assert.equal(a.damage.parts[0].formula, `sizeRoll(1, ${die}, @size)`);
    assert.equal(a.ability.critRange, crit);
    assert.equal(a.ability.critMult, 2);
    assert.deepEqual(s.weaponGroups, []);
    assert.deepEqual(s.changes, []);
  }
  const guitar = docs.get("Thunderbolt Axe").system;
  assert.deepEqual(
    guitar.actions.slice(0, 3).map((a) => a.damage.parts[0].types),
    [["bludgeoning"], ["slashing"], ["electric"]],
  );
  assert.deepEqual(
    docs.get("Firekeys").system.actions[1].damage.parts[0].types,
    ["fire"],
  );
  const mic = docs.get("Thunder and Fury").system;
  for (const p of ["rch", "trp", "grp"]) assert.equal(mic.properties[p], true);
});

test("wearable single-use equipment retains slots and distinguishes attachment from destruction", () => {
  const bindi = docs.get("Null Bindi");
  assert.equal(bindi.type, "equipment");
  assert.equal(bindi.system.slot, "head");
  assert.equal(bindi.system.uses.per, "single");
  assert.equal(bindi.system.actions[0].activation.type, "swift");
  assert.equal(bindi.system.actions[0].uses.autoDeductChargesCost, "1");
  for (const name of ["Motif Bauble", "Motif Bauble, Greater"]) {
    const s = docs.get(name).system;
    assert.equal(s.uses.per, "single");
    assert.equal(s.quantity, 1);
    assert.deepEqual(
      s.actions.map((a) => [a.activation.type, a.uses.autoDeductChargesCost]),
      [
        ["swift", "0"],
        ["full", "1"],
      ],
    );
    assert.match(s.actions[1].notes.effect.join(" "), /provokes/i);
    assert.deepEqual(s.changes, []);
  }
  assert.match(
    docs.get("Motif Bauble, Greater").system.actions[0].notes.effect.join(" "),
    /alongside/,
  );
});

test("finite resources stay separate from unspecified actions and returning devices", () => {
  assert.equal(docs.get("Book of Lewd Desires").system.uses.value, 50);
  const rod = docs.get("Prismatic Scepter");
  assert.equal(rod.system.uses.value, 10);
  assert.deepEqual(
    rod.system.actions.map((a) => a.uses.autoDeductChargesCost),
    ["1", "2", "2", "2"],
  );
  assert.equal(rod.flags[moduleId].audit.activation, "deferred");
  assert(!rod.system.actions.some((a) => a.name === "Prismatic Blast"));
  assert.notEqual(docs.get("Insanity Drive").system.uses.per, "single");
  assert.deepEqual(docs.get("Cans of Talking").system.actions, []);
  assert.equal(docs.get("Thunderdrum").flags[moduleId].audit.links, "deferred");
});
