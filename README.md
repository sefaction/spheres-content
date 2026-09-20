# Additional Spheres Content

A Foundry VTT module for Pathfinder 1e, intended to provide items, feats, and
classes from the Spheres of Power Wiki with images, stat changes, and conditional
notes where appropriate.

## Status

Initial descriptive pilot: four entries in Items, Feats, Base Classes, and Guile Talents, with generated images and source descriptions. The full catalog is in progress. Requires Pathfinder 1e and Spheres for Pathfinder 1e (`pf1spheres` 0.9.0 or newer). The target test combination is Foundry 13.351, PF1 11.11 and pf1spheres 0.9.0. New content integration acceptance is pending; the old empty-shell smoke result does not establish content compatibility. This is not a published release.

## Development

Use Node.js 24 and npm with the committed lockfile. On Windows:

```powershell
npm.cmd ci
npm.cmd run verify
```

`npm.cmd run build` creates `dist/module.json` and a review ZIP under `.build/`.
The ZIP opens directly to the module files. No release or manifest publication
is performed. Source JSON compiles through the official Foundry CLI.

Remote deployment uses an authenticated Windows SMB session and ignored local
configuration. Run `npm.cmd run verify` on a clean committed branch, followed by
`npm.cmd run deploy:remote -- --dry-run`, `npm.cmd run deploy:remote`, and
`npm.cmd run smoke:remote`. Foundry must be in Setup before replacing files.
See [remote testing](docs/REMOTE_TESTING.md) for configuration and rollback.

## Project documentation

- [Project decisions](docs/PROJECT.md)
- [Content pipeline](docs/CONTENT_PIPELINE.md)
- [Provenance](docs/CONTENT_PROVENANCE.md)
- [Testing](docs/TESTING.md)
- [Next content discussion](docs/CONTENT_PLANNING.md)
- [Resumable checkpoint](docs/WORK_CHECKPOINT.md)

Original tooling and documentation use MIT. Third-party content retains its
applicable license; see [attribution](ATTRIBUTION.md).
