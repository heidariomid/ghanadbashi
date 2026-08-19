# Phase 4 — Products Spec

## Overview

Phase 4 of 7. The product listing with URL category filters. Corresponds to
section ۲ of the client brief.

Also sets up **on-demand revalidation** and lifts Header, Footer and the
WhatsApp float into the site layout so `/products` is a real page, not a
naked route.

**Do not build `/products/[slug]`.** The CMS has one photo and a 200-character
`description`. A detail page would clone the card. Leave it until the client
asks, or until a dedicated long-description field exists.

**Do not build `/order`.** That is Phase 5. Live CTAs already go to WhatsApp
via `#order`. Phase 4 must not ship links to a missing route.

## Requirements

### Site chrome — layout

Phase 3 left Header, Footer and `WhatsAppFloat` on the homepage only. Move
them into `src/app/(site)/layout.tsx` so every public route gets the same
shell. The homepage then renders only its `<main>` sections.

Update links so they work from `/products`, not only from `/`:

| Control | Now | Phase 4 |
| --- | --- | --- |
| Wordmark | `#top` | `/` |
| Nav «محصولات» | `#products` | `/products` |
| Nav «نمونه کارها» / «درباره ما» / «تماس» | `#gallery` / `#about` / `#contact` | `/#gallery` / `/#about` / `/#contact` |
| Header «ثبت سفارش» | `#order` | `/#order` until Phase 5 |
| Hero «مشاهده محصولات» | `#products` | `/products` |
| Featured «مشاهده همه محصولات» | missing | add a link to `/products` |

**Homepage category cards stay on the gallery.** They are built from gallery
photos and say «N نمونه کار». A category can have photos and no products. Do
not retarget them to `/products?category=`. Point them at `/#gallery` if the
href must work from other pages; `#gallery` is enough while they only render
on `/`.

### `/products` — listing

- Every product, **including unavailable**, sorted by `sortOrder`
- Category chips: «همه» plus only categories that currently have products,
  ordered by `sortByCategoryOrder` from `src/lib/categories.ts` (10 categories
  exist; empty ones stay hidden until the client adds a product)
- Filter state lives in the URL: `/products?category=birthday-cakes`
  - Shareable, back-button friendly, server-rendered
  - Read `searchParams` in the server page (`await` it — Next.js 16) — **not**
    client state
  - Chips are plain links (`/products`, `/products?category=cookies`)
- Unknown or empty `?category=` → empty state, not a crash; no chip active
- Active chip visually distinct
- Grid matches the homepage featured row (auto-fit, photography-led), not a
  new 4:3 system
- Per-category empty state: «فعلاً محصولی در این دسته نیست»
- No products at all: the same idea at page level, not a broken grid
- `generateMetadata` — Persian title and description for the listing

The page is **dynamically server-rendered** because it reads `searchParams`.
Do not claim it is static. Keep the filter on the server anyway.

### Listing card

Same visual language as `FeaturedProducts` — 4:5 `Photo`, title, short
description, price. Share `faPrice`, `resolveImage` and `Photo`. **Do not**
extract a shared `ProductCard` that restyles the approved homepage cards.

- Image via `next/image` / `Photo`, `object-cover`, 4:5
- `priority` on the first image only (the likely LCP). Everything else lazy
- Title
- `description` when present; clamp to 2 lines so the grid stays even
- Price: `faPrice(price)`, or «استعلام قیمت» when `priceOnRequest` or `price`
  is null
- The card is **not** a link (there is no detail page)
- Available: order control is a WhatsApp link with the product name
  pre-filled (`wa.me/{number}?text=…`). If `whatsapp` is empty, hide the
  control. **Not** `/order`
- Unavailable: greyscale image, «فعلاً موجود نیست» badge, no order link
- Skip a row with no resolvable image, same as the homepage
- Two sibling controls are fine; a link inside a link is not. No
  `stopPropagation`, no client JS for this

Unavailable products stay on the listing so the admin checkbox does what its
description says. Phase 5 excludes them from the order-form select.

### Out of scope

- `/products/[slug]` and related products
- A long-description or extra-image CMS field
- `/order` and `?product=` preselect
- Forcing homepage featured cards through a new shared component
- Pagination or infinite scroll
- Retargeting homepage category cards to `/products`

### Revalidation

This is what stops the client from calling to ask why her edit isn't showing.

- Payload `afterChange` and `afterDelete` on `products`:
  `revalidatePath('/')` and `revalidatePath('/products')`
- `afterChange` on `site-settings`: the same two paths — listing WhatsApp
  buttons and the layout chrome read those settings
- Replace the homepage `revalidate = 60` with on-demand hooks plus a
  `revalidate = 3600` fallback on `/` if a hook fails
- A `revalidate` fallback on `/products` is optional; the page is already
  dynamic from `searchParams`

### Data fetching

One query, then filter in the server component so chips can be derived from
the full set:

```ts
const { docs } = await payload.find({
  collection: 'products',
  sort: 'sortOrder',
  limit: 100,
  depth: 1,
})
```

Do **not** add `isAvailable: { equals: true }`. Apply `?category=` after the
fetch (or as a second `where` only if you also have a chips query). `depth: 1`
resolves the image upload without over-fetching. No pagination — a home bakery
will not exceed 100 products, and infinite scroll is complexity the project
doesn't need.

## Verification

- Chips show only categories that have products; empty categories stay hidden
- Each chip returns the right products; «همه» returns the full list
- Unavailable products appear in the list, greyed, with no order link
- Filter state survives a refresh and the back button
- `?category=not-a-real-value` shows the empty state, no crash
- Prices render in Persian digits via `faPrice`
- «استعلام قیمت» shows when the checkbox is set, with no price
- Available order control opens WhatsApp with the product name; it does **not**
  go to `/order`
- Clearing `whatsapp` in `/admin` hides listing order links and the float
- Editing a product or site settings in `/admin` updates `/` and `/products`
  **without a redeploy**
- `/products` has Header, Footer and the WhatsApp float
- Wordmark and homepage section nav work from `/products`
- Homepage category cards still go to the gallery, not `/products`
- Hero «مشاهده محصولات» and featured «مشاهده همه محصولات» go to `/products`
- Responsive at 375 / 768 / 1280px; RTL correct
- `pnpm build` and `pnpm lint` pass

## Notes

- URL chips keep the page a server component — no client JS for filtering,
  better SEO, shareable links
- Labels and chip order come from `src/lib/categories.ts`. Which chips render
  comes from published products, not from a hardcoded list of 7
- Phase 5 switches available order controls to `/order?product={slug}` and
  keeps unavailable products out of the form select

## References

- @context/project-overview.md
- @context/features/phase-2-cms-schema-spec.md
- @context/features/phase-3-homepage-spec.md
- @context/features/phase-5-order-form-spec.md
