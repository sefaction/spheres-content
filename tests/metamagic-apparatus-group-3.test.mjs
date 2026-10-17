import assert from "node:assert/strict";
import test, { before } from "node:test";
import { json, moduleId } from "../scripts/lib.mjs";
import { validateMetamagicApparatus } from "../scripts/content.mjs";

let docs, profile;
before(async () => {
  profile = await json("research/metamagic-apparatus-profiles.json");
  const rows = Object.values(
    await json("config/physical-item-reviews.json"),
  ).filter((r) => r.productionGroup === "physical-items-batch-2-group-3");
  assert.equal(rows.length, 20);
  docs = new Map(
    await Promise.all(
      rows.map(async (r) => {
        const d = await json(r.output.file);
        return [d.name.replace(" Metamagic Apparatus", ""), d];
      }),
    ),
  );
});

test("Still retains mental activation without requiring holding or wielding", () => {
  const d = docs.get("Still"),
    m = d.flags[moduleId].metamagicApparatus;
  assert.equal(m.requiresHeld, false);
  assert.equal(m.handling, "carried-or-worn");
  assert.equal(m.activationMode, "mental");
  assert.match(
    d.system.description.instructions,
    /Activate mentally while carrying or wearing/,
  );
  assert.match(
    d.system.actions[0].notes.effect[0],
    /no holding or wielding is required/,
  );
  assert.doesNotMatch(
    d.system.actions[0].notes.effect[0],
    /Hold this apparatus/,
  );
  const bad = structuredClone(d);
  bad.flags[moduleId].metamagicApparatus.requiresHeld = true;
  assert.throws(
    () => validateMetamagicApparatus(bad, profile),
    /holding exception lost/,
  );
});

test("Suppressed keeps its three-pound source weight instead of the five-pound family default", () => {
  const d = docs.get("Suppressed");
  assert.equal(d.system.weight.value, 3);
  assert.match(d.system.description.value, /Weight<\/strong> 3 lbs/);
  const bad = structuredClone(d);
  bad.system.weight.value = 5;
  assert.throws(
    () => validateMetamagicApparatus(bad, profile),
    /apparatus weight changed/,
  );
  assert.match(d.system.description.instructions, /forgo its optional bonus/);
});

test("Toxic preserves a separate poison component and two saves instead of fabricating a bundled dose or automatic poisoning", () => {
  const d = docs.get("Toxic"),
    note = d.system.actions[0].notes.effect[0];
  assert.match(note, /consume one actual dose/);
  assert.match(note, /negated by a successful Fortitude save/);
  assert.match(note, /fails the talent save/);
  assert.match(note, /poison's own DC/);
  assert.match(note, /failing that poison save/);
  assert.equal(d.system.actions[0].uses.autoDeductChargesCost, "1");
  assert.equal(d.system.uses.value, 3);
  assert.deepEqual(d.system.links.children, []);
  assert.deepEqual(d.effects, []);
  assert.deepEqual(d.system.scriptCalls, []);
});

test("conditional apparatus notes preserve distinct targets, defenses, timing and casting abilities", () => {
  for (const [name, re] of [
    ["Selective", /up to your casting ability score modifier/],
    ["Seeking", /actual path length cannot exceed/],
    ["Shadow Grasping", /successful stationary creatures do not repeat saves/],
    ["Studied", /excluding class levels and templates/],
    ["Threnodic", /have no effect on living creatures/],
    ["Tenacious", /capped by normal duration/],
    ["Tenebrous", /In bright light casting requires concentration/],
    ["Thanatopic", /automatically save to remove its negative levels/],
    ["Traumatic", /reducing DC by two each night after the first/],
    ["Tricking", /Charisma bonus/],
    ["Umbral", /does not stack with itself or other darkness/],
  ]) {
    const d = docs.get(name);
    assert.match(d.system.description.instructions, re, name);
  }
  for (const d of docs.values()) {
    assert.deepEqual(d.system.changes, []);
    assert.deepEqual(d.system.contextNotes, []);
    assert.equal(d.flags[moduleId].audit.compatibility, "deferred");
    assert.equal(d.flags[moduleId].audit.changes, "deferred");
  }
});
