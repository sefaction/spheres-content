import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import test, { before } from "node:test";
import { json, moduleId } from "../scripts/lib.mjs";
import { containerTotals } from "../scripts/content.mjs";

let docs, assemblies, evidence;
before(async () => {
  assemblies = await json("config/containers.json");
  evidence = await json("research/physical-items-batch-2-final.json");
  const reviews = Object.values(
    await json("config/physical-item-reviews.json"),
  ).filter((r) => r.productionGroup === "physical-items-batch-2-final");
  assert.equal(reviews.length, 20);
  docs = new Map(
    await Promise.all(
      reviews.map(async (r) => {
        const d = await json(r.output.file);
        return [d.flags[moduleId].sourceKey.split(":").at(-1), d];
      }),
    ),
  );
});
const child = (slug) => {
  const children = Object.values(docs.get(slug).system.items);
  assert.equal(children.length, 1);
  return children[0];
};

test("one magical quill travels in a mundane three-slot case without tripling its value", () => {
  const d = docs.get("quill-of-endless-ink"),
    quill = child("quill-of-endless-ink");
  assert.equal(d.type, "container");
  assert.equal(d.system.cl, 0);
  assert.equal(d.system.price, 0);
  assert.equal(quill.type, "equipment");
  assert.equal(quill.system.cl, 1);
  assert.equal(quill.system.quantity, 1);
  assert.equal(quill.system.price, 80);
  assert.deepEqual(containerTotals(d), { price: 80, weight: 0 });
  assert.deepEqual(assemblies["quill-of-endless-ink"].capacity, {
    quillSlots: 3,
  });
  assert.notEqual(d.img, quill.img);
  assert.match(
    quill.system.description.instructions,
    /One quill is bundled, not three/,
  );
});

test("medical supplies spend kit uses without consuming a ten-item stack or refreshing away from the bag", () => {
  const d = docs.get("medic-satchel"),
    supplies = child("medic-satchel");
  assert.equal(d.type, "container");
  assert.equal(supplies.type, "consumable");
  assert.equal(supplies.system.quantity, 1);
  assert.equal(supplies.system.uses.value, 10);
  assert.equal(supplies.system.uses.per, "charges");
  assert.equal(supplies.system.uses.maxFormula, "10");
  assert.deepEqual(
    supplies.system.actions.map((a) => [
      a.activation.type,
      a.uses.autoDeductChargesCost,
    ]),
    [
      ["nonaction", "1"],
      ["special", "0"],
    ],
  );
  assert.deepEqual(containerTotals(d), { price: 250, weight: 1 });
  assert.deepEqual(supplies.system.changes, []);
  assert.deepEqual(supplies.system.scriptCalls, []);
  assert.match(
    supplies.system.description.instructions,
    /no automatic daily refill away from its bag/,
  );
  assert.match(
    assemblies["medic-satchel"].allocationReason,
    /not a weightless-supplies ruling/,
  );
});

test("spatial containers preserve different capacity units and do not fabricate contents or weight exemptions", () => {
  for (const slug of ["keyhome", "pocket-of-holding"]) {
    const d = docs.get(slug);
    assert.equal(d.type, "container");
    assert.deepEqual(d.system.items, {});
    assert.deepEqual(d.system.actions, []);
    assert.deepEqual(d.system.weight.reduction, { value: 0, percent: 0 });
  }
  assert.equal(docs.get("keyhome").system.maxWeight, null);
  assert.deepEqual(assemblies.keyhome.capacity, {
    tenFootCubes: 10,
    doorwayFeet: 10,
  });
  assert.equal(docs.get("pocket-of-holding").system.maxWeight, 10);
  assert.deepEqual(assemblies["pocket-of-holding"].capacity, {
    cubicFeet: 1,
    pounds: 10,
  });
  const patch = docs.get("patch-hole");
  assert.equal(patch.type, "equipment");
  assert.equal(patch.system.uses.per, "day");
  assert.equal(patch.system.uses.value, 3);
  assert.equal(patch.system.actions[0].activation.type, "standard");
  assert.equal(patch.system.actions[0].uses.autoDeductChargesCost, "1");
  assert.deepEqual(patch.system.actions[0].duration, {
    value: "1",
    units: "minute",
  });
  assert.match(
    patch.system.description.instructions,
    /temporary gap through an existing surface/,
  );
});

test("thread uses remaining feet and unknown handling times stay Special", () => {
  const cuffs = docs.get("seamstress-cuffs");
  assert.equal(cuffs.system.uses.value, 400);
  assert.equal(cuffs.system.uses.per, "day");
  assert.equal(cuffs.system.uses.autoDeductChargesCost, "0");
  assert.equal(cuffs.system.actions[0].uses.autoDeductChargesCost, "0");
  assert.match(
    cuffs.system.description.instructions,
    /remaining feet, not activations/,
  );
  assert.equal(cuffs.system.price, 150);
  for (const slug of [
    "seamstress-cuffs",
    "miniature-orrery",
    "headband-of-psionic-reach",
  ]) {
    assert.equal(docs.get(slug).system.actions[0].activation.type, "special");
  }
  assert.deepEqual(
    docs.get("force-hook").system.actions.map((a) => a.activation.type),
    ["move", "move", "free"],
  );
  assert.deepEqual(docs.get("lantern-of-full-sight").system.actions, []);
});

test("conditional effects, external spell points and source aura contradictions are explicit", () => {
  for (const d of docs.values()) {
    assert.deepEqual(d.system.changes, []);
    assert.deepEqual(d.system.contextNotes, []);
    assert.deepEqual(d.system.scriptCalls, []);
    if (d.flags[moduleId].sourceKey.endsWith(":patch-hole")) continue;
    for (const a of d.system.actions)
      assert.equal(a.uses.autoDeductChargesCost, "0");
  }
  for (const [slug, cl] of [
    ["field-researchers-lenses", 10],
    ["gentle-shade-trinket", 7],
  ]) {
    const d = docs.get(slug);
    assert.equal(d.system.cl, cl);
    assert.match(d.system.description.value, /faint/);
    assert.match(d.system.description.instructions, /issue #31/);
  }
  assert.equal(docs.get("rod-of-lifegiving").system.price, 72000);
  assert.match(
    docs.get("rod-of-lifegiving").system.description.instructions,
    /only while actually held/,
  );
  assert.match(
    docs.get("grig-fiddle").system.description.instructions,
    /actual Perform \(strings\) ranks/,
  );
});

test("all twenty retain their independently recorded original bodies and stable identities", () => {
  assert.equal(evidence.entries.length, 20);
  for (const e of evidence.entries) {
    const d = docs.get(e.sourceKey.split(":").at(-1));
    assert.equal(d._id, e.id);
    assert.equal(d.flags[moduleId].sourceSha256, e.sourceSha256);
    assert.equal(d.flags[moduleId].descriptionSha256, e.descriptionSha256);
    assert.equal(
      createHash("sha256").update(d.system.description.value).digest("hex"),
      e.originalBodySha256,
    );
    assert.equal(d.flags[moduleId].audit.image, "implemented");
  }
});
