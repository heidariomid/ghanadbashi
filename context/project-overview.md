# Project Overview — Home Bakery Website (قنادی خانگی)

🍰 A Persian-language site for a home-based bakery: showcase products, take
orders, and let the owner manage everything herself.

---

## The client

A home baker producing cakes, pastries, desserts and natural spreads to order.
She is **not technical** and has no experience with website administration.

After launch she must be able to — without any developer involvement:

- Add, edit and remove products
- Change prices, or switch a product to "استعلام قیمت" (price on request)
- Upload photos to the gallery
- Read incoming orders
- Update her phone number, WhatsApp, Instagram and service area

**This constraint drives every technical decision in the project.** Anything she
might reasonably want to change lives in the CMS.

---

## Original client brief

The client's own proposed structure, translated and preserved:

> **۱. صفحه اصلی** — a beautiful photo of the best cakes and pastries, brand
> name, a short line such as «طعم خانگی، با عشق و کیفیت», an order button, and a
> WhatsApp/call button.
>
> **۲. محصولات** — organised into categories. Each product needs a real photo, a
> short description, a price or «استعلام قیمت», and an order button.
>
> **۳. ثبت سفارش** — a very simple form: name, phone number, product, quantity,
> delivery date, notes, and the ability to attach a sample photo.
>
> **۴. گالری** — good-quality photos of previous work. Important for a bakery,
> because customers choose with their eyes first.
>
> **۵. درباره من** — a short, warm introduction: that she runs a home bakery and
> prepares products carefully with high-quality ingredients.
>
> **۶. تماس با ما** — phone, WhatsApp, Instagram and service area.

---

## Product categories

The seven categories from the brief. These populate the category `select` field
in the CMS and the filters on the products page.

| # | Category | Persian |
| --- | --- | --- |
| 1 | Birthday & occasion cakes | 🎂 کیک تولد و مناسبتی |
| 2 | Café & afternoon cakes | 🍰 کیک‌های کافه‌ای و عصرانه |
| 3 | Dry pastries | 🧁 شیرینی خشک |
| 4 | Desserts | 🍮 دسرها |
| 5 | Health-focused & diet products | 🌿 محصولات سلامت‌محور و رژیمی |
| 6 | Tahini, honey & peanut butter | 🥜 محصولات ارده، عسل و کره بادام‌زمینی |
| 7 | Gift packs | 🎁 پک‌های هدیه |

---

## Pages

| Route | Purpose |
| --- | --- |
| `/` | Hero, category grid, featured products, CTAs |
| `/products` | All products, filterable by the 7 categories |
| `/products/[slug]` | Single product detail + order CTA |
| `/order` | Order form (accepts `?product=` to pre-fill) |
| `/gallery` | Photo gallery of previous work |
| `/about` | About the baker |
| `/contact` | Phone, WhatsApp, Instagram, service area |
| `/admin` | Payload CMS — the client's dashboard |

---

## Language & direction

- **Persian (Farsi) only**, right-to-left throughout
- `<html lang="fa" dir="rtl">`
- **Vazirmatn** font, self-hosted via `next/font/local`
- Persian digits for prices and dates via `toLocaleString('fa-IR')`
- Delivery dates presented in the Jalali calendar
- The Payload admin runs with the `fa` locale, and every field is labelled in
  Persian

---

## Tech stack

| Category | Choice |
| --- | --- |
| Framework | Next.js 16 (App Router) |
| Language | TypeScript, strict |
| UI | React 19 + Tailwind CSS v4 — hand-rolled components, no component library |
| CMS | Payload CMS 3, self-hosted at `/admin` |
| Database | Neon PostgreSQL (free tier) |
| Image storage | Vercel Blob or Cloudflare R2 |
| Email | Resend — order notifications |
| Hosting | Vercel (free tier) |
| Tests | None — manual browser verification |

---

## Content model

Managed entirely through the Payload admin. Full field definitions in
@context/features/phase-2-cms-schema-spec.md.

- **Products** — title, slug, category, image, short description, price or
  price-on-request, availability, sort order
- **Gallery** — image, caption, sort order
- **Site Settings** (global) — brand name, tagline, hero image, about text,
  phone, WhatsApp, Instagram, service area
- **Orders** — submissions from the order form; a read-only inbox in the admin
- **Media** — uploaded images
- **Users** — one admin account for the client

---

## Design direction

- Warm, appetising, homemade — not corporate
- Photography leads: large images, generous whitespace, restrained UI
- Palette: warm cream, caramel, soft pink accents
- **Mobile-first.** Most visitors arrive on a phone from an Instagram link
- Persistent WhatsApp button — it's the client's primary sales channel

---

## Out of scope

Deliberately excluded to keep the project small. Possible later, at cost:

- Online payment / checkout
- User accounts for customers
- Order status tracking
- Multi-language (English)
- Blog or recipes
- Inventory management
- Automated shipping calculation

---

## Success criteria

1. A visitor can browse products by category and submit an order on a phone in
   under two minutes
2. Orders reach the client by email **and** appear in the admin
3. The client can add a product with a photo and price by herself, using the
   handoff guide
4. The site loads fast on a mobile connection
5. **The client does not need to contact the developer to change content**

---

## Build phases

Ordered and independently implementable — see @context/features/:

1. @context/features/phase-1-setup-spec.md — project setup, RTL, fonts, Payload
2. @context/features/phase-2-cms-schema-spec.md — collections & globals
3. @context/features/phase-3-homepage-spec.md — homepage
4. @context/features/phase-4-products-spec.md — product listing & detail
5. @context/features/phase-5-order-form-spec.md — order form
6. @context/features/phase-6-gallery-about-contact-spec.md — remaining pages
7. @context/features/phase-7-launch-handoff-spec.md — launch & client handoff
