# Testing

## Native container pilot: 2026-09-20

Commit `873659499caa08ddeb3a9a5d565cc39e5d9809b9`, module alpha.3 on Foundry
13.351 / PF1 11.11 / pf1spheres 0.9.0. Fifteen local tests, exact compiled
round trips, deterministic builds, both CI platforms, safe deployment, strict
installed hashes and four core/system image hashes passed.

In the dedicated world, the kit and all four component sheets render correctly.
Five wolfsbane, five silver blanch, one deodorizing vial and one silver dagger
total 80 gp / 4 lb including the 0.5 gp / 0.5 lb empty container. The dagger's
native Melee/Throw actions and Alchemical Silver checkbox survive import.
Reducing the blanch quantity to four removes 5 gp / 0.5 lb; restoring five
restores the totals. All checks used a new test copy, not old imported data.

Actor acceptance completed after Chrome file-URL access was enabled and the
browser reconnected. Native Import Data loaded the canonical kit fixture into
ASC Container Acceptance: inventory totals were 4 lb / 80 gp. Native Take moved
the silver dagger out of the container without changing actor totals. The kit
then weighed 3 lb with 57.5 gp contents. The dagger retained its Melee/Throw
picker; a Melee attack produced a native attack/damage chat roll. The actor
retains that withdrawn dagger; the separate world kit copy remains full. This
verifies actor inventory/withdrawal through native import and controls, not an
automated drag-and-drop gesture.

Final runtime commit `80600de7e17d211617a1291bd50db71936d28a06` normalizes reviewed native defaults
on all four pilot sources and organizes icons by content category. Foundry had
persisted only missing default fields; no source rules or contained records
changed. The complete comparator was preserved. Fifteen tests, full compiler
round trips, deterministic 43-file archives and Windows/Ubuntu CI passed.
Staged deployment retained a rollback copy; strict installed hashes passed.
All four pilot sheets reopened correctly; all four new icon paths visibly
loaded. HTTP/hash checks passed for the four organized icons, four legacy aliases
and four core/system references. After returning to Setup, the exact semantic
audit passed for every installed pack against the deployed commit.

The earlier browser session captured one startup viewport error; no item/roll
error appeared. Final browser error capture is empty. Server debug logs through
08:58:27 local time contain 637 info records and no warnings/errors.
No automatic consumable effect or silver damage modifier is implemented.
Feat/skill-talent actor checks and the non-GM/lifecycle warning baseline remain
pending; the content compatibility profile remains unverified.

## Local foundation gate

Run `npm.cmd ci`, then `npm.cmd run verify`. CI uses the same commands on Windows
and Linux. The gate checks formatting, JavaScript syntax, boundary tests, manifest
identity/version/relationships, the empty-content intake gate, package allowlist,
ZIP root and bytes, and deterministic clean rebuilds. It also tests the official
compiler/extractor with synthetic data. This is not a PF1 behavior test.

Generated output is limited to `dist/` and `.build/`. Cleanup checks resolved
workspace containment and rejects symlinks before removing either directory.
Build metadata records source commit and whether the worktree was dirty; a local
dirty build is a review artifact and cannot be deployed by this foundation.

## Remote foundation acceptance — 2026-09-19

Tested installed commit `6b2ad38e5f94e911358ca4d3807732ed834eb103`, module
`0.1.0-alpha.1`, Foundry `13.351`, PF1 `11.11`, world
`additional-spheres-content-test`, as Gamemaster. Later changes normalize a local
CI fixture and update comments/documentation; runtime manifest and empty content
are unchanged. The final deployment receipt and PR identify the review commit.

- SMB dry run, initial installation, and remote hash/availability smoke passed;
  all 13 installed files matched the receipt.
- After the authorized container restart, Setup recognized the module.
- With zero other modules, enabled/saved/reloaded: Active Modules 1;
  disabled/saved/reloaded: Active Modules 0; re-enabled/saved/reloaded: Active Modules 1.
- Compendium sidebar inspected; zero packs registered as intended. Document,
  image, UUID, drag/drop, calculation, and player-visibility tests await content.
- No browser errors. Enabled and disabled captures each contained 58 warnings
  with identical types from deprecated PF1/core APIs; none referenced this module.
- Server debug/error logs inspected from restart through lifecycle tests:
  524 scoped debug records, zero errors, no warnings or module-specific errors.
  Private raw logs are not committed.
- Returned to Setup after acceptance. The dedicated world's module remains
  enabled for its next session.

## Deferred content and release checks

- Establish tested content compatibility fields and evidence validation with the first content batch.
- Implement PF1 document schema, reference, and mechanics tests alongside the first content batch.
- Validate representative compendium entries, drag/drop, bonuses, stacking, and conditional notes.
- For a release, validate actual install/update from its manifest and versioned ZIP.

