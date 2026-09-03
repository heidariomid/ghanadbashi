import type { Metadata } from 'next'
import { notFound } from 'next/navigation'

import { DepositReceiptForm } from '@/components/order/DepositReceiptForm'
import { Container } from '@/components/layout/Container'
import { content } from '@/data/content'
import {
  depositReceiptReady,
  findOrderByDepositToken,
  orderReceiptTitle,
} from '@/lib/deposit-receipt'
import { getPayloadClient } from '@/lib/payload'
import { buildPageMetadata } from '@/lib/seo'

interface DepositReceiptPageProps {
  params: Promise<{ token: string }>
}

export async function generateMetadata(): Promise<Metadata> {
  const { metaTitle, metaDescription } = content.depositReceipt

  return buildPageMetadata({
    title: metaTitle,
    description: metaDescription,
    path: '/order/receipt',
  })
}

export default async function DepositReceiptPage({ params }: DepositReceiptPageProps) {
  const { token } = await params
  const payload = await getPayloadClient()
  const order = await findOrderByDepositToken(payload, token)

  if (!order || !depositReceiptReady(order)) {
    notFound()
  }

  const customerName = String(order.customerName ?? '').trim()
  const alreadyUploaded = order.depositReceipt != null

  return (
    <main className="flex min-h-[calc(100dvh-var(--spacing-nav))] flex-col">
      <section className="flex flex-1 flex-col justify-center bg-card py-section">
        <Container>
          <div className="mx-auto max-w-xl">
            <DepositReceiptForm
              token={token}
              orderTitle={orderReceiptTitle(order.id)}
              customerName={customerName}
              alreadyUploaded={alreadyUploaded}
            />
          </div>
        </Container>
      </section>
    </main>
  )
}
