# Phase 6 — Gallery, About & Contact Spec

## Overview

Phase 6 of 7. The three remaining content pages — sections ۴، ۵ و ۶ of the
client brief. All content comes from the CMS.

## Requirements

### `/gallery` — گالری

The client's brief singles this out: *"customers choose with their eyes first."*
Treat image quality and load performance as the priority.

- All `gallery` records, sorted by `sortOrder`
- Masonry-style or fixed-aspect grid: 2 columns mobile, 3 desktop
- `next/image`, lazy below the fold, blur placeholder
- Caption below or on hover, when present
- **Lightbox** on click:
  - Full-size image, previous/next navigation
  - Close on Escape, backdrop click, or button
  - Arrow keys navigate; **in RTL, left arrow means next**
  - Swipe on touch
  - Lock body scroll while open
  - Only this component is `'use client'`
- Empty state: «به زودی عکس‌های بیشتری اضافه می‌شود»

### `/about` — درباره من

- `aboutText` (rich text) from site settings, rendered via the Lexical HTML converter
- Optional portrait — reuse `heroImage` or add an `aboutImage` field
- Warm, personal tone; comfortable reading width (~65ch)
- CTA to `/products` and WhatsApp
- Hide the page's body gracefully if `aboutText` is empty

### `/contact` — تماس با ما

All from site settings, each hidden when empty:

- **Phone** — `tel:` link, Persian digits
- **WhatsApp** — `wa.me` link, opens with a greeting pre-filled
- **Instagram** — `https://instagram.com/{handle}`, displayed as `@handle`
- **Service area** — plain text
- Large tappable cards with icons, not a dense list
- CTA to `/order`

No contact form here — the order form is the single conversion point, and a
second form splits attention.

### Shared

- All three reuse the header/footer/WhatsApp shell from phase 3
- `generateMetadata` per page
- Static render, revalidated by the same hooks as phase 4 (extend them to cover
  `gallery` → `/gallery`)

## Verification

- Gallery renders, lightbox opens/closes/navigates by click, keyboard and swipe
- RTL arrow direction is correct in the lightbox
- Rich text from the admin renders with correct RTL formatting
- Contact links work on a real phone (`tel:`, WhatsApp, Instagram)
- Every optional field, when blank, hides its element without breaking layout
- Empty gallery shows the empty state
- Adding a gallery image in `/admin` appears on the live site
- 375 / 768 / 1280px; RTL correct
- `pnpm build` and `pnpm lint` pass

## Notes

- The gallery is the client's portfolio — allow generously sized images but
  ensure `media` sizes from phase 2 keep payloads reasonable
- Keep the lightbox hand-rolled and minimal; a carousel library is more weight
  than this needs

## References

- @context/project-overview.md
- @context/features/phase-2-cms-schema-spec.md
- @context/features/phase-3-homepage-spec.md
- @context/coding-standards.md
