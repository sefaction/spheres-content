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

Full clean local verification passed on b9fabf7 (22 tests). Gates cover all
canonical records, asset encodings/size budgets, exact
compiled round trips and deterministic archives. Parser regressions cover edition
boundaries, nested text, sanitization, Unicode names/weights, kit/weapon holds,
stale rights/reviews and progression-table grants. Two identical 679-file archives passed the rebuild check. Runtime acceptance
is pending deployment of the authorized rolling-retention build. The previous
dry run refused safely at the former five-backup limit.
See draft PR #9 for current status.

Remote checks must cover all five packs and representative class, class-feature,
feat, Guile talent, loot, consumable and wondrous-equipment sheets; verify native
source labels, 256-pixel WebP images, search, import and new-pack discovery.
Class links, new actions and modifiers remain empty by design pending review.
Optional-module contracts have only source review and require separate tests.

Retention regression fixtures verify read-only previews, ten newest backups,
protection of unrelated/staging folders, and refusal on failed installed hashes,
wrong module identities or linked backup contents.
