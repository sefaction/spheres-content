# Content pipeline

Canonical documents are human-reviewable JSON under `src/packs/<pack-name>/`.
Edit those files, not generated databases, installed compendia, or ignored intake
scripts. `config/identities.json` fixes each source key, document ID and pack.
`config/content.json` registers pack counts, reviewed rule sources and generated
image provenance. This initial pilot has four documents in four Item packs.

The descriptive phase supports PF1 11.11 base classes, ordinary feats, gear,
and pf1spheres 0.9.0 skill talents for its recognized Guile spheres. Other item
subtypes need explicit schema extensions with their first content batch. This
is a reviewed subset, not a complete validator for every PF1 Item type.

## Validation

- Verify compiler `_key`, stable 16-character ID/source key, unique IDs/keys,
  exact pack and file inventories, and native subtype fields.
- Require a reviewed collection, OGL notices with fixed hash, source URL and
  snapshot hash for each document. A source-page inventory is not rights clearance.
- Verify registered generated images exist, have valid PNG signatures and exact
  recorded hashes, and record the built-in generation prompt and tool.
- Reject executable HTML, unreviewed attributes, unsafe link protocols and missing
  descriptions. Source hyperlinks are retained as absolute web links; this gate
  does not claim to HTTP-check every linked wiki page during CI.
- UUID/compendium links remain blocked until a versioned resolution inventory is
  implemented. Do not invent upstream UUIDs.
- Keep Changes, context notes, actions, scripts and effects empty. Reject passive
  change flags and caster-progression automation until the later mechanics pass.
  Native class/item identity fields such as HD, BAB, saves, price and weight are
  included so the documents use the appropriate PF1 sheet and basic data model.
- Folder references and automatic class associations are deferred; the pilot
  explicitly validates null folders and empty associations. Folder support needs
  a stable folder inventory and reference/cycle tests when hierarchy is added.

## Build

The official `@foundryvtt/foundryvtt-cli` compiler produces packs in
`.build/compiled-packs/`. The official extractor round-trips every compiled
record; recovered documents must match canonical JSON exactly. Database files
are copied unchanged into `dist/packs/`; only diagnostic `LOG`, `LOG.old`, and
lock files stay out of the package. Numbered `.log` files are database journals
and remain included. This avoids timestamp-only archive drift without ignoring
semantic differences or editing generated records.

Registered assets copy from `static/` into runtime-relative paths. The ZIP has
`module.json` at its root. Two clean builds must produce identical archive hashes.
`build:packs` runs the complete clean build to avoid stale pack output.

## Intake and updates

Source discovery uses cached public pages under ignored `.local/wiki-catalog/`.
Normalize and review selected descriptions before adding canonical records. Keep
current and legacy variants distinguishable, avoid duplicate feats from class
pages, and exclude archetype entities. Missing Guile talents are in scope; existing
magic/combat talents are not. Preserve source IDs across future edits.

Updates replace compendium content only. They do not migrate copies previously
imported into a world or actor. No world-export/normalization command or world
migration is implemented. Remote integration acceptance and the full catalog
remain in progress; local validation does not substitute for Foundry testing.
