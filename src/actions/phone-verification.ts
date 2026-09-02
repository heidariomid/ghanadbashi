'use server'

import {
  clientIp,
  isOtpRequired,
  isSubmitRateLimited,
  normalizePhone,
  otpMessages,
  requestOrderOtp,
  type SendOtpResult,
} from '@/lib/phone-verification'

function readString(formData: FormData, key: string): string {
  const value = formData.get(key)
  return typeof value === 'string' ? value : ''
}

export async function sendOrderOtp(formData: FormData): Promise<SendOtpResult> {
  if (!isOtpRequired()) {
    return { success: false, error: otpMessages.unavailable }
  }

  if (readString(formData, 'website').trim()) {
    return { success: true, cooldownSeconds: 60 }
  }

  const ip = await clientIp()
  if (await isSubmitRateLimited(ip, false)) {
    return { success: false, error: otpMessages.rateLimit }
  }

  const phone = normalizePhone(readString(formData, 'phone'))
  if (!phone) {
    return { success: false, error: otpMessages.phone }
  }

  return requestOrderOtp(phone, ip)
}
