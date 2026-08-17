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
4. **Verify** — check it in the browser against the manual checklist below, then
   run `pnpm build` and `pnpm lint` and fix any errors
5. **Iterate** — adjust as needed
6. **Commit** — only after the build passes and the feature works
7. **Merge** — merge to main
8. **Delete Branch** — delete the branch after merge
9. **Review** — review AI-generated code periodically and on demand
10. Mark as completed in @context/current-feature.md and add to History

Do NOT commit without permission or before the build passes. If the build fails,
fix the issues first.

## Verification

There is no automated test suite in this project (see @context/coding-standards.md).
Verification is manual and must actually be performed — not assumed.

Before marking any feature done:

- **Responsive** — 375px, 768px, 1280px
- **RTL** — no mirrored layouts, no text aligned the wrong way, icons and arrows
  point the correct direction
- **Empty states** — blank an optional field in the admin and confirm the page
  still renders
- **Forms** — submit a valid entry (success path) and an invalid one (error path);
  confirm the record lands in the CMS and any notification email arrives
- **Content round-trip** — change a value in `/admin`, confirm it appears on the
  public site
- **Build** — `pnpm build` and `pnpm lint` both pass

Report honestly. If a step was skipped or something didn't work, say so plainly
rather than reporting success.

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
