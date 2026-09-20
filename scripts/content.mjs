import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { load } from "cheerio";
import { files, json, moduleId, safeRelative } from "./lib.mjs";

const idPattern = /^[a-zA-Z0-9]{16}$/;
export const stableId = (key) =>
  createHash("sha256").update(key).digest("hex").slice(0, 16);
const hash = (data) => createHash("sha256").update(data).digest("hex");

export function validateEntity(doc, identity, sources, assets, options = {}) {
  assert(idPattern.test(doc._id), "Invalid document ID");
  if (options.contained)
    assert.equal(doc._key, undefined, "Contained compiler key");
  else
    assert.equal(doc._key, `!items!${doc._id}`, "Compiler identity mismatch");
  assert(doc.name?.trim(), "Missing name");
  assert(
    ["feat", "class", "loot", "container", "consumable", "weapon"].includes(
      doc.type,
    ),
    "PF1 type needs a reviewed schema profile",
  );
  assert.equal(
    doc.folder,
    null,
    "Folder support requires a reviewed folder inventory",
  );
  assert.deepEqual(doc.effects, [], "Effects are deferred");
  const meta = doc.flags?.[moduleId];
  assert(
    meta && meta.phase === "descriptive",
    "Missing descriptive-phase metadata",
  );
  assert.equal(
    identity?.id,
    doc._id,
    "Stable identity changed or is unregistered",
  );
  assert.equal(identity?.sourceKey, meta.sourceKey, "Source key changed");
  assert(sources.has(meta.collection), "Unreviewed source collection");
  assert(/^https?:\/\//.test(meta.sourceUrl), "Missing source provenance");
  assert(
    /^[0-9a-f]{64}$/.test(meta.sourceSha256),
    "Missing source snapshot hash",
  );
  assert.equal(
    meta.automation,
    "not-reviewed",
    "Mechanics are deferred until the descriptive catalog is reviewed",
  );
  assert(assets.has(doc.img), "Unregistered image");
  const s = doc.system;
  assert(
    s &&
      typeof s.description?.value === "string" &&
      s.description.value.length > 30,
    "Missing description",
  );
  for (const name of ["changes", "contextNotes", "scriptCalls"])
    assert.deepEqual(
      s[name],
      [],
      `${name} must remain empty during the descriptive phase`,
    );
  if (options.contained) {
    assert.equal(
      hash(JSON.stringify(s.actions)),
      identity.actionsSha256,
      "Unreviewed native actions",
    );
    assert.equal(
      meta.sourceUuid,
      identity.sourceUuid,
      "Reused source UUID changed",
    );
    assert.equal(
      meta.sourceSha256,
      identity.sourceSha256,
      "Reused snapshot changed",
    );
    assert.equal(doc.type, identity.type, "Contained item type changed");
  } else
    assert.deepEqual(
      s.actions,
      [],
      "actions must remain empty during the descriptive phase",
    );
  assert(
    !Object.values(s.changeFlags ?? {}).some(Boolean),
    "Passive flags are deferred",
  );
  assert(
    !doc.flags?.pf1spheres?.casterProgression,
    "Caster progression automation is deferred",
  );
  const $ = load(s.description.value, null, false);
  assert.equal(
    $("script,style,iframe,object,embed,img,form,input").length,
    0,
    "Unsafe or unreviewed description content",
  );
  $("*").each((_, element) => {
    for (const [name, value] of Object.entries(element.attribs)) {
      assert(
        ["href", "colspan", "rowspan"].includes(name),
        `Unreviewed HTML attribute: ${name}`,
      );
      if (name === "href")
        assert(
          ["http:", "https:"].includes(new URL(value).protocol),
          "Unsafe description link",
        );
    }
  });
  assert(
    !/@(?:UUID|Compendium)\[/.test(s.description.value),
    "Compendium references require registered resolution evidence",
  );
  if (doc.type === "feat") {
    assert(
      ["feat", "skillTalent"].includes(s.subType),
      "Additional feat subtype needs a reviewed profile",
    );
    if (s.subType === "skillTalent")
      assert(
        [
          "artifice",
          "bluster",
          "bodyControl",
          "communication",
          "faction",
          "herbalism",
          "infiltration",
          "investigation",
          "navigation",
          "performance",
          "spellhacking",
          "study",
          "subterfuge",
          "survivalism",
          "vocation",
        ].includes(doc.flags?.pf1spheres?.sphere),
        "Missing or unsupported Guile sphere",
      );
    assert.equal(typeof s.disabled, "boolean");
  } else if (doc.type === "class") {
    assert.equal(s.subType, "base");
    assert.equal(s.level, 1);
    assert([4, 6, 8, 10, 12].includes(s.hd), "Invalid hit die");
    assert(
      ["low", "med", "high"].includes(s.bab),
      "Invalid PF1 BAB progression",
    );
    assert(Number.isInteger(s.skillsPerLevel) && s.skillsPerLevel >= 0);
    for (const save of ["fort", "ref", "will"])
      assert(
        ["low", "high"].includes(s.savingThrows?.[save]?.value),
        "Invalid save progression",
      );
    assert.deepEqual(
      s.links?.classAssociations,
      [],
      "Automatic class associations are deferred",
    );
  } else {
    if (doc.type === "loot") assert.equal(s.subType, "gear");
    if (doc.type === "consumable")
      assert(["misc", "potion"].includes(s.subType));
    if (doc.type === "weapon") {
      assert.equal(s.subType, "simple");
      assert.equal(s.weaponSubtype, "light");
      assert.deepEqual(s.material.addon, ["alchemicalSilver"]);
    }
    assert(Number.isFinite(s.price) && s.price >= 0);
    assert(Number.isFinite(s.weight?.value) && s.weight.value >= 0);
    assert(Number.isInteger(s.quantity) && s.quantity > 0);
    if (doc.type === "container") {
      assert(!options.contained, "Nested containers require review");
      const assembly = options.containers?.[meta.assembly];
      assert(
        assembly && assembly.containerId === doc._id,
        "Unregistered container assembly",
      );
      assert.equal(assembly.sourceKey, meta.sourceKey);
      assert.equal(s.quantity, 1);
      assert.equal(
        s.price,
        assembly.empty.price,
        "Empty container price double-counts contents",
      );
      assert.equal(
        s.weight.value,
        assembly.empty.weight,
        "Empty container weight double-counts contents",
      );
      assert.deepEqual(s.weight.reduction, { value: 0, percent: 0 });
      assert.deepEqual(s.currency, { pp: 0, gp: 0, sp: 0, cp: 0 });
      assert.equal(s.maxWeight, null, "Unreviewed capacity");
      assert.deepEqual(
        Object.keys(s.items).sort(),
        assembly.contents.map((c) => c.id).sort(),
        "Container contents mismatch",
      );
      const ids = new Set([doc._id]);
      const keys = new Set([meta.sourceKey]);
      for (const child of assembly.contents) {
        assert(
          !ids.has(child.id) && !keys.has(child.sourceKey),
          "Duplicate contained identity",
        );
        ids.add(child.id);
        keys.add(child.sourceKey);
        const item = s.items[child.id];
        validateEntity(item, child, sources, assets, { contained: true });
        assert.equal(
          item.system.quantity,
          child.quantity,
          "Contained quantity mismatch",
        );
        assert.equal(
          item.system.price,
          child.price,
          "Contained price mismatch",
        );
        assert.equal(
          item.system.weight.value,
          child.weight,
          "Contained weight mismatch",
        );
      }
      assert.deepEqual(
        containerTotals(doc),
        assembly.totals,
        "Container totals mismatch",
      );
    }
  }
}

export function containerTotals(doc) {
  const s = doc.system;
  return Object.values(s.items).reduce(
    (total, { system: child }) => ({
      price: total.price + child.price * child.quantity,
      weight: total.weight + child.weight.value * child.quantity,
    }),
    { price: s.price, weight: s.weight.value },
  );
}

export async function validateContentCatalog() {
  const catalog = await json("config/content.json");
  const manifest = await json("module.json");
  const identities = await json("config/identities.json");
  const containers = await json("config/containers.json");
  const sources = new Map();
  for (const source of catalog.sources) {
    assert(!sources.has(source.key), "Duplicate collection");
    assert.equal(source.status, "reviewed");
    assert.equal(source.license, "OGL-1.0a");
    assert(
      source.review && source.evidenceUrl && source.scope,
      "Incomplete rights evidence",
    );
    const license = await readFile(safeRelative(source.licensePath));
    assert.equal(hash(license), source.licenseSha256, "License notice changed");
    sources.set(source.key, source);
  }
  const assets = new Map();
  for (const asset of catalog.assets) {
    const file = safeRelative(asset.path);
    assert(
      file.startsWith("static/icons/") && file.endsWith(".png"),
      "Unexpected asset path",
    );
    assert.equal(asset.kind, "generated");
    assert.equal(asset.license, "MIT");
    assert(
      asset.prompt && asset.tool === "image_gen",
      "Missing generated-art provenance",
    );
    const bytes = await readFile(file);
    assert.equal(
      hash(bytes),
      asset.sha256,
      "Image bytes changed without provenance update",
    );
    assert.equal(
      bytes.subarray(0, 8).toString("hex"),
      "89504e470d0a1a0a",
      "Invalid PNG",
    );
    const runtimePath = `modules/${moduleId}/${file.slice("static/".length)}`;
    assert(!assets.has(runtimePath), "Duplicate asset path");
    assets.set(runtimePath, asset);
  }
  const registeredAssets = [
    ...catalog.assets.map((a) => path.normalize(a.path)),
    path.normalize("static/README.md"),
  ].sort();
  for (const asset of catalog.externalAssets ?? []) {
    const assetPath = safeRelative(asset.path);
    assert(
      /^(icons\/|systems\/pf1\/icons\/)/.test(assetPath),
      "Optional or unsafe asset dependency",
    );
    assert.equal(asset.kind, "reference");
    assert(
      asset.version && asset.review && /^[0-9a-f]{64}$/.test(asset.sha256),
      "Unreviewed external asset",
    );
    assert(!assets.has(asset.path), "Duplicate external asset");
    assets.set(asset.path, asset);
  }
  assert.deepEqual(
    await files("static"),
    registeredAssets,
    "Unregistered static asset",
  );
  assert.deepEqual(
    manifest.packs,
    catalog.packs.map(({ name, label }) => ({
      name,
      label,
      type: "Item",
      system: "pf1",
      path: `packs/${name}`,
      ownership: {
        PLAYER: "OBSERVER",
        TRUSTED: "OBSERVER",
        ASSISTANT: "OWNER",
      },
    })),
    "Manifest pack inventory mismatch",
  );
  const usedIds = new Set();
  const usedKeys = new Set();
  const docs = [];
  const registeredFiles = [path.normalize("src/packs/README.md")];
  for (const pack of catalog.packs) {
    assert(/^[a-z0-9-]+$/.test(pack.name));
    const packFiles = await files(`src/packs/${pack.name}`);
    assert.equal(packFiles.length, pack.count, "Pack document count mismatch");
    for (const file of packFiles) {
      assert(file.endsWith(".json"), "Unexpected source file");
      const doc = await json(file);
      const key = doc.flags?.[moduleId]?.sourceKey;
      assert(
        !usedIds.has(doc._id) && !usedKeys.has(key),
        "Duplicate ID or source key",
      );
      usedIds.add(doc._id);
      usedKeys.add(key);
      const identity = identities.find((i) => i.sourceKey === key);
      assert.equal(
        identity?.pack,
        pack.name,
        "Pack move requires reference review",
      );
      validateEntity(doc, identity, sources, assets, { containers });
      registeredFiles.push(file);
      docs.push({ pack: pack.name, file, doc });
    }
  }
  assert.equal(identities.length, docs.length, "Orphaned identity");
  assert.deepEqual(
    await files("src/packs"),
    registeredFiles.sort(),
    "Unregistered pack source",
  );
  return { catalog, docs };
}
