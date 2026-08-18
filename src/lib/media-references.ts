import type { Payload } from 'payload'

type MediaReference = {
  label: string
}

/**
 * Returns where a media file is still in use. Upload delete in the admin tries
 * to remove the media row outright; Postgres then nulls FK columns on gallery,
 * products, etc. Required upload fields block that with a 500 — we catch it
 * here and return a message the client can act on.
 */
export async function getMediaReferences(
  payload: Payload,
  mediaId: number | string,
): Promise<MediaReference[]> {
  const references: MediaReference[] = []

  const [gallery, products, orders, settings] = await Promise.all([
    payload.find({
      collection: 'gallery',
      where: { image: { equals: mediaId } },
      limit: 1,
      depth: 0,
    }),
    payload.find({
      collection: 'products',
      where: { image: { equals: mediaId } },
      limit: 1,
      depth: 0,
    }),
    payload.find({
      collection: 'orders',
      where: { sampleImage: { equals: mediaId } },
      limit: 1,
      depth: 0,
    }),
    payload.findGlobal({ slug: 'site-settings', depth: 0 }),
  ])

  if (gallery.totalDocs > 0) {
    references.push({ label: 'نمونه کارها' })
  }

  if (products.totalDocs > 0) {
    references.push({ label: 'محصولات' })
  }

  if (orders.totalDocs > 0) {
    references.push({ label: 'سفارش‌ها' })
  }

  const heroId = settings.brand?.heroImage
  const aboutId = settings.brand?.aboutImage

  if (heroId === mediaId || (typeof heroId === 'object' && heroId?.id === mediaId)) {
    references.push({ label: 'تنظیمات سایت (عکس صفحه اول)' })
  }

  if (aboutId === mediaId || (typeof aboutId === 'object' && aboutId?.id === mediaId)) {
    references.push({ label: 'تنظیمات سایت (عکس درباره من)' })
  }

  return references
}

export function formatMediaInUseMessage(references: MediaReference[]): string {
  const places = references.map((ref) => ref.label).join('، ')
  return `این عکس هنوز در ${places} استفاده می‌شود. ابتدا آن مورد را از لیست مربوطه حذف کنید، بعد می‌توانید فایل رسانه‌ای را پاک کنید.`
}