The `release:check` command currently fails closed. Release/tag/manifest publishing
automation will be implemented after the first tested candidate and an agreed
distribution approach. No CI job deploys or publishes anything.

## Bootstrap workflow exception

The repository contract normally requires remote acceptance before a completed PR.
The setup PR was opened as a **draft** while access was incomplete. Foundation
acceptance is now complete and the PR can be marked ready for review. The related
issue stays open until the individually approved merge. Commit build inputs before
deploying the reviewed commit; record evidence in the PR and checkpoint afterward.

## Descriptive pilot, 0.1.0-alpha.2 — integration pending

Local source/asset/identity validation and complete compiler round trips pass for
four records in four packs. Fourteen automated tests pass, including a semantic
pack audit that catches content drift without writing the source database. Clean archive hashes
match after retaining diagnostic LevelDB logs outside the package. Native PF1
fields were checked against the installed 11.11 template and configuration;
Guile uses pf1spheres 0.9.0's skillTalent subtype and Artifice sphere flag.

Commit `300a37551af0741f006b45ba3f2212ad36037aba` was deployed using the staged
replacement helper; all 35 files matched the receipt. The designated container
restart completed, and the idle automatically launched campaign was returned to
Setup. A Setup-only semantic audit subsequently matched all four documents to
that deployed commit and all non-pack bytes to its receipt. Both CI jobs passed.

Partial UI acceptance on 2026-09-20: a fresh Chrome tab resolved the old tab's
zero viewport. Launched the dedicated world as Gamemaster, enabled pf1spheres
0.9.0 alongside this module, and saved/reloaded. All four packs have one entry;
all four sheets open with their descriptions and generated images. Verified
Incanter's d6/low BAB/poor Fortitude and Reflex/good Will/4 skills, the kit's
80 gp/4 lb/quantity 1, Extra Magic Talent's feat type and search, and Favorite
Tools' Skill Talent subtype and Artifice sphere. All four Changes/context-note
lists are empty. Incanter appears independently in PF1's class browser and
imports to world Items using its native Import Entry command.

Created the controlled PC `ASC Pilot Acceptance`. Automated drags from both
compendium and world Items produced no actor import and no error. A manual drag
was requested to separate browser-control failure from a document problem;
the user confirmed Incanter opens the level-up dialog. Subsequent UI inspection
shows level 1, 6 current/max HP, +0 BAB/Fortitude/Reflex, and +2 Will; the chat
report confirms automatic 6 HP. All four entries also import into world Items.
Manual drops for the other three are pending. A diagnostic window drag works,
so the automation problem is specific to document transfer. Created a dedicated
Player-role `ASC Test Player` for the remaining visibility check; not logged in yet.
Browser capture has zero errors and 74 warnings,
principally deprecated APIs plus a PF1 browser filter warning. Server debug
records from 00:11:29 to 00:16:52 local time: 145 records, zero errors/warnings.
Issue #6 records native source-label and narrow table presentation defects.

Still required: actor drag/drop and calculations, non-GM visibility,
framework-only warning comparison, final lifecycle checks and semantic audit
after returning to Setup. The test world remains running for the manual drag.
No content compatibility claim has been added.
Changes, conditional notes, effects, actions, scripted automation and
caster progression remain empty/deferred. Do not treat old empty-shell acceptance
as acceptance of this content batch.

## Alpha.4 systematic intake acceptance

Full clean local verification passed on fa07d6b (24 tests). Gates cover all
canonical records, asset encodings/size budgets, exact
compiled round trips and deterministic archives. Parser regressions cover edition
boundaries, nested text, sanitization, Unicode names/weights, kit/weapon holds,
stale rights/reviews and progression-table grants. Two identical 679-file archives
passed the rebuild check. Both Windows and Ubuntu CI passed. The authorized
rolling-retention build deployed successfully, retaining six backups without
deletion. Strict package hashes and eight external image hashes passed.

Runtime checks passed on Foundry 13.351 / PF1 11.11 / pf1spheres 0.9.0 with only
ASC and the framework active. All five packs appeared without a container restart.
Opened Blacksmith, Skilled Craftsman, Extra Magic Talent, Confident Craftsmanship,
Catnip Hookah, Arcanis Venenum and Refinement Charm in their native sheets.
Descriptions, source labels, search and the pilot WebP render correctly.

Native JSON import placed seven canonical records on ASC Intake Acceptance in
the expected class/feature/inventory sections. Physical totals are 5 lb / 3,570 gp.
After browser reload, Blacksmith level 1 gives HP 10/10, BAB +1, Fort +2, Ref +0,
Will +2. The initial post-import sheet had stale derived values; do not count
that transient display as a class-data failure. This checks native actor import;
automated document drag is still unverified for the new records.

