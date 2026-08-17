# Test Action

1. Read current-feature.md to understand what was implemented
2. Identify server actions and utility functions added/modified for this feature
3. Check if tests already exist for these functions
4. For functions without tests that have testable logic, write unit tests:
   - Vitest, in a `__tests__/` folder next to the code, named `[module].test.ts`
   - Focus on server actions (`src/actions/`) and utilities (`src/lib/`) —
     not components, pages or hooks
   - Mock anything that leaves the process: `@/src/lib/prisma`, `@/src/auth`,
     the email client. Never touch the real database or Resend
   - Use `mockSelected`/`mockRejected` from `src/lib/__tests__/helpers.ts` when
     a mocked Prisma query returns only `select`ed fields
   - Test the happy path and the error cases that have their own branch
   - Do not write tests just to write them. Use your best judgement — a test
     that only asserts a mock was called adds noise, not safety
5. Run `pnpm test` to verify all tests pass
6. Report test coverage for the new feature code (`pnpm test:coverage`)
