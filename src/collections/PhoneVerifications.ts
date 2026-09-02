import type { CollectionConfig } from 'payload'
import { isAdmin } from '@/lib/access'

/**
 * Plumbing for order-form OTP. Hidden from the admin sidebar — she should
 * never see these rows. The public form writes through the Local API.
 */
export const PhoneVerifications: CollectionConfig = {
  slug: 'phone-verifications',
  labels: {
    singular: 'تأیید شماره',
    plural: 'تأیید شماره‌ها',
  },
  admin: {
    hidden: true,
    useAsTitle: 'phone',
  },
  access: {
    create: isAdmin,
    read: isAdmin,
    update: isAdmin,
    delete: isAdmin,
  },
  fields: [
    {
      name: 'phone',
      type: 'text',
      label: 'شماره موبایل',
      required: true,
      index: true,
    },
    {
      name: 'codeHash',
      type: 'text',
      label: 'هش کد',
      required: true,
    },
    {
      name: 'expiresAt',
      type: 'date',
      label: 'انقضا',
      required: true,
    },
    {
      name: 'attempts',
      type: 'number',
      label: 'تعداد تلاش',
      required: true,
      defaultValue: 0,
      min: 0,
    },
    {
      name: 'consumedAt',
      type: 'date',
      label: 'زمان استفاده',
    },
    {
      name: 'ip',
      type: 'text',
      label: 'آی‌پی',
      required: true,
    },
  ],
}
