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

/** Price with its currency word, e.g. «۹۸۰٫۰۰۰ تومان» */
export function faPrice(value: number): string {
  return `${faNumber(value)} تومان`
}

/** Phone numbers keep their grouping but render in Persian digits. */
export function faPhone(value: string): string {
  return value.replace(/\d/g, (digit) => faNumber(Number(digit)))
}
