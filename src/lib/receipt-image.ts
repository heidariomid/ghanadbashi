export const MAX_RECEIPT_BYTES = 4 * 1024 * 1024

const IMAGE_EXT = /\.(jpe?g|png|webp|gif|heic|heif|bmp)$/i

export function isReceiptImageFile(file: { type: string; name: string }): boolean {
  if (file.type.startsWith('image/')) return true
  return IMAGE_EXT.test(file.name)
}

/** Turn upload failures into a short Persian message the customer can act on. */
export function mapDepositReceiptUploadError(error: unknown): string {
  if (error && typeof error === 'object' && 'message' in error) {
    const message = String(error.message).trim()
    if (message.includes('۴ مگابایت') || message.includes('4 megabyte')) {
      return 'حجم عکس بیشتر از ۴ مگابایت است. لطفاً عکس کوچک‌تر یا با کیفیت کمتر بفرستید.'
    }
    if (message.includes('متن جایگزین') || message.includes('alt')) {
      return 'ارسال رسید ممکن نشد. لطفاً دوباره تلاش کنید.'
    }
    if (/mime|file type|format|webp|sharp/i.test(message)) {
      return 'فرمت این عکس پشتیبانی نمی‌شود. لطفاً JPG یا PNG بفرستید.'
    }
    if (/body.*limit|413|too large|payload/i.test(message)) {
      return 'حجم عکس برای ارسال زیاد است. لطفاً عکس کوچک‌تر (زیر ۴ مگابایت) انتخاب کنید.'
    }
    if (/network|fetch|timeout|ECONN|ETIMEDOUT/i.test(message)) {
      return 'اتصال اینترنت قطع شد. لطفاً دوباره تلاش کنید.'
    }
    if (message.length > 0 && message.length <= 120 && /[\u0600-\u06FF]/.test(message)) {
      return message
    }
  }
  return 'ارسال رسید ممکن نشد. اگر عکس بزرگ است یا فرمتش JPG/PNG نیست، عوضش کنید و دوباره بفرستید.'
}
