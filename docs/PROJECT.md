# Project

## Identity and intent

- Title: Additional Spheres Content.
- Stable module ID / install folder: `additional-spheres-content`.
- Purpose: provide Pathfinder 1e items, feats, and classes from the Spheres of Power Wiki with suitable images, stat changes, and conditional notes.
- Repository: https://github.com/sefaction/spheres-content (public).
- Primary source: http://spheresofpower.wikidot.com/.
- Obsidian hub: vault `Foundry-AI`, `20 - Projects/Personal/Additional Spheres Content.md`.
- Module version policy: semantic versioning; `0.1.0-alpha.1` is an unpublished foundation version.

## Compatibility

Target on 2026-09-19: Foundry VTT v13 build 351, Pathfinder 1e
system `pf1` version 11.11. Both versions were confirmed in the remote UI. No module acceptance tests have run. `config/compatibility.json`
separates the target from test evidence; `module.json` has no verified claim.
The tested minimum and verified versions must be set only after acceptance.

## Distribution and licensing

Personal use first, with possible sharing. Original tooling and documentation
use MIT. Imported rules and images retain source-specific licenses. The wiki
identifies OGL 1.0a and CC BY-SA 3.0; these are not replaced with a generic
license. No third-party text or artwork is included in the bootstrap.
See [provenance](CONTENT_PROVENANCE.md).

## Remote testing

The user has an existing remote Foundry instance and authorized creating a
dedicated PF1 test world. Logical profile: `spheres-test` (Windows SMB).
World title: Additional Spheres Content Test; ID:
`additional-spheres-content-test`. Created and confirmed in Setup on 2026-09-19.
The host runs a campaign and is treated as shared. The private address belongs
only in ignored local configuration. Host/container mapping and authenticated SMB
access are verified. The deployment helper stages and retains module-only rollback
copies. Container restart requires separate authorization.

## Current batch

Build the repository foundation before agreeing the content/pack plan. This
batch contains no content scrape, art download, actor migration, public release,
or claim of automated Spheres mechanics. Pack registration and PF1 content
validation remain gated until the next reviewed schema/content batch.
