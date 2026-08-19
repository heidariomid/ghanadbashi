# Phase 5 — Order Form Spec

## Overview

Phase 5 of 7. The order form at `/order`. Corresponds to section ۳ of the client
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
| `product` | محصول | select | ✅ |
| `quantity` | تعداد | number | ✅ |
| `deliveryDate` | تاریخ تحویل | date | ✅ |
| `notes` | توضیحات | textarea | ❌ |
| `sampleImage` | عکس نمونه | file | ❌ |

**محصول select**
- Options from **available** products only (`isAvailable` is true), grouped by
  category, groups ordered via `sortByCategoryOrder`
- Unavailable products stay on `/products` (greyed) but do **not** appear here
- Plus a final «سایر / مورد دیگر» option that reveals a free-text input
- Pre-selected from `?product={slug}` when that slug is an **available**
  product. Unknown or unavailable slug → no preselect; the form still works
- `await searchParams` (Next.js 16). The page is dynamically server-rendered

**تعداد** — min 1, default 1

**تاریخ تحویل** — Jalali. Use `react-multi-date-picker` with the
`persian`/`persian_fa` locale. Store the submitted Jalali string as-is in
`deliveryDate` (a text field) — no Gregorian conversion, since the client reads
these dates herself and round-tripping is a needless failure mode.

**عکس نمونه** — images only, max 5MB, client-side preview, clearable. The brief
calls for this explicitly: customers often want a cake copied from a photo.
Public `media` create is already allowed for this (Phase 2).

### Validation

Zod schema in the server action — the source of truth. Client-side checks are UX
only.

- `customerName` — 2–100 chars, trimmed
- `phone` — Iranian mobile: `/^09\d{9}$/` after stripping spaces and dashes, and
  normalising Persian/Arabic digits to Latin. **Accept the Persian digits users
  actually type** — this is the most common submission failure.
- `product` — a valid **available** product ID, or free text when «سایر»
- `quantity` — integer ≥ 1, ≤ 1000
- `deliveryDate` — non-empty
- `notes` — max 1000 chars
- `sampleImage` — image mime type, ≤ 5MB

All messages in Persian, e.g. «شماره تماس معتبر نیست».

Put `toLatinDigits` in `src/lib/format.ts` next to `faNumber` — do not add a
new file for one function.

### Server action

`submitOrder` in `src/actions/orders.ts`, returning `{ success, data, error }`:

1. Validate with Zod → return field errors on failure
2. Honeypot check — a hidden `website` field; if filled, return success without
   saving (silently drop the bot)
3. Upload `sampleImage` to `media` if present
4. Create the `orders` record via the Local API
5. Email the client via Resend
6. Return success

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
  شما تماس می‌گیریم.» plus a WhatsApp button for follow-up (hide if
  `whatsapp` is empty)
- Error: a Persian message at the top of the form, **with the entered values
  preserved**. Never make someone retype an order.
- Field errors inline beneath each field
- `generateMetadata` — Persian title and description

### Switch existing CTAs onto `/order`

| Control | After Phase 4 | Phase 5 |
| --- | --- | --- |
| Listing card, available | WhatsApp with product name | `/order?product={slug}` |
| Listing card, unavailable | no link | unchanged |
| Featured card, available | `/#order` | `/order?product={slug}` |
| Header / hero «ثبت سفارش» | `/#order` | `/order` |
| Homepage order band primary | WhatsApp | `/order` — update the `content.ts` label off «ثبت سفارش در واتس‌اپ» |
| Homepage order band secondary | Phone | unchanged; WhatsApp can stay as an extra |

Do not leave listing cards pointing at WhatsApp once the form exists — that
splits the conversion path.

### Revalidation

Extend the Phase 4 hooks:

- `products` afterChange / afterDelete also `revalidatePath('/order')` — the
  select options change
- `site-settings` afterChange also `revalidatePath('/order')` — success
  WhatsApp reads those settings

### Anti-spam

- Honeypot field (primary)
- Basic per-IP rate limit on the action
- No CAPTCHA — it costs conversions on a low-traffic site

## Verification

- Valid submission → record in `/admin` + email received
- Invalid phone → inline Persian error, nothing saved
- **Persian digits in the phone field are accepted**
- `?product=` of an available slug pre-selects that product
- `?product=` of an unknown or unavailable slug does not preselect
- Unavailable products are absent from the select
- «سایر» reveals the free-text field
- Image upload previews, rejects >5MB and non-images
- Jalali date picker works on mobile and stores the shown date
- Simulated email failure → order still saved, user still sees success
- Honeypot submission is silently dropped
- Form values survive a server error
- Listing and featured available buttons land on `/order?product={slug}`
- Header «ثبت سفارش» lands on `/order`
- `/order` has Header, Footer and the WhatsApp float
- 375 / 768 / 1280px; RTL correct
- `pnpm build` and `pnpm lint` pass

## Notes

- Only the form island is `'use client'`; the page stays a server component and
  fetches the available product list
- Digit normalisation is Persian/Arabic → Latin for input. Display still uses
  `toLocaleString('fa-IR')` / `faNumber`

## References

- @context/project-overview.md
- @context/features/phase-2-cms-schema-spec.md
- @context/features/phase-4-products-spec.md
- @context/coding-standards.md
