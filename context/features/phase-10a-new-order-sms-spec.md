# Phase 10a — New Order SMS (SMS.ir)

## Overview

First of three SMS deliveries. Phase 10 was split after pre-review because it
bundled three features under one name; see
@context/features/phase-10b-order-status-sms-spec.md and
@context/features/phase-10c-phone-verification-spec.md.

10a is the small, reversible one:

1. An order saves → SMS **her**, so a new order is not only a CMS row and an
   email she might miss
2. The same moment → SMS the **customer** with the order number, so they hold
   something after they close the tab

No change to the order form. No change to how orders are validated or saved.
Nothing a stranger can trigger except by placing a real order, which the
existing honeypot and rate limit already guard.

Ship this first. It fits inside SMS.ir's permanently free پنل پایه — two
«ارسال سریع» templates is exactly what this phase needs — and the first live
SMS this project ever sends is one only she receives.

## Provider — SMS.ir, not Kavenegar

Switched after pre-review. Kavenegar was the original pick; SMS.ir wins on the
two things that decide it for this repo.

| | SMS.ir | Kavenegar |
| --- | --- | --- |
| Sandbox | **Yes** — its own API key, same URLs, same errors, no SMS sent, no credit spent | None |
| Free tier | پنل پایه, permanent and free: 2 «ارسال سریع» templates, 1 API key, 10 SMS, a free 14-digit line | 50,000 ﷼ test credit, and Lookup needs paid سرویس پیشرفته |
| Auth | `x-api-key` header | key inside the URL path, so it lands in every log and proxy |
| Template slots | named — `#NAME#`, `#ORDER#` | positional — `token`, `token10`, `token20`, each with its own space rules |
| Parameter length | **25 characters, hard** | 100 |

This project has no test suite; every phase is verified by hand in a browser.
A sandbox is worth more here than a longer parameter.

The 25-character cap is the price, and it shapes the messages below: the SMS
tells her an order exists, it does not describe it. The Phase 5 email and
`/admin` already carry the detail.

