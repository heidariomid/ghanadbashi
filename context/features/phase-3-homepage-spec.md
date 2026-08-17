# Phase 3 — Homepage Spec

## Overview

Phase 3 of 7. Build the homepage plus the shared site shell (header, footer,
WhatsApp button) that every later page reuses.

Corresponds to section ۱ of the client brief. Every piece of content comes from
the CMS — nothing hardcoded.

**Mostly built already.** Phase 0 shipped the shell and every homepage section
against the approved design, reading from `src/data/content.ts`. The work left
in this phase is swapping that data source for the Payload Local API and adding
empty-state handling — the markup should barely change.

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

Superseded by the approved design — the original full-bleed, dark-overlay hero
is **not** what the client signed off on. Build what the design shows.

**1. Hero** — two columns, text and portrait side by side
- `heroImage` as a 4:5 portrait with a large radius and a warm shadow,
  `priority` loading. No full-bleed, no dark overlay, no text over photo
- A blush blob tucked behind the portrait, spilling past its start edge
- A small card overlapping the portrait's bottom corner («پخت روز · تحویل در …»)
- Eyebrow line, `brandName` as `<h1>` at weight 900, `tagline` beneath
- Two CTAs: **ثبت سفارش** (primary), **مشاهده محصولات** (outline)
- Stacks to one column below `lg`

**2. Category grid**
- All 7 categories as cards, each linking to `/products?category={value}`
- Square photo, Persian name, one-line description
- **2 columns on mobile** — seven full-width squares is far too much scrolling —
  then `auto-fit` from `sm` up

**3. Featured products**
- Products with `isFeatured` true, ordered by `sortOrder`, limit 6
- On a `card` background band, 4:5 photos, price and unit, a thin underlined
  link rather than a heavy button
- One column on mobile: these are the money shots, keep them big
- "مشاهده همه محصولات" link → `/products`
- Hide the whole section if nothing is featured

**4. Gallery teaser**
- Multi-column masonry with varied ratios from `lg`; a uniform square grid below
  that, or the rows read as ragged on a phone

**5. About**
- `aboutText` beside a 4:5 portrait, plus the four value cards
- "بیشتر بخوانید" → `/about` if the full page exists

**6. Order CTA**
- Full-width blush band, centred, two buttons and the three ordering steps

**7. Contact strip**
- Phone, WhatsApp, Instagram, service area
- Tappable `tel:` and `wa.me` links, `dir="ltr"` on the numbers
- Persian digits for phone numbers only — never for handles like
  `@ghanad_bashi_asal5`

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
- Keep the footer to one line: wordmark and credit. A footer nav duplicates the
  header and only adds height
- The floating WhatsApp button overlaps a short footer on phones — reserve
  bottom padding there

## References

- @context/project-overview.md
- @context/features/phase-2-cms-schema-spec.md
- @context/features/phase-4-products-spec.md
- @context/coding-standards.md
