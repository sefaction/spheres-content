# Work checkpoint

Updated: 2026-09-19.

- Active branch: `tooling/bootstrap`.
- Issue: https://github.com/sefaction/spheres-content/issues/1. PR: https://github.com/sefaction/spheres-content/pull/2. Neither merged nor closed; reconcile live status on resume.
- Base: user approved instruction-only main seeding. Foundation implementation remains on the feature branch.
- Scope: foundation before content/pack planning; zero imported documents or assets.
- Implemented: module shell, deterministic ZIP, official compiler round trip, provenance intake gate, Windows SMB staging/swap, retained module backups, HTTP setup guard, local receipts, and Windows/Linux CI.
- Validation: 10 tests and full verification passed; CI passed on `38f3886`. Check final acceptance-documentation commit CI before further work.
- Obsidian hub: Foundry-AI vault, `20 - Projects/Personal/Additional Spheres Content.md`; no vault commit/push.
- Remote: SMB works. Foundry `13.351`, PF1 `11.11`, dedicated world `additional-spheres-content-test`. Private connection details remain in ignored local config; no credentials stored there.
- UI-tested commit: `6b2ad38e5f94e911358ca4d3807732ed834eb103`, module `0.1.0-alpha.1`. Discovery, enable/disable/re-enable, reload, and log checks passed. See `docs/TESTING.md`.
- User handled the browser certificate warning. The specifically authorized test-container restart completed. Startup automatically launched a campaign; returned to Setup with no players and used the dedicated world for acceptance. Do not alter startup settings or unrelated containers.
- Last observed remote state: Setup; dedicated world's module setting enabled. Exact final deployed commit, hashes, and backup location are in ignored `.local/deployment.json` and the PR. Runtime manifest and empty content are unchanged since the UI-tested build.
- Delivery procedure for these notes: commit, clean verify, dry-run/deploy/smoke while in Setup, push, check CI, update PR #2 to ready. On resume reconcile actual Git, receipt, PR, and remote state before repeating any action.
- Next product step after delivery: discuss content/pack scope. Existing `pf1spheres` 0.9.0 has six packs; review overlap before import.
- Deferred to content/release batches: PF1 schema/mechanics validation, content compatibility evidence and manifest claims, actual manifest/ZIP install-update tests, publishing automation.
- No PR merge, release, tag, or stable manifest publication is authorized.
