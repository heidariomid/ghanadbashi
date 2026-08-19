# Phase 7 — Launch & Client Handoff Spec

## Overview

Phase 7 of 7. Ship the site, hand it to the client, and make sure she never
needs to call you.

**This is the phase that determines whether the project was profitable.** It
is also the easiest to skip when the build feels finished — don't.

There is **no** `/products/[slug]`. SEO, OG and JSON-LD apply to `/`,
`/products`, `/order`, `/gallery`, `/about` and `/contact` only.

## Requirements

### SEO

- `generateMetadata` on every public page — Persian titles and descriptions
  (listing and inner pages already set theirs in Phases 4–6; fill any gaps)
- Root `metadata` with `metadataBase`, brand name template, `lang="fa"`
- OG image: the hero for the homepage; a sensible default (hero or first
  product photo) elsewhere. No per-product OG — there is no detail page
- `sitemap.ts` and `robots.ts` — include the routes above, not a slug
  pattern for products
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

- Alt text on every image (from the `media.alt` field — check the client
  understands to fill it)
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

### Client account

- Create her Payload user with a real password, delivered securely
- Confirm the admin renders in **Persian** for her account
- Delete or secure any temporary dev accounts

### Pre-launch content

Sit with the client (or do it for her) to seed:

- Site settings fully populated
- Real products in the categories she actually sells, with photos. Empty
  categories stay hidden — do **not** invent filler so that all 10 chips
  appear
- 6+ gallery images
- About text in her own voice

An empty site at launch reads as broken and invites immediate calls.

### `context/client-handoff.md` — the deliverable

A short guide **written in Persian**, with screenshots, covering exactly:

1. ورود به پنل مدیریت — the `/admin` URL and how to log in
2. اضافه کردن محصول جدید — including uploading a photo and setting a price
3. تغییر قیمت یک محصول
4. «استعلام قیمت» — what the checkbox does
5. پنهان کردن محصولی که تمام شده — the `isAvailable` checkbox (it greys
   the listing card and drops the product from the order form; it does
   not delete the product)
6. اضافه کردن عکس به گالری
7. دیدن سفارش‌ها و تغییر وضعیت آن‌ها
8. تغییر شماره تماس، واتساپ و اینستاگرام
9. عکس خوب چیست — square-ish, good light, under ~5MB
10. اگر مشکلی پیش آمد — what to check first

Rules for this document:

- Persian, plain language, **no technical vocabulary** — no "CMS",
  "collection", "field", "deploy"
- One screenshot per step
- Short numbered steps, one action each
- Delivered as a PDF as well as the markdown file — she will not browse
  a repo

Optionally record a 5-minute screen capture walking through the same
steps. Video costs almost nothing to make and prevents more calls than
the document.

## Verification

- Lighthouse mobile ≥ 90 performance and accessibility
- All meta tags and OG images correct (test with a link preview tool)
- `sitemap.xml` and `robots.txt` resolve in production and do not list
  product detail URLs
- A real order submitted on production arrives by email and in `/admin`
- Image upload from the client's **phone** works in production
- The client logs in and successfully adds one product unaided — this is
  the real acceptance test
- Unchecking «موجود است» greys the product on `/products` and removes it
  from the `/order` select
- Every page correct at 375 / 768 / 1280px in RTL
- `pnpm build` and `pnpm lint` pass

## Notes

- Watch the client use the admin once, without helping. Whatever confuses
  her is a label to rewrite or an `admin.description` to add — fix it now,
  while it's cheap.
- Agree explicitly on what counts as a paid change (new pages, new
  features) versus content she handles herself. Setting that boundary at
  handoff is what keeps the project profitable.
- A product detail page is a paid extra: it needs a long-description
  field the current schema does not have.

## References

- @context/project-overview.md
- @TEMPLATE-README.md
- @context/features/phase-2-cms-schema-spec.md
- @context/features/phase-4-products-spec.md
- @context/features/phase-5-order-form-spec.md
- @context/ai-interaction.md
