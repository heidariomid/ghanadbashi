import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { postgresAdapter } from '@payloadcms/db-postgres'
import { fa } from '@payloadcms/translations/languages/fa'
import { buildConfig } from 'payload'
import type { CollectionConfig } from 'payload'
import { Media } from './collections/Media'
import { Users } from './collections/Users'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)
const collections: CollectionConfig[] = [Users, Media]

// Vercel always sets VERCEL_PROJECT_PRODUCTION_URL, preferring the production
// custom domain over the .vercel.app one, so pointing the site at a real domain
// in phase 7 needs no change here. Local dev falls through to localhost.
const serverURL =
  process.env.NEXT_PUBLIC_SERVER_URL ||
  (process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : 'http://localhost:3000')

const secret = process.env.PAYLOAD_SECRET

// Payload signs admin session cookies with this. A fallback value would let a
// misconfigured deploy boot with a publicly known signing key.
if (!secret) {
  throw new Error(
    'PAYLOAD_SECRET is not set. Copy .env.example to .env and generate one with: openssl rand -base64 48',
  )
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
      connectionString: process.env.DATABASE_URI || '',
    },
  }),
  i18n: {
    fallbackLanguage: 'fa',
    supportedLanguages: {
      fa,
    },
  },
  secret,
  serverURL,
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
})
