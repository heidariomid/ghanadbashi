import type { Payload, TextareaFieldServerComponent } from 'payload'

import { OrderDepositSms } from '@/components/admin/OrderDepositSms'
import { cardLastFour, parseCardNumber, parseDepositAmount } from '@/lib/deposit-sms'
import { faNumber, faPhone } from '@/lib/format'
import { formatOrderNumber } from '@/lib/order-number'
import { LINE_KIND_LABEL, resolveOrderLines, type OrderLineSource } from '@/lib/order-summary'

function asSource(data: unknown): OrderLineSource {
  if (!data || typeof data !== 'object') return {}
  return data as OrderLineSource
}

function readText(data: unknown, key: string): string {
  if (!data || typeof data !== 'object') return ''
  const value = (data as Record<string, unknown>)[key]
  return typeof value === 'string' ? value.trim() : ''
}

/** Edit page: one receipt. Name, phone, date, then the lines. */
export const OrderSummaryField: TextareaFieldServerComponent = async ({ data, id, req }) => {
  const lines = await resolveOrderLines(asSource(data), req.payload)
  const pieceCount = lines.reduce((sum, line) => sum + line.quantity, 0)
  const name = readText(data, 'customerName')
  const phone = readText(data, 'phone')
  const deliveryDate = readText(data, 'deliveryDate')
  const notes = readText(data, 'notes')
  const n = typeof id === 'number' ? id : Number(id)
  const orderNo = Number.isFinite(n) ? formatOrderNumber(n) : ''
  const cardLast4 = await readCardLast4(req.payload)

  return (
    <div className="field-type order-receipt">
      <div className="order-receipt__head">
        <div>
          <p className="order-receipt__kicker">رسید سفارش</p>
          <p className="order-receipt__title">{orderNo ? `شماره ${orderNo}` : 'اقلام سفارش'}</p>
        </div>
        <p className="order-receipt__count">
          {lines.length === 0 ? 'خالی' : `${faNumber(pieceCount)} قلم`}
        </p>
      </div>
      {name || phone || deliveryDate ? (
        <dl className="order-receipt__meta">
          {name ? (
            <div className="order-receipt__meta-row">
              <dt>مشتری</dt>
              <dd>{name}</dd>
            </div>
          ) : null}
          {phone ? (
            <div className="order-receipt__meta-row">
              <dt>تماس</dt>
              <dd>
                <a className="order-receipt__phone" dir="ltr" href={`tel:${phone}`}>
                  {faPhone(phone)}
                </a>
              </dd>
            </div>
          ) : null}
          {deliveryDate ? (
            <div className="order-receipt__meta-row">
              <dt>تحویل</dt>
              <dd>{deliveryDate}</dd>
            </div>
          ) : null}
        </dl>
      ) : null}
      {lines.length === 0 ? (
        <p className="order-receipt__empty">محصولی در این سفارش ثبت نشده است.</p>
      ) : (
        <ol className="order-receipt__list">
          {lines.map((line, index) => {
            const kind = LINE_KIND_LABEL[line.kind]
            return (
              <li className="order-receipt__row" key={`${line.kind}-${line.title}-${index}`}>
                <span className="order-receipt__qty">{faNumber(line.quantity)}</span>
                <div className="order-receipt__item">
                  {kind ? <span className="order-receipt__kind">{kind}</span> : null}
                  <span className="order-receipt__name">{line.title}</span>
                </div>
              </li>
            )
          })}
        </ol>
      )}
      {notes ? <p className="order-receipt__notes">{notes}</p> : null}
      {Number.isFinite(n) ? (
        <OrderDepositSms
          orderId={n}
          lastAmount={readDepositAmount(data)}
          lastNote={readDepositNote(data)}
          lastOk={readDepositOk(data)}
          cardLast4={cardLast4}
        />
      ) : null}
    </div>
  )
}

function readDepositAmount(data: unknown): number | null {
  if (!data || typeof data !== 'object') return null
  const value = (data as Record<string, unknown>).depositAmount
  if (typeof value === 'number' && Number.isFinite(value) && value >= 1) return value
  if (typeof value === 'string') return parseDepositAmount(value)
  return null
}

function readDepositNote(data: unknown): string {
  const sms = readDepositSms(data)
  return typeof sms?.note === 'string' ? sms.note : ''
}

function readDepositOk(data: unknown): boolean | null {
  const sms = readDepositSms(data)
  return typeof sms?.ok === 'boolean' ? sms.ok : null
}

function readDepositSms(data: unknown): Record<string, unknown> | null {
  if (!data || typeof data !== 'object') return null
  const sms = (data as Record<string, unknown>).lastDepositSms
  return sms && typeof sms === 'object' ? (sms as Record<string, unknown>) : null
}

async function readCardLast4(payload: Payload) {
  const settings = await payload.findGlobal({
    slug: 'site-settings',
    depth: 0,
  })
  const card = parseCardNumber(settings.contact?.cardNumber)
  return card ? cardLastFour(card) : null
}
