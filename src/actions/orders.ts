'use server'

import { Resend } from 'resend'
import { z } from 'zod'

import { phoneHref } from '@/lib/contact'
import { CART_MAX_LINES, CART_MAX_QUANTITY, type CartItemKind } from '@/lib/cart'
import { resolveCategory } from '@/lib/categories'
import { faNumber, faPhone, toLatinDigits } from '@/lib/format'
import { formatOrderNumber, publicOrderNumber } from '@/lib/order-number'
import { getPayloadClient } from '@/lib/payload'
import {
  checkOrderOtp,
  clientIp,
  consumeOrderOtp,
  isOtpRequired,
  isSubmitRateLimited,
  normalizeOtp,
  normalizePhone,
  otpMessages,
} from '@/lib/phone-verification'
import { resolveBakerNotificationPhone } from '@/lib/baker-notification'
import { resolveOrigin } from '@/lib/site-url'
import { parametersForTemplate, parseTemplateId, sendSms } from '@/lib/sms'

const OTHER_PRODUCT_VALUE = '__other__'
const MAX_SAMPLE_IMAGE_BYTES = 4 * 1024 * 1024

const messages = {
  name: 'نام باید حداقل ۲ حرف باشد',
  nameMax: 'نام نباید بیشتر از ۱۰۰ حرف باشد',
  phone: 'شماره تماس معتبر نیست',
  product: 'لطفاً حداقل یک محصول را به سبد اضافه کنید',
  productOther: 'لطفاً نام محصول را بنویسید',
  productUnavailable: 'یکی از اقلام سبد دیگر موجود نیست',
  quantity: 'تعداد باید بین ۱ تا ۱۰۰۰ باشد',
  date: 'تاریخ تحویل را انتخاب کنید',
  notes: 'توضیحات نباید بیشتر از ۱۰۰۰ حرف باشد',
  imageType: 'فقط فایل تصویری مجاز است',
  imageSize: 'حجم عکس نباید بیشتر از ۴ مگابایت باشد',
  rateLimit: otpMessages.rateLimit,
  generic: 'ثبت سفارش ممکن نشد. لطفاً دوباره تلاش کنید.',
}

export type SubmitOrderResult =
  | { success: true }
  | { success: false; error: string; fieldErrors?: Record<string, string> }

const lineSchema = z.object({
  kind: z.enum(['product', 'gallery']).default('product'),
  id: z.number().int().positive(),
  quantity: z.number().int().min(1).max(CART_MAX_QUANTITY),
})

const orderFieldsSchema = z.object({
  customerName: z
    .string()
    .trim()
    .min(2, { error: messages.name })
    .max(100, { error: messages.nameMax }),
  phone: z.string(),
  items: z.array(lineSchema).max(CART_MAX_LINES),
  productOther: z.string(),
  productNote: z.string().trim().max(200, { error: messages.productOther }),
  otherQuantity: z.string(),
  deliveryDate: z.string().trim().min(1, { error: messages.date }),
  notes: z.string().trim().max(1000, { error: messages.notes }),
})

interface OrderLine {
  kind: CartItemKind
  id: number
  quantity: number
}

type OrderFields = {
  customerName: string
  phone: string
  items: OrderLine[]
  productNote: string
  otherQuantity: number
  deliveryDate: string
  notes: string
  otherSelected: boolean
}

class OrderFieldError extends Error {
  fieldErrors: Record<string, string>

  constructor(fieldErrors: Record<string, string>) {
    super(messages.generic)
    this.fieldErrors = fieldErrors
  }
}

function readString(formData: FormData, key: string): string {
  const value = formData.get(key)
  return typeof value === 'string' ? value : ''
}

function readItems(formData: FormData): unknown {
  const raw = readString(formData, 'items')
  if (!raw) return []
  try {
    return JSON.parse(raw)
  } catch {
    return null
  }
}

function firstFieldError(error: z.ZodError): Record<string, string> {
  const fieldErrors: Record<string, string> = {}
  for (const issue of error.issues) {
    const key = issue.path[0]
    if (typeof key === 'string' && !fieldErrors[key]) {
      fieldErrors[key] = issue.message
    }
  }
  return fieldErrors
}

