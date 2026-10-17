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
import { json } from "../scripts/lib.mjs";
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

test("final item boundaries exclude publisher navigation while preserving rule tables", () => {
  const nav =
    '<hr><table><tr><th colspan="2">Systems by <a href="/interjection">Interjection Games</a></th></tr><tr><th>Strange Magic 1</th><td><a href="/the-triggerman">The Triggerman</a></td></tr></table>';
  const rules =
    "<p><strong>Aura</strong> strong transmutation; <strong>CL</strong> 18th; <strong>Price</strong> 59400 gp; <strong>Weight</strong> 4 lbs.</p><p>A final magical pistol with its complete special rules.</p><table><tr><th>Rules table</th></tr><tr><td>Preserved damage detail</td></tr></table><p><strong>Construction Requirements</strong> Craft Magic Arms and Armor; <strong>Cost</strong> 29700 gp.</p>";
  const clean = sanitize(rules + nav, url);
  assert.match(clean, /Preserved damage detail/);
  assert.match(clean, /29700 gp/);
  assert.doesNotMatch(clean, /Interjection|Triggerman|<hr>/);
  const entities = extractPage(
    wrap(
      '<h2>Magic Items</h2><h3 id="toc45">Final Magical Pistol</h3>' +
        rules +
        nav,
    ),
    "http://spheresofpower.wikidot.com/ethermagic-items",
  ).entities;
  const item = entities.find(
    (entity) => entity.name === "Final Magical Pistol",
  );
  assert(item);
  assert.match(item.description, /Preserved damage detail/);
  assert.match(item.description, /29700 gp/);
  assert.doesNotMatch(item.description, /Interjection|Triggerman/);
});

test("corrected Glittergun source retains its identity, snapshot and construction requirements", async () => {
  const doc = await json(
    "src/packs/items/ethermagic-items/sparklys-glittergun-0829eb6deb2c2561.json",
  );
  const meta = doc.flags["additional-spheres-content"];
  const batches = await json("config/production-batches.json");
  const entry = batches.batches["physical-items-batch-1"].entries.find(
    (entry) => entry.id === doc._id,
  );
  assert.equal(doc._id, "0829eb6deb2c2561");
  assert.equal(
    meta.sourceSha256,
    "3610a46a542133b4f11e4701898b62e743d27206be2352bcfa921a66c65500b3",
  );
  assert.equal(entry.sourceKey, meta.sourceKey);
  assert.equal(entry.descriptionSha256, meta.descriptionSha256);
  assert.equal(
    entry.sourceBoundaryCorrection.previousDescriptionSha256,
    "917d8d17127a151eff8e7d37901c511064329c27e7e9b8bcb177bf6780356aed",
  );
  assert.match(doc.system.description.value, /29,700 gp/);
  assert.match(doc.system.description.value, /quantum indeterminacy/);
  assert.match(doc.system.description.value, /Source: Spheres of Power Wiki/);
  assert.doesNotMatch(
    doc.system.description.value,
    /Systems by Interjection Games|Get The Triggerman/,
  );
});
