# Project

## Identity and intent

- Title: Additional Spheres Content.
- Stable module ID / install folder: `additional-spheres-content`.
- Purpose: provide Pathfinder 1e items, feats, and classes from the Spheres of Power Wiki with suitable images, stat changes, and conditional notes.
- Repository: https://github.com/sefaction/spheres-content (public).
- Primary source: http://spheresofpower.wikidot.com/.
- Obsidian hub: vault `Foundry-AI`, `20 - Projects/Personal/Additional Spheres Content.md`.
- Module version policy: semantic versioning; `0.1.0-alpha.5` is an unpublished physical-item review draft.

## Compatibility

Target on 2026-09-19: Foundry VTT v13 build 351, Pathfinder 1e
system `pf1` version 11.11. Both versions were confirmed in the remote UI.
The empty module passed foundation acceptance; see [testing](TESTING.md).
`config/compatibility.json` retains a null content-compatibility profile and
`module.json` has no verified claim. Add versioned evidence validation and manifest
compatibility with the first tested PF1 content batch; shell lifecycle testing
does not establish document or mechanics compatibility.

## Distribution and licensing

Personal use first, with possible sharing. Original tooling and documentation
use MIT. Imported rules and images retain source-specific licenses. The wiki
identifies OGL 1.0a and CC BY-SA 3.0; these are not replaced with a generic
license. The descriptive pilot includes selected Open Game Content and original
generated artwork; it does not copy third-party artwork.
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

Build the complete descriptive catalog of wiki PF1 items, feats and base classes across publishers, with generated images. Include missing Guile skill talents; exclude existing magic/combat spheres and talents. Archetypes are deferred. The initial four-entry pilot established the content pipeline. The current intake contains 6,788 descriptive drafts across five packs; full extraction and review remain unfinished. See SYSTEMATIC_INTAKE.md for coverage, holds and per-entity audit queues. Only after the descriptive collection is complete and reviewed should passive Changes and conditional modifiers be implemented. The companion framework is pf1spheres; the installed/test target is 0.9.0. No world migration or release is included.

Before creating equipment or artwork, inspect existing compendia for suitable
entries, descriptions, images and native behavior. Reuse reviewed entries and
create or adapt missing variants. Kits must use native PF1 containers with
usable contents and reconciled quantities, price and weight. The hunter's kit now implements this structure; see [the reuse audit](KIT_REUSE_AUDIT.md).
The user chose packaged reviewed copies, preserving attribution and permitted
core/system artwork references. Optional source modules are not new dependencies.

Artwork policy: use compact WebP illustrations, normally 256 by 256 pixels with
a 32 KiB budget, preserving readable category folders and meaningful shared icons.
Retain small compatibility PNGs for old imported paths. New bulk drafts use
explicit core placeholders until existing artwork is reviewed or art is generated.

The current coherent review batch adapts the sash, filter scarf and umbrella,
records six rejected namesakes and introduces a physical-item reuse report.
See [the physical-item review](PHYSICAL_ITEM_REVIEW.md). The full descriptive
catalog, artwork and mechanics remain unfinished.
