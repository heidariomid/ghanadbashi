# Phase 2 — CMS Schema Spec

## Overview

Phase 2 of 7, and **the most important phase in the project**. Define the Payload
collections and globals that the client will use every day.

The admin panel is a product deliverable, not a developer tool. Every field gets
a Persian `label`; anything whose purpose isn't self-evident also gets an
`admin.description`. If the client can't understand a field, she will misuse it
or ignore it — and then call you.

Everything defined here is reusable across future client projects. Only the field
names change.

## Requirements

### Collection: `products` — محصولات

| Field | Type | Persian label | Notes |
| --- | --- | --- | --- |
| `title` | text | نام محصول | required |
| `slug` | text | آدرس صفحه | auto-generated from title, editable, unique |
| `category` | select | دسته‌بندی | required, the 7 categories below |
| `image` | upload → media | عکس محصول | required — a bakery product without a photo is useless |
| `description` | textarea | توضیح کوتاه | max ~200 chars |
| `priceOnRequest` | checkbox | استعلام قیمت | when true, hides `price` in the admin and shows «استعلام قیمت» on the site |
| `price` | number | قیمت (تومان) | conditional on `priceOnRequest` being false |
| `isAvailable` | checkbox | موجود است | defaults true; when false show «فعلاً موجود نیست» |
| `isFeatured` | checkbox | نمایش در صفحه اصلی | controls the homepage featured row |
| `sortOrder` | number | ترتیب نمایش | lower first |

Category `select` options (value → Persian label):

```
birthday-cakes  → 🎂 کیک تولد و مناسبتی
cafe-cakes      → 🍰 کیک‌های کافه‌ای و عصرانه
dry-pastries    → 🧁 شیرینی خشک
desserts        → 🍮 دسرها
healthy         → 🌿 محصولات سلامت‌محور و رژیمی
spreads         → 🥜 محصولات ارده، عسل و کره بادام‌زمینی
gift-packs      → 🎁 پک‌های هدیه
```

Admin list view: show image thumbnail, title, category, price, availability.
Default sort by `sortOrder`.

Use `admin.useAsTitle: 'title'` so records read as product names, not IDs.

### Collection: `gallery` — گالری

| Field | Type | Persian label | Notes |
| --- | --- | --- | --- |
| `image` | upload → media | عکس | required |
| `caption` | text | توضیح | optional |
| `sortOrder` | number | ترتیب نمایش | optional |

### Global: `site-settings` — تنظیمات سایت

A **global**, not a collection — there is only ever one. Grouped in the admin so
it isn't a wall of fields:

**گروه: معرفی برند**
- `brandName` (text) — نام برند — required
- `tagline` (text) — شعار برند — e.g. «طعم خانگی، با عشق و کیفیت»
- `heroImage` (upload) — عکس اصلی صفحه اول — required
- `aboutText` (richText) — درباره من

**گروه: اطلاعات تماس**
- `phone` (text) — شماره تماس
- `whatsapp` (text) — شماره واتساپ — description: با کد کشور، مثال: 989121234567
- `instagram` (text) — آیدی اینستاگرام — without the `@`
- `serviceArea` (text) — محدوده فعالیت

### Collection: `orders` — سفارش‌ها

The client's order inbox. Populated by the public form in phase 5.

| Field | Type | Persian label |
| --- | --- | --- |
| `customerName` | text | نام مشتری |
| `phone` | text | شماره تماس |
| `product` | relationship → products | محصول |
| `productNote` | text | محصول (متن آزاد) |
| `quantity` | number | تعداد |
| `deliveryDate` | text | تاریخ تحویل |
| `notes` | textarea | توضیحات |
| `sampleImage` | upload → media | عکس نمونه |
| `status` | select | وضعیت — جدید / تأیید شده / تحویل شده / لغو شده |

Access control:

- `create`: **public** — the form must be able to write
- `read`, `update`, `delete`: **admin only**
- All fields except `status` are read-only in the admin — orders are records of
  what the customer sent, not editable documents. `status` is the one field the
  client changes.

Default sort: newest first. List view: customer name, phone, product, date, status.

### Collection: `media` — تصاویر

- Upload-enabled, with `alt` (متن جایگزین)
- Image sizes: `thumbnail` (400px), `card` (768px), `hero` (1600px)
- Format: WebP, quality ~80
- Storage adapter: Vercel Blob or Cloudflare R2 — **not** local disk, which does
  not persist on Vercel

### Collection: `users` — کاربران

- Payload's built-in auth
- One account for the client, created in phase 7
- Not publicly readable

## Access control summary

| Collection | create | read | update | delete |
| --- | --- | --- | --- | --- |
| products | admin | public | admin | admin |
| gallery | admin | public | admin | admin |
| site-settings | — | public | admin | — |
| orders | **public** | admin | admin | admin |
| media | admin + public* | public | admin | admin |
| users | admin | admin | admin | admin |

\* public create on media is needed only for the order form's sample-image
upload. Restrict it to images and cap the file size.

## Verification

- `pnpm generate:types` produces `payload-types.ts` with no errors
- Every collection and field label renders in Persian in the admin
- Creating a product with `priceOnRequest` checked hides the price field
- Products list sorts by `sortOrder`
- Site settings saves and reloads correctly
- Uploading an image generates all three sizes
- Signed out, a public API read of `products` succeeds and a read of `orders`
  is rejected

## Notes

- Prefer fewer, obvious fields over many clever ones
- `sortOrder` as a plain number is deliberate — drag-and-drop ordering is a
  bigger lift and easy to add later if she asks
- Persian labels are not cosmetic; they are the difference between a client who
  self-serves and one who calls

## References

- @context/project-overview.md
- @context/features/phase-1-setup-spec.md
- @context/features/phase-4-products-spec.md
- @context/features/phase-5-order-form-spec.md
