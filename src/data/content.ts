/**
 * Section headings and static UI copy. Everything the client edits — products,
 * gallery photos, brand name, contact details — comes from the CMS instead;
 * this file holds only the wording around it.
 */

export interface NavItem {
  label: string
  href: string
}

export interface Photo {
  src: string
  alt: string
}

export interface Brand {
  name: string
  latinName: string
  intro: string
  eyebrow: string
  heroBadge: string
  heroNote: string
}

export interface AboutValue {
  title: string
  description: string
}

export interface About {
  eyebrow: string
  title: string
  signature: string
  signatureRole: string
  values: AboutValue[]
}

export interface OrderCta {
  eyebrow: string
  title: string
  description: string
  primary: string
  secondary: string
  steps: string[]
}

export interface ContactChannel {
  label: string
  note: string
}

export interface Contact {
  eyebrow: string
  title: string
  description: string
  channels: {
    phone: ContactChannel
    whatsapp: ContactChannel
    instagram: ContactChannel
    serviceArea: ContactChannel
  }
}

export interface SectionIntro {
  eyebrow: string
  title: string
  description: string
}

export interface SiteContent {
  brand: Brand
  nav: NavItem[]
  primaryCta: NavItem
  whatsapp: { label: string; floatingLabel: string }
  categories: SectionIntro
  products: SectionIntro & {
    footnote: string
    listing: {
      eyebrow: string
      title: string
      description: string
      empty: string
      all: string
      viewAll: string
      unavailable: string
      orderMessage: string
    }
  }
  gallery: SectionIntro
  about: About
  orderCta: OrderCta
  contact: Contact
  footer: { credit: string }
}

export const content: SiteContent = {
  brand: {
    name: 'قناد باشی عسل',
    latinName: 'GHANAD BASHI ASAL',
    intro:
      'کیک و شیرینی دست‌ساز، در آشپزخانه‌ای خانگی و در تعداد محدود پخته می‌شود؛ با مواد اولیه‌ی تازه و بدون هیچ افزودنی. هر سفارش برای یک میز خاص آماده می‌شود.',
    eyebrow: 'قنادی خانگی · اصفهان، بهارستان',
    heroBadge: 'پخت روز · تحویل در بهارستان',
    heroNote: 'سفارش‌ها دو روز قبل دریافت می‌شوند',
  },

  nav: [
    { label: 'محصولات', href: '/products' },
    { label: 'نمونه کارها', href: '/#gallery' },
    { label: 'درباره ما', href: '/#about' },
    { label: 'تماس', href: '/#contact' },
  ],

  primaryCta: { label: 'ثبت سفارش', href: '/#order' },

  whatsapp: {
    label: 'واتس‌اپ',
    floatingLabel: 'گفت‌وگو در واتس‌اپ',
  },

  categories: {
    eyebrow: 'دسته‌بندی محصولات',
    title: 'هر مناسبت، یک طعم',
    description:
      'از کیک تولد سفارشی تا شیرینی خشک و دسرهای تک‌نفره؛ همه در تعداد محدود و به‌سفارش شما.',
  },

  products: {
    eyebrow: 'انتخاب‌های این فصل',
    title: 'محصولات منتخب',
    description:
      'فهرست کامل‌تر در واتس‌اپ در اختیار شماست؛ این‌ها پرسفارش‌ترین‌های چند ماه گذشته‌اند.',
    footnote: 'قیمت‌ها بر اساس سفارش و طراحی تغییر می‌کند.',
    listing: {
      eyebrow: 'فهرست محصولات',
      title: 'همه محصولات',
      description:
        'کیک، شیرینی خشک، دسر و محصولات رژیمی — هر کدام با عکس، قیمت یا استعلام، آماده سفارش.',
      empty: 'فعلاً محصولی در این دسته نیست',
      all: 'همه',
      viewAll: 'مشاهده همه محصولات',
      unavailable: 'فعلاً موجود نیست',
      orderMessage: 'سلام، می‌خواهم «{title}» را سفارش بدهم',
    },
  },

  gallery: {
    eyebrow: 'نمونه کارها',
    title: 'از آشپزخانه‌ی ما',
    description:
      'سفارش‌هایی که تا امروز آماده کرده‌ایم. برای دیدن هر دسته، از دکمه‌های بالای عکس‌ها استفاده کنید.',
  },

  about: {
    eyebrow: 'درباره‌ی ما',
    title: 'یک آشپزخانه‌ی خانگی، نه یک کارخانه',
    signature: 'مریم',
    signatureRole: 'بنیان‌گذار و شیرینی‌پز',
    values: [
      { title: 'دست‌ساز', description: 'بدون خط تولید؛ هر سفارش جداگانه آماده می‌شود.' },
      { title: 'مواد اولیه‌ی درجه‌یک', description: 'کره‌ی حیوانی، شکلات اصل، میوه‌ی تازه.' },
      { title: 'تازگی', description: 'پخت در روز تحویل، بدون انبار و فریزر.' },
      { title: 'توجه به جزئیات', description: 'از طرح روی کیک تا گره‌ی روبان جعبه.' },
    ],
  },

  orderCta: {
    eyebrow: 'ثبت سفارش',
    title: 'برای میز شما، همین هفته',
    description:
      'طرح، طعم و تاریخ تحویل را در واتس‌اپ با هم نهایی می‌کنیم. ظرفیت هر روز محدود است، پس کمی زودتر خبر بدهید.',
    primary: 'ثبت سفارش در واتس‌اپ',
    secondary: 'تماس تلفنی',
    steps: [
      'طعم و اندازه را انتخاب می‌کنید',
      'طرح و تاریخ تحویل را نهایی می‌کنیم',
      'روز تحویل، تازه پخته می‌شود',
    ],
  },

  contact: {
    eyebrow: 'تماس',
    title: 'در دسترس، هر روز هفته',
    description: 'از ۹ صبح تا ۹ شب پاسخ می‌دهیم؛ پیام واتس‌اپ سریع‌تر دیده می‌شود.',
    channels: {
      phone: {
        label: 'تلفن',
        note: 'پاسخگویی ۹ تا ۲۱',
      },
      whatsapp: {
        label: 'واتس‌اپ',
        note: 'ثبت سفارش و مشاوره',
      },
      instagram: {
        label: 'اینستاگرام',
        note: 'تصاویر سفارش‌های تازه',
      },
      serviceArea: {
        label: 'محدوده‌ی ارسال',
        note: 'ارسال با پیک، هماهنگ با شما',
      },
    },
  },

  footer: {
    credit: 'ساخته‌شده با دقت و عشق',
  },
}
