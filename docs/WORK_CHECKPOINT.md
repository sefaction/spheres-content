# Work checkpoint

Updated: 2026-09-20 (work began 2026-09-19 local time).

## Current batch: first 100 physical items

- Branch `content/physical-items-batch-1`; issue #15 and draft PR #16:
  https://github.com/sefaction/spheres-content/issues/15 and
  https://github.com/sefaction/spheres-content/pull/16.
- User priority is physical items, feats, base classes and class features, with
  Guile talents last. Guile remains in scope and in the existing pack/audit data.
- The broad intake ledger has 940 appearances still reporting an image need;
  246 canonical current-edition item documents had the same state when this
  batch was selected. `config/production-batches.json` freezes the first 100 by
  stable source key, with their IDs, source hashes and canonical paths.
- For each manifest entry, review source boundaries, provenance, compendium reuse,
  PF1 type and physical fields, actions/uses, Changes and context notes, links,
  advanced settings, compatibility and artwork. Preserve stable IDs and record a
  concrete blocked reason instead of guessing unsupported mechanics.
- The first two production slices review Catnip Hookah, Cider, Fruitcake (loaf
  of), Map, Tradewind, Meat Pie, Pastry, Sausage and Soup. All eight have
  original 256 px WebP icons in the readable
  adventuring-gear folder. Cider and Fruitcake now use pinned single-use PF1
  consumable profiles; Catnip Hookah has a pinned one-minute action; the map has
  its source Tiny size and a pinned +5 Survival context note for exploration
  checks. The hookah's supplement link was completed with the canonical Catnip
  dose in the fifth slice. The batch audit at this point reported eight
  implemented images and 92 remaining.
- Meat Pie, Pastry, Sausage and Soup use pinned native single-use miscellaneous
  consumable profiles. Their four distinct icons share one consistently styled
  source contact sheet, with each crop and WebP encoding recorded separately.
- The third production slice reviews Outfit, Eventide; Sleeping Box; Toe-Bean
  Tuners; and Whiskey. Eventide is native clothing with a full-round
  configuration action and a conditional all-saves note for its selected hot or
  cold weather mode. Its mutually exclusive mode and nonlethal-only resistance
  remain descriptive rather than an always-on Change. Sleeping Box and Toe-Bean
  Tuners retain mundane gear profiles and original compact WebP art. Sleeping
  Box's 1d4 temporary-hit-point benefit is deliberately deferred because PF1
  11.11 loot actions do not execute from actors and a healing action would model
  it incorrectly. Whiskey adapts the reviewed PF1 Content 11.4.0 Whiskey (Cup)
  record into a single-use consumable, retains the wiki's bottle alternative,
  and references Foundry's inspected core goblet art. The reuse audit now has 22
  reviewed decisions and zero stale reviews.
- Twelve entries have now been reviewed. Ten are complete; Catnip Hookah remains
  pending for its Catnip-dose link and Sleeping Box remains pending for correct
  temporary-hit-point activation support. The batch reports 12 implemented
  images and 88 remaining; three new original icons are under the readable
  `items/adventuring-gear` folder and Whiskey uses reviewed core art.
- The fourth production slice reviews Blood Funnels, Refinement Charm, Ring of a
  Thousand Names and Suqur's Gift. All four are native wondrous equipment with
  correct caster levels, aura schools, slots, prices, complete source text and
  original 256 px WebP icons under `items/akashic-wondrous-items`. Ring of a
  Thousand Names has a pinned free-action designation reminder. The other three
  effects trigger automatically or operate continuously and need no native
  activation. The reuse ledger now has 26 reviewed decisions and no stale
  reviews. Foundry UI acceptance also exposed a PF1 11.11 schema limitation:
  Blood Funnels correctly stores CL 5 and the necromancy school, but PF1 derives
  a Faint aura label from that caster level and offers no independent strength
  override for the source's Moderate aura. The published aura remains explicit
  in the description and the Advanced audit is deferred rather than overstated.
- Akashic Magic 1.1.3 was source-reviewed at commit
  `0f95fd56e74653f7f8c59c86a4fc5b85e1d169ae`. It supports Foundry 13, native
  veils, actor essence and actor-wide Akashic Change targets. Those targets cannot
  safely automate these four items because their benefits affect one selected
  veil or essence invested in the equipment itself. Static Changes would also
  misrepresent Suqur's Gift's scaled flight. The exact rules remain descriptive,
  and compatibility/automation are deferred to issue #17 pending a separate
  compatibility-world test and adapter design.
