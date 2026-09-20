import assert from "node:assert/strict";
import test from "node:test";
import { json, moduleId } from "../scripts/lib.mjs";
import { validateEntity, validateContentCatalog } from "../scripts/content.mjs";

test("pilot source, pack, provenance and image inventories agree", async () => {
  const { docs } = await validateContentCatalog();
  assert.deepEqual(
    docs.map(({ doc }) => [doc.name, doc.type]).sort(),
    [
      ["Extra Magic Talent", "feat"],
      ["Favorite Tools", "feat"],
      ["Incanter", "class"],
      ["Kit, Lycanthrope Hunter’s", "loot"],
    ].sort(),
  );
  const feat = docs.find(({ doc }) => doc.type === "feat").doc;
  assert.match(feat.system.description.value, /effects stack/);
  const item = docs.find(({ doc }) => doc.type === "loot").doc;
  assert.equal(item.system.price, 80);
  assert.equal(item.system.weight.value, 4);
  const cls = docs.find(({ doc }) => doc.type === "class").doc;
  assert.equal(cls.system.hd, 6);
  assert.equal(cls.system.skillsPerLevel, 4);
  assert.match(cls.system.description.value, /Table: The Incanter/);
  assert(!cls.system.description.value.includes("<h1>Archetypes</h1>"));
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
