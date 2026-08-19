import type { Metadata } from 'next'
import Script from 'next/script'
import { CartDrawer } from '@/components/cart/CartDrawer'
import { CartProvider } from '@/components/cart/CartProvider'
import { Footer } from '@/components/layout/Footer'
import { Header } from '@/components/layout/Header'
import { UnavailableNotice } from '@/components/layout/UnavailableNotice'
import { themeBootScript } from '@/components/layout/theme-boot'
import { WhatsAppFloat } from '@/components/layout/WhatsAppFloat'
import { fontVariables } from '@/lib/fonts'
import { getSiteSettings } from '@/lib/site-settings'
import '../globals.css'

export const metadata: Metadata = {
  title: 'قناد باشی عسل | شیرینی و کیک خانگی در اصفهان',
  description:
    'کیک و شیرینی خانگی، دست‌ساز و تازه — با مواد اولیه درجه‌یک، در اصفهان، بهارستان.',
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