- Sixteen entries have now been reviewed. Ten are complete; the four Akashic
  items remain pending for the compatibility work above, alongside Catnip Hookah
  and Sleeping Box. The batch reports 16 implemented images and 84 remaining.
- The fifth production slice reviews Arcanis Venenum, Black Powder (20 doses),
  Catnip and Ethanol. Arcanis is a native single-use poison with a pinned
  Fortitude DC 17 action; its recurring rolled caster-level drain remains
  descriptive because neither PF1 nor pf1spheres provides one safe actor-wide
  Change for spells and all spheres. Catnip is a native single-use drug with a
  pinned Fortitude DC 10 action; its ten-minute bonuses and later 1d3-hour fatigue
  remain descriptive pending a two-stage buff design. Black Powder uses 20 native
  charges at 10 gp each and adapts PF1 11.11's reviewed material identity and core
  art. Ethanol uses a native single-use fuel action without inventing a duration.
- PF1 11.11 source at commit `418761d2e16a6037c0156bb4a241f7cea5a2986d`
  confirms that supplement links on unowned compendium documents import the
  supplement and create the actor-side child relationship. Catnip Hookah now
  links to the canonical Catnip UUID, and catalog validation rejects unresolved
  module supplement UUIDs or name drift. Twenty entries are reviewed and thirteen
  are complete. Sleeping Box, Arcanis Venenum, Catnip and the four Akashic items
  retain explicit deferred work. The batch reports 20 implemented images and 80
  remaining; the reuse ledger contains 30 decisions.
- Clean correction commit `dd68c2885ccc782a9694e266f1453a61fb7ec64c`
  passed formatting, all 32 tests, source/reference validation and two identical
  697-file builds. Atomic deployment verified exact installed bytes, pruned the
  oldest eligible module backup and retained ten. Pre-load package hashes and
  the final semantic audit passed; all 6,788 deployed documents match canonical
  sources at route `/auth`.
- Foundry 13.351 / PF1 11.11 acceptance opened all four Akashic sheets. Their
  images, native profiles, physical fields, descriptions and aura data rendered;
  Ring of a Thousand Names exposes its pinned free action. Blood Funnels visibly
  demonstrates the documented derived-aura limitation while retaining the source
  wording. No module error occurred. One harmless rejected join before selecting
  Gamemaster is the only captured browser error. The dedicated world is back in
  Setup. The first semantic attempt hit an intermittent Foundry CLI iterator-close
  error on a local Classes snapshot; that same snapshot then extracted all 117
  documents, and a fresh complete semantic audit passed.
- Commit `affb2f575e683121e31259ee02e21eac9f3b978d` passed all 31 tests,
  source/reference validation and two identical 693-file clean builds. Atomic
  deployment verified installed bytes, removed the oldest eligible backup and
  retained ten. The remote semantic audit matched all 6,788 documents to the
  canonical sources at route `/auth`.
- Foundry 13.351 / PF1 11.11 UI acceptance opened all four third-slice sheets.
  Their types, physical fields, complete descriptions and three module WebPs plus
  the core goblet reference rendered correctly. Eventide exposes its pinned
  Change Weather Configuration action and all-saving-throws context note;
  Whiskey exposes its pinned Use action and single-use miscellaneous consumable
  fields. Browser errors are empty. Existing PF1 and pf1spheres v13 deprecation
  warnings remain. The dedicated world is back in Setup. Actor drag/use checks
  for the grouped food and conditional-gear slices remain pending.
- The production manifest allows reviewed PF1 type corrections while continuing
  to pin identity, source key, path, edition and description hash. Batch-aware
  audit queries and context-note hash validation have tests.
- Clean commit `a4d731148993ecef2d9ff043927f4e444bcbba80` passed formatting,
  31 tests, reference validation, deterministic pack compilation and the local
  release gate, then deployed through the atomic SMB staging workflow. One old
  backup was pruned after verification and ten remain. Exact package hashes
  passed before world launch; the post-load semantic audit matched all 6,788
  canonical documents and ignored only expected LevelDB housekeeping changes.
