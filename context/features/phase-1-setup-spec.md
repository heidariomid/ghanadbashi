# Phase 1 — Project Setup Spec

## Overview

Phase 1 of 7. Stand up the Next.js project with Persian RTL support, the theme, and Payload CMS connected to Neon.

**Partly done already.** Phase 0 built the Next.js app, RTL, the theme and the fonts in order to ship the demo. What remains here is Payload, Neon, and moving the public site into a `(site)` route group. Treat the sections below as a checklist of what is already true versus what is outstanding.

This phase is done when `/admin` loads in Persian and the existing homepage still renders unchanged.

## Requirements

### Project init — done in phase 0

- Next.js 16, App Router, TypeScript strict, pnpm
- Path alias `@/*` → `./src/*` in `tsconfig.json` (note: **not** the repo root — imports read `@/components/...` with no `src/` prefix)
- ESLint with `next/core-web-vitals`
- **No** `tailwind.config.ts` — Tailwind v4 is configured in CSS

Two setup details worth knowing, both discovered the hard way in phase 0:

- Tailwind's automatic source detection crawls the whole project and dies on stray non-source files. `globals.css` therefore uses `@import 'tailwindcss' source(none)` with an explicit `@source "../**/*.{ts,tsx}"`.
- ESLint pins matter: `typescript-eslint` does not support TypeScript 7, and `eslint-plugin-react` breaks on ESLint 10. The project runs TypeScript 6 and ESLint 9.

### Route groups — outstanding

Separate the public site from the admin so they can have different layouts. The demo's page currently sits at `src/app/page.tsx` and must move into `(site)/`:

```
src/app/
├── (site)/          # public site — RTL layout, Vazirmatn
│   ├── layout.tsx
│   └── page.tsx
└── (payload)/       # Payload admin — generated, edit only for the font wiring
```

### Font — partly done

- **Vazirmatn**, currently via `next/font/google`. Still to do: self-host with `next/font/local`, woff2 files in `src/app/fonts/`, no CDN
- Subset to Arabic + Latin; `display: 'swap'`
- Expose as a CSS variable and wire it to `--font-sans` in `@theme` — done
- Weights: 300, 400, 500, 600, 700, 900 — the approved design sets headings at 900, so the original 400/500/700 is not enough

### RTL — done in phase 0

- Root layout: `<html lang="fa" dir="rtl">`
- Verify Tailwind logical properties flip correctly (`ps-*`, `pe-*`, `ms-*`, `me-*`)
- Set `text-align: start` as the default, never `left`
- `overflow-x: clip` on `html` — `hidden` would break the sticky header
- Do not put `backdrop-filter` on the header: it becomes the containing block for `position: fixed` children and traps the mobile drawer inside the header

### Theme — done in phase 0

In `src/app/globals.css` under `@theme`, ported from the approved design system (`RTL Bakery Homepage Demo/_ds/.../tokens/`). See the palette table in @context/project-overview.md.

- Values are kept as the design system's hex, **not** converted to `oklch()` — matching the approved design exactly beats the format preference
- Light mode only — no dark mode for this project

### Payload CMS

- read docs first if you need use context7 mcp and here is the link to lookup: `https://payloadcms.com/docs/getting-started/what-is-payload`
- Install `payload`, `@payloadcms/next`, `@payloadcms/db-postgres`, `@payloadcms/richtext-lexical`
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
psql 'postgresql://neondb_owner:npg_QedSp0NXtl2m@ep-proud-breeze-azdpybu1-pooler.c-3.ap-southeast-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require'
PAYLOAD_SECRET=create_yourself_randomly
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
- Treat `src/app/(payload)/` as generated, except the Vazirmatn wiring in
  `layout.tsx` and `custom.scss` — see the note in @context/current-feature.md
- Keep the first admin user's credentials; the client's real account is created in phase 7

## References

- @context/project-overview.md
- @CLAUDE.md
- @context/coding-standards.md
- @context/features/phase-2-cms-schema-spec.md
