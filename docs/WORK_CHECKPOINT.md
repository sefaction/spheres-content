# Work checkpoint

Updated: 2026-09-20 (work began 2026-09-19 local time).

## Current batch: physical-item reuse review

- Branch content/physical-item-review, stacked on content/systematic-intake / PR
  #9; issue #10. No merge or release approval. Starting commit 9679df0 was clean,
  both CI jobs passed, and remote alpha.4 matches its deployment receipt identity.
- Alpha.5 adapts three stable item identities: empty Adventurer's Sash container,
  Filter Scarf clothing and umbrella physical record with retained wiki schematic.
  Six unrelated namesakes are explicitly rejected. Native conditional modifiers
  remain deferred. Two generated 256px WebP images total 11,308 bytes; the scarf
  uses a visually inspected core reference. Full generated sources remain local.
- New audit:reuse command covers 963 current physical candidates (including held
  pages), finds 24 with name/reordered-name candidates, and records nine reviewed,
  zero stale. Refreshed 56-pack / 37,708-record reuse index; Roll Bonuses pack with
  lost directory remains unavailable. New match: Trail Rations; quantity/use
  behavior should be reviewed in a follow-up. Hidden Blade still needs a native
  weapon profile rather than generic equipment; tracked with issue #10 findings.
- Runtime/source commit e3cd4c22e39aca685a128d9d2e39983dcffeaf5e is pushed.
  Full clean verification passed 27 tests, complete 6,788-document compiled
  round trips and two identical 682-file archives; review ZIP SHA-256 is
  2eb96fd612190c73b725f2d020dc4320ca1f2bbe1a330b571e483502a6d36416.
- Alpha.5 deployed through the staged helper. Seven backups remain and none were
  deleted. Strict package and nine external-image hashes passed. No container or
  host restart occurred.
- Remote acceptance passed on Foundry 13.351 / PF1 11.11 / pf1spheres 0.9.0 with
  only ASC alpha.5 and the framework active. All five packs appear. Sash, scarf
  and umbrella native sheets show the reviewed type, price, weight, description
  and artwork. Native actor JSON import produced 6 lb / 27 gp: the umbrella began
  inside the sash, native Take moved it to actor Gear while totals stayed fixed,
  and the empty sash became 3 lb. The scarf equipped toggle works and adds no
  authored modifier. Browser capture has no ASC errors; only existing PF1 and
  framework deprecation warnings. Server records since deployment contain 152
  info entries and one unrelated failed player-login warning followed by a
  successful login; no daily error file exists.
- The dedicated world is back in Setup. Final installed semantic audit passed:
  all 6,788 pack documents match canonical sources at the deployed commit,
  non-pack bytes match the deployment receipt, and all nine referenced image
  hashes pass. Only local copies of installed LevelDB were opened.
- Draft PR #11 is open against content/systematic-intake:
  https://github.com/sefaction/spheres-content/pull/11. Its Windows and Ubuntu
  validation jobs passed. No merge, release or world migration is authorized.
  Next safe step after CI is to choose the next reviewed physical-item batch,
  with Hidden Blade's weapon profile and Trail Rations' quantity/use behavior as
  concrete candidates.

## Prior completed batch: systematic wiki intake

- Active branch: content/systematic-intake. Draft PR #9:
  https://github.com/sefaction/spheres-content/pull/9, stacked on #4. Issue #8
  tracks the intake; #3 remains the broader catalog, #6 the native source labels.
  No merge or release is authorized. The user authorized ten rolling module
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
  PRs #2/#4/#9 remain unmerged; no release or broader compatibility claim.

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
