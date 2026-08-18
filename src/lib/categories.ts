/**
 * The one list of product categories. Both `products` and `gallery` build their
 * `select` options from this, so the client never sees two lists that disagree.
 */

export interface Category {
  value: string
  emoji: string
  label: string
}

export const CATEGORIES = [
  { value: 'birthday-cakes', emoji: '🎂', label: 'کیک تولد و مناسبتی' },
  { value: 'cafe-cakes', emoji: '🍰', label: 'کیک‌های کافه‌ای و عصرانه' },
  { value: 'cookies', emoji: '🍪', label: 'کوکی' },
  { value: 'dry-pastries', emoji: '🧁', label: 'شیرینی خشک' },
  { value: 'desserts', emoji: '🍮', label: 'دسرها' },
  { value: 'healthy', emoji: '🌿', label: 'محصولات سلامت‌محور و رژیمی' },
  { value: 'diet-cookies', emoji: '🥗', label: 'شیرینی و کیک‌های رژیمی و کوکی' },
  { value: 'spreads', emoji: '🥜', label: 'ارده، عسل و کره بادام‌زمینی' },
  { value: 'gift-packs', emoji: '🎁', label: 'پک‌های هدیه' },
  { value: 'sport-drinks', emoji: '🥤', label: 'معجون رژیمی و ورزشکاری' },
] as const satisfies readonly Category[]

export type CategoryValue = (typeof CATEGORIES)[number]['value']

/** Emoji make the admin's long select list scannable at a glance. */
export const categoryOptions = CATEGORIES.map(({ value, emoji, label }) => ({
  value,
  label: `${emoji} ${label}`,
}))

const byValue = new Map<string, Category>(CATEGORIES.map((c) => [c.value, c]))

/** Falls back to the raw value so a category retired from this list still renders. */
export function categoryLabel(value: string): string {
  return byValue.get(value)?.label ?? value
}

export function findCategory(value: string): Category | undefined {
  return byValue.get(value)
}

/**
 * Orders arbitrary category values by their position above, so filter chips
 * always appear in the same order regardless of what the query returned.
 */
export function sortByCategoryOrder(values: string[]): string[] {
  const order: string[] = CATEGORIES.map((c) => c.value)
  return [...values].sort((a, b) => order.indexOf(a) - order.indexOf(b))
}
