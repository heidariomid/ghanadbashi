/**
 * Every word, price, image and link on the site lives here. Components read
 * from this file and hardcode nothing, so the whole demo can be re-branded or
 * re-shot in one place.
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
  heroPhoto: Photo
  heroBadge: string
  heroNote: string
}

export interface Category {
  id: string
  title: string
  description: string
  photo: Photo
}

export interface Product {
  id: string
  name: string
  description: string
  price: number
  unit: string
  photo: Photo
  cta: string
}

export interface GalleryItem {
  id: string
  caption: string
  photo: Photo
  /**
   * Desktop-only ratio. Phones get a uniform square grid — the uneven masonry
   * reads as ragged at that width — so these apply from `lg` up. Write the full
   * class, including the `lg:` prefix, or Tailwind will not generate it.
   */
  aspectLg: string
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
  photo: Photo
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
  categories: SectionIntro & { items: Category[] }
  products: SectionIntro & { items: Product[]; footnote: string }
  gallery: SectionIntro & { items: GalleryItem[] }
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
    heroPhoto: {
      src: 'https://images.unsplash.com/photo-1519915028121-7d3463d20b13?w=1400&q=80',
      alt: 'تارت مرنگ خانگی',
    },
    heroBadge: 'پخت روز · تحویل در بهارستان',
    heroNote: 'سفارش‌ها دو روز قبل دریافت می‌شوند',
  },

  nav: [
    { label: 'محصولات', href: '#products' },
    { label: 'گالری', href: '#gallery' },
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
    items: [
      {
        id: 'birthday',
        title: 'کیک تولد و مناسبتی',
        description: 'طراحی اختصاصی، با نام و رنگ دلخواه شما',
        photo: {
          src: 'https://images.unsplash.com/photo-1621303837174-89787a7d4729?w=700&q=80',
          alt: 'کیک تولد',
        },
      },
      {
        id: 'cafe',
        title: 'کیک‌های کافه‌ای و عصرانه',
        description: 'برای دورهمی‌های کوچک و میز عصرانه',
        photo: {
          src: 'https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=700&q=80',
          alt: 'کیک کافه‌ای',
        },
      },
      {
        id: 'pastry',
        title: 'شیرینی خشک',
        description: 'تازه، در جعبه‌های وزنی و کادویی',
        photo: {
          src: 'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=700&q=80',
          alt: 'شیرینی خشک',
        },
      },
      {
        id: 'dessert',
        title: 'دسرها',
        description: 'در ظرف‌های تک‌نفره، آماده‌ی سرو',
        photo: {
          src: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?w=700&q=80',
          alt: 'دسر',
        },
      },
      {
        id: 'healthy',
        title: 'محصولات سلامت‌محور و رژیمی',
        description: 'بدون شکر و آرد سفید، با شیرین‌کننده‌ی طبیعی',
        photo: {
          src: 'https://images.unsplash.com/photo-1519676867240-f03562e64548?w=700&q=80',
          alt: 'محصولات رژیمی',
        },
      },
      {
        id: 'spreads',
        title: 'ارده، عسل و کره بادام‌زمینی',
        description: 'صبحانه‌ای خالص، بدون روغن و شکر افزوده',
        photo: {
          src: 'https://images.unsplash.com/photo-1493925410384-84f842e616fb?w=700&q=80',
          alt: 'ارده و عسل',
        },
      },
      {
        id: 'gift',
        title: 'پک‌های هدیه',
        description: 'بسته‌بندی دست‌ساز، همراه با کارت دست‌نویس',
        photo: {
          src: 'https://images.unsplash.com/photo-1470124182917-cc6e71b22ecc?w=700&q=80',
          alt: 'پک هدیه',
        },
      },
    ],
  },

  products: {
    eyebrow: 'انتخاب‌های این فصل',
    title: 'محصولات منتخب',
    description:
      'فهرست کامل‌تر در واتس‌اپ در اختیار شماست؛ این‌ها پرسفارش‌ترین‌های چند ماه گذشته‌اند.',
    items: [
      {
        id: 'chocolate-cake',
        name: 'کیک شکلاتی بلژیکی',
        description: 'مغز نرم شکلات تلخ، با گاناش تازه',
        price: 980000,
        unit: 'هر کیلوگرم',
        photo: {
          src: 'https://images.unsplash.com/photo-1602351447937-745cb720612f?w=900&q=80',
          alt: 'کیک شکلاتی بلژیکی',
        },
        cta: 'مشاهده محصول',
      },
      {
        id: 'cheesecake',
        name: 'چیزکیک بلوبری',
        description: 'پنیر خامه‌ای، روی بیسکویت کره‌ای',
        price: 760000,
        unit: 'هر کیلوگرم',
        photo: {
          src: 'https://images.unsplash.com/photo-1578775887804-699de7086ff9?w=900&q=80',
          alt: 'چیزکیک بلوبری',
        },
        cta: 'مشاهده محصول',
      },
      {
        id: 'baklava',
        name: 'باقلوای خانگی',
        description: 'پسته و گلاب، لایه‌لایه و کم‌شیرین',
        price: 480000,
        unit: 'جعبه‌ی ۵۰۰ گرمی',
        photo: {
          src: 'https://images.unsplash.com/photo-1571115177098-24ec42ed204d?w=900&q=80',
          alt: 'باقلوای خانگی',
        },
        cta: 'مشاهده محصول',
      },
      {
        id: 'cream-puff',
        name: 'نان خامه‌ای',
        description: 'خامه‌ی تازه‌ی وانیلی، همان روز پخت',
        price: 65000,
        unit: 'هر عدد',
        photo: {
          src: 'https://images.unsplash.com/photo-1470124182917-cc6e71b22ecc?w=900&q=80',
          alt: 'نان خامه‌ای',
        },
        cta: 'ثبت سفارش',
      },
      {
        id: 'cinnamon-roll',
        name: 'رول دارچین',
        description: 'خمیر ورقه‌ای، با روکش پنیر خامه‌ای',
        price: 540000,
        unit: 'جعبه‌ی شش‌عددی',
        photo: {
          src: 'https://images.unsplash.com/photo-1550617931-e17a7b70dce2?w=900&q=80',
          alt: 'رول دارچین',
        },
        cta: 'مشاهده محصول',
      },
      {
        id: 'fruit-tart',
        name: 'تارت میوه‌ی فصل',
        description: 'کاستارد وانیل و میوه‌ی روز',
        price: 850000,
        unit: 'هر کیلوگرم',
        photo: {
          src: 'https://images.unsplash.com/photo-1495147466023-ac5c588e2e94?w=900&q=80',
          alt: 'تارت میوه',
        },
        cta: 'مشاهده محصول',
      },
    ],
    footnote: 'قیمت‌ها بر اساس سفارش و طراحی تغییر می‌کند.',
  },

  gallery: {
    eyebrow: 'لوک‌بوک',
    title: 'از آشپزخانه‌ی ما',
    description:
      'چند لحظه‌ی کوچک از روزهای کاری؛ تصویرهایی از چیزی که هر روز با دست ساخته می‌شود.',
    items: [
      {
        id: 'g1',
        caption: 'میز کار، صبح زود',
        aspectLg: 'lg:aspect-3/4',
        photo: {
          src: 'https://images.unsplash.com/photo-1517686469429-8bdb88b9f907?w=900&q=80',
          alt: 'میز کار، صبح زود',
        },
      },
      {
        id: 'g2',
        caption: 'لایه‌ها',
        aspectLg: 'lg:aspect-square',
        photo: {
          src: 'https://images.unsplash.com/photo-1571115177098-24ec42ed204d?w=900&q=80',
          alt: 'لایه‌ها',
        },
      },
      {
        id: 'g3',
        caption: 'پایه‌ی سرو',
        aspectLg: 'lg:aspect-4/5',
        photo: {
          src: 'https://images.unsplash.com/photo-1606890737304-57a1ca8a5b62?w=900&q=80',
          alt: 'پایه‌ی سرو',
        },
      },
      {
        id: 'g4',
        caption: 'ترکیب‌بندی بشقاب',
        aspectLg: 'lg:aspect-square',
        photo: {
          src: 'https://images.unsplash.com/photo-1495147466023-ac5c588e2e94?w=900&q=80',
          alt: 'ترکیب‌بندی بشقاب',
        },
      },
      {
        id: 'g5',
        caption: 'فرم‌ها',
        aspectLg: 'lg:aspect-3/4',
        photo: {
          src: 'https://images.unsplash.com/photo-1535920527002-b35e96722eb9?w=900&q=80',
          alt: 'فرم‌ها',
        },
      },
      {
        id: 'g6',
        caption: 'شیرینی تازه',
        aspectLg: 'lg:aspect-square',
        photo: {
          src: 'https://images.unsplash.com/photo-1499636136210-6f4ee915583e?w=900&q=80',
          alt: 'شیرینی تازه',
        },
      },
    ],
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
    photo: {
      src: 'https://images.unsplash.com/photo-1587248720327-8eb72564be1e?w=1100&q=80',
      alt: 'آماده‌سازی خمیر در آشپزخانه',
    },
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
