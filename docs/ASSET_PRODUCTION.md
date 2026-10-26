# Poly Haven scan: hero and cutting review

## Download verified — 26 October 2026

The published velvet-crumb environment successfully downloaded **Strawberry Chocolate Cake** by **Kuutti Siitonen / Poly Haven** through `api.polyhaven.com` and `dl.polyhaven.org`. The 2k glTF, mesh buffer and all three PBR maps were downloaded. Source URLs, byte counts and SHA-256 hashes are recorded in `assets/source/polyhaven/provenance.json`, alongside the derived web GLB hash.

- Source: https://polyhaven.com/a/strawberry_chocolate_cake
- License: https://polyhaven.com/license — CC0-1.0, modification and redistribution permitted.
- Strawberries and the original photographic atlas are retained. This is a strawberry-chocolate asset review, not an all-chocolate brand adaptation.

## Current integration

`public/assets/cake/atelier-cake.glb` now contains the scan exterior, original UVs, base color, normal and packed roughness/metalness maps. Independent `CakeWhole`, `CakeBody` and `CakeSlice` roots preserve the existing animation contract. Meshopt and WebP reduce the asset to 2.67 MB without simplifying the source triangles. All runtime assets remain local.

The intact scan is shown in the hero. Two radial blade passes precede separation. The camera moves closer; the slice translates outward and settles. All poses derive from scroll progress, including blade position and angle, so reverse scrolling restores the same pose. Existing on-demand rendering, studio lighting and customization are retained. Legacy production scenes remain unimported.

## Interior preparation and limits

The source has an open underside and disconnected surface islands. The preparation script closes what it can, clips convex sectors, and fills radial planes separately. Sampled radial profiles cover remaining open chains with authored cut interiors. Body sectors meet along an internal plane. These caps use the previous original sponge/cream maps, with UV height scaled to the scan's measured height; they are **not scanned interiors**. A porcelain support grounds the lower edge.

The photographic exterior is a substantial realism improvement, but this remains a visual candidate. Radial caps approximate the source silhouette and require close-up review; the original scan contains surface gaps. The blade is a rigid steel study, without fracture, crumbs or contact deformation. No claim of finished physical cutting or approved photorealism is made. An all-chocolate signature still requires an artist-led adaptation or matching scan. Real-device mobile/Safari performance remains unverified.

## Reproduce

Requires Blender 4.3.2, Python and Node/npm. Existing authored interior maps are tracked.

```sh
python scripts/assets/download-cake.py
blender -b -t 3 --python scripts/assets/prepare-cake.py -- \
  work/assets/polyhaven/strawberry_chocolate_cake_2k.gltf work/assets/scan-cake.glb
bash scripts/assets/optimize-scan.sh
npm test
npm run build
```

The editable derived Blender file is written to ignored `work/assets/cake-source.blend`. The source download remains in ignored `work/assets/polyhaven`; its recorded checksums permit verification. The prior original cake authoring scripts and maps remain available in Git history and the checkout. No merge or deployment is part of this review.
