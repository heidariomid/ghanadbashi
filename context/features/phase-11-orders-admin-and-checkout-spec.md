# Phase 11 — Orders Admin & Checkout Loading

## Overview

Four small, related fixes the baker and her customers feel every day. Nothing
new is sold; the inbox and the path into checkout just become usable.

1. The سفارش‌ها list shows **شماره سفارش** — the same number SMS already sends
2. One search box finds an order by **name, phone, or that number**
3. Admin success toasts are **green**, not the rose we painted over success
4. Cart → `/order` shows **loading** immediately, and the hop is faster

No new collection. No new public field. No SMS, email, or status-flow change.

## Why this phase

She already has an order number: Payload `id`, the same integer 10a puts in
`#ORDER#`. The list hides it (`defaultColumns` is name, phone, date, status)
and the search box only looks at `useAsTitle` (`customerName`). A customer
texts «سفارش ۱۴۲» and she cannot find 142 without opening rows.

Success toasts look like errors because the admin theme remapped every
`--theme-success-*` token onto blush/rose. Payload's toast uses those tokens.
The save still works; the colour lies.

`/order` has no `loading.tsx`. The cart checkout control is a plain `<a>` that
closes the drawer on click. The customer stares at the previous page until the
RSC payload arrives, then the form pops in. Prefetch + a route-level loading
state is the whole fix.

## Requirements

### 1. شماره سفارش column

`src/collections/Orders.ts`. The number is derived from `id`, not a second database sequence:
`1000 + id` (Shopify/Woo-style 1001, 1002, …). SMS, email and the admin
all show that public number. Search accepts it (Persian or Latin digits)
and still matches a leftover raw `id` from older SMS.

- Put `id` first in `defaultColumns`:
  `['id', 'customerName', 'phone', 'deliveryDate', 'status']`
- The column header must read **شماره سفارش**, not `ID`. If Payload will not
  take a label on the implicit `id`, add a read-only text field `orderNumber`
  (`label: 'شماره سفارش'`) written once after create (`String(doc.id)`), show
  that column instead, and keep it in sync with the SMS `ORDER` value
- List cells show the Latin id as Persian digits (`toLocaleString('fa-IR')` /
  `faNumber`) so the row matches what she sees in the SMS
- Detail view: she must see the same number without opening a hidden column.
  Sidebar or header is fine; do not make it editable
- Existing rows keep their current `id`. No backfill job unless a new stored
  field is required — then fill it from `id` in the migration

No change to how `submitOrder` or SMS build the number.

### 2. Search — name, phone, or order number

Payload already has a list search box. `products` and `categories` set
`listSearchableFields`; `orders` does not, so today it only searches
`customerName`.

```
admin: {
  listSearchableFields: ['customerName', 'phone'],
}
```

That is not enough for شماره سفارش:

- Payload's default search uses `like` / `contains` on text. Integer `id`
  will not match «142» that way
- She types Persian digits. The stored phone is Latin `09xxxxxxxxx`. The id
  is a number. Search must run `toLatinDigits` on the query first
- A query that is all digits after normalisation must also match
  `id equals N` (and `phone contains` that string, so a partial mobile still
  works)

If `listSearchableFields` alone cannot do the id / digit part, add a
`beforeOperation` on `find` that ORs those constraints into `args.args.where`.
Do **not** build a custom list view.

One box. No extra filters, no «جستجو بر اساس» dropdown. Placeholder /
description in Persian if Payload lets us set one, e.g. «نام، موبایل یا شماره
سفارش».

Phone search is substring on the stored value. Names are substring. Order
number is exact after digit normalisation (leading zeros stripped). Empty
search = full newest-first list, unchanged.

### 3. Success toasts are green

Root cause is already in `src/app/(payload)/custom.scss`: both light and dark
`--theme-success-*` scales were copied from rose so the admin would look
on-brand. Payload toasts, success banners and the green check use those
tokens, so «با موفقیت ذخیره شد» renders red.

- Restore a real green success scale on `html[data-theme='light']` and
  `html[data-theme='dark']`
- Do **not** change `--theme-error-*`. Errors stay red
- Leave primary / rose on buttons, nav indicator, focus rings, selection.
  Success is a status, not a brand fill
