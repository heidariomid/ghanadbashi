import { normalizePhone } from '@/lib/phone-verification'
import { getPayloadClient } from '@/lib/payload'

/** Baker alert number — CMS first, then ORDER_NOTIFICATION_PHONE. */
export async function resolveBakerNotificationPhone(): Promise<string | null> {
  try {
    const payload = await getPayloadClient()
    const settings = await payload.findGlobal({
      slug: 'site-settings',
      depth: 0,
      overrideAccess: true,
    })
    const fromCms = normalizePhone(settings.contact?.orderNotificationPhone ?? '')
    if (fromCms) return fromCms
  } catch (error) {
    console.error('Could not read orderNotificationPhone', error)
  }
  return normalizePhone(process.env.ORDER_NOTIFICATION_PHONE ?? '')
}
