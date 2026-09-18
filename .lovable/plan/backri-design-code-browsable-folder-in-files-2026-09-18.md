# Backri design code — browsable folder in Files

## Goal
Put the complete design source code of this site into Files as an openable folder: `backri-design-code/`. No zip, no GitHub — just clean files the user can browse and copy.

## What goes in
- **All pages and components** — `src/` in full: routes (English, Arabic, journal, product, orders, admin), components, cart store, Shopify helpers, design system (`src/styles.css` with the sand/espresso/brass palette).
- **Design imagery** — logo pointer, product photos, favicon.
- **Configuration to run it** — `package.json`, `vite.config.ts`, `tsconfig.json`, `components.json`, lint/format configs, README files.
- **A short SETUP.md** at the folder root: how to install and run the code locally (`bun install`, `bun run dev`), and a note that the Shopify store token inside `src/lib/shopify.ts` is a public storefront token (safe to ship in a storefront, but it is visible in the code).

## What stays out
- Dependencies and build output (`node_modules`, `dist`, generated files)
- Git metadata, `.lovable` internals, `.env` / secret files (the dashboard passcode and admin API token live in Lovable's secret store, never in code)
- The Shopify theme zips already delivered separately (those live in Files already)

## Steps
1. Build a clean copy of the project in `/tmp/backri-design-code/`, excluding the items above.
2. List every staged file (including hidden ones) and verify nothing secret or generated slipped in.
3. Add SETUP.md.
4. Copy the folder into `/mnt/documents/backri-design-code/` and list the final result for the user.
