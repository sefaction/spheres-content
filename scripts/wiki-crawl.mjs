import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { mkdir, readFile, writeFile, rename } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { load } from "cheerio";
import { wikiUrl, inspectWikiPage } from "./wiki-catalog.mjs";
export const origin = "http://spheresofpower.wikidot.com";
export const cacheRoot = path.resolve(".local/wiki-catalog");
export const sha256 = (value) =>
  createHash("sha256").update(value).digest("hex");
export const cacheFile = (url) => path.join(cacheRoot, `${sha256(url)}.html`);
export async function readPage(url) {
  return readFile(cacheFile(url), "utf8");
}
async function writeJson(file, data) {
  await writeFile(file + ".tmp", JSON.stringify(data, null, 2) + "\n");
  await rename(file + ".tmp", file);
}
export function sitemapUrls(xml) {
  const $ = load(xml, { xmlMode: true });
  return [
    ...new Set(
      $("url > loc")
        .map((_, e) => wikiUrl($(e).text()))
        .get()
        .filter(Boolean),
    ),
  ].sort();
}
async function request(url) {
  for (let hop = 0; hop < 5; hop++) {
    assert(wikiUrl(url), "Foreign source URL");
    const r = await fetch(url, {
      redirect: "manual",
      signal: AbortSignal.timeout(30000),
      headers: {
        "User-Agent":
          "AdditionalSpheresContent/0.1 (personal PF1 content research; cached, sequential requests)",
      },
    });
    if ([301, 302, 303, 307, 308].includes(r.status)) {
      url = new URL(r.headers.get("location"), url).href;
      continue;
    }
    assert(r.ok, `HTTP ${r.status}`);
    return r.text();
  }
  throw Error("Redirect limit");
}
export async function crawl({
  fetchMissing = false,
  refresh = false,
  limit = Infinity,
} = {}) {
  await mkdir(cacheRoot, { recursive: true });
  const sitemap = path.join(cacheRoot, "sitemap.xml");
  let xml;
  if (fetchMissing) {
    xml = await request(origin + "/sitemap.xml");
    await writeFile(sitemap, xml);
  } else xml = await readFile(sitemap, "utf8");
  const urls = sitemapUrls(xml);
  assert(urls.length > 100, "Unexpected sitemap");
  let old = { pages: [] };
  try {
    old = JSON.parse(
      await readFile(path.join(cacheRoot, "crawl.json"), "utf8"),
    );
  } catch {}
  const previous = new Map(old.pages.map((p) => [p.url, p]));
  const records = [];
  let downloaded = 0;
  // Start with known indexes/classes, then inspect every remaining sitemap URL.
  let seeds = [];
  try {
    seeds = JSON.parse(
      await readFile(path.join(cacheRoot, "index.json"), "utf8"),
    ).pages.map((p) => p.url);
  } catch {}
  const ordered = [...new Set([origin + "/", ...seeds, ...urls])];
  for (const url of ordered) {
    let html,
      fromCache = true;
    try {
      if (refresh && downloaded < limit) throw new Error("Refresh requested");
      html = await readPage(url);
    } catch {
      if (!fetchMissing || downloaded >= limit) {
        records.push({ url, status: "not-fetched" });
        continue;
      }
      fromCache = false;
      try {
        html = await request(url);
        inspectWikiPage(html, url);
        await writeFile(cacheFile(url), html);
        downloaded++;
        await new Promise((r) => setTimeout(r, 250));
      } catch (error) {
        records.push({
          url,
          status: "fetch-error",
          error: String(error.message),
        });
        await new Promise((r) => setTimeout(r, 1000));
        continue;
      }
    }
    try {
      const page = inspectWikiPage(html, url);
      records.push({
        url,
        title: page.title,
        sha256: page.sha256,
        status: "cached",
        retrievedAt: fromCache
          ? (previous.get(url)?.retrievedAt ?? null)
          : new Date().toISOString(),
      });
    } catch (error) {
      records.push({
        url,
        status: "parse-error",
        error: String(error.message),
      });
    }
    if (records.length % 50 === 0) {
      await writeJson(path.join(cacheRoot, "crawl.json"), {
        schemaVersion: 1,
        sitemapSha256: sha256(xml),
        sitemapCount: urls.length,
        complete: false,
        pages: records,
      });
      console.log(
        `Wiki coverage: ${records.length}/${ordered.length}; downloaded ${downloaded}`,
      );
    }
  }
  const result = {
    schemaVersion: 1,
    sitemapSha256: sha256(xml),
    sitemapCount: urls.length,
    complete: records.every((r) => r.status === "cached"),
    pages: records.sort((a, b) => a.url.localeCompare(b.url)),
  };
  await writeJson(path.join(cacheRoot, "crawl.json"), result);
  console.log(
    JSON.stringify({
      pages: records.length,
      downloaded,
      complete: result.complete,
      errors: records.filter((r) => r.status !== "cached").length,
    }),
  );
  return result;
}
if (
  process.argv[1] &&
  path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)
) {
  const args = process.argv.slice(2);
  assert(
    args.every(
      (a) => ["--fetch", "--refresh"].includes(a) || /^--limit=\d+$/.test(a),
    ),
    "Unknown crawl option",
  );
  await crawl({
    fetchMissing: args.includes("--fetch") || args.includes("--refresh"),
    refresh: args.includes("--refresh"),
    limit: Number(
      args.find((a) => a.startsWith("--limit="))?.split("=")[1] ?? Infinity,
    ),
  });
}
