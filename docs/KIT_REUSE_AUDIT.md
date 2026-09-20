# Hunter's kit reuse audit

Issue: https://github.com/sefaction/spheres-content/issues/7. Reviewed 2026-09-20
against installed PF1 11.11 and Pathfinder 1e Content 11.4.0. Candidate UUIDs,
package versions, hashes, search scope and decisions are recorded in
`research/kit-reuse-audit.json`. This is metadata and an assembly proposal,
not a new distributable container or blanket rights clearance.

## Existing entries and proposed assembly

| Role            | Existing entry                        | Quantity | Decision                                                                          | Total gp | Total lb |
| --------------- | ------------------------------------- | -------: | --------------------------------------------------------------------------------- | -------: | -------: |
| Outer container | PF1: Pouch, Waist                     |        1 | Adapt loot to container; use the existing generated kit image                     |      0.5 |      0.5 |
| Contents        | PF1: Wolfsbane                        |        5 | Reuse rules and source information; review the potion-style image for suitability |      2.5 |        0 |
| Contents        | PF1 Content: Weapon Blanch (Silver)   |        5 | Reuse the specific consumable variant                                             |       25 |      2.5 |
| Contents        | PF1 Content: Deodorizing Agent (Vial) |        1 | Reuse the better consumable record                                                |       30 |        0 |
| Contents        | PF1: Dagger                           |        1 | Adapt to alchemical silver; retain the useful weapon description and image        |       22 |        1 |
| Complete kit    |                                       |          |                                                                                   |   **80** |    **4** |

The pouch mapping is an interpretation: the wiki specifies a leather pouch
without naming its separate equipment record. The 5 sp waist pouch reconciles
the kit's listed totals. The separate Belt Pouch container costs 1 gp and would
make the total 80.5 gp. Do not silently use it without reconciling that difference.
The outer pouch is the container, not an additional duplicated object inside it.

The dagger is a 2 gp light weapon plus the 20 gp alchemical-silver surcharge
from the [Core Rulebook equipment rules](https://legacy.aonprd.com/coreRulebook/equipment.html).
Its useful description is in PF1's superficial/unidentified field; an empty
identified description does not mean the record lacks descriptive text.
The material's damage penalty is a later mechanics-review consideration, not an
excuse to lose the weapon's material identity during intake.

## Search and suitability

Inspected local read-only snapshots of PF1 items and weapons/ammunition;
PF1 Content items, goods/services and maladies; and Kris's Trade Goods and
Armaments. Installed Item-pack manifests were inventoried to select relevant
collections. No exact preassembled hunter's kit was found in these packs.
This does not assert that every optional pack, world compendium or publisher
has been exhaustively searched.

Search both `blanch` and `blanche`. A broader name search found the silver
variant after the wiki spelling initially missed it. Do not substitute Blanch
Bomb or Wolfsbane Retreat: similar names describe different rules objects.
The system's generic Weapon Blanch loot entry has placeholder art and an
adamantine-level price; the silver consumable is the better candidate.

PF1's native container stores complete contained records in `system.items`,
keyed by IDs, and adds content price and weight when calculating totals. Thus
the empty container must have 0.5 gp and 0.5 lb under this proposal, while the
description retains the advertised full-kit totals. Stable child IDs, quantities,
source records and asset paths need validation alongside the parent ID.

## Remaining work

- Resolve the user's requested delivery preference: reviewed packaged copies
  versus requiring and referencing optional source modules. No optional module
  was enabled or added as a dependency during the audit.
- Review selected rule/record licenses and attribution before committing copies.
  PF1 and PF1 Content ship GPL and OGL texts; artwork requires separate attention.
  Referencing an installed core/system image and redistributing its bytes are
  different operations. Raw reference documents and images remain ignored.
- Extend the source format and validators for containers, contained documents,
  consumables, weapons, external assets and the chosen reference strategy.
  Reuse existing native item behavior where reviewed; defer newly authored
  passive and conditional modifiers as requested.
- Replace the provisional flat loot source while preserving its ID/source key.
  Test full-kit totals, component quantities, contained sheets, item removal,
  consumable behavior and actor import. Previously imported test-world copies
  are not automatically migrated by a compendium update.

The former flat-kit drop test does not establish acceptance of the corrected
container. Keep PR #4 in draft until the revised scope is tested.
