import type { CollectionConfig } from 'payload'

export const Users: CollectionConfig = {
  slug: 'users',
  labels: {
    singular: 'کاربر',
    plural: 'کاربران',
  },
  admin: {
    useAsTitle: 'username',
    description: 'کاربران واردشونده به پنل مدیریت سایت.',
    defaultColumns: ['username', 'email', 'updatedAt'],
  },
  auth: {
    loginWithUsername: true,
  },
  fields: [
    {
      name: 'displayName',
      type: 'text',
      label: 'نام نمایشی',
      admin: {
        description: 'نامی که در پنل مدیریت برای شناسایی کاربر نمایش داده می شود.',
      },
    },
  ],
}
