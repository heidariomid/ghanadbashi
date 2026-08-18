# Current Feature: Phase 3 — Homepage CMS Wiring

## Status

In Progress

## Goals

- Wire CMS contact fields everywhere they appear, with correct links, Persian phone digits, and hide-if-empty behavior.
- Render CMS `aboutText` rich text alongside the optional about image, hiding the section only when both are empty.
- Handle empty hero image and tagline fields without stale fallbacks or broken layouts.
- Expand the footer with CMS brand/contact details, service area, and the current Persian calendar year.
- Keep the header brand name and WhatsApp link synchronized with CMS values.
- Preserve responsive RTL behavior and pass `pnpm build` and `pnpm lint`.

## Notes

- Scope is limited to wiring existing `site-settings` fields; do not rebuild existing homepage sections.
- Remove hardcoded contact facts and about paragraphs from `src/data/content.ts`, while retaining static section headings, value cards, signature, and other marketing copy.
- Phone links use `tel:+98…`; WhatsApp uses `https://wa.me/{whatsapp}`; Instagram uses `https://instagram.com/{instagram}`.
- Do not add product routes, gallery teasers, layout refactors, fetch consolidation, footer navigation, or CMS wiring for order CTA and section-intro copy.
- Homepage revalidation remains 60 seconds, and existing single-page anchor navigation remains unchanged.

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
