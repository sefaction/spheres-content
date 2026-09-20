import assert from "node:assert/strict";
import test from "node:test";
import { inspectWikiPage, wikiUrl } from "../scripts/wiki-catalog.mjs";

test("wiki discovery excludes navigation and foreign sites but preserves edition headings", () => {
  const html = `<a href="/sidebar-only">Navigation</a><h1 id="page-title">Fixture</h1>
  <div id="page-content"><div id="toc"><a href="/toc-only">TOC</a></div>
  <div class="yui-content"><div><h3 id="new">Repeated Feat</h3><a href="/related#one">Related</a></div>
  <div><h4>Repeated Feat</h4><a href="https://spheresofpower.wikidot.com/related#two">Related</a></div></div>
  <a href="http://spheres5e.wikidot.com/example">5E</a><a href="javascript:alert(1)">Bad</a></div>`;
  const result = inspectWikiPage(
    html,
    "http://spheresofpower.wikidot.com/fixture",
  );
  assert.deepEqual(result.links, [
    { name: "Related", url: "http://spheresofpower.wikidot.com/related" },
  ]);
  assert.equal(result.headings.length, 2);
  assert.deepEqual(
    result.headings.map((h) => h.tabIndex),
    [0, 1],
  );
  assert.equal(wikiUrl("//spheresofpower.wikidot.com.evil.example/page"), null);
  assert.equal(wikiUrl("/system:join"), null);
  assert.throws(
    () =>
      inspectWikiPage(
        "<p>Login page</p>",
        "http://spheresofpower.wikidot.com/",
      ),
    /Missing wiki content/,
  );
});
