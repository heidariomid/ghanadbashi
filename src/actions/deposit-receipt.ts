'use server'

import { APIError } from 'payload'
import { after } from 'next/server'

import {
  depositReceiptReady,
  findOrderByDepositToken,
} from '@/lib/deposit-receipt'
import { notifyBakerDepositReceiptUploaded } from '@/lib/deposit-receipt-sms'
import { getPayloadClient } from '@/lib/payload'
import {
  isReceiptImageFile,
  mapDepositReceiptUploadError,
  MAX_RECEIPT_BYTES,
} from '@/lib/receipt-image'

export type SubmitDepositReceiptResult =
  | { success: true }
  | { success: false; error: string }

export async function submitDepositReceipt(
  token: string,
  formData: FormData,
): Promise<SubmitDepositReceiptResult> {
  try {
    const payload = await getPayloadClient()
    const order = await findOrderByDepositToken(payload, token)
    if (!order) {
      return { success: false, error: 'لینک نامعتبر است یا منقضی شده.' }
    }
    if (!depositReceiptReady(order)) {
      return { success: false, error: 'هنوز درخواست واریز برای این سفارش ارسال نشده است.' }
    }
    if (order.depositReceipt != null) {
      return { success: false, error: 'رسید این سفارش قبلاً ارسال شده است.' }
    }

    const file = formData.get('receipt')
    if (!(file instanceof File) || file.size === 0) {
      return { success: false, error: 'لطفاً عکس رسید را انتخاب کنید.' }
    }
    if (!isReceiptImageFile(file)) {
      return {
        success: false,
        error: 'فقط عکس مجاز است (JPG، PNG یا WebP). فایل PDF یا سند قبول نمی‌شود.',
      }
    }
    if (file.size > MAX_RECEIPT_BYTES) {
      return {
        success: false,
        error: 'حجم عکس بیشتر از ۴ مگابایت است. لطفاً عکس کوچک‌تر یا با کیفیت کمتر بفرستید.',
      }
    }

    const buffer = Buffer.from(await file.arrayBuffer())
    const customerName = String(order.customerName ?? 'مشتری')
    const uploaded = await payload.create({
      collection: 'media',
      data: { alt: `رسید بیعانه سفارش ${order.id} — ${customerName}` },
      file: {
        data: buffer,
        mimetype: file.type || 'image/jpeg',
        name: file.name || 'deposit-receipt.jpg',
        size: buffer.byteLength,
      },
      overrideAccess: true,
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

    after(() => {
      notifyBakerDepositReceiptUploaded(order.id, customerName).catch((error: unknown) =>
        console.error('Deposit receipt baker SMS failed', error),
      )
    })

    return { success: true }
  } catch (error) {
    console.error('Deposit receipt upload failed', error)
    if (error instanceof APIError && error.message) {
      return { success: false, error: mapDepositReceiptUploadError(error) }
    }
    return { success: false, error: mapDepositReceiptUploadError(error) }
  }
}
