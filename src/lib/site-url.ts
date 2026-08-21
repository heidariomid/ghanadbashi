/**
 * The public origin. `payload.config.ts` deliberately leaves `serverURL` unset
 * so upload URLs stay relative, which means anything needing an absolute URL —
 * metadata, the sitemap, links inside emails — resolves the origin here.
 */
export function resolveOrigin(): string | null {
  const explicit = process.env.NEXT_PUBLIC_SERVER_URL?.replace(/\/$/, '')
  if (explicit) return explicit

  const vercel = process.env.VERCEL_PROJECT_PRODUCTION_URL
  return vercel ? `https://${vercel}` : null
}

/**
 * Same, but with a localhost fallback. Next throws at build time if a relative
 * metadata URL has no `metadataBase`, so metadata cannot accept `null`.
 */
export function siteOrigin(): string {
  return resolveOrigin() ?? 'http://localhost:3000'
}
