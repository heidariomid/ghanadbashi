import type { Metadata } from 'next'
import { GalleryGrid } from '@/components/gallery/GalleryGrid'
import { Container } from '@/components/layout/Container'
import { SectionIntro } from '@/components/ui/SectionIntro'
import { content } from '@/data/content'
import { parseCategoryParam, sortByCategoryOrder } from '@/lib/categories'
import { galleryPhotoFrom, type GalleryPhoto } from '@/lib/gallery'
import { queryPayload } from '@/lib/payload'
import { buildPageMetadata } from '@/lib/seo'

export const revalidate = 3600

export async function generateMetadata(): Promise<Metadata> {
  const { eyebrow, description } = content.gallery

  return buildPageMetadata({ title: eyebrow, description, path: '/gallery' })
}

interface GalleryPageProps {
  searchParams: Promise<{ category?: string | string[] }>
}

export default async function GalleryPage({ searchParams }: GalleryPageProps) {
  const params = await searchParams
  const category = parseCategoryParam(params.category)
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

  const categories = sortByCategoryOrder([...new Set(photos.map((photo) => photo.category))])

  return (
    <main>
      <section className="py-section">
        <Container>
          <SectionIntro eyebrow={eyebrow} title={title} description={description} />
          {photos.length > 0 ? (
            <GalleryGrid
              photos={photos}
              categories={categories}
              category={category}
              filterBasePath="/gallery"
              priorityFirst
            />
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
