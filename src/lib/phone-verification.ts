import { createHash, randomInt, timingSafeEqual } from 'node:crypto'
import { headers } from 'next/headers'
import type { Payload } from 'payload'

import { toLatinDigits } from '@/lib/format'
import { getPayloadClient } from '@/lib/payload'
import { parametersForTemplate, parseTemplateId, sendSms } from '@/lib/sms'

export const OTP_LENGTH = 6
export const OTP_TTL_MS = 5 * 60 * 1000
export const OTP_MAX_ATTEMPTS = 5
export const OTP_RESEND_COOLDOWN_MS = 60 * 1000
export const OTP_PER_PHONE_HOUR = 5
export const OTP_PER_IP_HOUR = 10
export const OTP_DAILY_LIMIT_DEFAULT = 200
export const OTP_STALE_MS = 24 * 60 * 60 * 1000

/** Off until she wants the extra step. Set OTP_REQUIRED=1 to turn the gate on. */
export function isOtpRequired(): boolean {
  return process.env.OTP_REQUIRED === '1'
}

const SUBMIT_RATE_PHONE = '__submit__'
const SUBMIT_RATE_WINDOW_MS = 10 * 60 * 1000
const SUBMIT_RATE_MAX = 5
const HOUR_MS = 60 * 60 * 1000

export const otpMessages = {
  missingCode: 'لطفاً اول کد تأیید را بگیرید و وارد کنید.',
  wrongCode: 'کد تأیید درست نیست. دوباره تلاش کنید.',
  expired: 'کد تأیید منقضی شده. لطفاً کد جدید بگیرید.',
  consumed: 'این کد قبلاً استفاده شده. لطفاً کد جدید بگیرید.',
  tooManyAttempts: 'تعداد تلاش‌ها تمام شد. لطفاً کد جدید بگیرید.',
  cooldown: 'لطفاً کمی صبر کنید و بعد دوباره کد بگیرید.',
  phoneHour: 'تعداد پیامک به این شماره در این ساعت تمام شده. کمی بعد دوباره تلاش کنید.',
  ipHour: 'تعداد درخواست‌ها بیش از حد است. کمی بعد دوباره تلاش کنید.',
  daily: 'ارسال کد امروز ممکن نیست. لطفاً بعداً دوباره تلاش کنید.',
  unavailable: 'ارسال کد تأیید فعلاً ممکن نیست. لطفاً کمی بعد دوباره تلاش کنید.',
  sendFailed: 'ارسال پیامک ممکن نشد. لطفاً دوباره تلاش کنید.',
  phone: 'شماره تماس معتبر نیست',
  rateLimit: 'تعداد درخواست‌ها بیش از حد است. کمی بعد دوباره تلاش کنید.',
}

export type SendOtpResult =
  | { success: true; cooldownSeconds: number }
  | { success: false; error: string; retryAfterSeconds?: number }

export type CheckOtpResult =
  | { ok: true; id: number }
  | { ok: false; error: string }

export function normalizePhone(raw: string): string | null {
  const phone = toLatinDigits(raw).replace(/[\s-]/g, '')
  return /^09\d{9}$/.test(phone) ? phone : null
}

export function normalizeOtp(raw: string): string | null {
  const digits = toLatinDigits(raw).replace(/\D/g, '')
  return digits.length === OTP_LENGTH ? digits : null
}

export async function clientIp(): Promise<string> {
  const headerList = await headers()
  const forwarded = headerList.get('x-forwarded-for')
  if (forwarded) {
    const first = forwarded.split(',')[0]?.trim()
    if (first) return first
  }
  return headerList.get('x-real-ip') ?? 'unknown'
}

