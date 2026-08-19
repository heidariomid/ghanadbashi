import config from '@payload-config'
import { getPayload, type Payload } from 'payload'

import { isDatabaseUnreachable } from '@/lib/db'

/**
 * The Local API queries Postgres in-process. Server components use this; never
 * the REST or GraphQL endpoints.
 */
export function getPayloadClient() {
  return getPayload({ config })
}

/**
 * Run a Local API call. Connection failures (VPN off, Neon unreachable)
 * return `null` so the public site can render a Persian notice instead of a
 * raw SQL error.
 */
export async function queryPayload<T>(fn: (payload: Payload) => Promise<T>): Promise<T | null> {
  try {
    const payload = await getPayload({ config })
    return await fn(payload)
  } catch (error) {
    if (isDatabaseUnreachable(error)) {
      console.error('Database unreachable')
      return null
    }
    throw error
  }
}
