'use client'

import type { DefaultCellComponentProps } from 'payload'

import { formatOrderNumber } from '@/lib/order-number'

/** List cell: shop number (1001…), and the way into the order. */
export function OrderNumberCell({ rowData, collectionSlug }: DefaultCellComponentProps) {
  const id = rowData?.id
  const n = typeof id === 'number' ? id : Number(id)
  if (!Number.isFinite(n) || !collectionSlug) return null
  return (
    <a className="order-number-cell" href={`/admin/collections/${collectionSlug}/${n}`}>
      {formatOrderNumber(n)}
    </a>
  )
}
