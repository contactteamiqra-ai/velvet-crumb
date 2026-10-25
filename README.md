# VELVET CRUMB

A scroll-controlled chocolate atelier portfolio study built with React, Vite, React Three Fiber, Three.js and GSAP.

```sh
npm ci
npm run dev
npm run build
npm run preview
```

The rebuild replaces disconnected photo sections with a single sticky 3D stage, a real geometric cake wedge, seven scroll chapters, and a functional four-option product configuration and demo bag. It uses local procedural textures, system fonts and local lights; no runtime CDN dependency is required.

**Visual status:** this is an improved procedural cinematic prototype, not a finished photorealistic commercial. Cutting uses real geometry, but authored cutting/crumb animation, fluids, rising cake, frosting, and realistic packaging still need production assets. See [the audit and scene-by-scene production plan](docs/PRODUCTION.md). Configuration changes update demo prices and bag items, not the 3D material/geometry.

## Cloudflare Workers

Build with `npm run build`, then deploy using your authorized Cloudflare account with `npx wrangler deploy`. The existing `wrangler.jsonc` serves `dist/`. No server secrets or runtime API calls are required. Do not deploy or merge this review branch before review.

## Checks

`npm run build` validates the client bundle. `npm test` verifies pricing for the demo configurations. Browser QA covers production rendering, chapter scrubbing, desktop/mobile overflow, all four options, add/remove bag, Escape dismissal and reduced motion; see `docs/QA.md` for observed results and limitations.
