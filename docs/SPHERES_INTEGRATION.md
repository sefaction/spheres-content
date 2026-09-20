# Spheres framework integration

Reviewed the upstream repository at tag `v0.9.0`, commit
`c6d91092edb174f2bb44d9128e2ac75b4331837f`, matching the installed module version.
This is source review, not a new runtime compatibility claim.

## Division of responsibility

Additional Spheres Content is a new content module with its own identity and
compendia. It covers the wiki's PF1 items, feats, and base classes across all
publishers. Existing magic/combat sphere and talent definitions are excluded. The user additionally authorized missing Guile skill talents. Archetype
entities and their application to classes are deferred to a later design discussion.

`pf1spheres` supplies the Spheres runtime framework: actor data preparation,
sheet extensions, talent types and counts, caster progression, roll support, and
additional PF1 Changes targets. Our future mechanics pass should use those
existing fields and targets instead of implementing a competing actor framework.
The presence of some upstream feat/class packs does not limit our catalog to
gaps; the user explicitly requested a new comprehensive collection.

## Interfaces observed in v0.9.0

| Interface                                     | Observed behavior                                                                                                                           | Content consequence                                                                                                                   |
| --------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------- |
| `flags.pf1spheres.casterProgression`          | Class progression is `low`, `mid`, or `high`; actor preparation combines its contribution using class levels and fractional-bonus settings. | Review and test this metadata during the mechanics pass; avoid additional Changes that double-count caster level.                     |
| Talent Item subtypes                          | `magicTalent`, `combatTalent`, and `skillTalent`; the module adds sheet sections and type choices.                                          | Use skillTalent for missing Guile talents. Ordinary feats remain PF1 feats, even when they grant talents.                             |
| `flags.pf1spheres.sphere` and `countExcluded` | Identifies a talent's sphere and whether to exclude it from normal talent counts.                                                           | Do not apply talent-count flags to ordinary feats merely because their descriptions mention a sphere.                                 |
| Changes targets                               | Adds Spheres caster level, sphere-specific caster level/BAB, magic skill bonus/defense, spell points, and concentration targets.            | Use only verified target IDs in the later modifier pass; descriptions come first.                                                     |
| `pf1spheresConfig`, `pf1spheresPostInit`      | Extension hooks expose configuration during initialization.                                                                                 | No runtime hooks are needed for the initial descriptive catalog.                                                                      |
| Compendium UUIDs                              | The framework config references its own rules journals and packs.                                                                           | Resolve links against the installed version; preserve a wiki source link where no matching upstream entry exists. Never invent UUIDs. |

Source references:

- [Actor preparation and caster progression](https://github.com/Ethaks/pf1spheres/blob/v0.9.0/src/module/actor.ts).
- [Item fields](https://github.com/Ethaks/pf1spheres/blob/v0.9.0/src/module/item-data.ts) and [sheet integration](https://github.com/Ethaks/pf1spheres/blob/v0.9.0/src/module/item-sheet.ts).
- [Changes configuration](https://github.com/Ethaks/pf1spheres/blob/v0.9.0/src/module/config-extra.ts) and [dynamic sphere targets](https://github.com/Ethaks/pf1spheres/blob/v0.9.0/src/module/changes.ts).
- [Initialization and hooks](https://github.com/Ethaks/pf1spheres/blob/v0.9.0/src/module/pf1spheres.ts).

## Coverage and validation limits

The installed manifest lists combat talents, magic talents, feats, classes,
class features, and rules. Although code supports skill talents, no separate
skill-talent pack is declared. Do not assume every Guile or newly published wiki
entry has a packaged upstream counterpart. The user authorized filling the Guile
talent gap after this coverage check.

The v0.9.0 manifest declares Foundry 12 and PF1 11.0 as verified. Our target is
Foundry 13.351 / PF1 11.11. The previous foundation acceptance had no dependency
enabled, so testing this combination is still required before making integration
compatibility claims. Do not upgrade or modify the installed framework as part of
content deployment.

The upstream software uses EUPL-1.2; its game content has separate OGL notices.
No upstream implementation code, artwork, or compendium documents are copied into
our canonical sources by this review. Reference checkout stays under ignored
`.local/`; keep original tooling licensing separate from imported rules.

Audit: upstream master and the latest release both resolve to v0.9.0's reviewed commit. None of its 4,277 YAML pack source files contain skillTalent. The magic talent named Guile belongs to the War sphere and is unrelated to Spheres of Guile. Core skill-sphere configuration lists 15 spheres; the wiki also links Occultism, which is absent from that configuration and needs separate integration review.