- Commit `45c58743afaf88273d4e133ea058379b41538df0` adds the four
  highland-food consumables. The clean gate passed all 31 tests and two
  deterministic 690-file builds. Atomic deployment verified exact installed
  bytes, pruned one oldest backup after replacement and retained ten. The remote
  semantic audit again matched all 6,788 canonical documents at route `/auth`.
  UI and actor-use checks for this second slice remain pending and can be grouped
  with the next conditional-gear slice.
- Foundry 13.351 / PF1 11.11 UI acceptance opened the four entries and confirmed
  all WebP paths, Catnip Hookah's one-minute action, Cider's miscellaneous
  consumable profile, and the map's +5 Survival context note with an empty
  Changes list. There were no module-specific console errors or warnings. One
  general error was the reviewer's harmless first login attempt before selecting
  the Gamemaster user. Actor drag/use checks for Cider and Fruitcake remain for a
  later slice. The dedicated world is back in Setup.

## Prior completed batch: native weapon and consumable review

- PRs #2, #4, #9 and #11 were merged into `main` with the user's explicit
  approval. Their resolved issues are closed; issue #3 remains the broad catalog
  umbrella and issue #12 tracks GitHub Actions' Node 24 dependency update.
- Branch `content/native-weapon-consumable-review`; issue #13. Alpha.6 preserves
  both stable identities. Hidden Blade is now a native +3 martial longsword with
  PF1 11.11's reviewed attack action, weapon categories and system artwork plus
  the wiki's CL 10 and Illusion aura. Its +3 Illusion implement role now uses
  pf1spheres 0.9.0's `sphereclIllusion` target with PF1's uncapped `enh`
  modifier; the stable Change ID and array hash are pinned. Glamered remains
  descriptive. Trail Rations is an activatable miscellaneous consumable with
  PF1's single-use action and system artwork while retaining wiki text, price and
  weight.
- Exact source UUIDs/hashes, adaptation decisions, output hashes and action-array
  hashes are pinned. The two PF1 images were visually inspected and are referenced
  without redistributing bytes. The refreshed physical report has 963 entries,
  24 candidate-bearing entries, ten reviewed, zero stale and one unavailable pack.
- Runtime/source commit `c9107729ce1a5e2189bcacff1d1a9d80efd996f0`
  is deployed. Local verification passes 29 tests, source/reference validation,
  complete 6,788-document compiler round trips and two identical 682-file builds;
  ZIP SHA-256 is `9fe6c060ba778d9a6bee43b00192edcaa31a647cec23fbe5484c1e9efff49f3a`.
- Alpha.6 deployed through the staged helper. Ten backups remain and none were
  deleted. Package and external-image hashes passed without a restart. Player UI
  acceptance passed for both native sheets and actions. Gamemaster actor tests
  imported Hidden Blade and Rations, Trail. Hidden Blade produced its native
  attack roll. On a level-1 actor with base Illusion CL 0, one equipped blade
  produced Illusion CL 3, unequipping returned it to 0, re-equipping restored 3,
  and two equipped copies remained at 3 through normal enhancement stacking.
- Actor testing exposed that PF1 11.11 does not activate actions on loot records.
  Rations, Trail now uses the activatable miscellaneous consumable type while
  preserving its stable ID, wiki text, physical values, image and reviewed Use
  action. A three-ration actor stack used one item, remained present at quantity
  two, and produced the expected chat card. Existing actor-owned copies are not
  migrated.
- PR #14 merged into `main` with the user's explicit approval and issue #13
  closed: https://github.com/sefaction/spheres-content/pull/14. The dedicated world is
  back in Setup. Final semantic audit matched all 6,788
  documents, non-pack receipt bytes and referenced images at the deployed commit.
  Browser acceptance recorded zero errors; 113 warnings are existing Foundry 13
  deprecations from PF1/pf1spheres. The current server log contains zero errors
  and only two earlier rejected-login warnings, with no new acceptance warning.
  No release, world migration or container restart is included. Both PR checks
  and both post-merge `main` checks passed at merge commit
  `370584444db77a83f96e0b8f48741b6260a943bd`.

## Prior completed batch: systematic wiki intake

