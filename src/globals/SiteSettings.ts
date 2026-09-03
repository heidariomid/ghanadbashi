import {
  BoldFeature,
  ItalicFeature,
  lexicalEditor,
  ParagraphFeature,
} from '@payloadcms/richtext-lexical'
import type { GlobalConfig } from 'payload'
import { isAdmin, isPublic } from '@/lib/access'
import { toLatinDigits } from '@/lib/format'
import { revalidatePublicSite } from '@/lib/revalidate'

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
  hooks: {
    afterChange: [() => revalidatePublicSite()],
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
          name: 'rotatingPrefix',
          type: 'text',
          label: 'متن ثابت قبل از کلمات متغیر',
          admin: {
            description: 'مثال: این هفته می‌پزیم',
          },
        },
        {
          name: 'rotatingWords',
          type: 'array',
          label: 'کلمات متغیر',
          labels: { singular: 'کلمه', plural: 'کلمات' },
          admin: {
            description:
              'زیر شعار برند، این کلمه‌ها یکی‌یکی تایپ و پاک می‌شوند. مثال: کیک تولد، شیرینی خشک، دسر. دست‌کم دو کلمه بگذارید تا بچرخند.',
          },
          fields: [
            {
              name: 'word',
              type: 'text',
              label: 'کلمه',
              required: true,
            },
          ],
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
        {
          name: 'orderNotificationPhone',
          type: 'text',
          label: 'شماره برای اطلاع سفارش جدید',
          access: {
            read: ({ req }) => Boolean(req.user),
          },
          admin: {
            description: 'فقط برای خبر دادن سفارش تازه. در سایت نمایش داده نمی‌شود.',
          },
        },
        {
          name: 'cardNumber',
          type: 'text',
          label: 'شماره کارت برای پیش‌پرداخت',
          maxLength: 19,
          access: {
            read: ({ req }) => Boolean(req.user),
          },
          hooks: {
            beforeChange: [
              ({ value }) => {
                if (typeof value !== 'string' || !value.trim()) return value
                const digits = toLatinDigits(value).replace(/\D/g, '')
                return digits || value
              },
            ],
          },
          validate: (value: unknown) => {
            if (value == null || value === '') return true
            const digits = toLatinDigits(String(value)).replace(/\D/g, '')
            return digits.length === 16 || '۱۶ رقم کارت را وارد کنید'
          },
          admin: {
            description:
              '۱۶ رقم. در سایت دیده نمی‌شود. با پیامک واریز برای مشتری فرستاده می‌شود.',
          },
        },
      ],
    },
  ],
}