function normalizeQuantity(raw: string): number | null {
  const digits = toLatinDigits(raw).replace(/[^\d]/g, '')
  if (!digits) return null
  const quantity = Number(digits)
  if (!Number.isInteger(quantity) || quantity < 1 || quantity > CART_MAX_QUANTITY) return null
  return quantity
}

function validateFields(formData: FormData):
  | { ok: true; data: OrderFields }
  | { ok: false; fieldErrors: Record<string, string> } {
  const itemsRaw = readItems(formData)
  if (itemsRaw === null) {
    return { ok: false, fieldErrors: { items: messages.product } }
  }

  const parsed = orderFieldsSchema.safeParse({
    customerName: readString(formData, 'customerName'),
    phone: readString(formData, 'phone'),
    items: itemsRaw,
    productOther: readString(formData, 'productOther'),
    productNote: readString(formData, 'productNote'),
    otherQuantity: readString(formData, 'otherQuantity'),
    deliveryDate: readString(formData, 'deliveryDate'),
    notes: readString(formData, 'notes'),
  })

  if (!parsed.success) {
    return { ok: false, fieldErrors: firstFieldError(parsed.error) }
  }

  const fieldErrors: Record<string, string> = {}
  const phone = normalizePhone(parsed.data.phone)
  if (!phone) fieldErrors.phone = messages.phone

  const otherSelected = parsed.data.productOther === OTHER_PRODUCT_VALUE
  let otherQuantity = 0
  if (otherSelected) {
    const quantity = normalizeQuantity(parsed.data.otherQuantity || '1')
    if (quantity == null) fieldErrors.otherQuantity = messages.quantity
    else otherQuantity = quantity
    if (!parsed.data.productNote) fieldErrors.productNote = messages.productOther
  }

  if (parsed.data.items.length === 0 && !otherSelected) {
    fieldErrors.items = messages.product
  }

  if (phone == null || Object.keys(fieldErrors).length > 0) {
    return { ok: false, fieldErrors }
  }

  return {
    ok: true,
    data: {
      customerName: parsed.data.customerName,
      phone,
      items: parsed.data.items,
      productNote: parsed.data.productNote,
      otherQuantity,
      deliveryDate: parsed.data.deliveryDate,
      notes: parsed.data.notes,
      otherSelected,
    },
  }
}

function readSampleFile(formData: FormData): File | null {
  const value = formData.get('sampleImage')
  if (!(value instanceof File) || value.size === 0) return null
  return value
}

export async function submitOrder(formData: FormData): Promise<SubmitOrderResult> {
  if (readString(formData, 'website').trim()) {
    return { success: true }
  }

  if (await isSubmitRateLimited(await clientIp())) {
    return { success: false, error: messages.rateLimit }
  }

  const fields = validateFields(formData)
  if (!fields.ok) {
    return { success: false, error: messages.generic, fieldErrors: fields.fieldErrors }
  }

  const otp = isOtpRequired()
    ? await checkOrderOtp(fields.data.phone, normalizeOtp(readString(formData, 'otpCode')))
    : { ok: true as const, id: null }
  if (!otp.ok) {
    return { success: false, error: otp.error, fieldErrors: { otpCode: otp.error } }
  }

  const sampleImage = readSampleFile(formData)
  if (sampleImage && !sampleImage.type.startsWith('image/')) {
    return {
      success: false,
      error: messages.generic,
      fieldErrors: { sampleImage: messages.imageType },
    }
  }
  if (sampleImage && sampleImage.size > MAX_SAMPLE_IMAGE_BYTES) {
    return {
      success: false,
      error: messages.generic,
      fieldErrors: { sampleImage: messages.imageSize },
    }
  }

  try {
    const sampleBuffer = sampleImage ? Buffer.from(await sampleImage.arrayBuffer()) : null
    const saved = await saveOrder(fields.data, sampleImage, sampleBuffer)
    if (otp.id != null) {
      await consumeOrderOtp(otp.id).catch((error: unknown) => {
        console.error('Could not consume OTP after order save', error)
      })
    }
    await Promise.all([
      notifyBaker(fields.data, saved, sampleImage, sampleBuffer).catch((error: unknown) => {
        console.error('Order notification email failed', error)
      }),
      notifyOrderSms(fields.data, saved).catch((error: unknown) => {
        console.error('Order notification SMS failed', error)
      }),
    ])
    return { success: true }
  } catch (error) {
    if (error instanceof OrderFieldError) {
      return { success: false, error: messages.generic, fieldErrors: error.fieldErrors }
    }
    console.error('Order submission failed', error)
    return { success: false, error: messages.generic }
  }
}

