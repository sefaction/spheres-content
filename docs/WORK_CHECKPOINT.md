# Work checkpoint

Updated: 2026-09-19.

- Active branch: `tooling/bootstrap`.
- Issue: https://github.com/sefaction/spheres-content/issues/1. Draft PR: https://github.com/sefaction/spheres-content/pull/2. Neither merged nor closed.
- Base: user approved seeding instruction-only main. Foundation and SMB deployment changes are on the feature branch.
- Scope: foundation before content/pack planning; zero imported documents or assets.
- Implemented: module shell, deterministic ZIP, official compiler round trip, content/provenance intake gate, Windows SMB staging/swap deployment, module rollback retention, HTTP setup guard, local build/verification/deployment receipts, and CI.
- Local checks: 10 tests and the full local verification gate passed. Windows and Linux CI passed on f04a3d0 after normalizing the Windows fixture TEMP alias. Check the latest documentation commit CI before resuming.
- Obsidian hub: Foundry-AI vault, `20 - Projects/Personal/Additional Spheres Content.md`. No vault commit/push.
- Remote: authenticated SMB works. Core v13 build 351 and PF1 11.11 confirmed in UI and world/system manifests. Dedicated world `additional-spheres-content-test` exists. Private connection details remain in ignored `.local/remote.json` / `.env`; credentials are not stored there.
- Deployed commit: `6b2ad38e5f94e911358ca4d3807732ed834eb103`, version `0.1.0-alpha.1`. Dry run, first installation, and file/hash smoke test passed; 13 files match. No previous module existed, so no backup was needed on first install. Receipt: ignored `.local/deployment.json`.
- UI acceptance: refreshed Setup does not yet discover the module. User authorized restarting only the exact designated Unraid container. Browser access to Unraid hit an untrusted HTTPS certificate; user handoff is pending to handle the warning or perform that restart. No restart by the agent has occurred.
- Next safe step: confirm the user's restart/handoff, inspect module discovery, enable/disable/reload only in the dedicated test world, and check scoped logs. Preserve the original instance and all campaign data. Then update compatibility evidence if acceptance passes.
- Existing related module observed: `pf1spheres` 0.9.0, six packs. Review overlap during the later content plan.
- Remaining scope: remote UI acceptance, version-specific PF1 content validation and content/pack planning. No release/tag/manifest publication is authorized. No PR merge is authorized.
