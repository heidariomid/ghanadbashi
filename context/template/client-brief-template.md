# Client brief template — phase 0 demo

Fill in the placeholders and hand this to the agent. It produces a static,
deployable homepage for client approval. **No backend, no CMS, no database.**

Keep it in this order: constraints first, then content, then verification. The
agent follows early instructions more reliably than late ones.

---

## The brief

> Build a **{LANGUAGE}** ({DIRECTION}) homepage for **{BUSINESS TYPE}** as a
> frontend-only prototype.
>
> **Scope — this is a visual prototype for client approval:**
>
> - No backend, CMS, database, auth or APIs. Realistic mock data only.
> - All content in `src/data/content.ts`, typed, so it can be re-branded in one
>   file and swapped for a CMS later.
> - Must look like a professionally designed production site, not a template.
>
> **Stack:** Next.js (App Router), TypeScript strict, Tailwind v4 with CSS-based
> `@theme` — no `tailwind.config.ts`. Path alias `@/*` → `./src/*`. No component
> library. No unnecessary dependencies.
>
> **Design source:** {ONE OF — "implement the approved export at {PATH}, porting
> its tokens verbatim" / "propose a direction from the brand notes below"}
>
> **Language and direction:** `<html lang="{LANG}" dir="{DIR}">`, {FONT} via
> `next/font`. Logical properties only — `ps-*`, `pe-*`, `ms-*`, `me-*`,
> `start-*`, `end-*`, `text-start`. Numbers localised with
> `toLocaleString('{LOCALE}')`.
>
> **Sections:** header with nav and a prominent {PRIMARY CTA}; hero; category
> grid; featured items with price; gallery; about; ordering CTA; contact;
> footer; a floating {CONTACT CHANNEL} button.
>
> **Brand:** {NAME} · {TAGLINE} · {AREA} · {PHONE} · {SOCIAL}
>
> **Categories:** {LIST}
>
> **Imagery:** {ONE OF — "use these URLs" / "placeholder photography, flagged as
> placeholder" / "hand-authored inline SVG, one component per drawing"}
>
> **Mobile matters most** — most visitors arrive from a {SOURCE} link. Design
> the phone layout deliberately rather than letting desktop stack; tap targets
> ≥44px.
>
> **When you're done:** run `pnpm build` and `pnpm lint`, check 375 / 768 /
> 1280px in a real browser, confirm no horizontal overflow, then deploy and give
> me the URL.

---

## Notes for whoever writes the brief

**Name the design source explicitly.** "Make it look premium" produces a
different site every run. An export with tokens produces the same site every
run.

**Say what the demo is for.** Stating "this is for client approval, nothing is
final" gets you a faster, cheaper first pass instead of a gold-plated one.

**Ask for removal, not addition.** "If something isn't working, remove it rather
than adding more" is the single most effective line for keeping a minimal design
minimal.

**Demand honest verification.** Add: *"If you cannot actually check the visuals,
say so plainly rather than claiming you did."* Then require specific evidence —
a measured `scrollWidth`, a screenshot — not a claim.

**Placeholders to replace before the client sees it:** brand name, prices,
phone, social handles, and any stock photography.
