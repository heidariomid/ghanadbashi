import type { TextFieldServerComponent } from 'payload'

import { formatOrderNumber } from '@/lib/order-number'

/** Edit sidebar: same shop number as the list column and the SMS. */
export const OrderNumberField: TextFieldServerComponent = ({ id }) => {
  const n = typeof id === 'number' ? id : Number(id)
  const label = Number.isFinite(n) ? formatOrderNumber(n) : '—'

  return (
    <div className="field-type order-number-field">
      <span className="field-label">شماره سفارش</span>
      <p className="order-number-field__value">{label}</p>
    </div>
  )
}
