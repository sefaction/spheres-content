import assert from "node:assert/strict";
import { readFile, writeFile, mkdir, readdir } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { readPage, sha256, cacheRoot } from "./wiki-crawl.mjs";
import { extractPage, slug } from "./wiki-extract.mjs";
import { auditEntity, classPlan, applyReviews } from "./content-audit.mjs";
export async function intake() {
  const crawl = JSON.parse(
    await readFile(path.join(cacheRoot, "crawl.json"), "utf8"),
  );
  const { guilePages } = JSON.parse(
    await readFile("config/intake-scope.json", "utf8"),
  );
  let reuse = { entries: [], packs: [], errors: [] };
  try {
    reuse = JSON.parse(await readFile(".local/reuse-index/index.json", "utf8"));
  } catch {}
  const byName = new Map();
  for (const r of reuse.entries) {
    if (!byName.has(r.key)) byName.set(r.key, []);
    byName.get(r.key).push(r);
  }
  let reviews = {};
  try {
    reviews = JSON.parse(await readFile("config/audit-reviews.json", "utf8"));
  } catch {}
  const candidates = [],
    coverage = [];
  const overrides = JSON.parse(
    await readFile("config/intake-overrides.json", "utf8"),
  );
  for (const page of crawl.pages) {
    if (page.status !== "cached") {
      coverage.push({ ...page, disposition: "unavailable" });
      continue;
    }
    try {
      const result = extractPage(await readPage(page.url), page.url, {
        guilePages,
      });
      for (const entity of result.entities) {
        const override = overrides[entity.sourceKey];
        if (!override) continue;
        if (override.pageSha256 !== entity.pageSha256) {
          entity.staleOverride = true;
          continue;
        }
        if (override.profile) Object.assign(entity.profile, override.profile);
        if (override.exclude) entity.excludedByReview = override.reason;
      }
      candidates.push(...result.entities);
      coverage.push({
        url: page.url,
        title: result.title,
        sha256: result.sha256,
        headings: result.headingCount,
        candidates: result.entities.length,
        warnings: result.warnings,
        disposition: result.entities.length
          ? "extracted"
          : result.warnings.length
            ? "needs-parser-review"
            : "no-target-entity-detected",
      });
    } catch (error) {
      coverage.push({
        url: page.url,
        disposition: "parse-error",
        error: error.message,
      });
    }
  }
  candidates.sort((a, b) => a.sourceKey.localeCompare(b.sourceKey));
  const byKey = new Map();
  const collisions = [];
  for (const c of candidates) {
    if (byKey.has(c.sourceKey)) {
      const prior = byKey.get(c.sourceKey);
      if (prior.descriptionSha256 === c.descriptionSha256) continue;
      collisions.push(c.sourceKey);
      c.ambiguousIdentity = true;
      c.sourceKey += `:collision:${c.descriptionSha256.slice(0, 12)}`;
    }
    byKey.set(c.sourceKey, c);
  }
  const unique = [...byKey.values()];
  const groups = new Map();
  for (const c of unique) {
    const k = `${c.kind}:${slug(c.name)}:${c.legacy ? "legacy" : "current"}`;
    if (!groups.has(k)) groups.set(k, []);
    groups.get(k).push(c);
  }
  const audit = unique.map((c) => {
    const matches = byName.get(slug(c.name)) ?? [];
    const group = groups.get(
      `${c.kind}:${slug(c.name)}:${c.legacy ? "legacy" : "current"}`,
    );
    return {
      sourceKey: c.sourceKey,
      name: c.name,
      kind: c.kind,
      edition: c.edition,
      url: c.url,
      pageSha256: c.pageSha256,
      descriptionSha256: c.descriptionSha256,
      category: c.category,
      sourceTags: c.sourceTags,
      ambiguousIdentity: c.ambiguousIdentity ?? false,
      legacy: c.legacy,
      parentKey: c.parentKey,
      profile: c.profile,
      duplicateCandidates: group
        .filter((v) => v !== c)
        .map((v) => ({
          sourceKey: v.sourceKey,
          sameDescription: v.descriptionSha256 === c.descriptionSha256,
        })),
      reuseCandidates: matches.map(
        ({
          uuid,
          provider,
          version,
          type,
          img,
          hasDescription,
          placeholderImage,
        }) => ({
          uuid,
          provider,
          version,
          type,
          img,
          hasDescription,
          placeholderImage,
        }),
      ),
      audit: applyReviews(
        auditEntity(c, matches),
        reviews[c.sourceKey],
        c.descriptionSha256,
      ),
      ...(c.kind === "class" ? { classPlan: classPlan(c, unique) } : {}),
    };
  });
  await mkdir(".local/intake", { recursive: true });
  await mkdir("research/intake", { recursive: true });
  await writeFile(
    ".local/intake/candidates.json",
    JSON.stringify(unique, null, 2) + "\n",
  );
  await writeFile(
    "research/intake/entities.jsonl",
    audit.map((e) => JSON.stringify(e)).join("\n") + "\n",
  );
  await writeFile(
    "research/intake/coverage.json",
    JSON.stringify(
      {
        schemaVersion: 1,
        sitemapCount: crawl.sitemapCount,
        crawlComplete: crawl.complete,
        extractionComplete: false,
        scope:
          "PF1 items, feats, base classes, class features and missing Guile talents; current and legacy candidates separate; archetypes and existing magic/combat sphere/talent entities excluded",
        pages: coverage,
        collisions,
        reuse: {
          packs: reuse.packs.length,
          entries: reuse.entries.length,
          unavailablePacks: reuse.errors.length,
          indexSha256: sha256(JSON.stringify(reuse.entries)),
        },
      },
      null,
      2,
    ) + "\n",
  );
  const counts = Object.fromEntries(
    [...new Set(unique.map((e) => e.kind))]
      .sort()
      .map((k) => [k, unique.filter((e) => e.kind === k).length]),
  );
  await writeFile(
    "research/intake/summary.json",
    JSON.stringify(
      {
        schemaVersion: 1,
        candidates: unique.length,
        counts,
        crawlPages: crawl.pages.length,
        cachedPages: crawl.pages.filter((p) => p.status === "cached").length,
        coverageComplete: crawl.complete,
        extractionComplete: false,
        collisions: collisions.length,
        unresolvedClassGrants: audit
          .flatMap((e) => e.classPlan ?? [])
          .flatMap((r) => r.features)
          .filter((f) => f.state !== "matched-needs-review").length,
      },
      null,
      2,
    ) + "\n",
  );
  console.log(
    JSON.stringify({
      candidates: unique.length,
      counts,
      collisions: collisions.length,
    }),
  );
  return { candidates: unique, audit, coverage };
}
if (
  process.argv[1] &&
  path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)
) {
  assert(process.argv.length === 2, "Intake is offline; run crawl separately");
  await intake();
}
