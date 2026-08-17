# Phase 5 — Order Form Spec

## Overview

Phase 5 of 7. The order form at `/order`. Corresponds to section ۳ of the client
brief — and it is the site's single conversion point, so it must be simple and
must never silently fail.

Submissions are saved to the CMS **and** emailed. Both, deliberately: email is
what she'll actually notice; the CMS record is the durable copy if she deletes
the email.

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
- Options from available products, grouped by category
- Plus a final «سایر / مورد دیگر» option that reveals a free-text input
- Pre-selected from `?product={slug}`

**تعداد** — min 1, default 1

**تاریخ تحویل** — Jalali. Use `react-multi-date-picker` with the
`persian`/`persian_fa` locale. Store the submitted Jalali string as-is in
`deliveryDate` (a text field) — no Gregorian conversion, since the client reads
these dates herself and round-tripping is a needless failure mode.

**عکس نمونه** — images only, max 5MB, client-side preview, clearable. The brief
calls for this explicitly: customers often want a cake copied from a photo.

### Validation

Zod schema in the server action — the source of truth. Client-side checks are UX
only.

- `customerName` — 2–100 chars, trimmed
- `phone` — Iranian mobile: `/^09\d{9}$/` after stripping spaces and dashes, and
  normalising Persian/Arabic digits to Latin. **Accept the Persian digits users
  actually type** — this is the most common submission failure.
- `product` — a valid product ID, or free text when «سایر»
- `quantity` — integer ≥ 1, ≤ 1000
- `deliveryDate` — non-empty
- `notes` — max 1000 chars
- `sampleImage` — image mime type, ≤ 5MB

All messages in Persian, e.g. «شماره تماس معتبر نیست».

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

### Notification email

- To: the bakery's address; subject: «سفارش جدید از {نام مشتری}»
- Persian, RTL HTML body, all submitted fields
- `tel:` link on the phone number so she can call from her phone
- Sample image attached or linked
- Link to the order in `/admin`

### UX

- Single column, generous tap targets (≥44px), `inputMode="tel"` on phone
- Submit disabled while pending, with a spinner and «در حال ارسال...»
- Success: replace the form with a confirmation — «سفارش شما ثبت شد. به زودی با
  شما تماس می‌گیریم.» plus a WhatsApp button for follow-up
- Error: a Persian message at the top of the form, **with the entered values
  preserved**. Never make someone retype an order.
- Field errors inline beneath each field

### Anti-spam

- Honeypot field (primary)
- Basic per-IP rate limit on the action
- No CAPTCHA — it costs conversions on a low-traffic site

## Verification

- Valid submission → record in `/admin` + email received
- Invalid phone → inline Persian error, nothing saved
- **Persian digits in the phone field are accepted**
- `?product=chocolate-cake` pre-selects that product
- «سایر» reveals the free-text field
- Image upload previews, rejects >5MB and non-images
- Jalali date picker works on mobile and stores the shown date
- Simulated email failure → order still saved, user still sees success
- Honeypot submission is silently dropped
- Form values survive a server error
- 375 / 768 / 1280px; RTL correct
- `pnpm build` and `pnpm lint` pass

## Notes

- Only the form island is `'use client'`; the page stays a server component and
  fetches the product list
- Digit normalisation belongs in `src/lib/digits.ts` — reused by phone
  validation and price formatting

## References

- @context/project-overview.md
- @context/features/phase-2-cms-schema-spec.md
- @context/features/phase-4-products-spec.md
- @context/coding-standards.md
