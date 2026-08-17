# Template — building the next small client site

Everything in this folder is **project-agnostic**. It exists so the second,
third and tenth small client site cost a fraction of the first.

The economics only work if the client never needs you after delivery. That is
the single idea behind every file here.

| File | Use it for |
| --- | --- |
| `implementation-plan.md` | The meta-plan: stack decisions, phase structure, and why Payload rather than WordPress or Sanity |
| `client-brief-template.md` | Fill in and hand to the agent to produce the phase-0 demo |
| `lessons-learned.md` | **Read before starting.** Every mistake this project actually hit, with the fix |
| `examples/` | The real brief used on the bakery site, kept as a worked example |

See also `TEMPLATE-README.md` at the repo root for the stack summary and the
per-phase effort estimates.

## Starting a new client site

1. **Copy the repo**, delete `src/data/content.ts`'s contents, keep the shape.
2. **Rewrite `context/project-overview.md`** — the only fully client-specific
   plan file. Brand, contact details, categories, what they actually asked for.
3. **Read `lessons-learned.md`.** Twenty minutes here saves a day of rediscovery.
4. **Run phase 0** using `client-brief-template.md`: a static demo, deployed,
   sent to the client. Do not touch the CMS yet.
5. **Get written confirmation on the design**, then work phases 1–7 in order
   from `context/features/`, following the workflow in
   @context/ai-interaction.md.

## What changes per project, what doesn't

| Changes every time | Carries over untouched |
| --- | --- |
| `context/project-overview.md` | `CLAUDE.md` |
| Collection schemas — field names only | `context/coding-standards.md` |
| Theme tokens in `globals.css` | `context/ai-interaction.md` |
| Font, language and direction | This folder |
| Copy, photography, page sections | Payload + Next + Tailwind wiring |
| | Order form pattern, deploy process |

## The two things people skip

**Phase 0.** It feels like a detour when you already know how to build the site.
It isn't: on this project the client approved a design completely different from
the written brief. Everything built before that approval would have been thrown
away.

**Phase 7's handoff guide.** A short guide in the client's language — add a
product, change a price, upload a photo, read orders. It is the document that
stops the phone calls, and it is the easiest thing to skip once the build feels
finished. Skipping it is what makes these projects unprofitable.
