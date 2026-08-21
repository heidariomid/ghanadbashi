import { content } from '@/data/content'
import { cleanContactValue, instagramHref, phoneHref } from '@/lib/contact'
import { absoluteUrl, OG_IMAGE_PATH, resolveOgImage } from '@/lib/seo'
import { getSiteSettings } from '@/lib/site-settings'

/**
 * Structured data for the bakery itself. Every field comes from site settings,
 * so what search engines read is what she typed in the admin.
 */
export async function LocalBusinessJsonLd() {
  const settings = await getSiteSettings()
  const brandName = settings?.brand?.brandName?.trim() || content.brand.name
  const phone = cleanContactValue(settings?.contact?.phone)
  const instagram = cleanContactValue(settings?.contact?.instagram)
  const serviceArea = cleanContactValue(settings?.contact?.serviceArea)
  const instagramUrl = instagram ? instagramHref(instagram) : null
  const image = await resolveOgImage()

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Bakery',
    name: brandName,
    description: settings?.brand?.tagline?.trim() || content.brand.metaDescription,
    url: absoluteUrl('/'),
    ...(image ? { image: absoluteUrl(OG_IMAGE_PATH) } : {}),
    ...(phone ? { telephone: phoneHref(phone)?.replace('tel:', '') } : {}),
    ...(serviceArea ? { areaServed: serviceArea } : {}),
    ...(instagramUrl ? { sameAs: [instagramUrl] } : {}),
  }

  return (
    <script
      type="application/ld+json"
      // Serialised from CMS text, not from anything a visitor can supply.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  )
}
