import config from '@payload-config'
import { getPayload } from 'payload'

/**
 * The Local API queries Postgres in-process. Server components use this; never
 * the REST or GraphQL endpoints.
 */
export function getPayloadClient() {
  return getPayload({ config })
}
