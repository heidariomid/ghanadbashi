import { categoryLabel } from '@/lib/categories'
import { resolveImage } from '@/lib/media'

export interface GalleryPhoto {
  id: number
  category: string
  caption: string
  title: string
  src: string
  alt: string
  available: boolean
}

export function galleryPhotoFrom(
  doc: {
    id: number
    category: string
    caption?: string | null
    isAvailable?: boolean | null
    image: Parameters<typeof resolveImage>[0]
  },
  fallbackAlt: string,
): GalleryPhoto | null {
  const image = resolveImage(doc.image)
  if (!image) return null

  return {
    id: doc.id,
    category: doc.category,
    caption: doc.caption ?? '',
    title: doc.caption?.trim() || categoryLabel(doc.category),
    src: image.src,
    alt: image.alt || doc.caption || fallbackAlt,
    available: doc.isAvailable !== false,
  }
}
