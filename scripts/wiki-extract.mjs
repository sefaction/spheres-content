import assert from "node:assert/strict";
import { load } from "cheerio";
import { sha256 } from "./wiki-crawl.mjs";
export const compact = (text) =>
  String(text ?? "")
    .replace(/\s+/g, " ")
    .trim();
export const slug = (text) =>
  compact(text)
    .normalize("NFKD")
    .replace(/[\u2019']/g, "")
    .replace(/\[[^\]]*\]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
export const cleanName = (text) =>
  compact(text)
    .replace(/\s*\[[^\]]+\]/g, "")
    .trim();
const allowed = new Set([
  "p",
  "ul",
  "ol",
  "li",
  "table",
  "thead",
  "tbody",
  "tr",
  "td",
  "th",
  "strong",
  "b",
  "em",
  "i",
  "u",
  "s",
  "br",
  "hr",
  "blockquote",
  "dl",
  "dt",
  "dd",
  "h1",
  "h2",
  "h3",
  "h4",
  "h5",
  "h6",
  "sup",
  "sub",
  "a",
]);
export function sanitize(html, url) {
  const $ = load(html, null, false);
  $(
    "script,style,iframe,object,embed,img,form,input,button,.toc,#toc",
  ).remove();
  $("*").each((_, e) => {
    if (!allowed.has(e.tagName)) {
      $(e).replaceWith($(e).contents());
      return;
    }
    for (const k of Object.keys(e.attribs)) {
      if (k === "href" && e.tagName === "a") {
        try {
          const u = new URL(e.attribs[k], url);
          if (["http:", "https:"].includes(u.protocol)) $(e).attr(k, u.href);
          else $(e).removeAttr(k);
        } catch {
          $(e).removeAttr(k);
        }
      } else if (
        ["colspan", "rowspan"].includes(k) &&
        /^\d+$/.test(e.attribs[k])
      ) {
      } else $(e).removeAttr(k);
    }
  });
  return $.html().trim();
}
function textOf(html) {
  return compact(load(html, null, false).text());
}
export function wikiBlocks(html, url) {
  const $ = load(html);
  const main = $("#page-content");
  assert.equal(main.length, 1, "Missing content root");
  main.find("#toc,.toc").each((_, e) => {
    const t = $(e).closest("table");
    (t.length ? t : $(e)).remove();
  });
  main.find("script,style,.noselect").remove();
  main.find("table").each((_, e) => {
    if (
      /^(?:Spheres of (?:Power|Might|Guile)|Champions of the Spheres).*by /i.test(
        compact($(e).find("th").first().text()),
      )
    )
      $(e).remove();
  });
  const blocks = [];
  function walk(nodes, edition = "current") {
    for (const e of nodes) {
      if (e.type === "text") {
        if (compact(e.data))
          blocks.push({
            tag: "p",
            html: sanitize(`<p>${e.data}</p>`, url),
            edition,
          });
        continue;
      }
      if (!e.tagName) continue;
      const n = $(e);
      if (n.hasClass("yui-navset")) {
        const labels = n
          .children(".yui-nav")
          .find("li")
          .map((_, x) => slug($(x).text()))
          .get();
        n.children(".yui-content")
          .children("div")
          .each((i, x) =>
            walk($(x).contents().toArray(), labels[i] || `tab-${i + 1}`),
          );
        continue;
      }
      if (n.hasClass("yui-nav") || n.attr("id") === "toc") continue;
      if (["div", "section", "article", "span", "center"].includes(e.tagName)) {
        walk(n.contents().toArray(), edition);
        continue;
      }
      if (
        e.tagName === "table" &&
        /Table of Contents/.test(n.text()) &&
        n.find("#toc").length
      )
        continue;
      if (["script", "style", "img", "link"].includes(e.tagName)) continue;
      const value = sanitize($.html(e), url);
      if (!textOf(value) && e.tagName !== "hr") continue;
      blocks.push({
        tag: e.tagName,
        html: value,
        text: compact(n.text()),
        anchor: n.attr("id") ?? null,
        edition,
      });
    }
  }
  walk(main.contents().toArray());
  for (const b of blocks) b.text ??= textOf(b.html);
  return {
    title: compact($("#page-title").text() || $("title").text()),
    blocks,
  };
}
export function classProgression(blocks) {
  for (const b of blocks) {
    if (b.tag !== "table") continue;
    const $ = load(b.html, null, false);
    const rows = $("tr")
      .map((_, r) => [
        $(r)
          .children("th,td")
          .map((_, c) => compact($(c).text()))
          .get(),
      ])
      .get();
    const hi = rows.findIndex(
      (r) =>
        r.some((c) => /^(?:Class )?Level$/i.test(c)) &&
        r.some((c) => /(?:Base Attack|^BAB$)/i.test(c)),
    );
    if (hi < 0) continue;
    const h = rows[hi];
    const ix = {
      level: h.findIndex((c) => /^(?:Class )?Level$/i.test(c)),
      bab: h.findIndex((c) => /(?:Base Attack|^BAB$)/i.test(c)),
      fort: h.findIndex((c) => /Fort/i.test(c)),
      ref: h.findIndex((c) => /Ref/i.test(c)),
      will: h.findIndex((c) => /Will/i.test(c)),
      special: h.findIndex((c) => /Special/i.test(c)),
    };
    const levels = rows
      .slice(hi + 1)
      .filter((r) => /^\d+(?:st|nd|rd|th)?$/.test(r[ix.level] ?? ""))
      .map((r) => ({
        level: Number.parseInt(r[ix.level]),
        bab: r[ix.bab],
        fort: r[ix.fort],
        ref: r[ix.ref],
        will: r[ix.will],
        special: r[ix.special] ?? "",
      }));
    if (levels.length >= 20 && levels.some((r) => r.level === 20))
      return levels;
  }
  return null;
}
export function extractPage(html, url, { guilePages = [] } = {}) {
  const { title, blocks } = wikiBlocks(html, url);
  const page = slug(new URL(url).pathname);
  const snapshot = sha256(html);
  const entities = [];
  const warnings = [];
  const editions = [...new Set(blocks.map((b) => b.edition))];
  const make = (kind, name, edition, body, anchor, extra = {}) => {
    const description = sanitize(body, url);
    if (textOf(description).length < 25) return;
    const key = `wiki:${page}:${edition}:${kind}:${slug(name)}`;
    entities.push({
      sourceKey: key,
      name: cleanName(name),
      originalName: name,
      kind,
      edition,
      url: anchor ? `${url}#${anchor}` : url,
      pageUrl: url,
      pageSha256: snapshot,
      descriptionSha256: sha256(description),
      description,
      sourceTags: [...name.matchAll(/\[([^\]]+)\]/g)].map((m) => m[1]),
      ...extra,
    });
  };
  for (const edition of editions) {
    const bs = blocks.filter((b) => b.edition === edition);
    const legacy =
      /original|legacy|old/.test(edition) ||
      /\/(?:old-|original-|legacy-|deleted:)/i.test(url);
    const progression = classProgression(bs);
    const isClass =
      !!progression &&
      /Hit Di(?:e|ce)/i.test(bs.map((b) => b.text).join(" ")) &&
      !/archetype|prestige|monster|npc|bestiary/i.test(title);
    const headings = [];
    const stack = [];
    for (let i = 0; i < bs.length; i++) {
      const b = bs[i];
      if (!/^h[1-6]$/.test(b.tag)) continue;
      const level = Number(b.tag[1]);
      while (stack.length && stack.at(-1).level >= level) stack.pop();
      let end = i + 1;
      while (
        end < bs.length &&
        (!/^h[1-6]$/.test(bs[end].tag) || Number(bs[end].tag[1]) > level)
      )
        end++;
      let direct = i + 1;
      while (direct < end && !/^h[1-6]$/.test(bs[direct].tag)) direct++;
      headings.push({
        i,
        end,
        direct,
        level,
        b,
        ancestors: stack.map((s) => s.name),
      });
      stack.push({ level, name: b.text });
    }
    let classEntity;
    if (isClass) {
      const stop = bs.findIndex(
        (b) =>
          /^h[1-3]$/.test(b.tag) &&
          /^(?:Archetypes|Favored Class|Alternate Class|Sample Characters)/i.test(
            b.text,
          ),
      );
      const classBlocks = stop < 0 ? bs : bs.slice(0, stop);
      const text = classBlocks.map((b) => b.text).join(" ");
      const hd = text.match(/Hit Di(?:e|ce):?\s*d(\d+)/i);
      const ranks = text.match(
        /(?:Skill (?:Ranks|Points) (?:Per|per|at Each) Level|Skills? (?:Ranks|Points) per Level):?\s*(\d+)/i,
      );
      make(
        "class",
        title,
        edition,
        classBlocks.map((b) => b.html).join("\n"),
        null,
        {
          legacy,
          progression,
          profile: {
            hd: hd ? Number(hd[1]) : null,
            skillsPerLevel: ranks ? Number(ranks[1]) : null,
          },
          category: "base-classes",
        },
      );
      classEntity = entities.at(-1);
    }
    const guile = guilePages.includes(page);
    let selected = 0;
    for (const h of headings) {
      const { b, i, end, direct, ancestors } = h;
      const body = bs
        .slice(i + 1, end)
        .map((x) => x.html)
        .join("\n");
      const directText = bs
        .slice(i + 1, direct)
        .map((x) => x.text)
        .join(" ");
      const context = ancestors.join(" > ");
      if (/archetypes|favored class bonuses/i.test(context)) continue;
      const extra = { legacy, category: context || page };
      if (
        guile &&
        /talents/i.test(context) &&
        !/talent types/i.test(context) &&
        h.level >= 3 &&
        !/^(?:.*Talent Types|.*Talents)$/.test(b.text)
      ) {
        make("guile-talent", b.text, edition, body, b.anchor, {
          ...extra,
          sphere: page,
        });
        selected++;
      } else if (
        /\bBenefits?:/i.test(directText) &&
        /feats?/i.test(page + " " + context)
      ) {
        make("feat", b.text, edition, body, b.anchor, extra);
        selected++;
      } else if (
        /^(?:Aura|Slot|Price|Cost)\b/i.test(directText) &&
        /\b(?:Price|Cost)\s*:?\s*[\d,]+(?:\.\d+)?\s*(?:gp|sp|cp|pp)\b/i.test(
          directText,
        ) &&
        !isClass
      ) {
        make("item", b.text, edition, body, b.anchor, extra);
        selected++;
      } else if (
        isClass &&
        classEntity &&
        /^Class (?:Features|Abilities)$/i.test(ancestors[0] ?? "") &&
        h.level === 2
      ) {
        make("class-feature", b.text, edition, body, b.anchor, {
          ...extra,
          parentKey: classEntity.sourceKey,
          parentName: title,
        });
        selected++;
      }
    }
    const firstHeading = bs.findIndex((b) => /^h[1-6]$/.test(b.tag));
    const preamble = bs.slice(0, firstHeading < 0 ? bs.length : firstHeading);
    const preText = preamble.map((b) => b.text).join(" ");
    if (
      !isClass &&
      /\bBenefits?:/i.test(preText) &&
      /\bPrerequisites?:/i.test(preText)
    )
      make("feat", title, edition, bs.map((b) => b.html).join("\n"), null, {
        legacy,
        category: page,
      });
    else if (
      !isClass &&
      /\bPrice\s*:?\s*[\d,]+(?:\.\d+)?\s*(?:gp|sp|cp|pp)\b/.test(preText) &&
      /\b(?:Weight|Slot|Aura)\b/.test(preText)
    )
      make("item", title, edition, bs.map((b) => b.html).join("\n"), null, {
        legacy,
        category: page,
      });
    if (
      !selected &&
      !isClass &&
      /feat|equipment|items|weapons|armor/i.test(title)
    )
      warnings.push({
        edition,
        reason: "Relevant title without recognized entity boundaries",
      });
  }
  const seen = new Set();
  for (const e of entities) {
    if (seen.has(e.sourceKey))
      warnings.push({ reason: "Duplicate source identity", key: e.sourceKey });
    seen.add(e.sourceKey);
  }
  return {
    url,
    title,
    sha256: snapshot,
    entities,
    warnings,
    headingCount: blocks.filter((b) => /^h[1-6]$/.test(b.tag)).length,
  };
}