async function saveOrder(
  data: OrderFields,
  sampleImage: File | null,
  sampleBuffer: Buffer | null,
): Promise<{ id: number; lines: string[] }> {
  const payload = await getPayloadClient()
  const lines: string[] = []
  const productLines = data.items.filter((item) => item.kind === 'product')
  const galleryLines = data.items.filter((item) => item.kind === 'gallery')
  const items: { product: number; quantity: number }[] = []
  const galleryItems: { gallery: number; quantity: number }[] = []

  if (productLines.length > 0) {
    const ids = productLines.map((item) => item.id)
    const { docs } = await payload.find({
      collection: 'products',
      where: {
        and: [{ id: { in: ids } }, { isAvailable: { equals: true } }],
      },
      limit: ids.length,
      depth: 0,
    })

    if (docs.length !== ids.length) {
      throw new OrderFieldError({ items: messages.productUnavailable })
    }

    const byId = new Map(docs.map((doc) => [doc.id, doc]))
    for (const item of productLines) {
      const product = byId.get(item.id)
      if (!product) {
        throw new OrderFieldError({ items: messages.productUnavailable })
      }
      items.push({ product: product.id, quantity: item.quantity })
      lines.push(`${product.title} × ${faNumber(item.quantity)}`)
    }
  }

  if (galleryLines.length > 0) {
    const ids = galleryLines.map((item) => item.id)
    const { docs } = await payload.find({
      collection: 'gallery',
      where: {
        and: [{ id: { in: ids } }, { isAvailable: { equals: true } }],
      },
      limit: ids.length,
      depth: 1,
    })

    if (docs.length !== ids.length) {
      throw new OrderFieldError({ items: messages.productUnavailable })
    }

    const byId = new Map(docs.map((doc) => [doc.id, doc]))
    for (const item of galleryLines) {
      const photo = byId.get(item.id)
      if (!photo) {
        throw new OrderFieldError({ items: messages.productUnavailable })
      }
      galleryItems.push({ gallery: photo.id, quantity: item.quantity })
      const title = photo.caption?.trim() || resolveCategory(photo.category)?.title || 'نمونه کار'
      lines.push(`نمونه کار: ${title} × ${faNumber(item.quantity)}`)
    }
  }

  if (data.otherSelected) {
    lines.push(`${data.productNote} × ${faNumber(data.otherQuantity)}`)
  }

  let sampleImageId: number | undefined
  if (sampleImage && sampleBuffer) {
    const uploaded = await payload.create({
      collection: 'media',
      data: { alt: `عکس نمونه سفارش از ${data.customerName}` },
      file: {
        data: sampleBuffer,
        mimetype: sampleImage.type || 'image/jpeg',
        name: sampleImage.name || 'sample.jpg',
        size: sampleBuffer.byteLength,
      },
    })
    sampleImageId = uploaded.id
  }

  const order = await payload.create({
    collection: 'orders',
    data: {
      status: 'new',
      customerName: data.customerName,
      phone: data.phone,
      items,
      galleryItems,
      productNote: data.otherSelected ? data.productNote : undefined,
      otherQuantity: data.otherSelected ? data.otherQuantity : undefined,
      deliveryDate: data.deliveryDate,
      notes: data.notes || undefined,
      sampleImage: sampleImageId,
    },
  })

  return { id: order.id, lines }
}

