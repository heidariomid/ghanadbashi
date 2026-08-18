import { existsSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { postgresAdapter } from '@payloadcms/db-postgres'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { vercelBlobStorage } from '@payloadcms/storage-vercel-blob'
import { fa } from '@payloadcms/translations/languages/fa'
import { buildConfig } from 'payload'
import sharp from 'sharp'
import type { CollectionConfig, GlobalConfig, Plugin } from 'payload'
import { Gallery } from './collections/Gallery'
import { Media } from './collections/Media'
import { Orders } from './collections/Orders'
import { Products } from './collections/Products'
import { Users } from './collections/Users'
import { SiteSettings } from './globals/SiteSettings'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

// `vercel env pull` writes BLOB_READ_WRITE_TOKEN to .env.local. Next reads that
// file, but the Payload CLI evaluates this config before a script it runs can
// load anything, so `pnpm seed` would start with no token and silently write
// uploads to local disk. Resolved from this file rather than the working
// directory, which is not the project root under every CLI entry point. On
// Vercel the file is absent and the platform supplies the variable.
const localEnv = path.resolve(dirname, '../.env.local')
if (!process.env.BLOB_READ_WRITE_TOKEN && existsSync(localEnv)) {
  process.loadEnvFile(localEnv)
}
const collections: CollectionConfig[] = [Products, Gallery, Orders, Media, Users]
const globals: GlobalConfig[] = [SiteSettings]

// Vercel's filesystem is read-only, so uploads must go to Blob in production.
// Locally the token is absent and Payload falls back to `staticDir`, which
// keeps `pnpm dev` working without anyone provisioning a store first.
const blobToken = process.env.BLOB_READ_WRITE_TOKEN
const plugins: Plugin[] = blobToken
  ? [
      vercelBlobStorage({
        collections: { [Media.slug]: true },
        token: blobToken,
      }),
    ]
  : []

const secret = process.env.PAYLOAD_SECRET

// Payload signs admin session cookies with this. A fallback value would let a
// misconfigured deploy boot with a publicly known signing key.
if (!secret) {
  throw new Error(
    'PAYLOAD_SECRET is not set. Copy .env.example to .env and generate one with: openssl rand -base64 48',
  )
}

const databaseURI = process.env.DATABASE_URI

// An empty connection string fails later, deep inside the pool, with an error
// that says nothing about the missing variable.
if (!databaseURI) {
  throw new Error('DATABASE_URI is not set. Copy .env.example to .env and add your Neon connection string.')
}

export default buildConfig({
  admin: {
    user: Users.slug,
    meta: {
      title: 'قناد باشی عسل',
    },
    // Payload renders dir="RTL" while the browser normalises it to lowercase,
    // which trips React's hydration check on every admin page load.
    suppressHydrationWarning: true,
  },
  collections,
  db: postgresAdapter({
    pool: {
      connectionString: databaseURI,
    },
  }),
  editor: lexicalEditor(),
  globals,
  plugins,
  i18n: {
    fallbackLanguage: 'fa',
    supportedLanguages: {
      fa,
    },
  },
  secret,
  // `serverURL` is deliberately unset. Payload prefixes upload URLs with it,
  // and an absolute URL to our own origin is one `next/image` refuses to load
  // unless the exact host is whitelisted — which breaks on every preview
  // deployment. Leaving it off yields relative URLs that work on any host.
  // Required for the Media collection's image sizes; Payload silently skips
  // resizing if it is missing.
  sharp,
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
})
