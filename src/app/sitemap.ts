import type { MetadataRoute } from 'next'

import { absoluteUrl } from '@/lib/seo'

/**
 * The four public routes, listed by hand. There is no `/products/[slug]`, so
 * there is nothing here to generate from the CMS.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: absoluteUrl('/'), changeFrequency: 'weekly', priority: 1 },
    { url: absoluteUrl('/products'), changeFrequency: 'weekly', priority: 0.9 },
    { url: absoluteUrl('/gallery'), changeFrequency: 'weekly', priority: 0.7 },
    { url: absoluteUrl('/order'), changeFrequency: 'monthly', priority: 0.6 },
  ]
}
