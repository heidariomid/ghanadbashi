import type { CollectionConfig } from 'payload'
import { APIError } from 'payload'
import { isAdmin, isPublic } from '@/lib/access'
import { formatCategoryInUseMessage, getCategoryReferences } from '@/lib/category-references'
import { revalidatePublicSite } from '@/lib/revalidate'
import { slugify } from '@/lib/slug'

export const Categories: CollectionConfig = {
  slug: 'categories',
  labels: {
    singular: 'دسته‌بندی',
    plural: 'دسته‌بندی‌ها',
  },
  admin: {
    useAsTitle: 'title',
    description:
      'دسته‌هایی که در محصولات، گالری و صفحه اصلی دیده می‌شوند. برای حذف یک دسته، اول محصولات و نمونه کارهای آن را به دسته دیگری ببرید.',
    defaultColumns: ['emoji', 'title', 'slug', 'sortOrder'],
    listSearchableFields: ['title'],
  },
  access: {
    create: isAdmin,
    read: isPublic,
    update: isAdmin,
    delete: isAdmin,
  },
  defaultSort: 'sortOrder',
  hooks: {
    afterChange: [() => revalidatePublicSite()],
    afterDelete: [() => revalidatePublicSite()],
    beforeDelete: [
      async ({ id, req }) => {
        const references = await getCategoryReferences(req.payload, id)
        if (references.length > 0) {
          throw new APIError(formatCategoryInUseMessage(references), 400)
        }
      },
    ],
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      label: 'نام دسته‌بندی',
      required: true,
    },
    {
      name: 'slug',
      type: 'text',
      label: 'آدرس صفحه',
      unique: true,
      index: true,
      admin: {
        description: 'خودکار از روی نام ساخته می‌شود. لینک فیلتر سایت از روی همین مقدار است.',
        position: 'sidebar',
      },
      hooks: {
        beforeValidate: [
          ({ value, data }) => {
            const source = typeof value === 'string' && value.length > 0 ? value : data?.title
            return typeof source === 'string' ? slugify(source) : value
          },
        ],
      },
    },
    {
      name: 'emoji',
      type: 'text',
      label: 'ایموجی',
      maxLength: 8,
      admin: {
        description:
          'اگر این دسته هنوز عکسی نداشته باشد، همین ایموجی روی کارت صفحه اصلی دیده می‌شود.',
      },
    },
    {
      name: 'sortOrder',
      type: 'number',
      label: 'ترتیب نمایش',
      defaultValue: 0,
      admin: {
        description: 'عدد کوچک‌تر جلوتر نمایش داده می‌شود.',
        position: 'sidebar',
      },
    },
  ],
}
