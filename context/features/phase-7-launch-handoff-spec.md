# Phase 7 — Launch & Client Handoff Spec

## Overview

Phase 7 of 7. Ship the site, hand it to the client, and make sure she never needs
to call you.

**This is the phase that determines whether the project was profitable.** It is
also the easiest to skip when the build feels finished — don't.

## Requirements

### SEO

- `generateMetadata` on every page — Persian titles and descriptions
- Root `metadata` with `metadataBase`, brand name template, `lang="fa"`
- OG image: the hero for the homepage, the product photo on product pages
- `sitemap.ts` and `robots.ts`
- JSON-LD `LocalBusiness` (name, phone, area served) plus `Product` on detail pages
- Persian slugs are fine — do not transliterate to English

### Performance

- Lighthouse mobile ≥ 90 on performance and accessibility
- Hero image `priority`; everything else lazy
- Confirm images are served as WebP at sensible sizes
- No layout shift on image load (explicit dimensions or aspect-ratio)
- Self-hosted font, `display: swap`, preloaded

### Accessibility

- Alt text on every image (from the `media.alt` field — check the client
  understands to fill it)
- Visible keyboard focus states
- Form labels properly associated
- Colour contrast ≥ 4.5:1 (watch the cream/caramel palette)
- Lightbox traps focus and is escapable

### Deployment

- Vercel project on the free tier
- Env vars set in production: `DATABASE_URI`, `PAYLOAD_SECRET`, `RESEND_API_KEY`,
  blob/R2 credentials. `NEXT_PUBLIC_SERVER_URL` is deliberately *not* set on
  Vercel — `payload.config.ts` derives it from `VERCEL_PROJECT_PRODUCTION_URL`,
  which follows the custom domain automatically.
- Custom domain + HTTPS
- Confirm image storage works in production (**local disk does not persist on
  Vercel** — this is the classic launch-day failure)
- Send a real test order end-to-end on production
- Confirm `/admin` is reachable and performs well on the client's phone

### Client account

- Create her Payload user with a real password, delivered securely
- Confirm the admin renders in **Persian** for her account
- Delete or secure any temporary dev accounts

### Pre-launch content

Sit with the client (or do it for her) to seed:

- Site settings fully populated
- At least 3 products per category, with real photos
- 6+ gallery images
- About text in her own voice

An empty site at launch reads as broken and invites immediate calls.

### `context/client-handoff.md` — the deliverable

A short guide **written in Persian**, with screenshots, covering exactly:

1. ورود به پنل مدیریت — the `/admin` URL and how to log in
2. اضافه کردن محصول جدید — including uploading a photo and setting a price
3. تغییر قیمت یک محصول
4. «استعلام قیمت» — what the checkbox does
5. پنهان کردن محصولی که تمام شده — the `isAvailable` checkbox
6. اضافه کردن عکس به گالری
7. دیدن سفارش‌ها و تغییر وضعیت آن‌ها
8. تغییر شماره تماس، واتساپ و اینستاگرام
9. عکس خوب چیست — square-ish, good light, under ~5MB
10. اگر مشکلی پیش آمد — what to check first

Rules for this document:

- Persian, plain language, **no technical vocabulary** — no "CMS", "collection",
  "field", "deploy"
- One screenshot per step
- Short numbered steps, one action each
- Delivered as a PDF as well as the markdown file — she will not browse a repo

Optionally record a 5-minute screen capture walking through the same steps.
Video costs almost nothing to make and prevents more calls than the document.

## Verification

- Lighthouse mobile ≥ 90 performance and accessibility
- All meta tags and OG images correct (test with a link preview tool)
- `sitemap.xml` and `robots.txt` resolve in production
- A real order submitted on production arrives by email and in `/admin`
- Image upload from the client's **phone** works in production
- The client logs in and successfully adds one product unaided — this is the
  real acceptance test
- Every page correct at 375 / 768 / 1280px in RTL
- `pnpm build` and `pnpm lint` pass

## Notes

- Watch the client use the admin once, without helping. Whatever confuses her is
  a label to rewrite or an `admin.description` to add — fix it now, while it's
  cheap.
- Agree explicitly on what counts as a paid change (new pages, new features)
  versus content she handles herself. Setting that boundary at handoff is what
  keeps the project profitable.

## References

- @context/project-overview.md
- @TEMPLATE-README.md
- @context/features/phase-2-cms-schema-spec.md
- @context/ai-interaction.md
