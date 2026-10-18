# Work checkpoint

Updated: 2026-10-17 (work began 2026-09-19 local time).

## Active work in progress: third-batch charm group

- Branch `codex/physical-items-batch-3-charms`, based on #35 head `c5caa27`.
  Both #35 Windows/Ubuntu jobs passed at that exact head. Issue #36 tracks the
  next frozen hundred: eleven apparatuses, forty-seven charms, forty-two compounds.
  Stable source-key order excludes earlier membership, legacy and Akashic work.
  Twenty selected charm profiles are now authored with complete original bodies
  and IDs preserved, twenty-one native Changes across sixteen records and bounded
  conditional notes on five. Four records deliberately have no global modifier.
- Selected twenty charms sharing ability/AC/save or related worn-item profiles.
  Full source bodies and metadata were read from `.local/batch3-charms-source-review.json`.
  Exact/alternate/component searches inspected 23 complete records; additional
  artwork searches inspected twelve more plus the full existing original cloth
  headband record. Twenty-six actual installed core/system candidate illustrations
  were downloaded, hashed and visually inspected on a 128 px contact sheet.
- Art is complete and assigned: nine core/system references, three uses of the
  existing original cloth headband, eight original 256 px WebPs (52,300 bytes total,
  largest 8,164). All twenty were visually checked at 64/128 px. Prompts and hashes
  are registered in config/content.json; source PNGs, full review caches and
  `batch3-charms-all-art-review.png` remain ignored locally. Eighty images remain
  in the frozen third hundred. No ring/crown/belt substitute for cloth headbands.
- Issue #37 records six ability belts/headbands whose 4,000-gp market prices were
  parsed as 2,000-gp crafting costs. Those six reviewed records now use 4,000 gp.
  Full original bodies/hashes stay intact. The broad parser fix is separate.
- Natural armor bonuses must be distinct from enhancements to natural armor;
  PF1 native `nac`/`base` versus `nac`/`enh` is confirmed in core race/item data and
  apply-changes. Ability enhancements, AC bonus types/CMD inheritance and saves
  have inspected native interfaces. First-day ability consequences and Genius'
  crafted skill choice need explicit manual handling, with no invented skill.
  Gauntlet/energy choices remain unselected; do not grant broad CMB/CMD/resistance.
- Core PF1 Unarmed Strike is an attack with subtype weapon; native `nattack` and
  `ndamage` target natural-subtype attacks. Pugilist's Charm must explicitly keep
  unarmed handling separate under issue #38 rather than claiming that interface
  covers every unarmed strike. No broad manufactured-weapon enhancement is granted.
- Umbral Mantle's base-tier moderate aura at CL3 conflicts with native faint;
  recorded under #31. Keep the full scaling source/CL and make the selected tier
  explicit; no invented aura override or higher-tier concealment at base price.
- Last installed/tested build remains `c7743ad`, with final 6,788-record semantic
  pass and server in Setup. No live build/transfer/testing process remains.
  Seven focused semantic tests and full source validation pass. An independent
  comparison to #35's exact commit confirms unchanged complete bodies, IDs/source
  keys, quantities and weights; only the six reviewed price corrections differ.
  Next: clean gate, guarded deployment, native equip/stacking/roll acceptance,
  final exact semantic audit and draft PR stacked on #35. Preserve existing reviews
  and all unmerged work; no merge/release approval.

## Completed previous group: final twenty items in physical batch 2

- Branch `codex/physical-items-batch-2-final`, based on PR #34 head `4d1277a`;
  issue #26. All prior draft PRs remain unmerged; no merge/release approval.
- Implementation `c7743adbc4f448c29414099599cea95610d3c26e` authors twenty
  source-specific profiles, four native containers and two usable derived contents.
  Complete original bodies, top-level IDs/source keys and quantities independently
  match the prior commit. Approved snapshot hashes are preserved.
- Sixteen original WebPs (124,308 bytes total; largest 12,136) and six inspected
  core/system references are registered. Prompts/hashes: config/content.json.
  Exact/alternate/component searches and 44 unique complete candidates were read
  before authoring. No unrelated candidate mechanics or image bytes imported.
- The frozen second hundred now has zero pending images in the production planner.
  This completes image review only; mechanics and broader acceptance remain
  incomplete. Akashic/legacy production stays deferred.
- Clean full gate passed all 92 tests, all 6,788 compiler round trips and two
  identical 778-file packages. ZIP SHA-256:
  `d5e3639d935f49c907ea1c9d8866082a95824b383a44c8a9f434a43ee906d228`.
  Guarded preview, staged deployment and installed-byte verification passed.
  One authorized oldest module backup rotated; ten retained. No host restart.
- Native PF1 containers lack activation actions; handling/refill remains manual.
  Supplies use ten Charges, not quantity/single-use or a daily pool. Child zero
  weight/price avoid double counting full source totals; separated allocation is
  unspecified. The mundane case holds one CL1 quill, with 80 gp on that quill.
  Patch Hole is temporary equipment; Cuffs' counter records feet, not activations.
  Lenses/Gentle Shade aura discrepancies remain explicit under issue #31.
- Representative native acceptance passed on deployed `c7743ad`, Foundry 13.351 /
  PF1 11.11 / pf1spheres 0.9.0, with only the two declared modules active. Four
  actual transfers created Patch Hole (3 -> 2), satchel (contained uses 10 -> 9,
  refill helper unchanged), quill case (one separately removable 80-gp quill) and
  cuffs (helper leaves 400 feet). Native Take emptied both containers; separated
  supply quantity one persisted at zero and refused another use. Empty spatial
  container sheets and complete rules/images opened. See docs/TESTING.md.
- Browser: zero errors, 81 PF1/framework deprecations and one expected empty-supply
  warning, no ASC script warning. Server window: 154 informational records, no
  warning/error or daily error file. Full lifecycle/non-GM and specialized
  class/target/spatial behavior remain incomplete; no compatibility claim.
