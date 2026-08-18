import {
  BoldFeature,
  ItalicFeature,
  lexicalEditor,
  ParagraphFeature,
} from '@payloadcms/richtext-lexical'
import type { GlobalConfig } from 'payload'
import { isAdmin, isPublic } from '@/lib/access'

/** Paragraphs only — the full default editor trips Lexical's horizontalrule node. */
const aboutEditor = lexicalEditor({
  features: () => [ParagraphFeature(), BoldFeature(), ItalicFeature()],
})

export const SiteSettings: GlobalConfig = {
  slug: 'site-settings',
  label: 'تنظیمات سایت',
  admin: {
    description: 'نام برند، عکس صفحه اول و اطلاعات تماس. این‌ها در کل سایت استفاده می‌شوند.',
  },
  access: {
    read: isPublic,
    update: isAdmin,
  },
  fields: [
    {
      type: 'group',
      name: 'brand',
      label: 'معرفی برند',
      fields: [
        {
          name: 'brandName',
          type: 'text',
          label: 'نام برند',
          required: true,
        },
        {
          name: 'tagline',
          type: 'text',
          label: 'شعار برند',
          admin: {
            description: 'یک جمله کوتاه، مثال: طعم خانگی، با عشق و کیفیت',
          },
        },
        {
          name: 'heroImage',
          type: 'upload',
          relationTo: 'media',
          label: 'عکس اصلی صفحه اول',
          required: true,
          admin: {
            description: 'بزرگ‌ترین عکس سایت. بهترین عکس محصولتان را اینجا بگذارید.',
          },
        },
        {
          name: 'aboutText',
          type: 'richText',
          label: 'درباره من',
          editor: aboutEditor,
          admin: {
            description:
              'یک یا دو پاراگراف درباره خودتان و آشپزخانه. Enter برای پاراگراف جدید.',
          },
        },
        {
          name: 'aboutImage',
          type: 'upload',
          relationTo: 'media',
          label: 'عکس بخش درباره من',
          admin: {
            description: 'عکسی از آشپزخانه یا خودتان در حال کار.',
          },
        },
      ],
    },
    {
      type: 'group',
      name: 'contact',
      label: 'اطلاعات تماس',
      fields: [
        {
          name: 'phone',
          type: 'text',
          label: 'شماره تماس',
        },
        {
          name: 'whatsapp',
          type: 'text',
          label: 'شماره واتساپ',
          admin: {
            description: 'با کد کشور و بدون صفر و علامت، مثال: 989121234567',
          },
        },
        {
          name: 'instagram',
          type: 'text',
          label: 'آیدی اینستاگرام',
          admin: {
            description: 'بدون علامت @، مثال: ghanad_bashi_asal5',
          },
        },
        {
          name: 'serviceArea',
          type: 'text',
          label: 'محدوده فعالیت',
          admin: {
            description: 'مثال: اصفهان، بهارستان و حومه',
          },
        },
      ],
    },
  ],
}
