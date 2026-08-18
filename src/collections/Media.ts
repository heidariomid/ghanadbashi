import type { CollectionConfig } from 'payload'
import { APIError } from 'payload'
import { isAdmin, isPublic } from '@/lib/access'
import { formatMediaInUseMessage, getMediaReferences } from '@/lib/media-references'

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
    // Public create exists only so the order form can attach a sample photo.
    // `mimeTypes` and the size cap below are what keep it from being a dumping
    // ground.
    create: isPublic,
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
        description: 'توضیح کوتاه تصویر برای دسترس‌پذیری و سئو.',
      },
    },
  ],
}
