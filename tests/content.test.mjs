import assert from "node:assert/strict";
import test from "node:test";
import { json, moduleId } from "../scripts/lib.mjs";
import {
  validateEntity,
  validateContentCatalog,
  validateProductionBatches,
  validateSupplementLinks,
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

test("physical production batch freezes 100 stable canonical identities", async () => {
  const { docs } = await validateContentCatalog();
  const inventory = await json("config/production-batches.json");
  const batch = inventory.batches["physical-items-batch-1"];
  assert.equal(batch.issue, 15);
  assert.equal(batch.entries.length, 100);
  assert.deepEqual(
    batch.entries.map((entry) => entry.sourceKey),
    batch.entries.map((entry) => entry.sourceKey).toSorted(),
  );
  assert.equal(new Set(batch.entries.map((entry) => entry.id)).size, 100);

  const changed = structuredClone(inventory);
  changed.batches["physical-items-batch-1"].entries[0].id = "0000000000000000";
  assert.throws(
    () => validateProductionBatches(changed, docs),
    /Batch identity changed/,
  );

  const correctedType = structuredClone(inventory);
  correctedType.batches["physical-items-batch-1"].entries[0].type = "weapon";
  assert.doesNotThrow(() => validateProductionBatches(correctedType, docs));
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

test("reviewed context notes are pinned to their stable document identity", async () => {
  const doc = await json(
    "src/packs/items/adventuring-gear/map-tradewind-093b87bddd856b9b.json",
  );
  const identity = (await json("config/identities.json")).find(
    (entry) => entry.id === doc._id,
  );
  const catalog = await json("config/content.json");
  const sources = new Map(
    catalog.sources.map((source) => [source.key, source]),
  );
  const assets = new Map(
    [...catalog.assets, ...catalog.externalAssets].map((asset) => [
      asset.path.replace(/^static\//, `modules/${moduleId}/`),
      asset,
    ]),
  );
  const intakeSources = await json("config/intake-sources.json");
  const changed = structuredClone(doc);
  changed.system.contextNotes[0].text = "+[[6]] circumstance bonus";
  assert.throws(
    () => validateEntity(changed, identity, sources, assets, { intakeSources }),
    /Reviewed context notes changed/,
  );
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

test("reviewed Akashic wondrous items preserve native magic fields without global essence changes", async () => {
  const { docs } = await validateContentCatalog();
  const byId = new Map(docs.map(({ doc }) => [doc._id, doc]));
  const expected = [
    ["7b7a74c15e7ccc13", 5, "nec", "slotless"],
    ["0c1c87ecdd107f28", 1, "uni", "slotless"],
    ["1025cb3f8fc1661f", 5, "enc", "ring"],
    ["1a6640960c79a399", 8, "trs", "slotless"],
  ];

  for (const [id, cl, school, slot] of expected) {
    const item = byId.get(id);
    assert.equal(item.type, "equipment");
    assert.equal(item.system.subType, "wondrous");
    assert.equal(item.system.cl, cl);
    assert.equal(item.system.aura.school, school);
    assert.equal(item.system.slot, slot);
    assert.deepEqual(item.system.changes, []);
  }

  const bloodFunnels = byId.get("7b7a74c15e7ccc13");
  assert.match(bloodFunnels.system.description.value, /moderate necromancy/i);
  assert.equal(
    bloodFunnels.flags["additional-spheres-content"].audit.advanced,
    "deferred",
  );

  const ring = byId.get("1025cb3f8fc1661f");
  assert.equal(ring.system.actions[0].name, "Designate Title Veil");
  assert.equal(ring.system.actions[0].activation.type, "free");
});

test("reviewed alchemical items preserve PF1 consumable profiles and the Hookah supplement link", async () => {
  const { docs } = await validateContentCatalog();
  const byId = new Map(docs.map(({ doc }) => [doc._id, doc]));
  const arcanis = byId.get("22090041e723f52f");
  const blackPowder = byId.get("333c4e288cf41817");
  const catnip = byId.get("0b214a71536b15c7");
  const ethanol = byId.get("12f207bbdd808dd8");
  const fishLiverGrog = byId.get("00090abdbf1b30de");
  const kuoki = byId.get("b40afe6dad77c9e9");
  const liquidLife = byId.get("16cf0db697ea710d");
  const hookah = byId.get("4c8fdb68ad45fb2f");

  assert.equal(arcanis.type, "consumable");
  assert.equal(arcanis.system.subType, "poison");
  assert.equal(arcanis.system.uses.per, "single");
  assert.equal(arcanis.system.actions[0].actionType, "save");
  assert.deepEqual(arcanis.system.actions[0].save, {
    dc: "17",
    type: "fort",
  });
  assert.match(
    arcanis.system.actions[0].notes.effect[0],
    /1\/round for 6 rounds/,
  );

  assert.equal(blackPowder.system.subType, "misc");
  assert.equal(blackPowder.system.uses.per, "charges");
  assert.equal(blackPowder.system.uses.value, 20);
  assert.equal(blackPowder.system.uses.maxFormula, "20");
  assert.equal(blackPowder.system.uses.pricePerUse, 10);
  assert.equal(blackPowder.system.price, 0);
  assert.equal(
    blackPowder.system.price +
      blackPowder.system.uses.value * blackPowder.system.uses.pricePerUse,
    200,
  );
  assert.equal(blackPowder.system.actions[0].name, "Use Dose");
  assert.equal(
    blackPowder.img,
    "icons/commodities/materials/powder-black.webp",
  );
  assert.equal(
    blackPowder.flags["additional-spheres-content"].reuse.sourceUuid,
    "Compendium.pf1.items.Item.trucdntfxjdukrox",
  );

  assert.equal(catnip.system.subType, "drug");
  assert.equal(catnip.system.uses.per, "single");
  assert.equal(catnip.system.actions[0].actionType, "save");
  assert.deepEqual(catnip.system.actions[0].save, {
    dc: "10",
    type: "fort",
  });
  assert.equal(catnip.system.actions[0].notes.effect.length, 3);

  assert.equal(ethanol.system.subType, "misc");
  assert.equal(ethanol.system.uses.per, "single");
  assert.equal(ethanol.system.actions[0].name, "Use as Fuel");

  assert.equal(fishLiverGrog.system.subType, "misc");
  assert.equal(fishLiverGrog.system.uses.per, "single");
  assert.equal(fishLiverGrog.system.actions[0]._id, "943f57b9bab53077");
  assert.equal(fishLiverGrog.system.actions[0].activation.type, "standard");
  assert.match(fishLiverGrog.system.actions[0].notes.effect[0], /restore/i);
  assert.match(fishLiverGrog.system.actions[0].notes.effect[1], /2d6/);
  assert.equal(
    fishLiverGrog.img,
    "modules/additional-spheres-content/icons/items/alchemical-items/fish-liver-grog.webp",
  );

  assert.equal(kuoki.system.subType, "drug");
  assert.equal(kuoki.system.uses.per, "single");
  assert.equal(kuoki.system.actions[0]._id, "a3ff4cadfe783cef");
  assert.equal(kuoki.system.actions[0].activation.type, "standard");
  assert.match(kuoki.system.actions[0].notes.effect[1], /Spirit Sense/i);
  assert.match(kuoki.system.actions[0].notes.effect[1], /1 hour/i);
  assert.equal(
    kuoki.img,
    "modules/additional-spheres-content/icons/items/alchemical-items/kuoki.webp",
  );

  assert.equal(liquidLife.system.subType, "drug");
  assert.equal(liquidLife.system.uses.per, "single");
  assert.equal(liquidLife.system.actions[0]._id, "826ed675a56fd7ac");
  assert.equal(liquidLife.system.actions[0].activation.type, "standard");
  assert.match(liquidLife.system.actions[0].notes.effect[0], /3d6/);
  assert.match(
    liquidLife.system.actions[0].notes.effect[0],
    /currently has in damage/i,
  );
  assert.match(liquidLife.system.actions[0].notes.effect[1], /fatigued/i);
  assert.match(liquidLife.system.actions[0].notes.effect[2], /1 hour/i);
  assert.equal(
    liquidLife.img,
    "modules/additional-spheres-content/icons/items/alchemical-items/liquid-life.webp",
  );

  for (const item of [
    arcanis,
    blackPowder,
    catnip,
    ethanol,
    fishLiverGrog,
    kuoki,
    liquidLife,
  ]) {
    assert.deepEqual(item.system.changes, []);
    assert.deepEqual(item.system.contextNotes, []);
  }

  assert.deepEqual(hookah.system.links.supplements, [
    {
      name: "Catnip",
      uuid: "Compendium.additional-spheres-content.items.Item.0b214a71536b15c7",
    },
  ]);

  const broken = structuredClone(docs);
  broken.find(
    ({ doc }) => doc._id === hookah._id,
  ).doc.system.links.supplements[0].uuid =
    "Compendium.additional-spheres-content.items.Item.0000000000000000";
  assert.throws(() => validateSupplementLinks(broken), /Unresolved/);
});

test("reviewed planar power components preserve dose and focus rules without global modifiers", async () => {
  const { docs } = await validateContentCatalog();
  const byId = new Map(docs.map(({ doc }) => [doc._id, doc]));
  const expected = [
    [
      "76bd3b56ee90b98f",
      60,
      "brimstone-briquette.webp",
      /increase the burning damage dealt each round/i,
    ],
    [
      "95cc514580cfdf9c",
      75,
      "inversion-prism.webp",
      /dark or light descriptor/i,
    ],
    [
      "7312577d2f2246b4",
      100,
      "iridium-jellenate.webp",
      /increase the hardness of each created object/i,
    ],
  ];

  for (const [id, price, imageName, rule] of expected) {
    const item = byId.get(id);
    assert.equal(item.type, "loot");
    assert.equal(item.system.subType, "gear");
    assert.equal(item.system.price, price);
    assert.equal(item.system.weight.value, 0);
    assert.equal(item.system.uses.per, "");
    assert.deepEqual(item.system.actions, []);
    assert.deepEqual(item.system.changes, []);
    assert.deepEqual(item.system.contextNotes, []);
    assert.match(item.system.description.value, /<strong>Doses<\/strong> 1/);
    assert.match(item.system.description.value, /<strong>Focus<\/strong>/);
    assert.match(item.system.description.value, rule);
    assert.equal(
      item.img,
      `modules/additional-spheres-content/icons/items/equipment/${imageName}`,
    );
  }
});
