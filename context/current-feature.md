# Current Feature: Phase 1 — Project Setup

## Status

In Progress

## Goals

- Keep the existing homepage rendering unchanged while introducing CMS
  infrastructure.
- Move the public site into `src/app/(site)/` and keep admin routing under
  `src/app/(payload)/`.
- Integrate Payload CMS with Neon Postgres and configure the admin for Persian
  (`fa`) locale.
- Add and verify core Payload setup (`Users`, `Media`, `@payload-config` alias,
  and `pnpm generate:types` workflow).
- Configure environment values (`DATABASE_URI`, `PAYLOAD_SECRET`,
  `NEXT_PUBLIC_SERVER_URL`) and commit safe placeholders in `.env.example`.
- Pass phase verification: `pnpm dev`, Persian `/admin`, unchanged homepage RTL,
  `pnpm build`, and `pnpm lint`.

## Notes

- Phase 0 already delivered the Next.js 16 base, RTL behavior, theme tokens, and
  initial Vazirmatn wiring for the demo.
- This phase is partly done: remaining work is Payload + Neon setup, route-group
  split, and local font self-hosting with the required weights.
- Tailwind must remain CSS-configured (no `tailwind.config.ts`), and the explicit
  source setup in `globals.css` should remain intact.
- Keep the phase 0 dependency constraints: TypeScript 6 and ESLint 9 compatible
  package pins.
- Do not hand-edit generated files under `src/app/(payload)/`.
- Definition of done: `/admin` loads in Persian and the homepage still renders
  unchanged.

## History

- Init
- Built an illustration-led prototype (hand-authored SVG line art, no
  photography) against the original `prompt` brief.
- Client approved a different, photography-led design in Claude Design. Replaced
  the prototype: ported the design system tokens (parchment, rosé, espresso),
  the brand «قناد باشی عسل», Isfahan contact details, and all imagery.
- Mobile pass: page height cut from 15,767px to 11,488px at 390px wide,
  categories and gallery two-up, every tap target ≥44px, footer trimmed.
- Deployed to Vercel; pushed to GitHub.
