# Current Feature — Local `db:pull` from production Neon

## Status

In Progress

## Goals

- `pnpm db:pull` dumps production Neon (schema + data) and restores it into the local Postgres database named `bakery`
- Missing `NEON_DATABASE_URI` fails clearly; never fall back to local `DATABASE_URI` as the source
- Wipe local first: drop and recreate `bakery`, then restore with `--no-owner --no-acl`
- Dump artifacts stay in a temp dir; no secrets, dumps, or `.env` files committed
- Missing `pg_dump` / `pg_restore` / `dropdb` / `createdb` / `psql` fails with a short install hint
- Brief developer notes in the script header and CLAUDE.md Commands

## Notes

- Default restore target is local database `bakery`. If `DATABASE_URI` in `.env` clearly points at local Postgres, use those connection params, but still drop/recreate `bakery`.
- Neon dump uses `sslmode=require` when the URI does not already set it.
- Script does not manage VPN; some networks still need one to reach Neon.
- Photos may 404 locally if they live on Vercel Blob (URLs point at production).

## History

- Init
- Built an illustration-led prototype (hand-authored SVG line art, no
  photography) against the original `prompt` brief.
- Client approved a different, photography-led design in Claude Design. Replaced
  the prototype: ported the design system tokens (parchment, rosé, espresso),
  the brand «قناد باشی عسل», Isfahan contact details, and all imagery.
- Mobile pass: page height cut from 15,767px to 11,488px at 390px wide,
  categories and gallery two-up, every tap target ≥44px, footer trimmed.
- Deployed to Vercel; pushed to GitHub.
- Phase 1 — Project Setup: added Payload CMS with a Persian admin on Neon
  Postgres. Split the app into `(site)` and `(payload)` route groups, self-hosted
  Vazirmatn, typed the collections, and switched the package to ESM so the
  Payload CLI can load them.
- Phase 2 — CMS Schema: products, gallery, orders, site-settings, media on
  Vercel Blob; gallery filters, seed data, admin QA checklist.
- Phase 3 — Homepage CMS Wiring: wired site-settings contact and aboutText to
  the public site, footer polish, empty states; simplified about rich-text
  editor; mandatory `/feature review` gate before complete.
- Phase 4 — Products: added `/products` with URL category chips, moved site
  chrome into the layout, and revalidate `/` and `/products` when products or
  site-settings change.
- Phase 5 — Order Form: add the order basket and checkout form