- Light: a calm green surface and a green that clears 4.5:1 on parchment for
  the toast text. Dark: the same idea on the black ground
- Verify by saving an order status and a product — the toast is green, the
  error toast (forced validation fail) stays red, primary buttons stay rose

No JS toast library. Payload's existing toast is the one she sees.

### 4. Cart → `/order` feels instant and shows loading

Two gaps, both in the public site:

| Today | After |
| --- | --- |
| `CartDrawer` checkout is `<a href="/order" onClick={close}>` | `next/link` with prefetch |
| Drawer closes, then a silent wait | Button shows pending; route shows a loading UI |
| No `loading.tsx` anywhere | `src/app/(site)/order/loading.tsx` |

**Faster**

- Prefetch `/order` when the cart has items (drawer open is enough; header bag
  is better if cheap). `Link` from `next/link` does this on viewport; the
  drawer is off-canvas so prefetch explicitly
- Do not add Payload queries to the no-`?product=` path — `order/page.tsx`
  already skips `findAvailableProduct` when there is no slug
- Keep the checkout control as a client-side navigation, not a full reload

**Loading**

- `order/loading.tsx` — same page chrome (the `(site)` layout already wraps
  it), a centered spinner and «در حال بارگذاری سبد…» (or the existing cart
  wording). Persian, RTL, ≥44px tap-target space, no layout jump vs the form
- The checkout button itself enters a pending state on click («در حال
  انتقال…» + the same spinner pattern `OrderForm` already uses) so feedback
  starts before the route UI paints
- Do not close the drawer and leave a frozen homepage. Either keep the drawer
  open until the route is showing, or close it *with* the pending label still
  visible. Closing into a blank page is the bug
- `prefers-reduced-motion`: spinner may stop; the text stays

Header / hero «ثبت سفارش» already points at `/order`. If those are `<a>` too,
switch them to `Link` so the same prefetch applies. Do not change the submit
action on the form — this item is the **navigation into** checkout, not
`submitOrder`.

Copy lives in `content.ts` (`cart.checkoutPending`, `orderForm.loading`). Do
not hardcode the Persian strings in the JSX.

## Out of scope here

- Status-change SMS / email (10b, Phase 8)
- Phone OTP (10c)
- A public «پیگیری سفارش» page
- Changing how order numbers are assigned
- A second search UI, date filters, or export
- Reworking the admin theme beyond the success tokens
- Speeding up `submitOrder` itself (SMS `maxDuration` stays)

## Verification

**Admin — سفارش‌ها**

- List shows شماره سفارش as the first column; the number matches the SMS
  `#ORDER#` and the row id
- Search «سارا» → her orders. Search the mobile (Latin or Persian digits) →
  the same row. Search the order number (Latin or Persian digits) → that row
  only
- Empty search → newest first, same as today
- Opening a row still shows name, phone, items, status; status is still the
  only editable field

**Admin — toast**

- Save وضعیت on an order → green toast, not rose/red
- Save a product → same green
- Trigger a validation error → toast/message stays red/error
- Primary buttons and the nav pill stay rose

**Public site**

- Cart has items → tap «ادامه سفارش» → pending state on the button, then the
  `/order` loading UI, then the form. No silent freeze on the homepage
- Second visit in the same session is faster (prefetch)
- `?product=` still seeds the basket
- 375 / 768 / 1280px; RTL correct
- `pnpm lint` and `pnpm build` pass

## Notes

- Phase 5 built the basket and `/order`; 10a started printing `id` as the
  order number in SMS. This phase only makes that number findable
- `toLatinDigits` already lives in `src/lib/format.ts` — reuse it for admin
  search, do not add a second mapper
- Schema change only if a stored `orderNumber` field is required. Then
  `pnpm migrate:create` and `pnpm generate:types`, both committed
- The admin is a product. Column header, search hint and loading copy are
  Persian

## References

- @context/features/phase-2-cms-schema-spec.md
- @context/features/phase-5-order-form-spec.md
- @context/features/phase-10a-new-order-sms-spec.md
- @context/project-overview.md
- @context/coding-standards.md
