# Phase 3 — Homepage Spec

## Overview

Phase 3 of 7. Build the homepage plus the shared site shell (header, footer,
WhatsApp button) that every later page reuses.

Corresponds to section ۱ of the client brief. Every piece of content comes from
the CMS — nothing hardcoded.

## Requirements

### Shared shell (built here, reused everywhere)

**Header**
- Brand name from `site-settings.brandName`
- Nav: خانه / محصولات / گالری / درباره من / تماس با ما
- Mobile: hamburger → slide-in drawer from the **right** (RTL)
- Sticky on scroll

**Footer**
- Brand name and tagline
- Contact links (phone, WhatsApp, Instagram)
- Service area
- Copyright with the current Persian year

**Floating WhatsApp button**
- Fixed bottom-**left** in RTL (visually opposite the natural reading corner)
- Visible on every page
- Links to `https://wa.me/{whatsapp}`
- Hidden if `whatsapp` is empty

### Homepage sections

**1. Hero**
- Full-bleed `heroImage` from site settings, `priority` loading
- `brandName` as `<h1>`
- `tagline` beneath it
- Two CTAs: **ثبت سفارش** → `/order` (primary), **واتساپ** → wa.me (secondary)
- Dark overlay/gradient so text stays legible over any photo she uploads
- Full viewport height on desktop, ~70vh on mobile

**2. Category grid**
- All 7 categories as cards, each linking to `/products?category={value}`
- Emoji + Persian name
- 2 columns mobile, 3–4 desktop

**3. Featured products**
- Products with `isFeatured` true, ordered by `sortOrder`, limit 6
- Reuse `ProductCard` from phase 4 — build it here if phase 4 hasn't run yet
- "مشاهده همه محصولات" link → `/products`
- Hide the whole section if nothing is featured

**4. About teaser**
- First ~2 lines of `aboutText`
- "بیشتر بخوانید" → `/about`

**5. Contact strip**
- Phone, WhatsApp, Instagram, service area
- Tappable `tel:` and `wa.me` links

### Data fetching

One server component, Payload Local API, fetch settings and featured products in
parallel:

```ts
const payload = await getPayload({ config })
const [settings, featured] = await Promise.all([
  payload.findGlobal({ slug: 'site-settings' }),
  payload.find({
    collection: 'products',
    where: { isFeatured: { equals: true }, isAvailable: { equals: true } },
    sort: 'sortOrder',
    limit: 6,
  }),
])
```

Static render with `revalidate`; on-demand revalidation comes in phase 4.

### Empty states

The client will publish before filling everything in. None of these may crash:

- No `heroImage` → solid brand-colour background
- No `tagline` → omit the line
- No featured products → hide the section
- No `aboutText` → hide the teaser
- No `instagram`/`whatsapp` → hide just that link

## Verification

- Renders correctly at 375 / 768 / 1280px
- RTL: nav reads right-to-left, mobile drawer opens from the right, nothing mirrored
- Editing `brandName` or `tagline` in `/admin` updates the page
- Clearing every optional field still renders a valid page
- Hero image is optimised via `next/image` and doesn't cause layout shift
- WhatsApp button opens a chat with the right number
- `pnpm build` and `pnpm lint` pass

## Notes

- Photography is the selling point — let images dominate, keep UI restrained
- Hero image must be `priority`; it's the largest contentful paint
- Header/footer/WhatsApp button belong in `(site)/layout.tsx`, not the page

## References

- @context/project-overview.md
- @context/features/phase-2-cms-schema-spec.md
- @context/features/phase-4-products-spec.md
- @context/coding-standards.md
