# Codex local and remote workflow

This project is a content-first Foundry Virtual Tabletop module for the Pathfinder 1e system (`pf1`). Git is the development source of truth; a designated remote Foundry server is used for integration and acceptance testing.

## Bootstrap status

`docs/PROJECT.md` must define the module title, stable module ID, repository URL, target Foundry/PF1 versions, Obsidian hub, remote test profile, test world, and licensing model.

This file defines the intended repository contract. During initial bootstrap, create the scripts and documentation described here in a dedicated setup pull request. Until a named script exists, do not claim it ran and do not substitute an unsafe ad hoc remote command merely to bypass the missing automation.

## Expected repository layout

```text
module.json                     Package manifest source
package.json                    Reproducible build and validation commands
src/packs/                      Canonical human-reviewable compendium sources
src/scripts/                    Module code, migrations, or hooks when needed
src/styles/                     Module styles when needed
src/templates/                  Foundry templates when needed
static/                         Redistributable images and other static assets
LICENSES/                       Required license texts
docs/                           Project, pipeline, testing, and provenance docs
scripts/                        Build, validation, deployment, and release helpers
tests/                          Content, manifest, reference, and behavior tests
dist/                           Generated installable module; never hand-edit
.github/workflows/              Pull-request CI and approved release automation
```

The exact canonical content format may be JSON, YAML, or another reviewed format, but it must be documented in `docs/CONTENT_PIPELINE.md` and compile deterministically into Foundry-readable packs.

## Required project scripts

The bootstrap pull request should expose these stable commands through `package.json`:

- `npm.cmd run clean` — remove only known generated project output.
- `npm.cmd run format:check` — check formatting without rewriting files.
- `npm.cmd run lint` — run code and data linting.
- `npm.cmd test` — run automated unit/content tests.
- `npm.cmd run validate:manifest` — validate `module.json`, URLs, versions, and package relationships.
- `npm.cmd run validate:content` — validate source documents, schemas, IDs, pack counts, and required PF1 fields.
- `npm.cmd run validate:references` — find broken UUIDs, embedded links, and missing assets.
- `npm.cmd run build:packs` — compile canonical sources into generated compendium packs.
- `npm.cmd run build` — produce a clean installable module under `dist/`.
- `npm.cmd run verify` — run the full local gate: clean build, formatting, lint, tests, manifest/content/reference validation, and archive checks.
- `npm.cmd run deploy:remote -- --dry-run` — show the exact remote test deployment without changing it.
- `npm.cmd run deploy:remote` — deploy `dist/` only to the designated test module target.
- `npm.cmd run smoke:remote` — perform non-destructive remote availability and package checks that can be automated.
- `npm.cmd run release:check` — verify a proposed version and archive without publishing it.

If the project adopts a different runtime or command names, update this file and CI in the same pull request. CI and developer commands must call the same underlying validators.

## Standard local workflow

From Windows PowerShell or Command Prompt:

```powershell
npm.cmd ci
npm.cmd run verify
npm.cmd run deploy:remote -- --dry-run
npm.cmd run deploy:remote
npm.cmd run smoke:remote
```

Use the smallest relevant checks while iterating, then run `npm.cmd run verify` before pushing a completed batch.

## Branch and pull-request workflow

1. Start from an up-to-date `main` with a clean worktree.
2. Create a focused branch such as `content/<topic>`, `fix/<topic>`, `tooling/<topic>`, or `docs/<topic>`.
3. Update canonical sources and tests together.
4. Build and run the full local verification gate.
5. Deploy that exact commit's clean build to the remote test target.
6. Complete the relevant Foundry smoke tests and record the environment and result.
7. Commit, push, and open one pull request for the coherent batch. Link its issue and note any dependencies on other pull requests.
8. Keep the remote review build and `docs/WORK_CHECKPOINT.md` aligned with the commit under review.
9. Wait for explicit approval of that individual pull request before merging it to `main`.

Do not mix routine content additions, schema migrations, build-system changes, and broad ID rewrites in one pull request unless they are inseparable and the dependency is explained.

## Editing compendium content

