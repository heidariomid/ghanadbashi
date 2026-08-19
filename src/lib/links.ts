/** WhatsApp, Instagram, phone — leave the bakery site open. */
export function isExternalHref(href: string): boolean {
  return /^(https?:|mailto:|tel:)/i.test(href)
}

export const newTabProps = {
  target: '_blank' as const,
  rel: 'noopener noreferrer',
}
