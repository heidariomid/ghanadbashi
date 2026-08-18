import type { CollectionConfig } from 'payload'
import { isAdmin, isPublic } from '@/lib/access'
import { categoryOptions } from '@/lib/categories'
import { slugify } from '@/lib/slug'

export const Products: CollectionConfig = {
  slug: 'products',
  labels: {
    singular: 'محصول',
    plural: 'محصولات',
  },
  admin: {
    useAsTitle: 'title',
    description: 'محصولاتی که در سایت نمایش داده می‌شوند.',
    defaultColumns: ['image', 'title', 'category', 'price', 'isAvailable'],
    listSearchableFields: ['title'],
  },
  access: {
    create: isAdmin,
    read: isPublic,
    update: isAdmin,
    delete: isAdmin,
  },
  defaultSort: 'sortOrder',
  fields: [
    {
      name: 'title',
      type: 'text',
      label: 'نام محصول',
      required: true,
    },
    {
      name: 'slug',
      type: 'text',
      label: 'آدرس صفحه',
      unique: true,
      index: true,
      admin: {
        description: 'خودکار از روی نام محصول ساخته می‌شود. اگر لازم بود می‌توانید تغییرش دهید.',
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
      name: 'category',
      type: 'select',
      label: 'دسته‌بندی',
      required: true,
      index: true,
      options: categoryOptions,
    },
    {
      name: 'image',
      type: 'upload',
      relationTo: 'media',
      label: 'عکس محصول',
      required: true,
      admin: {
        description: 'یک عکس واضح از خود محصول. بدون عکس، محصول در سایت جذاب دیده نمی‌شود.',
      },
    },
    {
      name: 'description',
      type: 'textarea',
      label: 'توضیح کوتاه',
      maxLength: 200,
      admin: {
        description: 'یک یا دو جمله درباره طعم و مواد اولیه. حداکثر ۲۰۰ حرف.',
      },
    },
    {
      name: 'priceOnRequest',
      type: 'checkbox',
      label: 'استعلام قیمت',
      defaultValue: true,
      admin: {
        description: 'اگر تیک بخورد، به‌جای قیمت عبارت «استعلام قیمت» نمایش داده می‌شود.',
      },
    },
    {
      name: 'price',
      type: 'number',
      label: 'قیمت (تومان)',
      min: 0,
      admin: {
        description: 'فقط عدد، بدون نقطه یا ویرگول.',
        condition: (_, siblingData) => !siblingData?.priceOnRequest,
      },
    },
    {
      name: 'isAvailable',
      type: 'checkbox',
      label: 'موجود است',
      defaultValue: true,
      admin: {
        description: 'اگر تیک را بردارید، در سایت «فعلاً موجود نیست» نمایش داده می‌شود.',
      },
    },
    {
      name: 'isFeatured',
      type: 'checkbox',
      label: 'نمایش در صفحه اصلی',
      defaultValue: false,
      admin: {
        description: 'محصولات انتخاب‌شده در بخش «محصولات منتخب» صفحه اصلی نمایش داده می‌شوند.',
      },
    },
    {
      name: 'sortOrder',
      type: 'number',
      label: 'ترتیب نمایش',
      defaultValue: 0,
      admin: {
        description: 'عدد کوچک‌تر بالاتر نمایش داده می‌شود.',
        position: 'sidebar',
      },
    },
  ],
}
