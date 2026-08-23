import { GalleryGrid } from '@/components/gallery/GalleryGrid'
import { Container } from '@/components/layout/Container'
import { SectionIntro } from '@/components/ui/SectionIntro'
import { content } from '@/data/content'
import { sortByCategoryOrder } from '@/lib/categories'
import { galleryPhotoFrom, type GalleryPhoto } from '@/lib/gallery'
import { queryPayload } from '@/lib/payload'

export async function Gallery() {
  const { eyebrow, title, description } = content.gallery

  const result = await queryPayload((payload) =>
    payload.find({
      collection: 'gallery',
      limit: 200,
      sort: 'sortOrder',
      depth: 1,
    }),
  )
  const docs = result?.docs ?? []

  const photos = docs.reduce<GalleryPhoto[]>((all, doc) => {
    const photo = galleryPhotoFrom(doc, title)
    if (photo) all.push(photo)
    return all
  }, [])

  if (photos.length === 0) return null

  // Chips come from what is published, so an empty category never renders one
  // and a newly filled one appears without a code change.
  const categories = sortByCategoryOrder([...new Set(photos.map((photo) => photo.category))])

  return (
    <section id="gallery" className="py-section">
      <Container>
        <SectionIntro eyebrow={eyebrow} title={title} description={description} />
        <GalleryGrid photos={photos} categories={categories} />
      </Container>
    </section>
  )
}