export async function isSubmitRateLimited(ip: string, record = true): Promise<boolean> {
  const payload = await getPayloadClient()
  const since = new Date(Date.now() - SUBMIT_RATE_WINDOW_MS).toISOString()
  const { totalDocs } = await payload.count({
    collection: 'phone-verifications',
    where: {
      and: [
        { phone: { equals: SUBMIT_RATE_PHONE } },
        { ip: { equals: ip } },
        { createdAt: { greater_than: since } },
      ],
    },
  })
  if (totalDocs >= SUBMIT_RATE_MAX) return true
  if (record) await recordSubmitHit(payload, ip)
  return false
}

export async function requestOrderOtp(phone: string, ip: string): Promise<SendOtpResult> {
  const apiKey = process.env.SMSIR_API_KEY?.trim()
  const templateId = parseTemplateId(process.env.SMSIR_TEMPLATE_OTP)
  if (!apiKey || templateId == null) {
    return { success: false, error: otpMessages.unavailable }
  }

  const payload = await getPayloadClient()
  await deleteStaleVerifications(payload)

  const blocked = await otpSendBlocked(payload, phone, ip)
  if (blocked) return blocked

  const code = generateOtp()
  await invalidateLiveCodes(payload, phone)
  await payload.create({
    collection: 'phone-verifications',
    data: {
      phone,
      codeHash: hashOtp(code),
      expiresAt: new Date(Date.now() + OTP_TTL_MS).toISOString(),
      attempts: 0,
      ip,
    },
  })

  const result = await sendSms({
    mobile: phone,
    templateId,
    parameters: parametersForTemplate(templateId, { CODE: code }),
  })
  if (result.outcome !== 'sent') {
    if (result.outcome === 'skipped') {
      console.error('OTP SMS skipped after gate check', result.reason)
    }
    return { success: false, error: otpMessages.sendFailed }
  }

  return { success: true, cooldownSeconds: OTP_RESEND_COOLDOWN_MS / 1000 }
}

export async function checkOrderOtp(phone: string, code: string | null): Promise<CheckOtpResult> {
  if (!code) return { ok: false, error: otpMessages.missingCode }

  const payload = await getPayloadClient()
  const doc = await findLatestCode(payload, phone)
  if (!doc) return { ok: false, error: otpMessages.missingCode }
  if (doc.consumedAt) return { ok: false, error: otpMessages.consumed }
  const attemptsUsed = Number(doc.attempts) || 0
  if (attemptsUsed >= OTP_MAX_ATTEMPTS) {
    return { ok: false, error: otpMessages.tooManyAttempts }
  }
  if (Date.parse(doc.expiresAt) <= Date.now()) {
    return { ok: false, error: otpMessages.expired }
  }
  if (!otpMatches(code, doc.codeHash)) {
    const attempts = attemptsUsed + 1
    await payload.update({
      collection: 'phone-verifications',
      id: doc.id,
      data: { attempts },
    })
    if (attempts >= OTP_MAX_ATTEMPTS) {
      return { ok: false, error: otpMessages.tooManyAttempts }
    }
    return { ok: false, error: otpMessages.wrongCode }
  }

  return { ok: true, id: doc.id }
}

export async function consumeOrderOtp(id: number): Promise<void> {
  const payload = await getPayloadClient()
  await payload.update({
    collection: 'phone-verifications',
    id,
    data: { consumedAt: new Date().toISOString() },
  })
}

function generateOtp(): string {
  return String(randomInt(0, 1_000_000)).padStart(OTP_LENGTH, '0')
}

function hashOtp(code: string): string {
  const secret = process.env.PAYLOAD_SECRET
  if (!secret) throw new Error('PAYLOAD_SECRET is not set')
  return createHash('sha256').update(code + secret).digest('hex')
}

function otpMatches(code: string, codeHash: string): boolean {
  const actual = Buffer.from(hashOtp(code), 'hex')
  const expected = Buffer.from(codeHash, 'hex')
  if (actual.length !== expected.length) return false
  return timingSafeEqual(actual, expected)
}

