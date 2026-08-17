const FA_LOCALE = 'fa-IR'

/** Persian digits for any number — never hand-map digits. */
export function faNumber(value: number): string {
  return value.toLocaleString(FA_LOCALE)
}

/** Price with its currency word, e.g. «۹۸۰٫۰۰۰ تومان» */
export function faPrice(value: number): string {
  return `${faNumber(value)} تومان`
}

/** Phone numbers keep their grouping but render in Persian digits. */
export function faPhone(value: string): string {
  return value.replace(/\d/g, (digit) => faNumber(Number(digit)))
}
