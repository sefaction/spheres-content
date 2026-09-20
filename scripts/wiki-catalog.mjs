import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import path from "node:path";
import { load } from "cheerio";

const origin = "http://spheresofpower.wikidot.com";
const cache = path.resolve(".local/wiki-catalog");
const digest = (value) => createHash("sha256").update(value).digest("hex");
const compact = (value) => value.replace(/\s+/g, " ").trim();

// Discovery metadata only. No scraped prose or artwork enters canonical packs.
export function wikiUrl(href, base = `${origin}/`) {
  try {
    const url = new URL(href, base);
    if (
      !["http:", "https:"].includes(url.protocol) ||
      url.hostname !== "spheresofpower.wikidot.com" ||
      url.username ||
      url.password ||
      url.port ||
      /(?:^|\/)(?:admin|system|forum|local|user|search|feed)(?::|\/|$)/i.test(
        url.pathname,
      )
    )
      return null;
    url.protocol = "http:";
    url.hash = "";
    url.search = "";
    return url.href;
  } catch {
    return null;
  }
}

export function inspectWikiPage(html, url) {
  const $ = load(html);
  const main = $("#page-content");
  assert.equal(main.length, 1, `Missing wiki content: ${url}`);
  main.find("script,style,#toc,.toc").remove();
  const links = new Map();
  main.find("a[href]").each((_, element) => {
    const target = wikiUrl($(element).attr("href"), url);
    if (!target || target === url) return;
    const name = compact($(element).text());
    if (name && !links.has(target)) links.set(target, { url: target, name });
  });
  const headings = main
    .find("h1,h2,h3,h4,h5,h6")
    .map((_, element) => ({
      name: compact($(element).text()),
      level: Number(element.tagName.slice(1)),
      anchor: $(element).attr("id") ?? null,
      // Keep separate current/original tabs; never merge headings by name alone.
      tabIndex: $(element).closest(".yui-content > div").index(),
    }))
    .get();
  const groups = {};
  for (const name of [
    "Spherecasters",
    "Operatives",
    "Practitioners",
    "Champions",
    "Gear",
    "Practitioner Gear",
    "Feat Types",
    "Skill Spheres",
  ]) {
    const label = main
      .find("strong")
      .filter((_, e) => compact($(e).text()) === name)
      .first();
    const next = label.parent().next();
    groups[name] = next
      .find("a[href]")
      .map((_, e) => ({
        name: compact($(e).text()),
        url: wikiUrl($(e).attr("href"), url),
      }))
      .get()
      .filter((e) => e.url);
  }
  const indexes = main
    .find("h2 a[href]")
    .map((_, e) => ({
      name: compact($(e).text()),
      url: wikiUrl($(e).attr("href"), url),
    }))
    .get()
    .filter((e) => e.url);
  return {
    url,
    title: compact($("#page-title").text() || $("title").text()),
    sha256: digest(html),
    headings,
    links: [...links.values()].sort((a, b) => a.url.localeCompare(b.url)),
    groups,
    indexes,
  };
}

async function getPage(url, fetchMissing) {
  const file = path.join(cache, `${digest(url)}.html`);
  let html;
  try {
    html = await readFile(file, "utf8");
  } catch (error) {
    if (error.code !== "ENOENT") throw error;
    assert(fetchMissing, `Missing cached source; use --fetch: ${url}`);
    const response = await fetch(url, { signal: AbortSignal.timeout(30_000) });
    assert(
      response.ok && wikiUrl(response.url),
      `Failed or foreign source: ${url}`,
    );
    html = await response.text();
    inspectWikiPage(html, url);
    await writeFile(file, html);
    await new Promise((resolve) => setTimeout(resolve, 500));
  }
  return inspectWikiPage(html, url);
}

async function main() {
  assert(
    process.argv.slice(2).every((arg) => arg === "--fetch"),
    "Only --fetch is supported",
  );
  await mkdir(cache, { recursive: true });
  const fetchMissing = process.argv.includes("--fetch");
  const home = await getPage(`${origin}/`, fetchMissing);
  const queue = new Map();
  const add = (entry, kind) => {
    if (!queue.has(entry.url))
      queue.set(entry.url, { ...entry, discoveryKind: kind });
  };
  for (const group of [
    "Spherecasters",
    "Operatives",
    "Practitioners",
    "Champions",
  ])
    for (const entry of home.groups[group]) add(entry, "base-class");
  for (const group of ["Gear", "Practitioner Gear"])
    for (const entry of home.groups[group]) add(entry, "item-index");
  for (const entry of home.groups["Feat Types"]) add(entry, "feat-index");
  for (const entry of home.groups["Skill Spheres"])
    add(entry, "guile-talent-index");
  for (const entry of home.links)
    if (entry.url.endsWith("/occultism")) add(entry, "guile-talent-index");
  for (const entry of home.indexes)
    if (!entry.url.includes("/using-")) add(entry, "other-system-index");
  for (const entry of home.links)
    if (
      /\/(?:feats|practitioner-feats|operative-feats|champion-feats)$/.test(
        entry.url,
      )
    )
      add(entry, "feat-index");
  assert(
    queue.size > 40,
    "Home index structure changed; review discovery selectors",
  );
  const pages = [];
  for (const entry of queue.values()) {
    const page = await getPage(entry.url, fetchMissing);
    pages.push({ ...entry, ...page });
    if (pages.length % 20 === 0)
      console.log(`Inspected ${pages.length}/${queue.size} source pages`);
  }
  const result = {
    schemaVersion: 1,
    scope:
      "Whole-wiki PF1 items, feats and base classes, plus missing Guile skill talents; existing magic/combat spheres and talents excluded; archetypes and automation deferred",
    complete: false,
    note: "First-level source discovery, not a complete entity inventory or rights clearance. Other-system indexes and nested item/feat collections require follow-up. Repeated tab headings are not separate entities until reviewed.",
    home,
    pages,
  };
  await writeFile(
    path.join(cache, "index.json"),
    JSON.stringify(result, null, 2) + "\n",
  );
  console.log(
    JSON.stringify({
      inspectedPages: pages.length + 1,
      initialBaseClassPages: pages.filter(
        (p) => p.discoveryKind === "base-class",
      ).length,
      output: ".local/wiki-catalog/index.json",
      complete: false,
    }),
  );
}

if (
  process.argv[1] &&
  path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)
)
  await main();
