# Work checkpoint

Updated: 2026-09-19.

- Active branch: `tooling/bootstrap`.
- Repository started empty; local `main` holds only supplied AGENTS.md and CODEX.md. User approved seeding instruction-only main; main and the feature branch are now pushed.
- Scope: foundation before content/pack planning.
- Issue: https://github.com/sefaction/spheres-content/issues/1. Draft PR: https://github.com/sefaction/spheres-content/pull/2; reconcile with GitHub before resuming.
- Implemented: module shell, target-version record, empty source/provenance inventory, build/archive tooling, fail-closed remote/release gates, boundary tests, CI, project documentation.
- Local checks: full foundation gate passed, including six tests and matching clean-build ZIP hashes. Windows and Linux CI passed for c27eebd; recheck after this documentation update.
- Obsidian hub: created in the approved Foundry-AI vault at `20 - Projects/Personal/Additional Spheres Content.md`; not committed or pushed in that vault.
- Remote: corrected shared instance reachable; core v13 build 351 and PF1 11.11 confirmed in UI. Created `additional-spheres-content-test` and confirmed it appears in Setup. Server left in Setup. Initially supplied instance was inspected only and remains untouched.
- Deployed commit: none. No module smoke tests performed.
- Outstanding: existing Windows share or SSH access (Unraid mapping is recorded in ignored local configuration; inferred Windows share was inaccessible), safe deployment/rollback adapter, module acceptance, version-specific content validation, content scope discussion.
- Next safe step: establish Windows share access using the user's own Unraid share credentials, verify the test-world marker, then implement the safe deployment adapter. Keep PR #2 in draft until remote module acceptance is complete. Do not merge or publish without required separate approvals.
