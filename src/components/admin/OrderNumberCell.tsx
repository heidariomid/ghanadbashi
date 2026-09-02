'use client'

import type { DefaultCellComponentProps } from 'payload'

import { formatOrderNumber } from '@/lib/order-number'

/** List cell: shop number (1001…), Persian digits, same as the SMS. */
export function OrderNumberCell({ rowData }: DefaultCellComponentProps) {
  const id = rowData?.id
  const n = typeof id === 'number' ? id : Number(id)
  if (!Number.isFinite(n)) return null
  return <span suppressHydrationWarning>{formatOrderNumber(n)}</span>
}
