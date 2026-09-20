import assert from "node:assert/strict";
import test from "node:test";
import { extractPage, sanitize, slug } from "../scripts/wiki-extract.mjs";
import { physicalProfile, promotionReason } from "../scripts/wiki-promote.mjs";
import {
  auditEntity,
  applyReviews,
  classPlan,
} from "../scripts/content-audit.mjs";
import { sitemapUrls } from "../scripts/wiki-crawl.mjs";
const url = "http://spheresofpower.wikidot.com/test-feats";
const wrap = (body) =>
  `<h1 id="page-title">Test Feats</h1><div id="page-content">${body}</div>`;
test("physical intake preserves Unicode weights and holds kits, weapons and incomplete profiles", () => {
  assert.equal(slug("Hunter\u2019s Tools"), "hunters-tools");
  const item = {
    name: "Powder",
    pageUrl: "http://spheresofpower.wikidot.com/alchemical-items",
    description: "<p>Price 5 sp; Weight \u00bd lb.</p>",
  };
  assert.deepEqual(physicalProfile(item), {
    type: "consumable",
    price: 0.5,
    weight: 0.5,
  });
  assert.equal(
    physicalProfile({ ...item, description: "Price 1 gp; Weight \u2014" })
      .weight,
    0,
  );
  assert.equal(
    physicalProfile({ ...item, name: "Field Kit" }).blocked,
    "container-assembly",
  );
  assert.equal(
    physicalProfile({
      ...item,
      pageUrl: "http://spheresofpower.wikidot.com/weapons",
    }).blocked,
    "weapon-profile-and-actions",
  );
  assert.equal(
    physicalProfile({ ...item, description: "Price varies; Weight 1 lb." }),
    null,
  );
  const entity = { ...item, kind: "item", pageSha256: "current" };
  assert.equal(
    promotionReason(entity, {
      [item.pageUrl]: { sha256: "previous", kinds: ["item"] },
    }),
    "source-rights-review",
  );
});
test("intake preserves edition boundaries, nested rules, and excludes ads/navigation", () => {
  const page = wrap(
    `<div class="noselect">Advertisement Price 50 gp Weight 2 lb</div><div class="yui-navset"><ul class="yui-nav"><li>Ultimate</li><li>Original</li></ul><div class="yui-content"><div><h3 id="toc1">Focused Study</h3><p><b>Benefit:</b> Gain a +1 bonus while studying.</p><h4>Special</h4><p>This has a further restriction.</p></div><div><h3>Focused Study</h3><p><b>Benefit:</b> Gain a +2 bonus to study.</p></div></div></div><table><tr><th>Spheres of Power by Drop Dead Studios</th></tr><tr><td><h3>Navigation Feat</h3><p>Benefit: Not content.</p></td></tr></table>`,
  );
  const e = extractPage(page, url).entities;
  assert.equal(e.length, 2);
  assert.equal(e[0].edition, "ultimate");
  assert.match(e[0].description, /further restriction/);
  assert.equal(e[1].legacy, true);
  assert(!e.some((e) => /Advertisement|Navigation/.test(e.description)));
});
test("sanitizer removes executable content and artwork while retaining absolute links/tables", () => {
  const s = sanitize(
    '<p onclick="bad()">Text <a href="/other#detail">other</a><a href="javascript:bad()">bad</a><img src="private.png"></p><script>bad()</script><table><tr><td colspan="2" style="color:red">Cell</td></tr></table>',
    url,
  );
  assert(!/onclick|javascript:|<img|<script|style=/.test(s));
  assert(s.includes("http://spheresofpower.wikidot.com/other#detail"));
  assert(s.includes('colspan="2"'));
});
test("Guile extraction excludes base sphere abilities and talent-type introductions", () => {
  const e = extractPage(
    wrap(
      '<h2>Base Ability</h2><p>One base ability from the sphere.</p><h2>Artifice Talent Types</h2><h4>Artwork</h4><p>Classification only, not a talent.</p><h2>Artifice Talents</h2><h4 id="toc4">Fine Tools [utility]</h4><p>While using tools, gain a small bonus.</p>',
    ),
    "http://spheresofpower.wikidot.com/artifice",
    { guilePages: ["artifice"] },
  ).entities;
  assert.deepEqual(
    e.map((e) => e.name),
    ["Fine Tools"],
  );
  assert.equal(e[0].kind, "guile-talent");
});
test("class level extraction supports Class Level/BAB and keeps repeated grants separate", () => {
  const rows = Array.from(
    { length: 20 },
    (_, i) =>
      `<tr><td>${i + 1}</td><td>+${i + 1}</td><td>+2</td><td>+0</td><td>+0</td><td>${i === 0 ? "Studied Strike +1d6, Choices (one, two)" : i === 2 ? "Studied Strike +2d6" : "\u2014"}</td></tr>`,
  ).join("");
  const html = `<h1 id="page-title">Test Class</h1><div id="page-content"><p>Hit Die: d8</p><p>Skill Ranks per Level: 4</p><table><tr><th>Class Level</th><th>BAB</th><th>Fort Save</th><th>Ref Save</th><th>Will Save</th><th>Special</th></tr>${rows}</table><h1>Class Features</h1><h2>Studied Strike (Ex)</h2><p>This strike improves every two levels.</p><h2>Choices</h2><p>Choose one of several options.</p><h1>Archetypes</h1><h2>Not a Feature</h2><p>An archetype replaces something.</p></div>`;
  const e = extractPage(
    html,
    "http://spheresofpower.wikidot.com/test-class",
  ).entities;
  const cls = e.find((e) => e.kind === "class");
  assert.equal(cls.progression.length, 20);
  assert.equal(cls.profile.hd, 8);
  assert(!e.some((e) => e.name === "Not a Feature"));
  const plan = classPlan(cls, e);
  assert.equal(plan[0].features.length, 2);
  assert.equal(plan[0].features[0].state, "matched-needs-review");
  assert.equal(plan[2].features[0].repeated, true);
});
test("audit heuristics never equate absent signals with completed review; decisions expire on source change", () => {
  const entity = {
    kind: "feat",
    description: "<p>Use once per day as a swift action; +2 while hidden.</p>",
    originalName: "Hidden Study",
    progression: [],
  };
  const audit = auditEntity(entity);
  assert(audit.usage.signals.length);
  assert.equal(audit.changes.state, "needs-review");
  assert.equal(audit.advanced.state, "needs-review");
  assert.equal(audit.image.state, "needed");
  const decisions = {
    changes: {
      sourceSha256: "abc",
      state: "not-needed",
      reason: "Reviewed text only.",
    },
  };
  assert.equal(
    applyReviews(audit, decisions, "abc").changes.state,
    "not-needed",
  );
  assert.equal(
    applyReviews(audit, decisions, "def").changes.state,
    "needs-review",
  );
  assert.equal(applyReviews(audit, decisions, "def").changes.staleReview, true);
});
test("sitemap intake deduplicates canonical site URLs and rejects foreign/admin pages", () => {
  assert.deepEqual(
    sitemapUrls(
      "<urlset><url><loc>https://spheresofpower.wikidot.com/example</loc></url><url><loc>http://spheresofpower.wikidot.com/example#x</loc></url><url><loc>https://evil.example/test</loc></url><url><loc>http://spheresofpower.wikidot.com/admin:test</loc></url></urlset>",
    ),
    ["http://spheresofpower.wikidot.com/example"],
  );
});
