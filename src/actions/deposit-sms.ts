'use server'

import { headers } from 'next/headers'

import { sendDepositSmsForOrder, type SendDepositSmsResult } from '@/lib/deposit-sms'
import { getPayloadClient } from '@/lib/payload'

export async function sendDepositSms(
  orderId: number,
  amountRaw: string,
): Promise<SendDepositSmsResult> {
  if (!Number.isInteger(orderId) || orderId < 1) {
    return { ok: false, error: 'سفارش پیدا نشد' }
  }

  const payload = await getPayloadClient()
  const { user } = await payload.auth({ headers: await headers() })
  if (!user) return { ok: false, error: 'وارد نشده‌اید' }

  return sendDepositSmsForOrder(payload, orderId, amountRaw)
}
