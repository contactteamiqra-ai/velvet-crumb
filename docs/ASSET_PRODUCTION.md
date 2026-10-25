# Hero and cutting: visual review candidate

## What is actually shipped

An original Blender-authored cake asset replaces the runtime cylinder/wedge/spring construction. `public/assets/cake/atelier-cake.glb` embeds the mesh and PBR maps. It has independent `CakeWhole`, `CakeBody`, and `CakeSlice` groups. The intact exterior has no pre-cut seam; the body and slice share the same surface recipe and layer elevations. Toppings travel with their corresponding piece. The cake board stays stationary.

The asset includes irregular sponge walls and cut faces, chocolate cream filling, a ganache crown and thick drips, star-nozzle piped rosettes, thin rolled chocolate ribbons, and sparse gold flakes. Crumb has authored albedo, tangent normal and roughness maps. Cream and ganache use separate normal/roughness maps plus physically based material values and a ganache clearcoat. These maps are original mathematical material studies, **not scans or photographed PBR**.

The website uses a local prefiltered softbox environment, large rectangular lights, a shadow-casting key, AgX tone mapping, and a dark matte sweep. Scroll drives an absolute camera/slice pose; there is no accumulated rotation or elapsed-time motion. The same scroll value restores the same pose in reverse. On-demand rendering stops drawing unchanged frames.

## Visual status: not approved photorealism

This is a more detailed original look-development candidate for review, not a claim that the premium-advertisement standard is met. The crumb still needs a convincing scanned or artist-painted porous surface; authored noise can read as spots at close range. Cream needs art-directed torn/cut structure and more natural volume variation. Specular ganache and piped details require close-up review after web mesh simplification. The slice translates and tilts naturally relative to the cake, but a knife, material fracture, crumbs and contact/deformation have not been authored. Do not call it a completed realistic cutting simulation.

Only hero and cutting are exposed in the current review journey. Earlier low-detail mixing/baking/frosting/packaging studies remain in `src/LegacyScene.jsx`, unimported and unshipped. They are held until the user approves these first scenes. Existing customization is retained without expanding its functionality.

## Licensed asset research and current blocker

A suitable real-surface reference is **Strawberry Chocolate Cake**, by **Kuutti Siitonen / Poly Haven**:

- Asset: https://polyhaven.com/a/strawberry_chocolate_cake
- License: https://polyhaven.com/license — CC0-1.0; modification and redistribution permitted.
- The scan includes strawberries, so adapting it to an all-chocolate signature requires an art-direction pass, not a claim that it already matches the brand's cake.
- As of this review, no third-party model or texture has been downloaded or incorporated. The environment permits neither `api.polyhaven.com` nor the asset download hosts; the download returned HTTP 403. The user was asked to add `api.polyhaven.com`, `dl.polyhaven.org`, `dl.polyhaven.com`, and `cdn.polyhaven.com` to the allowed hosts.
- `download-cake.py` prepares a local download with SHA-256 provenance. It is not used by the website.
- `prepare-cake.py` is an unvalidated scan-adaptation starting point: normalize, bisect exterior geometry, preserve source UVs, and assign authored interior caps. Its layer heights, cap UVs and cut angle must be calibrated against the downloaded scan before it can ship. It is not evidence of a completed scan import.

The shipped original review asset and source maps have no third-party asset licensing dependency. Do not attribute them to Poly Haven.

## Reproduce the original candidate

Python dependencies: NumPy, SciPy, Pillow. Blender 4.3.2. Node/npm for glTF Transform.

```sh
python scripts/assets/create-interior.py
blender -b -t 3 --python scripts/assets/author-cake.py
bash scripts/assets/optimize-cake.sh
npm test
npm run build
```

The authoring script writes a packed editable `work/assets/atelier-cake.blend` and an uncompressed GLB. The optimizer writes the web GLB using Meshopt and WebP while preserving the named roots. It deliberately disables flattening and joining across roots; default optimization would erase the independent slice. Source textures are in `assets/source/cake/`, not deployed in `dist/`.

Optional offline review:

```sh
blender -b -t 3 --python scripts/assets/render-review.py
```

Those Cycles PNGs are **offline asset renders**, not browser screenshots. The browser's real-time result is the visual acceptance target. This Blender build has no OpenImageDenoise support, so offline previews use 48 samples without denoising.

## Production work still needed

1. Obtain and inspect the licensed scan, or commission a matching chocolate cake scan/Blender sculpture. Capture a real slice interior as well as the intact exterior, with color-calibrated base color and cross-polarized roughness reference.
2. Retopologize and UV the cake, intact and sliced, with consistent sponge, cream and ganache surface continuity. Bake displacement/normal detail from high-resolution geometry. Avoid a texture-only imitation of actual pores at macro scale.
3. Author a blade with a beveled edge and steel reflections, animate both radial cuts, then add constrained slice separation, crumb/fracture/contact detail and a small settling motion. Bake expensive effects to render sequences where appropriate.
4. Match Cycles reference lighting in WebGL; validate the hero and close-up on desktop/mobile hardware. Obtain the user's visual approval.
5. Only then move to human-free ingredient mixing, rising/baking, ganache flow and box/ribbon production.
