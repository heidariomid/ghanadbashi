# Review Action

**Mandatory after implementation, before commit or `/feature complete`.**
Code that passes lint but was never opened in the browser or admin is not
reviewed — it is assumed.

The Lexical `horizontalrule` crash in **درباره من** is the pattern this step
exists to catch: wiring looked fine in code, the bug only appeared when someone
actually typed in the admin field.

## 1. Read context

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
- Admin field labels and descriptions in Persian
- Hide-if-empty behaviour for optional contact/media fields

## 3. Automated checks

Run and fix before giving a pass:

```bash
pnpm lint
pnpm build    # needs DB reachability — VPN if Neon is blocked locally
```

If `pnpm build` cannot reach Postgres, say so explicitly; do not claim build
passed. TypeScript compile success alone is not a full pass.

After any Payload schema or plugin change:

```bash
pnpm generate:importmap
pnpm generate:types
```

Confirm generated files are committed if they changed.

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

Use Playwright, curl, or production (`ghanadbashi.vercel.app`) when local dev
is unreliable.

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

Skip only the checklist items that belong to a later phase (e.g. orders form
before phase 5).

## 6. Access control (when collections/globals changed)

Signed-out curl checks:

- Public reads that should work → 200
- Admin-only reads → 403

See section B end in @context/ai-interaction.md.

## 7. Record findings

Append to **Notes** in @context/current-feature.md (or prepare for History on
complete):

```
Review — [date]
- Code/spec: PASS / FAIL — …
- lint: PASS / FAIL
- build: PASS / FAIL / SKIPPED (reason)
- Public site: PASS / FAIL — …
- Admin QA: PASS / FAIL / N/A — …
- Console errors: none / …
- Bugs found and fixed this review: …
```

Use the phase sign-off template in @context/ai-interaction.md section **C**
when closing the phase on `/feature complete`.

## 8. Verdict

End the review with exactly one of:

- **Ready to complete** — all applicable checks passed or honestly skipped
  with reason; no open bugs
- **Needs changes** — list blockers; do not commit, push, or run
  `/feature complete` until fixed and this review is re-run

If anything was skipped, say what and why. Never report success for a step you
did not run.
