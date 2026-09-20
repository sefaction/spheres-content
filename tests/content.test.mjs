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
    docs
      .filter(
        ({ doc }) =>
          doc.flags[moduleId].collection === "wiki-selected-open-rules",
      )
      .map(({ doc }) => [doc.name, doc.type])
      .sort(),
    [
      ["Extra Magic Talent", "feat"],
      ["Favorite Tools", "feat"],
      ["Incanter", "class"],
      ["Kit, Lycanthrope Hunter’s", "container"],
    ].sort(),
  );
  const feat = docs.find(({ doc }) => doc._id === "54e7f57ef4ba6758").doc;
  assert.match(feat.system.description.value, /effects stack/);
  const item = docs.find(({ doc }) => doc._id === "5feccdaf3cbf89f1").doc;
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
  const cls = docs.find(({ doc }) => doc._id === "79f2b00d8e374366").doc;
  assert.equal(cls.system.hd, 6);
  assert.equal(cls.system.skillsPerLevel, 4);
  assert.match(cls.system.description.value, /Table: The Incanter/);
  assert(!cls.system.description.value.includes("<h1>Archetypes</h1>"));
  // PF1 fills these native defaults when loading all four pilot packs.
  for (const { doc } of docs) {
    assert.deepEqual(doc.ownership, { default: 0 });
    assert.equal(doc._stats.coreVersion, "13.351");
    // PF1 11.11 consumables do not include the native changes template.
    if (doc.type === "consumable")
      assert.equal(doc.system.changeFlags, undefined);
    else {
      assert.equal(Object.keys(doc.system.changeFlags).length, 9);
      assert(
        Object.values(doc.system.changeFlags).every((value) => value === false),
      );
    }
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
  const original = docs.find(({ doc }) => doc._id === "5feccdaf3cbf89f1").doc;
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

test("reviewed Hidden Blade and Trail Rations use pinned native PF1 profiles", async () => {
  const { catalog, docs } = await validateContentCatalog();
  const identities = await json("config/identities.json");
  const intakeSources = await json("config/intake-sources.json");
  const sources = new Map(
    catalog.sources.map((source) => [source.key, source]),
  );
  const assets = new Map(
    catalog.externalAssets.map((asset) => [asset.path, asset]),
  );
  const hiddenBlade = docs.find(
    ({ doc }) => doc._id === "8f74960ccb773c7e",
  ).doc;
  const rations = docs.find(({ doc }) => doc._id === "56f77eba420e100d").doc;

  assert.equal(hiddenBlade.type, "weapon");
  assert.equal(hiddenBlade.system.enh, 3);
  assert.equal(hiddenBlade.system.cl, 10);
  assert.deepEqual(hiddenBlade.system.baseTypes, ["Longsword"]);
  assert.equal(hiddenBlade.system.actions[0].ability.critRange, 19);
  assert.equal(
    hiddenBlade.system.actions[0].damage.parts[0].formula,
    "sizeRoll(1, 8, @size)",
  );
  assert.match(hiddenBlade.system.description.value, /\+3 Illusion implement/);
  assert.equal(
    hiddenBlade.flags["additional-spheres-content"].automation,
    "reviewed",
  );
  assert.deepEqual(hiddenBlade.system.changes, [
    {
      formula: "3",
      operator: "add",
      target: "sphereclIllusion",
      priority: 0,
      type: "enh",
      _id: "1a4d7dc248628a3a",
    },
  ]);

  assert.equal(rations.type, "consumable");
  assert.equal(rations.system.subType, "misc");
  assert.equal(rations.system.uses.per, "single");
  assert.equal(rations.system.uses.pricePerUse, 0);
  assert.equal(rations.system.actions[0].name, "Use");
  assert.equal(rations.system.equipped, true);

  for (const original of [hiddenBlade, rations]) {
    const changed = structuredClone(original);
    changed.system.actions[0].name = "Unreviewed";
    const identity = identities.find((entry) => entry.id === original._id);
    assert.throws(
      () =>
        validateEntity(changed, identity, sources, assets, { intakeSources }),
      /Unreviewed native actions/,
    );
  }

  const changed = structuredClone(hiddenBlade);
  changed.system.changes[0].formula = "4";
  const hiddenBladeIdentity = identities.find(
    (entry) => entry.id === hiddenBlade._id,
  );
  assert.throws(
    () =>
      validateEntity(changed, hiddenBladeIdentity, sources, assets, {
        intakeSources,
      }),
    /Reviewed Changes changed/,
  );
});
