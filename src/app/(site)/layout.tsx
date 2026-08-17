import type { Metadata } from 'next'
import { fontVariables } from '@/lib/fonts'
import '../globals.css'

export const metadata: Metadata = {
  title: 'قناد باشی عسل | شیرینی و کیک خانگی در اصفهان',
  description:
    'کیک و شیرینی خانگی، دست‌ساز و تازه — با مواد اولیه درجه‌یک، در اصفهان، بهارستان.',
}

export default function SiteLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="fa" dir="rtl" className={fontVariables}>
      <body>{children}</body>
    </html>
  )
}
