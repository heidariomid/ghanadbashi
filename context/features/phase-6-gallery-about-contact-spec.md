# Phase 6 — Gallery, About & Contact Spec

## Overview

Phase 6 of 7. Dedicated routes for sections ۴، ۵ و ۶ of the client brief.
The homepage already has a full gallery (chips + lightbox), an About section
wired to `aboutText` / `aboutImage`, and a Contact strip. This phase adds
`/gallery`, `/about` and `/contact` for nav and SEO — it does **not** rebuild
those sections.

Header, Footer and the WhatsApp float already live in `(site)/layout.tsx`
(Phase 4). These pages only render `<main>`.

## Requirements

### Nav

Phase 4 pointed the remaining items at homepage anchors so they worked from
`/products`. Switch them to the new routes:

| Control | After Phase 4 | Phase 6 |
| --- | --- | --- |
| Nav «نمونه کارها» | `/#gallery` | `/gallery` |
| Nav «درباره ما» | `/#about` | `/about` |
| Nav «تماس» | `/#contact` | `/contact` |

Homepage sections keep their `id`s. Category cards on `/` stay gallery-backed
and may keep `#gallery` / `/#gallery` — they are not a product index.

### `/gallery` — گالری

Reuse `GalleryGrid`. Do not write a second lightbox or a masonry layout.

- Same query as the homepage section: all `gallery` records, `sortOrder`,
  `depth: 1`, skip rows with no resolvable image
- Chips: «همه» plus only categories that have photos, ordered by
  `sortByCategoryOrder` (10 categories exist; empty ones stay hidden)
- Keep the existing client-side chip state — do not rebuild it as URL filters
- `next/image`, lazy below the fold; `priority` on the first image only
- Caption when present, same as today
- Lightbox behaviour is already implemented and correct (RTL: left arrow =
  next). Do not replace it
- Empty collection: the page shows «به زودی عکس‌های بیشتری اضافه می‌شود».
  The homepage section can keep hiding itself when empty
- `generateMetadata` — Persian title and description

### `/about` — درباره من

`aboutImage` already exists on `site-settings.brand`. Do not add a field and
do not fall back to `heroImage`.

- Render `aboutText` with the same Lexical path as the homepage About
- Portrait from `aboutImage` when present
- If **both** are empty: hide the body (or `notFound()`) — do not show a
  blank page with a heading
- If only one is present, render what exists
- Comfortable reading width (~65ch)
- CTA to `/products` and WhatsApp (hide WhatsApp if the number is empty)
- `generateMetadata`

### `/contact` — تماس با ما

All from site settings, each hidden when empty — same link rules as Phase 3:

- **Phone** — `tel:` link, Persian digits (`faPhone`)
- **WhatsApp** — `wa.me` link, optional greeting in `?text=`
- **Instagram** — `https://instagram.com/{handle}`, displayed as `@handle`
  (no digit localisation, no `dir="ltr"` on the handle)
- **Service area** — plain text
- Large tappable cards, not a dense list
- CTA to `/order` (the form exists from Phase 5)

No contact form here — the order form is the single conversion point.

`generateMetadata`.

### Revalidation

Extend the Phase 4 / 5 hooks. Do not start a second revalidation system.

- `gallery` afterChange / afterDelete: `revalidatePath('/')` and
  `revalidatePath('/gallery')`
- `site-settings` afterChange: also `/about` and `/contact` (it already
  covers `/`, `/products`, `/order`)

`/about` and `/contact` can be static with a `revalidate = 3600` fallback.
`/gallery` is static too if it does not read `searchParams`.

## Out of scope

- Rebuilding `GalleryGrid` or the lightbox
- URL-based gallery filters
- A new `aboutImage` field
- A contact form
- Product detail pages

## Verification

- `/gallery` renders the same photos and chips as the homepage section
- Lightbox opens/closes/navigates by click, keyboard and swipe; RTL arrows
  unchanged
- Empty gallery shows the empty state on `/gallery`; homepage section stays
  hidden
- `/about` uses `aboutText` and `aboutImage`, not the hero photo
- Clearing both about fields hides the about body
- Contact links work on a real phone (`tel:`, WhatsApp, Instagram)
- Every optional contact field, when blank, hides its element
- Nav from `/products` reaches `/gallery`, `/about`, `/contact`
- Adding a gallery image or editing site settings in `/admin` updates the
  live pages **without a redeploy**
- 375 / 768 / 1280px; RTL correct
- `pnpm build` and `pnpm lint` pass

## Notes

- The homepage stays a one-page scroll for Instagram visitors. The new routes
  exist so the header can leave `/` and so those URLs can be shared.
- Keep the lightbox hand-rolled; a carousel library is more weight than this
  needs.

## References

- @context/project-overview.md
- @context/features/phase-2-cms-schema-spec.md
- @context/features/phase-3-homepage-spec.md
- @context/features/phase-4-products-spec.md
- @context/features/phase-5-order-form-spec.md
- @context/coding-standards.md
