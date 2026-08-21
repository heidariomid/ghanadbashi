import localFont from 'next/font/local'

// next/font requires literal arguments, so these lists cannot be generated.
const vazirmatnArabic = localFont({
  src: [
    { path: '../fonts/vazirmatn-arabic-300-normal.woff2', weight: '300', style: 'normal' },
    { path: '../fonts/vazirmatn-arabic-400-normal.woff2', weight: '400', style: 'normal' },
    { path: '../fonts/vazirmatn-arabic-500-normal.woff2', weight: '500', style: 'normal' },
    { path: '../fonts/vazirmatn-arabic-600-normal.woff2', weight: '600', style: 'normal' },
    { path: '../fonts/vazirmatn-arabic-700-normal.woff2', weight: '700', style: 'normal' },
    { path: '../fonts/vazirmatn-arabic-900-normal.woff2', weight: '900', style: 'normal' },
  ],
  variable: '--font-vazirmatn-arabic',
  display: 'swap',
})

const vazirmatnLatin = localFont({
  src: [
    { path: '../fonts/vazirmatn-latin-300-normal.woff2', weight: '300', style: 'normal' },
    { path: '../fonts/vazirmatn-latin-400-normal.woff2', weight: '400', style: 'normal' },
    { path: '../fonts/vazirmatn-latin-500-normal.woff2', weight: '500', style: 'normal' },
    { path: '../fonts/vazirmatn-latin-600-normal.woff2', weight: '600', style: 'normal' },
    { path: '../fonts/vazirmatn-latin-700-normal.woff2', weight: '700', style: 'normal' },
    { path: '../fonts/vazirmatn-latin-900-normal.woff2', weight: '900', style: 'normal' },
  ],
  variable: '--font-vazirmatn-latin',
  display: 'swap',
  // Not preloaded: the page is Persian, and this subset only covers the Latin
  // wordmark and digits. Preloading it put ~95KB in front of the hero image.
  preload: false,
})

/** Applied to <html> by both the site and the admin layout. */
export const fontVariables = `${vazirmatnArabic.variable} ${vazirmatnLatin.variable}`
