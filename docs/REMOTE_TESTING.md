# Remote testing

## Current state

Existing shared Foundry instance, hosted in Docker on Unraid. Browser reachability and core v13 build 351
confirmed; PF1 11.11 confirmed in Setup. After the user corrected the intended
instance, returned to Setup and created the authorized dedicated PF1 test world.
Server left in Setup. The initially supplied instance was not changed.
No module deployment has occurred.

- Logical profile: `spheres-test`, pending configuration.
- Created world: Additional Spheres Content Test (`additional-spheres-content-test`).
- Module folder: `additional-spheres-content` only.
- Exact Foundry user-data path and file-transfer access: unknown.
- Private instance address: ignored local configuration only.
- Host/service restart: not authorized.
- Campaign world shutdown to reach Setup: ask before interrupting the active world.

## Why the remote commands stop

`deploy:remote` (including `--dry-run`) and `smoke:remote` intentionally return a
nonzero exit code before any network call or mutation. They are prerequisite gates,
not an implemented deployment adapter. A Foundry setup login alone does not
establish SSH access or the safe filesystem target.

## Required deployment implementation

After host access and paths are established, implement the documented staging and
swap adapter with validated absolute targets, exact module-folder checks, clean
build/commit verification, a real dry run, timestamped rollback backup, bounded
retention, and a local deployment receipt. Establish how to avoid replacing
LevelDB packs while Foundry has them open. Keep remote secrets in ignored config
and standard SSH configuration, never documentation or CI.

User-authorized test-world creation through the Foundry UI is a specific exception
to the ordinary prohibition on writing world data. It does not authorize copying,
deleting, or editing any existing campaign world.

## Acceptance and rollback

Use only the dedicated PF1 world, module, and declared dependencies. Record core
and system versions, exact commit/version, enable/disable/reload results, packs,
representative sheets, drag/drop, formulas, UUIDs, images, console warnings, and
scoped server-log results. Test player permissions when content visibility matters.

Rollback is not configured. Before the first replacement, document and verify a
recoverable module-only backup. Do not invent an ad hoc remote deletion or restart
command to work around missing deployment automation.
