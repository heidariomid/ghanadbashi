export const CART_STORAGE_KEY = 'ghanadbashi-cart'
export const CART_MAX_QUANTITY = 1000
export const CART_MAX_LINES = 50

export type CartItemKind = 'product' | 'gallery'

export interface CartItem {
  key: string
  kind: CartItemKind
  id: number
  title: string
  slug: string
  quantity: number
  imageSrc?: string
  imageAlt?: string
}

export interface CartProductInput {
  kind?: CartItemKind
  id: number
  title: string
  slug: string
  imageSrc?: string
  imageAlt?: string
}

export function cartLineKey(kind: CartItemKind, id: number): string {
  return `${kind}:${id}`
}

export function cartProductFrom(
  product: { id: number; title: string; slug?: string | null },
  image: { src: string; alt: string } | null,
): CartProductInput {
  return {
    kind: 'product',
    id: product.id,
    title: product.title,
    slug: product.slug ?? '',
    imageSrc: image?.src,
    imageAlt: image?.alt,
  }
}

export function cartGalleryFrom(photo: {
  id: number
  title: string
  src: string
  alt: string
}): CartProductInput {
  return {
    kind: 'gallery',
    id: photo.id,
    title: photo.title,
    slug: '',
    imageSrc: photo.src,
    imageAlt: photo.alt,
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
  const kind = product.kind ?? 'product'
  const key = cartLineKey(kind, product.id)
  const next = items.map((item) => ({ ...item }))
  const existing = next.find((item) => item.key === key)
  if (existing) {
    existing.quantity = clampQuantity(existing.quantity + addBy)
    return existing.quantity === 0 ? next.filter((item) => item.key !== key) : next
  }
  if (next.length >= CART_MAX_LINES) return items
  const quantity = clampQuantity(addBy)
  if (quantity === 0) return items
  next.push({
    key,
    kind,
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
  const key = cartLineKey(product.kind ?? 'product', product.id)
  if (items.some((item) => item.key === key)) return items
  return upsertCartItem(items, product, 1)
}

export function setCartQuantity(items: CartItem[], key: string, quantity: number): CartItem[] {
  const nextQuantity = clampQuantity(quantity)
  if (nextQuantity === 0) return items.filter((item) => item.key !== key)
  return items.map((item) => (item.key === key ? { ...item, quantity: nextQuantity } : item))
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
  const kind: CartItemKind = row.kind === 'gallery' ? 'gallery' : 'product'
  return {
    key: cartLineKey(kind, row.id),
    kind,
    id: row.id,
    title: row.title.trim(),
    slug: row.slug,
    quantity,
    imageSrc: typeof row.imageSrc === 'string' ? row.imageSrc : undefined,
    imageAlt: typeof row.imageAlt === 'string' ? row.imageAlt : undefined,
  }
}
