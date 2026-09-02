import { after } from 'next/server'
import type { CollectionAfterChangeHook, Payload } from 'payload'

import { toLatinDigits } from '@/lib/format'
import { publicOrderNumber } from '@/lib/order-number'
import {
  parametersForTemplate,
  parseTemplateId,
  sendSms,
  type SmsResult,
} from '@/lib/sms'

const TEMPLATE_ENV = {
  confirmed: 'SMSIR_TEMPLATE_CONFIRMED',
  delivered: 'SMSIR_TEMPLATE_DELIVERED',
  cancelled: 'SMSIR_TEMPLATE_CANCELLED',
} as const

const FAILURE_NOTES: Record<number, string> = {
  102: 'اعتبار پیامک تمام شده',
  104: 'شماره مشتری معتبر نیست',
  113: 'قالب پیامک آماده نیست',
  114: 'متن پیامک کوتاه نشد',
  119: 'قالب پیامک آماده نیست',
}

type NotifiableStatus = keyof typeof TEMPLATE_ENV

export const notifyStatusSms: CollectionAfterChangeHook = ({
  doc,
  previousDoc,
  operation,
  context,
  req,
}) => {
  if (context.skipSmsHook) return
  if (operation !== 'update') return
  if (previousDoc?.status === doc.status) return
  if (!isNotifiableStatus(doc.status)) return

  const payload = req.payload
  const orderId = Number(doc.id)
  const customerName = String(doc.customerName ?? '')
  const phone = typeof doc.phone === 'string' ? doc.phone : ''
  const status = doc.status

  // Don't block the admin save — that left the toast on «در حال ارسال».
  runAfterSave(() => recordStatusSms(payload, { orderId, customerName, phone, status }))
}

function runAfterSave(work: () => Promise<void>) {
  const run = () => work().catch((error: unknown) => console.error('Order status SMS failed', error))
  try {
    after(run)
  } catch {
    void run()
  }
}

async function recordStatusSms(
  payload: Payload,
  input: {
    orderId: number
    customerName: string
    phone: string
    status: NotifiableStatus
  },
) {
  const lastCustomerSms = await sendStatusSms(input)
  await payload.update({
    collection: 'orders',
    id: input.orderId,
    data: { lastCustomerSms },
    context: { skipSmsHook: true },
    overrideAccess: true,
  })
}

function isNotifiableStatus(status: unknown): status is NotifiableStatus {
  return typeof status === 'string' && status in TEMPLATE_ENV
}

async function sendStatusSms(input: {
  orderId: number
  customerName: string
  phone: string
  status: NotifiableStatus
}) {
  const templateId = parseTemplateId(process.env[TEMPLATE_ENV[input.status]])
  const result = await sendSms({
    mobile: normalizeSmsPhone(input.phone),
    templateId,
    parameters:
      templateId != null
        ? parametersForTemplate(templateId, {
            ORDER: String(publicOrderNumber(input.orderId)),
            NAME: input.customerName,
          })
        : {},
  })

  return {
    sentAt: new Date().toISOString(),
    ok: result.outcome === 'sent',
    note: customerSmsNote(result),
    messageId:
      result.outcome === 'sent' && result.messageId != null
        ? String(result.messageId)
        : null,
  }
}

function normalizeSmsPhone(raw: string): string | null {
  const phone = toLatinDigits(raw).replace(/[\s-]/g, '')
  return /^09\d{9}$/.test(phone) ? phone : null
}

function customerSmsNote(result: SmsResult): string {
  if (result.outcome === 'sent') return 'ارسال شد'
  if (result.outcome === 'skipped') {
    if (result.reason === 'missing-phone') return 'شماره مشتری معتبر نیست'
    if (result.reason === 'missing-template') return 'قالب پیامک آماده نیست'
    return 'تنظیمات پیامک ناقص است'
  }
  return FAILURE_NOTES[result.status ?? -1] ?? 'ارسال نشد'
}
