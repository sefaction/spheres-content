# Content pipeline

## Foundation

Node.js 24, locked npm dependencies, JSON sources, and the official
[`@foundryvtt/foundryvtt-cli`](https://github.com/foundryvtt/foundryvtt-cli) compiler.
Human-reviewed canonical source will live under `src/packs/<pack-name>/`.
Generated LevelDB output lives under `dist/packs/<pack-name>/`. Only `dist/`
is installed. `.build/` contains the ZIP and local build commit/hash metadata.

No packs are registered yet. `config/content.json` contains empty pack, source,
and asset inventories. The validator rejects additions until the intake contract
and version-specific PF1 schema validation are implemented together. Passing
foundation checks does not validate any PF1 content.

## Next content batch contract

- One JSON file per Foundry document, with a stable 16-character `_id`.
- Include the compiler's stable `_key` (for example `!items!<id>`); entries without it are skipped. Normalize empty embedded collections, such as `effects`, before round-trip comparison.
- Register pack name, Foundry document type, expected document/folder counts, and source collection.
- Store stable source keys and provenance in namespaced document flags or a reviewed sidecar index.
- Use PF1's native Item subtypes for classes, feats, equipment, weapons, and other agreed entries, based on the installed system schema.
- Preserve folder IDs, embedded document IDs, UUIDs, and source keys on updates.
- Treat bonuses, stacking types, formulas, prerequisites, conditional notes, and image references as reviewable data.
- Keep private inputs and unreviewed extraction out of Git in ignored `.local/`.
- Add only reviewed distributable assets, with provenance, to the asset inventory.

Before lifting the intake gate, implement source and generated schema checks,
duplicate/stability checks, counts, folder cycles, internal/external UUID checks,
asset existence checks, source rights validation, and compiled-pack round trips.
Record any references to Foundry/PF1-provided icons against the tested installation;
do not copy those assets into this module by default.

## Determinism and export

The foundation builds twice and compares ZIP SHA-256 values. ZIP entries have
fixed timestamps, sorted paths, and portable attributes. The compiler test
round-trips a synthetic document with stable identity and a UUID string.

LevelDB binary files may contain operational metadata. Once real packs are added,
compare normalized extracted documents across clean builds as well as archive
policy; do not hide semantic drift by ignoring every generated difference.

The official CLI can extract packs, but no project world-export/normalization
command is implemented yet. Do not copy raw world databases into the repository.
