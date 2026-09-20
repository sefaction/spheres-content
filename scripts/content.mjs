import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { load } from "cheerio";
import { files, json, moduleId, safeRelative } from "./lib.mjs";
import { validateReviewOutput } from "./reuse-review.mjs";

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
    [
      "feat",
      "class",
      "loot",
      "container",
      "consumable",
      "weapon",
      "equipment",
    ].includes(doc.type),
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
  if (meta.reuse?.sourceUuid)
    assert(sources.has(meta.reuse.collection), "Unreviewed reused collection");
  if (meta.collection === "wiki-intake-open-rules") {
    const page = new URL(meta.sourceUrl);
    page.hash = "";
    const approval = options.intakeSources?.pages?.[page.href];
    assert(
      approval?.sha256 === meta.sourceSha256,
      "Unreviewed intake snapshot",
    );
    assert(
      approval.kinds.includes(meta.intake?.kind),
      "Unreviewed intake kind",
    );
    assert(
      meta.intake?.status === "draft" && meta.audit,
      "Missing intake audit status",
    );
  }
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
  } else if (identity.actionsSha256) {
    assert.equal(
      hash(JSON.stringify(s.actions)),
      identity.actionsSha256,
      "Unreviewed native actions",
    );
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
      ["feat", "skillTalent", "classFeat"].includes(s.subType),
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
    if (doc.type === "loot") {
      if (meta.nativeProfile === "trail-rations") {
        assert.equal(s.subType, "food");
        assert.equal(s.equipped, false);
        assert.equal(s.uses.per, "single");
        assert.equal(s.actions.length, 1);
        assert.equal(s.actions[0].name, "Use");
        assert.equal(s.actions[0].activation.type, "nonaction");
      } else assert.equal(s.subType, "gear");
    }
    if (doc.type === "consumable")
      assert(["misc", "potion"].includes(s.subType));
    if (doc.type === "equipment") {
      assert(
        ["wondrous", "clothing"].includes(s.subType),
        "Additional equipment profile needs review",
      );
      assert.equal(s.equipmentSubtype, "");
      if (s.subType === "clothing") {
        assert.equal(s.slot, "clothing");
        assert.equal(s.armor.value, 0, "Mundane clothing must not grant armor");
        assert.equal(s.armor.enh, 0);
        assert.equal(s.armor.acp, 0);
        assert.equal(s.spellFailure, 0);
      }
    }
    if (doc.type === "weapon" && options.contained) {
      assert.equal(s.subType, "simple");
      assert.equal(s.weaponSubtype, "light");
      assert.deepEqual(s.material.addon, ["alchemicalSilver"]);
    }
    if (
      doc.type === "weapon" &&
      meta.nativeProfile === "hidden-blade-longsword"
    ) {
      assert.equal(s.subType, "martial");
      assert.equal(s.weaponSubtype, "1h");
      assert.equal(s.hands, 1);
      assert.deepEqual(s.baseTypes, ["Longsword"]);
      assert.deepEqual(s.weaponGroups, ["bladesHeavy"]);
      assert.equal(s.material.base.value, "steel");
      assert.equal(s.masterwork, true);
      assert.equal(s.enh, 3);
      assert.equal(s.actions.length, 1);
      assert.equal(s.actions[0].actionType, "mwak");
      assert.equal(s.actions[0].ability.critRange, 19);
      assert.equal(
        s.actions[0].damage.parts[0].formula,
        "sizeRoll(1, 8, @size)",
      );
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
  const intakeSources = await json("config/intake-sources.json");
  const physicalReviews = await json("config/physical-item-reviews.json");
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
  const packagedImagePaths = new Set();
  for (const asset of catalog.assets) {
    const file = safeRelative(asset.path);
    assert(
      file.startsWith("static/icons/") && /\.(png|webp)$/.test(file),
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
    if (file.endsWith(".png")) {
      assert.equal(
        bytes.subarray(0, 8).toString("hex"),
        "89504e470d0a1a0a",
        "Invalid PNG",
      );
      assert.equal(bytes.readUInt32BE(16), asset.encoding.width);
      assert.equal(bytes.readUInt32BE(20), asset.encoding.height);
      assert.equal(
        asset.compatibilityOnly,
        true,
        "New illustration icons should use WebP",
      );
    } else {
      assert.equal(bytes.toString("ascii", 0, 4), "RIFF", "Invalid WebP");
      assert.equal(bytes.toString("ascii", 8, 12), "WEBP", "Invalid WebP");
      assert.equal(bytes.readUInt32LE(4) + 8, bytes.length, "Truncated WebP");
    }
    assert.equal(
      bytes.length,
      asset.encoding.bytes,
      "Asset size inventory drift",
    );
    assert(
      asset.encoding.width <= 256 && asset.encoding.height <= 256,
      "Oversized icon",
    );
    assert(
      bytes.length <= (file.endsWith(".webp") ? 32768 : 196608),
      "Icon exceeds size budget",
    );
    const runtimePath = `modules/${moduleId}/${file.slice("static/".length)}`;
    assert(!assets.has(runtimePath), "Duplicate asset path");
    assets.set(runtimePath, asset);
    for (const output of [
      file.slice("static/".length),
      ...(asset.legacyPaths ?? []),
    ]) {
      safeRelative(output);
      assert(
        /^icons\/(?:[a-z0-9-]+\/)+[a-z0-9-]+\.(?:png|webp)$/.test(output) ||
          ((asset.legacyPaths ?? []).includes(output) &&
            /^icons\/[a-z0-9-]+\.png$/.test(output)),
        "Icons need readable category folders; only legacy aliases may be flat",
      );
      assert(!packagedImagePaths.has(output), "Duplicate packaged image path");
      packagedImagePaths.add(output);
    }
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
      validateEntity(doc, identity, sources, assets, {
        containers,
        intakeSources,
      });
      if (doc.flags[moduleId].reuse?.sourceUuid)
        validateReviewOutput(physicalReviews[key], doc);
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
