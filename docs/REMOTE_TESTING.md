# Remote testing

## Target and authorization

Profile `spheres-test`: a shared Foundry instance in an Unraid Docker container.
Foundry v13 build 351 and PF1 11.11 were verified in UI and the dedicated world
manifest. The user authorized module deployment and creation of
`additional-spheres-content-test` (Additional Spheres Content Test).

The module target is exactly `<configured-data>/Data/modules/additional-spheres-content`.
World and system manifests are read only as identity/version markers. Their
contents are never written by deployment. Existing campaigns and other instances
remain outside this target. The user separately authorized one restart of the
designated test container for initial package discovery; it completed on
2026-09-19. This does not authorize other containers or host services.

## Configuration

Windows SMB access is established using the user-provided share account. The
helper uses that existing Windows session; it does not accept or store passwords.
Copy `config/remote.example.json` to ignored `.local/remote.json` and configure
the verified UNC user-data path, exact module path, instance origin, and test world.
Private host/container mappings and the address stay in ignored local config.
The HTTP origin and SMB share must identify the same host.

This SMB profile supersedes the SSH-oriented `.env.example` for this host.
SSH deployment is not implemented. Linux CI exercises local fixture tests only;
it never connects to the share or uses remote credentials.

## Deployment

1. Commit the reviewed sources, then run `npm.cmd run verify`. Verification records the commit, archive hash, and worktree state in `.build/verified.json`.
2. Leave the instance in Setup. The helper rejects a join/game route and rechecks immediately before replacement. Coordinate exclusive test use to avoid a world launch racing the swap.
3. Run `npm.cmd run deploy:remote -- --dry-run`. It verifies the world/system markers, resolved paths, clean source/build identity, archive, and exact output bytes, then lists changed files without writing remotely.
4. Run `npm.cmd run deploy:remote`. It stages only verified files under `<configured-data>/Data/.additional-spheres-content-deploy`, checks hashes and module identity, then renames the staged directory into the exact module target.
5. Run `npm.cmd run smoke:remote`, followed by the Foundry UI acceptance checks. A file deployment alone does not prove Foundry has discovered or enabled the module.
6. After Foundry has opened the packs, return to Setup and run `npm.cmd run smoke:remote -- --semantic`. This verifies all non-pack bytes against the deployment receipt and all pack documents against canonical sources at the deployed commit. It rejects unexpected database files, copies each database to ignored local audit storage, checks that the source stayed unchanged during the copy/audit, and opens only the local copy. Operational LevelDB metadata may differ; rule text, IDs, fields, and document counts may not. No remote export becomes canonical source.

Actual private paths are validated and recorded locally. Console output uses the
logical target, keeping private server details out of PR logs. No broad sync,
recursive remote deletion, container management, or world-data write occurs.

## Backup and rollback

Before replacement, the existing module directory moves to a uniquely named
`backup-*` directory in the module-specific operations directory. If moving the
staged build into place fails, the helper restores that backup. This is a staged
two-rename swap, with a brief gap between renames; it is not one atomic operation.
The helper detects concurrent deployments with an exclusive lock file.

Backups and failed staging directories are retained. At five backups, another
deployment is refused until retention is reviewed; no backup is automatically
deleted. A successful deployment writes an ignored `.local/deployment.json`
receipt with commit, version, hashes, and the rollback directory when applicable.

If the process dies mid-transfer or rollback itself fails, reconcile the lock,
stage, target, and backup before retrying. For a post-install rollback, return to
Setup and review the receipt's exact backup and target; obtain approval for the
specific restore before moving existing files. Do not delete campaigns or broader
directories to recover a module deployment.

## Acceptance

Confirm module discovery, enable/disable/reload, supported versions, pack counts,
representative content behavior, permissions, and browser/server logs. This
pilot contains four packs with one entry each. Logs are read through the same share's `Logs`
directory, scoped to the deployment time and module identity; keep private log
content out of public reports. Record content evidence in PR #4 and the checkpoint; PR #2 holds foundation evidence.

If Foundry needs a container restart to discover the new package, stop and obtain
authorization for that exact container; the deployment helper never restarts it.

The initial authorized restart automatically launched an existing campaign because
of the container's startup configuration. With no connected players, the instance
was returned to Setup and the dedicated test world launched for acceptance. Do not
change startup configuration or test inside that campaign. Account for this behavior
before future restarts. The instance was returned to Setup after foundation tests.
