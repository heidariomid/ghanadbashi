import type { Metadata } from 'next'

import { LocalBusinessJsonLd } from '@/components/seo/LocalBusinessJsonLd'
import { About } from '@/components/sections/About'
import { Categories } from '@/components/sections/Categories'
import { Contact } from '@/components/sections/Contact'
import { FeaturedProducts } from '@/components/sections/FeaturedProducts'
import { Gallery } from '@/components/sections/Gallery'
import { Hero } from '@/components/sections/Hero'
import { OrderCta } from '@/components/sections/OrderCta'
import { content } from '@/data/content'
import { buildPageMetadata } from '@/lib/seo'

// On-demand hooks on products and site-settings refresh this page. The hour
// fallback covers a missed hook so an edit still appears without a redeploy.
export const revalidate = 3600

export async function generateMetadata(): Promise<Metadata> {
  return buildPageMetadata({
    description: content.brand.metaDescription,
    path: '/',
  })
}

export default function Home() {
  return (
    <main>
      <LocalBusinessJsonLd />
      <Hero />
      <Categories />
      <FeaturedProducts />
      <Gallery />
      <About />
      <OrderCta />
      <Contact />
    </main>
  )
}
