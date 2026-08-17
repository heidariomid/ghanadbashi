# Reusable Client-Site Template + Bakery Site Specs

## Context

Omid needs to take on small client websites (like this Persian home-bakery site) **profitably**. The blocker isn't the build — it's the aftermath: clients want to edit their own content but aren't technical, so they either call him for every small change or he has to hand-build a CMS + admin dashboard, which blows up the cost of a small project. He currently rejects these projects for that reason.

So this deliverable is two things at once:

1. **A portable, reusable template** in `new-website/` that turns "small client site" into a repeatable, mostly-copy-paste job — the real economic goal.
2. **A filled-in set of specs** for the first client (the bakery) that proves the template works.

Nothing is implemented here — this produces **documentation and specs only**, in `/Users/omid/Desktop/Brad/devstash/new-website`, mirroring the structure of `context/` so it's ready to move to its own repo. A copy of this plan is also written to `new-website/IMPLEMENTATION-PLAN.md` so it travels with the docs.

### What Payload CMS 3 is (for the record)

An open-source CMS that runs **inside** the Next.js app rather than as a separate service. You install it as a dependency, declare content types in a TypeScript config, and it generates a complete admin dashboard at `/admin` — auth, CRUD forms, image uploads, rich text — writing to your own Postgres. Payload 3 was rewritten for the App Router, so it shares the same repo, dev server, and deploy as the site. The admin UI is the code Omid currently hand-writes per client; here it comes from ~150 lines of schema.

### The core decision: don't build a CMS, don't use WordPress

Research findings that drove this (verified August 2026):

