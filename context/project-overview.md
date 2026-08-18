# Project Overview — قناد باشی عسل (Home Bakery Website)

🍰 A Persian-language site for a home-based bakery: showcase products, take
orders, and let the owner manage everything herself.

---

## Brand

| | |
| --- | --- |
| Name | قناد باشی عسل |
| Latin | GHANAD BASHI ASAL |
| Tagline | طعم خانگی، با عشق و کیفیت |
| Area | اصفهان، بهارستان و حومه |
| Phone / WhatsApp | 0936 908 8311 |
| Instagram | @ghanad_bashi_asal5 |

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

## Approach — demo first, then build

Design approval comes before any backend work. Phase 0 ships a static,
frontend-only homepage to a live URL; the client scrolls it on her phone and
confirms. Only then does phase 1 start.

The reason is cost: changing a layout in a static page is minutes, changing it
after collections, an order form and revalidation depend on it is not. It also
qualifies the lead cheaply — a client who won't respond to a demo link won't
respond to an invoice.

## Why Payload, and not the alternatives

The economics of a small client site are decided by one question: *who edits the
content after launch?* If the answer is "the developer", the project loses money
on support calls forever.

- **Payload CMS 3, self-hosted in the same Next.js app.** The Persian admin
  ships in core (`@payloadcms/translations` includes `fa`), and the RTL admin
  layout bug is fixed (issue #11162, PR #11282). You write **zero** admin code —
  no dashboard, no auth, no CRUD forms. Runs free on Vercel + Neon.
- **Not Sanity** — generous free tier, but `sanity-io/locales` has no Persian at
  all. The client would get an English-only editor. Disqualified.
- **Not WordPress** — trades a CMS problem for a maintenance problem: plugin
  updates, security patches, clients breaking the editor. Still phone calls,
  just different ones. And it teaches nothing reusable.

That last point is the real unlock. The phase 2 schemas are the asset: the
second small client site costs a fraction of the first, because only schemas and
styling change. That is what turns projects currently worth rejecting into ones
worth accepting.

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

The seven categories from the brief, plus two the client asked for later and one
(کوکی) added because it turned out to be her highest-volume product. These
populate the category `select` field in the CMS and the filters on the products
and gallery sections.

| # | Category | Persian |
| --- | --- | --- |
| 1 | Birthday & occasion cakes | 🎂 کیک تولد و مناسبتی |
| 2 | Café & afternoon cakes | 🍰 کیک‌های کافه‌ای و عصرانه |
| 3 | Cookies | 🍪 کوکی |
| 4 | Dry pastries | 🧁 شیرینی خشک |
| 5 | Desserts | 🍮 دسرها |
| 6 | Health-focused & diet products | 🌿 محصولات سلامت‌محور و رژیمی |
| 7 | Diet pastries, cakes & cookies | 🥗 شیرینی و کیک‌های رژیمی و کوکی |
| 8 | Tahini, honey & peanut butter | 🥜 محصولات ارده، عسل و کره بادام‌زمینی |
| 9 | Gift packs | 🎁 پک‌های هدیه |
| 10 | Diet & sports drinks | 🥤 معجون رژیمی و ورزشکاری |

Categories 1, 7, 8 and 10 have no photos at launch. The site renders only
categories that have published content, so they stay hidden until the client
uploads to them herself. Category 7 overlaps 3 and 6 by the client's own
choosing — she sorts that out in the admin.

---

## Pages

`/` exists today as a static demo containing every section. The remaining routes
are planned, not built.

**Open decision, settle before phase 4:** whether products, gallery, about and
contact stay as sections of the one page (simpler, fewer clicks, good for an
Instagram audience) or become the separate routes below (better SEO, room for
category filtering and product detail). The demo currently proves the one-page
version.

| Route | Purpose |
| --- | --- |
| `/` | Hero, category grid, featured products, gallery, about, order CTA, contact — **built** |
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
- **Vazirmatn** font. Currently loaded via `next/font/google`; self-hosting with
  `next/font/local` is still preferred before launch, to drop the build-time
  dependency on Google Fonts
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
| Image storage | Vercel Blob or Cloudflare R2 — the demo uses Unsplash URLs as placeholders |
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

**Source of truth: the client-approved Claude Design export in
`RTL Bakery Homepage Demo/`.** Its `_ds/.../tokens/*.css` files define the
system; `src/app/globals.css` ports them into Tailwind's `@theme`. When the two
disagree, the export wins — or update the export first, then the code.

- Warm, appetising, homemade — not corporate
- Photography leads: large images, generous whitespace, restrained UI
- Palette — warm parchment ground, espresso type, rosé accent, blush panels:

| Token | Value | Use |
| --- | --- | --- |
| `background` | `#fbf6ee` | page |
| `foreground` | `#5f5041` | body text |
| `card` | `#fffdf8` | raised sections |
| `card-foreground` | `#2c2620` | headings |
| `primary` | `#d98e88` | CTAs, hover, accents |
| `secondary` | `#f6d6cf` | the order band |
| `muted-foreground` | `#837868` | captions |
| `border` | `#e8dfcf` | hairlines |

- Headings at weight 900; heavily rounded corners (`--radius-sm` 0.6rem →
  `--radius-4xl` 2.6rem); warm-tinted shadows, never cold
- **Mobile-first.** Most visitors arrive on a phone from an Instagram link.
  Design mobile deliberately — the demo needed categories and gallery two-up to
  stop the page running to 19 screens
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

0. @context/features/phase-0-design-demo-spec.md — static demo, client approval
   — **done, awaiting her confirmation**
1. @context/features/phase-1-setup-spec.md — project setup, RTL, fonts, Payload
   — Next.js, RTL, theme and fonts done; Payload and the database outstanding
2. @context/features/phase-2-cms-schema-spec.md — collections & globals
3. @context/features/phase-3-homepage-spec.md — homepage
4. @context/features/phase-4-products-spec.md — product listing & detail
5. @context/features/phase-5-order-form-spec.md — order form
6. @context/features/phase-6-gallery-about-contact-spec.md — remaining pages
7. @context/features/phase-7-launch-handoff-spec.md — launch & client handoff