async function notifyBaker(
  data: OrderFields,
  saved: { id: number; lines: string[] },
  sampleImage: File | null,
  sampleBuffer: Buffer | null,
): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY
  const from = process.env.RESEND_FROM_EMAIL
  const to = process.env.ORDER_NOTIFICATION_EMAIL
  if (!apiKey || !from || !to) return

  const callHref = phoneHref(data.phone)
  const adminHref = orderAdminUrl(saved.id)
  const resend = new Resend(apiKey)

  await resend.emails.send({
    from,
    to,
    subject: `سفارش جدید از ${data.customerName}`,
    html: orderEmailHtml({
      orderNumber: formatOrderNumber(saved.id),
      customerName: data.customerName,
      phone: data.phone,
      callHref,
      lines: saved.lines,
      deliveryDate: data.deliveryDate,
      notes: data.notes,
      adminHref,
    }),
    attachments:
      sampleImage && sampleBuffer
        ? [{ filename: sampleImage.name || 'sample.jpg', content: sampleBuffer }]
        : undefined,
  })
}

async function notifyOrderSms(
  data: OrderFields,
  saved: { id: number; lines: string[] },
): Promise<void> {
  const order = String(publicOrderNumber(saved.id))
  const bakerTemplate = parseTemplateId(process.env.SMSIR_TEMPLATE_NEW_ORDER)
  const customerTemplate = parseTemplateId(process.env.SMSIR_TEMPLATE_ORDER_RECEIVED)
  const bakerPhone = await resolveBakerNotificationPhone()

  // Sequential: two parallel verify calls to SMS.ir often return status 0 on the second.
  await sendSms({
    mobile: bakerPhone,
    templateId: bakerTemplate,
    parameters: bakerTemplate
      ? parametersForTemplate(bakerTemplate, {
          ORDER: order,
          NAME: data.customerName,
          COUNT: String(saved.lines.length),
        })
      : {},
  })
  await sendSms({
    mobile: data.phone,
    templateId: customerTemplate,
    parameters: customerTemplate
      ? parametersForTemplate(customerTemplate, {
          ORDER: order,
          NAME: data.customerName,
        })
      : {},
  })
}

function orderAdminUrl(orderId: number): string | null {
  const origin = resolveOrigin()
  if (!origin) return null
  return `${origin}/admin/collections/orders/${orderId}`
}

function orderEmailHtml({
  orderNumber,
  customerName,
  phone,
  callHref,
  lines,
  deliveryDate,
  notes,
  adminHref,
}: {
  orderNumber: string
  customerName: string
  phone: string
  callHref: string | null
  lines: string[]
  deliveryDate: string
  notes: string
  adminHref: string | null
}): string {
  const phoneDisplay = faPhone(phone)
  const phoneHtml = callHref
    ? `<a href="${callHref}" dir="ltr">${phoneDisplay}</a>`
    : `<span dir="ltr">${phoneDisplay}</span>`
  const adminHtml = adminHref
    ? `<p><a href="${adminHref}">مشاهده سفارش در پنل</a></p>`
    : ''
  const notesHtml = notes
    ? `<p><strong>توضیحات:</strong> ${escapeHtml(notes)}</p>`
    : ''
  const linesHtml = lines
    .map((line) => `<li>${escapeHtml(line)}</li>`)
    .join('')

  return `<!doctype html>
<html lang="fa" dir="rtl">
  <body style="font-family:Tahoma,Arial,sans-serif;line-height:1.8;color:#2c2620">
    <h1 style="font-size:20px">سفارش جدید</h1>
    <p><strong>شماره سفارش:</strong> ${escapeHtml(orderNumber)}</p>
    <p><strong>نام:</strong> ${escapeHtml(customerName)}</p>
    <p><strong>شماره تماس:</strong> ${phoneHtml}</p>
    <p><strong>اقلام:</strong></p>
    <ul>${linesHtml}</ul>
    <p><strong>تاریخ تحویل:</strong> ${escapeHtml(deliveryDate)}</p>
    ${notesHtml}
    ${adminHtml}
  </body>
</html>`
}

function escapeHtml(value: string): string {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
}
