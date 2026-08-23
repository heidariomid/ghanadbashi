import type { Metadata } from 'next'
import { ProductListing } from '@/components/products/ProductListing'
import { content } from '@/data/content'
import { parseCategoryParam } from '@/lib/categories'
import { queryCategories } from '@/lib/query-categories'
import { queryPayload } from '@/lib/payload'
import { buildPageMetadata } from '@/lib/seo'

interface ProductsPageProps {
  searchParams: Promise<{ category?: string | string[] }>
}

export async function generateMetadata(): Promise<Metadata> {
  const { title, description } = content.products.listing

  return buildPageMetadata({ title, description, path: '/products' })
}

export default async function ProductsPage({ searchParams }: ProductsPageProps) {
  const params = await searchParams
  const categories = await queryCategories()
  const category = parseCategoryParam(
    params.category,
    categories.map((chip) => chip.slug),
  )

  const result = await queryPayload((payload) =>
    payload.find({
      collection: 'products',
      sort: 'sortOrder',
      limit: 100,
      depth: 1,
    }),
  )
  const docs = result?.docs ?? []

  return (
    <main>
      <ProductListing products={docs} categories={categories} category={category} />
    </main>
  )
}
