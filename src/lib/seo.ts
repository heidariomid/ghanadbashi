import type { Metadata } from 'next'

import { content } from '@/data/content'
import { resolveImage } from '@/lib/media'
import { queryPayload } from '@/lib/payload'
import { getSiteSettings } from '@/lib/site-settings'
import { siteOrigin } from '@/lib/site-url'

/** Where the sharing preview is served from. See `src/app/og/route.ts`. */
export const OG_IMAGE_PATH = '/og'
export const OG_IMAGE_WIDTH = 1200
export const OG_IMAGE_HEIGHT = 630

/** The homepage title, shared with the layout default so the two agree. */
export function homeTitle(brandName: string): string {
  return `${brandName} | ${content.brand.metaTagline}`
}

interface PageMetadataInput {
  /** Page title without the brand suffix; omit on the homepage. */
  title?: string
  description: string
  /** Route path, used for the canonical and `og:url`. */
  path: string
}

/**
 * Title, canonical, Open Graph and Twitter tags for one public page. Every
 * route builds its metadata here so a link shared to WhatsApp or Instagram
 * renders the same way wherever it points.
 */
export async function buildPageMetadata({
  title,
  description,
  path,
}: PageMetadataInput): Promise<Metadata> {
  const settings = await getSiteSettings()
  const brandName = settings?.brand?.brandName?.trim() || content.brand.name
  const fullTitle = title
    ? `${title} | ${brandName}`
    : homeTitle(brandName)

  const image = await resolveOgImage()

  return {
    title: title ?? { absolute: fullTitle },
    description,
    alternates: { canonical: path },
    openGraph: {
      type: 'website',
      locale: 'fa_IR',
      siteName: brandName,
      url: path,
      title: fullTitle,
      description,
      images: image
        ? [
            {
              url: OG_IMAGE_PATH,
              width: OG_IMAGE_WIDTH,
              height: OG_IMAGE_HEIGHT,
              alt: image.alt || brandName,
            },
          ]
        : undefined,
    },
    twitter: {
      card: image ? 'summary_large_image' : 'summary',
      title: fullTitle,
      description,
      images: image ? [OG_IMAGE_PATH] : undefined,
    },
  }
}

/**
 * The photo behind the sharing preview: the hero she set in site settings,
 * or the first product photo if she has cleared it. Returns null when the CMS
 * has neither, so the pages omit `og:image` rather than advertising a 404.
 */
export async function resolveOgImage() {
  const settings = await getSiteSettings()
  const hero = resolveImage(settings?.brand?.heroImage)
  if (hero) return hero

  const result = await queryPayload((payload) =>
    payload.find({ collection: 'products', sort: 'sortOrder', limit: 1, depth: 1 }),
  )
  return resolveImage(result?.docs[0]?.image)
}

/** Absolute URL for a path, for the sitemap and JSON-LD. */
export function absoluteUrl(path: string): string {
  return new URL(path, siteOrigin()).toString()
}
