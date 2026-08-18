/**
 * Persian characters are kept as-is rather than transliterated. Browsers show
 * percent-encoded Persian in the address bar as readable Persian, and a
 * transliteration table would turn «کیک تولد» into something the client cannot
 * recognise when she edits the field by hand.
 */
export function slugify(input: string): string {
  return input
    .trim()
    .toLowerCase()
    .replace(/[\s_]+/g, '-')
    .replace(/[^\p{Letter}\p{Number}\u200c-]/gu, '')
    .replace(/-{2,}/g, '-')
    .replace(/^-|-$/g, '')
}
