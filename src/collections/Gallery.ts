import type { CollectionConfig } from 'payload'
import { isAdmin, isPublic } from '@/lib/access'
import { categoryOptions } from '@/lib/categories'
import { revalidatePublicSite } from '@/lib/revalidate'

export const Gallery: CollectionConfig = {
  slug: 'gallery',
  labels: {
    singular: 'عکس نمونه کار',
    plural: 'نمونه کارها',
  },
  admin: {
    useAsTitle: 'caption',
    description:
      'عکس‌های نمونه کار که در بخش «نمونه کارها» سایت نمایش داده می‌شوند. برای حذف یک عکس از سایت، از همین لیست «حذف» بزنید — نه از دکمه حذف روی خود عکس.',
    defaultColumns: ['image', 'caption', 'category', 'isAvailable', 'sortOrder'],
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
  },
  fields: [
    {
      name: 'image',
      type: 'upload',
      relationTo: 'media',
      label: 'عکس',
      required: true,
      admin: {
        description:
          'برای عوض کردن عکس، عکس جدید انتخاب کنید. برای حذف از سایت، کل این «نمونه کار» را از لیست نمونه کارها حذف کنید.',
      },
    },
    {
      name: 'category',
      type: 'select',
      label: 'دسته‌بندی',
      required: true,
      index: true,
      options: categoryOptions,
      admin: {
        description:
          'دکمه‌های فیلتر بالای گالری از روی همین دسته‌بندی ساخته می‌شوند. دسته‌ای که عکسی نداشته باشد در سایت نمایش داده نمی‌شود.',
      },
    },
    {
      name: 'caption',
      type: 'text',
      label: 'توضیح',
      admin: {
        description: 'اختیاری. زیر عکس نمایش داده می‌شود.',
      },
    },
    {
      name: 'isAvailable',
      type: 'checkbox',
      label: 'موجود است',
      defaultValue: true,
      admin: {
        description: 'اگر تیک را بردارید، دکمه افزودن به سبد روی این نمونه کار نمایش داده نمی‌شود.',
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