- Completed branch: content/systematic-intake. PR #9:
  https://github.com/sefaction/spheres-content/pull/9 merged into `main` after
  explicit approval. Issue #8 tracked the intake; #3 remains the broader catalog.
  The user authorized ten rolling module
  backups, deleting the oldest excess copies after verified deployments.
- Runtime/source implementation commit: fa07d6bc62a329f4088585516af52db8136f8094.
  Documentation evidence follows it. Full clean verification passed on that commit:
  formatting, lint, 24 tests, source/reference validation, complete compiled-record
  round trips and two identical 679-file archives. Review ZIP SHA-256:
  20d0d3b9e3666c93493e4582ccc1faabd66cde94ab80eda550a29ed2ca3b7070.
- Full cached crawl: 2,652 pages, zero download errors; 11,019 candidates including
  duplicates/legacy. Page retrieval is complete for this snapshot; exhaustive
  entity extraction and semantic review remain explicitly incomplete.
- Canonical drafts: 6,788 (117 classes, 1,536 class features, 3,674 feats,
  835 Guile talents, 626 items). Repeat promotion plan imports zero, preserves
  6,788 identities, maps 986 duplicates and holds 3,245 candidates. See the tracked
  research/intake ledger and docs/SYSTEMATIC_INTAKE.md for filters and hold reasons.
- The official compiler only reads one directory; the build now stages all nested
  canonical records under stable ID filenames before compilation. Native PF1
  consumables omit changeFlags; tests distinguish that profile from feats.
- Reuse index: 37,708 records / 56 packs. One Roll Bonuses pack has an unexpected
  lost directory and remains unavailable. No source pack was modified. Existing
  matches for 384 imported documents await full suitability review.
- Class audit has 2,340 level rows across 117 classes. Native associations remain
  empty pending grant review. New passive/conditional mechanics, actions, usage
  settings and optional-module contracts remain in the audit queues.
- Four generated icons now use 256-pixel WebP, 47,774 bytes combined. Visual
  inspection passed at 64, 128 and 256 pixels. Small PNGs preserve organized and
  flat historical paths; original hashes/settings/sizes remain registered. The
  remaining 6,784 imported documents are explicitly marked as needing artwork.
- Narrow-sheet wrapping is out of scope. Optional integrations are versioned
  source research, not runtime compatibility certification. Native source labels
  are populated. No new compatibility claim or world migration is included.
- Remote is fa07d6b alpha.4, deployed after clean verification and dry-run.
  Installed bytes and eight external image hashes passed. Six backups remain;
  none required pruning. No container/host restart occurred. Both CI jobs passed.
- 2026-09-20 retention update: implement ten rolling backups, prune only after
  installed-byte verification and saved receipt, preserve the newest rollback
  copy, and validate exact paths/identities/no nested links. Seven remote helper
  tests pass, including real fixture pruning and failure guards.
- Runtime acceptance: Foundry 13.351 / PF1 11.11 / pf1spheres 0.9.0, with only
  ASC alpha.4 and the framework enabled. All five locked packs appear. Native
  class, class-feature, feat, Guile talent, loot, equipment and consumable sheets
  open with descriptions and source labels. Extra Magic Talent's WebP loads.
  Native JSON import populated seven records on ASC Intake Acceptance in the
  expected actor sections, inventory 5 lb / 3,570 gp. Initial class-derived
  values were stale immediately after import; normal browser reload yielded
  Blacksmith level 1, HP 10/10, BAB +1, Fort +2 / Ref +0 / Will +2. This is
  native import acceptance; automated document drag remains unverified.
- ASC Test Player can see all five packs, search and open Extra Magic Talent
  with a read-only sheet, description, source and image. Browser error capture
  is empty; PF1/framework deprecation warnings remain. Server daily debug log
  through 10:56 local has 803 info records, zero warnings/errors; no daily error
  file. Test world was deactivated through its native UI and returned to Setup.
- Final installed semantic audit passed: all 6,788 pack documents match deployed
  canonical sources exactly, non-pack bytes match the receipt, and all eight
  external image hashes pass. Remote LevelDB was inspected through local copies.
- Next safe step: review the intake coverage/hold and per-entity audit queues
  with the user, then select a coherent artwork, reuse or semantic-review batch.
  PRs #2/#4/#9 later merged into `main`; no release or broader compatibility claim.