ASC Test Player sees all five locked packs and can search/open Extra Magic Talent
with its read-only sheet, description, source link and WebP. Browser error capture
is empty; existing PF1/framework deprecation warnings remain. Server daily debug
log through 10:56 local contains 803 info records and zero warnings/errors, with
no daily error file. Returned the dedicated world to Setup; the final exact
installed semantic audit passed for all 6,788 documents, non-pack bytes and eight
external image hashes. Only local copies of installed LevelDB were opened.
See draft PR #9 for the evidence and remaining review scope.

Class links, new actions and modifiers remain empty by design pending review.
Optional-module contracts have only source review and require separate tests.

Retention regression fixtures verify read-only previews, ten newest backups,
protection of unrelated/staging folders, and refusal on failed installed hashes,
wrong module identities or linked backup contents.

## Alpha.5 physical-item review acceptance

Full clean verification passed on `e3cd4c22e39aca685a128d9d2e39983dcffeaf5e`
with 27 tests, exact compiled round trips for all 6,788 documents and two
identical 682-file archives. The review ZIP SHA-256 is
`2eb96fd612190c73b725f2d020dc4320ca1f2bbe1a330b571e483502a6d36416`.
Staged deployment retained seven module-only backups and deleted none. Strict
installed package hashes and nine referenced core/system image hashes passed.

Runtime acceptance used Foundry 13.351, PF1 11.11 and pf1spheres 0.9.0 in the
dedicated test world. ASC alpha.5 and pf1spheres were the only active modules.
All five locked packs appeared. Adventurer's Sash opened as a native empty
container at 20 gp / 3 lb, Filter Scarf as clothing at 5 gp / 0 lb, and Parasol,
Umbrella as gear at 2 gp / 3 lb with the retained waterproof and crafting text.
The two generated WebP icons and the reviewed core scarf image loaded visibly.

Native JSON import loaded the three reviewed records into a fresh controlled
actor. With the umbrella inside the sash, actor totals were 6 lb / 27 gp and the
sash reported 3 lb / 2 gp of contents. Native Take moved the umbrella to the
actor's Gear section; totals remained 6 lb / 27 gp and the empty sash returned
to 3 lb. Toggling Filter Scarf to equipped changed its native state without
changing actor calculations, as expected while authored mechanics remain
deferred. This verifies import, container accounting and native transfer controls;
it does not claim an automated drag gesture.

Browser capture contains no ASC errors. Existing PF1 and pf1spheres Foundry 13
deprecation warnings remain. Server records from deployment through the test
contain 152 info entries and one unrelated failed `ASC Test Player` login warning,
immediately followed by a successful login; there is no daily error file. The
world was returned to Setup before the final exact installed semantic audit.
That audit passed for all 6,788 pack documents against canonical sources at the
deployed commit, all non-pack receipt bytes and all nine external image hashes.
Only local copies of installed LevelDB were opened.

## Alpha.6 native item-profile acceptance

Full clean verification passed on `c9107729ce1a5e2189bcacff1d1a9d80efd996f0`
with 29 tests, exact compiled round trips for all 6,788 documents and two
identical 682-file archives. The review ZIP SHA-256 is
`9fe6c060ba778d9a6bee43b00192edcaa31a647cec23fbe5484c1e9efff49f3a`.
Staged deployment retained ten module-only backups and deleted none. Strict
installed package and external-image hashes passed without a restart.

Runtime checks used Foundry 13.351, PF1 11.11 and pf1spheres 0.9.0 with only ASC
alpha.6 and the framework active. All five locked packs appeared for the Player
user. Hidden Blade opened with the reviewed longsword art, Weapon / Martial /
One-handed profile, +3 enhancement, heavy-blade group, CL 10, moderate Illusion
aura, native Attack action and wiki implement text. Rations, Trail opened with
the reviewed preserved-food art, Miscellaneous Consumable subtype, 0.5 gp / 1 lb
values, native Use action and Single Use setting. This type is intentional: PF1
11.11 treats loot records as non-activatable, which the first actor check exposed.

Gamemaster actor checks used the level-1 `ASC Pilot Acceptance` actor. Hidden
Blade imported and produced its native melee attack chat card with the +3
enhancement. After importing the framework's base Illusion talent, the actor's
base Illusion CL was 0. One equipped Hidden Blade raised it to 3; unequipping
returned it to 0; re-equipping restored 3. Duplicating the equipped blade left
the result at 3, confirming PF1's normal enhancement-bonus nonstacking while the
bonus remains uncapped by the actor's one Hit Die.

