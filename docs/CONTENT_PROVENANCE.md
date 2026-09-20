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
