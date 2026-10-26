# Velvet Crumb

A responsive React storefront for a premium patisserie, built with Vite, GSAP and Lucide icons. Cream, caramel and chocolate tones, editorial typography and locally hosted photography replace the previous procedural 3D prototype.

## Development

```sh
npm ci
npm run dev
```

## Production

```sh
npm run build
npm run preview
```

Deploy `dist/` on any static host. The included `wrangler.jsonc` supports Cloudflare static assets (`npx wrangler deploy` with your own Cloudflare account). No secrets are required for the frontend.

## Features

- Responsive editorial hero, signature cake story, six-product collection, three-stage baking ritual, featured pastries, quality details and celebration CTA.
- GSAP entrance reveals and image parallax with reduced-motion support.
- Category filtering, quantity controls, subtotal calculations and a browser-persisted shopping bag.
- Native modal dialogs with keyboard focus containment, Escape dismissal and focus restoration.
- Validated custom-cake brief with occasion, date, flavour, servings and notes. Bag selections and custom briefs download as text files.
- Local image assets, lazy loading below the hero, modern production bundles and no WebGL dependencies.

## Commerce boundary

This is a complete interactive frontend with an illustrative bakery catalogue. It does **not** accept payments, send requests, confirm orders, or promise delivery. Customer details entered in a cake brief remain in component memory and the downloaded file; the bag alone persists in localStorage. Clear disclosures appear at the relevant action points.

Before real commercial launch, supply verified product descriptions, prices, allergens, delivery rules and business contact details, then integrate a secure order/payment provider or backend. Never collect card details in this frontend. No fake order-success or subscription messages are shown.

## Source structure

- `src/App.jsx`: page composition, bag state, animations and request flow
- `src/components.jsx`: image, brand, modal and product-card components
- `src/products.js`: illustrative product catalogue
- `src/styles.css`: responsive visual system and reduced-motion overrides
- `public/images/`: optimized local Unsplash photographs; see `ASSETS.md`

## Validation

Run `npm run build` for the production build. Browser interaction checks are documented in the pull request when available.