1. Locate the canonical source entry under `src/packs/`; do not edit `dist/`, generated pack databases, or the installed remote copy.
2. Preserve its document ID and stable source key unless the task is an approved migration.
3. Update source/provenance metadata when the origin, license, attribution, or interpretation changes.
4. Add or update tests for required fields, references, calculations, and expected document counts.
5. Run the relevant content and reference validators.
6. Rebuild twice when checking determinism; the second clean build should produce no unexplained content drift.
7. Deploy and inspect representative documents inside the supported PF1 environment.

If a document is first authored or corrected inside Foundry, export it through the repository's supported unpack/export tool, normalize the result into canonical source, review the diff, rebuild, and redeploy. Never commit raw test-world databases as the shortcut.

## Manifest rules

`module.json` must satisfy all of the following:

- `id` exactly matches the installed module folder name.
- `title`, `description`, and `authors` accurately identify the package and its maintainers.
- `version` matches the proposed semantic version.
- `compatibility.minimum` and `compatibility.verified` reflect actual test coverage. Add `maximum` only when intentionally blocking a known-incompatible Foundry version.
- `relationships.systems` declares Pathfinder 1e with ID `pf1` and an accurate compatibility policy.
- Every pack name and path matches generated output.
- Repository, bugs, readme, changelog, license, stable manifest, and download URLs are correct for the distribution model.
- `download` points to the ZIP for the exact manifest version, not an unrelated branch archive.
- Development-only settings and remote details are absent.

The installable ZIP must open directly to `module.json` and the module's other files. Do not introduce an extra parent directory inside the archive.

## Local remote-profile configuration

Commit a safe `.env.example` containing names and non-secret examples only. Keep actual values in ignored local configuration. The deployment tooling should require equivalents of:

```text
FVTT_SSH_HOST=<SSH config alias>
FVTT_REMOTE_DATA_PATH=<absolute Foundry user-data path>
FVTT_MODULE_ID=<exact module id>
FVTT_REMOTE_URL=<test instance URL>
FVTT_TEST_WORLD=<dedicated PF1 test world>
```

Prefer an SSH config alias and key-based authentication. Do not put passwords or private-key contents in environment files. Do not echo sensitive environment values.

For the configured Unraid host, use the Windows SMB adapter instead of SSH.
Its equivalent profile is documented in `docs/REMOTE_TESTING.md` and
`config/remote.example.json`; actual values live in ignored `.local/remote.json`.
It uses the existing Windows SMB session without handling credentials. The
dry run prints a logical target rather than a private address. Retention is
bounded by refusing additional replacements at five backups, never by deleting
backups without approval. A clean committed `npm.cmd run verify` is required
immediately before deployment; a standalone build invalidates the verification receipt.

`docs/REMOTE_TESTING.md` should describe the safe logical target without secrets: hosting model, whether the instance is disposable or shared, allowed module path, test-world purpose, how logs are viewed, whether a restart is permitted, and the rollback procedure.

## Remote deployment contract

The deployment script must:

1. Require a successful clean build and refuse a dirty or missing `dist/` unless an explicit development override is documented.
2. Read and validate the module ID, SSH host alias, Foundry data path, and test world.
3. Reject blank values and dangerous targets including `/`, a drive root, a home directory, the Foundry data root itself, `Data/worlds`, and `Data/systems`.
4. Resolve the final target to exactly `<remote-data-path>/Data/modules/<module-id>`.
5. Offer a dry run that prints the host alias, resolved module target, source commit, and files that would change without exposing secrets.
6. Upload to a module-specific staging directory, validate the staged `module.json`, then replace only the designated test module directory.
7. Retain a timestamped, bounded rollback copy when replacing an existing test build.
8. Never use a delete-capable sync against an unverified or broader path.
9. Record the deployed commit and build version locally for `docs/WORK_CHECKPOINT.md` and pull-request reporting.
10. Leave worlds, systems, other modules, server configuration, containers, and services unchanged.

If a Foundry restart is necessary for a manifest or new package to be recognized, use only the documented test-instance procedure. Do not restart a shared or production service without explicit authorization.

## Remote Foundry review workflow

After deployment:

