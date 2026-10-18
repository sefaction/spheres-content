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

## Final first-batch review group

The final fourteen entries complete the frozen batch’s image-review queue. This
is local source/profile/art review, not a claim that all 100 entries are fully
automated or remotely accepted. Akashic production remains deferred.

The rainbow disc is a native +2 buckler, and Leviathan Cross is a native +1 light
crossbow. Trash Bag carries five pounds of zero-value trash as separately
tracked contents; remove one or three units for a one- or two-handed improvised
object and resolve its attack statistics manually. Regeneration is manual.
Its published full weight already consists of those contents.

Armor properties remain upgrade references with their additive price. Apply them
to reviewed armor before adding actor-dependent effects. Single-use items track
quantity; the Cradle’s daily activations and momentum are distinct resources.
Variant, deity/domain, utility-talent and cohort choices remain explicit. Native
helpers do not create actors, change burn, apply broad bonuses or migrate worlds.

## Metamagic apparatus handling and conditional effects

The third twenty-entry group uses the reviewed lesser tier (CL 5; sphere-effect
CL cap 7), three daily uses, and one native application helper per item. Still
is mentally activated while carried or worn and does not require holding or
wielding. Suppressed retains its three-pound published weight; the other nineteen
retain their individual five-pound values. Full source text and prices are intact.

Toxic consumes a separately supplied actual poison dose in the rules, but its
helper spends only an apparatus daily use; the dose and two saving throws remain
manual. Selective uses the casting ability modifier rather than a conventional
rod's fixed count. Studied bypasses only racial defenses after its racial-CR
Knowledge check. Tricking uses Charisma for its dirty trick check. Conditional
light/darkness, resistance, conditions and later saves remain effect-specific
instructions, pending an actual casting/target interface and remote acceptance.

## Second-batch storage and equipment profiles

Empty native containers preserve separately usable user-added contents without
bundling illustrated wands, grenades or flask liquids. The grenade bandolier is
the base 900 gp, five-empty-slot variant; transient bomb generation starts at a
separate upgrade. Bottomless Flask has five twenty-gallon spaces in the source;
compartment/volume accounting and pouring stay manual, with no invented weight
limit or weight exemption. PF1 container sheets do not expose activation actions.

Bludgeoner's Rod is a native +2 light mace. Its normal attack does not always add
the conditional 15d6; a move-action helper explains the next-first-attack limit.
Boots of Striding add ten enhancement feet only to land speed, without inheriting
the conventional Striding and Springing item's Acrobatics benefit. Soulreaving's
external souls and free daily use are separate; Crimson Flask's two-point least
variant starts empty and does not refresh daily. Paired notebooks/quills count as
one complete priced set. Crafted choices and conditional defenses remain explicit.

Spheres school names use PF1's native custom-school field. The two Weather cloaks
retain published CL 5 and moderate-aura text while PF1 derives faint strength;
issue #31 tracks this discrepancy. Do not silently rewrite the source or raise CL.

## Final second-batch apparatus group

The final twenty records finish image review for the frozen second hundred,
while conditional mechanics and broader acceptance remain incomplete. All twenty
retain full original source bodies, top-level IDs and approved snapshot hashes.
Sixteen original icons include a separately usable quill; five parent images and
one supply illustration reuse visually reviewed core/system paths.

Keyhome and Pocket of Holding are empty native containers. Their ten ten-foot
cubes and one-cubic-foot/ten-pound limits stay separate; neither borrows an
unstated weight exemption. Patch Hole is equipment with three daily standard
activations lasting one minute, following Create Gap rather than portable-hole
storage rules. Spatial and scene outcomes remain manual.

The mundane Quill of Endless Ink case holds one CL 1 magical quill and has room
for two more; it does not supply three. Its 80 gp total is allocated to the quill.
Medic Satchel holds one usable supply bundle with ten kit-use charges. Daily or
spell-point refill is manual and depends on the original bag. The published full
one-pound weight and 250 gp value are counted once on the parent; zero child
values prevent double counting, rather than defining weightless loose supplies.
Separate supplies require a manual allocation because the source gives none.

Seamstress Cuffs track remaining daily feet, not activations. Their helper spends
zero and actual produced length is subtracted manually. Unspecified command or
handling timing uses Special. Conditional class features, crafted talent choices,
enemy targeting, healing while held, scene light and source-specific checks stay
explicit without global modifiers or automated world changes. The Lenses and
Gentle Shade also retain faint-aura/CL disagreements under issue #31.

