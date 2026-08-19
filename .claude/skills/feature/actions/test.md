# Test Action

Optional. Most features in this skill’s usual repos have **no test
runner** — prefer `/feature after-review`. Do not invent a harness.

1. Read current-feature.md
2. Check `package.json` for a test script and look for existing tests
3. If there is no test runner: stop. Tell the user to use `/feature after-review`
4. If tests exist: follow **this repo’s** helpers and style. Do not copy
   Prisma, Vitest paths, or mock names from another project
5. Only add tests for new server actions or utilities with real branches
   (happy path + the error path that has its own code)
6. Run the repo’s test command and report what ran
