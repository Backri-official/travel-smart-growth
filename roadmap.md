# Backri roadmap

- [x] Shopify theme package (Liquid templates, settings, translations) — English
- [x] Arabic built into the same theme package (RTL layout, ar.json wording, Arabic fields on every home section)
- [x] Compare Shopify product titles/descriptions against the Arabic pages
- [x] Orders dashboard at /orders, passcode protected, reads live Shopify orders (needs read_orders on the Shopify app)
- [x] Product manager at /admin — add products with Arabic names + AED prices, edit Arabic text, remove products (needs write_products + write_translations on the Shopify app)
- [ ] Real Backri products (names, AED prices, photos, Arabic copy) still awaited from the user
- [x] Arabic checkout opens Shopify checkout in Arabic (locale=ar on the checkout link)
- [ ] All 3 products in the live store are out of stock — nothing can be bought until stock is set
- [ ] Ad kit links still placeholders — swap for the live URLs
- [x] Theme validation checklist — `bun run validate-theme` (scripts/validate-theme.mjs): required files, Liquid syntax, asset references, Arabic/RTL + locale parity, theme settings. Current: 0 fail, 1 warn, 59 pass
- [x] SEO fixes: per-product titles/descriptions/social previews + Product & Breadcrumb structured data, accessible names on loading buttons, /sitemap.xml (pages, journal posts, live products) referenced from robots.txt
- [ ] Google Search Console not connected — optional, needed for indexing reports and sitemap submission
- [x] Agent integration (MCP) at /mcp, OAuth-protected: sign-in page at /login (email + Google), consent page at /.lovable/oauth/consent, 4 tools (list_products, get_product, list_journal_posts, get_journal_post)
- [x] Theme v4 — home page now matches the live site: full-bleed hero with overlay, icon value-prop row, offer band, Gulf shipping columns, journal promo; new sections offer-band/gulf-shipping/journal-promo + snippets/icon.liquid
