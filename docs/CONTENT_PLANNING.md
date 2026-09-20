# Content catalog plan

## Confirmed scope

The user requested all PF1 items, feats, and base classes on the Spheres of Power
Wiki, including other publishers and systems. This is a new module and is not
limited to gaps in upstream compendia.

- Exclude existing magic/combat sphere and talent entities. Feats embedded on
  sphere pages are still in scope. Include missing Guile skill talents: the user
  explicitly added this exception after upstream coverage was checked.
- Create base classes now. Preserve their class-feature descriptions. Defer
  archetype entities and how to layer them onto classes to a later discussion.
- First build descriptive entities and associated generated images. After that
  collection is complete and reviewed, decide passive Changes and conditional
  modifiers. Do not silently begin the modifier pass early.
- Reuse generated images where they suit closely related entities; use distinct
  images when the item or class has a different visual identity.
- Before creating an item or artwork, inspect existing compendia and reuse good
  records. Include component items in that search. Model physical kits as
  containers with their actual contents; see [the kit audit](KIT_REUSE_AUDIT.md).
- Keep current and legacy source variants distinct during intake. Do not import
  both blindly or overwrite one with the other. Legacy inclusion remains a
  collection-level review decision rather than a guessed default.

Framework responsibilities and exact reviewed interfaces are documented in
[Spheres integration](SPHERES_INTEGRATION.md).

## Initial discovery

`research/wiki-discovery.json` records the first 105 inspected source pages and
their hashes. The sitemap listed 2,668 pages at retrieval. The main Spheres
sections directly identified 35 base-class pages. These are not full entity
counts: other publisher indexes and nested item/feat collections need follow-up.

Run `npm.cmd run inventory:wiki -- --fetch` to fetch missing first-level sources;
run without `--fetch` for an offline repeat from cache. Requests are sequential
and delayed, and raw HTML plus detailed discovery metadata stay under ignored
`.local/wiki-catalog/`. The scanner does not create compendium documents, clear
rights, assign stable entity IDs, or infer mechanics.

Source review must distinguish index/category headings from entities, deduplicate
feats repeated on class pages, preserve edition information, and identify the
actual publishing collection for each description. All source collections remain
unreviewed in the discovery inventory until their provenance is checked.

## Pack and entity direction

Use separate Item compendia for items, feats, and base classes, organized by
source family and category. Reserve stable source keys and IDs only when an
entry is normalized into canonical JSON. Preserve native PF1 document types;
do not represent a class or physical item as a generic feat.

Descriptions should include prerequisites, benefits, limitations, tables where
relevant, and source links. They should remain useful before automation exists.
Record mechanics-review status in provenance metadata rather than inserting
implementation commentary throughout player-facing rules text.

The four-entry pilot now implements PF1 source validation, compiled-pack round trips, stable identities, description/reference guards and registered image provenance. It contains Extra Magic Talent, Lycanthrope Hunter's Kit, Incanter, and the Guile talent Favorite Tools. Four generated images are packaged. Remote document/sheet acceptance is pending. This pilot is not the complete catalog.

## Systematic intake update

The current catalog is a programmatic descriptive intake, not a completed set of
reviewed mechanics or artwork. See [the pipeline](SYSTEMATIC_INTAKE.md) and
[summary](../research/intake/summary.json) for exact counts and holds. User scope
includes all PF1 items, feats and base classes across publishers, plus missing
Guile talents; existing magic/combat talents and archetypes remain excluded.
Narrow-sheet wrapping is explicitly out of scope. Review class grant plans before
attaching sub-items, and review compendium matches before replacing draft data.
