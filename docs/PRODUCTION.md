# Rebuild audit and current production status

The original site used smooth cylinders/sphere toppings, unrelated remote photographs, and a remote studio environment inside Suspense. It did not have cutting geometry or a shared scroll timeline. The first PR iteration established scrolling and the demo collection but did not meet the requested visual quality.

The current iteration concentrates on hero and cutting. A Poly Haven photographic scan with embedded PBR maps replaces the previous original model; a local softbox studio replaces the orange point-light presentation. A separate intact mesh avoids a visible cut seam in the hero. Slice geometry, toppings and camera are driven by a deterministic scroll pose that reverses exactly.

**The current asset is still a look-development candidate, not approved photorealism.** The published environment now downloads the scan successfully. Strawberries are retained; cut interiors remain authored and rigid blade passes do not simulate fracture/contact. Full provenance, exact asset status, reproduction commands and the remaining Blender work are in [ASSET_PRODUCTION.md](ASSET_PRODUCTION.md).

Later scene studies are preserved in `src/LegacyScene.jsx` but are not imported by the current review experience. Their development is gated on approval of the hero and cutting scenes. The existing four-option collection and demo bag remain available. Nothing has been deployed or merged.

`npm run build` emits the static `dist/` expected by the existing Cloudflare Workers configuration. Deployment remains deferred until review, as requested.
