'use client'

import { useState } from 'react'
import type { DefaultCellComponentProps } from 'payload'

const OPTIONS = [
  { value: 'new', label: '🆕 جدید' },
  { value: 'confirmed', label: '✅ تأیید شده' },
  { value: 'delivered', label: '📦 تحویل شده' },
  { value: 'cancelled', label: '❌ لغو شده' },
] as const

type OrderStatus = (typeof OPTIONS)[number]['value']

function isOrderStatus(value: string): value is OrderStatus {
  return OPTIONS.some((option) => option.value === value)
}

/** List cell: change وضعیت here — no bulk-edit drawer. */
export function OrderStatusCell({ rowData, cellData }: DefaultCellComponentProps) {
  const id = rowData?.id
  const initial = typeof cellData === 'string' && isOrderStatus(cellData) ? cellData : 'new'
  const [status, setStatus] = useState<OrderStatus>(initial)
  const [saving, setSaving] = useState(false)
  const [note, setNote] = useState<'ok' | 'err' | null>(null)

  async function onChange(next: string) {
    if (!isOrderStatus(next) || next === status || saving || id == null) return
    const previous = status
    setStatus(next)
    setSaving(true)
    setNote(null)
    try {
      const response = await fetch(`/api/orders/${id}`, {
        method: 'PATCH',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: next }),
      })
      if (!response.ok) throw new Error('save failed')
      setNote('ok')
    } catch {
      setStatus(previous)
      setNote('err')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div
      className="order-status-cell"
      onClick={(event) => event.stopPropagation()}
      onPointerDown={(event) => event.stopPropagation()}
    >
      <select
        className="order-status-cell__select"
        value={status}
        disabled={saving}
        onChange={(event) => void onChange(event.target.value)}
        aria-label="وضعیت سفارش"
      >
        {OPTIONS.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {saving ? <span className="order-status-cell__note">ذخیره…</span> : null}
      {note === 'ok' ? <span className="order-status-cell__note is-ok">ذخیره شد</span> : null}
      {note === 'err' ? <span className="order-status-cell__note is-err">ذخیره نشد</span> : null}
    </div>
  )
}
