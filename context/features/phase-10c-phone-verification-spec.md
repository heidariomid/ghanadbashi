# Phase 10c — Phone Verification (SMS.ir OTP)

## Overview

Third and last of the SMS deliveries. Needs
@context/features/phase-10a-new-order-sms-spec.md and
@context/features/phase-10b-order-status-sms-spec.md live first.

Before an order is saved, the customer proves the phone is theirs: they get a
code by SMS and type it back.

**Do not start this until 10a and 10b have run in production for a while.** It
is the only piece that can lose an order, the only one that puts friction on
every customer, and the only one that hands a stranger a button that spends her
credit. 10b is what makes the problem visible — if wrong numbers turn out to be
rare in her real traffic, this phase may not be worth building at all.

The sixth template (`OrderOtp`) also needs پنل برنزی. پنل پایه's two slots are
already taken by 10a.

## Requirements

### The flow

1. Customer fills the form and enters their phone
2. They press «ارسال کد»; the server generates a 6-digit code, stores a hash,
   and sends it with `SMSIR_TEMPLATE_OTP` through `src/lib/sms.ts`
3. A code field appears on the same `/order` screen — **no second route**
4. They type the code and submit
5. Only on a valid, unexpired, unused code does `submitOrder` save the row and
   fire the two 10a messages

An unverified submit saves nothing and shows a Persian error. Honeypot and the
existing per-IP rate limit stay in front of all of it.

If Phase 8 is ever live, the email OTP shares this screen. Do not add a second
route for it either.

### Where the code lives

**Not in memory.** The site runs on Vercel, where the request that sends a code
and the request that checks it can be served by different instances; an
in-memory code would be missing at verify time, intermittently and
unreproducibly. The order form's existing rate limiter has this flaw already and
should be moved to the same store while we are here.

New Payload collection, `phone-verifications`:

| Field | Type | Notes |
| --- | --- | --- |
| `phone` | `text`, indexed | normalised `09xxxxxxxxx` |
| `codeHash` | `text` | never the raw code |
| `expiresAt` | `date` | now + 5 minutes |
| `attempts` | `number` | verify tries used |
| `consumedAt` | `date` | set when an order is saved against it |
| `ip` | `text` | for the caps below |

Access: `create`, `read`, `update`, `delete` all `isAdmin`, so the REST API
exposes nothing. The order action writes through the Local API, like `orders`
already does. `admin: { hidden: true }` — this is plumbing, not something she
should ever see in a Persian admin built for her.

Delete rows older than a day whenever a new code is created. No cron.

Schema change → `pnpm migrate:create` and `pnpm generate:types`, both committed.

### OTP rules

- 6 digits, generated with `crypto.randomInt`, never `Math.random`
- Store a hash (`crypto.createHash('sha256')` over code + `PAYLOAD_SECRET`), and
  compare with `crypto.timingSafeEqual`
- 5-minute expiry
- Maximum 5 verify attempts per code, then it is dead and they must request a
  new one
- One live code per phone: creating a new one invalidates the old
- Every message the customer sees is Persian, and none of them reveal whether a
  phone number has ordered before

Normalise everything the customer types with `toLatinDigits` first — the code
field will receive Persian digits on an Iranian keyboard.

A numeric code is always under the 25-character parameter cap.

### Spend and abuse caps

A public "send me a code" button spends her money. All counters live in
`phone-verifications`, not in memory:

| Cap | Limit |
| --- | --- |
| Resend cooldown, same phone | 60 seconds |
| Codes per phone | 5 per hour |
| Codes per IP | 10 per hour |
| Codes site-wide | a daily ceiling from env, so a bad day costs a known amount |

Over a cap: a Persian message telling them to wait, and **no** API call. The
daily ceiling logs loudly — hitting it means either an attack or that she needs
more credit.

Missing `SMSIR_API_KEY` or a missing / unapproved OTP template: show a Persian
error and **do not save an unverified order**. This is the one place where
missing env is not a silent skip — 10a and 10b degrade quietly because the
order still gets through; here the whole point is the gate.

### Form

`OrderForm.tsx` gains one step, not one page:

- «ارسال کد» next to the phone field, disabled during the cooldown with a
  Persian countdown
- A code input that appears after a code is sent, `inputMode="numeric"`,
  `autoComplete="one-time-code"`, `dir="ltr"`
- The submit button stays disabled until a code has been entered
- Changing the phone number after verifying clears the verification — otherwise
  someone verifies one number and orders against another
- Tap targets ≥44px, logical properties, Persian copy in `content.orderForm`
  like every other string on that screen

### Template

| Env name | Pattern text | Parameters |
| --- | --- | --- |
| `SMSIR_TEMPLATE_OTP` | کد تأیید سفارش قنادباشی: #CODE# | `CODE` = the digits |

Same panel rules as 10a. The sandbox's built-in template is already this shape
(`123456` / `#CODE#`, parameter `Code` — see
https://app.sms.ir/developer/help/sandbox), so the transport for this phase can
be verified locally without a production template.

### Env

```
SMSIR_TEMPLATE_OTP=
OTP_DAILY_LIMIT=200                    # site-wide ceiling on codes per day
```

Added to the 10a block.

## Out of scope here

- Voice OTP
- Customer accounts, saved addresses, "remember this phone"
- Email OTP — Phase 8
- A separate `/verify` route
- Rate limiting anything other than the order form and the OTP endpoints
- Payment

## Verification

- Submit without requesting a code → nothing saved, Persian error
- Wrong code → Persian error, nothing saved, attempt counter goes up
- Six wrong codes → the code dies, Persian message asks for a new one
- Valid code → order row saved, plus her SMS and the customer SMS from 10a
- Wait past 5 minutes, then use the code → expired, nothing saved
- Reuse a code that already produced an order → rejected
- Press «ارسال کد» twice quickly → second press blocked by the cooldown, only
  one SMS sent
- Six codes to the same phone in an hour → blocked before SMS.ir is called
- Verify a phone, then change the phone field, then submit → rejected
- Persian digits typed into the code field → accepted
- Unset `SMSIR_API_KEY` → Persian error and no order, not a silent save
- `GET /api/phone-verifications` while signed out → 403
- `phone-verifications` does not appear in the admin sidebar
- The form works at 375px, RTL correct, no mirrored layout
- Anonymous `POST /api/orders` still 403
- `pnpm lint` and `pnpm build` pass

## Leftover setup (not code)

1. `OrderOtp` created under ارسال سریع, its numeric id in env
2. `SMSIR_TEMPLATE_OTP` and `OTP_DAILY_LIMIT` on Vercel and in local `.env`
3. Credit sized for roughly three SMS per order, plus the codes that never
   become orders

## Notes

- Every abandoned form now costs money. Watch her balance for the first weeks
  and tighten the caps rather than raising the ceiling
- OTP adds friction to a form that a phone user fills in under two minutes
  today. That is the cost being bought, and it is why this phase runs last
- Digit normalisation (`toLatinDigits`) applies to both the phone and the code
- The official `sms-typescript` package is not used. Same reason as 10a: one
  `fetch` wrapper, no extra dependency

## References

- https://app.sms.ir/developer/help/sandbox
- https://sms.ir/rest-api/
- https://sms.ir/web-service/
- @context/features/phase-10a-new-order-sms-spec.md
- @context/features/phase-10b-order-status-sms-spec.md
- @context/features/phase-5-order-form-spec.md
- @context/project-overview.md
- @context/coding-standards.md
