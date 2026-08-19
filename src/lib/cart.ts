export const CART_STORAGE_KEY = 'ghanadbashi-cart'
export const CART_MAX_QUANTITY = 1000
export const CART_MAX_LINES = 50

export interface CartItem {
  id: number
  title: string
  slug: string
  quantity: number
  imageSrc?: string
  imageAlt?: string
}

export interface CartProductInput {
  id: number
  title: string
  slug: string
  imageSrc?: string
  imageAlt?: string
}

export function cartProductFrom(
  product: { id: number; title: string; slug?: string | null },
  image: { src: string; alt: string } | null,
): CartProductInput {
  return {
    id: product.id,
    title: product.title,
    slug: product.slug ?? '',
    imageSrc: image?.src,
    imageAlt: image?.alt,
  }
}

export function cartCount(items: CartItem[]): number {
  return items.reduce((sum, item) => sum + item.quantity, 0)
}

export function clampQuantity(value: number): number {
  if (!Number.isInteger(value) || value < 1) return 0
  return Math.min(CART_MAX_QUANTITY, value)
}

export function upsertCartItem(items: CartItem[], product: CartProductInput, addBy = 1): CartItem[] {
  const next = items.map((item) => ({ ...item }))
  const existing = next.find((item) => item.id === product.id)
  if (existing) {
    existing.quantity = clampQuantity(existing.quantity + addBy)
    return existing.quantity === 0 ? next.filter((item) => item.id !== product.id) : next
  }
  if (next.length >= CART_MAX_LINES) return items
  const quantity = clampQuantity(addBy)
  if (quantity === 0) return items
  next.push({
    id: product.id,
    title: product.title,
    slug: product.slug,
    quantity,
    imageSrc: product.imageSrc,
    imageAlt: product.imageAlt,
  })
  return next
}

export function ensureCartItem(items: CartItem[], product: CartProductInput): CartItem[] {
  if (items.some((item) => item.id === product.id)) return items
  return upsertCartItem(items, product, 1)
}

export function setCartQuantity(items: CartItem[], id: number, quantity: number): CartItem[] {
  const nextQuantity = clampQuantity(quantity)
  if (nextQuantity === 0) return items.filter((item) => item.id !== id)
  return items.map((item) => (item.id === id ? { ...item, quantity: nextQuantity } : item))
}

export function parseStoredCart(raw: string | null): CartItem[] {
  if (!raw) return []
  try {
    const parsed: unknown = JSON.parse(raw)
    if (!Array.isArray(parsed)) return []
    const items: CartItem[] = []
    for (const row of parsed) {
      const item = asCartItem(row)
      if (item) items.push(item)
      if (items.length >= CART_MAX_LINES) break
    }
    return items
  } catch {
    return []
  }
}

function asCartItem(value: unknown): CartItem | null {
  if (!value || typeof value !== 'object') return null
  const row = value as Record<string, unknown>
  if (typeof row.id !== 'number' || !Number.isInteger(row.id) || row.id <= 0) return null
  if (typeof row.title !== 'string' || !row.title.trim()) return null
  if (typeof row.slug !== 'string') return null
  const quantity = clampQuantity(typeof row.quantity === 'number' ? row.quantity : 0)
  if (quantity === 0) return null
  return {
    id: row.id,
    title: row.title.trim(),
    slug: row.slug,
    quantity,
    imageSrc: typeof row.imageSrc === 'string' ? row.imageSrc : undefined,
    imageAlt: typeof row.imageAlt === 'string' ? row.imageAlt : undefined,
  }
}
