# Current Feature: Phase 10a — New Order SMS (SMS.ir)

## Status

<!-- Not Started | In Progress | Complete -->

Not Started

## Goals

<!-- What success looks like, as bullets -->

- `src/lib/sms.ts` posts JSON to `https://api.sms.ir/v1/send/verify` with
  `x-api-key`, treats `status === 1` as success, maps the documented codes,
  and never throws at the caller.
- The moment an order saves, she gets an SMS carrying the order number — she
  never has to open `/admin` to learn someone ordered.
- The same moment, the customer gets a receipt SMS with that same order number.
  It says the order was registered, never that it was confirmed.
- She can change the number that receives those alerts herself, from
  تنظیمات سایت, and that number is never served to the public API.
- A failed or skipped send never fails the customer's submit. The order saves,
  the Resend email still goes, and they still see success.
- `pnpm lint` and `pnpm build` pass; a signed-out
  `GET /api/globals/site-settings` shows no `orderNotificationPhone`.

## Notes

<!-- Context, constraints or details from the spec -->

- Spec: @context/features/phase-10a-new-order-sms-spec.md
- Phase 10 was split in three after pre-review. 10a ships first and alone; 10b
  (status SMS) and 10c (phone verification) are separate specs and separate
  branches. Independent of Phase 8 (email), which is deprioritised.
- Provider is **SMS.ir**, not Kavenegar. Switched because it has a sandbox (same
  URL, no credit spent) and a free پنل پایه with exactly two «ارسال سریع»
  templates — which is all 10a needs.
- `src/lib/sms.ts`, server-only, `fetch` + JSON. Do not install
  `sms-typescript` or `sms-ir-api`. Verify does not take a sender line.
- Every parameter value is capped at **25 characters** (`114`). Collapse
  whitespace, convert digits, truncate. No product titles in a parameter.
- Wording lives in the panel template (`#ORDER#`, `#NAME#`), not in our code.
  `templateId` is a number in env.
- Secrets stay in env: `SMSIR_API_KEY`, `SMSIR_TEMPLATE_*`. Only her alert
  number moves to the CMS, and it needs field-level read access because
  `site-settings` is `read: isPublic`.
- Adding that field is a schema change → `pnpm migrate:create` and
  `pnpm generate:types`, both committed.
- Local `.env` already holds the **sandbox** key. Production key on Vercel
  must have IP restriction off (Vercel has no stable egress IP; status `12`).
  Sandbox help: https://app.sms.ir/developer/help/sandbox — only template
  `123456` / `Code`.
- External leftovers: account in her name, two templates under ارسال سریع,
  and two sales questions (اینماد? custom templates on پنل پایه?).
- Out of scope for 10a: status SMS, OTP, `/v1/send/bulk`, creating templates
  from the app, an order-tracking page, WhatsApp, payment.

Pre-review — 2026-09-01
- Verdict: Needs decisions → team delegated the calls, all six settled
- Notion: https://app.notion.com/p/3ce92338f5f581ec869be06f1d04fcb3
- Decisions: order number still in every message (useful, not required by
  SMS.ir); codes and spend caps in Postgres (10c); her alert number in
  تنظیمات سایت with env as fallback; split into 10a/10b/10c and ship 10a first;
  the customer **does** get a receipt SMS on submit; the SMS.ir account is
  opened in her name.

## History

- Init
- Built an illustration-led prototype (hand-authored SVG line art, no
  photography) against the original `prompt` brief.
- Client approved a different, photography-led design in Claude Design. Replaced
  the prototype: ported the design system tokens (parchment, rosé, espresso),
  the brand «قناد باشی عسل», Isfahan contact details, and all imagery.
- Mobile pass: page height cut from 15,767px to 11,488px at 390px wide,
  categories and gallery two-up, every tap target ≥44px, footer trimmed.
- Deployed to Vercel; pushed to GitHub.
- Phase 1 — Project Setup: added Payload CMS with a Persian admin on Neon
  Postgres. Split the app into `(site)` and `(payload)` route groups, self-hosted
  Vazirmatn, typed the collections, and switched the package to ESM so the
  Payload CLI can load them.
- Phase 2 — CMS Schema: products, gallery, orders, site-settings, media on
  Vercel Blob; gallery filters, seed data, admin QA checklist.
- Phase 3 — Homepage CMS Wiring: wired site-settings contact and aboutText to
  the public site, footer polish, empty states; simplified about rich-text
  editor; mandatory `/feature review` gate before complete.
- Phase 4 — Products: added `/products` with URL category chips, moved site
  chrome into the layout, and revalidate `/` and `/products` when products or
  site-settings change.
- Phase 5 — Order Form: add the order basket and checkout form
- Local db:pull: `pnpm db:pull` copies production Neon into local `bakery`;
  PG18 client tools, plain SQL restore, strips unsupported GUCs for older local
  Postgres.
- Phase 6 — Gallery: add the gallery page. Scope cut from the spec's three
  routes to `/gallery` alone — the homepage and footer already carry the about
  and contact details, so `/about` and `/contact` would have been a third copy.
  Nav «نمونه کارها» now points at the route; the `gallery` collection reuses
  the existing revalidation hook. After-review caught `priority` sitting in the
  shared `GalleryGrid`, which made `/` preload a below-the-fold photo alongside
  the hero; it is now behind a `priorityFirst` prop that only `/gallery` sets.