async function recordSubmitHit(payload: Payload, ip: string): Promise<void> {
  const now = new Date().toISOString()
  await payload.create({
    collection: 'phone-verifications',
    data: {
      phone: SUBMIT_RATE_PHONE,
      codeHash: 'submit',
      expiresAt: now,
      attempts: 0,
      consumedAt: now,
      ip,
    },
  })
}

async function deleteStaleVerifications(payload: Payload): Promise<void> {
  const staleBefore = new Date(Date.now() - OTP_STALE_MS).toISOString()
  await payload.delete({
    collection: 'phone-verifications',
    where: { createdAt: { less_than: staleBefore } },
  })
}

async function invalidateLiveCodes(payload: Payload, phone: string): Promise<void> {
  const { docs } = await payload.find({
    collection: 'phone-verifications',
    where: {
      and: [{ phone: { equals: phone } }, { consumedAt: { exists: false } }],
    },
    limit: 50,
    depth: 0,
  })
  const consumedAt = new Date().toISOString()
  await Promise.all(
    docs.map((doc) =>
      payload.update({
        collection: 'phone-verifications',
        id: doc.id,
        data: { consumedAt },
      }),
    ),
  )
}

async function otpSendBlocked(
  payload: Payload,
  phone: string,
  ip: string,
): Promise<SendOtpResult | null> {
  const cooldown = await resendCooldownSeconds(payload, phone)
  if (cooldown > 0) {
    return { success: false, error: otpMessages.cooldown, retryAfterSeconds: cooldown }
  }

  const hourAgo = new Date(Date.now() - HOUR_MS).toISOString()
  const dayAgo = new Date(Date.now() - OTP_STALE_MS).toISOString()
  const dailyLimit = readDailyLimit()

  const [phoneHour, ipHour, daily] = await Promise.all([
    payload.count({
      collection: 'phone-verifications',
      where: {
        and: [{ phone: { equals: phone } }, { createdAt: { greater_than: hourAgo } }],
      },
    }),
    payload.count({
      collection: 'phone-verifications',
      where: {
        and: [
          { ip: { equals: ip } },
          { phone: { like: '09%' } },
          { createdAt: { greater_than: hourAgo } },
        ],
      },
    }),
    payload.count({
      collection: 'phone-verifications',
      where: {
        and: [{ phone: { like: '09%' } }, { createdAt: { greater_than: dayAgo } }],
      },
    }),
  ])

  if (phoneHour.totalDocs >= OTP_PER_PHONE_HOUR) {
    return { success: false, error: otpMessages.phoneHour }
  }
  if (ipHour.totalDocs >= OTP_PER_IP_HOUR) {
    return { success: false, error: otpMessages.ipHour }
  }
  if (daily.totalDocs >= dailyLimit) {
    console.error('OTP daily ceiling hit', { daily: daily.totalDocs, dailyLimit, ip })
    return { success: false, error: otpMessages.daily }
  }
  return null
}

async function resendCooldownSeconds(payload: Payload, phone: string): Promise<number> {
  const { docs } = await payload.find({
    collection: 'phone-verifications',
    where: { phone: { equals: phone } },
    sort: '-createdAt',
    limit: 1,
    depth: 0,
  })
  const latest = docs[0]
  if (!latest?.createdAt) return 0
  const elapsed = Date.now() - Date.parse(latest.createdAt)
  if (elapsed >= OTP_RESEND_COOLDOWN_MS) return 0
  return Math.ceil((OTP_RESEND_COOLDOWN_MS - elapsed) / 1000)
}

async function findLatestCode(payload: Payload, phone: string) {
  const { docs } = await payload.find({
    collection: 'phone-verifications',
    where: { phone: { equals: phone } },
    sort: '-createdAt',
    limit: 1,
    depth: 0,
  })
  return docs[0] ?? null
}

function readDailyLimit(): number {
  const parsed = Number(process.env.OTP_DAILY_LIMIT)
  if (Number.isInteger(parsed) && parsed > 0) return parsed
  return OTP_DAILY_LIMIT_DEFAULT
}
