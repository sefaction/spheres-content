import assert from "node:assert/strict";
import { readFile, writeFile, mkdir } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { load } from "cheerio";
import { stableId } from "./content.mjs";
import { slug, compact } from "./wiki-extract.mjs";
import { sha256 } from "./wiki-crawl.mjs";
const moduleId = "additional-spheres-content";
const packFor = {
  feat: "feats",
  "class-feature": "class-features",
  class: "classes",
  "guile-talent": "guile-talents",
  item: "items",
};
const sphereIds = { "body-control": "bodyControl" };
const spheres = new Set([
  "artifice",
  "bluster",
  "body-control",
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
]);
export function physicalProfile(e) {
  const text = compact(load(e.description, null, false).text());
  const price = text.match(
    /\b(?:Price|Cost)\s*:?\s*([\d,]+(?:\.\d+)?)\s*(gp|sp|cp|pp)\b/i,
  );
  const weight = text.match(
    /\bWeight\s*:?\s*(?:(\d+(?:\.\d+)?|\u00bd|1\/2|1\/4)\s*(?:lb|lbs|pound)|([\u2014\u2013-]))/i,
  );
  if (!price || !weight) return null;
  if (
    /\bkit\b/i.test(e.name) ||
    /\b(?:contains?|consists of|includes)\b.*\b(?:vials|doses|pouches|items|dagger|backpack)\b/i.test(
      text,
    )
  )
    return { blocked: "container-assembly" };
  const page = new URL(e.pageUrl).pathname;
  let type = /weapon/i.test(page)
    ? "weapon"
    : /armor|shield|wondrous|marvelous|magic.*items|implements|apparatus|charms/i.test(
          page,
        ) || /\bSlot\b/.test(text)
      ? "equipment"
      : /alchemical|compound|potion|elixir/i.test(page)
        ? "consumable"
        : "loot";
  if (type === "weapon") return { blocked: "weapon-profile-and-actions" };
  if (type === "equipment" && /armor|shield/i.test(page))
    return { blocked: "armor-profile" };
  return {
    type,
    price:
      Number(price[1].replaceAll(",", "")) *
      { gp: 1, sp: 0.1, cp: 0.01, pp: 10 }[price[2].toLowerCase()],
    weight: weight[2]
      ? 0
      : ({ "\u00bd": 0.5, "1/2": 0.5, "1/4": 0.25 }[weight[1]] ??
        Number(weight[1])),
  };
}
export function promotionReason(e, sources) {
  if (e.excludedByReview) return "excluded-by-review";
  if (e.staleOverride) return "stale-source-override";
  if (e.legacy) return "legacy-edition-review";
  if (e.ambiguousIdentity) return "identity-collision";
  if (/\/deleted:|(?:-cr-\d|-mr-\d)|bestiary|monster/i.test(e.pageUrl))
    return "non-target-page-review";
  if (
    !sources[e.pageUrl] ||
    sources[e.pageUrl].sha256 !== e.pageSha256 ||
    !sources[e.pageUrl].kinds.includes(e.kind)
  )
    return "source-rights-review";
  if (e.kind === "guile-talent" && !spheres.has(e.sphere))
    return "unsupported-guile-sphere";
  if (
    e.kind === "class" &&
    (!e.profile?.hd || e.profile.skillsPerLevel === null)
  )
    return "class-profile";
  if (e.kind === "item") {
    const p = physicalProfile(e);
    if (!p) return "physical-profile";
    if (p.blocked) return p.blocked;
  }
  return null;
}
const skillNames = {
  acr: "Acrobatics",
  apr: "Appraise",
  blf: "Bluff",
  clm: "Climb",
  crf: "Craft",
  dip: "Diplomacy",
  dev: "Disable Device",
  dis: "Disguise",
  esc: "Escape Artist",
  fly: "Fly",
  han: "Handle Animal",
  hea: "Heal",
  int: "Intimidate",
  kar: "Knowledge (arcana)",
  kdu: "Knowledge (dungeoneering)",
  ken: "Knowledge (engineering)",
  kge: "Knowledge (geography)",
  khi: "Knowledge (history)",
  klo: "Knowledge (local)",
  kna: "Knowledge (nature)",
  kno: "Knowledge (nobility)",
  kpl: "Knowledge (planes)",
  kre: "Knowledge (religion)",
  lin: "Linguistics",
  per: "Perception",
  prf: "Perform",
  pro: "Profession",
  rid: "Ride",
  sen: "Sense Motive",
  slt: "Sleight of Hand",
  spl: "Spellcraft",
  ste: "Stealth",
  sur: "Survival",
  swm: "Swim",
  umd: "Use Magic Device",
};
function nativeClass(e, template) {
  const s = structuredClone(template);
  const text = compact(load(e.description, null, false).text());
  s.classSkills = {};
  const skillText =
    text.match(
      /Class Skills:?\s*(.+?)(?:Skill (?:Ranks|Points)|Table:|Level Base)/i,
    )?.[1] ?? "";
  for (const [k, name] of Object.entries(skillNames)) {
    if (
      skillText.toLowerCase().includes(name.toLowerCase()) ||
      (k.startsWith("k") && /Knowledge\s*\(all/i.test(skillText))
    )
      s.classSkills[k] = true;
  }
  s.hd = e.profile.hd;
  s.hp = e.profile.hd;
  s.skillsPerLevel = e.profile.skillsPerLevel;
  s.bab =
    Number.parseInt(e.progression.find((r) => r.level === 20).bab) >= 20
      ? "high"
      : Number.parseInt(e.progression.find((r) => r.level === 20).bab) >= 15
        ? "med"
        : "low";
  for (const key of ["fort", "ref", "will"])
    s.savingThrows[key].value =
      Number.parseInt(e.progression[0][key]) >= 2 ? "high" : "low";
  s.alignment =
    text
      .match(
        /Alignment:?\s*(.+?)(?:Hit Die|Starting Wealth|Class Skills)/i,
      )?.[1]
      ?.trim() ?? "";
  s.wealth = (
    text.match(/Starting Wealth:?\s*(\d+d\d+\s*[x\u00d7*]\s*\d+)/i)?.[1] ?? ""
  ).replace(/[x\u00d7]/, "*");
  return s;
}
async function main() {
  const args = process.argv.slice(2);
  assert(
    args.every((a) => ["--plan", "--apply"].includes(a)),
    "Use --plan or --apply",
  );
  assert(!(args.includes("--plan") && args.includes("--apply")));
  const apply = args.includes("--apply");
  const candidates = JSON.parse(
    await readFile(".local/intake/candidates.json", "utf8"),
  );
  let sources = {};
  try {
    sources = JSON.parse(
      await readFile("config/intake-sources.json", "utf8"),
    ).pages;
  } catch {}
  const config = JSON.parse(await readFile("config/content.json", "utf8"));
  const identities = JSON.parse(
    await readFile("config/identities.json", "utf8"),
  );
  const aliases = JSON.parse(
    await readFile("config/intake-aliases.json", "utf8"),
  );
  const index = new Map(
    (await readFile("research/intake/entities.jsonl", "utf8"))
      .trim()
      .split("\n")
      .map((l) => {
        const e = JSON.parse(l);
        return [e.sourceKey, e];
      }),
  );
  const templates = {
    feat: JSON.parse(
      await readFile("src/packs/feats/extra-magic-talent.json", "utf8"),
    ),
    class: JSON.parse(
      await readFile("src/packs/classes/incanter.json", "utf8"),
    ),
  };
  const kit = JSON.parse(
    await readFile("src/packs/items/lycanthrope-hunters-kit.json", "utf8"),
  );
  const loot = Object.values(kit.system.items).find((i) => i.type === "loot");
  const nativeProfiles = JSON.parse(
    await readFile("config/pf1-native-profiles.json", "utf8"),
  ).profiles;
  const existing = identities.map((i) => ({ ...i, name: null }));
  for (const i of existing) {
    const parts = i.sourceKey.split(":");
    i.page = parts[1];
  }
  const chosen = new Map();
  const plan = [];
  const sorted = [...candidates].sort((a, b) => {
    const score = (e) =>
      (/feats?/.test(new URL(e.pageUrl).pathname) ? 20 : 0) +
      (e.edition === "ultimate" ? 5 : 0);
    return score(b) - score(a) || a.sourceKey.localeCompare(b.sourceKey);
  });
  for (const e of sorted) {
    const pack = packFor[e.kind];
    const dedup = `${e.kind}:${e.kind === "class-feature" ? e.parentKey : ""}:${slug(e.name)}:${sha256(compact(load(e.description, null, false).text()))}`;
    if (e.legacy) {
      plan.push({
        sourceKey: e.sourceKey,
        state: "held",
        reason: "legacy-edition-review",
      });
      continue;
    }
    const prior = identities.find(
      (i) =>
        i.pack === pack &&
        i.sourceKey === (aliases[e.sourceKey] ?? e.sourceKey),
    );
    if (prior) {
      chosen.set(dedup, e.sourceKey);
      plan.push({
        sourceKey: e.sourceKey,
        state: "existing-preserved",
        id: prior.id,
        pack,
      });
      continue;
    }
    const reason = promotionReason(e, sources);
    if (reason) {
      plan.push({ sourceKey: e.sourceKey, state: "held", reason });
      continue;
    }
    if (chosen.has(dedup)) {
      plan.push({
        sourceKey: e.sourceKey,
        state: "duplicate",
        canonicalKey: chosen.get(dedup),
      });
      continue;
    }
    chosen.set(dedup, e.sourceKey);
    const id = stableId(e.sourceKey);
    const canonicalName =
      e.kind === "class-feature" ? `${e.parentName}: ${e.name}` : e.name;
    const itemType =
      e.kind === "class"
        ? "class"
        : e.kind === "item"
          ? physicalProfile(e).type
          : "feat";
    let doc = structuredClone(
      itemType === "class"
        ? templates.class
        : itemType === "loot"
          ? loot
          : templates.feat,
    );
    if (e.kind === "item")
      doc.system = structuredClone(nativeProfiles[itemType]);
    doc._id = id;
    doc._key = `!items!${id}`;
    doc.name = canonicalName;
    doc.type = itemType;
    doc.folder = null;
    doc.sort = 0;
    doc.effects = [];
    doc.ownership = { default: 0 };
    doc._stats = structuredClone(templates.feat._stats);
    doc.img =
      itemType === "class"
        ? "icons/svg/mystery-man.svg"
        : e.kind === "item"
          ? "icons/svg/item-bag.svg"
          : "icons/svg/book.svg";
    const a = index.get(e.sourceKey);
    doc.flags = {
      [moduleId]: {
        sourceKey: e.sourceKey,
        collection: "wiki-intake-open-rules",
        sourceUrl: e.url,
        sourceSha256: e.pageSha256,
        descriptionSha256: e.descriptionSha256,
        phase: "descriptive",
        automation: "not-reviewed",
        edition: e.edition,
        category: e.category,
        intake: { status: "draft", auditKey: e.sourceKey, kind: e.kind },
        audit: Object.fromEntries(
          Object.entries(a.audit).map(([k, v]) => [k, v.state]),
        ),
      },
    };
    doc.flags[moduleId].audit.rights = "implemented";
    doc.flags[moduleId].audit.description = "needs-review";
    if (e.kind === "class") doc.system = nativeClass(e, templates.class.system);
    if (e.kind === "class-feature") doc.system.subType = "classFeat";
    if (e.kind === "guile-talent") {
      doc.system.subType = "skillTalent";
      doc.flags.pf1spheres = { sphere: sphereIds[e.sphere] ?? e.sphere };
    }
    if (e.kind === "item") {
      const p = physicalProfile(e);
      doc.system.price = p.price;
      doc.system.weight.value = p.weight;
      doc.system.quantity = 1;
      doc.system.subType =
        itemType === "loot"
          ? "gear"
          : itemType === "equipment"
            ? "wondrous"
            : "misc";
      if (itemType === "equipment") {
        doc.system.equipmentSubtype = "";
        const text = compact(load(e.description, null, false).text());
        const slot = text
          .match(
            /\bSlot\s*:?\s*(headband|head|eyes|shoulders|neck|chest|body|belt|wrists|hands|ring|feet|none)\b/i,
          )?.[1]
          ?.toLowerCase();
        doc.system.slot = slot && slot !== "none" ? slot : "slotless";
      }
      doc.system.tag = "";
      doc.system.sources = [];
    }
    doc.system.description = {
      value:
        e.description +
        `\n<p><a href="${e.url}">Source: Spheres of Power Wiki</a></p>`,
      instructions: "",
    };
    if (e.kind === "item") doc.system.description.unidentified = "";
    doc.system.sources = [{ title: "Spheres of Power Wiki", url: e.url }];
    doc.system.actions = [];
    doc.system.changes = [];
    doc.system.contextNotes = [];
    doc.system.scriptCalls = [];
    doc.system.tags = e.sourceTags.filter((t) =>
      ["approach", "utility", "plan"].includes(t),
    );
    const file = `src/packs/${pack}/${slug(new URL(e.pageUrl).pathname)}/${slug(e.name).slice(0, 85)}-${id}.json`;
    plan.push({ sourceKey: e.sourceKey, state: "import", id, pack, file });
    if (apply) {
      await mkdir(path.dirname(file), { recursive: true });
      try {
        await readFile(file);
        throw Error(
          "Refusing to overwrite canonical source; use an explicit refresh review",
        );
      } catch (error) {
        if (error.code !== "ENOENT") throw error;
      }
      await writeFile(file, JSON.stringify(doc, null, 2) + "\n");
      identities.push({ sourceKey: e.sourceKey, id, pack });
    }
  }
  await writeFile(
    "research/intake/promotion-plan.json",
    JSON.stringify({ schemaVersion: 1, entries: plan }, null, 2) + "\n",
  );
  if (apply) {
    await writeFile(
      "config/identities.json",
      JSON.stringify(identities, null, 2) + "\n",
    );
    for (const pack of config.packs)
      pack.count = identities.filter((i) => i.pack === pack.name).length;
    if (
      identities.some((i) => i.pack === "class-features") &&
      !config.packs.some((p) => p.name === "class-features")
    )
      config.packs.push({
        name: "class-features",
        label: "Additional Spheres: Class Features",
        count: identities.filter((i) => i.pack === "class-features").length,
      });
    await writeFile(
      "config/content.json",
      JSON.stringify(config, null, 2) + "\n",
    );
    const manifest = JSON.parse(await readFile("module.json", "utf8"));
    manifest.packs = config.packs.map(({ name, label }) => ({
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
    }));
    manifest.description =
      "Pathfinder 1e descriptive compendia from the Spheres of Power Wiki, with systematic intake and per-entity audit tracking. Artwork and mechanics review are in progress.";
    await writeFile("module.json", JSON.stringify(manifest, null, 2) + "\n");
  }
  console.log(
    JSON.stringify({
      apply,
      counts: Object.fromEntries(
        ["import", "held", "duplicate", "existing-preserved"].map((state) => [
          state,
          plan.filter((p) => p.state === state).length,
        ]),
      ),
      holdReasons: Object.fromEntries(
        [
          ...new Set(
            plan.filter((p) => p.state === "held").map((p) => p.reason),
          ),
        ].map((r) => [r, plan.filter((p) => p.reason === r).length]),
      ),
    }),
  );
}
if (
  process.argv[1] &&
  path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)
)
  await main();
