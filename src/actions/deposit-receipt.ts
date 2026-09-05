'use server'

import {
  depositReceiptReady,
  findOrderByDepositToken,
} from '@/lib/deposit-receipt'
import { notifyBakerDepositReceiptUploaded } from '@/lib/deposit-receipt-sms'
import { getPayloadClient } from '@/lib/payload'
import { after } from 'next/server'

const MAX_RECEIPT_BYTES = 4 * 1024 * 1024

export type SubmitDepositReceiptResult =
  | { success: true }
  | { success: false; error: string }

export async function submitDepositReceipt(
  token: string,
  formData: FormData,
): Promise<SubmitDepositReceiptResult> {
  const payload = await getPayloadClient()
  const order = await findOrderByDepositToken(payload, token)
  if (!order) {
    return { success: false, error: 'لینک نامعتبر است یا منقضی شده.' }
  }
  if (!depositReceiptReady(order)) {
    return { success: false, error: 'هنوز درخواست واریز برای این سفارش ارسال نشده است.' }
  }

  const file = formData.get('receipt')
  if (!(file instanceof File) || file.size === 0) {
    return { success: false, error: 'لطفاً عکس رسید را انتخاب کنید.' }
  }
  if (!file.type.startsWith('image/')) {
    return { success: false, error: 'فقط فایل تصویری مجاز است.' }
  }
  if (file.size > MAX_RECEIPT_BYTES) {
    return { success: false, error: 'حجم عکس نباید بیشتر از ۴ مگابایت باشد.' }
  }

  const buffer = Buffer.from(await file.arrayBuffer())
  const customerName = String(order.customerName ?? 'مشتری')
  const firstUpload = order.depositReceipt == null
  const uploaded = await payload.create({
    collection: 'media',
    data: { alt: `رسید بیعانه سفارش ${order.id} — ${customerName}` },
    file: {
      data: buffer,
      mimetype: file.type || 'image/jpeg',
      name: file.name || 'deposit-receipt.jpg',
      size: buffer.byteLength,
    },
  })

  await payload.update({
    collection: 'orders',
    id: order.id,
    data: {
      depositReceipt: uploaded.id,
      depositReceiptAt: new Date().toISOString(),
    },
    context: { skipSmsHook: true, skipPreserve: true },
    overrideAccess: true,
  })

  if (firstUpload) {
    after(() => {
      notifyBakerDepositReceiptUploaded(order.id, customerName).catch((error: unknown) =>
        console.error('Deposit receipt baker SMS failed', error),
      )
    })
  }

  return { success: true }
}
