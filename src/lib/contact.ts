function digitsOnly(value: string): string {
  return value.replace(/\D/g, '')
}

export function cleanContactValue(value: string | null | undefined): string | null {
  const cleaned = value?.trim()
  return cleaned || null
}

export function phoneHref(phone: string): string | null {
  const digits = digitsOnly(phone)
  if (!digits) return null

  const international = digits.startsWith('98')
    ? digits
    : digits.startsWith('0')
      ? `98${digits.slice(1)}`
      : `98${digits}`

  return `tel:+${international}`
}

export function whatsappHref(whatsapp: string, text?: string): string | null {
  const digits = digitsOnly(whatsapp)
  if (!digits) return null

  const url = new URL(`https://wa.me/${digits}`)
  if (text) url.searchParams.set('text', text)
  return url.toString()
}

export function instagramHref(instagram: string): string | null {
  const handle = instagram.replace(/^@+/, '').trim()
  return handle ? `https://instagram.com/${handle}` : null
}
