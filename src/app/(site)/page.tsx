import { About } from '@/components/sections/About'
import { Categories } from '@/components/sections/Categories'
import { Contact } from '@/components/sections/Contact'
import { FeaturedProducts } from '@/components/sections/FeaturedProducts'
import { Gallery } from '@/components/sections/Gallery'
import { Hero } from '@/components/sections/Hero'
import { OrderCta } from '@/components/sections/OrderCta'

// On-demand hooks on products and site-settings refresh this page. The hour
// fallback covers a missed hook so an edit still appears without a redeploy.
export const revalidate = 3600

export default function Home() {
  return (
    <main>
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
