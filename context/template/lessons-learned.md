# Lessons learned

Every item below cost real time on the first build. Read this before starting a
new site; each one is a mistake you do not need to repeat.

---

## Process

**Ship a demo before any backend work.** The client approved a design completely
different from the written brief — photography-led, different brand, different
palette. Any CMS wiring done first would have been thrown away. See
@context/features/phase-0-design-demo-spec.md.

**When a design export exists, port its tokens verbatim.** Colours, radii, type
scale, shadows, component specs. Do not re-interpret. Keep the export in the
repo and name it as the source of truth in `project-overview.md`.

**Fix stale specs the moment the design changes.** The phase-3 spec still
described a full-bleed hero with a dark overlay after the client approved a
two-column portrait hero. A stale spec is worse than no spec: the next session
reads it and "fixes" correct code back to wrong.

**Move superseded briefs out of the working root.** Same reason. Archive them
with a note saying what replaced them.

**Confirm the deployed URL works for someone outside your team.** Vercel's
Deployment Protection returns a login page to everyone else. Fetch the URL and
check the HTML — do not just open it yourself while signed in.

---

## Tailwind v4

**Automatic source detection can silently produce zero utilities.** It crawls
the whole project; on this build it hit a Chrome socket file inside a
screenshots folder and the entire scan died. Base styles still applied, so the
page looked *styled but broken* — the most confusing possible symptom. Always:

```css
@import 'tailwindcss' source(none);
@source "../**/*.{ts,tsx}";
```

**Dynamic class names must appear literally in a scanned file.** Storing
`aspect-3/4` in data and writing `` `lg:${item.aspect}` `` in the component
generates nothing. Store the full `lg:aspect-3/4` string instead.

**Conflicting utilities resolve by stylesheet order, not attribute order.**
`md:col-span-7 … md:col-auto` silently collapsed a 7-column cell to one track.
Don't put a reset variant next to the value it's meant to override.

**v4 removed the default `cursor: pointer` on buttons.** Restore it in the base
layer or every button feels dead:

```css
button:not(:disabled), [role='button']:not([aria-disabled='true']) { cursor: pointer; }
```

**v4 compiles `scale-105` to the `scale` property, not `transform`.** When
debugging, `getComputedStyle(el).transform` reads `none` while the zoom is
active. Check `.scale`.

---

## CSS and layout

**`backdrop-filter` creates a containing block for `position: fixed`
descendants.** A blurred sticky header trapped the mobile drawer inside the
82px header strip. Put the blur on an absolutely-positioned layer *inside* the
header instead, leaving the header itself unfiltered.

**Use `overflow-x: clip`, not `hidden`, on `html`.** `hidden` breaks
`position: sticky`.

**Clip off-canvas panels with a wrapper.** A drawer parked at `translate-x-full`
can widen the document. Wrap it in a `fixed inset-0 overflow-hidden` shell.

---

## Mobile

**Design mobile deliberately; do not just let desktop stack.** Seven full-width
category squares plus six gallery photos produced a 15,767px page — about 19
screens. Two-up categories and gallery brought it to 11,488px. Keep product
photos one-per-screen: those are the money shots.

**Uniform aspect ratios on phones.** Varied masonry ratios read as ragged at
narrow widths. Switch to a single square grid below `lg`.

**44px tap targets without wrecking the design.** Put the padding on the anchor
and keep the underline on an inner `<span>`, so the hit area grows while the
rule stays tight to the text.

**A floating action button will overlap a short footer.** Reserve bottom padding
on phones.

---

## Persian and RTL

**Never localise digits by testing "does this string contain a digit".** It
turned the Instagram handle `@ghanad_bashi_asal5` into `@ghanad_bashi_asal۵`.
Put an explicit flag on the fields that are actually numbers.

**Persian is a connected script — heavy letter-spacing breaks the joins.** An
eyebrow at `0.2em` looked wrong; `0.05em` is the ceiling.

**Load the weights the design actually uses.** The approved design sets headings
at 900; the original 400/500/700 was not enough.

**Logical properties throughout** — `ps-*`, `pe-*`, `ms-*`, `me-*`, `start-*`,
`end-*`, `text-start`. In RTL, `start` is the right edge, so a drawer anchored
to `start-0` with `translate-x-full` parks off-canvas correctly.

---

## Tooling

**Pin the linter stack.** `typescript-eslint` does not support TypeScript 7, and
`eslint-plugin-react` breaks on ESLint 10. Use TypeScript 6 and ESLint 9.
Symptom: `pnpm lint` fails before linting a single file.

**pnpm 11 replaced the build-script settings.** `onlyBuiltDependencies`,
`ignoredBuiltDependencies` and friends are gone; use an `allowBuilds` map in
`pnpm-workspace.yaml`. Deny unknown install scripts rather than approving them:

```yaml
allowBuilds:
  unrs-resolver: false
```

**Add `.env` to `.gitignore` before the CMS phase**, not after. A committed
Neon connection string or `PAYLOAD_SECRET` is not really undoable.

**Keep `.vercelignore` tight.** A 13MB screenshots folder in the upload caused a
Vercel API failure mid-deploy.

---

## Verifying visual work

**Full-page screenshots do not trigger lazy-loaded images.** A blank gallery in
a capture usually means the images never entered the viewport, not that the
layout broke. Scroll the section into view first, then capture.

**Prefer Playwright over raw headless Chrome.** Chrome's `--window-size`,
device-scale-factor and full-page behaviour interact confusingly and produced
screenshots that looked like broken layouts when the page was fine.

**Measure, don't eyeball.** `document.documentElement.scrollWidth` against
`window.innerWidth` settles an overflow question in one call; comparing
computed colours confirms a hover state actually applies.
