import { AddToCartButton } from '@/components/cart/AddToCartButton'
import { Container } from '@/components/layout/Container'
import { Eyebrow } from '@/components/ui/Eyebrow'
import { Photo } from '@/components/ui/Photo'
import { content } from '@/data/content'
import { categoryLabel } from '@/lib/categories'
import { cartProductFrom } from '@/lib/cart'
import { faPrice } from '@/lib/format'
import { resolveImage } from '@/lib/media'
import type { Product } from '@/payload-types'

interface ProductListingProps {
  products: Product[]
  categories: string[]
  /** Active filter from `?category=`. `undefined` means «همه». */
  category: string | undefined
}

export function ProductListing({ products, categories, category }: ProductListingProps) {
  const { listing } = content.products
  const showAll = category === undefined
  const ready = products.filter((product) => resolveImage(product.image))
  const visible = showAll ? ready : ready.filter((product) => product.category === category)

  return (
    <section className="bg-card py-section">
      <Container>
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <Eyebrow>{listing.eyebrow}</Eyebrow>
            <h1 className="mt-5.5 text-h1 font-black text-card-foreground text-balance">
              {listing.title}
            </h1>
          </div>
          <p className="max-w-96 text-body text-muted-foreground">{listing.description}</p>
        </div>

        {categories.length > 0 ? (
          <nav aria-label="فیلتر دسته‌بندی" className="mt-8 flex flex-wrap justify-center gap-2 sm:mt-10 sm:gap-3">
            <Chip href="/products" label={listing.all} active={showAll} />
            {categories.map((value) => (
              <Chip
                key={value}
                href={`/products?category=${value}`}
                label={categoryLabel(value)}
                active={category === value}
              />
            ))}
          </nav>
        ) : null}

        {visible.length === 0 ? (
          <p className="mt-16 text-center text-body text-muted-foreground">{listing.empty}</p>
        ) : (
          <ul className="mt-11 grid grid-cols-[repeat(auto-fill,minmax(290px,1fr))] gap-9 md:mt-18 md:gap-14">
            {visible.map((product, index) => (
              <ListingCard key={product.id} product={product} priority={index === 0} />
            ))}
          </ul>
        )}
      </Container>
    </section>
  )
}

function Chip({ href, label, active }: { href: string; label: string; active: boolean }) {
  return (
    <a
      href={href}
      aria-current={active ? 'page' : undefined}
      className={`inline-flex min-h-11 items-center rounded-full px-4 text-small transition-colors duration-200 sm:px-5 ${
        active
          ? 'bg-primary text-primary-foreground'
          : 'bg-background text-muted-foreground hover:text-card-foreground'
      }`}
    >
      {label}
    </a>
  )
}

function ListingCard({ product, priority }: { product: Product; priority: boolean }) {
  const image = resolveImage(product.image)
  if (!image) return null

  const available = product.isAvailable !== false

  return (
    <li className="group flex flex-col">
      <div className="relative">
        <Photo
          photo={image}
          priority={priority}
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 45vw, 33vw"
          className={`aspect-4/5 w-full rounded-xl ${available ? '' : 'grayscale'}`}
          imageClassName="transition-transform duration-500 group-hover:scale-105"
        />
        {available ? null : (
          <span className="absolute inset-s-3 top-3 rounded-full bg-card/95 px-3 py-1.5 text-caption text-muted-foreground shadow-warm">
            {content.products.listing.unavailable}
          </span>
        )}
      </div>

      <h2 className="mt-6 text-h3 font-semibold text-card-foreground">{product.title}</h2>
      {product.description ? (
        <p className="mt-2 line-clamp-2 text-small text-muted-foreground">{product.description}</p>
      ) : null}

      <div className="mt-4.5 flex items-baseline gap-2.5">
        <span className="text-body font-semibold text-card-foreground">
          {product.priceOnRequest || product.price == null
            ? 'استعلام قیمت'
            : faPrice(product.price)}
        </span>
      </div>

      {available ? <AddToCartButton product={cartProductFrom(product, image)} /> : null}
    </li>
  )
}
