# Phase 4 — Products Spec

## Overview

Phase 4 of 7. The product listing with category filters, and the product detail
page. Corresponds to section ۲ of the client brief.

Also sets up **on-demand revalidation** — the mechanism that makes the client's
edits appear on the live site immediately.

## Requirements

### `/products` — listing

- All products where `isAvailable` is true, sorted by `sortOrder`
- Category filter as a horizontal scrollable row of chips: «همه» + the 7 categories
- Filter state lives in the URL: `/products?category=birthday-cakes`
  - Shareable, back-button friendly, and server-rendered
  - Implement by reading `searchParams` in the server component — **not** client
    state
- Active chip visually distinct
- Grid: 1 column mobile, 2 tablet, 3 desktop
- Empty state per category: «فعلاً محصولی در این دسته موجود نیست»

### `ProductCard`

Shared with the homepage. Per the client brief — photo, short description, price
or price-on-request, order button:

- Image via `next/image`, 4:3, `object-cover`, lazy except the first row
- Title
- `description`, clamped to 2 lines
- Price: `price.toLocaleString('fa-IR')` + « تومان», or «استعلام قیمت» when
  `priceOnRequest`
- **سفارش** button → `/order?product={slug}`
- Whole card links to the detail page; the order button stops propagation
- If `isAvailable` is false: greyscale image + «فعلاً موجود نیست» badge, order
  button disabled

### `/products/[slug]` — detail

- Large image
- Title, category chip (links back to that filter)
- Full description
- Price or «استعلام قیمت»
- **ثبت سفارش** primary button → `/order?product={slug}`
- WhatsApp secondary button, message pre-filled with the product name
- "محصولات مشابه" — up to 3 more from the same category
- `generateStaticParams` for all slugs
- `generateMetadata` — title, description, OG image from the product photo
- Unknown slug → `notFound()`

### Revalidation

This is what stops the client from calling to ask why her edit isn't showing.

- Static render both routes
- Payload `afterChange` and `afterDelete` hooks on `products` call
  `revalidatePath('/products')`, `revalidatePath('/products/[slug]', 'page')`
  and `revalidatePath('/')`
- Also revalidate `/` on `site-settings` change
- Fallback `revalidate = 3600` in case a hook fails

### Data fetching

```ts
const { docs } = await payload.find({
  collection: 'products',
  where: {
    isAvailable: { equals: true },
    ...(category ? { category: { equals: category } } : {}),
  },
  sort: 'sortOrder',
  limit: 100,
  depth: 1,
})
```

`depth: 1` resolves the image upload without over-fetching. No pagination — a
home bakery will not exceed 100 products, and infinite scroll is complexity the
project doesn't need.

## Verification

- All 7 category filters return the right products
- Filter state survives a page refresh and the back button
- Prices render in Persian digits
- «استعلام قیمت» shows when the checkbox is set, with no price
- Unavailable products appear greyed with the order button disabled
- Order button lands on `/order` with the product pre-selected
- Editing a product in `/admin` updates the live page **without a redeploy**
- Unknown slug returns 404
- Responsive at 375 / 768 / 1280px; RTL correct
- `pnpm build` and `pnpm lint` pass

## Notes

- URL-based filtering keeps the page a server component — no client JS for
  filtering, better SEO, shareable links
- The category list is defined once in `src/lib/categories.ts` and imported by
  the Payload schema, the filter chips and the homepage grid. One source of truth.

## References

- @context/project-overview.md
- @context/features/phase-2-cms-schema-spec.md
- @context/features/phase-3-homepage-spec.md
- @context/features/phase-5-order-form-spec.md