## Prior completed batch: packaged kit components

- User resolved delivery: package reviewed copies, preserving attribution and
  permitted artwork references. No optional source-module dependency is added.
- On `content/entity-catalog`, implementing issue #7 within draft PR #4.
  Version `0.1.0-alpha.3`: kit keeps ID `5feccdaf3cbf89f1`, now a native container
  with four stable child records (quantities 5/5/1/1); 0.5 gp / 0.5 lb empty,
  80 gp / 4 lb full. Actions copied from the dagger remain hash-pinned;
  passive/conditional authoring stays deferred.
- Copied record provenance and OGL/GPL notices are retained. Referenced core/PF1
  images were visually inspected and fetched successfully; raw artwork is not
  redistributed. Corresponding adapted kit JSON is included in the archive.
- Deployed commit `873659499caa08ddeb3a9a5d565cc39e5d9809b9`, alpha.3. Clean
  full verification passed 15 tests, complete compiled-record round trips and
  deterministic 39-file archives. Both GitHub CI platforms passed. Dry-run,
  staged replacement with retained backup, strict installed hashes and all four
  referenced image hashes passed. No container/host restart was needed.
- UI acceptance on Foundry 13.351 / PF1 11.11 / pf1spheres 0.9.0: the kit opens
  as Container; all four child stacks and their native sheets open with images,
  descriptions and source labels. Dagger shows Melee/Throw and checked Alchemical
  Silver. Header shows total weight 4 lb and empty price 0.5 gp; contents show
  3.5 lb / 79.5 gp. Imported a new world copy, renamed `ASC Kit Container Test`
  (`oi8Hwjfog2mgKW44`), leaving the old flat kit untouched. Minus one silver
  blanch produces four doses, 3.5 lb total and 74.5 gp contents; restored five
  doses and original totals using native quantity controls. No automatic
  coating/scent effect or silver damage adjustment is implemented.
- Browser errors: zero. Server debug log through 2026-09-20 01:17:40 local
  contains 321 records, zero warnings/errors; no daily error file present.
- User enabled Chrome file-URL access and reopened the browser. Reconnected to
  Chrome browser 3, tab 72099537. Native Import Data uploaded the prepared JSON
  into the previously empty ASC Container Acceptance actor successfully.
- Actor checks passed: complete kit appears as Container with total inventory
  4 lb / 80 gp. Native Take withdrew the silver dagger into actor inventory;
  kit became 3 lb with 57.5 gp contents and the actor remained 4 lb / 80 gp.
  The withdrawn dagger (new actor item d9uB1c9ziBB8wEuZ) opened its action picker,
  Melee roll dialog and produced a chat attack/damage roll. The silver damage
  modifier remains deferred. Actor fixture retains the withdrawn dagger and
  remaining kit contents; the separate world kit copy remains full.
- Browser captured one pre-test startup viewport error at 13:43:34 UTC while
  Chrome was 958px wide; later screenshots show 1920px. No new item/roll error
  appeared. Do not describe the whole browser log as error-free.
- Final semantic audit caught added parent container defaults on deployed
  8736594; the four contained records matched exactly. Reviewed the complete
  diff and normalized only the missing native parent defaults in canonical JSON,
  including empty unidentified data, false flags, ownership and null stats.
  No changes to item rules, IDs or children; exact audit comparison is preserved.
- Correction 78a5570d64552dcd23088bbaf568dd72964c4266 passed clean full verification
  (15 tests and deterministic archives), staged deployment with backup, strict
  installed hashes and external image hashes. Repeat UI intake and semantic audit
  completed for the container, which now matches exactly. The audit exposed the
  same missing-default issue in the other three pilot entries; full reviewed
  diffs contained additions only. Their native empty/false defaults are now
  explicit in canonical sources too. No host restart or world migration performed.
- User requested readable icon organization. Canonical icons now use classes,
  feats, items/kits, and guile-talents/artifice folders. Four generated legacy
  aliases preserve images in existing test-world copies. Source references,
  asset registry, validation and packaging are updated together; no new artwork.
