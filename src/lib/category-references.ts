import type { Payload } from 'payload'

type CategoryReference = {
  label: string
}

export async function getCategoryReferences(
  payload: Payload,
  categoryId: number | string,
): Promise<CategoryReference[]> {
  const references: CategoryReference[] = []

  const [products, gallery] = await Promise.all([
    payload.find({
      collection: 'products',
      where: { category: { equals: categoryId } },
      limit: 1,
      depth: 0,
    }),
    payload.find({
      collection: 'gallery',
      where: { category: { equals: categoryId } },
      limit: 1,
      depth: 0,
    }),
  ])

  if (products.totalDocs > 0) {
    references.push({ label: 'محصولات' })
  }

  if (gallery.totalDocs > 0) {
    references.push({ label: 'نمونه کارها' })
  }

  return references
}

export function formatCategoryInUseMessage(references: CategoryReference[]): string {
  const places = references.map((ref) => ref.label).join(' و ')
  return `این دسته‌بندی هنوز در ${places} استفاده می‌شود. اول آن‌ها را به دسته دیگری منتقل کنید، بعد می‌توانید این دسته را حذف کنید.`
}
