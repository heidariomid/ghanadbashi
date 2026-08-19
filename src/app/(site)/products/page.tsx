import type { Metadata } from 'next'
import { ProductListing } from '@/components/products/ProductListing'
import { content } from '@/data/content'
import { sortByCategoryOrder } from '@/lib/categories'
import { cleanContactValue } from '@/lib/contact'
import { getPayloadClient } from '@/lib/payload'
import { getSiteSettings } from '@/lib/site-settings'

interface ProductsPageProps {
  searchParams: Promise<{ category?: string | string[] }>
}

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings()
  const brandName = settings.brand?.brandName?.trim() || content.brand.name
  const { title, description } = content.products.listing

  return {
    title: `${title} | ${brandName}`,
    description,
  }
}

export default async function ProductsPage({ searchParams }: ProductsPageProps) {
  const params = await searchParams
  const raw = params.category
  const category = Array.isArray(raw) ? raw[0] : raw

  const payload = await getPayloadClient()
  const [{ docs }, settings] = await Promise.all([
    payload.find({
      collection: 'products',
      sort: 'sortOrder',
      limit: 100,
      depth: 1,
    }),
    getSiteSettings(),
  ])

  const categories = sortByCategoryOrder([...new Set(docs.map((doc) => doc.category))])
  const whatsapp = cleanContactValue(settings.contact?.whatsapp)

  return (
    <main>
      <ProductListing
        products={docs}
        categories={categories}
        category={category}
        whatsapp={whatsapp}
      />
    </main>
  )
}
