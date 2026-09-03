import type { Payload } from 'payload'

import { faNumber, toLatinDigits } from '@/lib/format'
import {
  createDepositReceiptToken,
  depositReceiptPath,
} from '@/lib/deposit-receipt'
import { publicOrderNumber } from '@/lib/order-number'
import {
  parametersForTemplate,
  parseTemplateId,
  sendSms,
  type SmsResult,
} from '@/lib/sms'

const FAILURE_NOTES: Record<number, string> = {
  102: 'اعتبار پیامک تمام شده',
  104: 'شماره مشتری معتبر نیست',
  113: 'قالب پیامک آماده نیست',
  114: 'متن پیامک کوتاه نشد',
  119: 'قالب پیامک آماده نیست',
}

const MAX_AMOUNT_DIGITS = 12

export type SendDepositSmsResult =
  | { ok: true; note: string; amount: number; receiptPath: string }
  | { ok: false; error: string }

export function parseDepositAmount(raw: string): number | null {
  const digits = toLatinDigits(raw).replace(/\D/g, '')
  if (!digits || digits.length > MAX_AMOUNT_DIGITS) return null
  const amount = Number(digits)
  if (!Number.isInteger(amount) || amount < 1) return null
  return amount
}

export function parseCardNumber(raw: string | null | undefined): string | null {
  if (!raw) return null
  const digits = toLatinDigits(raw).replace(/\D/g, '')
  return /^\d{16}$/.test(digits) ? digits : null
}

export function cardLastFour(card: string): string {
  return card.slice(-4)
}

export async function sendDepositSmsForOrder(
  payload: Payload,
  orderId: number,
  amountRaw: string,
): Promise<SendDepositSmsResult> {
  const amount = parseDepositAmount(amountRaw)
  if (amount == null) {
    return { ok: false, error: 'مبلغ واریز را به تومان بنویسید' }
  }

  const settings = await payload.findGlobal({
    slug: 'site-settings',
    depth: 0,
    overrideAccess: true,
  })
  const card = parseCardNumber(settings.contact?.cardNumber)
  if (!card) {
    return { ok: false, error: 'شماره کارت را در تنظیمات سایت بگذارید' }
  }

  const order = await payload.findByID({
    collection: 'orders',
    id: orderId,
    depth: 0,
    overrideAccess: true,
  }).catch(() => null)
  if (!order) return { ok: false, error: 'سفارش پیدا نشد' }
  const phone = normalizeSmsPhone(typeof order.phone === 'string' ? order.phone : '')
  const customerName = String(order.customerName ?? '').trim()
  const receiptToken =
    typeof order.depositReceiptToken === 'string' && order.depositReceiptToken.trim()
      ? order.depositReceiptToken.trim()
      : createDepositReceiptToken()
  const templateId = parseTemplateId(process.env.SMSIR_TEMPLATE_DEPOSIT)
  const result = await sendSms({
    mobile: phone,
    templateId,
    parameters:
      templateId != null
        ? parametersForTemplate(templateId, {
            ORDER: String(publicOrderNumber(orderId)),
            NAME: customerName,
            AMOUNT: faNumber(amount),
            CARD: card,
            TOKEN: receiptToken,
          })
        : {},
  })

  const lastDepositSms = {
    sentAt: new Date().toISOString(),
    ok: result.outcome === 'sent',
    note: depositSmsNote(result),
    messageId:
      result.outcome === 'sent' && result.messageId != null
        ? String(result.messageId)
        : null,
  }

  await payload.update({
    collection: 'orders',
    id: orderId,
    data: {
      depositAmount: amount,
      depositReceiptToken: receiptToken,
      lastDepositSms,
    },
    context: { skipSmsHook: true, skipPreserve: true },
    overrideAccess: true,
  })

  if (result.outcome === 'sent') {
    return { ok: true, note: lastDepositSms.note, amount, receiptPath: depositReceiptPath(receiptToken) }
  }
  return { ok: false, error: lastDepositSms.note }
}

function normalizeSmsPhone(raw: string): string | null {
  const phone = toLatinDigits(raw).replace(/[\s-]/g, '')
  return /^09\d{9}$/.test(phone) ? phone : null
}

function depositSmsNote(result: SmsResult): string {
  if (result.outcome === 'sent') return 'ارسال شد'
  if (result.outcome === 'skipped') {
    if (result.reason === 'missing-phone') return 'شماره مشتری معتبر نیست'
    if (result.reason === 'missing-template') return 'قالب پیامک آماده نیست'
    return 'تنظیمات پیامک ناقص است'
  }
  return FAILURE_NOTES[result.status ?? -1] ?? 'ارسال نشد'
}
