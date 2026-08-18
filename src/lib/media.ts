import type { Media } from '@/payload-types'

export interface ResolvedImage {
  src: string
  alt: string
}

/**
 * An upload field arrives as a numeric id when `depth` is 0, and a record the
 * client may have deleted at any depth. Both resolve to null so a half-finished
 * document renders as a gap instead of throwing.
 */
export function resolveImage(value: number | Media | null | undefined): ResolvedImage | null {
  if (!value || typeof value === 'number' || !value.url) {
    return null
  }

  return { src: value.url, alt: value.alt || '' }
}
