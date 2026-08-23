import Image from 'next/image'
import { Container } from '@/components/layout/Container'
import { SectionIntro } from '@/components/ui/SectionIntro'
import { content } from '@/data/content'
import { resolveCategory } from '@/lib/categories'
import { queryCategories } from '@/lib/query-categories'
import { resolveImage, type ResolvedImage } from '@/lib/media'
import { queryPayload } from '@/lib/payload'

interface CategoryCover {
  count: number
  src: string
  alt: string
}

export async function Categories() {
  const { eyebrow, title, description, empty } = content.categories

  const [categories, gallery, products] = await Promise.all([
    queryCategories(),
    queryPayload((payload) =>
      payload.find({ collection: 'gallery', limit: 200, sort: 'sortOrder', depth: 1 }),
    ),
    queryPayload((payload) =>
      payload.find({ collection: 'products', limit: 200, sort: 'sortOrder', depth: 1 }),
    ),
  ])

  const covers = new Map<string, CategoryCover>()
  for (const doc of gallery?.docs ?? []) {
    const category = resolveCategory(doc.category)
    if (!category) continue

    if (covers.has(category.slug)) {
      covers.get(category.slug)!.count += 1
      continue
    }

    const image = resolveImage(doc.image)
    if (!image) continue

    covers.set(category.slug, {
      count: 1,
      src: image.src,
      alt: image.alt || doc.caption || category.title,
    })
  }

  // A category she sells but has no photo of yet would otherwise render as a
  // bare emoji next to photographed ones. Its product picture is the closest
  // thing to a cover we have.
  const productCovers = new Map<string, ResolvedImage>()
  for (const doc of products?.docs ?? []) {
    const category = resolveCategory(doc.category)
    if (!category || covers.has(category.slug) || productCovers.has(category.slug)) continue

    const image = resolveImage(doc.image)
    if (image) productCovers.set(category.slug, { src: image.src, alt: image.alt || doc.title })
  }

  if (categories.length === 0) return null

  return (
    <section id="categories" className="pb-section">
      <Container>
        <SectionIntro eyebrow={eyebrow} title={title} description={description} />

        {/* two-up on phones: full-width squares would be far too much scrolling */}
        <ul className="mt-9 grid grid-cols-2 gap-x-4 gap-y-8 sm:mt-11 sm:grid-cols-[repeat(auto-fit,minmax(230px,1fr))] sm:gap-7 md:mt-18 md:gap-11">
          {categories.map((category) => {
            const cover = covers.get(category.slug)
            const image = cover ?? productCovers.get(category.slug)
            const href = cover
              ? `/gallery?category=${category.slug}`
              : `/products?category=${category.slug}`

            return (
              <li key={category.slug}>
                <a href={href} className="group block">
                  <div className="relative aspect-square w-full overflow-hidden rounded-xl bg-muted sm:rounded-2xl">
                    {image ? (
                      <Image
                        src={image.src}
                        alt={image.alt}
                        fill
                        sizes="(max-width: 1024px) 45vw, 25vw"
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    ) : (
                      <span
                        aria-hidden="true"
                        className="flex h-full items-center justify-center text-5xl sm:text-6xl"
                      >
                        {category.emoji}
                      </span>
                    )}
                  </div>
                  <h3 className="mt-4 text-small font-semibold text-card-foreground transition-colors duration-200 group-hover:text-primary-strong sm:mt-5 sm:text-[1.0625rem]">
                    {category.title}
                  </h3>
                  <p className="mt-1.5 text-tiny text-muted-foreground sm:mt-2 sm:text-small">
                    {cover
                      ? `${cover.count.toLocaleString('fa-IR')} نمونه کار`
                      : empty}
                  </p>
                </a>
              </li>
            )
          })}
        </ul>
      </Container>
    </section>
  )
}
