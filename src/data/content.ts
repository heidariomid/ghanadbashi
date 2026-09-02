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
  /** Appended to the brand name in the homepage title. */
  metaTagline: string
  /** Search result and sharing-preview summary for the homepage. */
  metaDescription: string
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

export interface OrderFormCopy {
  eyebrow: string
  title: string
  description: string
  metaTitle: string
  metaDescription: string
  submit: string
  submitting: string
  loading: string
  success: string
  error: string
  otherProduct: string
  otherProductLabel: string
  otherProductPlaceholder: string
  photoHint: string
  photoClear: string
  emptyCart: string
  emptyCartHint: string
  reviewTitle: string
  fields: {
    customerName: string
    phone: string
    quantity: string
    deliveryDate: string
    notes: string
    sampleImage: string
  }
}

export interface CartCopy {
  title: string
  empty: string
  emptyHint: string
  browse: string
  browseGallery: string
  checkout: string
  checkoutPending: string
  add: string
  remove: string
  countLabel: string
  close: string
  increment: string
  decrement: string
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
  categories: SectionIntro & { empty: string }
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
    }
  }
  gallery: SectionIntro & { unavailable: string }
  about: About
  orderCta: OrderCta
  orderForm: OrderFormCopy
  cart: CartCopy
  contact: Contact
  footer: { credit: string }
  unavailable: { title: string; description: string; retry: string }
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
    metaTagline: 'شیرینی و کیک خانگی در اصفهان',
    metaDescription:
      'کیک تولد، شیرینی خشک، کوکی و دسر خانگی — دست‌ساز، با مواد اولیه‌ی درجه‌یک و پخت روز. تحویل در اصفهان، بهارستان و حومه.',
  },

  nav: [
    { label: 'محصولات', href: '/products' },
    { label: 'نمونه کارها', href: '/gallery' },
    { label: 'درباره ما', href: '/#about' },
    { label: 'تماس', href: '/#contact' },
  ],

  primaryCta: { label: 'ثبت سفارش', href: '/order' },

  whatsapp: {
    label: 'واتس‌اپ',
    floatingLabel: 'گفت‌وگو در واتس‌اپ',
  },

  categories: {
    eyebrow: 'دسته‌بندی محصولات',
    title: 'هر مناسبت، یک طعم',
    description:
      'از کیک تولد سفارشی تا شیرینی خشک و دسرهای تک‌نفره؛ همه در تعداد محدود و به‌سفارش شما.',
    empty: 'قابل سفارش — از فهرست به سبد اضافه کنید',
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
    },
  },

  gallery: {
    eyebrow: 'نمونه کارها',
    title: 'از آشپزخانه‌ی ما',
    description:
      'سفارش‌هایی که تا امروز آماده کرده‌ایم. برای دیدن هر دسته، از دکمه‌های بالای عکس‌ها استفاده کنید.',
    unavailable: 'فعلاً موجود نیست',
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
      'محصول را به سبد اضافه کنید، سبد را بازبینی کنید، بعد نام و تاریخ تحویل را بنویسید. ظرفیت هر روز محدود است.',
    primary: 'ثبت سفارش',
    secondary: 'تماس تلفنی',
    steps: [
      'محصول را به سبد اضافه می‌کنید',
      'سبد را بازبینی و ثبت می‌کنید',
      'روز تحویل، تازه پخته می‌شود',
    ],
  },

  orderForm: {
    eyebrow: 'ثبت سفارش',
    title: 'سبد را نهایی کنید',
    description:
      'اقلام سبد را بازبینی کنید، بعد نام، شماره تماس و تاریخ تحویل را بنویسید. اگر عکسی از نمونه دارید، همان‌جا پیوست کنید.',
    metaTitle: 'ثبت سفارش',
    metaDescription:
      'سفارش کیک و شیرینی خانگی — سبد را بازبینی کنید و نام، تاریخ تحویل و توضیحات را بنویسید.',
    submit: 'ثبت سفارش',
    submitting: 'در حال ارسال...',
    loading: 'در حال بارگذاری سبد…',
    success: 'سفارش شما ثبت شد. به زودی با شما تماس می‌گیریم.',
    error: 'ثبت سفارش ممکن نشد. لطفاً دوباره تلاش کنید.',
    otherProduct: 'سایر / مورد دیگر',
    otherProductLabel: 'نام محصول',
    otherProductPlaceholder: 'محصول مورد نظر را بنویسید',
    photoHint: 'فقط تصویر، حداکثر ۴ مگابایت',
    photoClear: 'حذف عکس',
    emptyCart: 'سبد شما خالی است',
    emptyCartHint:
      'از صفحه محصولات یا نمونه کارها به سبد اضافه کنید، یا اگر در فهرست نیست در «سایر» بنویسید.',
    reviewTitle: 'اقلام سبد',
    fields: {
      customerName: 'نام و نام خانوادگی',
      phone: 'شماره تماس',
      quantity: 'تعداد',
      deliveryDate: 'تاریخ تحویل',
      notes: 'توضیحات',
      sampleImage: 'عکس نمونه',
    },
  },

  cart: {
    title: 'سبد سفارش',
    empty: 'سبد شما خالی است',
    emptyHint: 'از صفحه محصولات یا نمونه کارها به سبد اضافه کنید.',
    browse: 'مشاهده محصولات',
    browseGallery: 'مشاهده نمونه کارها',
    checkout: 'ادامه سفارش',
    checkoutPending: 'در حال انتقال…',
    add: 'افزودن به سبد',
    remove: 'حذف',
    countLabel: 'سبد سفارش',
    close: 'بستن سبد',
    increment: 'افزایش تعداد',
    decrement: 'کاهش تعداد',
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

  unavailable: {
    title: 'سایت موقتاً در دسترس نیست',
    description: 'اتصال برقرار نشد. کمی بعد دوباره تلاش کنید.',
    retry: 'تلاش دوباره',
  },
}
