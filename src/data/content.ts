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
  tagline: string
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
  paragraphs: string[]
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
  id: string
  label: string
  value: string
  href?: string
  note?: string
  /** Phone numbers render in Persian digits; handles like @asal5 must not. */
  localizeDigits?: boolean
}

export interface Contact {
  eyebrow: string
  title: string
  description: string
  channels: ContactChannel[]
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
  whatsapp: { label: string; href: string; floatingLabel: string }
  phoneHref: string
  categories: SectionIntro
  products: SectionIntro & { footnote: string }
  gallery: SectionIntro
  about: About
  orderCta: OrderCta
  contact: Contact
  footer: { credit: string }
}

const WHATSAPP_HREF = 'https://wa.me/989369088311'
const PHONE_HREF = 'tel:+989369088311'

export const content: SiteContent = {
  brand: {
    name: 'قناد باشی عسل',
    latinName: 'GHANAD BASHI ASAL',
    tagline: 'طعم خانگی، با عشق و کیفیت',
    intro:
      'کیک و شیرینی دست‌ساز، در آشپزخانه‌ای خانگی و در تعداد محدود پخته می‌شود؛ با مواد اولیه‌ی تازه و بدون هیچ افزودنی. هر سفارش برای یک میز خاص آماده می‌شود.',
    eyebrow: 'قنادی خانگی · اصفهان، بهارستان',
    heroBadge: 'پخت روز · تحویل در بهارستان',
    heroNote: 'سفارش‌ها دو روز قبل دریافت می‌شوند',
  },

  nav: [
    { label: 'محصولات', href: '#products' },
    { label: 'نمونه کارها', href: '#gallery' },
    { label: 'درباره ما', href: '#about' },
    { label: 'تماس', href: '#contact' },
  ],

  primaryCta: { label: 'ثبت سفارش', href: '#order' },

  whatsapp: {
    label: 'واتس‌اپ',
    href: WHATSAPP_HREF,
    floatingLabel: 'گفت‌وگو در واتس‌اپ',
  },

  phoneHref: PHONE_HREF,

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
    paragraphs: [
      'کار من از یک فر خانگی و چند سفارش برای دوستان شروع شد. امروز هم همان آشپزخانه است؛ فقط دقت و تجربه‌اش بیشتر شده. هر سفارش را خودم آماده می‌کنم و همان روز تحویل می‌دهم.',
      'کره‌ی حیوانی، شکلات درجه‌یک، تخم‌مرغ و میوه‌ی تازه؛ هیچ اسانس و رنگ مصنوعی. اگر مواد اولیه‌ای در دسترس نباشد، آن روز آن محصول را نمی‌پزم. همین سادگی، طعم خانگی را نگه می‌دارد.',
    ],
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
    channels: [
      {
        id: 'phone',
        label: 'تلفن',
        value: '0936 908 8311',
        href: PHONE_HREF,
        note: 'پاسخگویی ۹ تا ۲۱',
        localizeDigits: true,
      },
      {
        id: 'whatsapp',
        label: 'واتس‌اپ',
        value: '0936 908 8311',
        href: WHATSAPP_HREF,
        note: 'ثبت سفارش و مشاوره',
        localizeDigits: true,
      },
      {
        id: 'instagram',
        label: 'اینستاگرام',
        value: '@ghanad_bashi_asal5',
        href: 'https://instagram.com/ghanad_bashi_asal5',
        note: 'تصاویر سفارش‌های تازه',
      },
      {
        id: 'area',
        label: 'محدوده‌ی ارسال',
        value: 'اصفهان، بهارستان و حومه',
        note: 'ارسال با پیک، هماهنگ با شما',
      },
    ],
  },

  footer: {
    credit: 'ساخته‌شده با دقت، در بهارستان',
  },
}
