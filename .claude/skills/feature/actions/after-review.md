# After-Review Action

**Optional.** Best after implementation, before `/feature complete`.
`complete` does not wait for this. Skip it when the user wants to merge
without a Notion write-up.

Code that passes lint but was never opened in the browser or admin is
assumed, not reviewed.

A CMS field that saves but never renders is the pattern this step exists
to catch: wiring looked fine in code, the bug only appeared in the admin
or the browser. See `project.md` for this repo’s known QA story.

## 1. Read context

- [project.md](../project.md) — this repo’s Notion parent, client wording,
  production URL
- @context/current-feature.md — goals and notes
- The phase spec in @context/features/ if loaded from one
- @context/ai-interaction.md — verification checklists (sections A, B, C)

## 2. Code review

Review all changes on the feature branch against the goals:

- ✅ Goals met
- ❌ Goals missing or incomplete
- ⚠️ Code quality issues or likely bugs
- 🚫 Scope creep (work beyond goals)

Pay extra attention when the phase adds or wires **CMS fields**:

- Every client-editable field must be read on the public site — no stale
  `content.ts` fallbacks for optional values
- Admin field labels and descriptions in the admin language from `project.md`
- Hide-if-empty behaviour for optional contact/media fields

## 3. Automated checks

Run and fix before giving a pass:

```bash
pnpm lint
pnpm build    # needs DB if this project has one — see project.md
```

If `pnpm build` cannot reach the database, say so explicitly; do not claim
build passed. TypeScript compile success alone is not a full pass. See
`project.md` for this repo’s DB notes.

If this repo has schema codegen scripts (e.g. Payload `generate:types`),
run them after a schema change and commit the output if it changed.

## 4. Public site verification

@context/ai-interaction.md section **A**. Actually perform these — do not
infer from code:

- **Responsive** — 375px, 768px, 1280px
- **RTL** — logical properties, drawer direction, lightbox arrows
- **Content round-trip** — change each new CMS value in `/admin`, confirm it
  appears on the site within `revalidate` (~60s) or after hard refresh
- **Empty states** — clear each optional field you added; page must not crash
  or show stale hardcoded copy
- **Browser console** — no errors on `/` and on any page/section you touched

Use Playwright, curl, or the production URL in `project.md` when local
dev is unreliable.

## 5. Admin QA (required for CMS-touching phases)

@context/ai-interaction.md section **B**. Walk `/admin` as the client would:

- Open every collection/global you added or changed
- Create, edit, and delete a test row where applicable
- Upload an image if the phase touches media
- Watch the **browser console** while editing — especially rich text, uploads,
  and delete actions
- Save, reload the admin form, confirm values persisted

For each new admin field, explicitly test: **type → save → reload admin →
check public site**.

Skip only the checklist items that belong to a later phase.

## 6. Access control (when collections/globals changed)

Signed-out curl checks:

- Public reads that should work → 200
- Admin-only reads → 403

See section B end in @context/ai-interaction.md.

## 7. Save the result to Notion

The write-up is a **team briefing**, not a QA log. Someone who did not run
the checks should still understand: is it safe to ship, and what is broken
in plain words. Do **not** paste the findings in chat.

**Voice.** Short sentences. What a visitor or the client would see. Define
a term the first time it is not obvious. No file tours, no raw errors
unless one line of the message is the whole point.

1. Fetch `notion://docs/enhanced-markdown-spec` and follow it. Do not guess
   Notion markdown.
2. Search Notion using `project.md` (parent + index). Same subject → update.
   None → create under Parent and link from Index.
3. Title from `project.md` title shape + the H1 feature name
4. Page shape:
   - Opening callout: the one thing to remember + the verdict
   - A simple table: public site, admin, lint, build, console — PASS /
     FAIL / SKIPPED, each with a one-line reason a teammate can read
   - Blockers: what is broken, who it hits (visitor / client / nobody
     yet), and whether it is already fixed
   - Sign-off checkboxes from @context/ai-interaction.md section **C**
5. End with what they should do next (complete, or fix the blockers).

Never report success for a step you did not run.

## 8. Pointer in current-feature

Append only this to **Notes** (so `/feature complete` can see it ran):

```
After-review — [date]
- Verdict: Ready to complete / Needs changes
- Notion: {url}
```

## 9. Chat

Chat is **only**:

- The verdict: **Ready to complete** or **Needs changes**
- The Notion URL

If Needs changes: one line that the blockers are on the page; do not commit
or run `/feature complete`. If a step was skipped, one short clause why.

## 10. Cleanup

Before ending the turn, stop leftover work from this after-review:

- Kill `pnpm dev` and any other process you started
- Close Playwright / browser tabs used for QA
- Delete session-only screenshots and temp helpers (not CMS media)