A freshly imported corrected Rations, Trail exposed its Use action on the actor.
After increasing the test stack to three, one use produced a chat card with charge
cost 1 and left the item present at quantity two. The older actor-owned loot copy
was left in the disposable fixture, demonstrating that this compendium update
does not migrate existing world items.

The final browser capture contains zero errors and 113 PF1, pf1spheres and Foundry
13 deprecation warnings. The current server debug log contains zero errors and
only two historical rejected-login warnings; no new warning appeared during this
acceptance run. The dedicated world was returned to Setup. Final semantic audit
matched all 6,788 pack documents to canonical sources, all non-pack receipt bytes
and all referenced image hashes using local copies of the installed LevelDB
databases.

## Alpha.6 Akashic wondrous-item slice

Clean verification passed on `dd68c2885ccc782a9694e266f1453a61fb7ec64c`
with 32 tests, complete reference validation and two identical 697-file builds.
The staged SMB deployment verified exact installed bytes, pruned one oldest
eligible backup and retained ten. Strict pre-load hashes passed without a host or
container restart.

Runtime checks used Foundry 13.351 and PF1 11.11 in the dedicated world. Blood
Funnels, Refinement Charm, Ring of a Thousand Names and Suqur's Gift opened with
their original compact WebP art, native wondrous profiles, prices, slots, caster
levels, schools and complete source descriptions. The ring exposes its reviewed
free action. PF1 derives Blood Funnels' visible `Necromancy (Faint)` label from
its published CL 5 and has no separate aura-strength override; the source's
moderate necromancy remains visible in the description and the Advanced audit is
deferred. No module error was captured. The only browser error was a harmless
join attempt before the Gamemaster user was selected.

The world was returned to Setup. A fresh final semantic audit matched all 6,788
pack documents to the deployed commit, all non-pack receipt bytes and referenced
external images. An earlier attempt encountered an intermittent iterator-close
error while extracting a local copy of the Classes pack; the unchanged snapshot
immediately extracted all 117 records on isolation, and the complete retry passed.

## Alpha.6 twenty-item production acceptance

Clean committed verification passed on
`fed942b697ca785abe7a54723d46b4943c4f30d0` with 37 tests, full reference
validation and two identical 719-file builds. The ZIP SHA-256 is
`e68a66d7c6472a120a023b0a53a8a270ebf64714c5b9d2dea1efa80f2b889f21`.
The staged SMB deployment verified exact installed bytes, removed one oldest
eligible rollback and retained ten. No host or container restart was performed.

The Items pack displayed 626 entries in Foundry 13.351 / PF1 11.11. Alteration's
Bane opened as a CL 14 evocation Potion/Oil with the complete description,
Single Use setting and pinned Drink action. Apprentice Blastmage's Etherstaff
opened as CL 8 evocation wondrous equipment with 10/10 native charges. Band of
Grounded Realities opened with its finger slot and CL 12. Lightning Rod loaded
its generated module image and showed 50 gp, 2 lb. and its complete conditional
structure rule. Shared artwork for the four reality bands and related
etherstaves loaded from the readable `items/ethermagic` folder.

Browser capture found no ASC error. Existing PF1, pf1spheres and unrelated
module Foundry 13 manifest/deprecation warnings remain. The dedicated world was
returned to Setup. The final semantic audit matched all 6,788 pack documents to
canonical sources at the deployed commit and verified all non-pack receipt bytes
using local copies of the installed LevelDB databases.

## Alpha.6 second physical batch, group four

Clean implementation `443947eada252c7600c114a0681ea34beaeb9299` passed all
83 tests, all 6,788 compiler round trips and two identical 762-file builds.
ZIP SHA-256:
`c45d10cf498f2381c593635f73b05d419920c3c681dbb398d5926fd02c934033`.
The guarded dry-run, staged SMB replacement and strict pre-load hashes passed.
One authorized oldest module backup was rotated, retaining ten; no restart.

Acceptance on 2026-10-17 used Foundry 13.351, PF1 11.11 and pf1spheres 0.9.0,
with only ASC alpha.6 and the framework active in Additional Spheres Content
Test. All five module packs appeared; Items contained 626 entries. Native
compendium transfers created seven owned copies on the new blank PC
`ASC Batch 2 Group 4 Acceptance`, without replacing existing actors or items.

- Boots of Striding changed land speed from 30 to 40 when equipped and restored
  30 when removed. No springing/Acrobatics modifier was added.
- Bludgeoner's Rod exposed separate Attack and move-action charge helpers. The
  ordinary melee roll produced a bludgeoning chat card with +2 Enhancement;
  conditional 15d6 remains manual and is absent from its normal damage profile.
