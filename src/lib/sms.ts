import { setDefaultResultOrder } from 'node:dns'

import { toLatinDigits } from '@/lib/format'

const VERIFY_URL = 'https://api.sms.ir/v1/send/verify'
const PARAM_MAX = 25
const REQUEST_TIMEOUT_MS = 20_000
const MAX_ATTEMPTS = 2

// Vercel often tries IPv6 first; api.sms.ir's AAAA path from US regions dies.
setDefaultResultOrder('ipv4first')

/** SMS.ir sandbox accepts only this id and a `Code` parameter. */
const SMSIR_SANDBOX_TEMPLATE_ID = 123456

export type SmsSkipReason = 'missing-key' | 'missing-template' | 'missing-phone'

export type SmsResult =
  | { outcome: 'sent'; messageId: number | null }
  | { outcome: 'skipped'; reason: SmsSkipReason }
  | { outcome: 'failed'; status: number | null; message: string }

const STATUS_MESSAGES: Record<number, string> = {
  1: 'ارسال شد',
  0: 'خطای سمت سرویس‌دهنده',
  10: 'کلید وب‌سرویس نامعتبر است',
  11: 'کلید وب‌سرویس غیرفعال است',
  12: 'کلید وب‌سرویس محدود به IP است',
  13: 'حساب کاربری غیرفعال است',
  14: 'حساب کاربری معلق است',
  20: 'تعداد درخواست‌ها بیش از حد است',
  101: 'خط ارسال نامعتبر است',
  102: 'اعتبار کافی نیست',
  104: 'شماره موبایل نامعتبر است',
  113: 'قالب پیامک پیدا نشد',
  114: 'مقدار پارامتر بیشتر از ۲۵ حرف است',
  115: 'شماره در لیست سیاه است',
  116: 'نام پارامتر خالی است',
  117: 'متن پیامک تأیید نشده است',
  119: 'این طرح اجازه قالب سفارشی نمی‌دهد',
  123: 'خط ارسال نیاز به فعال‌سازی دارد',
}

export function parseTemplateId(raw: string | undefined): number | null {
  if (!raw?.trim()) return null
  const id = Number(raw)
  return Number.isInteger(id) && id > 0 ? id : null
}

/** Collapse whitespace, Latin digits, hard 25-character cap. */
function sanitizeSmsValue(value: string): string {
  return toLatinDigits(value).replace(/\s+/g, ' ').trim().slice(0, PARAM_MAX)
}

function isSmsMobile(value: string): boolean {
  return /^09\d{9}$/.test(value)
}

/**
 * Sandbox template `123456` only has `#CODE#`. Production templates use the
 * named slots we pass in. Map here so local `.env` can point both ids at 123456.
 */
export function parametersForTemplate(
  templateId: number,
  parameters: Record<string, string>,
): Record<string, string> {
  if (templateId === SMSIR_SANDBOX_TEMPLATE_ID) {
    return { Code: parameters.ORDER ?? parameters.NAME ?? '1' }
  }
  return parameters
}

export async function sendSms(options: {
  mobile: string | null | undefined
  templateId: number | null
  parameters: Record<string, string>
}): Promise<SmsResult> {
  const apiKey = process.env.SMSIR_API_KEY?.trim()
  if (!apiKey) {
    console.warn('SMS skipped: SMSIR_API_KEY is not set')
    return { outcome: 'skipped', reason: 'missing-key' }
  }
  if (options.templateId == null) {
    console.warn('SMS skipped: template id is not set')
    return { outcome: 'skipped', reason: 'missing-template' }
  }

  const mobile = options.mobile?.trim() ?? ''
  if (!isSmsMobile(mobile)) {
    console.warn('SMS skipped: phone is missing or invalid')
    return { outcome: 'skipped', reason: 'missing-phone' }
  }

  const parameters = Object.entries(options.parameters)
    .filter(([name]) => name.trim().length > 0)
    .map(([name, value]) => ({ name, value: sanitizeSmsValue(value) }))

  const body = JSON.stringify({
    mobile,
    templateId: options.templateId,
    parameters,
  })

  for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt++) {
    try {
      const response = await fetch(VERIFY_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'text/plain',
          'x-api-key': apiKey,
        },
        body,
        signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
      })
      const parsed = await parseSmsBody(response)
      const status = typeof parsed?.status === 'number' ? parsed.status : null
      if (status === 1) {
        const messageId = readMessageId(parsed)
        console.info('SMS sent', { templateId: options.templateId, messageId })
        return { outcome: 'sent', messageId }
      }

      const message = statusMessage(status, parsed?.message)
      console.error('SMS failed', { templateId: options.templateId, status, message })
      return { outcome: 'failed', status, message }
    } catch (error) {
      const message = fetchErrorMessage(error)
      console.error('SMS failed', { templateId: options.templateId, attempt, message })
      if (attempt === MAX_ATTEMPTS) {
        return { outcome: 'failed', status: null, message }
      }
    }
  }

  return { outcome: 'failed', status: null, message: 'ارسال پیامک ممکن نشد' }
}

function fetchErrorMessage(error: unknown): string {
  if (!(error instanceof Error)) return 'ارسال پیامک ممکن نشد'
  const cause = error.cause
  if (cause instanceof Error) {
    const code = 'code' in cause && typeof cause.code === 'string' ? cause.code : ''
    return code ? `${error.message} (${code}: ${cause.message})` : `${error.message}: ${cause.message}`
  }
  return error.message
}

function statusMessage(status: number | null, providerMessage: unknown): string {
  if (status != null && STATUS_MESSAGES[status]) return STATUS_MESSAGES[status]
  if (typeof providerMessage === 'string' && providerMessage.trim()) return providerMessage
  return 'ارسال پیامک ممکن نشد'
}

function readMessageId(body: SmsProviderBody | null): number | null {
  const id = body?.data?.messageId
  return typeof id === 'number' ? id : null
}

interface SmsProviderBody {
  status?: unknown
  message?: unknown
  data?: { messageId?: unknown }
}

async function parseSmsBody(response: Response): Promise<SmsProviderBody | null> {
  const text = await response.text()
  if (!text.trim()) return null
  try {
    return JSON.parse(text) as SmsProviderBody
  } catch {
    return null
  }
}
