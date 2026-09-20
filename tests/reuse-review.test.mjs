import assert from "node:assert/strict";
import test from "node:test";
import {
  findReuseCandidates,
  reviewIsCurrent,
  validateReviewOutput,
} from "../scripts/reuse-review.mjs";
import { reuseRecord } from "../scripts/reuse-index.mjs";
import { json } from "../scripts/lib.mjs";
import { containerTotals } from "../scripts/content.mjs";

test("reuse search finds reordered names without accepting a different variant", () => {
  const entries = [
    { name: "Sash, Adventurer's", uuid: "a" },
    { name: "Adventurer's sash", uuid: "b" },
    { name: "Sash of the War Champion", uuid: "c" },
  ];
  assert.deepEqual(
    findReuseCandidates("Adventurer\u2019s Sash", entries).map((r) => [
      r.uuid,
      r.match,
    ]),
    [
      ["a", "reordered-name"],
      ["b", "normalized-name"],
    ],
  );
  assert.equal(
    findReuseCandidates("Scarf, Filter", [{ name: "Filter scarf", uuid: "d" }])
      .length,
    1,
  );
  assert.equal(
    findReuseCandidates("Parasol, umbrella", [
      { name: "Parasol, common", uuid: "e" },
    ]).length,
    0,
  );
  assert(
    reuseRecord(
      {
        name: "Weapon",
        _id: "a",
        system: {
          description: {
            unidentified:
              "A complete superficial weapon description with rules.",
          },
        },
      },
      { provider: "pf1", version: "11.11", pack: "weapons" },
    ).hasDescription,
  );
});

test("reuse decisions become stale when source text, provider, or candidate set changes", () => {
  const entity = { pageSha256: "page", descriptionSha256: "text" };
  const candidates = [{ uuid: "a", version: "11.11", sha256: "record" }];
  const review = { ...entity, candidates: structuredClone(candidates) };
  assert(reviewIsCurrent(review, entity, candidates));
  assert(
    !reviewIsCurrent(
      review,
      { ...entity, descriptionSha256: "new" },
      candidates,
    ),
  );
  assert(
    !reviewIsCurrent(review, entity, [{ ...candidates[0], version: "new" }]),
  );
  assert(
    !reviewIsCurrent(review, entity, [{ ...candidates[0], sha256: "new" }]),
  );
  assert(!reviewIsCurrent(review, entity, [...candidates, { uuid: "b" }]));
});

test("reviewed mundane gear preserves identity and models a usable empty sash", async () => {
  const sash = await json(
    "src/packs/items/adventuring-gear/adventurers-sash-ef882e32e6e874ce.json",
  );
  const scarf = await json(
    "src/packs/items/adventuring-gear/filter-scarf-0cba0b7e168525a3.json",
  );
  const umbrella = await json(
    "src/packs/items/technological-gear/parasol-umbrella-268bc2adc8df9bdd.json",
  );
  assert.equal(sash._id, "ef882e32e6e874ce");
  const reviews = await json("config/physical-item-reviews.json");
  const review = reviews[sash.flags["additional-spheres-content"].sourceKey];
  validateReviewOutput(review, sash);
  const altered = structuredClone(sash);
  altered.system.price = 200;
  assert.throws(
    () => validateReviewOutput(review, altered),
    /physical content changed/,
  );
  assert.equal(sash.type, "container");
  assert.deepEqual(sash.system.items, {});
  assert.deepEqual(containerTotals(sash), { price: 20, weight: 3 });
  // The sewn-in pouches are the container, not six extra paid contents.
  sash.system.items.test = {
    system: { price: 2, weight: { value: 1 }, quantity: 3 },
  };
  assert.deepEqual(containerTotals(sash), { price: 26, weight: 6 });
  assert.equal(scarf.type, "equipment");
  assert.equal(scarf.system.subType, "clothing");
  assert.equal(scarf.system.slot, "clothing");
  assert.equal(scarf.system.equipmentSubtype, "");
  assert.equal(scarf.system.armor.value, 0);
  assert.equal(scarf.system.price, 5);
  assert.equal(umbrella.system.price, 2);
  assert.equal(umbrella.system.weight.value, 3);
  assert.match(umbrella.system.description.value, /Device Schematic/);
  assert.match(
    umbrella.system.description.value,
    /keeps the affected creature dry/,
  );
  for (const doc of [sash, scarf, umbrella]) {
    assert.deepEqual(doc.system.changes, []);
    assert.deepEqual(doc.system.contextNotes, []);
    assert.deepEqual(doc.system.actions, []);
    assert.equal(
      doc.flags["additional-spheres-content"].audit.image,
      "implemented",
    );
  }
});
