# Phase 9 — Client Guide & Handoff Spec

## Overview

The final phase. Hand the site to the client and make sure she never needs to
call you.

Split out of Phase 7 on purpose. The guide is screenshot-driven, and every
screenshot goes stale the moment the admin panel changes. This phase runs
**after** the admin UI work and the remaining website changes, so the pictures
match what she actually sees.

**This is the phase that determines whether the project was profitable.** It is
also the easiest to skip when the build feels finished — don't.

Numbered 9 to avoid colliding with the existing (and deprioritised)
`phase-8-order-status-notify-spec.md`.

## Requirements

### Client account

- Create her Payload user with a real password, delivered securely
- Confirm the admin renders in **Persian** for her account
- Delete or secure any temporary dev accounts

> The database currently holds exactly one user, and it is a dev account.
> Creating hers earlier — before the admin redesign — is optional but useful:
> watching her struggle with the current panel tells you what to fix while it
> is still cheap to change.

### `context/client-handoff.md` — the deliverable

A short guide **written in Persian**, with screenshots, covering exactly:

1. ورود به پنل مدیریت — the `/admin` URL and how to log in
2. اضافه کردن محصول جدید — including uploading a photo and setting a price
3. تغییر قیمت یک محصول
4. «استعلام قیمت» — what the checkbox does
5. پنهان کردن محصولی که تمام شده — the `isAvailable` checkbox (it greys
   the listing card and drops the product from the order form; it does
   not delete the product)
6. اضافه کردن عکس به گالری
7. دیدن سفارش‌ها و تغییر وضعیت آن‌ها
8. تغییر شماره تماس، واتساپ و اینستاگرام
9. عکس خوب چیست — square-ish, good light, under ~5MB, **and what to type in
   «متن جایگزین»**
10. اگر مشکلی پیش آمد — what to check first

Rules for this document:

- Persian, plain language, **no technical vocabulary** — no "CMS",
  "collection", "field", "deploy"
- One screenshot per step, taken from the **Persian** admin while logged in as
  her account. An English admin screenshot defeats the whole purpose
- Short numbered steps, one action each
- Delivered as a PDF as well as the markdown file — she will not browse a repo

#### «متن جایگزین» — the one field she cannot skip

`media.alt` is `required: true`, so the very first photo she uploads stops on a
field whose purpose is not obvious. If the guide does not cover it she is
blocked at step one, and if she types junk to get past it, both payoffs are
lost: it is the text a screen reader reads, **and** the `og:image:alt` on every
link she shares to WhatsApp and Instagram (Phase 7).

Teach it as one sentence — *«همان چیزی که در عکس است را بنویسید»* — with a
worked example («کیک شکلاتی با توت‌فرنگی»), not as a concept.

The field's own `admin.description` currently reads «توضیح کوتاه تصویر برای
دسترس‌پذیری و سئو» — «دسترس‌پذیری» and «سئو» are exactly the technical
vocabulary this document bans. Rewrite it during the admin-wording pass so the
panel and the guide say the same plain thing.

Optionally record a 5-minute screen capture walking through the same steps.
Video costs almost nothing to make and prevents more calls than the document.

### Current state of the draft

`context/client-handoff.md` already exists and all ten sections are written in
Persian. It is **not** deliverable yet:

- It is labelled «پیش‌نویس» at the top
- Nine `<!-- اسکرین‌شات: … -->` placeholders, zero actual images
- Step 1 still says `example.com/admin` — following it literally would not log
  her in
- The developer note block at the top (lines 3–9) must be deleted before
  handover; it is the only English in the file, along with the placeholder URL

## Verification

- The client logs in and successfully adds one product unaided — this is the
  real acceptance test
- She changes a price and hides a sold-out product without help
- Image upload from the client's **phone** works in production
- She fills «متن جایگزین» with a real description, unprompted, on a photo she
  uploads herself
- The PDF opens and is readable on her phone
- Every screenshot matches the admin as it actually looks after the UI changes

## Notes

- Watch the client use the admin once, without helping. Whatever confuses her
  is a label to rewrite or an `admin.description` to add — fix it now, while
  it's cheap.
- Agree explicitly on what counts as a paid change (new pages, new features)
  versus content she handles herself. Setting that boundary at handoff is what
  keeps the project profitable.
- A product detail page is a paid extra: it needs a long-description field the
  current schema does not have.

## References

- @context/project-overview.md
- @context/features/phase-7-launch-spec.md
- @context/features/phase-2-cms-schema-spec.md
- @context/ai-interaction.md
