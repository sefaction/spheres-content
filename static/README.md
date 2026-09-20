# Static assets

Only assets individually registered in `config/content.json` are packaged.
Record creator, source URL, license, and attribution before adding artwork.

Keep generated icons in readable category folders with descriptive hyphenated
filenames. The installed module mirrors this layout. See
[icon organization](../docs/CONTENT_PIPELINE.md#icon-organization) for the current
structure and compatibility-alias policy.

New painted icons use lossy WebP, normally 256 by 256 pixels and quality 80.
Judge readability at 32, 64 and 128 pixels; do not optimize for full-screen art.
The default byte budget is 32 KiB per WebP. Reuse appropriate core/system artwork
before generating anything. Shared illustrations are encouraged when meaningful.
WebM is unnecessary for static icons. Keep original generation hashes, prompts,
encoder settings, dimensions and byte counts in the asset registry. Full-size
working originals stay outside the installable module.

The four pilot PNGs remain as reduced 256-pixel compatibility assets, including
their old flat aliases. New canonical documents use WebP. PNG bytes retain PNG
extensions; aliases do not disguise one encoding as another. CI checks hashes,
file signatures and size budgets; no image encoder is needed to build the module.
