# Verification — 26 October 2026

## Current hero/cutting asset phase

- `npm test`: six passing tests. Compressed GLB retains independent intact/body/slice groups; crumb, cream and ganache retain normal/roughness maps; slice separation is monotonic and reverses to the exact original pose; all 54 product configurations retain correct pricing.
- `npm run build`: passes for the existing Cloudflare Workers static assets setup.
- `git diff --check`: passes.
- Desktop/mobile Chromium + SwiftShader checks inspect the actual canvas pose, not only the chapter caption. At progress .52 the slice starts moving; at .87 it reaches the separated pose; returning to zero restores `[0,0,0]` exactly.
- Browser capture targets: 1440×1000 and 390×844, including forward cut, open cut, reverse restoration, mobile overflow, retained customization/add-to-bag. Reduced motion uses direct scrubbing; ordinary motion uses the same absolute pose with GSAP smoothing.
- Runtime images and decoder are local. GLB texture blob URLs are local embedded images, not external asset requests.

## Important limits

The original asset is a visual study, not approved photorealism. Offline Cycles asset renders are not a substitute for the actual browser screenshots. Scanned texture adaptation, realistic cutting/fracture/crumb contact and physical mobile/Safari visual/performance testing remain outstanding. Later production scenes are held pending approval.

The GLB is about 3.42 MB. It contains both intact and cut mesh versions, with only one version visible at a time. The lazy Three.js/R3F/GLTF/Meshopt chunk is about 1.14 MB uncompressed / 343 kB gzip; the initial application chunk is 276 kB / 98 kB gzip. Vite emits a chunk-size warning. On-demand rendering avoids redrawing unchanged frames, and device pixel ratio is capped, but these are not evidence of performance on real phones.

## Earlier foundation checks retained

The first iteration checked $85 premium configuration pricing, add/remove bag, focus/Escape dismissal, mobile navigation and no horizontal overflow. No payment/checkout or cloud deployment has been tested. No humans appear in the assets or scenes.

## Actual production-browser captures

The final capture run recorded zero uncaught page errors and zero external requests. The open pose at .87 was `[0.4200,-0.0562,0.8600]`; reverse at zero was `[0,0,0]`. Local texture blobs are excluded from external-request counting. Both captures below are the actual WebGL website, not offline Cycles renders.

![Hero — browser](review/hero-browser.png)

![Separated slice — browser](review/cut-browser.png)

![Mobile — browser](review/mobile-browser.png)
