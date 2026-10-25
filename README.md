# VELVET CRUMB 🍫

A cinematic chocolate patisserie **portfolio prototype** built with React, Vite, React Three Fiber, Three.js and GSAP.

## Local development

```bash
npm install
npm run dev
```

## Build and Cloudflare Workers deployment

```bash
npm install
npm run build
npx wrangler deploy
```

The included `wrangler.jsonc` configures static assets from `./dist`. Run Wrangler interactively with your own Cloudflare account, or connect the repository via Workers Builds.

## Status

- Procedural **stylized** 3D rotating chocolate cake with real geometry.
- Animated scroll-based editorial sections and photo placeholders.
- CSS gift packaging animation.
- Interactive demo flavor and cake-size picker with sample prices.
- No checkout/payment functionality.

**Not yet implemented:** realistic cake slicing, falling slice, photorealistic 3D baking, frosting, and physically animated mixing. These require custom Blender/GLB assets or licensed video sequences.

Images are remote Unsplash placeholders and need review/replacement for final release. No humans appear in the authored baking procedure (only cake/ingredient visuals). This is a portfolio concept, not a live bakery.

