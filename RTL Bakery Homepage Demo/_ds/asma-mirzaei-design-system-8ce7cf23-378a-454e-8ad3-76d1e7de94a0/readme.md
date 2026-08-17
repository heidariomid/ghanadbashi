# Asma Mirzaei — Design System

**Artist:** Asma Mirzaei (اسماء میرزائی) — Tehran, Iran  
**Tagline:** *هنر، در هر قاب* — "Art, in every frame"  
**Website:** Single-page RTL Persian portfolio  
**Sources:** Codebase at `asma-portfolio/` (Next.js App Router, mounted via File System Access API)  
**Cloudinary CDN:** `https://res.cloudinary.com/dhe8lyjcf/` (cloud name `dhe8lyjcf`)  
**Live stack:** Next.js 14 + Tailwind v4 + shadcn/ui + Vazirmatn font

---

## About the Artist

Asma is a **multidisciplinary visual artist** rooted in painting and fine art (BFA, Azad University Tehran, 2025). Her practice spans:

1. **Photography** — Portrait, theatre, product, street, nature
2. **Graphic Design** — Editorial: magazines, posters, brochures, banners
3. **Fine Art** — Painting and illustration
4. **Children's Art Education** — Workshops, pottery, crafts

She ran the full art department at Pendar-No School for one year: school art exhibition, two magazine issues, children's poetry books, banners, brochures, and all photo/video content production.