Docs: [REST API](https://sms.ir/rest-api/),
[راهنمای Sandbox داخل پنل](https://app.sms.ir/developer/help/sandbox)
(same Sandbox section is also on the public [REST](https://sms.ir/rest-api/)
page — the in-app URL needs a signed-in account),
[وب سرویس](https://sms.ir/web-service/), [قیمت پنل](https://sms.ir/pricing/).

### What we use, what we ignore

| API | Use? |
| --- | --- |
| `POST /v1/send/verify` | **Yes — every SMS in this phase** |
| `/v1/send/bulk`, `/v1/send/likeToLike` | No. Bulk/promotional; filtered for anyone who blocked ads SMS |
| Delivery-report and inbox endpoints | No. We keep `messageId`; 10b stores it. Nothing polls it |
| Contacts, باشگاه مشتریان, campaigns | No |

`send/verify` goes out on خطوط خدماتی: highest priority, delivered even to
people who have blocked advertising SMS, no time-of-day restriction. That is
the whole reason to use it for a bakery order and not a bulk send.

## Requirements

### Client wrapper

`src/lib/sms.ts` — server-only, provider-agnostic name so a future swap does not
rename every import. `fetch` POST, JSON body. Do **not** install
`sms-typescript` (the official SDK) or `sms-ir-api` — both want a line number
that Verify does not use.

```
POST https://api.sms.ir/v1/send/verify
Content-Type: application/json
Accept: text/plain
x-api-key: {SMSIR_API_KEY}

{
  "mobile": "09xxxxxxxxx",
  "templateId": 123456,
  "parameters": [
    { "name": "ORDER", "value": "142" },
    { "name": "NAME",  "value": "سارا محمدی" }
  ]
}
```

`templateId` is an **integer**, so parse the env value — the docs' JS samples send
it as a string, the schema says Integer. `name` is the placeholder key **without**
the surrounding `#`.

Response:

```
{ "status": 1, "message": "موفق", "data": { "messageId": 89545112, "cost": 1.0 } }
```

One exported function. Takes a mobile, a template id and a record of
parameters; returns a discriminated result (`sent` / `skipped` / `failed`) and
never throws at the caller. Keep `data.messageId` — 10b stores it.

**Success is `status === 1`.** Not an HTTP 200, not a truthy body.

Map and log; never surface a raw code to a visitor:

| `status` | Meaning |
| --- | --- |
| `1` | sent |
| `0` | provider-side fault |
| `10` / `11` | API key invalid or disabled |
| `12` | the key is IP-restricted — see the Vercel trap below |
| `13` / `14` | account disabled or suspended |
| `20` | too many requests |
| `101` | sender line invalid |
| `102` | اعتبار کافی نیست |
| `104` | bad mobile number |
| `113` | template id not found |
| `114` | a parameter value is over 25 characters |
| `115` | the number is on the system blacklist |
| `116` | empty parameter name |
| `117` | message text not approved |
| `119` | this plan does not allow a custom template |
| `123` | the sending line needs activating |

Missing `SMSIR_API_KEY` or a missing template id: return `skipped`, log once, do
not call the API. Same shape as missing Resend in Phase 5 — never an error.

> **Vercel trap.** Status `12` is «کلید وب‌سرویس محدود به IP‌های تعریف شده» — a
> key can be pinned to fixed IPs. Vercel functions have no stable egress IP, so
> a pinned key works from a laptop and then fails in production. Leave IP
> restriction **off** on this key. (The whitelist section in the docs is the
> other direction — SMS.ir's own `185.211.56.44` / `78.158.166.99`, for people
> firewalling inbound traffic. Irrelevant to us; we only make outbound calls.)

### Parameter hygiene — 25 characters, hard

Every parameter value is capped at 25 characters (`114`). This is the tightest
constraint in the phase and every template below is designed around it.

Before every send:

- Collapse runs of whitespace to a single space and trim
- Cut to 25 characters — a truncated name beats a refused message
- Never put a product title, an address or free-text notes in a parameter

Persian digits are converted with `toLatinDigits` first, as everywhere else.

Also keep the **pattern text** short. A Persian SMS is 70 characters per part,
and the parameter values count toward it. Each message below is written to land
in one part with a typical name; a long name pushes it to two and doubles the
cost.

### Her alert number

New field in `site-settings` → گروه اطلاعات تماس:

| Name | Label | Notes |
| --- | --- | --- |
| `orderNotificationPhone` | شماره برای اطلاع سفارش جدید | `admin.description`: «فقط برای خبر دادن سفارش تازه. در سایت نمایش داده نمی‌شود.» |

**`site-settings` is `read: isPublic`.** A private mobile added naively is
served to anyone who calls `/api/globals/site-settings`. Give the field its own
field-level read access so only a signed-in admin sees it:

```ts
access: { read: ({ req }) => Boolean(req.user) }
```

Server-side reads through the Local API run with `overrideAccess: true`, so the
order action still sees the value.

Resolution order when sending: the CMS field, then `ORDER_NOTIFICATION_PHONE`,
then skip. Normalise with `toLatinDigits` and validate against `/^09\d{9}$/`
before calling, exactly like the customer phone in `submitOrder`.

Schema change → `pnpm migrate:create` and `pnpm generate:types`, both committed.

The official TypeScript SDK sends `09123456789` — same `09xxxxxxxxx` shape we
already store. Do not strip the leading zero. The C# sample without it is the
outlier, not the rule.

### New order → her SMS

In `submitOrder`, next to the existing `notifyBaker` Resend call, after the row
saves. Both notifications run; each may fail on its own.

Template `SMSIR_TEMPLATE_NEW_ORDER`. Parameters `ORDER` = order number,
`NAME` = customer name (truncated), `COUNT` = number of lines in the order.

The message deliberately carries no product name — 25 characters cannot hold
one, and she has the email and the panel for that. Its job is «برو نگاه کن».

**Send failure must not fail the customer's submit.** Log the `status` and
`message`. They still see success. Same `.catch()` shape the Resend call
already uses.

### New order → customer SMS

Same moment, same guard. Template `SMSIR_TEMPLATE_ORDER_RECEIVED`,
`ORDER` = order number, `NAME` = customer name, mobile = the phone they typed.

This message is a receipt, not a promise: it says the order was registered and
that she will follow up. It must not say the order is confirmed — that is 10b's
«تأیید شد», which she sends deliberately.

If one of the two sends fails and the other succeeds, that is fine. Log both.
Do not make one depend on the other.

### Templates (SMS.ir panel, not CMS)

Defined in the panel under **ارسال سریع**. Placeholders are `#NAME#`; the
`name` we send is the key **without** the `#`. Each template gets a numeric
`templateId`, which is what goes in env.

Unlike Kavenegar there is no mandatory token — a template may contain any
placeholders, or none. We keep the order number because it is useful to both of
them, not because the provider demands it.

| Env name | Pattern text | Parameters |
| --- | --- | --- |
| `SMSIR_TEMPLATE_NEW_ORDER` | سفارش جدید #ORDER# از #NAME# — #COUNT# قلم. جزئیات در پنل. | `ORDER`, `NAME`, `COUNT` |
| `SMSIR_TEMPLATE_ORDER_RECEIVED` | #NAME# عزیز، سفارش #ORDER# ثبت شد. به‌زودی خبرتان می‌کنیم. | `ORDER`, `NAME` |

Wording lives in the panel template, not in our code. We only pass parameters.
She does not edit SMS text in `/admin`.

پنل پایه allows **2** «ارسال سریع» templates — exactly these two. Adding 10b's
three means moving to پنل برنزی.

### Sandbox — how this phase is actually verified

Official in-panel help (signed-in):
https://app.sms.ir/developer/help/sandbox
Public copy of the same section: [REST API → Sandbox](https://sms.ir/rest-api/).

SMS.ir issues a separate **Sandbox** API key (برنامه‌نویسان ← لیست کلیدهای API
← ایجاد کلید جدید، نوع Sandbox). Same URL, same body, same error codes. From
the official help:

- No real SMS is sent and no credit is deducted
- Returned `messageId` / `cost` are simulated and have no real value
- Errors still validate the request the same way as production
- Nothing is written to the panel's send reports — the response is the only
  record
- It is meant to work **before** the live site or اینماد is ready

The sandbox exposes **one** template only:

| | |
| --- | --- |
| `templateId` | `123456` |
| Pattern | کد تایید شما: `#CODE#` |
| Parameter `name` | `Code` (the sample body uses this casing) |

Local `.env` already holds a sandbox key as `SMSIR_API_KEY`. For local
verification, point **both** `SMSIR_TEMPLATE_*` at `123456` and send a single
`Code` parameter. Wire the real production ids only on Vercel, after the
«ارسال سریع» templates exist.

So be honest about what it proves and what it does not:

| Verified in sandbox | Only verifiable against production |
| --- | --- |
| Auth, request shape, JSON encoding, timeouts | That `NewOrder` and `OrderReceived` read well on a real phone |
| The `status` → Persian message mapping, including `114` and `104` | That the custom templates were approved |
| The 25-character truncation, whitespace collapsing, digit conversion | Real delivery and cost |
| That a skipped/failed send never breaks `submitOrder` | |

> The sandbox help says `Request Method : GET` while the Verify section says
> `POST`. Treat that as a typo in the sandbox block — the sandbox is
> documented as identical to production, which is `POST`. If a sandbox call
> comes back wrong, try `GET` before assuming our body is malformed.

> پنل پایه includes **1** API key. If a sandbox key counts against that, the
> free plan cannot hold a sandbox key and a production key at once. Keep the
> sandbox key in local `.env` and the production key only on Vercel.

### Env

```
SMSIR_API_KEY=                         # local: Sandbox key. Vercel: production key
SMSIR_TEMPLATE_NEW_ORDER=123456        # local sandbox only. Production: real id
SMSIR_TEMPLATE_ORDER_RECEIVED=123456   # local sandbox only. Production: real id
ORDER_NOTIFICATION_PHONE=              # fallback only; the CMS field wins
```

Add the same block to `.env.example` as comments, like the Phase 5 Resend lines.
Never commit a real key.

Missing key, phone or template id: that send is skipped; the order still saves.

### Admin

- No new editable field except «شماره برای اطلاع سفارش جدید»
- وضعیت stays the only field she edits on an order
- No CMS fields for templates, API keys or lines — secrets in env
- No SMS composer, no «ارسال دوباره» button. The SMS.ir panel is hers for credit
  and templates

## Out of scope here

- Status-change SMS — 10b
- Phone verification / OTP — 10c
- Storing the SMS result on the order — 10b adds that field
- Delivery reports, inbox, contacts, campaigns
- Customer email, ایمیل field, email OTP — Phase 8
- Bulk send, WhatsApp status messages
- Creating or editing templates from the app
- Customer login / «پیگیری سفارش» page
- Payment

## Verification

Sandbox first, production second.

**With the sandbox key**

- Submit an order → both sends return `status: 1`, order saves, no credit moves
- Force a 30-character parameter → mapped to the Persian «۱۱۴» message, order
  still saves
- Break the key → `10`, order still saves, Resend email still sends
- Unset `SMSIR_API_KEY` → skipped, one log line, no fetch at all
- A customer name with several spaces and Persian digits → collapsed, converted,
  cut to 25

**With the production key**

- Submit a real order → her phone and the customer phone both get an SMS with
  the same order number, and the number matches the row in `/admin`
- Each message arrives as a single SMS part for a normal-length name
- Blank «شماره برای اطلاع سفارش جدید» + `ORDER_NOTIFICATION_PHONE` set → she
  still gets it. Both blank → order saves, customer SMS still sends

**Always**

- `GET /api/globals/site-settings` while signed out → no `orderNotificationPhone`
- Anonymous `POST /api/orders` still 403
- `pnpm lint` and `pnpm build` pass

## Leftover setup (not code)

1. SMS.ir account — **done**. Sandbox key is in local `.env` (see
   https://app.sms.ir/developer/help/sandbox)
2. A **production** API key on Vercel, IP restriction **off**
3. The two «ارسال سریع» templates created and approved, their ids on Vercel
   only. Local stays on `123456`
4. «شماره برای اطلاع سفارش جدید» filled in on the live `/admin`
5. Credit beyond the 10 free messages before real traffic

**Ask SMS.ir sales (۰۲۱۲۸۵۳) two questions before she pays for anything:**

- Does a service line for the live site require **اینماد**? A home bakery has no
  registered business, and this is the one thing that could block production.
  The sandbox means we can build regardless, but she cannot go live without an
  answer
- Does پنل پایه really allow custom «ارسال سریع» templates? The pricing table
  says 2, but error `119` says custom templates need a plan upgrade. If the free
  plan cannot hold them, 10a needs پنل برنزی (۲۹۹٬۰۰۰ تومان/سال)

## Notes

- Phase 5 emailed her only. 10a adds two SMS at the same moment. پنل پایه is
  ۲۱۹ تومان per part plus the ۴۰ ریال government levy, so **about ۴۵۰ تومان per
  order** — if both messages stay inside one 70-character part. A long name that
  pushes either to two parts makes it ۶۷۰
- The ۱۰ free messages are five orders. She needs credit before real traffic
- The header and float WhatsApp stay her general contact
- 10b needs three more templates, which pushes the account to پنل برنزی

## References

- https://app.sms.ir/developer/help/sandbox
- https://sms.ir/rest-api/
- https://sms.ir/web-service/
- https://sms.ir/pricing/
- @context/features/phase-10b-order-status-sms-spec.md
- @context/features/phase-10c-phone-verification-spec.md
- @context/features/phase-5-order-form-spec.md
- @context/project-overview.md
- @context/coding-standards.md
