import assert from "node:assert/strict";
import test from "node:test";
import { json, moduleId } from "../scripts/lib.mjs";
import {
  validateEntity,
  validateContentCatalog,
  containerTotals,
} from "../scripts/content.mjs";

test("pilot source, pack, provenance and image inventories agree", async () => {
  const { docs } = await validateContentCatalog();
  assert.deepEqual(
    docs.map(({ doc }) => [doc.name, doc.type]).sort(),
    [
      ["Extra Magic Talent", "feat"],
      ["Favorite Tools", "feat"],
      ["Incanter", "class"],
      ["Kit, Lycanthrope Hunter’s", "container"],
    ].sort(),
  );
  const feat = docs.find(({ doc }) => doc.type === "feat").doc;
  assert.match(feat.system.description.value, /effects stack/);
  const item = docs.find(({ doc }) => doc.type === "container").doc;
  assert.deepEqual(containerTotals(item), { price: 80, weight: 4 });
  assert.equal(Object.keys(item.system.items).length, 4);
  // Foundry persisted these absent defaults during container intake. Keep them
  // explicit so opening/importing the pack does not cause semantic drift.
  assert.equal(item.system.description.unidentified, "");
  assert.deepEqual(item.system.unidentified, { price: 0, name: "" });
  assert.deepEqual(item.system.hp, {});
  assert.deepEqual(item.ownership, { default: 0 });
  assert.equal(item._stats.coreVersion, "13.351");
  for (const key of ["resizing", "timeworn", "artifact", "cursed", "broken"])
    assert.equal(item.system[key], false);
  const cls = docs.find(({ doc }) => doc.type === "class").doc;
  assert.equal(cls.system.hd, 6);
  assert.equal(cls.system.skillsPerLevel, 4);
  assert.match(cls.system.description.value, /Table: The Incanter/);
  assert(!cls.system.description.value.includes("<h1>Archetypes</h1>"));
  // PF1 fills these native defaults when loading all four pilot packs.
  for (const { doc } of docs) {
    assert.deepEqual(doc.ownership, { default: 0 });
    assert.equal(doc._stats.coreVersion, "13.351");
    assert.equal(Object.keys(doc.system.changeFlags).length, 9);
    assert(
      Object.values(doc.system.changeFlags).every((value) => value === false),
    );
    if (doc.type === "feat") {
      assert.equal(doc.system.abilityType, "na");
      assert.equal(doc.system.uses.value, null);
      assert.deepEqual(doc.system.links.charges, []);
    }
  }
  assert.deepEqual(cls.system.fc, {
    hp: { value: 0 },
    skill: { value: 0 },
    alt: { value: 0, notes: "" },
  });
});

test("descriptive-phase gate rejects premature mechanics, broken identity, unsafe HTML and missing art", async () => {
  const original = await json("src/packs/feats/extra-magic-talent.json");
  const identity = (await json("config/identities.json")).find(
    (i) => i.id === original._id,
  );
  const sources = new Map([[original.flags[moduleId].collection, {}]]);
  const assets = new Map([[original.img, {}]]);
  for (const [mutate, expected] of [
    [
      (doc) => doc.system.changes.push({ formula: "2", target: "str" }),
      /changes must remain empty/,
    ],
    [
      (doc) => doc.system.contextNotes.push({ text: "Hidden automation" }),
      /contextNotes must remain empty/,
    ],
    [
      (doc) => (doc.flags[moduleId].sourceKey = "replacement"),
      /Source key changed/,
    ],
    [
      (doc) => (doc.img = "modules/elsewhere/missing.png"),
      /Unregistered image/,
    ],
    [
      (doc) => (doc.system.description.value += "<script>alert(1)</script>"),
      /Unsafe or unreviewed/,
    ],
    [
      (doc) =>
        (doc.system.description.value +=
          '<a href="javascript:alert(1)">bad</a>'),
      /Unsafe description link/,
    ],
    [
      (doc) =>
        (doc.system.description.value +=
          "@UUID[Compendium.missing.pack.Item.abcdefghijklmnop]"),
      /resolution evidence/,
    ],
    [(doc) => (doc.system.subType = "skillTalent"), /unsupported Guile sphere/],
  ]) {
    const doc = structuredClone(original);
    mutate(doc);
    assert.throws(
      () => validateEntity(doc, identity, sources, assets),
      expected,
    );
  }
});

test("container validation rejects missing contents, double counting, broken child identity and unreviewed actions", async () => {
  const { catalog, docs } = await validateContentCatalog();
  const original = docs.find(({ doc }) => doc.type === "container").doc;
  const identity = (await json("config/identities.json")).find(
    (i) => i.id === original._id,
  );
  const containers = await json("config/containers.json");
  const sources = new Map(catalog.sources.map((s) => [s.key, s]));
  const assets = new Map([
    [original.img, {}],
    ...catalog.externalAssets.map((a) => [a.path, a]),
  ]);
  const first = Object.keys(original.system.items)[0];
  const weapon = Object.values(original.system.items).find(
    (i) => i.type === "weapon",
  )._id;
  for (const [mutate, expected] of [
    [(d) => delete d.system.items[first], /contents mismatch/],
    [(d) => (d.system.price = 80), /double-counts/],
    [(d) => (d.system.weight.value = 4), /double-counts/],
    [(d) => (d.system.items[first].system.quantity = 4), /quantity mismatch/],
    [
      (d) => (d.system.items[first]._id = "abcdefghijklmnop"),
      /identity changed/,
    ],
    [
      (d) => (d.system.items[first].img = "modules/pf-content/missing.png"),
      /Unregistered image/,
    ],
    [
      (d) =>
        (d.system.items[weapon].system.actions[0].damage.parts[0].formula =
          "99"),
      /Unreviewed native actions/,
    ],
    [
      (d) => d.system.items[weapon].system.scriptCalls.push({ value: "bad" }),
      /scriptCalls must remain empty/,
    ],
  ]) {
    const doc = structuredClone(original);
    mutate(doc);
    assert.throws(
      () => validateEntity(doc, identity, sources, assets, { containers }),
      expected,
    );
  }
});