1. Confirm the server is reachable and the intended Foundry and PF1 versions match the support matrix.
2. Use the dedicated PF1 test world, with only the module and declared dependencies enabled for the baseline test.
3. Confirm the module enables without a compatibility warning that contradicts the support policy.
4. Confirm expected packs, folders, ownership, and document counts.
5. Open representative entries from every changed pack and document type.
6. Test embedded links, images, search, drag-and-drop, PF1 sheets, and rolls or calculations affected by the content.
7. Test a non-Gamemaster user when visibility, permissions, or player-facing text changed.
8. Inspect browser console output and the relevant server logs for new errors or warnings.
9. Record Foundry version, PF1 version, module version and commit, test world, exact checks, and result in the pull request.

For compatibility testing with a normal module collection, use a separate compatibility world after the minimal baseline passes. A failure found only with another module must identify the other module and version.

## Local verification gate

Before deploying or opening a pull request, `npm.cmd run verify` should establish:

- A clean checkout can install dependencies and build.
- Formatting and linting pass.
- The manifest is valid and its module ID, paths, versions, and relationships agree with the build.
- Canonical content passes schemas and PF1-specific validation.
- Document IDs and stable source keys are unique and have not changed unexpectedly.
- Pack names, folder references, UUIDs, embedded links, and asset paths resolve.
- A clean rebuild is deterministic.
- `dist/` contains only intended redistributable files.
- The release ZIP has `module.json` at its root and can be unpacked safely.
- No secrets, local configuration, test worlds, backups, source books, or private notes appear in build output.

When a check cannot be automated yet, list the manual check in `docs/TESTING.md` and in the pull request. Do not describe an unperformed manual check as passing.

## GitHub Actions

Pull-request CI should:

- Use a clean checkout and locked dependencies.
- Run the same full verification gate used locally.
- Build the installable ZIP as a review artifact when useful.
- Fail on manifest/content/reference errors or unexplained generated drift.
- Avoid deployment and avoid access to production or remote-test credentials for untrusted pull requests.

The release workflow should run only for an explicitly approved version/tag process, build from that exact tag, rerun verification, and attach:

- `<module-id>.zip`
- `module.json`
- Generated checksums when the project adopts them

Do not create a public release merely because CI passes.

## Release workflow

1. Confirm the intended pull requests are merged and `main` is clean.
2. Choose the version and update `module.json`, changelog, and any versioned download URL together.
3. Run `npm.cmd ci`, `npm.cmd run verify`, and `npm.cmd run release:check`.
4. Build the release candidate from the exact commit intended for the tag.
5. Deploy the release candidate artifact to the remote test instance and perform clean-install and, when relevant, previous-version update tests.
6. Present the proposed tag, changelog, manifest URL, ZIP name, compatibility claims, and test results to the user.
7. Create and push the tag and publish the GitHub release only after explicit release approval.
8. Verify the published manifest and ZIP assets are publicly reachable and mutually consistent.
9. Install or update from the published manifest in the remote test environment.
10. Update the Obsidian milestone and close the release issue after verification.

Never rewrite a published tag or silently replace a published version. Correct a bad release with a new version unless the user explicitly chooses another supported recovery method.

## Troubleshooting order

When the module or content does not appear correctly:

1. Confirm the deployed commit and module version.
2. Validate the remote folder name and `module.json` location.
3. Confirm Foundry and PF1 versions against the support matrix.
4. Check whether Foundry requires a safe test-instance restart after a manifest change.
5. Check module enablement and declared dependencies in the test world.
6. Inspect browser console output and scoped Foundry logs.
7. Compare remote files with the clean `dist/` build without copying remote files back over source.
8. Reproduce in the minimal test world before investigating third-party conflicts.
9. Roll back only the designated module directory if the new build is unsafe.

## Important safety rules

- Remote deployment authorization is limited to the documented test module directory and test world.
- Do not modify, reset, restore, or delete campaign worlds unless the exact target and recovery plan are explicitly approved.
- Do not edit or replace the PF1 system installation as part of module work.
- Do not delete unrelated modules, containers, volumes, services, or host files.
- Do not run broad recursive deletion or synchronization against an unresolved remote path.
- Do not change stable content IDs without an approved migration and broken-link analysis.
- Do not push directly to `main`, force-push shared branches, merge without explicit per-PR approval, or publish without explicit release approval.
- Keep scripts that run on Linux with LF line endings.
- Keep credentials and private content out of Git, Obsidian, logs, issues, pull requests, and release artifacts.
