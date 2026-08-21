import Image from 'next/image'
import { Container } from '@/components/layout/Container'
import { SectionIntro } from '@/components/ui/SectionIntro'
import { content } from '@/data/content'
import { CATEGORIES } from '@/lib/categories'
import { resolveImage, type ResolvedImage } from '@/lib/media'
import { queryPayload } from '@/lib/payload'

interface CategoryCover {
  count: number
  src: string
  alt: string
}

export async function Categories() {
  const { eyebrow, title, description, empty } = content.categories

  const [gallery, products] = await Promise.all([
    queryPayload((payload) =>
      payload.find({ collection: 'gallery', limit: 200, sort: 'sortOrder', depth: 1 }),
    ),
    queryPayload((payload) =>
      payload.find({ collection: 'products', limit: 200, sort: 'sortOrder', depth: 1 }),
    ),
  ])

  const covers = new Map<string, CategoryCover>()
  for (const doc of gallery?.docs ?? []) {
    if (covers.has(doc.category)) {
      covers.get(doc.category)!.count += 1
      continue
    }

    const image = resolveImage(doc.image)
    if (!image) continue

    covers.set(doc.category, {
      count: 1,
      src: image.src,
      alt: image.alt || doc.caption || doc.category,
    })
  }

  // A category she sells but has no photo of yet would otherwise render as a
  // bare emoji next to nine photographed ones. Its product picture is the
  // closest thing to a cover we have.
  const productCovers = new Map<string, ResolvedImage>()
  for (const doc of products?.docs ?? []) {
    if (covers.has(doc.category) || productCovers.has(doc.category)) continue

    const image = resolveImage(doc.image)
    if (image) productCovers.set(doc.category, { src: image.src, alt: image.alt || doc.title })
  }

  return (
    <section id="categories" className="pb-section">
      <Container>
        <SectionIntro eyebrow={eyebrow} title={title} description={description} />

        {/* two-up on phones: full-width squares would be far too much scrolling */}
        <ul className="mt-9 grid grid-cols-2 gap-x-4 gap-y-8 sm:mt-11 sm:grid-cols-[repeat(auto-fit,minmax(230px,1fr))] sm:gap-7 md:mt-18 md:gap-11">
          {CATEGORIES.map((category) => {
            const cover = covers.get(category.value)
            const image = cover ?? productCovers.get(category.value)
            const href = cover ? '#gallery' : `/products?category=${category.value}`

            return (
              <li key={category.value}>
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
                    {category.label}
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
