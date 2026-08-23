# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this project is

A small client website built from the reusable client-site template. The site is
public-facing and **content-managed by the client**, not by the developer. Every
piece of copy, image, price and contact detail comes out of the CMS.

> **The prime directive: never hardcode content.** If a client would ever want to
> change it — a phone number, a price, a headline, a photo — it belongs in the CMS,
> not in a `.tsx` file. Hardcoding content is what turns a delivered project into
> an endless stream of support calls.

## Commands

```bash
pnpm dev          # start dev server at localhost:3000 (site + /admin together)
pnpm build        # production build
pnpm start        # run production build
pnpm lint         # ESLint with Next.js core-web-vitals + TypeScript rules

pnpm payload      # Payload CLI
pnpm generate:types  # regenerate payload-types.ts after ANY schema change
pnpm db:pull      # replace local Postgres `bakery` with a full copy of production Neon
pnpm seed         # load seed photos into the current DATABASE_URI (needs Blob token)

pnpm migrate:create   # write a migration file after a schema change
pnpm migrate          # apply pending migrations to the current DATABASE_URI
pnpm migrate:status   # list which migrations have been applied
```

`pnpm db:pull` wipes local `bakery` first, then restores schema + data from
production. Requires `NEON_DATABASE_URI` (Neon dashboard Connection details, or
Vercel → Project → Settings → Environment Variables → DATABASE_URI). Photos may
404 locally if they live on Vercel Blob; content/structure still restores.
Re-run anytime for a fresh production copy. Needs PostgreSQL client tools.

Do not run `pnpm seed` against the production database from your laptop unless
`BLOB_READ_WRITE_TOKEN` is set. That is what broke the live photos last time:
seed re-uploads every image, writes new filenames into Neon, and without the
token those files stay on the laptop. Vercel then 404s. Client uploads on the
live `/admin` already go to Blob.

## Database changes

Local dev uses Postgres.app; production uses Neon. They are separate databases
and never talk to each other. Content only ever flows production → local, via
`pnpm db:pull`. Nothing local is ever pushed to Neon.

Schema travels the other way, as committed migration files. Vercel runs
`vercel-build` on deploy, which applies any pending migrations to Neon before
building.

`push` is off, so dev applies migrations exactly like production does. If you
change a collection or global without creating a migration, dev breaks
immediately — that's deliberate, and it's what stops a missing migration from
reaching production.

After editing anything in `src/collections/` or `src/globals/`:

```bash
pnpm migrate:create    # writes src/migrations/<timestamp>_<name>.ts
pnpm generate:types    # regenerates payload-types.ts
```

Commit both. `payload-types.ts` is what gives the frontend real types instead of
`any`; the migration is what gives Neon the new column.

> **A database touched by dev push must be baselined once.** Push leaves a
> `batch: -1` row in `payload_migrations`. When `payload migrate` sees it, it
> stops to ask an interactive question — which on Vercel means the build hangs
> until it times out, with no useful error. Plain `migrate` has no flag to skip
> that prompt, so the row has to go.
>
> ```bash
> DATABASE_URI="<neon-url>" pnpm migrate:baseline
> ```
>
> This drops the marker row and records the initial migration as applied, so
> migrate skips it instead of re-creating existing tables. Safe to re-run.

## Context Files

Read the following to get the full context of the project:

- @context/project-overview.md
- @context/coding-standards.md
- @context/ai-interaction.md
- @context/current-feature.md

## Stack

- **Next.js 16** with App Router
- **React 19**
- **Tailwind CSS v4** — CSS-based config via `@theme` in `src/app/globals.css`.
  There is **no** `tailwind.config.ts` and there must not be one.
- **Payload CMS 3** — self-hosted in this same Next.js app, admin at `/admin`
- **PostgreSQL** (Neon free tier) via `@payloadcms/db-postgres`
- **TypeScript** — strict mode
- **No component library.** Components are hand-rolled with Tailwind. Do not add
  shadcn/ui, MUI, Chakra or similar without asking.
- **No test framework.** Verification is manual, in the browser. See
  @context/ai-interaction.md.

## Payload CMS

Payload runs *inside* this Next app — it is not a separate service or a remote API.

- Config: `src/payload.config.ts`
- Collections: `src/collections/[Name].ts`
- Globals (single-instance content like site settings): `src/globals/[Name].ts`
- Admin UI mounts at `/admin` via `src/app/(payload)/`
- The public site lives in `src/app/(site)/`

Fetch content in server components with the **Local API** — it queries the
database directly in-process, with no HTTP round trip:

```ts
import { getPayload } from 'payload'
import config from '@payload-config'

const payload = await getPayload({ config })
const { docs } = await payload.find({ collection: 'products', limit: 100 })
```

Do **not** call the REST or GraphQL API from server components — the Local API is
faster and fully typed. Reserve REST for client-side calls if ever needed.

### Admin field labels

This project's client is not an English speaker and not technical. **Every field,
collection and group in the Payload config must carry a `label` in the client's
language**, with a short `admin.description` where the purpose isn't obvious. The
admin panel is a product deliverable, not a developer tool — treat its wording
with the same care as the public site.

## Language & direction

This is a **Persian (Farsi), right-to-left** site.

- `<html lang="fa" dir="rtl">` in the root layout
- Use Tailwind **logical properties** so RTL works automatically: `ps-*`/`pe-*`
  (padding start/end) and `ms-*`/`me-*` instead of `pl-*`/`pr-*`/`ml-*`/`mr-*`.
  Physical directions like `left-0` and `text-left` will be wrong in RTL.
- All user-facing copy is Persian, including form labels, validation messages,
  empty states, button text and error toasts
- Persian digits render via `toLocaleString('fa-IR')` — do not hand-map digits
- Font is Vazirmatn, self-hosted through `next/font/local`

## Path alias

`@/*` maps to `./src/*` in `tsconfig.json`, so imports read `@/components/...`
and `@/lib/...`. `@payload-config` is a separate alias pointing at
`src/payload.config.ts`.

> Note: this differs from the DevStash project, where `@/*` pointed at the repo
> root and every import needed a `src/` prefix. Here the alias is set up
> correctly, so **no `src/` prefix**.

## Package manager

Uses **pnpm**.

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
