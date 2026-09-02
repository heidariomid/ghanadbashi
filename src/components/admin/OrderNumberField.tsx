'use client'

import type { TextFieldClientComponent } from 'payload'

import { formatOrderNumber } from '@/lib/order-number'

/** Edit sidebar: same shop number as the list column and the SMS. */
export const OrderNumberField: TextFieldClientComponent = ({ data }) => {
  const raw = data && typeof data === 'object' && 'id' in data ? data.id : null
  const n = typeof raw === 'number' ? raw : Number(raw)
  const label = Number.isFinite(n) ? formatOrderNumber(n) : '—'

  return (
    <div className="field-type order-number-field">
      <span className="field-label">شماره سفارش</span>
      <p className="order-number-field__value" suppressHydrationWarning>
        {label}
      </p>
    </div>
  )
}
