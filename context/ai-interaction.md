# AI Interaction Guidelines

## Communication

- Be concise and direct
- Explain non-obvious decisions briefly
- Ask before large refactors or architectural changes
- Don't add features that aren't in the project spec
- Never delete files without clarification

## Workflow

The common workflow for every feature/fix:

1. **Document** — document the feature in @context/current-feature.md
2. **Branch** — create a new branch for the feature/fix
3. **Implement** — implement what's described in @context/current-feature.md
4. **After-review** (optional) — `/feature after-review` if the user wants
   a Notion QA write-up: code against goals, browser + admin, `pnpm lint`,
   `pnpm build`
5. **Iterate** — fix what the user or after-review flagged
6. **Commit** — only when the user asks
7. **Merge** — merge to main
8. **Delete Branch** — delete the branch after merge
9. Mark as completed in @context/current-feature.md and add to History

Do NOT commit without permission or before the build passes. If the build fails,
fix the issues first.

## Verification

There is no automated test suite in this project (see @context/coding-standards.md).
Verification is manual and must actually be performed — not assumed.

**When you do run `/feature after-review`**, actually perform both checklists
below. Skipping admin QA is how bugs like “delete gallery photo → something
went wrong” or Lexical rich-text console errors reach the client. The step
itself is optional.

### A. Public site (every phase)

Before marking any feature done:

- **Responsive** — 375px, 768px, 1280px
- **RTL** — no mirrored layouts, no text aligned the wrong way, icons and arrows
  point the correct direction
- **Empty states** — blank an optional field in the admin and confirm the page
  still renders
- **Forms** — submit a valid entry (success path) and an invalid one (error path);
  confirm the record lands in the CMS and any notification email arrives
- **Content round-trip** — change a value in `/admin`, confirm it appears on the
  public site (wait for `revalidate` or hard-refresh)
- **Build** — `pnpm build` and `pnpm lint` both pass. Local dev uses Postgres.app
  (`DATABASE_URI=postgresql://omid@localhost:5432/bakery`); no VPN needed.

Report honestly. If a step was skipped or something didn't work, say so plainly
rather than reporting success.

### B. Client admin QA (mandatory after CMS-touching phases)

Walk through `/admin` as the client would — not as a developer skimming code.
Do this on **production** (or a preview with the same Blob store and database)
before merge or before telling the client the phase is ready.

#### Products — محصولات

- [ ] Create a product with photo, category, «استعلام قیمت» → appears on homepage
      if «نمایش در صفحه اصلی» is checked
- [ ] Uncheck «استعلام قیمت», set a price → site shows formatted price
- [ ] Uncheck «موجود است» → site shows «فعلاً موجود نیست»
- [ ] Edit title → slug updates (or stays stable if already set)
- [ ] Delete the test product → gone from site

#### Gallery — نمونه کارها

- [ ] Create a نمونه کار with photo + category → appears in gallery grid and
      filter chip for that category within ~60s
- [ ] Change category → filter chip moves correctly
- [ ] **Delete from the list** (whole نمونه کار) → photo gone from site; media
      file may remain in رسانه‌ها (that is OK)
- [ ] **Do not** use the delete button on the image inside the edit form — that
      tries to delete the media file and fails if still linked (known Payload
      behaviour; guard should show a Persian error after fix is deployed)
- [ ] Replace image by picking a new upload → old file orphaned but site shows
      new photo

#### Media — رسانه‌ها

- [ ] Upload an image → thumbnail/card/hero sizes generated (check URLs in admin)
- [ ] Delete an **unused** file → succeeds
- [ ] Delete a file **still linked** to a product/gallery → clear Persian error,
      not «something went wrong»

#### Site settings — تنظیمات سایت

- [ ] Change `brandName` / `tagline` → hero updates on `/`
- [ ] Change `heroImage` / `aboutImage` → hero and about sections update
- [ ] Change `phone` / `whatsapp` / `instagram` / `serviceArea` → contact
      section and links update
- [ ] Edit **درباره من** rich text → About section updates; admin console clean
- [ ] Save, reload admin → values persisted

#### Orders — سفارش‌ها (after phase 5)

- [ ] Public form creates a row; admin shows it read-only except وضعیت
- [ ] Anonymous `GET /api/orders` returns 403

#### Access control (curl, no login)

- [ ] `GET /api/products` → 200
- [ ] `GET /api/gallery` → 200
- [ ] `GET /api/orders` → 403

#### When something fails

1. Reproduce in admin (note exact button clicked)
2. Check Vercel runtime logs: `vercel logs ghanadbashi.vercel.app --since 1h`
3. Fix, redeploy, **re-run the failing checklist item**
4. Record the bug in the phase History or current-feature Notes so it is not
   reintroduced

### C. Phase sign-off template

Copy into current-feature History when closing a phase:

```
Phase N verification — [date]
- Public site: PASS / FAIL (notes)
- Admin QA: PASS / FAIL (notes)
- Build/lint: PASS / FAIL
- Known gaps left for later phases: …
- Bugs found and fixed: …
```

## The client owns the content

This site is delivered to a non-technical client who maintains it alone.

- If a value could plausibly change, it belongs in the CMS
- Every new field needs a `label` in the client's language and, where the purpose
  isn't self-evident, an `admin.description`
- Prefer a few obvious fields over many clever ones. A field the client doesn't
  understand is a field they will misuse or ignore
- When adding a feature, ask: *does this create a reason for the client to call
  me?* If yes, reconsider the design

## Branching

Create a new branch for every feature/fix. Name it **feature/[feature]** or
**fix/[fix]**. Ask to delete the branch once merged.

## Commits

- Ask before committing (don't auto-commit)
- Use conventional commit messages (feat:, fix:, chore:, etc.)
- Keep commits focused — one feature/fix per commit
- Never put "Generated with Claude" or any AI attribution in commit messages

## When Stuck

- If something isn't working after 2–3 attempts, stop and explain the issue
- Don't keep trying random fixes
- Ask for clarification if requirements are unclear

## Code Changes

- Make minimal changes to accomplish the task
- Don't refactor unrelated code unless asked
- Don't add "nice to have" features
- Preserve existing patterns in the codebase

## Code Review

Review AI-generated code periodically, especially for:

- Security (access control on collections, input validation, leaked secrets)
- Performance (over-fetching from Payload, unoptimized images, needless client
  components)
- Logic errors (missing empty-state handling on optional CMS fields)
- Patterns (does it match the rest of the codebase?)
- RTL correctness (physical instead of logical Tailwind properties)
