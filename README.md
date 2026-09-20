# Additional Spheres Content

A Foundry VTT module for Pathfinder 1e, intended to provide items, feats, and
classes from the Spheres of Power Wiki with images, stat changes, and conditional
notes where appropriate.

## Status

The unpublished alpha.4 intake contains 6,788 descriptive drafts in Items, Feats, Base Classes, Guile Talents and Class Features. The crawler cached 2,652 pages; extraction and entity review remain incomplete. Separate audit queues track artwork, native settings, reuse, links and class grants. Requires Pathfinder 1e and Spheres for Pathfinder 1e (`pf1spheres` 0.9.0 or newer). The test target is Foundry 13.351 / PF1 11.11 / pf1spheres 0.9.0. Bulk runtime acceptance is pending; optional integrations are research, not compatibility claims. This is not a published release.

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
- [Systematic intake and audit commands](docs/SYSTEMATIC_INTAKE.md)
- [Optional integrations](docs/OPTIONAL_INTEGRATIONS.md)
- [Content pipeline](docs/CONTENT_PIPELINE.md)
- [Provenance](docs/CONTENT_PROVENANCE.md)
- [Testing](docs/TESTING.md)
- [Next content discussion](docs/CONTENT_PLANNING.md)
- [Resumable checkpoint](docs/WORK_CHECKPOINT.md)

Original tooling and documentation use MIT. Third-party content retains its
applicable license; see [attribution](ATTRIBUTION.md).
