# Current Feature

## Status

<!-- Not Started | In Progress | Complete -->

Not Started

## Goals

<!-- What success looks like, as bullets -->

## Notes

<!-- Context, constraints or details from the spec -->

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
  Nav «نمونه کارها» now points at the route; the `gallery` collection reuses the
  existing revalidation hook. After-review caught `priority` sitting in the
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
  borrowed stand-ins for «ارده، عسل و کره بادام‌زمینی» and «معجون رژیمی و
  ورزشکاری» out of her public portfolio; both carry a `borrowedPhoto` note in
  the seed manifest so `rg borrowedPhoto` finds every product still waiting on
  a real photo.
- Phase 9 — Client Guide: feat: add the Persian client handoff guide.
  Finished the screenshot-driven Persian guide (markdown + phone-readable
  PDF), pointed login at ghanadbashi.vercel.app/admin, and rewrote the Media
  «متن جایگزین» hint to the same plain sentence she is taught. Her own
  account, the live password, and watching her add a product unaided stay
  leftovers — Phase 8 (order email/SMS) is still deprioritised.
