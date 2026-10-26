# Verification — Poly Haven integration, 26 October 2026

- Poly Haven API and complete 2k asset download succeeded. Source and derived SHA-256 records: `assets/source/polyhaven/provenance.json`.
- Seven tests pass: independent compressed animation roots, photographic and authored PBR maps, exact reverse poses, continuous outward separation, two completed blade passes before separation, and retained pricing across 54 combinations.
- Production build passes. Existing Vite lazy Three.js chunk warning remains (1.14 MB / 344 kB gzip).
- Web GLB: 2.67 MB, down from 3.42 MB. Original scan triangles retained.
- Chromium/SwiftShader browser captures below show the actual website, not offline Cycles renders. Desktop 1440×1000; mobile 390×844. Retained add-to-bag and Escape dismissal checked; mobile has no horizontal overflow.

The exterior is scanned; exposed interiors remain authored approximations. Physical fracture/contact and physical mobile/Safari validation remain outstanding. This is still a draft visual review, with no merge or deployment.

![Hero](review/hero-browser.png)
![Blade](review/blade-browser.png)
![Separated slice](review/cut-browser.png)
![Mobile](review/mobile-browser.png)

At scroll progress .8996, the actual canvas slice position is `[.4200,-.0550,.8600]`. Captures wait for the rendered progress to reach the requested pose; an initial timing-only capture was discarded because software WebGL lagged behind GSAP's target. SwiftShader capture timing is not a real-device performance measurement.

Reverse scrolling restored slice position `[0,0,0]` (rendered progress .0001). A separate reduced-motion capture at progress .3000 verified the corrected blade orientation against the radial cut. No uncaught errors occurred in that run.

The combined desktop-to-mobile resize run timed out waiting for its zero-progress target after viewport reflow. A fresh 390×844 reduced-motion session passed at exact progress 0, with no page errors or horizontal overflow, and add-to-bag/Escape dismissal passed. Responsive reflow during an active scrub still warrants physical-device review; the timeout is not treated as a successful combined run.
