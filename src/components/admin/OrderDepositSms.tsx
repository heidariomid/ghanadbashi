'use client'

import { useState } from 'react'

import { sendDepositSms } from '@/actions/deposit-sms'
import { faNumber, faPhone, toLatinDigits } from '@/lib/format'

interface OrderDepositSmsProps {
  orderId: number
  lastAmount: number | null
  lastNote: string
  lastOk: boolean | null
  cardLast4: string | null
}

export function OrderDepositSms({
  orderId,
  lastAmount,
  lastNote,
  lastOk,
  cardLast4,
}: OrderDepositSmsProps) {
  const [amount, setAmount] = useState(lastAmount != null ? String(lastAmount) : '')
  const [sending, setSending] = useState(false)
  const [note, setNote] = useState(lastNote)
  const [ok, setOk] = useState(lastOk)

  async function onSend() {
    if (sending || !cardLast4) return
    setSending(true)
    try {
      const result = await sendDepositSms(orderId, amount)
      if (result.ok) {
        setOk(true)
        setNote(result.note)
        setAmount(String(result.amount))
      } else {
        setOk(false)
        setNote(result.error)
      }
    } catch {
      setOk(false)
      setNote('ارسال نشد')
    } finally {
      setSending(false)
    }
  }

  return (
    <div className="order-deposit">
      <p className="order-deposit__kicker">پیش‌پرداخت</p>
      {cardLast4 ? (
        <p className="order-deposit__card">
          کارت ذخیره‌شده …<span dir="ltr">{faPhone(cardLast4)}</span>
        </p>
      ) : (
        <p className="order-deposit__card is-missing">
          شماره کارت را در تنظیمات سایت بگذارید.
        </p>
      )}
      <label className="order-deposit__label" htmlFor={`deposit-amount-${orderId}`}>
        مبلغ واریز (تومان)
      </label>
      <input
        id={`deposit-amount-${orderId}`}
        className="order-deposit__input"
        type="text"
        inputMode="numeric"
        dir="ltr"
        autoComplete="off"
        placeholder="مثلاً ۲۵۰۰۰۰۰"
        value={amount}
        disabled={sending}
        onChange={(event) => setAmount(event.target.value)}
      />
      <button
        className="order-deposit__button"
        type="button"
        disabled={sending || !cardLast4 || !amount.trim()}
        onClick={() => void onSend()}
      >
        {sending ? 'در حال ارسال…' : 'ارسال پیامک واریز'}
      </button>
      {note ? (
        <p className={`order-deposit__note${ok ? ' is-ok' : ok === false ? ' is-err' : ''}`}>
          {ok && lastAmountDisplay(amount) ? `${note} — ${lastAmountDisplay(amount)}` : note}
        </p>
      ) : null}
    </div>
  )
}

function lastAmountDisplay(raw: string): string | null {
  const digits = toLatinDigits(raw).replace(/\D/g, '')
  if (!digits) return null
  const amount = Number(digits)
  if (!Number.isInteger(amount) || amount < 1) return null
  return `${faNumber(amount)} تومان`
}
