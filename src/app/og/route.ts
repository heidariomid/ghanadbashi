import sharp from 'sharp'

import { OG_IMAGE_HEIGHT, OG_IMAGE_WIDTH, resolveOgImage } from '@/lib/seo'
import { siteOrigin } from '@/lib/site-url'

// Reads the CMS on every request; Vercel's CDN holds the result. Prerendering
// this at build time would fetch a media URL from an origin that is not
// serving yet.
export const dynamic = 'force-dynamic'

/**
 * The sharing preview, rendered from the hero photo she uploaded.
 *
 * Uploads are stored as portrait WebP, and neither travels well: WhatsApp —
 * her main sales channel — is unreliable with WebP, and a 4:5 photo gets
 * cropped to nonsense in a 1.91:1 preview card. So the photo is re-cut to
 * 1200×630 JPEG here rather than linked directly.
 */
export async function GET() {
  const image = await resolveOgImage()
  if (!image) {
    return new Response('No image', { status: 404 })
  }

  const source = image.src.startsWith('http')
    ? image.src
    : new URL(image.src, siteOrigin()).toString()

  try {
    const response = await fetch(source)
    if (!response.ok) {
      return new Response('No image', { status: 404 })
    }

    const jpeg = await sharp(Buffer.from(await response.arrayBuffer()))
      .resize(OG_IMAGE_WIDTH, OG_IMAGE_HEIGHT, { fit: 'cover', position: 'centre' })
      .jpeg({ quality: 82 })
      .toBuffer()

    return new Response(new Uint8Array(jpeg), {
      headers: {
        'Content-Type': 'image/jpeg',
        'Cache-Control': 'public, max-age=0, s-maxage=3600, stale-while-revalidate=86400',
      },
    })
  } catch (error) {
    console.error('Open Graph image failed', error)
    return new Response('No image', { status: 404 })
  }
}