- Returned to Setup. Final exact semantic audit passed in 98.35 seconds for all
  6,788 documents, non-pack receipt bytes and referenced images; remote snapshots
  unchanged, local copies only. Helper confirmed no active game at `/auth`.
  Screenshot proof and structured evidence remain ignored under
  `.local/batch2-final-*`; new Chrome tab is marked for handoff.
- Draft PR https://github.com/sefaction/spheres-content/pull/35 is open and
  attached, stacked on #34. Initial Windows/Ubuntu CI at evidence head `45c093e`
  was running when recorded; check the PR for the current head's results.
  Documentation successors are distinct from deployed/tested `c7743ad`.
- Next safe step: reconcile #35 CI, then select another coherent non-Akashic
  physical-item group or remaining mechanics checks. Keep image completion
  separate from full content/automation acceptance. No campaign, system, service
  or world-filesystem changes; no merge/release approval. All older PRs remain
  unmerged and issues remain open pending individual merge approval.

## Prior tooling batch: committed reads for remote audits

- Branch `codex/batch-remote-source-reads`, based on group-4 draft PR #33 head
  `7bc3fa2`; issue #32. Both #33 Windows/Ubuntu CI checks passed. All stacked PRs
  remain unmerged. No merge/release approval.
- The semantic audit previously launched one `git show` per source document.
  A read-only trial fetched all 6,788 blobs in two Git calls in 922 ms; twenty
  distributed samples matched individual reads exactly. The preceding complete
  remote audit passed but took roughly ten minutes.
- `scripts/git-sources.mjs` now batches exact receipt-commit sources, checks
  byte-framed UTF-8 blobs and rejects unexpected modes/formats, malformed output
  and duplicate document IDs. Full remote hashes, Setup/path guards, snapshot
  immutability and exact pack comparison remain in place. Each pack reports its
  verified count. No content, IDs, compatibility fields or world data changed.
- Ten focused Git-source/remote tests passed, including older commits versus a
  dirty checkout, Unicode/nested paths, duplicate/malformed sources, truncated
  batch output, immutable source databases and existing deployment safeguards.
- A complete optimized audit of the existing `443947e` installation passed in
  121.92 seconds for all 6,788 documents, non-pack receipt bytes and referenced
  images. The earlier audit took roughly ten minutes.
- Clean implementation `eb14e78b71f6fadc37c515d66e59747f7d704174` passed all 86
  tests, all 6,788 compiler round trips and two identical 762-file builds. ZIP
  SHA-256: `ad3f2a27900c4f3fe2f4031f72ff1dc480a1e8ca4a4ffbda3b62d8c09bd9023f`.
  Guarded dry-run, staged deployment and installed-byte verification passed;
  one authorized oldest module backup was removed, retaining ten. No restart.
  Last deployment is `eb14e78`; its final semantic audit passed in 95.22 seconds
  for all 6,788 documents, non-pack receipt bytes and external images, with
  unchanged remote snapshots. The instance remains in Setup.
- Draft PR #34 is pushed, stacked on #33:
  https://github.com/sefaction/spheres-content/pull/34. Both Windows/Ubuntu checks
  passed at `4d1277a`; no merge or release approval.
- Next safe step: check #34 CI, then create the final twenty-item feature branch
  from this one and continue the cached non-Akashic review below. Additional
  source/kit observations are in ignored `.local/batch2-final-review-notes.md`.

## Prior reviewed content batch: physical batch 2, group 4

- Branch `codex/physical-items-batch-2-group-4`, based on `a834991` from draft
  PR #30. Both Windows/Ubuntu CI checks passed for #30. Issue #26 remains active;
  all stacked PRs are unmerged, with no individual merge or release approval.
- Twenty entries, Widening through Dragonstone, now have reviewed source-specific
  profiles and artwork. Three are empty native containers: Animate Wand Bracers,
  base unscaled Bandolier of Grenades and Bottomless Flask. Slot/volume limits
  stay distinct from pounds; no wands, grenades, liquids or nested compartments
  are bundled. PF1 containers have no activation actions, so retrieval/selection/
  pouring remain visible manual instructions. Extra-dimensional carried-weight
  reduction is not inferred where the flask source does not explicitly state it.
- Bludgeoner's Rod adapts the inspected PF1 11.11 Light Mace as a +2 weapon with
  its normal attack separate from the move-action charged-strike helper. Its
  conditional 15d6 is not added to every attack. Boots of Striding implement only
  +10 enhancement to landSpeed; native target and source-code evidence are pinned
  in `research/physical-items-batch-2-group-4.json`.
- Soulreaving separates a manually spent external soul from its one free daily
  use. Least Crimson Flask starts empty with a non-daily two-point manual storage
  pool; filling/opening spend no stored points. Paired notebooks/quills remain one
  priced set. Crafted feat, dragon/breath, doom and weather choices stay explicit.
  Specialized conditional outcomes and full compatibility remain deferred.
- Full original source bodies, prices, weights, IDs and snapshot hashes match the
  pre-review records. Native custom school strings retain the Spheres labels.
  Issue #31 tracks the Weather cloaks' moderate aura versus CL 5 discrepancy;
  neither source wording nor caster level is silently corrected.
- Nine original 256 px WebP illustrations total 69,628 bytes; prompts, original
  and output hashes and encoding are registered. Eleven entries use visually
  reviewed core/system art; the actual full cloak image is used for the weather
  cloaks. No unrelated bonuses, conventional rules or upstream image bytes.
