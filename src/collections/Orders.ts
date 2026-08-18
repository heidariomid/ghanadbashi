import type { CollectionConfig } from 'payload'
import { isAdmin, isPublic } from '@/lib/access'

/**
 * An order is a record of what a customer sent, not a document to edit. Every
 * field is read-only in the admin except `status`, so the client can work the
 * queue without accidentally rewriting what someone asked for.
 */
export const Orders: CollectionConfig = {
  slug: 'orders',
  labels: {
    singular: 'سفارش',
    plural: 'سفارش‌ها',
  },
  admin: {
    useAsTitle: 'customerName',
    description: 'سفارش‌هایی که مشتری‌ها از طریق فرم سایت ثبت کرده‌اند.',
    defaultColumns: ['customerName', 'phone', 'product', 'deliveryDate', 'status'],
  },
  access: {
    // The public order form must be able to write, and nothing else.
    create: isPublic,
    read: isAdmin,
    update: isAdmin,
    delete: isAdmin,
  },
  defaultSort: '-createdAt',
  fields: [
    {
      name: 'status',
      type: 'select',
      label: 'وضعیت',
      defaultValue: 'new',
      required: true,
      index: true,
      options: [
        { value: 'new', label: '🆕 جدید' },
        { value: 'confirmed', label: '✅ تأیید شده' },
        { value: 'delivered', label: '📦 تحویل شده' },
        { value: 'cancelled', label: '❌ لغو شده' },
      ],
      admin: {
        description: 'تنها فیلدی که شما تغییر می‌دهید.',
        position: 'sidebar',
      },
    },
    {
      name: 'customerName',
      type: 'text',
      label: 'نام مشتری',
      required: true,
      admin: { readOnly: true },
    },
    {
      name: 'phone',
      type: 'text',
      label: 'شماره تماس',
      required: true,
      admin: { readOnly: true },
    },
    {
      name: 'product',
      type: 'relationship',
      relationTo: 'products',
      label: 'محصول',
      admin: { readOnly: true },
    },
    {
      name: 'productNote',
      type: 'text',
      label: 'محصول (متن آزاد)',
      admin: {
        description: 'اگر مشتری محصولی خارج از فهرست خواسته باشد، اینجا نوشته می‌شود.',
        readOnly: true,
      },
    },
    {
      name: 'quantity',
      type: 'number',
      label: 'تعداد',
      min: 1,
      admin: { readOnly: true },
    },
    {
      name: 'deliveryDate',
      type: 'text',
      label: 'تاریخ تحویل',
      admin: { readOnly: true },
    },
    {
      name: 'notes',
      type: 'textarea',
      label: 'توضیحات',
      admin: { readOnly: true },
    },
    {
      name: 'sampleImage',
      type: 'upload',
      relationTo: 'media',
      label: 'عکس نمونه',
      admin: {
        description: 'عکسی که مشتری به‌عنوان نمونه فرستاده است.',
        readOnly: true,
      },
    },
  ],
}
