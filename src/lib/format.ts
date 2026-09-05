const FA_LOCALE = 'fa-IR'
const PERSIAN_DIGITS = '۰۱۲۳۴۵۶۷۸۹'
const ARABIC_DIGITS = '٠١٢٣٤٥٦٧٨٩'

/** Persian digits for any number — never hand-map digits. */
export function faNumber(value: number): string {
  return value.toLocaleString(FA_LOCALE)
}

/** Persian/Arabic digits → Latin, so phone and quantity validate against `/^09…$/`. */
export function toLatinDigits(value: string): string {
  return value.replace(/[۰-۹٠-٩]/g, (digit) => {
    const persian = PERSIAN_DIGITS.indexOf(digit)
    if (persian !== -1) return String(persian)
    return String(ARABIC_DIGITS.indexOf(digit))
  })
}

/** Digits only — for amount fields before parse/validate. */
export function extractDigits(raw: string, maxLength = 12): string {
  return toLatinDigits(raw).replace(/\D/g, '').slice(0, maxLength)
}

/** Live amount input — Persian digits with thousand grouping. */
export function formatAmountInput(raw: string, maxDigits = 12): string {
  const digits = extractDigits(raw, maxDigits)
  if (!digits) return ''
  return faNumber(Number(digits))
}

/** Price with its currency word, e.g. «۹۸۰٫۰۰۰ تومان» */
export function faPrice(value: number): string {
  return `${faNumber(value)} تومان`
}

/** Card number grouped in fours with Persian digits. */
export function faCardNumber(value: string): string {
  const digits = toLatinDigits(value).replace(/\D/g, '')
  return digits.replace(/(\d{4})(?=\d)/g, '$1 ').replace(/\d/g, (digit) => faNumber(Number(digit)))
}

/** Phone numbers keep their grouping but render in Persian digits. */
export function faPhone(value: string): string {
  return value.replace(/\d/g, (digit) => faNumber(Number(digit)))
}

/** ۰۹… for SMS — reads from CMS whatsapp (989…) or phone. */
export function formatSmsMobile(raw: string | null | undefined): string {
  if (!raw?.trim()) return ''
  let digits = toLatinDigits(raw).replace(/\D/g, '')
  if (digits.startsWith('98') && digits.length >= 12) digits = `0${digits.slice(2, 12)}`
  else if (!digits.startsWith('0') && digits.length >= 10) digits = `0${digits.slice(-10)}`
  if (!/^09\d{9}$/.test(digits)) return ''
  return faPhone(digits)
}