- Clean implementation `443947eada252c7600c114a0681ea34beaeb9299` passed the full
  gate: 83 tests, all 6,788 compiler round trips and two identical 762-file builds.
  ZIP SHA-256:
  `c45d10cf498f2381c593635f73b05d419920c3c681dbb398d5926fd02c934033`.
  Guarded dry-run, staged deployment and strict installed-byte checks passed on
  2026-10-17; ten recoverable module backups remain. Draft PR #33 is pushed,
  stacked on `codex/metamagic-apparatus-group-3` (#30):
  https://github.com/sefaction/spheres-content/pull/33. Both Windows/Ubuntu CI
  checks passed at `7bc3fa2`; no merge or release approval.
- Batch 2 now has eighty reviewed images and twenty pending, all other apparatuses.
  Next ignored plan: `.local/batch2-final-plan.json`, beginning Field Researcher's
  Lenses, Force Hook and Gentle Shade Trinket. Akashic/legacy production stays
  deferred and existing sources/reviews are preserved.
- Final-group full source text and twenty exact/alternate/component searches are
  cached in `.local/batch2-final-*.json`, with 26 complete matching records. No
  final-group canonical edits or new art. Patch Hole resembles a Portable Hole
  but creates a temporary gap through an existing surface; inspect Create Gap
  rather than inheriting the other item's persistent storage/weight exemption.
  Medic Satchel needs a separate native-container/component-charge design because
  PF1 containers cannot activate. Keyhome and Pocket of Holding require individual
  spatial/capacity review rather than blanket bag-of-holding defaults.
- Native Foundry 13.351 / PF1 11.11 / pf1spheres 0.9.0 acceptance used only the
  module and framework in the dedicated world. Seven items transferred to the new
  `ASC Batch 2 Group 4 Acceptance` actor. Boots changed land speed 30 -> 40 while
  worn and back to 30 removed. The mace rolled its normal attack with +2 enhancement.
  Reaching spent two of five daily uses; Fleeting application spent one and later
  dismissal none; carried, unequipped Still spent one. Soulreaving's external-soul
  helper preserved its free daily use, and its free helper spent that use.
  Crimson Flask began empty, rejected an empty expenditure, preserved a manually
  set pool on opening and spent one stored point. No external souls/blood, target
  effects or conditional damage were automatically supplied/applied.
- All three containers imported to native world-item sheets with empty contents,
  original images, correct prices/weights and visible limits. The bracers accepted
  a separate native test marker. Container-to-actor transfer/removal, specialized
  effects, full lifecycle/non-GM regression and broader prior-batch acceptance
  remain incomplete; do not interpret these representative checks as full review.
- Final browser capture: zero errors, 59 PF1/framework deprecations and the
  expected empty-flask warning, with no module script reference. Current daily
  server log: 482 records, two earlier authentication warnings; the 176-record
  deployment/acceptance window has no warning or error. No current daily error
  file. Native Return to Setup confirmed no active game. No restart occurred.
  Last deployment is `443947e`; the final exact semantic audit passed for all
  6,788 documents, non-pack receipt bytes and referenced external images. Only
  local database copies were opened; installed snapshots stayed unchanged.
- Issue #32 tracks the newly measured per-document Git subprocess bottleneck in
  that audit. An ignored read-only trial fetched all 6,788 committed blobs using
  two Git calls in 922 ms, matching twenty distributed individual reads exactly.
  Twenty individual reads took 1,915 ms (full old-read estimate ~650 seconds).
  Preserve the existing receipt/Setup/hash/snapshot/exact-comparison checks.
- Next safe step: address #32 on its own feature branch before the final
  twenty-item group. Preserve test copies; no campaign, merge or release work.

## Prior reviewed content batch: physical batch 2, group 3

- Branch `codex/metamagic-apparatus-group-3`, based on `9b566fa` from draft PR #29.
  Both Windows/Ubuntu checks passed for #29. Issue #26 remains open and all
  stacked PRs remain unmerged; no merge or release approval has been given.
- Twenty entries, Seeking through Umbral, now have reviewed native lesser-tier
  profiles, three daily uses, shared suitable core artwork and individual limits.
  Full approved source descriptions, prices, weights, IDs and source hashes match
  the pre-review records. Eighteen full alternate conventional rod records were
  inspected; different rules, prices and native settings prevent complete reuse.
- Still explicitly activates mentally while carried or worn, without holding or
  wielding. Suppressed retains its published three-pound weight. Both exceptions
  are pinned in the shared profile and enforced by validation with negative tests.
- Toxic requires a separately supplied poison dose, a failed qualifying talent
  save and a separate poison save. It grants no dose, removes no inventory item
  automatically and applies no poison condition. Studied uses racial CR without
  class levels/templates; Tricking uses Charisma, not an inferred casting stat.
  Other effect/target, duration, descriptor and lighting limits remain explicit.
- Native actions track one daily use per application, separately from feat costs.
  Source-specific target outcomes need a qualifying casting interface; no global
  actor modifiers, automatic conditions, scene-light changes or permanent grants
  are added. Remote compatibility and conditional effects remain deferred.
- Clean implementation `a753dc1caa189efc7355371a70a72f773239ed86` passed formatting,
  lint, all 77 tests, source/reference/provenance checks, all 6,788 compiler round
  trips and two identical 753-file builds. ZIP SHA-256:
  `2c1fdd2c1f87a71557b809fe46c3d0b6e817e61d248d60c3f211629f87b4008f`.
  Draft PR #30 is pushed, stacked on #29:
  https://github.com/sefaction/spheres-content/pull/30. Both CI platforms passed at
  `a834991`; no merge approval.
- Batch 2 now has sixty reviewed images and forty pending: Widening plus
  thirty-nine other apparatuses. Next ignored plan: `.local/batch2-group4-plan.json`.
  Source text and nine full component/alternate records are cached in corresponding
  group-4 review files, with broad-name homonyms in a separate inspection file.
  Review selected component rules and artwork before authoring; no group-4 edits.
  Akashic/legacy work stays deferred; preserve existing entries and reviews.
- Read-only Setup guard still reports a running world. The pending user request
  asks for the administrator-authenticated transition to Setup; no new reply,
  deployment, world transition or restart. Last deployment remains `fed942b`.
- Next safe step: check #30 CI and start the next coherent twenty-item group
  from this branch while awaiting the administrator-authenticated Setup transition.
  Reconcile actual server state after any reply. A documentation-only follow-up
  needs a fresh clean gate before deployment. When safe, perform staged deployment,
  Foundry acceptance and final Setup semantic audit. No transfer has occurred.

## Prior reviewed content batch: physical batch 2, group 2

- Branch `codex/metamagic-apparatus-group-2`, based on `b89208f` from PR #28.
  Both CI platforms passed for #28. Issue #26 remains active; all stacked PRs
  remain unmerged, with no individual merge or release approval.
- Twenty entries, Enlarging through Scarring, now have individually reviewed
  native profiles, reuse decisions, held-rod artwork and source/timing notes.
  Full approved source descriptions, prices, IDs and snapshot hashes are intact.
  Twenty-four alternate conventional rod records were fully inspected; their
  different prices, weights, spell rules and incomplete settings were rejected.
  The previously reviewed suitable core rod image is reused without copying bytes.
- All select lesser tier CL 5, effect CL <=7, untyped aura and five-pound weight.
  Reaching explicitly has five daily uses, one use per range-category advance,
  with repeat activation of the same apparatus permitted in one casting.
  Other entries have three daily uses; feat spell-point costs are not item costs.
- Extending/Fleeting each have alternate initial-casting and paid-persistence
  helpers sharing one daily pool. Fleeting’s later swift dismissal costs zero
  additional uses. Half-duration, counterspell vulnerability and aura-detection
  limits remain explicit, with no automatic world/token changes.
- Flaring’s unchanged source remains ambiguous under issue #27. Native physical
  and usage fields are reviewed; affected trigger/duration outcomes and advanced
  interpretation remain deferred. No duration formula or light-damage trigger is
  invented. Target effects and the other conditional outcomes await an interface
  and remote acceptance; no global actor modifiers or permanent feat grants.
- The pinned shared-profile table and validator now preserve repeat activation,
  alternative persistence timing, free follow-up and unresolved-source status.
  Clean commit `aec8de7c58a25cb5b6883e3a39eb76bd9670ecc7` passed formatting, lint,
  all 73 tests, source/reference/provenance checks, all 6,788 compiler round trips
  and two identical 753-file builds. ZIP SHA-256:
  `7b17e28931edc4e2c2e47c29626efeec72f245ebdd54d5ee1d6ef54d3edcf624`.
  Draft PR #29 is pushed, stacked on PR #28:
  https://github.com/sefaction/spheres-content/pull/29. Both CI platforms passed at
  `9b566fa`; no merge approval.
- Batch 2 now has forty reviewed images, sixty remaining: twenty-one metamagic
  apparatuses and thirty-nine other apparatuses. The next ignored plan is
  `.local/batch2-group3-plan.json`, starting Seeking, Selective and Shadow Grasping.
  Continue explicitly with `--batch=physical-items-batch-2`; review source and
  compendium alternatives before new art or native profiles.
- The user reported Setup availability, but the guarded route check and browser
  still show the dedicated Additional Spheres Content Test world running with
  zero players. A blank-password Return to Setup attempt was rejected; no world
  transition or remote deployment occurred. The server administrator password is
  required, so an asynchronous request asks the user to return that exact test
  instance to Setup. Do not seek credentials or change server authentication.
  Last deployment remains `fed942b`; no restart is authorized.
- Source review and full-name/reordered/alternate compendium searches for the
  next twenty entries are cached in ignored `.local/batch2-group3-*.json`. No
  group-3 canonical sources have changed. Still can be used while carried/worn
  without holding; Suppressed has published weight three pounds. Preserve those
  exceptions instead of copying the shared held-rod/five-pound assumptions.
- Next safe step: reconcile the user's Setup reply with the actual route, then
  run a fresh clean verification for the current commit before guarded deployment
  and Foundry acceptance. Return to Setup for the exact semantic audit. Continue
  the next coherent twenty-entry group locally while authentication is pending.
  This documentation follow-up has not been deployed; do not infer acceptance.

## Prior reviewed content batch: physical batch 2, group 1

- Branch `codex/physical-items-batch-2`, based on `cd3a52d` from draft PR #25.
  Both Windows and Ubuntu checks passed for #25. All preceding PRs remain
  unmerged; no individual merge approval or release approval has been given.
- Issue #26 tracks the next frozen 100 canonical Ultimate-edition item records.
  Existing first-batch membership remains intact and active while its mechanics
  and remote acceptance are incomplete. Akashic and legacy production is excluded.
  Original IDs, source keys, snapshots and descriptions are preserved.
- Twenty apparatuses, Aligned through Encouraging, now have reviewed native
  profiles and a suitable shared core rod icon. Exact-name/reordered searches and
  conventional rod aliases were inspected before authoring. Conventional PF1
  records have different rules/prices; no unrelated effects or image bytes were
  imported. Selected profile, per-effect restrictions and source links are visible
  in native instructions and action notes.
- Shared approved source is pinned in `research/metamagic-apparatus-profiles.json`
  at page SHA `b199c2959cd7059a7634d4aa0480c10be7f41ab821ec7b8461ad1344f81d1091`.
  Nineteen selected lesser tiers use CL 5, faint untyped aura, three daily uses
  and sphere effects up to CL 7. Apply as part of casting while held; feat spell-
  point cost is not an item cost. Normal effect/other-metamagic costs still apply.
- Cascading is normal-only: CL 10, 20,000 gp, each talent CL <=7 and total <=9,
  shortest duration/longest casting time, self-targeted persistent effects only.
  It is one metamagic feat combining talents, so retains three daily uses.
  Bouncing’s later swift redirection costs zero extra uses. Aligned/Elemental
  choices share the item pool and remain unselected until the GM/user chooses.
- Full rule outcomes need a qualifying casting/target interface. No actor-wide
  damage, speed, DC, condition, morale or concentration modifiers were added.
  Native sheets/use and actual integration await remote acceptance.
- Clean implementation `7e02a2a82806b3bc0f8c650266b63ae143bca60a` passed formatting,
  lint, all 68 tests, content/reference/provenance checks, all 6,788 compiler round
  trips and two identical 753-file builds. ZIP SHA-256:
  `3f17b9afb60fda336d75d2b4e2eb63c7184ac70416b60c77fb6a46ab628bfd23`.
  Negative tests cover tier, daily-use, combined CL, caster-level and feat-cost
  drift. A scheduling lane keeps the remaining apparatuses together.
- Draft PR #28 is pushed, stacked on #25 and references #26:
  https://github.com/sefaction/spheres-content/pull/28. Both Windows/Ubuntu CI
  passed at documentation commit `b89208f`; no merge approval. Documentation follow-up needs a fresh clean gate
  before deployment.
- Batch 2 now has twenty reviewed images and eighty pending: forty-one metamagic
  apparatuses plus thirty-nine other apparatuses. Continue with
  `node scripts/production-plan.mjs --batch=physical-items-batch-2 --limit=20`.
  The next ignored plan is `.local/batch2-next-plan.json`, starting Enlarging,
  Extending and Fearsome. Inspect each exception and compendium match first.
- Last remote check still returned HTTP 200 at `/join`, unidentified world
  running. Do not switch worlds, deploy or restart. User Setup-status question
  remains unanswered; last deployment receipt is `fed942b`. Continue local work.
- Next safe step: check PR #28 CI, create a new feature branch from this one,
  inspect the next twenty compendium matches, then author group 2. The full source
  review is cached in `.local/batch2-group2-source-review.json`, with exceptions
  in `.local/batch2-group2-exceptions.json`. No group-2 source edits or new art yet.
- Reaching explicitly has five daily uses and permits repeat activation with the
  same apparatus for one casting. Extending/Fleeting may apply when paying to
  persist a concentrated effect; Fleeting also has a later swift dismissal.
  Preserve these exceptions instead of copying the first group’s common timing.
- Issue #27 tracks Flaring’s confirmed source ambiguity: the descriptor lists
  include light, the damage trigger names only fire/electricity, and its duration
  phrase is malformed. Re-extraction from the same approved snapshot confirms
  the wording. Preserve it and defer affected outcomes/advanced interpretation.
- Remote route rechecked before push: still HTTP 200 at `/join`. Continue local
  work without disrupting that world or assuming an answer to the Setup question.

## Prior reviewed content batch: final first-batch group

- Branch `codex/physical-items-final-group`, based on `c02a056` from draft PR #23.
  Both CI platforms passed for #23. No PR has individual merge approval.
- Fourteen remaining non-Akashic entries now have reviewed profiles and images.
  The frozen 100-entry image queue reports zero pending. Thirteen new 256 px WebP
  icons total 105,780 bytes; Divine Symbol references a visually reviewed core
  image. Native profiles and specialized mechanics are not all remotely accepted
  or fully automated. Existing Akashic work remains preserved and deferred.
- Trash Bag is a native container with five one-pound zero-value trash units.
  Its published full five-pound weight is represented by contents, so adding
  mundane Sack weight would double count. The five-pound capacity is recorded
  explicitly; drawing random improvised weapons and regeneration remain manual.
- Disc of Rainbow Tears adapts PF1 11.11 Buckler (+2), and Leviathan Cross adapts
  its Light Crossbow (+1). Complete base descriptions and named-item overrides
  are retained. Conditional shield stacking, special abilities, stone sockets
  and kineticist interfaces remain deferred. Armor qualities stay separate
  zero-weight upgrade references, not fabricated complete armor suits.
- Native helpers consume a basic Burn Fragment and a one-HD Dragon’s Tooth.
  Burn Shard has one daily use after attunement. Cradle has three daily activations
  and a separate manual four-point momentum pool; movement costs no daily use.
  Archmage’s Cube uses a one-daily-wager counter, with inherited Wizard’s Cube
  appearance/rules inspected. Variant and selection notes appear on the records.
- Issue #20 also covers the corrected Trash Bag publisher boundary. Same page
  SHA `9b69cd677fd616fea875857afdec8ce0604e35a3a0f38e6e8118edf1488bc29e`;
  old description `3bcaebe7496f80d3727a5843d3c4d4c8698701d20585b40a790f88d09b104407`
  becomes `f556da03c6ce830c14166dd18f03769fac9101fe700128d018bcc8bc90379b82`.
  Rules, construction, source footer and stable ID are preserved; frozen digest
  and ledger are reconciled. Regression cases preserve legitimate rules tables.
- Issue #24 tracks additive price parsing: both armor upgrades now use their
  published +10,000 gp fee instead of 5,000 gp construction cost. The parser
  accepts the plus sign. A non-Akashic catalog scan found these two explicit
  numeric additive Price headers; both now agree. No broad intake refresh ran.
- Implementation `23dc045a8f6d4094629d159efea5c39f74acd21b` passed clean full
  verification: formatting, lint, all 60 tests, source/reference/provenance guards,
  all 6,788 compiler round trips and two identical 753-file builds. ZIP SHA-256:
  `01cccd5b9490b8aeb7b30cd72731055d0ba3eec922005af6582b4257f1a145d9`.
- Draft PR #25 is pushed and stacked on `codex/physical-items-group-3` (#23):
  https://github.com/sefaction/spheres-content/pull/25. Windows/Ubuntu CI passed at
  documentation commit `cd3a52d`. References #15, #20 and #24; none is closed and no merge is approved.
  This documentation follow-up needs a fresh clean gate before deployment.
- Remote last checked read-only: HTTP 200 at `/join`, unidentified world running,
  PF1 11.11 / pf1spheres 0.9.0 / installed module alpha.6. Last deployment receipt
  remains `fed942b`. No deployment, world switch or restart. A user status question
  about Setup is pending; continue independent local work without assuming a reply.
- Next safe step: check PR #25 CI, then accept the branch in the dedicated world
  once Setup is confirmed, or start the next non-Akashic production branch.
  First-batch image work is done; keep its status active while mechanics and
  remote acceptance remain incomplete.
- Independent next-batch research is cached in ignored
  `.local/next-non-akashic-candidates.json` (521 unreviewed candidates before
  edition/mechanics screening). Metamagic apparatus base rules are pinned in
  `.local/metamagic-base-profile-research.json`: lesser CL 5, faint untyped aura,
  effects up to CL 7, normally three daily uses as part of casting, held or worn
  by form. Combination-apparatus exceptions and each effect require review.
  Feat spell-point costs are not the physical apparatus's use cost. No next-batch
  item, image or frozen membership has been authored. Preserve IDs/source hashes.

## Prior reviewed content batch: physical item group 3

- Branch `codex/physical-items-group-3`, based on `2714dad` from PR #21.
  Continue the user goal of processing as many non-Akashic items as practical.
  Akashic production stays deferred; preserve existing sources and reviews.
- Twenty entries have locally reviewed profiles and images: five weapons, two
  native ammunition records, one empty native container and twelve equipment
  entries. Twelve new icons total 95,062 bytes; seven reviewed existing paths
  cover eight entries. The frozen batch has 86 reviewed images, leaving fourteen.
- Instruments use the approved Rockstar table, not an assumed axe/mace profile.
  Native ammunition is one projectile; its +1 benefit and on-hit powers still
  need an explicit integration. Cave Bag starts empty; its 2 gp gem-growth cap
  is not a storage-capacity limit. Null Bindi keeps its head slot and native
  single-use consumption; motif attachment costs zero items and destruction one.
- The parser/source boundary correction is committed at `2c4d1e6` under issue #20.
  Source snapshots, stable IDs, source keys and complete item rules are retained.
  Issue #22 tracks contradictory source slot headers. Neither issue is closed.
- Clean implementation commit `8b4fbb5e15fc883c36a5334e986787685cd01a73` passed
  formatting, lint, all 51 tests, content/reference/provenance checks, all 6,788
  compiler round trips and two identical 740-file builds. ZIP SHA-256:
  `14d003da08b1214e081f7da9478eebd6d70c795a59e30807527b404673858d0c`.
  The planner test now permits a final group smaller than twenty; behavior is
  unchanged. Documentation follow-up needs a fresh clean gate before deployment.
- Draft PR #23 is pushed and stacked on PR #21:
  https://github.com/sefaction/spheres-content/pull/23. Windows/Ubuntu CI passed at
  documentation commit `c02a056`.
  No remote acceptance, compatibility claim, merge or release is implied.
- PR #21 remains draft with passing Windows/Ubuntu CI at `2714dad`.
  PR #23 targets `codex/physical-items-group-2` and references #15, #20 and #22.
  No individual PR merge approval has been given.
- Remote last checked read-only: `/join`, unidentified running world. No
  deployment, world switch or restart. Last saved deployed receipt: `fed942b`.
  Coordinate Setup before remote acceptance; continue independent local work.
- Next safe step: check PR #23 CI, then create a final-group branch from this
  branch. The fourteen remaining entries are cached in ignored
  `.local/remaining-physical-group.json`; exact/component searches and four full
  source records are in `.local/final-group-reuse-searches.json` and
  `.local/final-group-component-refs.json`. No final-group art or source edits yet.
- Trash Bag contains another publisher-navigation table, headed Gonzo 1 and 2
  by Little Red Goblin Games, after its construction cost. Issue #20 remains
  open with the hash-pinned finding. Correct that boundary and its frozen/audit
  digests deliberately before marking the item reviewed. Its native container
  must reconcile the published full weight with usable improvised trash contents.
  Disc of Rainbow Tears needs the native Buckler shield profile; armor properties
  must not be modeled as complete wearable suits. Retain source variant choices.
- Read-only remote recheck: HTTP 200 at `/join`, PF1 11.11, pf1spheres 0.9.0 and
  installed module alpha.6. The running world remains unidentified. Continue
  independent local work while coordinating Setup for remote acceptance.

## Prior reviewed content batch: physical item group 2

- Branch `codex/physical-items-group-2`, based on `34a93b8` and tooling PR #19.
  Issue #15 remains the physical-item umbrella. PR #16 and #19 remain open/draft;
  no merge approval has been given. Draft PR #21 contains this content group:
  https://github.com/sefaction/spheres-content/pull/21.
- User goal: review as many items as practical before the usage reset. Akashic
  items are temporarily deferred per the user’s 2026-10-17 direction. Preserve
  their existing sources/reviews and skip further Akashic production.
- Twenty non-Akashic entries now have reviewed profiles, images and explicit audit
  decisions: two etherstaves, two rings, thirteen wearables and three firearms.
  Nine generated 256 px WebP icons total 79,712 bytes; eight core image paths are
  referenced after source-record and visual review. Body wraps share meaningful
  family art. No third-party image bytes are packaged.
- The firearms adapt PF1 11.11 Blunderbuss, Pistol and Musket, retaining native
  attack data, ammo, misfire, published enhancement and source bibliography.
  Base unidentified rules are retained separately from complete wiki descriptions.
  Ordinary attacks cost zero daily special-power uses; the three special powers
  use their separate 1/3/2 daily counters and immediate/swift activation reminders.
- Dashing Cloak has standard/move/swift actions costing 1/2/3 of five charges.
  Amulet of the Revealing Eye has three daily uses, a 60-foot cone and three-round
  duration reminder; free reorientation costs zero uses. The crown starts
  uncharged and tracks one manually gathered charge. No automatic teleportation,
  secret-door revelation, burn application or conditional overflow bonus is inferred.
- Full source descriptions and stable IDs are preserved. Alternative prices and
  chosen base tiers are explicit. Conditional mechanics, optional integrations,
  unselected special abilities and aura-strength/single-school limitations remain
  deferred with specific reasons. The group is locally reviewed, not remotely accepted.
- Implementation commit `2071c3cb0ca5ba52faea81e3873534aecef84289` passed
  clean committed full verification: formatting, lint, all 43 tests, content,
  reference/provenance checks, all 6,788 compiler round trips and two identical
  728-file builds. ZIP SHA-256:
  `aaa8dd8ccab46a81a626832687b8c5a53078463a4741bdd8d760eb7cb587a236`.
  The branch is pushed. CI status is authoritative on PR #21; no CI result is
  assumed from dispatch. This documentation-only follow-up requires a fresh
  clean gate before any later deployment.
- The batch now has 66 locally reviewed entries/images and 34 unresolved images.
  None of the twenty new entries is claimed remotely accepted or fully automated.
  Issue #20 tracks source-navigation spill in the next item, Sparkly’s Glittergun:
  https://github.com/sefaction/spheres-content/issues/20. Correct its extraction
  boundary, preserving IDs, before treating it as reviewed.
- Remote status was rechecked read-only: `/join`, with a world running.
  No deployment, world switch or restart occurred. The last saved receipt remains
  `fed942b`. Do not disrupt an unidentified world; coordinate Setup before deployment.
- Next safe step: inspect PR #21 CI, then continue the remaining 34 non-Akashic
  entries. The next planner group begins with Sparkly’s Glittergun and Blaster’s
  Bearing, followed by Gonzo equipment. Prepare source-boundary and native-type
  corrections before images; musical weapons need their actual base statistics.
  Continue independent local work while remote acceptance is unavailable.

## Prior tooling batch: production efficiency

- Branch `codex/production-efficiency`, based on `d70d7a5` from
  `content/physical-items-batch-1`. Issue #18:
  https://github.com/sefaction/spheres-content/issues/18.
  Draft PR #19: https://github.com/sefaction/spheres-content/pull/19.
  This is a separate tooling batch stacked on draft PR #16; target its branch
  until #16 is individually approved and merged. No merge or release approval.
- Group the full unresolved-image queue before selecting twenty entries. Add
  weapon, wearable, container, wondrous and armor-property scheduling lanes;
  preserve frozen membership, source IDs/hashes and explicit holds.
  `--order=manifest` preserves the old ordering.
- Content tests share one deeply frozen validated snapshot; each independent
  clean build validates once. Standalone validators stay fresh, and compiler
  round trips, two clean builds, references, provenance and archive checks remain.
- Implementation commit `ec5e324e465887be1c1e2e50bda5fac39e4436bf` passed
  clean committed verification: formatting, syntax checks, all 40 tests,
  provenance/references, all 6,788 compiler round trips and two deterministic
  719-file archives. ZIP SHA-256:
  `1300427c117e33fabcfee3a85deaa4d8101f2bb40d5ddab5f47336b06a5513eb`.
  Full gate took 173.6 seconds; tests took 12.7 seconds versus 79.8 seconds for
  the prior 37-test run on this machine. These are illustrative timings, not a
  controlled benchmark. Tests/builds now validate the catalog three times rather
  than fourteen. Regression tests cover grouping before limits, deterministic
  ordering, paging without gaps/duplicates and unchanged frozen membership.
- PR #19 is pushed and remains draft for pending remote acceptance. CI pending.
  This documentation-only follow-up is not the locally verified implementation
  commit; its final checkout must pass CI and a fresh clean gate before any deploy.
- Remote read-only reconciliation confirmed alpha.6 / PF1 11.11 and the dedicated
  test-world marker. The saved receipt still records `fed942b`. HTTP currently
  ends at `/join`, so a world is running; its identity and active users were not
  inspected. No deployment, world switch, restart or remote data change occurred.
  Return the designated instance to Setup through authorized coordination before
  any deployment or semantic audit. Do not deactivate an unidentified world.
- The old local verification receipt was dirty and stale. It cannot authorize a
  new deployment; run a clean committed gate immediately before any later deploy.
- Source compendia, artwork, module version and compatibility are unchanged.
  The content batch remains at 46 reviewed entries / 54 unresolved images.
  The new next group has two etherstaves, two rings, thirteen wearables and three
  weapons, rather than eighteen individually classified entries and two staves.
- Obsidian records the durable grouped-review workflow decision under issue #18.
  Next safe step: check PR #19 CI, coordinate the designated instance back to
  Setup for remote acceptance, then review this tooling PR individually. Resume
  content production separately; no content or artwork has been added here.

## Current content batch: first 100 physical items

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
- Production cadence changed on 2026-09-21 after the seven small acceptance
  slices proved too costly. `npm.cmd run plan:production -- --limit=20` now
  selects unresolved-image entries and groups shared profiles. Authoring uses
  targeted checks; one clean build, deployment, representative Foundry
  acceptance, semantic audit, documentation update and CI cycle covers the
  complete twenty-entry group. Entries with already reviewed art are not
  reselected simply because later automation remains deferred.
- The completed twenty-entry plan covers Lightning Rod through Etherstaff of the
  Modeling Enthusiast: one reuse decision, four planar power components, one
  structure, one consumable, four related rings and nine etherstaves. The
  etherstaves share the source-defined ten-charge capacity and recharge rules;
  their individual manifestations and special actions remain in their complete
  descriptions pending a compatible Ethermagic action interface.
- Commit `fed942b697ca785abe7a54723d46b4943c4f30d0` implements that twenty-entry
  group and the production planner. All 37 tests, reference validation and two
  deterministic 719-file builds passed; ZIP SHA-256 is
  `e68a66d7c6472a120a023b0a53a8a270ebf64714c5b9d2dea1efa80f2b889f21`.
  The scoped deployment verified exact bytes, removed the oldest eligible
  rollback and retained ten backups without restarting the host or container.
- Foundry 13.351 / PF1 11.11 acceptance opened Alteration's Bane, Apprentice
  Blastmage's Etherstaff, Band of Grounded Realities and Lightning Rod. Their
  generated WebP art, complete descriptions and source links rendered. The
  potion showed CL 14, evocation, Potion/Oil, Single Use and Drink; the staff
  showed CL 8, evocation and 10/10 charges; the ring showed the finger slot and
  CL 12; the rod showed 50 gp and 2 lb. No ASC error appeared. Existing PF1,
  pf1spheres and unrelated-module Foundry 13 warnings remain. The world is back
  in Setup and the final semantic audit matched all 6,788 documents.
- The batch now has 46 reviewed reuse decisions, 46 implemented images and 54
  unresolved images. Fourteen entries are complete; the others retain explicit
  deferred automation or compatibility work. The next planner result begins
  with Fjodor's (Relatively) Faithful Friend and groups two remaining
  etherstaves with eighteen individual magic-item reviews.
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
- Fifth-slice implementation commit `51bddd0c8e12ebc408158d74b660169aefcc64b1`
  passed the clean local gate with all 33 tests and two identical 700-file
  builds. Runtime acceptance then exposed PF1's consumable price calculation:
  a base price of 200 gp plus twenty charges worth 10 gp each displayed as
  400 gp. Correction commit `2c7717f2e12de3f37c7e07834b38eb924138d5a1`
  leaves the base price at zero so the twenty charges produce the published
  200 gp total; a regression test pins that calculation.
- The exact correction commit passed the full clean gate, deployed atomically,
  verified installed bytes, pruned one oldest eligible module backup and
  retained ten. Foundry 13.351 / PF1 11.11 displayed Black Powder at 200 gp,
  20/20 charges and 10 gp per charge. Dragging it to the acceptance actor
  preserved the profile; using one dose reduced it to 19/20 and lowered actor
  inventory value by 10 gp. Catnip Hookah imported its linked Catnip child, and
  Catnip's Single Use action reduced the actor copy to quantity zero. The only
  browser error was a harmless login attempt before selecting Gamemaster;
  scoped server logs contain the five expected ASC pack connections and no
  warning or error. The world is back in Setup, and the final semantic audit
  matched all 6,788 deployed documents to canonical sources at route `/auth`.
- The sixth production slice reviews Fish Liver Grog, Kuoki and Liquid Life.
  All three use native single-use consumable profiles with pinned standard-action
  Drink actions and original 256 px WebP art under `items/alchemical-items`.
  Fish Liver Grog is a miscellaneous remedy; Kuoki and Liquid Life are drugs.
  Their reviewed action notes preserve the delayed base-Life-sphere restore and
  2d6-round nausea, one-hour Spirit Sense, and 3d6 temporary hit points capped
  by current damage plus fatigue removal and one-hour expiry, respectively.
  Static Changes would misrepresent these timed, capped and stateful effects, so
  their automation/compatibility audits remain explicitly deferred. No permanent
  talent or ability is linked to an actor for a temporary consumable effect.
- Twenty-three batch entries are reviewed and thirteen are complete. These three
  remain pending only for the deferred automation above. The batch now has 23
  implemented images and 77 remaining. The physical reuse report records 32
  current reviewed decisions, one unrelated stale decision and one unavailable
  provider pack; none of these three items had an exact or normalized candidate.
- Implementation commit `537c5265dc678dcf28af29bf635737695572b5ff`
  passed formatting, all 33 tests, source/reference validation and two identical
  703-file clean builds; ZIP SHA-256 is
  `2f798b9894da2cbd2357ba80bde7062381387f8d7cc7ee19d742b6e3a5c70d69`.
  Atomic deployment verified exact installed bytes, pruned the oldest eligible
  module backup and retained ten without a restart. Foundry 13.351 / PF1 11.11
  opened all three sheets with their correct art, prices, complete descriptions,
  subtypes, Drink actions and Single Use setting. Browser-controlled document
  dragging again produced no transfer, so no new actor-use result is claimed.
  The scoped server log shows all five ASC pack connections and no matching
  warning, error or exception. The world is back in Setup and the final semantic
  audit matched all 6,788 installed documents to canonical sources at `/auth`.
- The seventh production slice reviews Brimstone Briquette, Inversion Prism and
  Iridium Jellenate. Each is native zero-weight Gear with its published
  single-dose price, complete source text and original 256 px WebP art under
  `items/equipment`. Their descriptions preserve both consumable-dose and
  reusable-focus quantities: 10 brimstone briquettes, 30 inversion prisms, or
  10 doses of iridium jellenate form the respective focus. A destructive
  Single Use action would incorrectly consume that reusable focus, so these
  entries deliberately have no activation or native uses profile.
- Their bonuses qualify individual effects: ongoing catch-fire damage and the
  extinguish DC, the save DC of dark/light effects, or the hardness of objects
  created by an effect. Static actor-wide Changes or context notes would apply
  outside those boundaries. Changes, context notes, usage and compatibility
  therefore remain explicitly deferred for a future qualifying-effect adapter;
  the exact rules are retained in each description.
- Twenty-six batch entries are reviewed and thirteen are complete. The batch
  now has 26 implemented images and 74 remaining. The physical reuse report
  records 35 current reviewed decisions, one unrelated stale decision and one
  unavailable provider pack; none of these three items had an exact or
  normalized candidate.
- Implementation commit `b31886def592fc2e67bd4677928acde6b9e146f4`
  passed formatting, all 34 tests, source/reference validation and two identical
  706-file clean builds; ZIP SHA-256 is
  `159252c71aabdd66a418163e0cec2be0b04978f58630a25dda1dab2f1447908f`.
  Atomic deployment verified exact installed bytes, pruned the oldest eligible
  module backup and retained ten without a restart. Foundry 13.351 / PF1 11.11
  opened all three sheets with their correct original art, Gear subtype, zero
  weight, prices, complete descriptions and source links. The empty Changes
  view was confirmed on Iridium Jellenate. The latest server launch connected
  all five ASC packs with no warning, error or exception in the acceptance
  window. The world is back in Setup and the final semantic audit matched all
  6,788 installed documents to canonical sources at `/auth`.
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
