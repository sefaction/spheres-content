# Content provenance

Research recorded 2026-09-19. This inventory records evidence and unresolved
questions, not a blanket rights clearance for every wiki page or image.

| Collection                                | Source                                           | Rights evidence                                                                        | Import status            |
| ----------------------------------------- | ------------------------------------------------ | -------------------------------------------------------------------------------------- | ------------------------ |
| Original tooling/docs                     | This repository                                  | MIT, scoped in LICENSE                                                                 | Included                 |
| Pathfinder rules on Spheres of Power Wiki | http://spheresofpower.wikidot.com/               | Wiki identifies OGL 1.0a; source collection designations and notices still need review | See selected pilot below |
| Other wiki material                       | https://spheresofpower.wikidot.com/legal%3Astart | Wiki identifies CC BY-SA 3.0 for material outside OGL                                  | Not imported             |
| Images/icons                              | Four project-generated pilot images              | Prompts, hashes and scoped MIT declaration in config/content.json                      | Not imported             |

## Primary research

- [Wiki legal and OGL page](https://spheresofpower.wikidot.com/legal%3Astart): identifies the site's license categories and copyright notices.
- [Wiki about page](https://spheresofpower.wikidot.com/about): describes its source-submission requirements, including product-specific open-content and product-identity designations.
- [Other Options](https://spheresofpower.wikidot.com/other-options): demonstrates that the site includes multiple publishers beyond the Spheres families.
- [Errata log](https://spheresofpower.wikidot.com/errata-log): relevant to choosing current versus legacy entries.

## Before importing each collection

Record collection key, publisher, book/source title, source URL, retrieval/revision
date, license, relevant designations, required notices, attribution, and any
restrictions. Add applicable license texts under `LICENSES/` and update public
attribution before packaging. Keep artwork review separate from rules review.

The public repository must not receive purchased books, scans, raw private exports,
unreviewed scraped content, or assets lacking distribution rights. Personal-use
intent does not change the public repository's visibility.

## Selected descriptive pilot

The four source sections listed in `config/identities.json` are the only imported
rules in `0.1.0-alpha.2`: Extra Magic Talent and Incanter (Ultimate tab), Kit,
Lycanthrope Hunter's (current Equipment section), and Favorite Tools (Artifice,
Spheres of Guile). Their applicable non-Product-Identity rules are covered by
the wiki's Open Game Content declaration. Selected sections include game rules,
not copied artwork, maps, named setting characters or setting narrative.

Retain the complete wiki-published OGL-1.0a text and copyright notice list under
`LICENSES/OGL-1.0a-and-Wiki-Notices.txt`. This includes Ultimate Spheres of Power,
Spheres of Guile, the wiki, and contributing source notices. Source-page snapshot
hashes and exact URLs are attached to each canonical document. The Equipment
page does not identify a book beside this kit; provenance is the wiki's selected
open-rules section and complete notice list, not an invented book attribution.
This review does not clear every linked source collection or any wiki artwork.

Four project-generated images use the scoped MIT license to the extent rights
are held. They were generated without source images. Prompts, tool identification,
paths and SHA-256 hashes are in `config/content.json`. Art reuse is permitted by
the user's direction when appropriate to closely related entities.

## Compendium reuse audit

The user requested existing compendium entries and artwork be evaluated before
creating replacements. The [hunter's kit audit](KIT_REUSE_AUDIT.md) records
candidate UUIDs, installed versions and snapshot hashes for PF1 11.11 and
Pathfinder 1e Content 11.4.0. Four normalized component records are now contained in the kit source. Raw
snapshots remain ignored; no upstream image bytes are distributed.

Installed packages include GPL and OGL license texts. Review the selected
record's applicable terms and attribution before packaging a copy; do not
relicense it as original MIT work. Selected image paths point to core or PF1
assets, which can be referenced separately from any proposal to redistribute
their bytes. The user authorized reviewed packaged copies. PF1 game content is identified
as OGL on its official package page (https://foundryvtt.com/packages/pf1).
Selected equipment rules retain OGL notices from PF1 Content plus the existing
wiki notice list, which includes Animal Archive. GPL-3.0 is retained for upstream
record-format contributions; adapted human-reviewable kit JSON ships under
`sources/items/` as corresponding source. No upstream program code is included.

## Systematic descriptive intake (alpha.4)

`config/intake-sources.json` scopes exact cached page hashes and permitted entity
kinds for the bulk rules intake. These are selected PF1 rule sections under the
wiki declaration of applicable non-Product-Identity Open Game Content, not
permission to republish whole pages or artwork. The existing complete wiki OGL
notice list is retained. Pages or changed snapshots outside that inventory are
held for rights review. Legacy, ambiguous and unsupported entries have additional
independent intake holds. Book and publisher citations are not invented: native
`system.sources` names the wiki and the specific source link.

Every new entry is a descriptive draft whose extraction and mechanics still
need auditing. A rights-scope decision does not mark its image, settings, links
or rules interpretation complete. Generated pilot artwork is preserved. New
entries use explicitly unfinished core icon references until artwork/reuse
review; no wiki artwork bytes are copied. Existing compendium matches remain
recorded for full suitability review before replacing the draft with a reviewed
copy. No optional module artwork is redistributed.

Empty equipment/consumable/loot field profiles are derived from installed PF1
11.11 template data. Preserve the existing upstream OGL/GPL notices for adapted
record data; no upstream program code is copied. Human-reviewable physical item
sources and the empty profiles accompany the installed module under `sources/`.

## Reviewed mundane gear (alpha.5)

The three selected PF1 Content 11.4.0 adaptations are individually documented in
[the physical-item audit](PHYSICAL_ITEM_REVIEW.md) and
`config/physical-item-reviews.json`. Their source UUIDs, hashes, book/page metadata
and candidate decisions are retained. The source scope is registered separately
as `pf1-reviewed-mundane-gear`; the primary wiki provenance remains unchanged.
Existing full notices cover Adventurer's Armory 2, Adventurer's Guide and Ultimate
Equipment. Retain OGL-1.0a and GPL-3.0 record-format notices and adapted JSON source.
No named-setting material from rejected Brazen Head or other false matches is
copied. The scarf references an inspected core image. Two original images are
generated without source images and recorded under the existing scoped MIT terms.
