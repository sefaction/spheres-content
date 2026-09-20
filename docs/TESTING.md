# Testing

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
