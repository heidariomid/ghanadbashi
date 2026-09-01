# Phase 10b — Order Status SMS (SMS.ir)

## Overview

Second of three SMS deliveries. Needs
@context/features/phase-10a-new-order-sms-spec.md shipped first — the wrapper
in `src/lib/sms.ts`, the env block and the account all come from there.

One thing: when she changes **وضعیت** on an order, the customer is told.

Nothing a visitor can trigger. The only new surface is a hook on `orders`, and
the only new field is a read-only note telling her whether the last message
actually went out.

پنل پایه has only **2** «ارسال سریع» templates, and 10a already uses both. This
phase needs three more, so the account must move to **پنل برنزی**
(۱۰ قالب، ۲۹۹٬۰۰۰ تومان/سال) before anything here can go live.

## Requirements

### Status change → customer SMS

`orders` `afterChange`. Send only when **all** of these hold:

- `operation === 'update'` — `afterChange` also fires on create, and a brand new
  order would otherwise text the customer about a status that never changed
- `previousDoc.status !== doc.status`
- the new status is `confirmed`, `delivered` or `cancelled`
- the order has a phone that normalises to `09xxxxxxxxx`

| Status | وضعیت | Template env |
| --- | --- | --- |
| `confirmed` | تأیید شده | `SMSIR_TEMPLATE_CONFIRMED` |
| `delivered` | تحویل شده | `SMSIR_TEMPLATE_DELIVERED` |
| `cancelled` | لغو شده | `SMSIR_TEMPLATE_CANCELLED` |
| `new` | she moves it back to جدید | — skip, no customer SMS |

Reuse `src/lib/sms.ts` from 10a — same `POST /v1/send/verify`, same 25-character
hygiene, same `status === 1` success. Parameters: `ORDER` = order number,
`NAME` = customer name (truncated).

Do **not** send her an admin SMS on status change — she just made the change.
Do not notify on every save, only when `status` actually changes.

**Send failure must not block the status save.** The save has already happened
by the time `afterChange` runs; catch everything, log `status` and `message`,
and let the admin request succeed.

### «آخرین پیامک به مشتری»

She has no other way to know a message failed. Add a read-only group on
`orders`, written by the hook:

| Name | Label | Type |
| --- | --- | --- |
| `lastCustomerSms.sentAt` | زمان | `date` |
| `lastCustomerSms.ok` | ارسال شد | `checkbox` |
| `lastCustomerSms.note` | نتیجه | `text` — a short Persian sentence, e.g. «ارسال شد» / «اعتبار پیامک تمام شده» / «شماره مشتری معتبر نیست» |
| `lastCustomerSms.messageId` | شناسه پیامک | `text`, from `data.messageId` |

All four `admin: { readOnly: true }`, `position: 'sidebar'`, under the وضعیت
field. Never a raw provider code — she reads the Persian sentence, we read the
number in the logs. Map `102` → «اعتبار پیامک تمام شده», `104` → «شماره مشتری
معتبر نیست», `113` / `119` → «قالب پیامک آماده نیست», `114` → «متن پیامک کوتاه
نشد».

If Phase 8 ever lands and adds «آخرین ایمیل به مشتری», keep them as two separate
groups. Same status change, two channels, each fails on its own.

Schema change → `pnpm migrate:create` and `pnpm generate:types`, both committed.

### The recursion trap

Writing `lastCustomerSms` back onto the order from inside that order's own
`afterChange` re-fires the hook. Guard it with Payload's `context`:

```ts
if (context.skipSmsHook) return
await req.payload.update({
  collection: 'orders',
  id: doc.id,
  data: { lastCustomerSms: … },
  context: { skipSmsHook: true },
})
```

The second pass is an update with an unchanged `status`, so the status guard
above would stop it anyway — but rely on the context flag, not on that
coincidence.

### Templates (SMS.ir panel, not CMS)

Same rules as 10a: defined under **ارسال سریع**, placeholders `#NAME#`,
`templateId` is a number in env. Keep each message inside one 70-character
Persian part for a typical name.

| Env name | Pattern text | Parameters |
| --- | --- | --- |
| `SMSIR_TEMPLATE_CONFIRMED` | #NAME# عزیز، سفارش #ORDER# تأیید شد. به‌زودی تماس می‌گیریم. | `ORDER`, `NAME` |
| `SMSIR_TEMPLATE_DELIVERED` | #NAME# عزیز، سفارش #ORDER# تحویل شد. نوش جان. | same |
| `SMSIR_TEMPLATE_CANCELLED` | #NAME# عزیز، سفارش #ORDER# لغو شد. برای سؤال تماس بگیرید. | same |

### Env

```
SMSIR_TEMPLATE_CONFIRMED=
SMSIR_TEMPLATE_DELIVERED=
SMSIR_TEMPLATE_CANCELLED=
```

Added to the 10a block. Missing key or template id: skip the send, record the
skip in «آخرین پیامک به مشتری» so she is not left guessing.

### Admin

- وضعیت stays the only field she edits
- «آخرین پیامک به مشتری» is read-only and never blocks a save
- No «ارسال دوباره» button. If a message failed she calls — that is the point of
  showing her the failure

## Out of scope here

- Phone verification / OTP — 10c
- A retry queue or scheduled re-send
- Calling the delivery-report endpoint later with the stored `messageId`. We
  keep the id so a future phase *could*; this phase does not
- Notifying her on status change
- Customer email — Phase 8
- WhatsApp, payment, «پیگیری سفارش» page

## Verification

Sandbox first (point all three ids at `123456` / `Code` — see
https://app.sms.ir/developer/help/sandbox), then production.

- Change وضعیت to تأیید شده → customer SMS arrives with the order number; the
  row stays saved
- Change to تحویل شده, then لغو شده → matching template each time
- Set back to جدید → no message, and the previous «آخرین پیامک» note is left
  alone
- Edit `notes` or any other field without touching وضعیت → no message
- Create a brand new order through `/order` → no status SMS (only the two from
  10a)
- Unset `SMSIR_API_KEY` and change a status → status saves, «آخرین پیامک»
  shows the skip in Persian, no crash in `/admin`
- Point a template env at an id that does not exist → status saves, note shows
  a Persian failure, log shows `113`
- An order whose phone is somehow not `09…` → status saves, note explains why
  nothing was sent
- Saving twice in a row does not double-send, and does not loop
- Anonymous `POST /api/orders` still 403
- `pnpm lint` and `pnpm build` pass

## Leftover setup (not code)

1. Account upgraded to پنل برنزی — without it, the three new templates return
   `119`
2. `OrderConfirmed`, `OrderDelivered`, `OrderCancelled` created under ارسال
   سریع, their numeric ids in env
3. Enough credit — a status change with an empty balance fails silently for the
   customer and only shows in her «آخرین پیامک» note (`102`)

## Notes

- This is the phase that makes a wrong phone number visible: a typo now bounces
  (`104`) where before it just sat in the admin. That visibility is most of the
  argument for 10c
- She may change several orders in a row. Each is one `send/verify`; there is
  no batching and no `/v1/send/bulk`

## References

- https://app.sms.ir/developer/help/sandbox
- https://sms.ir/rest-api/
- https://sms.ir/web-service/
- https://sms.ir/pricing/
- @context/features/phase-10a-new-order-sms-spec.md
- @context/features/phase-10c-phone-verification-spec.md
- @context/features/phase-8-order-status-email-spec.md
- @context/project-overview.md
- @context/coding-standards.md
