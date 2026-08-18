# Phase 3 — Homepage CMS Wiring

## Overview

Phase 3 of 7. **Narrow scope:** finish wiring the fields the client can already
edit in `site-settings` but the public site still ignores.

Phases 0 and 2 shipped the approved design, the full gallery (filter chips,
lightbox), category cards from published photos, featured products, and partial
CMS reads for hero name/tagline/image and about photo. Section headings and
marketing copy stay in `src/data/content.ts` — that is intentional; the client
does not edit those.

**Do not rebuild what already works.** No gallery teaser, no `/products`
routes, no layout refactor, no fetch consolidation unless it falls out naturally
while wiring contact.

## Already done (no Phase 3 work)

- Homepage layout and every section's markup
- Hero: `brandName`, `tagline`, `heroImage` from CMS
- Featured products, gallery, category grid from CMS collections
- About portrait from `site-settings.brand.aboutImage`
- `revalidate = 60` on the homepage
- Sticky header, RTL mobile drawer from the right, WhatsApp float position

## Requirements

### 1. Contact — wire `site-settings.contact`

These fields exist in the admin today. The site must read them everywhere contact
info appears:

| CMS field | Used in |
| --- | --- |
| `phone` | Contact strip, Footer (if shown), Header WhatsApp-adjacent links as needed |
| `whatsapp` | Contact strip, Footer, floating button, Order CTA secondary link |
| `instagram` | Contact strip, Footer |
| `serviceArea` | Contact strip, Footer |

**Link rules (unchanged from the design):**

- Phone → `tel:+98…` with Persian digits in the label (`faPhone`)
- WhatsApp → `https://wa.me/{whatsapp}` — number stored without `+` or leading zero
- Instagram → `https://instagram.com/{instagram}` — stored without `@`
- Phone and WhatsApp anchors get `dir="ltr"`; Instagram handle does **not** get
  digit localisation

**Hide-if-empty:** if `whatsapp` is blank, hide the floating button and the
WhatsApp row in Contact; if `instagram` is blank, hide that row only. Same for
Footer links.

Remove the hardcoded phone/WhatsApp/Instagram/service-area values from
`content.ts` once wired. Keep section eyebrow, title and description there.

### 2. About — wire `site-settings.brand.aboutText`

- Render `aboutText` (Lexical richText) in the About section instead of the
  hardcoded `paragraphs` array in `content.ts`
- Keep the four value cards, signature line, and section heading in `content.ts`
  for now — the client did not ask to edit those
- If `aboutText` is empty **and** `aboutImage` is missing, hide the whole About
  section
- If only one of text or image is present, render what exists

### 3. Empty states

The client may publish before every optional field is filled. None of these may
crash or show broken layout:

| Field empty | Behaviour |
| --- | --- |
| `heroImage` | Text column still renders; photo column shows a solid brand-colour placeholder (parchment/rosé), not a broken gap |
| `tagline` | Omit the tagline line — do not fall back to hardcoded copy |
| `aboutText` | Omit text block; keep image if present (see above) |
| `whatsapp` | Hide float button and WhatsApp links |
| `instagram` | Hide Instagram link only |
| `phone` | Hide phone row only |
| Featured products (none) | Hide section — **already works** |

Hardcoded fallbacks for `brandName` are OK on first deploy before seed runs;
optional CMS fields should not silently show stale `content.ts` values.

### 4. Footer polish

Expand the footer beyond wordmark + credit. Still one compact band — no footer
nav (duplicates the header):

- `brandName` and `tagline` from CMS
- Tappable contact links (phone, WhatsApp, Instagram) using the same link rules
- `serviceArea` as plain text
- Copyright line with the **current Persian calendar year**
  (`toLocaleString('fa-IR', { year: 'numeric' })`) — e.g. «۱۴۰۴»

Keep the extra bottom padding on phones so the floating WhatsApp button clears
the footer text.

### Header (small touch)

- `brandName` in the header should come from CMS (currently hardcoded in
  `content.ts`) so it stays in sync with hero/footer

WhatsApp in the header nav can stay as a link built from CMS `whatsapp` once
wired.

## Out of scope

- Moving Header/Footer/WhatsAppFloat into `(site)/layout.tsx`
- Single parallel Payload fetch on the page
- Category cards linking to `/products?category=…` — Phase 4
- Gallery teaser / masonry — Phase 2 shipped the full gallery instead
- «مشاهده همه محصولات» → `/products` — Phase 4
- Wiring Order CTA copy or section intros to CMS
- Featured product limit or `isAvailable` filter changes

## Verification

- Change `phone` / `whatsapp` / `instagram` / `serviceArea` in `/admin` →
  Contact, Footer, and float button update within ~60s
- Change `aboutText` in `/admin` → About section updates
- Clear `whatsapp` → float button and WhatsApp links disappear; page still valid
- Clear `tagline` → hero shows no tagline line
- Clear `heroImage` → placeholder shows, no layout shift
- Renders at 375 / 768 / 1280px; RTL unchanged
- `pnpm build` and `pnpm lint` pass

## Notes

- `content.ts` keeps static UI copy: nav labels, section headings, value cards,
  order steps. Only client-editable business facts move to CMS.
- Phase 2's single-page anchor nav (`#products`, `#gallery`, etc.) stays until
  Phase 4 adds routes.

## References

- @context/project-overview.md
- @context/features/phase-2-cms-schema-spec.md
- @context/features/phase-4-products-spec.md
- @context/coding-standards.md