- Reaching's two successive activations changed its counter 5 -> 4 -> 3.
  Fleeting's application changed 3 -> 2; its later dismissal left 2. Still worked
  carried but unequipped and changed 3 -> 2. These check resource helpers, not
  automatic range/duration/target changes on an actual sphere casting.
- Soulreaving's external-soul helper left the free daily counter at one; the
  without-a-soul helper changed it to zero. Actual souls and target rolls remain
  manual.
- Crimson Flask began 0/2. Filling its helper created no points, and trying to
  spend while empty was rejected. After manually setting the test copy to two,
  opening preserved two and spending one left one. The sheet confirmed Charges,
  rather than Per Day; no actual actor blood reserve was changed.
- Animate Wand Bracers, Bandolier of Grenades and Bottomless Flask imported to
  native container sheets with zero initial contents/value/currency and no
  weight reduction. Their prices/weights were 4200/1, 900/1 and 1000/2 gp/lb.
  Source-specific images, complete descriptions, source links and manual limits
  rendered. The bracers accepted one separately created native zero-value test
  marker. Container-to-actor transfer/removal and detailed capacity procedures
  are not established by this check.

The final browser capture contained zero errors, 59 PF1/framework deprecation
warnings and the expected empty-flask warning; none referenced an ASC script.
The current daily server debug log had 482 records, including two earlier
authentication warnings. Its 176-record deployment/acceptance window had no
warning/error, and there was no current daily error file. Native Return to Setup
confirmed no active game. The final exact semantic audit passed for all 6,788
documents, non-pack receipt bytes and referenced external images. Installed
database snapshots remained unchanged; only local copies were opened.

Advanced conditional effects, full enable/disable/non-GM regression and broader
acceptance of the preceding content groups remain incomplete. No verified
compatibility claim or world migration is made. Failed automated file-chooser
attempts imported nothing; the prepared thirty-item actor fixture was never
imported. Successful transfers above used actual native compendium dragging.

## Batched committed-source audit reads

Issue #32 replaces 6,788 separate `git show` launches with one selected tree read
and one byte-framed blob batch. The read-only source trial took 922 ms for the
35,372,515-byte response. Twenty distributed individual reads matched exactly;
those twenty took 1,915 ms, giving a roughly 650-second full-source estimate.
This estimate is distinct from the complete audit's measured runtime.

The existing audit passed in roughly ten minutes before the change. The complete
optimized audit of the same installed `443947e` build passed in 121.92 seconds,
including all five packs and 6,788 documents, non-pack receipt bytes, referenced
images, immutable remote snapshots and local-only LevelDB extraction. The world
remained in Setup. No content or world migration was involved.

Ten focused Git-source/remote tests passed. Real temporary Git repositories
exercise immutable older commits despite newer commits and dirty/untracked
working files, nested Unicode paths, folders, duplicate IDs, unexpected source
formats and executable file modes. Batch decoding checks byte lengths and rejects
wrong, missing, truncated and extra objects. Existing remote tests still prove
the snapshot remains unchanged and document drift is rejected. Full clean gate
on `eb14e78b71f6fadc37c515d66e59747f7d704174` passed all 86 tests, all 6,788
compiler round trips and two identical 762-file builds. ZIP SHA-256:
`ad3f2a27900c4f3fe2f4031f72ff1dc480a1e8ca4a4ffbda3b62d8c09bd9023f`.
The guarded preview, staged deployment and installed-byte verification passed.
One authorized oldest backup was rotated, retaining ten, without restarting.
This exact branch build's final semantic audit passed in 95.22 seconds for all
6,788 documents, non-pack receipt bytes and referenced images. Remote snapshots
stayed unchanged and only local copies were opened. The server remains in Setup.
Its canonical content
is unchanged from the preceding runtime-tested build; additional in-game behavior
checks are not claimed for this tooling-only change.

## Final twenty second-batch apparatuses

Implementation `c7743adbc4f448c29414099599cea95610d3c26e` passed the clean full
gate: 92 tests, all 6,788 compiler round trips and two identical 778-file packages.
ZIP SHA-256: `d5e3639d935f49c907ea1c9d8866082a95824b383a44c8a9f434a43ee906d228`.
The guarded preview, staged deployment and installed-byte verification passed;
one authorized oldest module backup was rotated, retaining ten. No host restart.

Foundry 13.351 / PF1 11.11 / pf1spheres 0.9.0 loaded the build in Additional
Spheres Content Test with only ASC alpha.6 and pf1spheres active. All five packs
appeared. A fresh blank PC, `ASC Batch 2 Final Acceptance`, received four actual
native compendium transfers, without importing prepared JSON fixtures:

