# Physical item reuse review

Issue [#10](https://github.com/sefaction/spheres-content/issues/10) continues the
reviewed-copy policy established in #7. The first batch reviews nine imported
items with direct matches and adapts three existing identities. It does not
complete the 626-item catalog or the held-item queue.

## Repeatable audit

```powershell
npm.cmd run index:reuse
npm.cmd run audit:reuse -- --write --matched
npm.cmd run audit:reuse -- --search=scarf --json
```

`research/physical-item-review.json` covers 963 current physical candidates,
including 337 held candidates. It lists 24 candidates with matching records,
nine reviewed and zero stale decisions. Counts include duplicate-page candidates
that remain held. They are not counts of unique rules objects or finished items.
One optional Roll Bonuses pack remains unavailable and unchanged.

Search normalizes punctuation and word order, so Adventurer's Sash also finds
Sash, Adventurer's. It preserves distinct variant words and labels matches as
suggestions. This supplements the intake's original exact-name candidate list.
Description availability includes the superficial/unidentified field. Broader
synonyms and component searches still require explicit review.

`config/physical-item-reviews.json` records candidate UUID/version/record hashes,
description-field lengths, types, physical values, images, native behavior and
reasons. Changed page/description hashes, provider versions, record hashes or
candidate sets mark a review stale. Adapted canonical outputs are hash-pinned
and validated, including their selected source record. Raw snapshots remain
ignored; no original compendium database is opened for writing.

## Reviewed adaptations

| Item              | Result                                                                         | Price / weight     | Artwork                                              |
| ----------------- | ------------------------------------------------------------------------------ | ------------------ | ---------------------------------------------------- |
| Adventurer's Sash | Empty native container; the six sewn pouches and satchel are parts of the sash | 20 gp / 3 lb empty | Generated leather bandolier, 256px WebP, 5,892 bytes |
| Filter Scarf      | Native clothing; no armor bonus or armor subtype                               | 5 gp / 0 lb        | Reviewed existing core teal scarf reference          |
| Parasol, Umbrella | Waterproof umbrella variant, retaining the wiki device schematic               | 2 gp / 3 lb        | Generated umbrella, 256px WebP, 5,416 bytes          |

Selected records are from PF1 Content 11.4.0. PF1 11.11 alternatives were also
reviewed. Both sash alternatives were loot; both use unsuitable generic art.
The PF1 Content scarf has the better wearable profile and image. Its obsolete
`lightArmor` field is cleared because PF1 11.11 clothing has no child subtype.
The umbrella's complete wiki description prevents inherited common-parasol text
from obscuring that it is waterproof and preserves the device construction rules.
The wiki descriptions are already complete; they are retained with the selected
upstream physical fields and bibliography rather than replaced unnecessarily.

No contents are bundled with the sash. Capacity is unspecified; a numeric weight
limit is not invented. Container inventory adds contents to the empty sash's
price and weight. Size statements in these wiki descriptions describe the object,
not a differently sized creature's equipment; native wearer size remains Medium.

Native saving-throw notes on the PF1 scarf and umbrella alternatives are recorded
as candidates for the later conditional review. The selected PF1 Content records
have no actions, Changes or context notes, so none are removed from those copies.
The rules remain in their descriptions. No new automatic modifiers are authored.

## Rejected matches and follow-up

Seed of Life, Lightning Rod, Hidden Blade and Bloody Mess match unrelated powers
or feats. Liquid Courage matches a tincture and rage power, not the Mind implement.
Brazen Head matches a different Baphomet item, not the Mythos familiar. These
decisions prevent accidental substitution; their artwork and mechanics stay open.

The review also exposes a native-type defect: Hidden Blade is a +3 glamered
longsword/Illusion implement currently represented as generic equipment. Its
weapon profile/actions need a dedicated correction with attack checks. The new
reordered search finds Trail Rations, whose native Use action needs a quantity
test before reuse. Mapmaker's and Tanner's kits remain assembly candidates; a
matching flat record alone does not establish their container structure.

## Rights, updates and acceptance

These reviewed adaptations retain OGL rules and GPL notices for upstream record
format contributions. The existing wiki notices include Adventurer's Armory 2,
Adventurer's Guide and Ultimate Equipment. Human-reviewable adapted physical JSON
ships in `sources/items/`. Only the core scarf path is referenced; no upstream
image bytes are redistributed. Generated prompts, hashes and encodings are in
`config/content.json`. Readable icons live under `icons/items/adventuring-gear/`.

Document IDs and pack UUIDs are unchanged. Updates affect compendia; previously
imported world copies retain their old types and must be intentionally reimported
to receive these changes. No automatic world migration is performed.

Local and remote acceptance evidence belongs in the checkpoint and pull request.
Required runtime checks include the empty sash, adding/removing physical contents
without double counting, clothing equip toggling, descriptions/images and exact
post-load pack comparison.
