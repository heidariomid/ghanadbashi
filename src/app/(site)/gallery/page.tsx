import type { Metadata } from 'next'
import { GalleryGrid, type GalleryPhoto } from '@/components/gallery/GalleryGrid'
import { Container } from '@/components/layout/Container'
import { SectionIntro } from '@/components/ui/SectionIntro'
import { content } from '@/data/content'
import { sortByCategoryOrder } from '@/lib/categories'
import { resolveImage } from '@/lib/media'
import { queryPayload } from '@/lib/payload'
import { buildPageMetadata } from '@/lib/seo'

export const revalidate = 3600

export async function generateMetadata(): Promise<Metadata> {
  const { eyebrow, description } = content.gallery

  return buildPageMetadata({ title: eyebrow, description, path: '/gallery' })
}

export default async function GalleryPage() {
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
    const image = resolveImage(doc.image)
    if (!image) return all

    all.push({
      id: String(doc.id),
      category: doc.category,
      caption: doc.caption ?? '',
      src: image.src,
      alt: image.alt || doc.caption || title,
    })
    return all
  }, [])

  const categories = sortByCategoryOrder([...new Set(photos.map((photo) => photo.category))])

  return (
    <main>
      <section className="py-section">
        <Container>
          <SectionIntro eyebrow={eyebrow} title={title} description={description} />
          {photos.length > 0 ? (
            <GalleryGrid photos={photos} categories={categories} priorityFirst />
          ) : (
            <p className="mt-8 text-center text-body text-muted-foreground sm:mt-11">
              به زودی عکس‌های بیشتری اضافه می‌شود
            </p>
          )}
        </Container>
      </section>
    </main>
  )
}
