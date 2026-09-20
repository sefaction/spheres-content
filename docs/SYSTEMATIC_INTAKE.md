# Systematic wiki intake and auditing

The catalog has two separate completion measures: page coverage and reviewed
entities. A successful crawl does not mean every heading is an entity or every
imported record is finished. Raw HTML and full extraction candidates stay in
ignored `.local/`; canonical compendium sources remain under `src/packs/`.

## Repeatable workflow

```powershell
npm.cmd run crawl:wiki -- --fetch
npm.cmd run index:reuse
npm.cmd run intake:wiki
npm.cmd run plan:intake
npm.cmd run import:intake
npm.cmd run audit:sync
npm.cmd run verify
```

`crawl:wiki` reads the full sitemap and existing first-level seed inventory.
Requests are sequential and delayed, with cached HTML, source hashes, explicit
failures and periodic checkpoints. Without `--fetch`, it works offline. Use
`--refresh` for an intentional new source snapshot; `--limit=100` bounds downloads.
A refresh invalidates matching page approvals and review decisions when source
hashes change. It never updates canonical records automatically.

`index:reuse` inventories PF1 and installed-module Item packs, excluding ASC and
explicitly non-PF1 modules. It hashes and copies databases before extraction,
opens only local copies, and verifies the remote source did not change. Completed
snapshots have completion markers; partial extractions are not trusted. It does
not inspect world-owned compendia or install/enable modules. Unexpected layouts
remain explicit failures, including the Roll Bonuses pack's `lost` directory.

`intake:wiki` extracts edition-aware candidates, including feats embedded under
feat headings, base classes with progression tables, their class features,
Guile talents, and price-bearing equipment. It removes navigation, ads, scripts
and artwork. Current and legacy versions remain separate. Parser misses,
conflicting identities and duplicated descriptions are visible in the inventory.
It does not claim exhaustive entity recognition just because all pages loaded.

`plan:intake` reports every candidate's proposed disposition. `import:intake`
adds eligible descriptive drafts, preserving canonical files and stable IDs.
It requires exact page/kind rights approval and supported native profiles.
Existing source files are never overwritten by a scrape. The four initial pilot
identities have explicit aliases in `config/intake-aliases.json`.

A repeat import is safe: existing records stay unchanged. Review refreshed text,
profile fixes and reuse candidates as explicit source changes. Do not replace
canonical files with raw exports or regenerate IDs to accommodate parser changes.

Physical-item suitability review has a separate report and decision inventory:
`npm.cmd run audit:reuse -- --write --matched`. It supplements the exact-name
intake list with reordered-name matches, marks changed source/candidate snapshots
stale and keeps reasons for rejected namesakes. See [the review workflow](PHYSICAL_ITEM_REVIEW.md).

## Where to audit

| File                                  | Purpose                                                   |
| ------------------------------------- | --------------------------------------------------------- |
| `research/intake/summary.json`        | Candidate, source, pack and hold counts                   |
| `research/intake/coverage.json`       | Every source page, hash, parser warnings and disposition  |
| `research/intake/entities.jsonl`      | One searchable metadata/audit record per candidate        |
| `research/intake/promotion-plan.json` | Imported, preserved, duplicate and held decisions         |
| `config/intake-sources.json`          | Exact page hashes and rule kinds cleared for intake       |
| `config/intake-overrides.json`        | Reasoned, snapshot-bound corrections and scope exclusions |
| `config/audit-reviews.json`           | Durable per-facet decisions, bound to description hashes  |
| `config/integrations.json`            | Versioned native/optional-module integration contracts    |

Canonical sources use readable pack/page/entry filenames. Class-feature names
include their parent class. Icons retain the separate human-readable hierarchy
documented in CONTENT_PIPELINE.md. Temporary core icons mean artwork is unfinished;
they are not counted as reviewed illustrations. No wiki artwork is scraped into
packs. Compendium reuse candidates include UUID, provider/version, type,
description/image availability and placeholder signals; a name match alone is
not approval to copy a record.

```powershell
npm.cmd run audit:content
npm.cmd run audit:content -- --imported --needs=image --limit=20
npm.cmd run audit:content -- --kind=feat --needs=usage --json --limit=5
npm.cmd run audit:content -- --held --kind=item --json --limit=10
npm.cmd run audit:content -- --class=Incanter
```

Use `--search=word`, `--pack=class-features`, `--needs=links` or another facet to
narrow the queue. `audit:sync` adds canonical UUID/file references and resolves
candidate class-feature targets to imported documents. It updates audit metadata,
not Foundry actor data or native class associations.

## Audit facets and native fields

| Facet         | Review target                                                                     |
| ------------- | --------------------------------------------------------------------------------- |
| image         | `img`, existing compendium artwork, generated/shared icon choice                  |
| activation    | `system.disabled`, ability identity, native action activation and visibility      |
| changes       | `system.changes`, passive `system.changeFlags`, stacking and suppression          |
| contextNotes  | `system.contextNotes`, triggers, conditions and roll contexts                     |
| usage         | `system.uses`, per-day limits, recharge, action charge costs and shared resources |
| links         | `system.links`, source references, supplements and resolvable UUIDs               |
| advanced      | `system.flags`, ability type, materials, identification, other native settings    |
| classFeatures | Class sub-items, grant levels, repeated improvements and choices                  |
| compatibility | Native PF1/framework behavior and optional-module interactions                    |
| reuse         | Full suitability review of existing compendium candidates                         |
| description   | Extraction boundaries, complete rules, prerequisites, tables and source labels    |
| rights        | Selected rules, attribution, permitted artwork and source snapshot                |

States are `needs-review`, `needed`, `implemented`, `not-needed`,
`not-applicable`, `blocked`, or `deferred`. Automatic keyword signals propose
review work; absence of signals never marks a facet complete. Decisions require
a reason and the matching source-description hash. Changed text makes an old
review stale. Canonical draft flags mirror the audit states without inserting
development checklists into player-facing descriptions.

The native bibliography uses `system.sources` with a verified source title/link.
It is separate from optional Feature Sources' grant-origin metadata.

## Classes and associated items

Progression tables produce one row per level. Feature matching preserves the
source wording, repeated improvements, and ambiguity. A repeated numeric upgrade
is not automatically a second item. Commas inside parentheses do not split one
feature into several grants. Unresolved names and optional selections require
review. Class-feature entries preserve nested options in their descriptions;
these are not all granted automatically.

The plan records target UUIDs where matching feature entries exist. Native
`system.links.classAssociations` remains empty until the grant plan is reviewed;
then it can use PF1's level-based association mechanism. Charges/children links
that require actor-local IDs must be resolved on actors, not filled with test IDs
in a compendium. Archetypes remain deferred. Wind Whisperer demonstrates an
explicit exclusion: its detected table belongs to an archetype's companion,
not an additional base class.

## Intake holds and compatibility

Legacy versions, ambiguous identities, unapproved source scope, unsupported
Guile spheres, incomplete price/weight data, weapon/armor profiles and kits
requiring assembled contents are held rather than silently represented as a
different native type. The full inventory retains them for follow-up adapters
and review. Existing reviewed kits keep their actual usable contents.

Only pf1spheres is required. Optional integrations remain versioned research and
test candidates; source inspection is not compatibility certification. Prefer
native PF1 actions, uses, containers and class associations. Avoid duplicating
modifiers or caster progression across PF1, pf1spheres and optional modules.
Narrow-sheet wrapping is not a task: the user intends larger sheets.
