import { resolveCategory } from '@/lib/categories'
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
    category:
      | number
      | { id: number; slug?: string | null; title: string; emoji?: string | null }
    caption?: string | null
    isAvailable?: boolean | null
    image: Parameters<typeof resolveImage>[0]
  },
  fallbackAlt: string,
): GalleryPhoto | null {
  const image = resolveImage(doc.image)
  const category = resolveCategory(doc.category)
  if (!image || !category) return null

  return {
    id: doc.id,
    category: category.slug,
    caption: doc.caption ?? '',
    title: doc.caption?.trim() || category.title,
    src: image.src,
    alt: image.alt || doc.caption || fallbackAlt,
    available: doc.isAvailable !== false,
  }
}
