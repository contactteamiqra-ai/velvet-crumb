# Cinematic rebuild audit and asset plan

## Original findings

The previous cake comprised smooth cylinders and sphere toppings, with no sponge texture, cut faces, or slice geometry. It rotated independently of scroll. Every story section used a generic remote photo; these did not show cutting, mixing, baking, or assembly. `Environment preset="studio"` introduced an external HDR dependency inside Suspense, potentially hiding the cake while that request failed. Fonts and all photographs required third-party requests. Frosting and topping customization were absent. There was no retained bag, no dialog, and no reproducible lockfile.

## Implemented architecture

One sticky canvas spans seven chapters. One GSAP ScrollTrigger timeline supplies normalized progress to camera and scene transforms. The cake uses closed extruded wedge geometry for each sponge/cream layer; the matching slice is a separate group, with actual cut surfaces, not a CSS mask. The slice moves radially outward and down. Scroll reversal restores it. Canvas-generated deterministic crumb color/bump texture, physical ganache materials, chocolate curls, local lighting, shadow receiving floor, and a metallic cake board replace the smooth prototype. The 3D module is lazy-loaded so the document and customizer remain available during initialization.

The rebuilt presentation removes the photograph gallery. All shipped visual material is authored in source; no humans, third-party image licenses, remote environment maps, font requests, or runtime asset downloads. The canvas error boundary preserves a descriptive fallback and the customizer if WebGL fails. Mobile composes the canvas below the story copy. Reduced motion disables idle rotation and CSS entrance motion, and uses direct scroll scrubbing without smooth scrolling. The semantic transcript includes all seven chapters.

## Asset and scene status — this is not photorealistic final production

| Chapter / asset     | Implemented                                                                      | Still required for final commercial quality                                                              |
| ------------------- | -------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------- |
| Signature cake      | Textured procedural layered cake, curls, local studio lights                     | Artist-authored cake GLB, scanned sponge/ganache PBR maps, sculpted irregular frosting and toppings      |
| Cutting             | Closed 3D cake remainder and independently translating wedge with exposed layers | Authored knife/cut/contact animation, crumb simulation, deformation and surface continuity               |
| Ingredients         | Scroll-directed chocolate geometry into the bowl                                 | Individual cocoa, butter, flour, cream assets; ingredient labels; particle and liquid caches             |
| Mixing              | Procedural metal hemisphere, rotating whisk, static batter surface               | Real bowl/whisk meshes, fluid pouring, batter vortex, batter-to-tin simulation                           |
| Baking              | Scroll-controlled oven-door study                                                | Oven interior, moving tin, rising cake blend shapes or rendered frame sequence; current panel is a study |
| Assembly / frosting | Cake returns to frame                                                            | Layer assembly, flowing ganache and decoration caches; no fluid simulation is shipped                    |
| Packaging           | Box, moving lid and ribbon reveal geometry                                       | Proper hollow box, cake insertion, folding/ribbon animation; current solid box is a study                |
| Product experience  | Size, flavor, frosting, topping, dynamic USD demo prices, add/remove bag         | Selections change order configuration and price, not the rendered cake. No real checkout is intended     |

No Blender scenes, GLBs, photographed PBR textures, or licensed video sequences existed in the repository. Procedural geometry is explicitly a prototype. Do not present the mixing, oven, frosting or packaging chapters as photorealistic completed sequences.

## Production handoff

Use one consistent artist-authored cake across shots. Bake cutting, rising, fluid pouring and frosting simulations in Blender; deliver optimized GLB rigid/shape-key animations where practical. For fluid simulation and intricate ribbon folding, deliver short AV1/WebM and H.264 fallbacks or compressed frame sequences with poster frames; tie their frame/time selection to the same normalized scroll progress. Make mobile renditions at reduced resolution and load each sequence shortly before its chapter. Record author, license, attribution and release constraints for every sourced asset before committing it. Never require an asset CDN for first render.

Suggested timeline: signature 0–.10, cutting .10–.26, ingredients .26–.36, mixing .36–.51, oven .51–.65, finish .65–.81, packaging .81–1. These are staging ranges, not finished cinematic clips.

## Runtime and deployment

`npm run build` emits static `dist/` for the existing Cloudflare Workers assets configuration. Keep `wrangler.jsonc` and use `npx wrangler deploy` after review with an authorized Cloudflare account. This branch has not been deployed or merged. No Cloudflare account credentials were supplied.
