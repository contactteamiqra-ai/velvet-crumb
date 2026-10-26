# PR #1 interactive review

The self-contained `docs/review/velvet-crumb-pr1-preview.html` packages the application from source commit `321e3fe`, including its local scan, renderer and CSS. It needs no npm install and no remote model download. This is a review artifact; it does not change the application's source or deploy it.

## Open

Download the HTML file from GitHub using **Download raw file**, save it with the `.html` extension, then open it in a desktop browser with WebGL enabled. GitHub's code viewer itself does not execute HTML. If your browser or organization blocks local HTML files, serve the downloaded file from localhost using `python -m http.server 5173 --bind 127.0.0.1`, then open `http://127.0.0.1:5173/velvet-crumb-pr1-preview.html`.

## Review

- At the top: inspect the intact cake, material detail and framing.
- Scroll slowly down: camera approaches; first and second blade passes precede slice separation.
- Continue down to inspect the separated slice and settling motion.
- Scroll back up through the same range: blade, slice and camera restore their earlier poses.
- Try the existing signature customizer and demo bag; no checkout exists.

The camera is scroll-controlled; drag-to-orbit is not implemented. Reduced-motion preferences use direct scrubbing. Current strawberries are a source-scan review placeholder; the final product will be all chocolate. See [the adaptation plan](CHOCOLATE_ADAPTATION_PLAN.md). The cut interior remains authored. Full production simulations are held pending approval, and every later scene must contain no humans.

No merge or deployment is authorized for this review. The cloud session has no supported shared preview URL. A localhost address on the cloud worker is not a user-accessible preview URL.

## Package verification

Chromium/SwiftShader served this single HTML file on localhost with zero uncaught page errors and zero external HTTP requests. The rendered canvas reached progress 0, .3000, .5304, .9000 and back to exact 0; the separated slice was `[.42,-.055,.86]` and returned to `[0,0,0]`. This verifies the packaged app, not performance on physical devices. Direct `file://` navigation is blocked by the managed review browser's administrator policy, so that opening method could not be verified here; localhost is the tested fallback.
