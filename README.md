# Additional Spheres Content

A Foundry VTT module for Pathfinder 1e, intended to provide items, feats, and
classes from the Spheres of Power Wiki with images, stat changes, and conditional
notes where appropriate.

## Status

Foundation only: no imported content or registered compendia. Target environment:
Foundry VTT 13 build 351 and PF1 11.11 (confirmed in remote UI; module not integration-tested).
Compatibility is not yet claimed in the manifest. This is not a published release.

## Development

Use Node.js 24 and npm with the committed lockfile. On Windows:

```powershell
npm.cmd ci
npm.cmd run verify
```

`npm.cmd run build` creates `dist/module.json` and a review ZIP under `.build/`.
The ZIP opens directly to the module files. No release or manifest publication
is performed. Source JSON compiles through the official Foundry CLI.

Remote commands currently fail closed, including dry run: the host access method,
dedicated test world, exact directory, and safe replacement workflow are pending.
See [remote testing](docs/REMOTE_TESTING.md).

## Project documentation

- [Project decisions](docs/PROJECT.md)
- [Content pipeline](docs/CONTENT_PIPELINE.md)
- [Provenance](docs/CONTENT_PROVENANCE.md)
- [Testing](docs/TESTING.md)
- [Next content discussion](docs/CONTENT_PLANNING.md)
- [Resumable checkpoint](docs/WORK_CHECKPOINT.md)

Original tooling and documentation use MIT. Third-party content retains its
applicable license; see [attribution](ATTRIBUTION.md).
