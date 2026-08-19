import { cache } from 'react'

import { queryPayload } from '@/lib/payload'
import type { SiteSetting } from '@/payload-types'

/** Deduplicate site-settings reads across homepage server components. */
export const getSiteSettings = cache(async (): Promise<SiteSetting | null> => {
  return queryPayload((payload) => payload.findGlobal({ slug: 'site-settings', depth: 1 }))
})
