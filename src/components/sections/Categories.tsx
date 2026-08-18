import Image from 'next/image'
import { Container } from '@/components/layout/Container'
import { SectionIntro } from '@/components/ui/SectionIntro'
import { content } from '@/data/content'
import { findCategory, sortByCategoryOrder } from '@/lib/categories'
import { resolveImage } from '@/lib/media'
import { getPayloadClient } from '@/lib/payload'

interface CategoryCard {
  value: string
  label: string
  count: number
  src: string
  alt: string
}

export async function Categories() {
  const { eyebrow, title, description } = content.categories

  const payload = await getPayloadClient()
  const { docs } = await payload.find({
    collection: 'gallery',
    limit: 200,
    sort: 'sortOrder',
    depth: 1,
  })

  // One card per category that has photos, illustrated by its first one. The
  // client never picks a category cover — it follows whatever she uploads.
  const cards = new Map<string, CategoryCard>()
  for (const doc of docs) {
    if (cards.has(doc.category)) {
      cards.get(doc.category)!.count += 1
      continue
    }

    const image = resolveImage(doc.image)
    if (!image) continue

    cards.set(doc.category, {
      value: doc.category,
      label: findCategory(doc.category)?.label ?? doc.category,
      count: 1,
      src: image.src,
      alt: image.alt || doc.caption || doc.category,
    })
  }

  if (cards.size === 0) return null

  const ordered = sortByCategoryOrder([...cards.keys()]).map((value) => cards.get(value)!)

  return (
    <section id="categories" className="pb-section">
      <Container>
        <SectionIntro eyebrow={eyebrow} title={title} description={description} />

        {/* two-up on phones: full-width squares would be far too much scrolling */}
        <ul className="mt-9 grid grid-cols-2 gap-x-4 gap-y-8 sm:mt-11 sm:grid-cols-[repeat(auto-fit,minmax(230px,1fr))] sm:gap-7 md:mt-18 md:gap-11">
          {ordered.map((card) => (
            <li key={card.value}>
              <a href="#gallery" className="group block">
                <div className="relative aspect-square w-full overflow-hidden rounded-xl sm:rounded-2xl">
                  <Image
                    src={card.src}
                    alt={card.alt}
                    fill
                    sizes="(max-width: 1024px) 45vw, 25vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                <h3 className="mt-4 text-small font-semibold text-card-foreground transition-colors duration-200 group-hover:text-primary sm:mt-5 sm:text-[1.0625rem]">
                  {card.label}
                </h3>
                <p className="mt-1.5 text-tiny text-muted-foreground sm:mt-2 sm:text-small">
                  {card.count.toLocaleString('fa-IR')} نمونه کار
                </p>
              </a>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  )
}
