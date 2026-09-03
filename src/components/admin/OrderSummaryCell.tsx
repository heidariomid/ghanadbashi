'use client'

import type { DefaultCellComponentProps } from 'payload'

import { faNumber } from '@/lib/format'

/** List cell: first line, then how many more — not a truncated dump. */
export function OrderSummaryCell({ cellData }: DefaultCellComponentProps) {
  const text = typeof cellData === 'string' ? cellData.trim() : ''
  const lines = text ? text.split('\n').filter(Boolean) : []
  if (lines.length === 0) return <span className="order-summary-cell is-empty">—</span>
  const rest = lines.length - 1
  return (
    <span className="order-summary-cell" title={lines.join('\n')}>
      {lines[0]}
      {rest > 0 ? (
        <span className="order-summary-cell__more">
          {' '}
          و {faNumber(rest)} قلم دیگر
        </span>
      ) : null}
    </span>
  )
}
