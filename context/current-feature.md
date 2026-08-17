# Current Feature

Phase 0 — Design demo for client approval

## Status

Completed — deployed, awaiting the client's confirmation.

## Goals

Show the client a real, clickable homepage before any backend work starts, so the
look is agreed before it becomes expensive to change.

- Frontend only. No Payload, no database, no auth, no APIs — deliberately.
- Implement the design the client already approved in Claude Design
  (`RTL Bakery Homepage Demo/`), not a fresh interpretation.
- All copy, prices, contact details and images in `src/data/content.ts`, so the
  demo can be re-branded in one file and later swapped for the CMS.
- Persian, RTL, mobile-first — she will open this on a phone.

## Notes

**Deployed:** https://ghanadbashi.vercel.app (Vercel project `ghanadbashi`).
Vercel Authentication is still on, so the link shows a login page until it is
disabled in Project Settings → Deployment Protection.

**Repo:** https://github.com/heidariomid/ghanadbashi — not connected to Vercel
yet, so pushes do not deploy automatically. `vercel git connect` failed; the
Vercel GitHub app likely needs access to the repo.

**Not connected to a CMS yet.** `src/data/content.ts` is shaped to map onto the
phase 2 collections almost one-to-one:

| content.ts | Payload |
| --- | --- |
| `brand`, `contact`, `about` | `site-settings` global |
| `products.items` | `products` collection |
| `gallery.items` | `gallery` collection |
| `categories.items` | the `category` select options |

**Known gaps against the plan**, all deliberate for a demo: no `/products`,
`/products/[slug]`, `/order`, `/gallery`, `/about` or `/contact` routes; no order
form; no gallery lightbox; photos are Unsplash placeholders rather than her own;
Vazirmatn loads from `next/font/google` rather than self-hosted.

**Leftovers to clean when the direction is settled:** `src/components/illustrations/`
holds 18 unused SVGs from an earlier illustration-led draft, and `scripts/`
holds screenshot helpers used for review.

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
