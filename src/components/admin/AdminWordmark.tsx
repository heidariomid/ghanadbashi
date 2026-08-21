import { content } from '@/data/content'
import { queryPayload } from '@/lib/payload'

import { AdminIcon } from './AdminIcon'

/** Sidebar and login wordmark. Name comes from site settings when available. */
export async function AdminWordmark() {
  const settings = await queryPayload((payload) =>
    payload.findGlobal({ slug: 'site-settings', depth: 0 }),
  )
  const name = settings?.brand?.brandName?.trim() || content.brand.name

  return (
    <div className="admin-wordmark">
      <AdminIcon />
      <div className="admin-wordmark__text">
        <span className="admin-wordmark__name">{name}</span>
        <span className="admin-wordmark__latin">{content.brand.latinName}</span>
      </div>
    </div>
  )
}