- Phase 7 — Launch: SEO, sharing previews and the accessibility pass. The site
  served zero `og:`, `twitter:` and canonical tags, so every Instagram or
  WhatsApp link rendered as a bare box; a shared `buildPageMetadata` now feeds
  all four routes, plus `metadataBase`, a brand title template, `sitemap.ts`,
  `robots.ts` and `LocalBusiness` JSON-LD. `og:image` points at a new `/og`
  sharp route rather than the hero URL — uploads are portrait WebP, which
  WhatsApp handles unreliably and which crops to nonsense in a 1.91:1 card, so
  the route re-cuts the hero to a 1200×630 JPEG. The accessibility pass found
  three real defects, not just token drift: both off-canvas drawers were
  `aria-hidden` with tabbable buttons inside, the lightbox trapped no focus at
  all, and the light palette failed AA on CTA labels (2.52:1), form errors
  (2.53:1) and captions (4.02:1). The approved rosé fill was kept and only what
  sits on it changed — espresso labels, a new `--color-primary-strong` for
  rosé-as-text — updated in the design export first, then ported. Also dropped
  the deprecated Next 16 `priority` prop for `preload`/`eager`/`fetchPriority`,
  and stopped preloading the latin font subset. Lighthouse mobile: accessibility,
  best practices and SEO all 100 on every route, CLS 0; performance 84–92
  locally, short of the ≥90 goal, with the whole gap in a simulated LCP that
  needs re-measuring against production. Teaching the client the required
  «متن جایگزین» field moved to Phase 9.
- Admin panel theme: dressed `/admin` in the public site's parchment and rosé
  instead of Payload's grey default, entirely through `custom.scss` variable
  overrides plus a bakery wordmark and icon. A `proxy.ts` seeds the
  `payload-theme` cookie so a first visit lands in light mode rather than
  following the OS into dark. No collection, field or logic changes.
- Contrast and control affordances: the approved blush `#d98e88` could not
  carry a label — white on it was 2.5:1, which had forced near-black button
  text, and the button itself sat at 2.4:1 against parchment. Primary is now
  `#a8443e` (5.9:1 with white, 5.5:1 on the page) and the blush lives on as
  `secondary`, where large calm surfaces suit it. Added `--color-input` for
  anything outlining a control a visitor must find, since `border` is
  deliberately too faint to clear the 3:1 WCAG ask; filter chips now carry a
  border in both states so the row no longer reflows by 2px as the selection
  moves. Buttons gained a press state, and dark mode was reworked onto a black
  ground with brand blush kept for the order band and hero blobs.
- Hero rotating words and scroll reveal: the hero headline now cycles
  client-editable words through a typewriter, with the prefix and word list
  added to site-settings so she controls both. Reveal-on-scroll is CSS gated on
  `scripting: enabled`, so a visitor without JS sees the page rather than a
  blank one, and `prefers-reduced-motion` restores opacity instead of leaving
  content stuck hidden.
- Fill the empty product categories: five of the ten categories rendered as a
  bare emoji card and an empty `/products` filter. Re-filed the two photos that
  genuinely belonged elsewhere (red velvet to birthday cakes, date-filled
  cookies to diet cookies) and added one price-on-request product per empty
  category, left off the homepage «محصولات منتخب» row on purpose. A category
  with no gallery photo now falls back to its product image, which keeps the
  borrowed stand-ins for «ارده، عسل و کره بادام‌زمینی» و «معجون رژیمی و
  ورزشکاری» out of her public portfolio; both carry a `borrowedPhoto` note in
  the seed manifest so `rg borrowedPhoto` finds every product still waiting on
  a real photo.
- Phase 9 — Client Guide: feat: add the Persian client handoff guide.
  Finished the screenshot-driven Persian guide (markdown + phone-readable
  PDF), pointed login at ghanadbashi.vercel.app/admin, and rewrote the Media
  «متن جایگزین» hint to the same plain sentence she is taught. Her own
  account, the live password, and watching her add a product unaided stay
  leftovers — Phase 8 (order email) and Phase 10 (order SMS) are still
  deprioritised.
- fix: open gallery filtered to the category tile that was clicked.
  Homepage category tiles with portfolio photos linked to `#gallery`, which
  always opened «همه». They now go to `/gallery?category=` so the matching
  chip is selected; a category with no photos still goes to `/products`.
- feat: allow adding all available products and gallery items to the cart.
  Homepage «محصولات منتخب» was the only surface that felt orderable. Available
  products on `/products` already had the button; نمونه کارها now do too, with
  the same «موجود است» toggle. Cart lines carry a kind so product and gallery
  ids cannot collide, and orders keep a new `galleryItems` array so old rows
  stay intact.
- feat: let the baker add, edit and delete categories in admin.
  The ten baked-in selects became a `categories` collection so she can add
  more, rename, or remove them. Existing slugs stay so filter URLs do not
  break; a category still used by a product or نمونه کار cannot be deleted.
