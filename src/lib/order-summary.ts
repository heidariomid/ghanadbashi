import type { Payload } from 'payload'

import { resolveCategory } from '@/lib/categories'
import { faNumber } from '@/lib/format'

type Rel<T> = number | T | null | undefined

export type OrderLineKind = 'product' | 'gallery' | 'other'

export type OrderLine = {
  kind: OrderLineKind
  title: string
  quantity: number
}

export type OrderLineSource = {
  items?:
    | {
        product?: Rel<{ id: number; title?: string | null }>
        quantity?: number | null
      }[]
    | null
  galleryItems?:
    | {
        gallery?: Rel<{
          id: number
          caption?: string | null
          category?: Rel<{ id: number; slug?: string | null; title: string; emoji?: string | null }>
        }>
        quantity?: number | null
      }[]
    | null
  productNote?: string | null
  otherQuantity?: number | null
}

export const LINE_KIND_LABEL: Record<OrderLineKind, string | null> = {
  product: null,
  gallery: 'نمونه کار',
  other: 'سایر',
}

/** Structured cart lines for the admin receipt. */
export async function resolveOrderLines(
  data: OrderLineSource,
  payload?: Payload,
): Promise<OrderLine[]> {
  const items = data.items ?? []
  const galleryItems = data.galleryItems ?? []
  const productTitles = await productTitleMap(items, payload)
  const galleryTitles = await galleryTitleMap(galleryItems, payload)
  const lines: OrderLine[] = []

  for (const item of items) {
    const id = relId(item.product)
    const title =
      (typeof item.product === 'object' && item.product?.title?.trim()) ||
      (id != null ? productTitles.get(id) : undefined) ||
      (id == null ? 'محصول حذف‌شده' : 'محصول')
    lines.push({ kind: 'product', title, quantity: item.quantity ?? 1 })
  }

  for (const item of galleryItems) {
    const id = relId(item.gallery)
    const populated = typeof item.gallery === 'object' ? item.gallery : null
    const title =
      populated?.caption?.trim() ||
      resolveCategory(populated?.category)?.title ||
      (id != null ? galleryTitles.get(id) : undefined) ||
      (id == null ? 'نمونه کار حذف‌شده' : 'نمونه کار')
    lines.push({ kind: 'gallery', title, quantity: item.quantity ?? 1 })
  }

  const note = data.productNote?.trim()
  if (note) {
    lines.push({ kind: 'other', title: note, quantity: data.otherQuantity ?? 1 })
  }

  return lines
}

/** One line per cart item — list cell and SMS-style text. */
export async function formatOrderSummary(
  data: OrderLineSource,
  payload?: Payload,
): Promise<string> {
  const lines = await resolveOrderLines(data, payload)
  return lines
    .map((line) => {
      const prefix = LINE_KIND_LABEL[line.kind] ? `${LINE_KIND_LABEL[line.kind]}: ` : ''
      return `${prefix}${line.title} × ${faNumber(line.quantity)}`
    })
    .join('\n')
}

function relId<T extends { id: number }>(value: Rel<T>): number | undefined {
  if (typeof value === 'number') return value
  if (value && typeof value === 'object' && typeof value.id === 'number') return value.id
  return undefined
}

async function productTitleMap(
  items: NonNullable<OrderLineSource['items']>,
  payload?: Payload,
): Promise<Map<number, string>> {
  const titles = new Map<number, string>()
  const missing: number[] = []
  for (const item of items) {
    const id = relId(item.product)
    if (id == null) continue
    const title =
      item.product && typeof item.product === 'object' ? item.product.title?.trim() : undefined
    if (title) titles.set(id, title)
    else missing.push(id)
  }
  if (!payload || missing.length === 0) return titles
  const { docs } = await payload.find({
    collection: 'products',
    where: { id: { in: missing } },
    limit: missing.length,
    depth: 0,
    overrideAccess: true,
  })
  for (const doc of docs) titles.set(doc.id, doc.title)
  return titles
}

async function galleryTitleMap(
  items: NonNullable<OrderLineSource['galleryItems']>,
  payload?: Payload,
): Promise<Map<number, string>> {
  const titles = new Map<number, string>()
  const missing: number[] = []
  for (const item of items) {
    const id = relId(item.gallery)
    if (id == null) continue
    if (item.gallery && typeof item.gallery === 'object') {
      const title =
        item.gallery.caption?.trim() || resolveCategory(item.gallery.category)?.title
      if (title) {
        titles.set(id, title)
        continue
      }
    }
    missing.push(id)
  }
  if (!payload || missing.length === 0) return titles
  const { docs } = await payload.find({
    collection: 'gallery',
    where: { id: { in: missing } },
    limit: missing.length,
    depth: 1,
    overrideAccess: true,
  })
  for (const doc of docs) {
    titles.set(doc.id, doc.caption?.trim() || resolveCategory(doc.category)?.title || 'نمونه کار')
  }
  return titles
}
