import type { CollectionConfig } from 'payload'
import { APIError } from 'payload'
import { isAdmin, isPublic } from '@/lib/access'
import { formatMediaInUseMessage, getMediaReferences } from '@/lib/media-references'

const MAX_FILE_BYTES = 4 * 1024 * 1024

export const Media: CollectionConfig = {
  slug: 'media',
  labels: {
    singular: 'فایل رسانه‌ای',
    plural: 'رسانه‌ها',
  },
  admin: {
    useAsTitle: 'alt',
    description: 'آپلود و مدیریت تصاویر سایت.',
  },
  access: {
    // REST create is admin-only. The order action uploads through the Local API.
    create: isAdmin,
    read: isPublic,
    update: isAdmin,
    delete: isAdmin,
  },
  upload: {
    staticDir: 'media',
    mimeTypes: ['image/*'],
    adminThumbnail: 'thumbnail',
    focalPoint: false,
    formatOptions: {
      format: 'webp',
      options: { quality: 80 },
    },
    imageSizes: [
      { name: 'thumbnail', width: 400, height: 400, position: 'centre' },
      { name: 'card', width: 768 },
      { name: 'hero', width: 1600 },
    ],
  },
  hooks: {
    beforeValidate: [
      ({ req }) => {
        const file = req.file
        if (file && file.size > MAX_FILE_BYTES) {
          throw new APIError('حجم فایل نباید بیشتر از ۴ مگابایت باشد.', 400)
        }
      },
    ],
    beforeDelete: [
      async ({ id, req }) => {
        const references = await getMediaReferences(req.payload, id)

        if (references.length > 0) {
          throw new APIError(formatMediaInUseMessage(references), 400)
        }
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
        description: 'همان چیزی که در عکس است را بنویسید. مثال: کیک شکلاتی با توت‌فرنگی',
      },
    },
  ],
}
