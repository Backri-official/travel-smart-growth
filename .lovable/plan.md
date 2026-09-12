# Backri — Premium Travel Accessories Storefront (UAE / GCC)

## Goal
A conversion-focused Shopify storefront and landing page for Backri: passport wallets, premium travel accessories, luggage, bags, and organisers — targeted at UAE first, then GCC.

## Brand direction
- Premium desert-luxe aesthetic: warm sand/off-white background, deep espresso/ink text, brass-gold accent. Elegant serif display + clean sans body. No generic purple-gradient look.
- English-first, AED pricing (store currency is AED), messaging tuned to UAE/GCC travelers (frequent flyers, gifting, premium leather goods).

## Store catalog (real Shopify products, created via the integration)
Starter catalog of ~8 products across 3 collections:
- **Passport Wallets** — leather passport wallet, family passport organiser
- **Luggage & Bags** — carry-on, weekender duffle, tote
- **Organisers & Accessories** — packing cube set, tech organiser, luggage tag set
Each with real images (generated), descriptions, and AED prices. User can adjust/remove any product via chat.

## Pages
1. **Landing page (/)** — hero with brand story, featured collection, value props (premium materials, GCC shipping, gifting), product grid fed by live Shopify data, newsletter/brand footer.
2. **Product detail (/product/$handle)** — images, price, variant selection, add to cart.
3. **Cart drawer** — slide-out cart on every page, quantity editing, checkout button.

## E-commerce mechanics (Shopify Storefront API)
- Products loaded live from the Shopify store (no mock data).
- Zustand cart store synced with Shopify cart (create/add/update/remove via Storefront API, 2025-07).
- Checkout opens Shopify-hosted checkout in a new tab (channel=online_store).
- Cart persists across sessions and syncs after checkout return.

## Growth-architect touches (per your operating rules)
- Offer stack on landing: bundle suggestion + free GCC shipping threshold messaging.
- Scarcity/leverage: "launch offer" framing, guarantee strip.
- AOV: "Complete your travel set" cross-sell row on product pages.
- No fake reviews — social proof sections ship empty until real ones exist.

## SEO
- Per-route titles/descriptions (Backri, travel accessories UAE), og tags, semantic HTML, image alt text.

## Technical notes
- TanStack Start routes: index.tsx (landing), product/$handle.tsx; cart drawer in root layout.
- Storefront API helper + Zustand cart store per Shopify integration guide; shadcn components; design tokens in src/styles.css (warm sand palette, oklch).
- Generated product/hero imagery saved under src/assets.
