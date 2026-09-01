# Phase 5 — Order Form Spec

## Overview

Phase 5 of 8. The order form at `/order`. Corresponds to section ۳ of the client
brief — and it is the site's single conversion point, so it must be simple and
must never silently fail.

Submissions are saved to the CMS **and** emailed. Both, deliberately: email is
what she'll actually notice; the CMS record is the durable copy if she deletes
the email.

Phase 4 left order controls on WhatsApp and `/#order` so it would not ship a
dead `/order` link. This phase builds the form **and** switches those controls
over.

The layout chrome already lives in `(site)/layout.tsx`. `/order` only renders
the form in `<main>`.

## Requirements

### Fields

Exactly the client's list — نام، شماره تماس، محصول، تعداد، تاریخ تحویل،
توضیحات، عکس نمونه. Resist adding more; every extra field costs conversions.

| Field | Persian label | Type | Required |
| --- | --- | --- | --- |
| `customerName` | نام و نام خانوادگی | text | ✅ |
| `phone` | شماره تماس | tel | ✅ |
| `items` | اقلام سبد | array of product + quantity | ✅ (or «سایر») |
| `deliveryDate` | تاریخ تحویل | date | ✅ |
| `notes` | توضیحات | textarea | ❌ |
| `sampleImage` | عکس نمونه | file | ❌ |

**سبد سفارش (not a checkbox list on `/order`)**
- Available products on `/` featured cards and `/products` have «افزودن به سبد». Quantity is per product. Unavailable products stay greyed with no add control
- Header bag icon opens a drawer to review, change qty, remove. «ادامه سفارش» goes to `/order`
- `/order` is checkout: review the basket, then name / phone / date / notes / photo. «سایر / مورد دیگر» stays here for items not in the catalog
- `?product={slug}` adds that **available** product to the basket if missing. Unknown slug → checkout still works
- CMS `items` is an array of `{ product, quantity }`. `productNote` + `otherQuantity` hold the free-text line. No site-wide quantity field
- Cart lives in `localStorage` (`ghanadbashi-cart`). Server re-validates IDs and availability on submit

**تاریخ تحویل** — Jalali. Use `react-multi-date-picker` with the
`persian`/`persian_fa` locale. Store the submitted Jalali string as-is in
`deliveryDate` (a text field) — no Gregorian conversion, since the client reads
these dates herself and round-tripping is a needless failure mode.

**عکس نمونه** — images only, **4MB** server cap, browser compress before
submit, client-side preview, clearable. The brief calls for this explicitly:
customers often want a cake copied from a photo. Set `alt` in the action (the
customer does not type it). `media` create is admin-only; the action uploads
via the Local API.

### Validation

Zod schema in the server action — the source of truth. Client-side checks are UX
only.

- `customerName` — 2–100 chars, trimmed
- `phone` — Iranian mobile: `/^09\d{9}$/` after stripping spaces and dashes, and
  normalising Persian/Arabic digits to Latin. **Accept the Persian digits users
  actually type** — this is the most common submission failure.
- `items` — one or more valid **available** product IDs with per-line quantity, and/or free text when «سایر»
- Line quantity — integer ≥ 1, ≤ 1000
- `deliveryDate` — non-empty
- `notes` — max 1000 chars
- `sampleImage` — image mime type, ≤ 4MB

All messages in Persian, e.g. «شماره تماس معتبر نیست».

Put `toLatinDigits` in `src/lib/format.ts` next to `faNumber` — do not add a
new file for one function.

### Server action

`submitOrder` in `src/actions/orders.ts`, returning `{ success, data, error }`:

1. Honeypot — a hidden `website` field; if filled, return success without
   saving (silently drop the bot)
2. Per-IP rate limit → Persian error if exceeded
3. Validate with Zod → return field errors on failure
4. Upload `sampleImage` to `media` if present (Local API; set `alt` in code)
5. Create the `orders` record via the Local API
6. Email the client via Resend
7. Return success

