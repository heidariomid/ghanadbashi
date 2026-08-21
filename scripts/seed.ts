/**
 * Loads the client's photos into Payload as media, gallery entries and a
 * starting set of products, then fills in site settings.
 *
 * Safe to re-run: every record is matched on a stable key and updated in place,
 * so nothing the client has added alongside the seed is removed. Everything it
 * writes is ordinary content she can edit or delete from the admin.
 *
 *   pnpm seed
 */

import path from 'node:path'
import { getPayload } from 'payload'
import type { Payload, RequiredDataFromCollectionSlug } from 'payload'
import config from '@payload-config'
import {
  ABOUT_PHOTO,
  HERO_PHOTO,
  SEED_PHOTOS,
  SEED_PRODUCTS,
  type SeedPhoto,
} from '../seed/manifest'

const IMAGES_DIR = path.resolve(process.cwd(), 'seed/images')

/**
 * Re-uploading an existing record regenerates its resized versions, which is
 * what repairs media that was created while `sharp` was missing from the config.
 */
async function upsertMedia(payload: Payload, photo: SeedPhoto): Promise<number> {
  const filePath = path.join(IMAGES_DIR, `${photo.file}.webp`)
  // Matched on `alt`, not `filename`: Payload appends -1, -2 … when a name is
  // already taken, so the filename drifts on every re-upload and a filename
  // lookup would create a duplicate row each run.
  const existing = await payload.find({
    collection: 'media',
    where: { alt: { equals: photo.title } },
    limit: 1,
  })

  const data = { alt: photo.title }
  const doc = existing.docs[0]
    ? await payload.update({ collection: 'media', id: existing.docs[0].id, data, filePath })
    : await payload.create({ collection: 'media', data, filePath })

  return doc.id as number
}

/** Matched on `title`, so re-running edits the same row instead of adding one. */
async function upsertProduct(payload: Payload, data: RequiredDataFromCollectionSlug<'products'>) {
  const existing = await payload.find({
    collection: 'products',
    where: { title: { equals: data.title } },
    limit: 1,
  })

  if (existing.docs[0]) {
    await payload.update({ collection: 'products', id: existing.docs[0].id, data })
  } else {
    await payload.create({ collection: 'products', data })
  }
}

async function main() {
  // Without the token Payload falls back to the local `media/` folder, which
  // does not exist on Vercel. That failure is silent — the rows land in the
  // shared database and every image 404s in production — so refuse instead.
  if (!process.env.BLOB_READ_WRITE_TOKEN && process.env.ALLOW_LOCAL_STORAGE !== '1') {
    throw new Error(
      'BLOB_READ_WRITE_TOKEN is not set, so uploads would go to local disk and break in production.\n' +
        'Copy it from .env.local into .env, or re-run with ALLOW_LOCAL_STORAGE=1 to seed locally on purpose.',
    )
  }

  const payload = await getPayload({ config })
  const mediaIds = new Map<string, number>()

  for (const photo of SEED_PHOTOS) {
    mediaIds.set(photo.file, await upsertMedia(payload, photo))
    payload.logger.info(`media: ${photo.file}`)
  }

  // Gallery order follows the manifest, which is grouped by category, so the
  // grid reads as groups rather than a shuffle before she reorders anything.
  for (const [index, photo] of SEED_PHOTOS.entries()) {
    const data = {
      image: mediaIds.get(photo.file)!,
      category: photo.category,
      caption: photo.title,
      sortOrder: index,
    }

    const existing = await payload.find({
      collection: 'gallery',
      where: { caption: { equals: photo.title } },
      limit: 1,
    })

    if (existing.docs[0]) {
      await payload.update({ collection: 'gallery', id: existing.docs[0].id, data })
    } else {
      await payload.create({ collection: 'gallery', data })
    }
  }
  payload.logger.info(`gallery: ${SEED_PHOTOS.length} entries`)

  // Products start as price-on-request across the board — the client asked for
  // no prices on the site for now, and she can switch any of them over later.
  const featured = SEED_PHOTOS.filter((photo) => photo.featured)
  for (const [index, photo] of featured.entries()) {
    await upsertProduct(payload, {
      title: photo.title,
      category: photo.category,
      image: mediaIds.get(photo.file)!,
      priceOnRequest: true,
      isAvailable: true,
      isFeatured: true,
      sortOrder: index,
    })
  }
  payload.logger.info(`products: ${featured.length} featured`)

  // Left off the homepage on purpose: these exist so no category reads as
  // empty, not because they are her best work.
  for (const [index, product] of SEED_PRODUCTS.entries()) {
    await upsertProduct(payload, {
      title: product.title,
      category: product.category,
      image: mediaIds.get(product.photo)!,
      description: product.description,
      priceOnRequest: true,
      isAvailable: true,
      isFeatured: false,
      sortOrder: featured.length + index,
    })
  }
  payload.logger.info(`products: ${SEED_PRODUCTS.length} category fillers`)

  await payload.updateGlobal({
    slug: 'site-settings',
    data: {
      brand: {
        brandName: 'قناد باشی عسل',
        tagline: 'طعم خانگی، با عشق و کیفیت',
        heroImage: mediaIds.get(HERO_PHOTO)!,
        aboutImage: mediaIds.get(ABOUT_PHOTO)!,
      },
      contact: {
        phone: '09369088311',
        whatsapp: '989369088311',
        instagram: 'ghanad_bashi_asal5',
        serviceArea: 'اصفهان، بهارستان و حومه',
      },
    },
  })
  payload.logger.info('site settings updated')
  payload.logger.info('Seed complete.')
}

await main()
process.exit(0)
