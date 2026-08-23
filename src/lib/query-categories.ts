import type { CategoryChip } from '@/lib/categories'
import { queryPayload } from '@/lib/payload'

export async function queryCategories(): Promise<CategoryChip[]> {
  const result = await queryPayload((payload) =>
    payload.find({
      collection: 'categories',
      sort: 'sortOrder',
      limit: 100,
      depth: 0,
    }),
  )

  return (result?.docs ?? []).map((doc) => ({
    slug: doc.slug || String(doc.id),
    title: doc.title,
    emoji: doc.emoji || '',
  }))
}
