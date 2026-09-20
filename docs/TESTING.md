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

## Pending checks

- Launch the dedicated test world (PF1 11.11 confirmed in Setup).
- Install the module shell, enable/disable/reload it, and inspect browser and server logs.
- Establish tested compatibility fields and evidence validation.
- Complete actual SMB deployment and UI acceptance; local adapter tests cover unsafe targets, backup preservation, and rollback after a failed staging rename.
- Implement PF1 document schema, reference, and mechanics tests alongside the first content batch.
- Validate representative compendium entries, drag/drop, bonuses, stacking, and conditional notes.
- For a release, validate actual install/update from its manifest and versioned ZIP.

The `release:check` command currently fails closed. Release/tag/manifest publishing
automation will be implemented after the first tested candidate and an agreed
distribution approach. No CI job deploys or publishes anything.

## Bootstrap workflow exception

The repository contract normally requires remote acceptance before a completed PR.
While access is incomplete, open the setup PR as a **draft**, explicitly record the
missing acceptance checks, and leave the related issue open. This does not waive
acceptance or grant merge approval. Commit the build inputs before deploying the
exact reviewed commit; record remote evidence in the PR and checkpoint afterward.