- Final deployed runtime: `80600de7e17d211617a1291bd50db71936d28a06`, alpha.3.
  Clean verification passed 15 tests, complete round trips and deterministic
  43-file archives; Windows and Ubuntu CI passed. Scoped staging/swap retained
  the fifth backup. Strict installed hashes passed before UI checks.
- Reopened all four pilot compendium sheets on the final build. New icon paths
  loaded visibly; HTTP/hash checks passed for four organized icons, four legacy
  aliases and four external core/system references. Kit contents/totals remain
  correct. Returned to Setup and exact all-pack semantic audit passed.
- Final browser error capture is empty; earlier startup viewport error remains
  documented above. Server log through 08:58:27 local contains 637 info records,
  zero warnings/errors. Runtime is left in Setup, no host restart performed.
- Documentation evidence follows the runtime commit; no documentation-only
  redeployment is needed. All five module backups are retained: the next
  deployment will hit the helper's retention limit. Do not delete backups or
  bypass that limit without an approved recovery/retention decision.
- No browser assistance is pending. Next safe work: feat/skill-talent actor
  checks, non-GM visibility/lifecycle warning baseline and issue #6 source labels
  and class-table wrapping, then further catalog intake. PR #4 remains draft.
  No merge, release or compatibility verification claim is made.

## Prior reuse audit (superseded by the resolved delivery choice above)

- User requires searching existing compendia for suitable names, descriptions,
  images and native item behavior before creating replacements. Kits must be
  containers containing usable component items. This supersedes acceptance of
  the provisional flat hunter's kit and its pending manual drop request.
- Issue #7: https://github.com/sefaction/spheres-content/issues/7. Audited seven
  relevant installed packs using stable local database copies; no source
  database was opened by the compiler. Candidate metadata and the proposed
  80 gp / 4 lb assembly are in `research/kit-reuse-audit.json` and
  `docs/KIT_REUSE_AUDIT.md`. No reused rules/art or corrected container has yet
  been added to canonical sources or deployed.
- Pending user preference: package reviewed copies of optional-module items,
  or require and reference their source modules. Asked asynchronously; no
  answer recorded. Do not infer approval from the preselected choice.
- Next safe step: resolve that delivery policy, review selected record rights,
  extend the native container/contained-item validation, preserve the kit ID,
  and test contained quantities, sheets, removal and totals. Keep PR #4 draft.
- Branch reconciliation: `content/entity-catalog` at `b4d5c09` before this
  documentation batch; PR #4 remains open/draft against `tooling/bootstrap`.
  Runtime remains `300a375`; this audit changes documentation and research
  metadata only and does not require another remote installation.
- Validation for the reuse-audit batch: full `npm.cmd run verify` passed all
  14 existing tests, formatting, source/reference checks and deterministic
  archives. This validates the unchanged pilot and pipeline, not a corrected
  container. No new container acceptance result is claimed.

## Earlier pilot evidence

