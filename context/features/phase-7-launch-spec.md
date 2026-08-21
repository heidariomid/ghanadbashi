# Phase 7 — Launch Spec

## Overview

Ship the site: SEO, sharing previews, performance, accessibility and the
production checks.

The client guide and handoff moved out of this phase — see
@context/features/phase-9-client-guide-spec.md. It runs last, after the admin
UI work, so its screenshots match what she actually sees.

There is **no** `/products/[slug]`, and **no** `/about` or `/contact` — Phase 6
deliberately shipped `/gallery` alone. SEO, OG and JSON-LD apply to `/`,
`/products`, `/order` and `/gallery` only.

## Requirements

### SEO

- `generateMetadata` on every public page — Persian titles and descriptions
  (`/products`, `/order` and `/gallery` already set theirs in Phases 4–6; the
  homepage inherits the root `metadata` and needs its own gaps filled)
- Root `metadata` with `metadataBase`, brand name template, `lang="fa"`
- OG image: the hero for the homepage; a sensible default (hero or first
  product photo) elsewhere. No per-product OG — there is no detail page.
  **Nothing exists today** — the live site serves zero `og:`, `twitter:` and
  canonical tags, so every link shared to Instagram or WhatsApp renders as a
  bare box. This is the highest-value item in the phase
- `sitemap.ts` and `robots.ts` — include the four routes above, not a slug
  pattern for products. Both currently 404 in production
- JSON-LD `LocalBusiness` (name, phone, area served). **No** `Product` on
  detail pages
- Product slugs stay as `slugify` outputs them. Do not invent English
  transliterations by hand

### Performance

- Lighthouse mobile ≥ 90 on performance and accessibility
- Hero image `priority`; listing/gallery already priority the first card
  only. Do not eagerly load a whole row
- Confirm images are served as WebP at the Phase 2 sizes
- No layout shift on image load (explicit dimensions or aspect-ratio)
- Vazirmatn is already self-hosted via `next/font/local` — confirm
  `display: swap` and that Google Fonts is not requested at runtime

### Accessibility

- Alt text on every image, from the `media.alt` field. The plumbing is this
  phase's job; **teaching her to fill it moved to
  @context/features/phase-9-client-guide-spec.md**, along with rewording the
  field's own «دسترس‌پذیری و سئو» description
- Visible keyboard focus states
- Form labels properly associated
- Colour contrast ≥ 4.5:1 (watch the cream/caramel palette)
- Lightbox traps focus and is escapable (already on the homepage grid)

### Deployment

- Vercel project on the free tier
- Env vars in production: `DATABASE_URI`, `PAYLOAD_SECRET`,
  `BLOB_READ_WRITE_TOKEN`, `RESEND_API_KEY`, `ORDER_NOTIFICATION_EMAIL`
- `payload.config.ts` leaves `serverURL` unset on purpose so upload URLs
  stay relative and `next/image` works on every preview host. Do not "fix"
  that by setting `NEXT_PUBLIC_SERVER_URL` on Vercel unless `metadataBase`
  / sitemap need an explicit origin — then set it to the canonical domain
- Custom domain + HTTPS
- Confirm Blob uploads work in production (**local disk does not persist
  on Vercel** — this is the classic launch-day failure)
- Send a real test order end-to-end on production
- Confirm `/admin` is reachable and performs well on the client's phone

### Pre-launch content

The site must not be empty at launch — an empty site reads as broken and
invites immediate calls.

**Already done, verified 2026-08-20:** site settings fully populated (brand,
tagline, phone, WhatsApp, Instagram, service area, hero, about image, about
text), 9 products, 49 gallery photos, and alt text on all 50 media rows.

If any of that is later emptied, re-seed it before launch. Do **not** invent
filler products to fill the category chips — empty categories still appear as
capability.

Her Payload account, the client guide, the handoff and teaching her the
«متن جایگزین» field moved to
@context/features/phase-9-client-guide-spec.md.

## Verification

- Lighthouse mobile ≥ 90 performance and accessibility
- All meta tags and OG images correct (test with a link preview tool)
- `sitemap.xml` and `robots.txt` resolve in production and do not list
  product detail URLs
- A real order submitted on production arrives by email and in `/admin`
- Image upload from a **phone** works in production
- Unchecking «موجود است» greys the product on `/products` and removes it
  from the `/order` select
- Every page correct at 375 / 768 / 1280px in RTL
- `pnpm build` and `pnpm lint` pass

## Notes

- A product detail page is a paid extra: it needs a long-description
  field the current schema does not have.
- Sharing previews are worth more than the search files here. Almost every
  visitor arrives from an Instagram link, so the OG tags pay back immediately;
  a home bakery in بهارستان will not out-rank established shops in search no
  matter what `sitemap.ts` says. Do both — they are cheap — but expect the
  return from the first.
- Watching the client use the admin, agreeing what counts as a paid change,
  and the guide itself all live in
  @context/features/phase-9-client-guide-spec.md.

## References

- @context/project-overview.md
- @TEMPLATE-README.md
- @context/features/phase-2-cms-schema-spec.md
- @context/features/phase-4-products-spec.md
- @context/features/phase-5-order-form-spec.md
- @context/ai-interaction.md
