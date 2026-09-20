# Hunter's kit reuse audit

Issue: https://github.com/sefaction/spheres-content/issues/7. Reviewed 2026-09-20
against installed PF1 11.11 and Pathfinder 1e Content 11.4.0. Candidate UUIDs,
package versions, hashes, search scope and decisions are recorded in
`research/kit-reuse-audit.json`. The user authorized reviewed packaged copies. The normalized kit source now
implements this assembly; remote acceptance is recorded in the checkpoint.
This is not blanket rights clearance for other records.

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

## Implementation and remaining acceptance

- Delivery resolved: reviewed packaged copies with attribution and core/system
  artwork references. No optional source module dependency is added.
- Selected rule/record notices and attribution are retained; see
  [provenance](CONTENT_PROVENANCE.md) and `ATTRIBUTION.md`. Core/system artwork
  was visually inspected and referenced, with no image bytes redistributed.
  Raw reference documents and images remain ignored.
- Source validation now covers containers, contained documents, consumables,
  weapons and registered external assets. Remote smoke checks image hashes.
  Reuse existing native item behavior where reviewed; defer newly authored
  passive and conditional modifiers as requested.
- The flat loot source is replaced, preserving its ID/source key.
  Remote alpha.3 confirms full-kit totals, component quantities, contained sheets,
  dagger actions/material and native quantity adjustments. Actor import and
  removal/transfer remain pending browser assistance. Previously imported test-world copies
  are not automatically migrated by a compendium update.

The former flat-kit drop test does not establish acceptance of the corrected
container. Keep PR #4 in draft until the revised scope is tested.
