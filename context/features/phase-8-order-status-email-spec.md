# Phase 8 — Order Status Email

## Overview

After launch (Phase 7). Email-only notices. SMS is Phase 10a/10b/10c.

Two email paths:

1. **Customer submits** → keep the Phase 5 email to **her** (the baker). This
   phase does not change that mail; it only makes sure the order is not saved
   until the customer inbox is verified
2. **She changes وضعیت** → email the **customer**

No customer accounts. No public order-tracking page. The admin row stays the
source of truth; the messages are one-way notices.

## Requirements

### New form field

Add **ایمیل** to `/order` and the `orders` collection. Required. Persian
label, Zod-validated. Phase 5 resisted extra fields; this one is the cost of
emailing the customer.

Phone stays required. It is not verified in this phase — that is Phase 10c.

### Contact verification (before the order is saved)

A typo in email means the wrong person gets later status messages.

1. Customer enters email
2. Server sends a short OTP to that inbox
3. Customer types the code
4. Only then `submitOrder` saves the row and sends **her** the Phase 5 mail

OTP rules: 5–6 digits, 5-minute expiry, limited retries, Persian errors.
Store a hash, not the raw code. Rate-limit send and verify per IP and per
email. Honeypot + existing rate limit stay in front.

Missing Resend env skips email OTP and shows a Persian error — do not save
an unverified order.

If Phase 10c is already live, put the email OTP on the same `/order` screen
as the SMS OTP. Do not add a second route.

### New order → admin notice

Unchanged from Phase 5. After a verified submit saves the row, email **her**
at `ORDER_NOTIFICATION_EMAIL`. Same «سفارش جدید از {نام}» mail: all fields,
`tel:` on the customer phone, sample image, link to the order in `/admin`.

**Send failure must not fail the customer’s submit.** Log it. They still see
success.

Do **not** email the **customer** on create — they already have OTP + the
on-page confirmation.

### Status change → customer notice

`orders` `afterChange`: if `status` actually changed, email the customer.
Do **not** send her another admin email on status change — she just made
the change.

| Status | When | Customer message (Persian, short) |
| --- | --- | --- |
| `confirmed` | she picks تأیید شده | سفارش شما تأیید شد. به‌زودی برای جزئیات تماس می‌گیریم. |
| `delivered` | تحویل شده | سفارشتان تحویل شد. نوش جان. |
| `cancelled` | لغو شده | سفارش شما لغو شد. برای سؤال با ما تماس بگیرید. |
| `new` | she moves it back | skip — no customer mail |

Resend, same `RESEND_*` env as Phase 5. Subject like «وضعیت سفارش:
تأیید شده». RTL HTML, brand name from site-settings, `tel:` to her number
from site-settings (so they can call **her**).

**Send failure must not block the status save.** Log it. Surface a Persian
note on the order in admin if the last email failed (so she knows to call).

Do not notify on every save — only when `status` changes.

### Admin

- وضعیت stays the only field she edits
- Optional read-only «آخرین ایمیل به مشتری» (time + ok/fail) so she can see
  whether the mail went out
- No new CMS fields for templates or API keys — copy in code, secrets in env

### Env (not CMS)

```
RESEND_API_KEY=
RESEND_FROM_EMAIL=
ORDER_NOTIFICATION_EMAIL=          # her inbox (Phase 5) — new-order email
```

Missing Resend: new-order email skipped the same way as Phase 5. Customer
status mail is skipped too; the order still saves.

### Out of scope here

- SMS to her or the customer — Phase 10a and 10b
- Phone OTP — Phase 10c
- Customer login / «پیگیری سفارش» page
- WhatsApp status messages
- Payment
- Letting her edit the email wording in the admin

## Verification

- Submit without email OTP → nothing saved
- Wrong OTP → Persian error, nothing saved
- Valid OTP → order row + her Phase 5 email
- Simulated email failure on submit → order still saved, customer still
  sees success
- Change وضعیت to تأیید شده → customer email; row stays saved if send fails
- Change to تحویل شده / لغو شده → matching copy
- Set back to جدید → no customer message
- Edit another field without changing status → no message
- Anonymous `POST /api/orders` still 403
- `pnpm lint` and `pnpm build` pass

## Notes

- Phase 5 emailed her only. Phase 8 adds the ایمیل field, email OTP, and
  customer mail on وضعیت change. Still no mail to the customer on submit.
  Header + float WhatsApp stay her general contact
- OTP adds friction. Keep the code on the same `/order` screen — no extra
  route
- Digit normalisation (`toLatinDigits`) applies to OTP. Email local-part is
  Latin-only

## References

- @context/features/phase-5-order-form-spec.md
- @context/features/phase-10b-order-status-sms-spec.md
- @context/project-overview.md
- @context/coding-standards.md
