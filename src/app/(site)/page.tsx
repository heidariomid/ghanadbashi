import { Footer } from '@/components/layout/Footer'
import { Header } from '@/components/layout/Header'
import { WhatsAppFloat } from '@/components/layout/WhatsAppFloat'
import { About } from '@/components/sections/About'
import { Categories } from '@/components/sections/Categories'
import { Contact } from '@/components/sections/Contact'
import { FeaturedProducts } from '@/components/sections/FeaturedProducts'
import { Gallery } from '@/components/sections/Gallery'
import { Hero } from '@/components/sections/Hero'
import { OrderCta } from '@/components/sections/OrderCta'

// The page is prerendered, so without this the client's admin edits would only
// appear on the next deploy. Phase 7 can swap this for on-demand revalidation.
export const revalidate = 60

export default function Home() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <Categories />
        <FeaturedProducts />
        <Gallery />
        <About />
        <OrderCta />
        <Contact />
      </main>
      <Footer />
      <WhatsAppFloat />
    </>
  )
}