- Patch Hole opened as equipment; using Create Temporary Gap changed 3/3 to 2/3.
  This tests its resource helper, not automatic geometry or Create Gap outcomes.
- Medic Satchel imported with one ten-use supply bundle. A contained use changed
  ten to nine; its refill reminder left nine. Native Take moved the same usable
  supplies onto the actor and emptied the bag. After setting the test copy to
  zero through Details, closing/reopening preserved zero and quantity one; a
  further use was rejected with the expected insufficient-charges warning.
  Its full one-pound/250-gp package was counted once. No automatic refill or
  separate supply mass/value is established by this accounting.
- Quill of Endless Ink imported as a mundane case with one separate ordinary-ink
  magical quill. Case price was zero and contents value 80 gp. Native Take emptied
  the case and created one independently usable quill with price 80, negligible
  weight, faint Creation aura and CL 1 instructions. Actor total stayed 80 gp
  higher after removal; no duplicate quills or prices appeared.
- Seamstress Cuffs opened with 400/400 remaining daily feet. Its Special helper
  left 400, allowing actual produced thread length to be recorded manually.

Read-only compendium Keyhome and Pocket of Holding opened as empty native
containers with complete source/instructions, prices/weights 40000/0 and 200/0.5,
zero contents/currency and zero weight reduction. Keyhome's actual system icon
loaded. Spatial volume, doorway and ten-pound/one-cubic-foot restrictions remain
manual; no automatic capacity enforcement or scene/occupant storage is claimed.

Browser capture contained zero errors and 82 warnings: PF1/framework deprecations
plus the expected empty-supplies warning; none referenced an ASC script. The
154 server-log records since deployment were all informational, with no current
daily error file. Native Return to Setup succeeded. The final exact semantic audit
passed in 98.35 seconds: all 6,788 documents, non-pack receipt bytes and referenced
external images matched; remote snapshots stayed unchanged and only local database
copies were opened. The helper confirmed no active game at route `/auth`.
Specialized class/target/scene automation, full lifecycle/non-GM regression and
broader earlier-batch acceptance remain incomplete. No verified compatibility
claim or world migration is made. Updates affect compendia, requiring deliberate
reimport to change previously imported world copies. Documentation-only successor
commits are distinct from this tested implementation.

## First twenty third-batch charms

Implementation `9ba18dac80b43fbda2274d82072e3635da76e3de` passed the clean full
gate: 99 tests, all 6,788 compiler round trips and two identical 786-file packages.
ZIP SHA-256: `52fd4df8406be7201607a8a21a84fb1f81ab61d3574c69796b4b92a5f52a8f72`.
Guarded preview, staged deployment and installed-byte verification passed; one
authorized oldest module backup rotated, retaining ten. No host restart.

Foundry 13.351 / PF1 11.11 / pf1spheres 0.9.0 loaded the build in Additional
Spheres Content Test. Native settings confirmed exactly ASC alpha.6 and
pf1spheres enabled. All five packs appeared; the Items pack held 626 entries.
A fresh blank PC, `ASC Charm Bonus Acceptance`, received fifteen actual native
compendium transfers. No prepared actor fixture or application-global writes
were used. Equipping, removing and comparing the transferred items established:

- Aegis Ring raised normal, touch and flat-footed AC and CMD from 10 to 11.
  Ring of Shielding's matching deflection bonus did not stack; its resistance
  raised all saves to one. Cape of Resistance did not stack with that resistance,
  while Fragment of Destiny's luck bonus raised saves to two.
- Necklace of Natural Armor's base bonus competed with Ironside Ring's stronger
  base bonus. Removing the weaker necklace left AC unchanged. Talisman of
  Techniques added its distinct enhancement to natural armor: normal/flat-footed
  AC rose from 13 to 14 while touch stayed 11 and CMD stayed 15. CMB stayed zero;
  no unselected maneuver benefit leaked into global statistics.
- All six ability belts/headbands raised the intended current score from ten to
  twelve and restored it on removal. Ironside's Constitution enhancement took
  precedence over the weaker belt: fourteen rather than sixteen. Removing
  Ironside left twelve. Dexterity raised normal/touch AC, CMD and Reflex while
  leaving flat-footed AC unchanged. Strength raised CMB and CMD by one.
- Pugilist's Charm added one enhancement to natural armor. A native natural
  attack control rolled `1d20 + 1[Strength] + 1[Pugilist's Charm]`; its damage
  formula included the charm's one-point bonus. Changing that same native
  control to weapon subtype and rolling again removed both charm bonuses.
  The control's half-Strength damage setting remained; the weapon comparison
  also applied its ordinary proficiency penalty. This establishes natural-attack scoping, not
  complete unarmed coverage; core Unarmed Strike's weapon subtype remains the
  explicit manual limitation tracked in issue #38.
