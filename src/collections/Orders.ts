import type { CollectionConfig } from 'payload'
import { isAdmin } from '@/lib/access'
import { publicOrderNumber } from '@/lib/order-number'
import { expandOrderSearch } from '@/lib/order-search'
import { formatOrderSummary } from '@/lib/order-summary'
import { notifyStatusSms } from '@/lib/order-status-sms'
import { preserveSubmittedOrder } from '@/lib/preserve-order'

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
    defaultColumns: ['orderNumber', 'customerName', 'orderSummary', 'deliveryDate', 'status'],
    listSearchableFields: ['orderNumber', 'customerName', 'phone'],
  },
  disableBulkEdit: true,
  hooks: {
    beforeOperation: [expandOrderSearch],
    beforeChange: [preserveSubmittedOrder],
    afterChange: [notifyStatusSms],
  },
  access: {
    // REST create is admin-only. The public form writes through the Local API.
    create: isAdmin,
    read: isAdmin,
    update: isAdmin,
    delete: isAdmin,
  },
  defaultSort: '-createdAt',
  fields: [
    {
      name: 'orderNumber',
      type: 'text',
      label: 'شماره سفارش',
      virtual: true,
      admin: {
        readOnly: true,
        position: 'sidebar',
        description: 'همان شماره‌ای که در پیامک سفارش آمده است.',
        components: {
          Cell: '/src/components/admin/OrderNumberCell#OrderNumberCell',
          Field: '/src/components/admin/OrderNumberField#OrderNumberField',
        },
      },
      hooks: {
        afterRead: [
          ({ siblingData }) =>
            siblingData?.id != null ? String(publicOrderNumber(Number(siblingData.id))) : undefined,
        ],
      },
    },
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
        description: 'تنها فیلدی که شما تغییر می‌دهید. از همین لیست هم عوض می‌شود.',
        position: 'sidebar',
        components: {
          Cell: '/src/components/admin/OrderStatusCell#OrderStatusCell',
        },
      },
    },
    {
      name: 'depositAmount',
      type: 'number',
      label: 'مبلغ واریز',
      min: 1,
      admin: {
        hidden: true,
        disableListColumn: true,
      },
    },
    {
      name: 'lastDepositSms',
      type: 'group',
      label: 'آخرین پیامک واریز',
      admin: {
        hidden: true,
        disableListColumn: true,
      },
      fields: [
        {
          name: 'sentAt',
          type: 'date',
          label: 'زمان',
          admin: { readOnly: true },
        },
        {
          name: 'ok',
          type: 'checkbox',
          label: 'ارسال شد',
          admin: { readOnly: true },
        },
        {
          name: 'note',
          type: 'text',
          label: 'نتیجه',
          admin: { readOnly: true },
        },
        {
          name: 'messageId',
          type: 'text',
          label: 'شناسه پیامک',
          admin: { readOnly: true },
        },
      ],
    },
    {
      name: 'depositReceiptToken',
      type: 'text',
      label: 'کد لینک رسید',
      index: true,
      unique: true,
      admin: {
        hidden: true,
        disableListColumn: true,
      },
    },
    {
      name: 'depositReceipt',
      type: 'upload',
      relationTo: 'media',
      label: 'رسید بیعانه',
      admin: {
        hidden: true,
        disableListColumn: true,
        description: 'عکس رسید واریزی که مشتری از لینک پیامک فرستاده است.',
      },
    },
    {
      name: 'depositReceiptAt',
      type: 'date',
      label: 'زمان دریافت رسید',
      admin: {
        hidden: true,
        disableListColumn: true,
      },
    },
    {
      name: 'lastCustomerSms',
      type: 'group',
      label: 'آخرین پیامک به مشتری',
      admin: {
        position: 'sidebar',
        description: 'نتیجه آخرین پیامکی که با تغییر وضعیت برای مشتری فرستاده شد.',
        condition: (data) =>
          Boolean(data.lastCustomerSms?.sentAt || data.lastCustomerSms?.note),
      },
      fields: [
        {
          name: 'sentAt',
          type: 'date',
          label: 'زمان',
          admin: { readOnly: true },
        },
        {
          name: 'ok',
          type: 'checkbox',
          label: 'ارسال شد',
          admin: { readOnly: true },
        },
        {
          name: 'note',
          type: 'text',
          label: 'نتیجه',
          admin: { readOnly: true },
        },
        {
          name: 'messageId',
          type: 'text',
          label: 'شناسه پیامک',
          admin: { readOnly: true },
        },
      ],
    },
    {
      name: 'orderSummary',
      type: 'textarea',
      label: 'اقلام سفارش',
      virtual: true,
      admin: {
        readOnly: true,
        components: {
          Cell: '/src/components/admin/OrderSummaryCell#OrderSummaryCell',
          Field: '/src/components/admin/OrderSummaryField#OrderSummaryField',
        },
      },
      hooks: {
        afterRead: [
          ({ siblingData, req }) => formatOrderSummary(siblingData ?? {}, req.payload),
        ],
      },
    },
    {
      name: 'customerName',
      type: 'text',
      label: 'نام مشتری',
      required: true,
      admin: {
        readOnly: true,
        condition: () => false,
      },
    },
    {
      name: 'phone',
      type: 'text',
      label: 'شماره تماس',
      required: true,
      admin: {
        readOnly: true,
        condition: () => false,
      },
    },
    {
      name: 'items',
      type: 'array',
      label: 'اقلام سفارش (خام)',
      admin: {
        description: 'محصولاتی که مشتری از سبد ثبت کرده است، با تعداد هر کدام.',
        readOnly: true,
        hidden: true,
        disableListColumn: true,
      },
      fields: [
        {
          name: 'product',
          type: 'relationship',
          relationTo: 'products',
          label: 'محصول',
          required: true,
        },
        {
          name: 'quantity',
          type: 'number',
          label: 'تعداد',
          required: true,
          min: 1,
        },
      ],
    },
    {
      name: 'galleryItems',
      type: 'array',
      label: 'اقلام نمونه کار',
      admin: {
        description: 'نمونه کارهایی که مشتری از گالری به سبد اضافه کرده است، با تعداد هر کدام.',
        readOnly: true,
        hidden: true,
        disableListColumn: true,
      },
      fields: [
        {
          name: 'gallery',
          type: 'relationship',
          relationTo: 'gallery',
          label: 'نمونه کار',
          required: true,
        },
        {
          name: 'quantity',
          type: 'number',
          label: 'تعداد',
          required: true,
          min: 1,
        },
      ],
    },
    {
      name: 'productNote',
      type: 'text',
      label: 'محصول (متن آزاد)',
      admin: {
        readOnly: true,
        condition: () => false,
      },
    },
    {
      name: 'otherQuantity',
      type: 'number',
      label: 'تعداد (سایر)',
      min: 1,
      admin: {
        readOnly: true,
        condition: () => false,
      },
    },
    {
      name: 'deliveryDate',
      type: 'text',
      label: 'تاریخ تحویل',
      admin: {
        readOnly: true,
        condition: () => false,
      },
    },
    {
      name: 'notes',
      type: 'textarea',
      label: 'توضیحات',
      admin: {
        readOnly: true,
        condition: (data) => Boolean(data.notes),
      },
    },
    {
      name: 'sampleImage',
      type: 'upload',
      relationTo: 'media',
      label: 'عکس نمونه',
      admin: {
        readOnly: true,
        condition: (data) => Boolean(data.sampleImage),
      },
    },
  ],
}