- Active branch: `content/entity-catalog`, based on `tooling/bootstrap` at `c71b215f1987441f6d7de1107bda65fc865074ed`. Foundation PR #2 remains open and unmerged; its two CI jobs passed. Do not merge it without individual approval.
- Active issue: https://github.com/sefaction/spheres-content/issues/3. Draft content PR https://github.com/sefaction/spheres-content/pull/4 is stacked on the unmerged foundation branch. Issue #5 tracks semantic remote verification. Both content CI jobs passed at `300a37551af0741f006b45ba3f2212ad36037aba`.
- Scope: all wiki PF1 items, feats and base classes across publishers. Descriptions/generated images first; Changes and conditional modifiers only after the descriptive catalog is complete and reviewed. Archetypes are deferred. Reuse generated images where sensible.
- Framework: upstream pf1spheres v0.9.0/master both at `c6d91092edb174f2bb44d9128e2ac75b4331837f`, matching installed version. Source audit found zero skillTalent records across 4,277 YAML pack files. User authorized missing Guile skill talents, now included in scope. Existing magic/combat spheres/talents stay excluded. Occultism is on the wiki but absent from the 15 recognized framework skill spheres; integration review remains necessary.
- Working changes: first four canonical records (Extra Magic Talent, Lycanthrope Hunter's Kit, Incanter, Favorite Tools), four generated images, OGL notices/provenance, stable identity inventory, PF1 descriptive subset validator, compiled-pack round trips, deterministic archive handling, and pf1spheres dependency. Version is `0.1.0-alpha.2`; no release URLs or verified claims.
- Local tests: the deployed pilot passed 13 tests and deterministic builds. The follow-up passed the full 14-test gate and deterministic builds, including semantic audit acceptance, content drift, unexpected files, and source-database immutability. Re-run clean committed verification before deploying any follow-up.
- Discovery: initial scanner now covers 105 source pages, including 35 directly linked base-class pages and 16 Guile sphere pages. Sitemap lists 2,668 pages. Counts are not full entity counts. Raw sources and upstream reference checkout remain ignored under `.local/`.
- Art: canonical files are in `static/icons/`; prompts/hashes in `config/content.json`. Original generated images and local previews retained. Do not regenerate IDs or overwrite art casually.
- Remote installation: `300a37551af0741f006b45ba3f2212ad36037aba`, `0.1.0-alpha.2`. Staged deployment and strict 35-file hash smoke passed. The designated container restart completed. Its automatically launched campaign had zero players and was returned to Setup. The semantic smoke audit then matched all four documents to the deployed commit and all non-pack bytes to the receipt. Exact private target and credentials remain outside Git/Obsidian. Follow-up audit tooling/documentation does not change pack content or runtime manifest; it has not been redeployed.
- UI progress on 2026-09-20: the old controlled tab retained a zero viewport after the user restored Chrome. A fresh Chrome tab has a normal 1920x855 viewport, launched the dedicated world, and joined as Gamemaster. Additional Spheres Content alpha.2 was already enabled; enabled pf1spheres 0.9.0 and saved/reloaded. All four module packs appear with one entry each. Opened all four sheets, verified descriptions and generated image loading, native types/basic class and equipment fields, and empty Changes/context notes. Favorite Tools correctly shows Skill Talent / Artifice. Feat search works. Incanter appears separately from the framework's Incanter in PF1's class browser.
- Actor testing: user manually dragged Incanter successfully and reported the native level-up dialog. UI confirms the actor now has Incanter level 1, 6 current/max HP, +0 BAB, +0 Fortitude/Reflex and +2 Will; the chat level-up report confirms automatic 6 HP. All four pilot entries now import to world Items through native Import Entry. Asked the user to drag the other three entries (Extra Magic Talent, Favorite Tools, Lycanthrope Hunter's Kit) onto `ASC Pilot Acceptance` once each; outcome is still pending. Browser-controlled document drags do not register, but a diagnostic drag successfully moved the actor sheet window. This narrows the failure to document transfer through browser control; it does not establish a module defect. Leave the actor and Items sidebar ready and reconcile before importing duplicates.
- Permission preparation: created `ASC Test Player` with the Player role in the dedicated world using User Management, with no password entered. Saved successfully. No player login or visibility test yet. A separate browser tab confirmed exactly two active modules on Foundry 13.351 / PF1 11.11. Non-GM visibility, remaining actor imports, lifecycle baseline comparison and final semantic smoke remain pending. Avoid switching sessions or reloading the world while the user is performing the pending drops.
- Logs during these checks: browser capture had zero errors and 74 warnings, predominantly deprecated PF1/core APIs plus a PF1 browser filter warning; a framework-only comparison is still pending. Server debug log from 00:11:29 through 00:16:52 local time contains 145 records, zero errors and zero warnings. No new daily error log was present. No complete content compatibility claim is made. Issue #6 tracks blank native source labels and narrow class-table wrapping.
- Semantic verification now uses `npm.cmd run smoke:remote -- --semantic` from Setup. It copies packs to ignored local audit storage, verifies stable source hashes, opens only local database copies, and compares complete documents against canonical Git sources at the receipt commit. Default smoke and all deployment checks remain strict byte checks.
- The designated container restart was previously authorized by the user for this test instance. The startup configuration auto-launches a campaign; return to Setup and use only the dedicated test world. Do not modify startup settings or other containers.
- Full catalog remains unfinished. No Guile bulk import, archetype application, modifier automation, world migration, PR merge, tag, stable manifest publication, or public release has been performed.
- Obsidian hub: Foundry-AI / `20 - Projects/Personal/Additional Spheres Content.md`. Durable scope/framework, Guile exception, and pilot milestone notes updated. No vault commit/push.