- Dimlight Veil left unconditional saves unchanged. A native Fortitude roll
  used the existing +3 and displayed the Light-only +2 manual reminder in its
  Notes, without silently adding two to the roll.
- Belt of Wild Might's native sheet showed quantity one, weight two and corrected
  purchase price 4,000 gp alongside the complete original tiered source text,
  its separate construction costs, selected-tier instructions and original art.

Browser capture since deployment contained zero errors and 84 PF1/framework
deprecation warnings. All 165 deployment-window server records were informational,
with no daily error file. Private raw logs and structured native evidence remain
ignored under `.local/batch3-charms-*`. Native Return to Setup succeeded.
The final exact semantic audit passed in 116.60 seconds for all 6,788 documents,
non-pack receipt bytes and referenced external images. Remote database snapshots
stayed unchanged; only ignored local copies were opened. The helper confirmed
no active game at `/auth` and the exact deployed implementation above.

Crafted maneuver/energy/skill choices, first-day ability consequences, unarmed
automation, advanced conditional effects and full lifecycle/non-GM regression
remain incomplete. No verified compatibility claim or world migration is made.
Updates affect compendia; changing an older world copy requires deliberate
reimport. Documentation-only successors are distinct from the tested build.

## Approved-stack pre-merge acceptance and firearm correction

The user approved all ready PRs on 2026-10-17. Older PRs' pending remote notes
were reconciled against the cumulative tested build rather than claiming that
each historical head had been deployed separately. Additional native transfers
on Foundry 13.351 / PF1 11.11 / pf1spheres 0.9.0 established:

- Dashing Cloak's move helper spent two of five charges, leaving three.
- Null Bindi's single use reduced quantity from one to zero.
- Trash Bag opened as a native container with five one-pound, zero-value trash
  units, five pounds total, 500 gp purchase price and no weight exemption.
- Disc of Rainbow Tears' +2 buckler statistics raised normal and flat-footed AC
  from 14 to 17 while touch AC stayed 11 and CMD stayed 16.

The firearm check found issue #40: a special action with no explicit ammunition
type inherits its weapon's bullet requirement in PF1 11.11. Ultraviolet Shift
therefore refused use and preserved its daily pool on an actor without bullets.
The native action preparation recognizes `ammo.type: "none"` as an explicit
opt-out. Apply that only to the four separate firearm spell-power/follow-up
helpers, preserving ordinary gunBullet attacks, daily costs and all stable IDs.
Independent complete-record comparison confirms these opt-outs are the only
source-record differences; action identities and reviewed output hashes match.

Corrected implementation `acac9b3aee40b61c4d454fb1dd6b860c8e5f906d` passed the
clean full gate: 100 tests, 6,788 compiler round trips and two identical 786-file
packages. ZIP SHA-256:
`066abe52299e8498f37faa56de3601ae0a8f20060db91e58d4c1cf0b2f7288b7`.
Both Windows and Ubuntu CI passed this exact head. Guarded preview, staged test
deployment and installed-byte checks passed; ten module rollback copies remain,
one authorized oldest copy rotated, no host restart.

A fresh corrected musket was dragged from the compendium onto the existing test
actor, retaining the earlier copy as a comparison. Without any ammunition, its
Ultraviolet Shift helper succeeded and spent one daily use (2 -> 1). Its ordinary
attack still refused without bullets, leaving the daily pool at one. This verifies
resource separation; it does not cast an etherspell or grant its conditional
outcomes. Older imported world copies are not automatically migrated.

Browser capture after the corrected deployment contained one expected
`Out of Ammunition!` error from that negative attack test, no other errors and
79 PF1/framework or expected ammunition warnings. All 147 scoped server records
were informational, with no daily error file. Structured native evidence and
screenshot proof remain ignored in `.local/merge-*`. Returned to Setup.
Final exact semantic audit passed in 105.89 seconds for all 6,788 documents,
non-pack receipt bytes and referenced external images. Remote database snapshots
stayed unchanged; only local copies were opened. The helper confirmed no active
game at /auth and the exact corrected deployment commit above.

These representative checks, the preceding native acceptance and full installed
audit support integrating the reviewed partial-content scope. Full lifecycle,
non-GM and specialized class/target/scene outcomes remain deferred. No verified
compatibility claim, world migration or public release is included.

## Second third-batch charms acceptance (2026-10-17)