`orders` and `media` collection `create` is **admin-only**. The action writes
with the Local API. Anonymous `POST /api/orders` must 403.

**Email failure must not fail the submission.** Wrap the send in its own
try/catch: if the order is saved but the email bounces, the customer still sees
success and the record is safe in the admin. Log the failure.

Notification address comes from env (`ORDER_NOTIFICATION_EMAIL` or similar),
not a hardcoded inbox and not a new CMS field.

### Notification email

- To: the env address; subject: «سفارش جدید از {نام مشتری}»
- Persian, RTL HTML body, all submitted fields
- `tel:` link on the phone number so she can call from her phone
- Sample image attached or linked
- Link to the order in `/admin`

### UX

- Single column, generous tap targets (≥44px), `inputMode="tel"` on phone
- Submit disabled while pending, with a spinner and «در حال ارسال...»
- Success: replace the form with a confirmation — «سفارش شما ثبت شد. به زودی با
  شما تماس می‌گیریم.» No WhatsApp (or SMS) to the customer — she contacts them.
- Error: a Persian message at the top of the form, **with the entered values
  preserved**. Never make someone retype an order.
- Field errors inline beneath each field
- `generateMetadata` — Persian title and description

### Switch existing CTAs onto `/order`

| Control | After Phase 4 | Phase 5 |
| --- | --- | --- |
| Listing card, available | WhatsApp with product name | «افزودن به سبد» on the card |
| Listing card, unavailable | no link | unchanged |
| Featured card, available | `/#order` | «افزودن به سبد» on the card |
| Featured card, unavailable | `#order` | no add control |
| Header / hero «ثبت سفارش» | `/#order` | `/order` |
| Homepage order band primary | WhatsApp | `/order` always — update the `content.ts` label off «ثبت سفارش در واتس‌اپ». Keep `id="order"`. No extra WhatsApp button on the band |
| Homepage order band secondary | Phone | unchanged |

Do not leave listing cards pointing at WhatsApp once the form exists — that
splits the conversion path.

### Revalidation

Extend the Phase 4 hooks:

- `products` afterChange / afterDelete also `revalidatePath('/order')` — checkout
  metadata and `?product=` lookup change
- `site-settings` afterChange also `revalidatePath('/order')` — metadata
  reads the brand name

### Anti-spam

- Honeypot field (primary)
- Basic per-IP rate limit on the action
- No CAPTCHA — it costs conversions on a low-traffic site

## Verification

- Valid submission → record in `/admin` + email received
- Invalid phone → inline Persian error, nothing saved
- **Persian digits in the phone field are accepted**
- `?product=` of an available slug adds that product to the basket
- `?product=` of an unknown or unavailable slug does not add anything
- Unavailable products cannot be added to the basket
- «سایر» on checkout reveals the free-text field
- Image upload previews, rejects >4MB and non-images
- Anonymous `POST /api/orders` → 403; form submit still creates a row
- Jalali date picker works on mobile and stores the shown date
- Simulated email failure → order still saved, user still sees success
- Honeypot submission is silently dropped
- Form values survive a server error
- Listing and featured available buttons add to the basket
- Header «ثبت سفارش» lands on `/order`
- `/order` has Header, Footer and the WhatsApp float
- 375 / 768 / 1280px; RTL correct
- `pnpm build` and `pnpm lint` pass

## Notes

- Cart provider wraps the site layout. Listing/featured add buttons are client
  islands. `/order` stays a server page around the checkout form.
- Digit normalisation is Persian/Arabic → Latin for input. Display still uses
  `toLocaleString('fa-IR')` / `faNumber`
- Customer email on وضعیت change is Phase 8.
  See @context/features/phase-8-order-status-email-spec.md
- SMS to her and to the customer on submit is Phase 10a; customer SMS on
  وضعیت change is Phase 10b.
  See @context/features/phase-10a-new-order-sms-spec.md

## References

- @context/project-overview.md
- @context/features/phase-2-cms-schema-spec.md
- @context/features/phase-4-products-spec.md
- @context/coding-standards.md
