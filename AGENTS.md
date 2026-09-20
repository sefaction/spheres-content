# Pathfinder 1e Foundry Module Project Instructions

This repository contains a Foundry Virtual Tabletop module whose primary deliverable is packaged Pathfinder 1e compendium content.

## Project constants

During repository bootstrap, record the following values in `docs/PROJECT.md` and keep that file current:

- Module title and one-sentence purpose.
- Stable module ID. Use lowercase letters, numbers, and hyphens only.
- GitHub repository URL.
- Obsidian project-hub path.
- Supported Foundry VTT and Pathfinder 1e system versions.
- Remote test-server profile and dedicated test-world name.
- Content licenses, permissions, and intended distribution model.

Do not guess a missing project constant. Ask the user when it affects architecture, licensing, compatibility, deployment, or release behavior.

## Sources of truth

Use these authorities in this order:

1. Version-controlled source content, code, tests, and documentation in this repository define what the module contains.
2. `module.json` defines package identity, dependencies, version, compatibility, and release URLs.
3. GitHub issues and pull requests define live development status.
4. The Obsidian project hub records durable context: product intent, content scope, source research, decisions, architecture, milestones, and roadmap.
5. The installed copy on the remote Foundry server is a disposable test build, never the source of truth.

Generated packs, `dist/`, release ZIP files, and files copied from the remote server must not become the canonical editing source.

## Start-of-work workflow

At the beginning of work in this repository:

1. Read `docs/PROJECT.md`, this file, and `CODEX.md`.
2. Read `docs/WORK_CHECKPOINT.md` when it exists and reconcile it with the actual branch, worktree, GitHub issues and pull requests, and remote test state.
3. Read the Obsidian project hub identified by `docs/PROJECT.md`. Follow only the links relevant to the current batch.
4. Inspect `module.json`, the content-source directories, package scripts, and current test configuration.
5. Check the current branch and worktree before editing. Preserve unrelated user changes.
6. Reconcile historical notes with GitHub. GitHub issues and pull requests are authoritative for live status.

If Obsidian is unavailable, continue with repository and GitHub context and report that the project notes could not be accessed.

## Obsidian knowledge workflow

- Refer to this product as the **Foundry VTT module** and to the notes system as **Obsidian**. Do not call the Obsidian workflow “Foundry.”
- Use the Obsidian hub as a project wiki, not as a second issue tracker.
- Record durable knowledge: scope decisions, content interpretations, source and licensing research, schema decisions, compatibility policy, release milestones, and operational changes.
- Keep temporary implementation details, task lists, stack traces, and code-specific instructions in the repository, GitHub issues, or pull requests.
- Link Obsidian decisions to the relevant issue or pull request when practical.
- Never store credentials, private keys, tokens, license keys, passwords, private server URLs, or other secrets in Obsidian.

## GitHub change-delivery workflow

When the user proposes a change:

1. Ask brief, focused questions only when a consequential requirement is unclear.
2. Create or use a GitHub issue for work that should be tracked beyond the current conversation. Check for duplicates first.
3. Work on a feature branch, not directly on `main`.
4. Make one coherent batch at a time. Update canonical content sources rather than generated pack files.
5. Build and validate the installable module.
6. Deploy the branch build to the designated remote Foundry test environment and perform the relevant smoke tests.
7. Push the branch and open one pull request per coherent batch without waiting for approval. Include the issue, scope, validation results, remote test result, and any compatibility or migration notes.
8. Continue other authorized work while pull requests await review, keeping `docs/WORK_CHECKPOINT.md` resumable.
9. Merge each pull request into `main` only after the user explicitly approves that individual pull request.
10. Close related issues only after the resolving pull request has merged, with a link to the pull request.

Opening a pull request, approving another pull request, approving a remote test build, or saying that a change “looks good” outside the pull-request context is not merge approval for that pull request.

Creating a tag, publishing a GitHub release, changing the stable manifest, or submitting/updating the package in Foundry's package directory requires separate explicit user approval.

## Content architecture and pack integrity

- Before creating an item or generating its image, search existing compendia for the item and each component, including alternate spellings and names. Inspect the matching rules/version, native type, name, description (including superficial/unidentified fields), image quality, quantities, and existing behavior. Reuse a suitable existing record; create or improve only missing or inadequate content. Record the selected source UUID, package version, provenance, and reuse decision.
- Represent kits and other collections of physical objects as native PF1 containers with separately usable contents where the rules describe a container. Reuse existing component items where suitable, preserve quantities, and check empty-container versus contents price and weight to prevent double counting. Do not assume an existing record has the correct type merely because its name matches.
- Keep human-reviewable canonical content under the source layout documented in `docs/CONTENT_PIPELINE.md` (normally `src/packs/`).
- Build Foundry-readable compendium packs deterministically from those sources.
- Never hand-edit generated LevelDB files, release archives, or installed remote packs.
- Never treat an export from a test world as authoritative until it has been normalized into the canonical source format and reviewed as a source change.
- Preserve stable document IDs, pack names, folder IDs, and source keys. Do not regenerate IDs merely because an entry was edited or moved.
- Treat UUIDs, embedded document links, image paths, references, and relationships as tested data. Validate them before deployment and again inside Foundry.
- Keep the module ID and module folder name identical.
- Keep `module.json` at the root of the installable module and at the root of the release archive.
- Declare the Pathfinder 1e system relationship using the system ID `pf1`.
- Claim compatibility only for Foundry and PF1 versions actually tested. Do not advance `compatibility.verified` based solely on an assumption or a successful build.
- When a Foundry or PF1 schema changes, use an explicit migration or rebuild plan. Never silently rewrite user-world data.
- Imported world copies and module compendium documents are different objects. Document whether an update affects only compendia or also performs an intentional world migration.

