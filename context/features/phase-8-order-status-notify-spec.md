# Phase 8 — Order Status Email & SMS

## Overview

Phase 8 of 8. After launch (Phase 7). Two notice paths:

1. **Customer submits** → email **and** SMS to **her** (the baker), so a new
   order is not only a CMS row
2. **She changes وضعیت** → email **and** SMS to the **customer**

Phase 5 already emails her on submit. This phase adds SMS to that same
moment, keeps the email, and adds customer notices on status change.

No customer accounts. No public order-tracking page. The admin row stays the
source of truth; the messages are one-way notices.

## Requirements

### New form field

Add **ایمیل** to `/order` and the `orders` collection. Required. Persian
label, Zod-validated. Phase 5 resisted extra fields; this one is the cost of
emailing the customer.

Phone stays required — it is the SMS address.

### Contact verification (before the order is saved)

A typo in phone or email means the wrong person gets later status messages.

1. Customer enters phone and email
2. Server sends a short OTP to each (SMS + email)
3. Customer types both codes
4. Only then `submitOrder` saves the row and notifies **her** (email + SMS)

OTP rules: 5–6 digits, 5-minute expiry, limited retries, Persian errors.
Store a hash, not the raw code. Rate-limit send and verify per IP and per
phone/email. Honeypot + existing rate limit stay in front.

Missing SMS or email env skips **that** channel’s OTP and shows a Persian
error — do not save an unverified order.

### New order → admin notice

After a verified submit saves the row, tell **her** on both channels. Same
moment as today’s Phase 5 Resend mail — do not make her open `/admin` to
learn someone ordered.

| Channel | To | Content |
| --- | --- | --- |
| Email | `ORDER_NOTIFICATION_EMAIL` | Keep the Phase 5 «سفارش جدید از {نام}» mail: all fields, `tel:` on the customer phone, sample image, link to the order in `/admin` |
| SMS | `ORDER_NOTIFICATION_PHONE` | Short Persian line, e.g. «سفارش جدید از {نام} — {محصول}. جزئیات در ایمیل یا پنل.» |

Phone comes from env, not the public site-settings number (that one is for
visitors). Missing `ORDER_NOTIFICATION_PHONE` skips SMS only; the order
still saves and email still sends if Resend is set.

**Send failure must not fail the customer’s submit.** Log it. They still see
success.

Do **not** SMS or email the **customer** on create — they already have OTP +
the on-page confirmation.

### Status change → customer notice

`orders` `afterChange`: if `status` actually changed, send email **and** SMS
to the customer. Do **not** send her another admin SMS/email on status
change — she just made the change.

| Status | When | Customer message (Persian, short) |
| --- | --- | --- |
| `confirmed` | she picks تأیید شده | سفارش شما تأیید شد. به‌زودی برای جزئیات تماس می‌گیریم. |
| `delivered` | تحویل شده | سفارشتان تحویل شد. نوش جان. |
| `cancelled` | لغو شده | سفارش شما لغو شد. برای سؤال با ما تماس بگیرید. |
| `new` | she moves it back | skip — no customer mail/SMS |

Email: Resend, same `RESEND_*` env as Phase 5. Subject like «وضعیت سفارش:
تأیید شده». RTL HTML, brand name from site-settings, `tel:` to her number
from site-settings (so they can call **her**).

SMS: an Iran-reachable provider (Kavenegar or equivalent), not Twilio-to-Iran.
Approved pattern/template if the provider requires it. Body is the short
Persian line above — no marketing, no extra links unless the provider
template already has one.

**Send failure must not block the status save.** Log it. Surface a Persian
note on the order in admin if the last notify failed (so she knows to call).

Do not notify on every save — only when `status` changes.

### Admin

- وضعیت stays the only field she edits
- Optional read-only «آخرین پیام به مشتری» (channel + time + ok/fail) so she
  can see whether email/SMS went out
- No new CMS fields for templates or API keys — copy in code, secrets in env

### Env (not CMS)

```
RESEND_API_KEY=
RESEND_FROM_EMAIL=
ORDER_NOTIFICATION_EMAIL=          # her inbox (Phase 5) — new-order email
ORDER_NOTIFICATION_PHONE=          # her mobile — new-order SMS
SMS_PROVIDER_API_KEY=
SMS_SENDER=                        # provider line / pattern id
```

Missing SMS env or her phone: new-order SMS skipped; order still saves.
Missing Resend: new-order email skipped the same way. Customer status
notices skip the missing channel only.

### Out of scope here

- Customer login / «پیگیری سفارش» page
- WhatsApp status messages
- Payment
- Letting her edit the SMS/email wording in the admin

## Verification

- Submit without OTP → nothing saved
- Wrong OTP → Persian error, nothing saved
- Valid OTP → order row + her email **and** SMS
- Simulated SMS or email failure on submit → order still saved, customer
  still sees success
- Change وضعیت to تأیید شده → customer email + SMS; row stays saved if a
  send fails
- Change to تحویل شده / لغو شده → matching copy on both channels
- Set back to جدید → no customer message
- Edit another field without changing status → no message
- Anonymous `POST /api/orders` still 403
- `pnpm lint` and `pnpm build` pass

## Notes

- Phase 5 emailed her only. Phase 8: new order → her email + SMS; status
  change → customer email + SMS. Still no SMS to the customer on submit.
  Header + float WhatsApp stay her general contact
- OTP adds friction. Keep the codes on the same `/order` screen — no extra
  route
- Digit normalisation (`toLatinDigits`) applies to OTP, phone, and email
  local-part is Latin-only

## References

- @context/features/phase-5-order-form-spec.md
- @context/project-overview.md
- @context/coding-standards.md
