import { load } from "cheerio";
import { slug, compact } from "./wiki-extract.mjs";
export const facets = [
  "image",
  "activation",
  "changes",
  "contextNotes",
  "usage",
  "links",
  "advanced",
  "classFeatures",
  "compatibility",
  "reuse",
  "description",
  "rights",
];
const rules = {
  activation:
    /\b(?:swift|immediate|standard|move|full-round|free) action\b|\b(?:activate|deactivate|suppressed|toggle)\b/gi,
  changes:
    /[+--]\d+|\b(?:bonus|penalty|resistance|immunity|increase|decrease)\b/gi,
  contextNotes:
    /\b(?:when|while|if|against|unless|during|whenever|provided that)\b/gi,
  usage:
    /\b(?:charges?|uses? per day|times? per day|once per|twice per|per round|per encounter|spell points?|martial focus|expend|recharge)\b/gi,
  advanced:
    /\b(?:extraordinary|supernatural|spell-like|aura|hardness|material|size|identified|masterwork|alignment|caster level|prerequisites?)\b|\((?:Ex|Su|Sp)\)/gi,
  compatibility:
    /\b(?:sphere|talent|caster level|spell points?|martial focus|skill leverage|aura|ammunition)\b/gi,
};
export function auditEntity(entity, reuse = []) {
  const text = compact(load(entity.description, null, false).text());
  const result = Object.fromEntries(
    facets.map((f) => [f, { state: "needs-review", signals: [] }]),
  );
  for (const [f, pattern] of Object.entries(rules))
    result[f].signals = [
      ...new Set((entity.originalName + " " + text).match(pattern) ?? []),
    ].slice(0, 20);
  result.image.state = "needed";
  result.image.signals = ["No reviewed image selected"];
  result.reuse = {
    state: "needs-review",
    signals: reuse.length
      ? [`${reuse.length} exact/normalized name candidates`]
      : ["No exact/normalized name match in indexed compendia"],
  };
  const $ = load(entity.description, null, false);
  const links = [
    ...new Set(
      $("a[href]")
        .map((_, a) => $(a).attr("href"))
        .get(),
    ),
  ];
  result.links.signals = links;
  result.classFeatures.state =
    entity.kind === "class" ? "needs-review" : "not-applicable";
  result.classFeatures.signals =
    entity.kind === "class"
      ? [`${entity.progression?.length ?? 0} progression rows`]
      : [];
  result.rights.signals = [
    "Collection and selected rules require provenance review",
  ];
  if (entity.legacy)
    result.description.signals.push(
      "Legacy/original version; preserve separately pending edition review",
    );
  return result;
}
export function splitFeatures(text) {
  const parts = [];
  let depth = 0,
    start = 0;
  for (let i = 0; i < text.length; i++) {
    if (text[i] === "(") depth++;
    if (text[i] === ")") depth--;
    if (text[i] === "," && depth === 0) {
      parts.push(text.slice(start, i).trim());
      start = i + 1;
    }
  }
  parts.push(text.slice(start).trim());
  return parts.filter((s) => s && !/^[\u2014\u2013-]$/.test(s));
}
const featureKey = (s) =>
  slug(
    s
      .replace(/\((?:Ex|Su|Sp)\)/gi, "")
      .replace(/\([^)]*\)/g, "")
      .replace(/[+--]?\d+(?:d\d+)?(?:\/day)?/g, "")
      .replace(/\b(?:st|nd|rd|th)\b/g, ""),
  );
export function classPlan(entity, features) {
  const own = features.filter((f) => f.parentKey === entity.sourceKey);
  return (entity.progression ?? [])
    .map((row) => ({
      level: row.level,
      sourceText: row.special,
      features: splitFeatures(row.special).map((name) => {
        const key = featureKey(name);
        const matches = own.filter((f) => featureKey(f.name) === key);
        return {
          name,
          candidates: matches.map((f) => f.sourceKey),
          state:
            matches.length === 1
              ? "matched-needs-review"
              : matches.length
                ? "ambiguous"
                : "unresolved",
          repeated: false,
        };
      }),
    }))
    .map((r, i, rows) => ({
      ...r,
      features: r.features.map((f) => ({
        ...f,
        repeated: rows
          .slice(0, i)
          .some((old) =>
            old.features.some((o) => featureKey(o.name) === featureKey(f.name)),
          ),
      })),
    }));
}
export function applyReviews(audit, reviews, hash) {
  const result = structuredClone(audit);
  for (const [f, decision] of Object.entries(reviews ?? {})) {
    if (!facets.includes(f)) throw Error("Unknown audit facet");
    if (decision.sourceSha256 !== hash) {
      result[f].staleReview = true;
      continue;
    }
    if (
      ![
        "needed",
        "needs-review",
        "implemented",
        "not-needed",
        "not-applicable",
        "blocked",
        "deferred",
      ].includes(decision.state) ||
      !decision.reason
    )
      throw Error("Invalid review decision");
    result[f] = {
      ...result[f],
      state: decision.state,
      reason: decision.reason,
    };
  }
  return result;
}
