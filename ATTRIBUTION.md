# Attribution

Original tooling, documentation, and project-generated artwork: sefaction, MIT
license to the extent rights are held (see LICENSE). Artwork was generated using
the built-in image_gen tool without copying wiki artwork; prompts and image
hashes are recorded in `config/content.json`.

Rules source: [Spheres of Power Wiki](http://spheresofpower.wikidot.com/), under
the site's applicable Open Game Content designation. The initial pilot includes
Extra Magic Talent and Incanter (Ultimate rules), Kit, Lycanthrope Hunter's,
and Favorite Tools (Artifice skill talent). Source links and snapshot hashes are
attached to each document. The complete published OGL-1.0a text and copyright
notice list are retained in `LICENSES/OGL-1.0a-and-Wiki-Notices.txt`.

These imported rules and their adaptations remain Open Game Content under
OGL-1.0a. The original-tooling/artwork MIT license does not replace that license.
No third-party artwork is copied. This is an independent project; no publisher
endorsement is claimed. Other wiki collections remain subject to separate review.

Before importing material, record the collection's rights and required notices
in `docs/CONTENT_PROVENANCE.md`, `config/content.json`, and `LICENSES/`.
The original-tooling MIT license does not replace any source-content license.

## Reused kit components (2026-09-20)

Wolfsbane and the base dagger are adapted from the Pathfinder 1 system 11.11
(https://gitlab.com/foundryvtt_pathfinder1e/foundryvtt-pathfinder1).
Weapon Blanch (Silver) and Deodorizing Agent (Vial) are adapted from
Pathfinder 1e Content 11.4.0
(https://gitlab.com/foundryvtt_pathfinder1e/pf1-content), with credit to its
maintainers and contributors. Original rules are by Paizo and the credited
authors of Adventurer's Armory, Core Rulebook, Ultimate Equipment and Animal
Archive. Source UUIDs, versions, book/page references and hashes accompany the
contained records.

The adapted rules remain Open Game Content under OGL-1.0a. Retain both
`LICENSES/OGL-1.0a-PF1-Content.txt` and the wiki notices, including Animal Archive.
The upstream GPL-3.0 notice is retained in `LICENSES/GPL-3.0.txt` for record-format
contributions; these are not relicensed as original MIT work. The human-reviewable
adapted kit JSON is included in the installable archive at `sources/items/`.

Changes: normalized embedded identities and metadata, kit quantities, removed an
orphan heading, adapted the dagger to alchemical silver, preserved native dagger
actions and added attribution. The outer container uses the wiki description
and project-generated art; its empty price/weight follow the audited waist-pouch
interpretation. No upstream program code is copied.

Contained artwork uses existing Foundry core or PF1 image paths. No upstream
image bytes are redistributed, and their licenses are not changed.

## Descriptive intake catalog

Additional PF1 feat, base-class, class-feature, Guile talent and equipment rule
sections are adapted from the Spheres of Power Wiki under OGL-1.0a. Exact source
URLs and snapshot hashes accompany every record; the scoped page/kind inventory
is `config/intake-sources.json` in the repository. Credit remains with the wiki,
the original publishers and authors listed in the retained complete wiki OGL
notices. These rules remain Open Game Content, not MIT-licensed original text.
No wiki artwork, advertisements or navigation is copied.

New physical-item data uses empty native PF1 11.11 profiles, retaining upstream
notices for record data; corresponding physical-item JSON and profiles ship in
`sources/`. New core icon references are placeholders with unfinished artwork
audit status; their image bytes are not redistributed.

## Reviewed mundane gear (alpha.5)

Adventurer's Sash, Filter Scarf, Parasol, Umbrella and Whiskey adapt reviewed
records from Pathfinder 1e Content 11.4.0, credited above, with wiki descriptions retained.
Original rules and credited authors appear in Adventurer's Armory 2, Adventurer's
Guide and Ultimate Equipment; their notices are in the retained wiki OGL list.
OGL rules and GPL record-format notices continue to apply. Corresponding adapted
JSON ships in `sources/items/`. Changes include native container/clothing profiles,
normalized PF1 fields, original sash/umbrella artwork and reviewed core scarf and
goblet image references. No upstream image bytes or program code are copied. The audit
and exact source UUIDs/versions/hashes are in `config/physical-item-reviews.json`.
