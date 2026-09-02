import { toLatinDigits } from '@/lib/format'

/**
 * Public order numbers follow the usual shop counter: 1001, 1002, …
 * Payload `id` stays the row key; this is what SMS, email and the admin show.
 */
export const ORDER_NUMBER_BASE = 1000

export function publicOrderNumber(id: number): number {
  return ORDER_NUMBER_BASE + id
}

export function formatOrderNumber(id: number): string {
  return publicOrderNumber(id).toLocaleString('fa-IR', { useGrouping: false })
}

/** Typed search → Payload `id`. Accepts ۱۰۰۶, 1006, or a legacy raw id from old SMS. */
export function parseOrderNumberTerm(term: string): number | null {
  const compact = toLatinDigits(term).trim().replace(/[\s#-]/g, '')
  if (!/^\d+$/.test(compact)) return null
  const n = Number(compact.replace(/^0+/, '') || '0')
  if (!Number.isInteger(n) || n < 1) return null
  if (n > ORDER_NUMBER_BASE) return n - ORDER_NUMBER_BASE
  return n
}
