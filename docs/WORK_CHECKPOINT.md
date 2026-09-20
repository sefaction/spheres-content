# Work checkpoint

Updated: 2026-09-20 (work began 2026-09-19 local time).

## Current batch: packaged kit components

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
- Local full verification and new remote deployment/UI acceptance are pending
  in this implementation checkpoint. The test world was returned to Setup to
  permit safe pack replacement. The prior runtime remains `300a375` until the
  deployment receipt confirms a replacement.
- Next safe step: finish local checks, commit, verify the clean build, stage/swap
  deploy, and exercise container sheets, quantities, totals and removal in the
  dedicated test world. Do not migrate or overwrite old imported kit copies.

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
