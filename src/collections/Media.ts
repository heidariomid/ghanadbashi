import type { CollectionConfig } from 'payload'

export const Media: CollectionConfig = {
  slug: 'media',
  labels: {
    singular: 'فایل رسانه ای',
    plural: 'رسانه ها',
  },
  admin: {
    description: 'آپلود و مدیریت تصاویر سایت.',
  },
  upload: {
    staticDir: 'media',
    mimeTypes: ['image/*'],
    adminThumbnail: 'thumbnail',
    imageSizes: [
      {
        name: 'thumbnail',
        width: 400,
        height: 300,
        position: 'centre',
      },
    ],
  },
  fields: [
    {
      name: 'alt',
      type: 'text',
      label: 'متن جایگزین',
      required: true,
      admin: {
        description: 'توضیح کوتاه تصویر برای دسترس پذیری و سئو.',
      },
    },
  ],
}