For every changed pack, validation should cover as applicable:

- Valid source and generated schemas.
- Unique, stable document IDs and source keys.
- Expected document and folder counts.
- Required PF1 fields and item types.
- Resolvable UUIDs and embedded links.
- Existing image, icon, and other asset paths.
- No unexpected generated-file drift after a clean rebuild.
- Representative documents opening correctly in the supported PF1 system.
- Representative items dragging to an actor and behaving as intended.

## Content rights and provenance

- Maintain `docs/CONTENT_PROVENANCE.md` as the inventory of sources, licenses, permissions, attribution requirements, and distribution restrictions.
- Store required license texts in `LICENSES/` and keep public attribution files current.
- Record the source and license status of each imported content collection before adding it to a distributable pack.
- Do not commit copyrighted rules text, artwork, maps, tokens, fonts, or other assets unless the repository has permission to distribute them.
- Do not assume that compatibility with Pathfinder 1e makes third-party Pathfinder material open content.
- Keep purchased source files, private exports, scans, OCR inputs, and other non-redistributable materials out of Git and release artifacts.
- When rights are unclear, stop distribution work on the affected content and ask the user. Other independent work may continue.

## Remote Foundry test environment

Treat the remote host as shared or production-adjacent unless `docs/REMOTE_TESTING.md` explicitly identifies it as a disposable development instance.

- Deploy only to the exact test module directory and test world recorded in the local configuration.
- Use a dedicated PF1 test world. Do not enable development builds in an active campaign world.
- Do not use the remote installed module as an editing surface.
- Do not modify `Data/worlds`, `Data/systems`, unrelated modules, reverse proxies, containers, services, firewall rules, or host configuration as part of a normal module deployment.
- Do not restart Foundry or its host unless the designated workflow requires it and the user has authorized that scope.
- Before replacing an installed test build, make a recoverable backup of that module directory or use the repository's atomic staging-and-swap deployment script.
- Validate all remote path variables before a copy, sync, move, or cleanup. Refuse empty paths, root paths, user-home paths, and unresolved variables.
- A deployment helper must provide a dry-run mode and must not use broad destructive synchronization flags against an unverified target.
- Store connection details in ignored local configuration and standard SSH configuration. Never commit credentials or print secrets in logs.
- Keep test worlds and backups out of the public repository.

If the remote target is not clearly a dedicated development target, stop before deployment and ask the user to identify the safe module path and world.

## Remote acceptance testing

Test the branch build in a clean or controlled PF1 world with only declared dependencies enabled. As relevant to the change:

- Confirm Foundry recognizes, enables, disables, and reloads the module without errors.
- Confirm every expected compendium appears with the intended ownership and visibility.
- Open representative entries from every changed document type.
- Exercise links, images, folders, search, drag-and-drop, sheets, rolls, and PF1 calculations affected by the content.
- Test both a Gamemaster and a non-Gamemaster user when permissions or visibility matter.
- Check browser console output and server logs for new warnings or errors.
- For release work, test installation or update through the actual manifest and ZIP artifact rather than only a direct folder deployment.
- For schema or ID changes, test from the previous released version as well as a clean install.

Record the tested Foundry version, PF1 version, module version/commit, world, steps, and result in the pull request.

## Release workflow

- Use semantic versioning unless `docs/PROJECT.md` records another policy.
- Keep `module.json`, the changelog, Git tag, release title, ZIP filename, and download URL consistent.
- GitHub Actions should validate and build from a clean checkout, then attach the installable ZIP and matching `module.json` to the release.
- The stable manifest URL must remain stable across releases. The manifest's `download` value must point to the ZIP for that exact version.
- Build archives from version-controlled sources; do not zip the installed remote module directory.
- Run release validation and install the produced artifact in the remote test environment before publication approval.
- Never include development configuration, source books, private notes, test worlds, backups, credentials, or unrelated files in the archive.
- Do not publish a release from a dirty worktree or an unreviewed commit.

## Autonomous and resumable work

- Keep `docs/WORK_CHECKPOINT.md` current with the active branch, related issues and pull requests, scope, completed and pending checks, deployed commit, remote test state, unanswered questions, and next safe step.
- After interruption or context loss, reconcile the checkpoint with Git, GitHub, the build output, and the remote test installation. Never assume an interrupted build, transfer, restart, test, push, or release completed.
- Catalogue discovered bugs and content defects as GitHub issues after checking for duplicates.
- Ask when a blocked choice is consequential. Continue independent authorized tasks rather than guessing the decision.
- After assigned tasks, look for broken links, schema drift, missing provenance, release-pipeline gaps, and obvious compendium usability problems. Suggest larger additions rather than silently expanding scope.

## GitHub authentication

- Use the normal GitHub CLI browser flow: `gh auth login -h github.com -p https -w`.
- Complete authorization in the browser, then verify it with `gh auth status` before pushing.
- The CLI process may remain open after browser authorization succeeds; trust the follow-up status check rather than recording or handling tokens directly.

## Safety boundaries

- The user has authorized work in this repository and deployment to the designated remote **test** module target. This is not blanket authorization for campaign worlds, unrelated modules, the Foundry system installation, host services, production infrastructure, or public releases.
- Do not delete or overwrite world data, server backups, compendium source data, or release assets without explicit approval and a verified recovery path.
- Do not change stable document IDs casually. Treat ID changes as migrations with link-impact analysis.
- Do not force-push shared branches, rewrite published tags, or replace published release assets without explicit approval.
- Never expose secrets in commits, issues, pull requests, Obsidian, command output, or screenshots.
