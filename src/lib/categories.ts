/**
 * Starting rows written by the migration and by `pnpm seed`. After that the
 * baker owns the list in `/admin` — this array is not what the site reads.
 */
export const SEED_CATEGORIES = [
  { slug: 'birthday-cakes', emoji: '🎂', title: 'کیک تولد و مناسبتی' },
  { slug: 'cafe-cakes', emoji: '🍰', title: 'کیک‌های کافه‌ای و عصرانه' },
  { slug: 'cookies', emoji: '🍪', title: 'کوکی' },
  { slug: 'dry-pastries', emoji: '🧁', title: 'شیرینی خشک' },
  { slug: 'desserts', emoji: '🍮', title: 'دسرها' },
  { slug: 'healthy', emoji: '🌿', title: 'محصولات سلامت‌محور و رژیمی' },
  { slug: 'diet-cookies', emoji: '🥗', title: 'شیرینی و کیک‌های رژیمی و کوکی' },
  { slug: 'spreads', emoji: '🥜', title: 'ارده، عسل و کره بادام‌زمینی' },
  { slug: 'gift-packs', emoji: '🎁', title: 'پک‌های هدیه' },
  { slug: 'sport-drinks', emoji: '🥤', title: 'معجون رژیمی و ورزشکاری' },
] as const

export type CategoryValue = (typeof SEED_CATEGORIES)[number]['slug']

export interface CategoryChip {
  slug: string
  title: string
  emoji: string
}

export function resolveCategory(
  value:
    | number
    | { id: number; slug?: string | null; title: string; emoji?: string | null }
    | null
    | undefined,
): CategoryChip | null {
  if (!value || typeof value === 'number') return null
  return {
    slug: value.slug || String(value.id),
    title: value.title,
    emoji: value.emoji || '',
  }
}

export function categorySlugOf(
  value: number | { id: number; slug?: string | null } | null | undefined,
): string | undefined {
  if (!value || typeof value === 'number') return undefined
  return value.slug || String(value.id)
}

/** Reads `?category=`. Unknown or missing values become «همه». */
export function parseCategoryParam(
  raw: string | string[] | undefined,
  slugs: string[],
): string | undefined {
  const value = Array.isArray(raw) ? raw[0] : raw
  if (!value) return undefined
  return slugs.includes(value) ? value : undefined
}

/** Orders chip slugs by the CMS sort, unknown values last. */
export function sortByCategoryOrder(values: string[], order: string[]): string[] {
  return [...values].sort((a, b) => {
    const ai = order.indexOf(a)
    const bi = order.indexOf(b)
    return (ai === -1 ? order.length : ai) - (bi === -1 ? order.length : bi)
  })
}

