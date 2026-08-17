# Phase 0 — Design Demo Spec

## Overview

Phase 0 of 7. A frontend-only homepage, deployed, shown to the client for
approval **before** any CMS or backend work begins.

This phase exists because design disagreement is cheap to fix in a static page
and expensive to fix once collections, an order form and revalidation hang off
it. It is also the cheapest possible way to find out whether a lead is serious.

Deliberately excluded here, and only here: Payload, the database, auth, APIs,
forms. Adding them at this stage is wasted work if the client wants a different
look.

## Requirements

- Single route (`/`) with every section of the brief present as a section:
  hero, categories, featured products, gallery, about, order CTA, contact.
- Implement the design the client approved, rather than inventing one. Where a
  design export exists (Claude Design, Figma), port its tokens verbatim —
  colours, radii, type scale, shadows, component specs.
- All content in `src/data/content.ts`, typed, shaped to match the phase 2
  collections so the swap to Payload is a data-source change, not a rewrite.
- Placeholder photography is acceptable and expected. Flag it as placeholder.
- Persian, RTL, mobile-first. The client will review on a phone.
- Deploy to Vercel and send a link. Do not screenshot — let her scroll it.

## Verification

- Correct at 375 / 768 / 1280px, no horizontal overflow at any width
- RTL: nothing mirrored, drawer opens from the right, WhatsApp button
  bottom-left
- Every tap target ≥ 44px
- The deployed URL opens for someone **not** on your Vercel team — check
  Deployment Protection, or the client sees a login page
- `pnpm build` and `pnpm lint` pass

## Exit criteria

The client confirms the design. Only then start phase 1.

If she asks for changes, they are cheap here — that is the entire point of the
phase.

## Notes

- Keep the design export in the repo. It is the reference for what was agreed,
  and worth diffing against when a later change "looks off".
- Resist wiring anything to a database to "save time later". The demo's value is
  that it is throwaway-cheap.

## References

- @context/project-overview.md
- @context/features/phase-1-setup-spec.md
- @context/current-feature.md
