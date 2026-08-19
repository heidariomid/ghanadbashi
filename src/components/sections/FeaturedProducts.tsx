import { Container } from '@/components/layout/Container'
import { Photo } from '@/components/ui/Photo'
import { SectionIntro } from '@/components/ui/SectionIntro'
import { content } from '@/data/content'
import { faPrice } from '@/lib/format'
import { resolveImage } from '@/lib/media'
import { getPayloadClient } from '@/lib/payload'

export async function FeaturedProducts() {
  const { eyebrow, title, description, footnote } = content.products

  const payload = await getPayloadClient()
  const { docs } = await payload.find({
    collection: 'products',
    where: { isFeatured: { equals: true } },
    limit: 12,
    sort: 'sortOrder',
    depth: 1,
  })

  if (docs.length === 0) return null

  return (
    <section id="products" className="bg-card py-section">
      <Container>
        <SectionIntro eyebrow={eyebrow} title={title} description={description} />

        <ul className="mt-11 grid grid-cols-[repeat(auto-fit,minmax(290px,1fr))] gap-9 md:mt-18 md:gap-14">
          {docs.map((product) => {
            const image = resolveImage(product.image)
            if (!image) return null

            return (
              <li key={product.id} className="group flex flex-col">
                <Photo
                  photo={image}
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 45vw, 33vw"
                  className="aspect-4/5 w-full rounded-xl"
                  imageClassName="transition-transform duration-500 group-hover:scale-105"
                />

                <h3 className="mt-6 text-h3 font-semibold text-card-foreground">
                  {product.title}
                </h3>
                {product.description && (
                  <p className="mt-2 text-small text-muted-foreground">{product.description}</p>
                )}

                <div className="mt-4.5 flex items-baseline gap-2.5">
                  <span className="text-body font-semibold text-card-foreground">
                    {product.priceOnRequest || product.price == null
                      ? 'استعلام قیمت'
                      : faPrice(product.price)}
                  </span>
                  {product.isAvailable === false && (
                    <span className="text-caption tracking-normal text-muted-foreground">
                      فعلاً موجود نیست
                    </span>
                  )}
                </div>

                {/* padding on the anchor keeps a 44px hit area; the rule stays on the
                    inner span so it hugs the text */}
                <a
                  href="#order"
                  className="group/cta mt-3 inline-flex min-h-11 w-fit items-center text-small"
                >
                  <span className="border-b border-border pb-1 transition-all duration-200 group-hover/cta:border-primary group-hover/cta:text-primary">
                    {content.primaryCta.label}
                  </span>
                </a>
              </li>
            )
          })}
        </ul>

        <a
          href="/products"
          className="group/all mt-9 inline-flex min-h-11 w-fit items-center text-small md:mt-14"
        >
          <span className="border-b border-border pb-1 transition-all duration-200 group-hover/all:border-primary group-hover/all:text-primary">
            {content.products.listing.viewAll}
          </span>
        </a>

        <p className="mt-4 text-caption text-muted-foreground">{footnote}</p>
      </Container>
    </section>
  )
}