- **Sanity** free tier is generous (10k docs, 20 seats) — but has **no Persian locale at all** in [sanity-io/locales](https://github.com/sanity-io/locales). Disqualified: the baker would face an English-only editor.
- **Payload CMS 3** ships **Persian + Arabic translations in core** (`@payloadcms/translations`), is free to self-host, and is Next.js-native (runs *inside* the same Next app). Its known RTL layout bug ([issue #11162](https://github.com/payloadcms/payload/issues/11162)) is **closed**, fixed via PR #11282.
- **WordPress** solves the CMS problem but creates a maintenance problem (plugin/security updates, hosting, clients breaking the editor) and teaches nothing reusable between projects.

**Chosen: Payload CMS 3, self-hosted in the same Next.js app, Postgres on Neon free tier.** The client gets a Persian, RTL admin panel maintained by someone else. Omid writes zero admin UI. One `pnpm dev` runs both site and CMS. The whole thing deploys free (Vercel + Neon), so there's no hosting bill to chase a small client for.

**Why this compounds:** every client site reuses the same template — only the collection schemas and styling change. The second bakery/florist/café site is a fraction of the work of the first. That's what makes these projects worth accepting.

> Note on the "Lighter — plain Next + Tailwind" answer: honored for the **frontend** (no shadcn/ui, no Vitest, hand-rolled components). But the *admin* is the whole economic point, so Payload is added deliberately — it removes far more work than it adds. Flagged explicitly rather than assumed.

---

## Deliverable: file tree

```
new-website/
├── IMPLEMENTATION-PLAN.md          # this plan, copied so it travels with the docs
├── TEMPLATE-README.md              # how to reuse this for the NEXT client
├── CLAUDE.md                       # generic, project-agnostic
└── context/
    ├── project-overview.md         # BAKERY-specific
    ├── coding-standards.md         # generic (lighter stack)
    ├── ai-interaction.md           # generic (adapted workflow)
    ├── client-handoff.md           # BAKERY — Persian guide for the client
    ├── current-feature.md          # blank template
    └── features/
        ├── phase-1-setup-spec.md
        ├── phase-2-cms-schema-spec.md
        ├── phase-3-homepage-spec.md
        ├── phase-4-products-spec.md
        ├── phase-5-order-form-spec.md
        ├── phase-6-gallery-about-contact-spec.md
        └── phase-7-launch-handoff-spec.md
```

Two layers, clearly separated: generic files are copy-paste-ready for any future client; bakery files are the worked example.

---

## Stack (recorded in the template)

| Concern | Choice | Why |
| --- | --- | --- |
| Framework | Next.js 16, App Router | Same as DevStash |
| UI | React 19 + Tailwind v4 (`@theme`, no config file) | Lighter — **no shadcn/ui**, hand-rolled components |
| CMS | **Payload CMS 3**, self-hosted in the same app at `/admin` | Persian UI, RTL fixed, free |
| DB | Neon Postgres (free tier) | Payload's store |
| Images | Payload upload → Vercel Blob or R2 | Client uploads cake photos herself |
| Forms | Server action → Resend email + saved to CMS | Orders land in her inbox *and* the admin |
| Lang | Persian only, `lang="fa" dir="rtl"`, Vazirmatn font | Per user's answer |
| Tests | **None** (per lighter-stack choice) | Manual browser verification instead |
| Deploy | Vercel free tier | Zero running cost |

---

## Phase specs (content to write into each file)

Each follows the existing `context/features/*.md` house style: `# Title`, `## Overview`, `## Requirements`, `## References` with `@path` links.

**Phase 1 — Setup.** Next.js 16 + Tailwind v4 init; Vazirmatn via `next/font/local`; `<html lang="fa" dir="rtl">`; `@theme` bakery palette (warm cream/caramel/pink); Payload 3 installed with Postgres adapter + `fa` locale; `/admin` reachable; Neon connected.

**Phase 2 — CMS schema (the heart of the template).** Payload collections, every field labelled **in Persian** so the baker sees her own language:
- `Products` — title, slug, category (select: the 7 client categories), image (upload), short description, price *or* "استعلام قیمت" toggle, `isAvailable`, `sortOrder`
- `GalleryImages` — image, caption, sortOrder
- `SiteSettings` (global) — brand name, tagline, about text, phone, WhatsApp, Instagram, service area
- `Orders` — read-only inbox, populated by the form
Access control: one admin user (the client); public read via API only.

**Phase 3 — Homepage.** Hero (image + brand name + tagline from `SiteSettings`), two CTAs (ثبت سفارش / واتساپ), category grid, featured products, footer. All copy from CMS — nothing hardcoded.

**Phase 4 — Products.** `/products` with the 7 categories as filters; card = real photo + short description + price or "استعلام قیمت" + order button that deep-links to the form pre-filled with that product. `/products/[slug]` detail page. ISR + on-demand revalidation so edits appear without a rebuild.

**Phase 5 — Order form.** Fields exactly per the client message: نام، شماره تماس، محصول، تعداد، تاریخ تحویل، توضیحات، عکس نمونه. Persian phone validation, Jalali-friendly date input, image upload. Server action → save `Order` in Payload + email via Resend. Success/error states in Persian. Honeypot anti-spam.

**Phase 6 — Gallery, About, Contact.** Responsive gallery grid + lightbox from `GalleryImages`; About and Contact pulled from `SiteSettings`; sticky WhatsApp float button; `tel:` / `wa.me` / Instagram links.

**Phase 7 — Launch & handoff.** SEO metadata + OG images, Persian slugs, sitemap/robots, Lighthouse pass, mobile check, deploy to Vercel, custom domain, create the client's admin account — then `client-handoff.md`: a short **Persian** guide showing her how to add a product, change a price, upload a gallery photo, and read orders. This document is what stops the phone calls.

---

## Generic template files

- **CLAUDE.md** — commands, lighter-stack conventions, "products/content come from Payload, never hardcode", Persian/RTL rules. Project-agnostic.
- **coding-standards.md** — adapted from DevStash: TS strict, no `any`, server components by default, Tailwind v4 CSS-only config, Zod on all form input, `{ success, data, error }` from actions. Testing section replaced with manual-verification checklist.
- **ai-interaction.md** — the 10-step workflow (document → branch → implement → verify → commit → merge → delete → log history), minus the test step.
- **TEMPLATE-README.md** — the reuse playbook: what to change per client (palette, fonts, collection schemas, copy), what never changes, and a rough time estimate per phase.

---

## Verification

Docs-only, so verification is review-based:

1. `ls -R new-website/` matches the tree above, including `IMPLEMENTATION-PLAN.md` at the root.
2. Generic files contain **no bakery references** — grep for `کیک`/`bakery` in `coding-standards.md`, `ai-interaction.md`, `CLAUDE.md` returns nothing.
3. Every one of the client's 6 sections and 7 product categories is traceable to a phase spec.
4. `@` cross-references between specs resolve to real paths.
5. Phase specs are ordered so each is independently implementable.

Real validation comes later, when Phase 1 is executed in a fresh repo.

---

## Open item (non-blocking)

Persian/Jalali date input in the order form: use a light `react-multi-date-picker` or a plain text field with a Persian placeholder. Decide during Phase 5 — it doesn't affect the docs.
