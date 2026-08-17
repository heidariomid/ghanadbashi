# Phase 1 — Project Setup Spec

## Overview

Phase 1 of 7. Stand up the Next.js project with Persian RTL support, the theme,
and Payload CMS connected to Neon. No public pages yet — this phase is done when
`/admin` loads in Persian and the homepage renders one styled Persian heading in
the right font, right-aligned.

## Requirements

### Project init

- Next.js 16, App Router, TypeScript strict, pnpm
- Path alias `@/*` → `./src/*` in `tsconfig.json` (note: **not** the repo root —
  imports read `@/components/...` with no `src/` prefix)
- ESLint with `next/core-web-vitals`
- **No** `tailwind.config.ts` — Tailwind v4 is configured in CSS

### Route groups

Separate the public site from the admin so they can have different layouts:

```
src/app/
├── (site)/          # public site — RTL layout, Vazirmatn
│   ├── layout.tsx
│   └── page.tsx
└── (payload)/       # Payload admin — generated, do not hand-edit
```

### Font

- **Vazirmatn**, self-hosted via `next/font/local` (do not use a CDN)
- Download the woff2 files into `src/app/fonts/`
- Subset to Arabic + Latin; `display: 'swap'`
- Expose as a CSS variable and wire it to `--font-sans` in `@theme`
- Weights: 400, 500, 700

### RTL

- Root layout: `<html lang="fa" dir="rtl">`
- Verify Tailwind logical properties flip correctly (`ps-*`, `pe-*`, `ms-*`, `me-*`)
- Set `text-align: start` as the default, never `left`

### Theme

In `src/app/globals.css` under `@theme` — warm, appetising, homemade:

- Cream/off-white background
- Caramel/brown primary
- Soft pink accent
- Readable dark brown body text (not pure black)
- Use `oklch()` values
- Light mode only — no dark mode for this project

### Payload CMS

- Install `payload`, `@payloadcms/next`, `@payloadcms/db-postgres`,
  `@payloadcms/richtext-lexical`
- `src/payload.config.ts` with:
  - Postgres adapter pointed at Neon
  - `i18n` configured with the **`fa`** locale so the admin UI is Persian
  - `admin.meta` title set to the bakery's name
- Mount the admin at `/admin` via `src/app/(payload)/`
- `@payload-config` alias → `src/payload.config.ts`
- `Users` collection for auth, `Media` collection for uploads
- `pnpm generate:types` script wired up

### Database

- Neon Postgres project on the free tier
- `DATABASE_URI` and `PAYLOAD_SECRET` in `.env`
- Commit a `.env.example` with placeholder values
- Confirm Payload creates its tables on first run

### Environment

```
DATABASE_URI=
PAYLOAD_SECRET=
NEXT_PUBLIC_SERVER_URL=http://localhost:3000
```

## Verification

- `pnpm dev` starts, site and admin both served
- `/admin` loads with a **Persian** interface, first admin user can be created
- Homepage shows a Persian heading in Vazirmatn, aligned right
- A test element using `ps-8` visually pads on the **right** (RTL confirmed)
- `pnpm build` and `pnpm lint` pass

## Notes

- Payload owns its database tables — no separate ORM or migration tool
- Do not hand-edit anything under `src/app/(payload)/`
- Keep the first admin user's credentials; the client's real account is created
  in phase 7

## References

- @context/project-overview.md
- @CLAUDE.md
- @context/coding-standards.md
- @context/features/phase-2-cms-schema-spec.md
