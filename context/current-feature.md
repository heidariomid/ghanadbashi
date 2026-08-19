# Current Feature

## Status

Not Started

## Goals

<!-- What success looks like, as bullet points. Filled in by `/feature load`. -->

## Notes

<!-- Constraints, context and details carried over from the spec. -->

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
