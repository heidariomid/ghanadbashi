import type { Metadata } from 'next'

import { OrderForm } from '@/components/order/OrderForm'
import { Container } from '@/components/layout/Container'
import { content } from '@/data/content'
import { cartProductFrom } from '@/lib/cart'
import { resolveImage } from '@/lib/media'
import { queryPayload } from '@/lib/payload'
import { buildPageMetadata } from '@/lib/seo'

/** Lets the SMS.ir calls finish after the 8s abort we saw in production. */
export const maxDuration = 60
/** Frankfurt is a shorter path to api.sms.ir than the default iad1. */
export const preferredRegion = 'fra1'

interface OrderPageProps {
  searchParams: Promise<{ product?: string | string[] }>
}

export async function generateMetadata(): Promise<Metadata> {
  const { metaTitle, metaDescription } = content.orderForm

  return buildPageMetadata({
    title: metaTitle,
    description: metaDescription,
    path: '/order',
  })
}

export default async function OrderPage({ searchParams }: OrderPageProps) {
  const params = await searchParams
  const raw = params.product
  const slug = Array.isArray(raw) ? raw[0] : raw
  const preselected = slug ? await findAvailableProduct(slug) : null

  return (
    <main className="flex min-h-[calc(100dvh-var(--spacing-nav))] flex-col">
      <section className="flex flex-1 flex-col justify-center bg-card py-section">
        <Container>
          <div className="mx-auto max-w-xl">
            <OrderForm preselected={preselected} />
          </div>
        </Container>
      </section>
    </main>
  )
}

async function findAvailableProduct(slug: string) {
  const result = await queryPayload((payload) =>
    payload.find({
      collection: 'products',
      where: {
        and: [{ slug: { equals: slug } }, { isAvailable: { equals: true } }],
      },
      limit: 1,
      depth: 1,
    }),
  )
  const doc = result?.docs[0]
  if (!doc) return null
  return cartProductFrom(doc, resolveImage(doc.image))
}
