import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import test, { before } from "node:test";
import { json, moduleId } from "../scripts/lib.mjs";

let docs, evidence;
before(async () => {
  evidence = await json("research/physical-items-batch-3-charms.json");
  const rows = Object.values(
    await json("config/physical-item-reviews.json"),
  ).filter((r) => r.productionGroup === "physical-items-batch-3-charms");
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
const changes = (slug) =>
  docs
    .get(slug)
    .system.changes.map(({ target, type, formula }) => [target, type, formula]);

test("six ability charms use source +2 tiers and market prices without permanent base edits", () => {
  for (const [slug, ability, slot] of [
    ["belt-of-avian-speed", "dex", "belt"],
    ["belt-of-mountains", "con", "belt"],
    ["belt-of-wild-might", "str", "belt"],
    ["headband-of-alluring-magnetism", "cha", "headband"],
    ["headband-of-genius", "int", "headband"],
    ["headband-of-sages", "wis", "headband"],
  ]) {
    const d = docs.get(slug);
    assert.deepEqual(changes(slug), [[ability, "enh", "2"]]);
    assert.equal(d.system.price, 4000);
    assert.equal(d.system.weight.value, 2);
    assert.equal(d.system.cl, 4);
    assert.equal(d.system.slot, slot);
    assert.match(
      d.system.description.instructions,
      /temporary for the first twenty-four/,
    );
    assert.match(d.system.description.instructions, /issue #37/);
  }
  assert.equal(evidence.priceCorrections.entries.length, 6);
  const genius = docs.get("headband-of-genius");
  assert.match(
    genius.system.description.instructions,
    /one associated skill must be chosen/,
  );
  assert.match(
    genius.system.description.instructions,
    /source grants ranks equal to character level/,
  );
  assert.equal(genius.flags[moduleId].audit.links, "deferred");
});

test("base natural armor competes separately from enhancement to natural armor", () => {
  assert.deepEqual(changes("necklace-of-natural-armor"), [
    ["nac", "base", "1"],
  ]);
  assert.deepEqual(changes("ironside-ring"), [
    ["con", "enh", "4"],
    ["nac", "base", "2"],
    ["cmd", "enh", "4"],
  ]);
  assert.deepEqual(changes("talisman-of-techniques"), [["nac", "enh", "1"]]);
  assert.deepEqual(changes("pugilists-charm"), [
    ["nattack", "enh", "1"],
    ["ndamage", "enh", "1"],
    ["nac", "enh", "1"],
  ]);
});

test("typed AC inherits CMD once and saving throw bonus types stay separate", () => {
  assert.deepEqual(changes("aegis-ring"), [["ac", "deflection", "1"]]);
  assert.deepEqual(changes("blessing-of-the-fates"), [["ac", "luck", "1"]]);
  assert.deepEqual(changes("ring-of-shielding"), [
    ["ac", "deflection", "1"],
    ["allSavingThrows", "resist", "1"],
  ]);
  assert.deepEqual(changes("cape-of-resistance"), [
    ["allSavingThrows", "resist", "1"],
  ]);
  assert.deepEqual(changes("fragment-of-destiny"), [
    ["allSavingThrows", "luck", "1"],
  ]);
  for (const slug of ["blessing-of-the-fates", "fragment-of-destiny"]) {
    assert.equal(docs.get(slug).system.slot, "neck");
    assert.match(
      docs.get(slug).flags[moduleId].selectedVariant,
      /occupied magical item slot/,
    );
  }
});

test("crafted choices and conditional defenses do not become global bonuses or double pairs", () => {
  for (const slug of [
    "gauntlet-of-maneuvers",
    "energy-resisting-ring",
    "dimlight-veil",
    "gloves-of-air-mastery",
  ]) {
    assert.deepEqual(changes(slug), []);
    assert.equal(docs.get(slug).system.quantity, 1);
  }
  const gauntlet = docs.get("gauntlet-of-maneuvers");
  assert.equal(gauntlet.system.weight.value, 1);
  assert.deepEqual(
    gauntlet.system.contextNotes.map((n) => n.target),
    ["cmb", "cmd"],
  );
  assert.match(gauntlet.flags[moduleId].selectedVariant, /not selected/);
  assert.deepEqual(
    docs.get("talisman-of-techniques").system.contextNotes.map((n) => n.target),
    ["cmb"],
  );
  const air = docs.get("gloves-of-air-mastery");
  assert.match(
    air.system.contextNotes.find((n) => n.target === "cmd").text,
    /against bull rush continuously/,
  );
  assert.match(air.flags[moduleId].selectedVariant, /lesser 4000 gp/);
  const energy = docs.get("energy-resisting-ring");
  assert.equal(energy.system.price, 12000);
  assert.equal(energy.system.cl, 1);
  assert.match(energy.flags[moduleId].selectedVariant, /energy not selected/);
  const veil = docs.get("dimlight-veil");
  assert.match(veil.system.contextNotes[0].text, /Against Light effects only/);
  assert.deepEqual(veil.system.changeFlags, energy.system.changeFlags);
});

test("Pugilist charm separates native natural attacks from manual unarmed coverage", () => {
  const d = docs.get("pugilists-charm");
  assert.equal(d.flags[moduleId].audit.advanced, "deferred");
  assert.match(
    d.system.description.instructions,
    /core Unarmed Strike has weapon subtype/,
  );
  assert.match(d.system.description.instructions, /issue #38/);
  assert.equal(d.system.contextNotes[0].target, "mattack");
  assert.match(d.system.contextNotes[0].text, /Unarmed strikes only/);
  assert(
    !d.system.changes.some((c) =>
      ["attack", "wattack", "mattack", "damage", "wdamage"].includes(c.target),
    ),
  );
});

test("base Umbral Mantle retains its aura discrepancy without granting higher-tier concealment", () => {
  const d = docs.get("umbral-mantle");
  assert.deepEqual(changes("umbral-mantle"), [
    ["allSavingThrows", "resist", "1"],
  ]);
  assert.equal(d.system.cl, 3);
  assert.equal(d.system.price, 1500);
  assert.equal(d.system.weight.value, 0.5);
  assert.deepEqual(d.system.actions, []);
  assert.equal(d.system.uses.per, "");
  assert.match(d.system.description.value, /moderate Dark/);
  assert.match(d.system.description.instructions, /issue #31/);
  assert.match(d.system.description.instructions, /No base-price concealment/);
});

test("twenty charms retain independently recorded full bodies and stable identities without world scripts", () => {
  assert.equal(evidence.entries.length, 20);
  for (const e of evidence.entries) {
    const d = docs.get(e.sourceKey.split(":").at(-1));
    assert.equal(d._id, e.id);
    assert.equal(d.flags[moduleId].descriptionSha256, e.descriptionSha256);
    assert.equal(d.flags[moduleId].sourceSha256, e.pageSha256);
    assert.equal(
      createHash("sha256").update(d.system.description.value).digest("hex"),
      e.originalBodySha256,
    );
    assert.deepEqual(d.system.actions, []);
    assert.deepEqual(d.system.scriptCalls, []);
    assert.equal(d.flags[moduleId].audit.image, "implemented");
    assert.equal(d.flags[moduleId].audit.compatibility, "deferred");
  }
});
