import { Container } from '@/components/layout/Container'
import { Photo } from '@/components/ui/Photo'
import { SectionIntro } from '@/components/ui/SectionIntro'
import { content } from '@/data/content'
import { faPrice } from '@/lib/format'

export function FeaturedProducts() {
  const { eyebrow, title, description, items, footnote } = content.products

  return (
    <section id="products" className="bg-card py-section">
      <Container>
        <SectionIntro eyebrow={eyebrow} title={title} description={description} />

        <ul className="mt-11 grid grid-cols-[repeat(auto-fit,minmax(290px,1fr))] gap-9 md:mt-18 md:gap-14">
          {items.map((product) => (
            <li key={product.id} className="group flex flex-col">
              <Photo
                photo={product.photo}
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 45vw, 33vw"
                className="aspect-4/5 w-full rounded-xl"
                imageClassName="transition-transform duration-500 group-hover:scale-105"
              />

              <h3 className="mt-6 text-h3 font-semibold text-card-foreground">
                {product.name}
              </h3>
              <p className="mt-2 text-small text-muted-foreground">{product.description}</p>

              <div className="mt-4.5 flex items-baseline gap-2.5">
                <span className="text-body font-semibold text-card-foreground">
                  {faPrice(product.price)}
                </span>
                <span className="text-caption tracking-normal text-muted-foreground">
                  {product.unit}
                </span>
              </div>

              {/* padding on the anchor keeps a 44px hit area; the rule stays on the
                  inner span so it hugs the text */}
              <a
                href="#order"
                className="group/cta mt-3 inline-flex min-h-11 w-fit items-center text-small"
              >
                <span className="border-b border-border pb-1 transition-all duration-200 group-hover/cta:border-primary group-hover/cta:text-primary">
                  {product.cta}
                </span>
              </a>
            </li>
          ))}
        </ul>

        <p className="mt-9 text-caption text-muted-foreground md:mt-14">{footnote}</p>
      </Container>
    </section>
  )
}
