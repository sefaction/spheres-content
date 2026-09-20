# Optional module compatibility

The exact installed versions, observed interfaces and pending checks are recorded
in `config/integrations.json`. This is an integration plan, not a list of certified
combinations. No optional module is installed, enabled or made a dependency by
this intake batch.

- **pf1spheres 0.9.0:** required framework for Spheres item types and actor data.
  Reuse its sphere/caster interfaces and avoid duplicate calculations.
- **Container Contents 0.4.1:** source reads PF1 native container contents. Our
  native `system.items` structure is the relevant contract; test display and
  withdrawals with this optional UI module enabled.
- **Item Nesting 1.2.0:** source supports actor-local IDs or tags through
  `flags.world.nesting.groupBy`. Consider class-feature grouping after grant/link
  review, never by shipping IDs copied from test actors.
- **Feature Sources 0.4.0:** uses item dictionary flags `source`, `source_level`,
  and `source_type` for grant origin. This differs from PF1's `system.sources`
  bibliography; do not overwrite one with the other.
- **Roll Bonuses PF1 2.23.5:** a candidate for the later conditional-modifier pass.
  Its interface and stacking behavior require review before any integration.
  Its Item pack was not indexed because an unexpected `lost` directory was
  present; the source pack was left untouched.
- **Token Action HUD PF1 2.1.1:** test reviewed native actions and usage data in
  the HUD rather than adding module-specific roll buttons.
- **Item Piles 3.3.4:** test stack splitting, transactions and container valuation
  after the relevant item data is reviewed.
- **PF1e Archetypes 11.0.1:** reserve for the later archetype-layering discussion.

For each chosen integration, run a native PF1 + pf1spheres baseline first, then
add one optional module and compare the same fixtures, calculations and logs.
Record versions and results before declaring compatibility. Unsupported flags
must remain audit work instead of being added speculatively to every item.