**Contact:** +98 902 130 6761 · ammirzaei@gmail.com · [@asma.ph0t0](https://instagram.com/asma.ph0t0)

---

## Content Fundamentals

**Language:** All copy is Persian (Farsi). `lang="fa" dir="rtl"` globally.  
**Voice:** First person, personal, sensory. The artist speaks directly — no corporate distance.  
**Tone:** Warm, poetic, inviting. Never formal or bureaucratic.  
**Casing:** Persian script; normal sentence case. No ALL-CAPS.  
**Emoji:** Never used. Warmth comes from color and imagery.  
**Numbers:** Persian numerals (۱، ۲، ۳) for all display text (stats, dates, page counts).  
**Separators:** Em dash (—) and bullet (•) separate items in body copy.

### Copy patterns
| Pattern | Example |
|---|---|
| Section headline | `طراحی` + space + `گرافیک.` with accent span on the last word |
| Rosé accent | `<span style="color:var(--primary)">قاب.</span>` |
| Sub-copy | Short, 1–2 sentences, evocative. Ends with a statement, not a call to action. |
| CTA verbs | `دیدن نمونه‌کارها` / `ارسال پیام` / `بیایید با هم خلق کنیم` |
| Stats | Farsi numeral + `+` suffix — `۳+ سال`, `۲۰+ پروژه` |

---

## Visual Foundations

### Color
Warm parchment + rosé + espresso. No cool grays. No dark mode.

| Token | Hex | Role |
|---|---|---|
| `--background` | `#fbf6ee` | Parchment — page background |
| `--foreground` | `#5f5041` | Dark warm brown — body text |
| `--card` | `#fffdf8` | Off-white — card surfaces |
| `--card-foreground` | `#2c2620` | Deep espresso — card text |
| `--primary` | `#d98e88` | **Rosé** — CTAs, highlights, active states |
| `--primary-foreground` | `#f7fff6` | Near-white — text on primary buttons |
| `--secondary` | `#f6d6cf` | Soft blush — panels, tags, secondary buttons |
| `--secondary-foreground` | `#6b4035` | Dark terracotta — text on secondary |
| `--muted` | `#f1eadd` | Warm tint — subtle backgrounds |
| `--muted-foreground` | `#837868` | Subdued warm — captions, placeholders |
| `--border` | `#e8dfcf` | Warm beige — dividers, input outlines |
| `--blob-pink` | `#f6d2cb` | Hero blob decoration |
| `--blob-brown` | `#8a6553` | Asterisk, dots decoration |

### Typography
**Font:** Vazirmatn (Google Fonts) — full Persian/Arabic script support  
**Weights:** 300 (light), 400, 500, 600, 700, 900 (black for headings)  
**Display headings:** Weight 900, `line-height: 1.15`, `text-wrap: balance`  
**Body copy:** Weight 400, `line-height: 1.65`  
**Mono (code only):** Geist Mono

### Spacing & Radius
Highly rounded. Minimum `--radius-lg` (1rem) on all interactive elements.

| Token | Value | Use |
|---|---|---|
| `--radius-sm` | 0.6rem | Badges, chips |
| `--radius-md` | 0.8rem | Inputs |
| `--radius-lg` | 1rem | Cards, buttons |
| `--radius-xl` | 1.4rem | Large cards |
| `--radius-2xl` | 1.8rem | Gallery cells |
| `--radius-3xl` | 2.2rem | Large panels |
| `--radius-4xl` | 2.6rem | Pill backgrounds |

### Shadows
Warm-tinted — never cold or gray.  
`--shadow-sm`: `rgba(95,80,65,0.10)` · `--shadow-md`: `rgba(95,80,65,0.12)` · `--shadow-lg`: `rgba(95,80,65,0.14)`  
Primary button hover glow: `0 4px 16px rgba(217,142,136,0.4)`

### Hover & Press States
- **Links / nav:** color → `var(--primary)`
- **Primary button:** `translateY(-2px)` + rosé glow shadow
- **Gallery images:** `scale(1.05)`, 0.5s ease transition
- **Icon buttons:** border + text → `var(--primary)`, slight lift
- **Press/active:** return to `translateY(0)`
- **Disabled:** `opacity: 0.5`, `pointer-events: none`

### Animations
All respect `prefers-reduced-motion: reduce`.

| Animation | Duration | Usage |
|---|---|---|
| `heroFadeUp` | 0.75s ease-out | Section entrance, staggered delays |
| `blobMorph` | 9–11s ease-in-out | Organic portrait blob shape |
| `blobPulse` | 4–5s ease-in-out | Ambient blob scale + opacity |
| `heroFloat` | 6s ease-in-out | Portrait floating |
| `cursorBlink` | 1s step-end | Typewriter cursor |
| Image hover | 0.5s ease | Gallery `scale(1.05)` |

### Glassmorphism / Blur
- Nav on scroll: `background: rgba(251,246,238,0.87)` + `backdrop-filter: blur(12px)`
- Lightbox: `background: rgba(0,0,0,0.90)`

### Layout
- Direction: `dir="rtl"` globally. Two-column grids have image on the **left** in RTL flow.
- Max width: `72rem` (1152px)
- Section padding: `80px 20px` mobile → `112px 32px` desktop
- Gallery: 2-col mobile → 3-col tablet → 4-col desktop (all cells `aspect-ratio: 1/1`)
- Section alternation: `--background` and `--card` backgrounds alternating

---

## Iconography

Icons are **Lucide React** (stroke, weight 2, rounded linecap/join). No icon font.  
Custom brand SVGs in `assets/`:

| File | Description | Color |
|---|---|---|
| `assets/asterisk.svg` | 3-line asterisk brand flourish, used near section headings | `--blob-brown` (#8a6553) |
| `assets/dots.svg` | 5 scattered circles, used near portraits | `--blob-brown` (#8a6553) |
| `assets/instagram.svg` | Custom Instagram glyph (Lucide removed brand icons) | `currentColor` |

Lucide icons in use: `ArrowLeft`, `Phone`, `Mail`, `ChevronDown`, `Menu`, `X`, `Camera`, `PenTool`, `LayoutGrid`, `Share2`, `Users`, `Baby`, `Video`, `Film`, `Check`, `MapPin`, `FileText`, `ChevronLeft`, `ChevronRight`

No emoji. No PNG icons. No unicode icon substitutes.

---

## Cloudinary Image Patterns

**Cloud:** `dhe8lyjcf`

```
Full quality:   https://res.cloudinary.com/dhe8lyjcf/image/upload/f_auto,q_auto/{id}
Thumbnail 600:  https://res.cloudinary.com/dhe8lyjcf/image/upload/w_600,h_600,c_fill,f_auto,q_auto/{id}
Thumbnail 400:  https://res.cloudinary.com/dhe8lyjcf/image/upload/w_400,c_fill,f_auto,q_auto/{id}
```

Key assets: `asma-portrait_hgwri9` · `about-me_kbbxbc.jpg` · `footer_pjxzql.jpg`

---

## File Index

```
styles.css                      Root @import chain (colors → typography → spacing → animations)
tokens/
  colors.css                    Color custom properties (99 total)
  typography.css                Vazirmatn Google Font + type scale tokens
  spacing.css                   Radius, spacing, shadow, layout tokens
  animations.css                Keyframes + easing/duration tokens
assets/
  asterisk.svg                  Brand flourish SVG
  dots.svg                      Decorative dots SVG
  instagram.svg                 Custom Instagram icon SVG
guidelines/
  colors-brand.card.html        Brand color swatches (primary, secondary, blobs)
  colors-neutrals.card.html     Neutral surface + text palette
  colors-pairs.card.html        Foreground-on-background pairings
  type-display.card.html        Display headings in weight 900
  type-body.card.html           Body, UI, label type specimens
  type-scale.card.html          Full type scale xs → 5xl
  spacing-radius.card.html      Border radius scale
  spacing-shadows.card.html     Shadow scale with warm tinting
  brand-voice.card.html         Tagline, disciplines, tone guide
  animations.card.html          Live animation demos
components/
  core/
    Button.jsx / .d.ts / .prompt.md      Primary CTA button, 5 variants
    Badge.jsx  / .d.ts / .prompt.md      Pill label for categories/tags
    Card.jsx   / .d.ts / .prompt.md      Off-white surface container
    Input.jsx  / .d.ts / .prompt.md      Text input with rosé focus ring
    core.card.html                        Component showcase card
  gallery/
    FilterBar.jsx / .d.ts / .prompt.md   Horizontal/vertical filter pills
    GalleryGrid.jsx / .d.ts / .prompt.md  Square-cell image grid
    gallery.card.html
  sections/
    SectionHeader.jsx / .d.ts / .prompt.md   Weight-900 heading + rosé accent
    StatCard.jsx      / .d.ts / .prompt.md   Metric tile for social proof
    ServiceCard.jsx   / .d.ts / .prompt.md   Service tile, default + secondary
    sections.card.html
ui_kits/
  portfolio/
    index.html       Full interactive RTL portfolio recreation
readme.md            This file
SKILL.md             Agent skill definition
```

---

## Design Rules for New Work

1. **RTL first** — all layout, text alignment, and icon placement must work right-to-left
2. **Warm palette only** — no cool grays or pure whites; always pull from token list above
3. **No dark mode** — light warm-paper theme only
4. **Rounded over sharp** — minimum `--radius-lg` (1rem) on all interactive elements
5. **Editorial, not corporate** — organic shapes, soft shadows, warm textures
6. **Gallery cells always `aspect-ratio: 1/1`** — `ratio` prop is semantic only
7. **Animations respect `prefers-reduced-motion`** — all keyframes gated on the media query
8. **Persian numerals** for display (۱، ۲، ۳); Latin numerals only in code/URLs
