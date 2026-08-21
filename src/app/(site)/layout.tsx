import type { Metadata } from 'next'
import Script from 'next/script'
import { CartDrawer } from '@/components/cart/CartDrawer'
import { CartProvider } from '@/components/cart/CartProvider'
import { Footer } from '@/components/layout/Footer'
import { Header } from '@/components/layout/Header'
import { UnavailableNotice } from '@/components/layout/UnavailableNotice'
import { themeBootScript } from '@/components/layout/theme-boot'
import { WhatsAppFloat } from '@/components/layout/WhatsAppFloat'
import { content } from '@/data/content'
import { fontVariables } from '@/lib/fonts'
import { homeTitle } from '@/lib/seo'
import { getSiteSettings } from '@/lib/site-settings'
import { siteOrigin } from '@/lib/site-url'
import '../globals.css'

/**
 * Defaults every page inherits. `metadataBase` is what lets the pages below
 * hand Next relative paths for the canonical and the Open Graph image.
 */
export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings()
  const brandName = settings?.brand?.brandName?.trim() || content.brand.name

  return {
    metadataBase: new URL(siteOrigin()),
    title: {
      default: homeTitle(brandName),
      template: `%s | ${brandName}`,
    },
    description: content.brand.metaDescription,
    robots: { index: true, follow: true },
  }
}

export default async function SiteLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const settings = await getSiteSettings()

  return (
    <html lang="fa" dir="rtl" className={fontVariables} suppressHydrationWarning>
      <body>
        <Script id="theme-boot" strategy="beforeInteractive">
          {themeBootScript}
        </Script>
        <CartProvider>
          <Header />
          {settings ? children : <UnavailableNotice />}
          <Footer />
          <WhatsAppFloat />
          <CartDrawer />
        </CartProvider>
      </body>
    </html>
  )
}
