# Coding Standards

## TypeScript

- Strict mode enabled
- No `any` types — use proper typing or `unknown`
- Use the generated `payload-types.ts` for all CMS content. Never hand-write an
  interface that duplicates a Payload collection — regenerate instead
  (`pnpm generate:types`)
- Define interfaces for all component props
- Use type inference where obvious, explicit types where helpful

## React

- Functional components only
- Server components by default — only add `'use client'` when the component needs
  interactivity, hooks, or browser APIs
- Push `'use client'` as far down the tree as possible. A page should not become a
  client component just because one button inside it is interactive
- Keep components focused — one job per component
- Extract reusable logic into custom hooks

## Next.js

- Server components fetch content directly with the Payload Local API
- Use Server Actions for form submissions
- Use Route Handlers only when you need webhooks, specific HTTP status codes, or
  an endpoint for an external consumer
- Static rendering wherever possible; use `revalidate` or on-demand revalidation
  so client edits appear without a redeploy
- Use `next/image` for every image — never a bare `<img>`. Client-uploaded photos
  are large and unoptimized by default

## Content

- **Never hardcode client-editable content.** Text, prices, phone numbers,
  images, social links and business hours all live in the CMS
- Handle empty states everywhere. The client will delete things, leave fields
  blank, and publish half-finished records. A missing image or absent optional
  field must never crash the page
- Treat every optional CMS field as genuinely optional in the types and the JSX

## Tailwind CSS v4

**CRITICAL**: This project uses Tailwind CSS v4, which uses CSS-based configuration.

- **DO NOT** create `tailwind.config.ts` or `tailwind.config.js` (those are v3)
- All theme configuration goes in `src/app/globals.css` under the `@theme` directive
- Use CSS custom properties for colors, fonts and spacing

```css
@import "tailwindcss";

@theme {
  --color-brand: oklch(72% 0.12 55);
  --font-sans: var(--font-vazirmatn);
}
```

### RTL

- Use logical properties: `ps-*`/`pe-*`, `ms-*`/`me-*`, `start-*`/`end-*`,
  `text-start`/`text-end`
- Avoid `pl-*`, `pr-*`, `ml-*`, `mr-*`, `left-*`, `right-*`, `text-left`,
  `text-right` — they do not flip in RTL and will produce mirrored layouts
- Flex and grid direction flip automatically under `dir="rtl"`; don't fight it
  with `flex-row-reverse` unless the visual order genuinely differs

## Styling

- Tailwind utility classes for all styling
- No inline styles
- No component library — components are hand-rolled in `src/components/`
- Mobile-first. Most visitors to a small local business site arrive on a phone,
  often from an Instagram link
- Tap targets at least 44×44px

## File Organization

- Components: `src/components/[feature]/ComponentName.tsx`
- Pages: `src/app/(site)/[route]/page.tsx`
- Payload admin: `src/app/(payload)/` — generated, do not edit by hand
- Collections: `src/collections/[Name].ts`
- Globals: `src/globals/[Name].ts`
- Server Actions: `src/actions/[feature].ts`
- Lib/Utils: `src/lib/[utility].ts`

## Naming

- Components: PascalCase (`ProductCard.tsx`)
- Files: match the component name, or kebab-case for utilities
- Functions: camelCase
- Constants: SCREAMING_SNAKE_CASE
- Types/Interfaces: PascalCase, no prefix
- Payload collection slugs: lowercase plural (`products`, `orders`)

## Data Fetching

- Server components use the Payload Local API (`getPayload`)
- Never call the REST/GraphQL API from a server component
- Select only the fields you need and set a sane `limit` — Payload defaults to
  depth 2, which will over-fetch relationships if left unchecked
- Client components submit through Server Actions

## Validation

- Validate **all** form input with Zod in the server action, before it reaches
  the database. Client-side validation is a UX nicety, never a security boundary
- Validation messages are user-facing copy — write them in the site's language

## Error Handling

- try/catch in every Server Action
- Return the `{ success, data, error }` pattern from actions
- Display user-friendly messages in the site's language — never surface a raw
  exception, stack trace or database error to a visitor
- Log the real error server-side for debugging

## Security

- Payload handles admin auth — do not roll your own
- Public read access to published content only; write access is admin-only
- Never expose `PAYLOAD_SECRET` or the database URL to the client bundle. Only
  `NEXT_PUBLIC_*` variables reach the browser
- Rate-limit or honeypot any public form to keep spam out of the client's inbox

## Code Quality

- No commented-out code unless specified
- No unused imports or variables
- Keep functions under 50 lines when possible
- `pnpm build` and `pnpm lint` must both pass before committing

## Testing

This project has **no automated test suite** — it is a small content site where
the risk of regression is low and the cost of a test harness isn't justified.

Verification is manual instead. Before any commit, check in the browser:

- The page renders at mobile (375px), tablet (768px) and desktop (1280px) widths
- RTL layout is correct — nothing mirrored, no text running the wrong way
- Empty/missing CMS fields degrade gracefully
- Forms submit successfully and show correct success **and** error states
- `pnpm build` passes with no type errors
