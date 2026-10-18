# Content provenance

Research recorded 2026-09-19. This inventory records evidence and unresolved
questions, not a blanket rights clearance for every wiki page or image.

| Collection                                | Source                                           | Rights evidence                                                                        | Import status            |
| ----------------------------------------- | ------------------------------------------------ | -------------------------------------------------------------------------------------- | ------------------------ |
| Original tooling/docs                     | This repository                                  | MIT, scoped in LICENSE                                                                 | Included                 |
| Pathfinder rules on Spheres of Power Wiki | http://spheresofpower.wikidot.com/               | Wiki identifies OGL 1.0a; source collection designations and notices still need review | See selected pilot below |
| Other wiki material                       | https://spheresofpower.wikidot.com/legal%3Astart | Wiki identifies CC BY-SA 3.0 for material outside OGL                                  | Not imported             |
| Images/icons                              | Four project-generated pilot images              | Prompts, hashes and scoped MIT declaration in config/content.json                      | Not imported             |

## Primary research

- [Wiki legal and OGL page](https://spheresofpower.wikidot.com/legal%3Astart): identifies the site's license categories and copyright notices.
- [Wiki about page](https://spheresofpower.wikidot.com/about): describes its source-submission requirements, including product-specific open-content and product-identity designations.
- [Other Options](https://spheresofpower.wikidot.com/other-options): demonstrates that the site includes multiple publishers beyond the Spheres families.
- [Errata log](https://spheresofpower.wikidot.com/errata-log): relevant to choosing current versus legacy entries.

## Before importing each collection

Record collection key, publisher, book/source title, source URL, retrieval/revision
date, license, relevant designations, required notices, attribution, and any
restrictions. Add applicable license texts under `LICENSES/` and update public
attribution before packaging. Keep artwork review separate from rules review.

The public repository must not receive purchased books, scans, raw private exports,
unreviewed scraped content, or assets lacking distribution rights. Personal-use
intent does not change the public repository's visibility.

## Selected descriptive pilot

The four source sections listed in `config/identities.json` are the only imported
rules in `0.1.0-alpha.2`: Extra Magic Talent and Incanter (Ultimate tab), Kit,
Lycanthrope Hunter's (current Equipment section), and Favorite Tools (Artifice,
Spheres of Guile). Their applicable non-Product-Identity rules are covered by
the wiki's Open Game Content declaration. Selected sections include game rules,
not copied artwork, maps, named setting characters or setting narrative.

Retain the complete wiki-published OGL-1.0a text and copyright notice list under
`LICENSES/OGL-1.0a-and-Wiki-Notices.txt`. This includes Ultimate Spheres of Power,
Spheres of Guile, the wiki, and contributing source notices. Source-page snapshot
hashes and exact URLs are attached to each canonical document. The Equipment
page does not identify a book beside this kit; provenance is the wiki's selected
open-rules section and complete notice list, not an invented book attribution.
This review does not clear every linked source collection or any wiki artwork.

Four project-generated images use the scoped MIT license to the extent rights
are held. They were generated without source images. Prompts, tool identification,
paths and SHA-256 hashes are in `config/content.json`. Art reuse is permitted by
the user's direction when appropriate to closely related entities.

## Compendium reuse audit

The user requested existing compendium entries and artwork be evaluated before
creating replacements. The [hunter's kit audit](KIT_REUSE_AUDIT.md) records
candidate UUIDs, installed versions and snapshot hashes for PF1 11.11 and
Pathfinder 1e Content 11.4.0. Four normalized component records are now contained in the kit source. Raw
snapshots remain ignored; no upstream image bytes are distributed.

Installed packages include GPL and OGL license texts. Review the selected
record's applicable terms and attribution before packaging a copy; do not
relicense it as original MIT work. Selected image paths point to core or PF1
assets, which can be referenced separately from any proposal to redistribute
their bytes. The user authorized reviewed packaged copies. PF1 game content is identified
as OGL on its official package page (https://foundryvtt.com/packages/pf1).
Selected equipment rules retain OGL notices from PF1 Content plus the existing
wiki notice list, which includes Animal Archive. GPL-3.0 is retained for upstream
record-format contributions; adapted human-reviewable kit JSON ships under
`sources/items/` as corresponding source. No upstream program code is included.

## Systematic descriptive intake (alpha.4)

`config/intake-sources.json` scopes exact cached page hashes and permitted entity
kinds for the bulk rules intake. These are selected PF1 rule sections under the
wiki declaration of applicable non-Product-Identity Open Game Content, not
permission to republish whole pages or artwork. The existing complete wiki OGL
notice list is retained. Pages or changed snapshots outside that inventory are
held for rights review. Legacy, ambiguous and unsupported entries have additional
independent intake holds. Book and publisher citations are not invented: native
`system.sources` names the wiki and the specific source link.

Every new entry is a descriptive draft whose extraction and mechanics still
need auditing. A rights-scope decision does not mark its image, settings, links
or rules interpretation complete. Generated pilot artwork is preserved. New
entries use explicitly unfinished core icon references until artwork/reuse
review; no wiki artwork bytes are copied. Existing compendium matches remain
recorded for full suitability review before replacing the draft with a reviewed
copy. No optional module artwork is redistributed.

Empty equipment/consumable/loot field profiles are derived from installed PF1
11.11 template data. Preserve the existing upstream OGL/GPL notices for adapted
record data; no upstream program code is copied. Human-reviewable physical item
sources and the empty profiles accompany the installed module under `sources/`.

## Reviewed mundane gear (alpha.5)

The four selected PF1 Content 11.4.0 adaptations are individually documented in
[the physical-item audit](PHYSICAL_ITEM_REVIEW.md) and
`config/physical-item-reviews.json`. Their source UUIDs, hashes, book/page metadata
and candidate decisions are retained. The source scope is registered separately
as `pf1-reviewed-mundane-gear`; the primary wiki provenance remains unchanged.
Existing full notices cover Adventurer's Armory 2, Adventurer's Guide and Ultimate
Equipment. Retain OGL-1.0a and GPL-3.0 record-format notices and adapted JSON source.
No named-setting material from rejected Brazen Head or other false matches is
copied. The scarf and Whiskey cup reference inspected core images. Two original images are
generated without source images and recorded under the existing scoped MIT terms.

## Reviewed native item profiles (alpha.6)

Hidden Blade adapts the PF1 11.11 Longsword record's native weapon categories,
attack action and system artwork. The wiki remains authoritative for its +3
enhancement, price, weight, caster level, aura, glamered property and Illusion
implement description. Rations, Trail adapts PF1 11.11 Trail Rations' single-use
data and system artwork while retaining the wiki text and physical values. PF1
11.11 treats loot as non-activatable, so the output uses its activatable
miscellaneous consumable type rather than copying the source record's loot type.
Exact source UUIDs and snapshot hashes are recorded in
`config/physical-item-reviews.json`; action arrays are independently hash-pinned.

Both PF1 images were visually inspected from the tested 11.11 installation and
are referenced at their system paths. No image bytes are redistributed. Retain
the PF1 OGL notice and GPL-3.0 record-format notice for adapted data. No world
migration is included, so existing world copies remain unchanged.

## Additional native firearm profiles: 2026-10-17

Physical-item group 2 adapts PF1 11.11 Blunderbuss, Pistol and Musket records
from `pf1.weapons-and-ammo` for the named Ethermagic firearms. Exact UUIDs,
package versions, input record hashes, changes and output hashes are recorded
in `config/physical-item-reviews.json`. Native firearm statistics, attack and
ammunition data, and base unidentified descriptions are retained separately
from the wiki’s complete named-item descriptions. The existing PF1 OGL notice
includes Ultimate Combat; existing GPL-3.0 record-format notices remain in force.
No upstream program code or artwork bytes are copied into the package.

Nine new generated equipment illustrations have prompt, source/output hash and
encoding records in `config/content.json`. Eight core artwork paths are
referenced after visual review, with provider/version and exact image hashes.
Other source records consulted for imagery are recorded as artwork-only
references; their unrelated rules and statistics are not imported.

## Ammunition, containers and Gonzo instrument profiles: 2026-10-17

Physical-item group 3 adapts PF1 11.11 Sling Bullet, Firearm Bullet, Light Mace,
Pistol, Greatsword and Sack native structures. Exact UUIDs, versions, source
hashes, selected fields and final output hashes are recorded in
`config/physical-item-reviews.json`. The Greatsword supplies only the native
two-handed weapon layout; its damage, critical values, groups, price and weight
are replaced by the named instrument's published data. The wiki remains the
source for all named-item rules and physical values.

`research/instrument-profiles.json` records the Rockstar class's instrument table
from the already approved source snapshot, with page/table hashes, proficiency
exception and the existing Gonzo OGL notice. Instrument-specific statistics are
Open Game Content under the existing intake scope. Default exotic proficiency
is retained; the Rockstar's martial treatment requires the relevant class.
The existing PF1 OGL and GPL-3.0 record-format notices remain in force; no upstream
program code or image bytes are packaged.

Twelve generated WebP illustrations total 95,062 bytes. Prompts, original/output
hashes, image-edit reference hash and encoding details are in
`config/content.json`. Seven existing image paths cover eight entries, with
visual review and inspected source records recorded individually. These are
references only, including artwork selected from unrelated records whose rules
are not imported. All new icons were inspected at inventory sizes.

Issue [#20](https://github.com/sefaction/spheres-content/issues/20) removes
publisher navigation from Sparkly's Glittergun using its same approved snapshot,
without changing rules, construction requirements or identity. Issue
[#22](https://github.com/sefaction/spheres-content/issues/22) tracks contradictory
Gonzo slot headers; descriptions are preserved and no publisher errata are
asserted. Native helpers and resource tracking remain subject to remote PF1
acceptance; no world migration is included.

## Final first-batch item profiles: 2026-10-17

The final fourteen entries adapt PF1 11.11 Light Crossbow and Buckler structures
with exact input UUIDs, versions and hashes in `config/physical-item-reviews.json`.
Native attack/ammunition and shield data are preserved; named magical prices,
weights, enhancements, caster levels and complete wiki rules override mundane
values. The existing PF1 OGL/GPL record-format notices remain applicable; no
upstream program code or artwork bytes are copied.

Trash Bag uses the already reviewed native Sack/container structure. Its
source-defined zero-value trash is a separate quantity-bearing native Gear
record under the same approved Gonzo snapshot. Its five-pound published full
weight is reconciled in `config/containers.json`, with no extra mundane Sack
weight. The child’s provenance resolves to the parent module item, and its
source approval is validated with the same intake scope. No new external rules
collection or specific improvised-weapon statistics are invented.

Archmage’s Cube of Gaming inherits the published Wizard’s Cube rules and ebony
card-box appearance; the inspected canonical base identity and source hashes
are recorded as modeling evidence. No IDs are merged or new wiki snapshots
imported. Source corrections under #20 and additive-price fixes under #24 retain
original snapshots and complete rules. Armor upgrades are references rather than
complete armor suits. These changes affect compendia, with no world migration.

Thirteen generated illustrations total 105,780 bytes, with prompts, original and
encoded hashes and 256 px WebP settings in `config/content.json`. One inspected
core holy-symbol path is referenced for Divine Symbol; the unrelated mundane
record’s rules and image bytes are not redistributed. All final illustrations
were checked at 64 and 128 px and retain the per-icon size budget.

## Ultimate Spheres metamagic apparatus review: 2026-10-17

Issue #26 freezes the next 100 existing Ultimate-edition canonical item entries,
without replacing first-batch membership, merging edition identities or refreshing
source snapshots. Akashic and legacy production remains excluded. The first
twenty reviewed apparatuses retain their original descriptions, tier prices,
construction text, source links and exact approved page hash.

`research/metamagic-apparatus-profiles.json` records game-rule facts from the
already approved OGL item page: tier caster levels, aura strength, sphere-effect
caps, three daily uses, handling and casting/cost rules. It excludes editorial
pricing commentary, ads and artwork. The existing complete Wiki OGL notice is
retained. Cascading’s normal-only tier and combined-talent limits are separately
reviewed. Taking a metamagic feat and using its physical apparatus remain
different rules procedures; the item does not grant that feat permanently.

PF1 Content 11.4.0 conventional rods were fully inspected via alternate names and
rejected for complete reuse because their rules/prices differ. Their UUIDs,
versions, hashes and rejection reasons are recorded in
`config/physical-item-reviews.json`; their rules are not copied. One visually
reviewed core rod image is referenced for the source-permitted held-rod form,
with the inspected PF1 11.11 Logical Metamagic Rod, Lesser record retained as
artwork evidence only. No third-party image bytes are packaged. Native defaults
continue to use the existing PF1 11.11 profile and notice scope.

## Second metamagic apparatus group: 2026-10-17

Twenty further Ultimate Spheres apparatuses preserve the same approved page
snapshot and their individual complete source descriptions and prices. Reuse
searches and twenty-four full conventional-rod alternatives are recorded in
`config/physical-item-reviews.json`; no rejected rules or artwork bytes are
imported. The previously inspected held-rod core illustration remains a reference.

Published exceptions now explicitly include Reaching’s five uses and repeated
activation, Extending/Fleeting’s paid-persistence timing, and Fleeting’s free
later dismissal. They share the same pinned profile table and native validation.
Flaring’s source-trigger/duration ambiguity remains under issue #27, with its
wording preserved and outcome interpretation deferred. No new license collection,
world migration or compatibility claim is introduced.

## Third metamagic apparatus group: 2026-10-17

Twenty entries, Seeking through Umbral, retain the same approved OGL snapshot,
complete source descriptions, original physical values and stable identities.
Eighteen full conventional-rod alternatives were inspected and recorded with
UUIDs, versions, hashes and rejection reasons; their different rules and prices
are not substituted. Previously reviewed neutral core rod artwork is referenced
for each selected rod form without importing image bytes.

The profile table now pins Still's mental carried/worn activation and Suppressed's
three-pound source weight. Toxic's additional poison dose is separately supplied;
no bundled poison or external inventory mutation is inferred. Conditional
creature, save, descriptor, duration and lighting outcomes remain explicit in
source and instructions. No new license collection or compatibility claim.

## Second-batch storage and equipment group: 2026-10-17

Twenty entries, Widening through Dragonstone, preserve the approved full text,
physical values, source snapshots and stable identities. Apparatuses use the
already approved page SHA 59c378a247ccf12d9c4a24c0d68daca55e3bd89856602ae810e6e4d482c03476;
Widening uses the previously pinned metamagic snapshot. The existing complete OGL
notices remain authoritative. The related Quill of Endless Ink entry was inspected
for Bonded Quills' inherited continuous/non-dripping ink rule; no extra carrying
cases, special ink inventory or remote magical writing is supplied.

Sack and Light Mace PF1 11.11 records provide native data structures with explicit
item-specific overrides. Boots' landSpeed enhancement, custom school labels and
the lack of container activation actions were reviewed against the versioned PF1
source; evidence paths/hashes are recorded in the group research file. No upstream
program code is copied. Existing OGL/GPL record notices remain in scope.

Nine original generated 256 px WebP illustrations total 69,628 bytes. Prompts,
source/output hashes and encoding are in config/content.json; source PNGs and
discarded previews remain ignored locally. Eleven reviewed core/system image
references ship without copying their bytes or unrelated source rules. Weather
aura/CL disagreement remains explicit under issue #31. No new compatibility claim.

## Final second-batch apparatus group: 2026-10-17

Twenty Ultimate apparatuses retain their complete approved OGL source bodies and
page SHA 59c378a247ccf12d9c4a24c0d68daca55e3bd89856602ae810e6e4d482c03476.
Exact, alternate and component searches precede authoring; full candidate records
and actual images were inspected. The reviewed PF1 11.11 Sack contributes only
native container structure. Two stable derived-source contents use their parent
source UUID/hash: one ordinary-ink magical quill and one ten-use medical-supply
bundle. Quantities, value/weight allocations and manual refill limits are pinned
in config/containers.json. No unrelated record mechanics are imported.

Sixteen original generated 256 px WebP icons total 124,308 bytes, with the largest
12,136 bytes. The built-in image tool was used; prompts, source/output hashes and
encoding live in config/content.json. Original PNGs remain ignored locally. Five
parent illustrations and one supply image reference inspected core/system paths;
third-party image bytes are not packaged. Native interface evidence and source
hashes are in research/physical-items-batch-2-final.json. Existing OGL/GPL notices
cover the reviewed data profiles; no upstream program code is copied. Source
aura contradictions remain explicit under issue #31. No compatibility claim.

## Third-batch charm group: 2026-10-17

Twenty charms retain complete approved OGL rules and page SHA
c048ba78478fe85c9bf496ac86978ca1c1737f2b24e6947bb2654d96870608be.
Twenty exact/alternate/component searches inspected 23 complete records; further
art searches inspected twelve more plus one complete existing module headband.
Actual candidate images were inspected before choosing or generating artwork.
The selected records, UUIDs, versions, source hashes and rejection/adaptation
decisions are pinned in config/physical-item-reviews.json.

Reviewed PF1 11.11 native bonus interfaces and source-file hashes are recorded in
research/physical-items-batch-3-charms.json. They distinguish base natural armor,
its enhancement, typed AC/CMD inheritance, saves, current ability totals and
natural-subtype attacks. No upstream program code is copied. Existing native-data
OGL/GPL notices remain applicable. Six corrected market prices are separate from
the unmodified original source bodies and approved snapshot.

Eight original generated 256 px WebPs total 52,300 bytes (largest 8,164). Built-in
image generation prompts, original/output hashes and encoding are registered in
config/content.json; originals remain ignored locally. Nine core/system image
references and three uses of the previously generated cloth headband import no
new third-party image bytes or unrelated item mechanics. The first group leaves
eighty images pending in the frozen third hundred; mechanics/acceptance remain
distinct. Akashic content is not selected.

## Second third-batch charm group (2026-10-17)

Twenty additional Ultimate charms retain the approved OGL snapshot and complete
source bodies. Full exact/alternate/component searches inspected 32 complete
records, eleven additional parent/component records, the existing original cloth
headband and the Keen component. Selected UUIDs, package versions and record
hashes remain review evidence; no unrelated donor mechanics or artwork bytes
are copied. Final illustrations were inspected at both 64 and 128 pixels.

Eleven built-in image-generation illustrations are compact 256 px WebPs totaling
74,808 bytes, largest 10,402 bytes. Prompts, source/output hashes and encoding
details are registered in config/content.json; original PNGs remain ignored.
Eight existing core/system image references and one previously generated original
headband require no new third-party image copies. Reviewed native empty equipment,
activation, charge and note interfaces retain existing OGL/GPL data notices;
no upstream program code is copied. Issues #31/#37/#41/#42 track the remaining
source/aura/price and native-interface questions. Sixty third-batch images remain.

## First third-batch compound group (2026-10-17)

Twenty Ultimate compounds retain complete approved OGL bodies from snapshot
364b8288268fe094544a24059329d1010c21745c680b8c3f23e6abc23e61698f.
Fifty-three complete exact/alternate/component/art records were inspected.
Research pins candidate UUIDs, versions, hashes and native interface source files.
Six existing core/system illustrations are image-only references for twenty
single vials/flasks, inspected at 64/128 px. No new artwork bytes, poison/drug
rules or unrelated donor data are copied. Native empty consumable/healing data
retain existing OGL/GPL notices; no upstream program code is copied.
Hallow's unresolved source wording is recorded under #44 without rewriting the
body. Quantity, price and weight remain source-defined; no extra empty bottle
price/weight or constructed contents are added. Forty third-batch images remain.
