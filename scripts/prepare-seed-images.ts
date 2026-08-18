/**
 * Normalises the client's original photos into `seed/images`.
 *
 * The originals are 3 MB PNGs straight off a phone and a laptop, with names
 * like `file_00000000eacc8210b73441242de1c6d3.png`. This rewrites them as
 * capped-width WebP under the manifest's readable names, so the folder can be
 * committed and the seed reproduced on any machine.
 *
 *   pnpm seed:images ~/Downloads/images
 */
import { mkdir, readdir, writeFile } from 'node:fs/promises'
import path from 'node:path'
import sharp from 'sharp'
import { SEED_PHOTOS } from '../seed/manifest'

const MAX_WIDTH = 1600
const QUALITY = 80
const OUT_DIR = path.resolve(process.cwd(), 'seed/images')

async function main() {
  const sourceDir = process.argv[2] ?? process.env.SEED_SOURCE_DIR
  if (!sourceDir) {
    throw new Error('Pass the folder holding the original photos: pnpm seed:images <dir>')
  }

  const resolved = path.resolve(sourceDir.replace(/^~/, process.env.HOME ?? '~'))
  const available = new Set(await readdir(resolved))
  const missing = SEED_PHOTOS.filter((p) => !available.has(p.source))

  if (missing.length > 0) {
    throw new Error(
      `${missing.length} source file(s) not found in ${resolved}:\n` +
        missing.map((p) => `  ${p.source}`).join('\n'),
    )
  }

  await mkdir(OUT_DIR, { recursive: true })

  let totalBytes = 0
  for (const photo of SEED_PHOTOS) {
    const buffer = await sharp(path.join(resolved, photo.source))
      .rotate()
      .resize({ width: MAX_WIDTH, withoutEnlargement: true })
      .webp({ quality: QUALITY })
      .toBuffer()

    await writeFile(path.join(OUT_DIR, `${photo.file}.webp`), buffer)
    totalBytes += buffer.byteLength
    console.log(`  ${photo.file}.webp  ${(buffer.byteLength / 1024).toFixed(0)} KB`)
  }

  console.log(
    `\n${SEED_PHOTOS.length} images written to seed/images (${(totalBytes / 1024 / 1024).toFixed(1)} MB total)`,
  )
}

await main()