Updates affect compendia only. Existing imported world copies require deliberate
reimport; no automatic type conversion or actor migration is performed.

## Third-batch charm bonuses

The first twenty third-batch charms retain full original rules, IDs and source
snapshots. Six ability belts/headbands select +2 at CL4, correcting their draft
construction-cost prices to the published 4,000-gp purchase tier under issue #37.
Their first twenty-four worn hours remain temporary; permanent-only consequences
and Genius' one crafted skill/rank assignment remain explicit manual steps.

Native typed AC bonuses inherit CMD where appropriate without duplicate Changes.
Luck and resistance saves are separate. Necklace of Natural Armor and Ironside
Ring grant base natural armor; Pugilist's Charm and Talisman of Techniques enhance
natural armor. These use different native fields and must not be interchanged.
Any-slot charms select an actual occupied neck slot, rather than becoming slotless.
Crafted maneuver/energy choices remain unselected; conditional notes do not grant
global CMB, CMD, saves or resistance. One glove record means one complete pair.

Pugilist's native natural-attack bonuses do not cover PF1's weapon-subtype Unarmed
Strike. Manual unarmed handling remains explicit under issue #38 without improving
ordinary weapons. Air Mastery's lesser tier grants Improved Bull Rush treatment
only for Air Blast, while its specific defensive CMD bonus is continuous. The
base Umbral Mantle grants +1 resistance saves; later scaling benefits require
deliberate progression review. Its source aura discrepancy remains under #31.

Eight original compact illustrations complement nine inspected core/system
references and three uses of the existing original cloth headband image. Image
reuse imports no unrelated item rules, stealth, psionics, or elemental choice.

## Second third-batch charm group

Twenty further charms preserve complete original bodies, stable IDs, quantities
and source hashes. Eleven original compact WebPs (74,808 bytes total), eight
core/system image references and one existing original headband finish image
review for forty of the third hundred. Sixty images remain; Akashic is deferred.

Fourteen native helpers across eleven items preserve source timing and costs.
Clarity, Force Armor and Potential Realized track daily uses; Remnant tracks a
single charge restored manually after an actual rolling twenty-four hours,
including the separate per-user limit across all remnants. Eleven conditional
notes grant no unconditional actor bonus. External mythic/channel resources,
crafted choices, attunement, actual armor creation and copied healing remain
manual. Academy Uniform selects only its ten-gp base tier. Constellation Belt
keeps equipment form and object-size capacity, without invented storage weight.

Talisman of Spell Resistance costs 30,000 gp, correcting the draft construction
cost under #37. Its SR 15 requires source comparison under #41, not a stacking
+15 or an unconditional overwrite. Forger's Gloves explicitly retain the
undefined target beneficiary under #42. Remnant and Skilled Casting aura
contradictions join #31. Research, complete candidate provenance and focused
regressions are recorded in research/physical-items-batch-3-charms-2.json.
Representative native helper acceptance and the complete installed audit passed;
see TESTING.md. Broader specialized outcomes remain deferred; no compatibility
claim is added.

## First third-batch compound group

Twenty potions, oils and elixirs now use native consumable sheets and actual
single-dose quantities. Twenty-one helpers include Quintessential Oil's separate
unimbued preparation and expenditure. Common Cure rolls fixed 1d8+1 positive
healing; fixed spell-cleansing checks retain item MSB +5/+10 and one/three
ongoing-effect limits. Actual target application and temporary effects stay
manual, with no persistent benefit from carrying a bottle.

Complete exact/alternate/component searches inspected 42 records, ten further
art donors and the Life Cure component. Six suitable existing vial/flask images
serve all twenty entries; final artwork reviewed at 64/128 px. No new image bytes
or donor poison, drug, preservation or lamp-oil mechanics are imported.

Selected base tiers, one-minute animation, ordinary potion/oil timing, size caps,
ongoing-condition exceptions and Renewal's capped once-per-drinker daily benefit
remain explicit. Hallow Word Oil's opposed-alignment wording discrepancy is
manual under #44. Full bodies, tables, source hashes, IDs, prices and weights
are preserved, including Lesser Spell Cleansing's published construction cost.
Sixty of the frozen third hundred have reviewed images; forty remain. Native
acceptance is pending, and no compatibility claim is added. Akashic is deferred.