PR #43, implementation b0a7e518ac4da68a16c9f0470de087a81aa98a6d,
module 0.1.0-alpha.6, Additional Spheres Content Test, Foundry 13.351,
PF1 11.11 and pf1spheres 0.9.0 with the two declared modules active.
Clean full gate passed 105 tests, all 6,788 compiler round trips and two
identical 797-file packages. ZIP SHA-256:
2b1d6bb5007703db5173b727f69def52f64e4d34c4d84f1aad8db6cff36ed0b1.

Guarded preview, staged module-only deployment and installed-byte verification
passed. Ten rollback copies retained; one authorized oldest copy rotated.
No host restart, system change or world migration.

Eight fresh native transfers onto the controlled acceptance actor passed. Use
helpers spent Clarity 1 -> 0, Force Armor 2 -> 1, Potential Realized 1 -> 0
and Remnant 1 -> 0. Force Armor's chat card preserves its failed-check cost
and four-hour limit; this test did not create armor or roll the Craft check.
Potential Realized preserves manual twenty-four-hour attunement and similar-ring
exclusion. Remnant retains ordinary charges, no rest reset, an ally-only rally
and the separate cross-copy user limit. Actual elapsed time and target outcomes
are not simulated by these counters.

Fox Medallion's helper displays Immediate, its exact end-of-next-round duration
and manual external mythic-power cost without inventing an internal pool.
The talisman sheet shows 30,000 gp and its conditional SR source-comparison
note, with no flat +15 change. The emotional amulet's native cursed flag is
checked and Identify Curse DC appears. Forger's instructions explicitly retain
the undefined target beneficiary under #42. Full source bodies and inspected
artwork remain visible. Screenshot and structured evidence are ignored locally
at .local/batch3-charms-2-accepted.png and .local/batch3-charms-2-native.json.

Browser capture: zero errors, 82 framework deprecation warnings. Final scoped
server capture: 160 informational records, no warnings/errors or daily error
file. Returned to Setup. Complete installed semantic audit passed in 75.21
seconds against the immutable implementation commit, all 6,788 documents,
receipt bytes and referenced image hashes; remote snapshots stayed unchanged
and only local database copies were opened. Audit confirmed route /auth.

These checks cover the reviewed native helper scope. Broader lifecycle/non-GM,
specialized casting, scene/target effects and source questions remain deferred.
No verified compatibility claim, automatic world-copy update or public release.

## First third-batch compound acceptance (2026-10-17)

Draft PR #45 depends on #43. Final head CI results are recorded on GitHub.

Implementation/deployed commit 414d5b44ee0de46b70f17dc3630702677ff22da2,
module 0.1.0-alpha.6, dedicated Additional Spheres Content Test world,
Foundry 13.351 / PF1 11.11 / pf1spheres 0.9.0. Clean full gate passed
110 tests, all 6,788 compiler round trips and two identical 797-file ZIPs.
ZIP SHA-256: 37ae464d47b5ff29e17594349cf734f523b211c8cfa5a2e59b6d894b17ed9569.

Guarded preview, staged deployment and installed-byte verification passed.
Ten rollback copies retained, one authorized oldest copy rotated, no host
restart or world migration. Only the declared two modules were active.

Five fresh native item transfers passed. Common Cure consumed quantity 1 -> 0
and rolled 7 positive healing from fixed 1d8+1. The roll was verified; no actor
HP application was simulated. Quintessential preparation retained quantity one;
expenditure reduced it to zero. No real sphere spell/cost/contact was fabricated.
Animate Object Oil consumed one dose and its chat card showed one-minute
application and twenty-minute selected-tier duration, with the full source table
and Tiny construct limits. No construct actor/token was created.

Lesser Spell Cleansing and Renewal each consumed quantity 1 -> 0. The fixed
1d20+5 link rolled 20 (die 15), without another dose. Actual target/DC/dispelling
was manual. Renewal's two-point recovery cap, one-round daze and once-per-drinker
daily restriction were visible; no spell-point pool was edited. Spent items
remained at zero quantity. Full source text, images and source links rendered.
Structured evidence and screenshot are ignored at .local/batch3-compounds-native.json
and .local/batch3-compounds-accepted.png.

Browser capture: zero errors and 77 framework deprecation warnings. Server:
159 informational records since deployment, no warnings/errors or daily error
file. Returned to Setup. Full installed semantic audit passed in 89.10 seconds
for all 6,788 records, receipt bytes and image hashes against the immutable
deployed commit, unchanged remote snapshots and local database copies only.
The helper confirmed no active game at /auth.

Native helper scope is verified; specialized target effects, temporary forms,
elapsed preparation/expiry and broader lifecycle/non-GM acceptance remain
deferred. No verified compatibility claim, public release or automatic update
of existing world copies. The new draft depends on unmerged #43 and needs its
own merge approval.
