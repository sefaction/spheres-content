import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import test, { before } from "node:test";
import { json, moduleId } from "../scripts/lib.mjs";

let docs, evidence;
before(async () => {
  evidence = await json("research/physical-items-batch-3-charms-2.json");
  const rows = Object.values(
    await json("config/physical-item-reviews.json"),
  ).filter((r) => r.productionGroup === "physical-items-batch-3-charms-2");
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

test("conditional charms preserve complete source bodies without blanket actor effects", () => {
  for (const f of evidence.entries) {
    const d = docs.get(f.sourceKey.split(":").at(-1));
    assert.equal(
      createHash("sha256").update(d.system.description.value).digest("hex"),
      f.originalBodySha256,
    );
    assert.deepEqual(d.system.changes, []);
    assert.deepEqual(d.system.scriptCalls, []);
    assert.deepEqual(d.effects, []);
    assert.equal(d._id, f.id);
    assert.equal(d.system.quantity, 1);
  }
  const uniform = docs.get("academy-uniform");
  assert.equal(uniform.system.price, 10);
  assert.match(
    uniform.system.description.instructions,
    /base bauble tier has no skill bonus/,
  );
});

test("daily pools and rolling Remnant limits remain distinct and spend actual uses", () => {
  for (const [slug, max] of [
    ["ring-of-clarity", 1],
    ["ring-of-force-armor", 2],
    ["ring-of-potential-realized", 1],
  ]) {
    const { uses, actions } = docs.get(slug).system;
    assert.equal(uses.per, "day");
    assert.equal(uses.value, max);
    assert.equal(uses.maxFormula, String(max));
    assert.equal(actions[0].uses.autoDeductChargesCost, "1");
  }
  const remnant = docs.get("remnant-of-courage").system;
  assert.equal(remnant.uses.per, "charges");
  assert.equal(remnant.uses.maxFormula, "1");
  assert.match(remnant.actions[0].notes.effect[0], /never yourself/);
  assert.match(
    remnant.actions[0].notes.effect[0],
    /same user cannot activate any other remnant/,
  );
  assert.match(remnant.actions[0].notes.effect[0], /no dawn\/rest reset/);
  const force = docs.get("ring-of-force-armor").system.actions[0];
  assert.match(force.notes.effect[0], /Failure wastes this use/);
  assert.deepEqual(force.duration, { value: "4", units: "hour" });
  assert.equal(
    docs.get("ring-of-potential-realized").system.actions[0].activation.type,
    "nonaction",
  );
});

test("external channel and mythic costs do not create free internal pools", () => {
  for (const slug of ["divine-symbol", "fox-medallion"]) {
    assert.equal(docs.get(slug).system.uses.per, "");
    assert.equal(
      docs.get(slug).system.actions[0].uses.autoDeductChargesCost,
      "0",
    );
  }
  assert.match(
    docs.get("divine-symbol").system.actions[0].notes.effect[0],
    /expend one actual channel-energy use/,
  );
  const fox = docs.get("fox-medallion").system;
  assert.equal(fox.slot, "neck");
  assert.equal(fox.actions[0].activation.type, "immediate");
  assert.match(
    fox.actions[0].notes.effect[0],
    /spend one actual use of mythic power/,
  );
});

test("SR price, cursed item, physical form and unresolved beneficiary stay explicit", () => {
  const talisman = docs.get("talisman-of-spell-resistance").system;
  assert.equal(talisman.price, 30000);
  assert.match(talisman.contextNotes[0].text, /instead of adding fifteen/);
  assert.equal(evidence.priceCorrections.entries.length, 1);
  assert.equal(evidence.priceCorrections.entries[0].from, 15000);
  assert.equal(docs.get("amulet-of-emotional-weather").system.cursed, true);
  const gloves = docs.get("forgers-gloves").system;
  assert.match(gloves.contextNotes[0].text, /beneficiary is ambiguous/);
  assert.match(gloves.description.instructions, /issue #42/);
  assert.equal(docs.get("constellation-belt").type, "equipment");
  assert.equal(docs.get("constellation-belt").system.slot, "belt");
  assert.equal(docs.get("vest-of-shape-stabilization").system.slot, "body");
});

test("unselected crafted variants and restricted talent notes grant no unrelated bonuses", () => {
  const note = (slug) =>
    docs
      .get(slug)
      .system.contextNotes.map((n) => n.text)
      .join(" ");
  assert.match(note("intensifying-gloves"), /single crafted energy/);
  assert.match(note("intensifying-gloves"), /Does not ignore immunity/);
  assert.match(note("gloves-of-unseen-grip"), /not global defensive CMD/);
  assert.match(note("targeting-monocle"), /Destructive-blast attacks only/);
  assert.match(note("taskmind"), /never raises the maximum size of one object/);
  assert.match(
    note("vest-of-shape-stabilization"),
    /single crafted transformation/,
  );
  assert.equal(
    [...docs.values()].reduce((n, d) => n + d.system.actions.length, 0),
    14,
  );
});
