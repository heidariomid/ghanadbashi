import { cache } from 'react'

import { getPayloadClient } from '@/lib/payload'

/** Deduplicate site-settings reads across homepage server components. */
export const getSiteSettings = cache(async () => {
  const payload = await getPayloadClient()
  return payload.findGlobal({ slug: 'site-settings', depth: 1 })
})
