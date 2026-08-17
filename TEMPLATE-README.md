# Small Client Site — Reusable Template

A repeatable structure for building small, content-managed client websites
**profitably**: the client edits their own content, you don't get support calls,
and hosting costs nothing.

## The problem this solves

Small business clients want to update their own content but aren't technical.
That leaves three bad options:

1. **Hardcode the content** → the client calls you for every price change
2. **Hand-build an admin dashboard** → weeks of work that a small budget can't
   carry
3. **Reject the project** → no revenue

This template takes a fourth option: **wire in a CMS that already has an admin
panel**, so you write content schemas instead of dashboards. What used to be
thousands of lines of CRUD UI becomes ~150 lines of field definitions.

## The stack

| Concern | Choice |
| --- | --- |
| Framework | Next.js 16, App Router |
| UI | React 19 + Tailwind v4 (`@theme`, no config file), hand-rolled components |
| CMS | Payload CMS 3, self-hosted **inside** the same Next app at `/admin` |
| Database | PostgreSQL — Neon free tier |
| Images | Payload uploads → Vercel Blob or Cloudflare R2 |
| Email | Resend (form notifications) |
| Hosting | Vercel free tier |
| Tests | None — manual browser verification |

**Running cost: $0** on free tiers, at the traffic a local business actually
gets. No hosting invoice to chase.

### Why Payload

- Runs inside the Next.js app — one repo, one `pnpm dev`, one deploy
- Generates the entire admin UI (auth, CRUD, uploads, rich text) from a schema
- Ships **30+ admin UI translations in core**, including Persian and Arabic
- RTL layout issues in the admin were fixed upstream
  ([payload#11162](https://github.com/payloadcms/payload/issues/11162) → PR #11282)
- Free and open source; you own the database
- Local API queries the DB in-process — no HTTP hop, fully typed

### Why not the alternatives

- **WordPress** — solves the CMS problem, creates a maintenance problem (plugin
  and security updates, hosting, clients breaking the editor). Nothing carries
  over to the next project.
- **Sanity** — excellent free tier (10k docs, 20 seats), but
  [no Persian locale exists](https://github.com/sanity-io/locales). A
  Persian-speaking client would face an English-only editor. Fine for
  English/European-language clients.
- **Hand-built admin** — the thing this template exists to avoid.

## Using this for a new client

### 1. Copy the scaffolding

```bash
cp -r new-website/ ../client-name/
cd ../client-name && git init
```

### 2. Rewrite `context/project-overview.md`

The **only** file that is fully client-specific. Capture the client's actual
request, their content types, and their contact details.

### 3. Adjust what varies

| Changes every project | Stays the same |
| --- | --- |
| `context/project-overview.md` | `CLAUDE.md` |
| Collection schemas (`src/collections/`) | `context/coding-standards.md` |
| Theme palette in `globals.css` | `context/ai-interaction.md` |
| Font (language-dependent) | Payload + Next + Tailwind wiring |
| Site copy and page sections | Order/contact form pattern |
| Language & direction (`lang`, `dir`) | Deployment process |

### 4. Work the phases

The `context/features/phase-*.md` specs are ordered and independently
implementable. Feed them to Claude Code one at a time, following the workflow in
`context/ai-interaction.md`.

## Rough effort per phase

For a site of this size, once you've done it once:

| Phase | Work |
| --- | --- |
| 1 — Setup | Half a day |
| 2 — CMS schema | Half a day |
| 3 — Homepage | Half a day |
| 4 — Products | 1 day |
| 5 — Order form | Half a day |
| 6 — Gallery / About / Contact | Half a day |
| 7 — Launch & handoff | Half a day |

**≈ 4 days** for the first build. Subsequent sites land closer to **2**, since
only the schema and styling change — the wiring, form pattern, RTL setup and
deploy process all carry over.

## What makes it profitable

The economics only work if the client never needs you after delivery:

1. **Nothing client-editable is hardcoded.** Prices, photos, hours, phone
   numbers, social links — all CMS fields.
2. **The admin is in the client's language.** Every field carries a `label` and,
   where useful, an `admin.description`. The admin panel is a deliverable, not a
   developer tool.
3. **Ship a handoff guide.** A one-page walkthrough, in the client's language,
   with screenshots: add a product, change a price, upload a photo, read orders.
   This single document prevents most support calls.
4. **Free hosting.** No monthly invoice means no billing conversations.
5. **Empty states everywhere.** Clients delete things and leave fields blank. The
   site must never break when they do — a white screen becomes an urgent call.

## Structure

```
.
├── IMPLEMENTATION-PLAN.md      # full plan & rationale for the first build
├── TEMPLATE-README.md          # this file
├── CLAUDE.md                   # generic — conventions for Claude Code
└── context/
    ├── project-overview.md     # CLIENT-SPECIFIC — rewrite per project
    ├── coding-standards.md     # generic
    ├── ai-interaction.md       # generic — workflow & verification
    ├── client-handoff.md       # CLIENT-SPECIFIC — the guide you deliver
    ├── current-feature.md      # blank working template
    └── features/               # phased, implementable specs
```
