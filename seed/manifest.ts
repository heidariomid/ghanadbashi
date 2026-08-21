import type { CategoryValue } from '@/lib/categories'

export interface SeedPhoto {
  /** Filename inside `seed/images`, without the extension. */
  file: string
  /** Original filename as the client sent it, kept so a re-send can be matched up. */
  source: string
  title: string
  category: CategoryValue
  /**
   * False for the images that are not photographs of the client's own work.
   * She was asked about these; until she says otherwise they are published, but
   * the flag makes them a one-line query to find and remove later.
   */
  authentic: boolean
  /** Promoted to the «محصولات منتخب» row on the homepage. */
  featured?: boolean
  /** Needs a cleaner source file — see `notes`. */
  needsBetterSource?: string
}

/**
 * The client's 49 photos, categorised by eye. She can re-file any of them from
 * the admin in a couple of clicks, so the goal here is a sensible starting
 * point, not a perfect one.
 */
export const SEED_PHOTOS: SeedPhoto[] = [
  // ---- Cookies — her highest-volume product ----
  {
    file: 'cookie-pistachio',
    source: 'IMG_20260815_130351_140.jpg',
    title: 'کوکی پسته',
    category: 'cookies',
    authentic: true,
    featured: true,
  },
  {
    file: 'cookie-almond-chocolate',
    source: 'IMG_20260815_130414_934.jpg',
    title: 'کوکی بادام و شکلات',
    category: 'cookies',
    authentic: true,
  },
  {
    file: 'cookie-chocolate-walnut',
    source: 'IMG_20260815_130426_744.jpg',
    title: 'کوکی شکلاتی گردویی',
    category: 'cookies',
    authentic: true,
    featured: true,
  },
  {
    file: 'cookie-red-velvet',
    source: 'IMG_20260815_130443_229.jpg',
    title: 'کوکی رد ولوت',
    category: 'cookies',
    authentic: true,
  },
  {
    file: 'cookie-dark-chocolate',
    source: 'IMG_20260815_130455_018.jpg',
    title: 'کوکی شکلات تلخ',
    category: 'cookies',
    authentic: true,
  },
  {
    file: 'cookie-banana-chocolate',
    source: 'IMG_20260815_130505_688.jpg',
    title: 'کوکی موز و شکلات',
    category: 'cookies',
    authentic: true,
  },
  {
    file: 'cookie-chocolate-jar',
    source: 'IMG_20260815_130518_714.jpg',
    title: 'کوکی شکلاتی',
    category: 'cookies',
    authentic: true,
  },
  // Filed under diet cookies rather than cookies: dates instead of refined
  // sugar is exactly what that category is for, and it was the only photo in
  // the set that belonged there.
  {
    file: 'cookie-date-filled',
    source: 'IMG_20260815_130540_034.jpg',
    title: 'کوکی مغزدار خرما',
    category: 'diet-cookies',
    authentic: true,
  },
  {
    file: 'cookie-saffron-rose',
    source: 'IMG_20260815_130604_800.jpg',
    title: 'کوکی زعفرانی و گل محمدی',
    category: 'cookies',
    authentic: true,
    featured: true,
  },
  {
    file: 'cookie-carrot-walnut',
    source: 'IMG_20260815_130616_999.jpg',
    title: 'کوکی هویج و گردو',
    category: 'cookies',
    authentic: true,
  },
  {
    file: 'cookie-coffee',
    source: 'IMG_20260815_130659_838.jpg',
    title: 'کوکی قهوه',
    category: 'cookies',
    authentic: true,
  },
  {
    file: 'cookie-sesame',
    source: 'IMG_20260815_130711_189.jpg',
    title: 'کوکی کنجدی',
    category: 'cookies',
    authentic: true,
  },
  {
    file: 'cookie-chocolate-chunk',
    source: 'IMG_20260815_130727_457.jpg',
    title: 'کوکی تکه شکلات',
    category: 'cookies',
    authentic: true,
  },
  {
    file: 'cookie-chocolate-chip',
    source: 'IMG_20260815_130735_755.jpg',
    title: 'کوکی چیپس شکلاتی',
    category: 'cookies',
    authentic: true,
    featured: true,
  },
  {
    file: 'cookie-nutella-box',
    source: 'file_00000000bb8c81f5912cae7ec6b8ed18.png',
    title: 'کوکی نوتلا',
    category: 'cookies',
    authentic: false,
  },

  // ---- Café & afternoon cakes ----
  {
    file: 'cake-fruit-nut',
    source: 'IMG-20260711-WA0002.jpg',
    title: 'کیک میوه و آجیل',
    category: 'cafe-cakes',
    authentic: true,
    featured: true,
  },
  {
    file: 'cake-mini-saffron',
    source: 'IMG-20260730-WA0000.jpg',
    title: 'مینی کیک زعفرانی',
    category: 'cafe-cakes',
    authentic: true,
    needsBetterSource: 'اسکرین‌شات اینستاگرام — فایل اصلی از مشتری گرفته شود',
  },
  {
    file: 'cake-mini-pistachio-saffron',
    source: 'IMG_20260725_202019_062.jpg',
    title: 'مینی کیک پسته و زعفران',
    category: 'cafe-cakes',
    authentic: true,
    featured: true,
  },
  {
    file: 'cupcake-chocolate-pistachio',
    source: 'IMG_20260808_210944_728.jpg',
    title: 'کاپ‌کیک شکلاتی پسته',
    category: 'cafe-cakes',
    authentic: true,
  },
  {
    file: 'cake-layered-filo',
    source: 'file_00000000262871f49e1f0ea29c398776.png',
    title: 'کیک ورقه‌ای',
    category: 'cafe-cakes',
    authentic: false,
  },
  // A whole layered cake presented sliced reads as an occasion cake, and the
  // birthday category had nothing at all; café cakes still has sixteen others.
  {
    file: 'cake-red-velvet',
    source: 'file_00000000273c820aafa6d6c02a506e07.png',
    title: 'کیک رد ولوت',
    category: 'birthday-cakes',
    authentic: false,
  },
  {
    file: 'cake-chocolate',
    source: 'file_000000004040824386d7a709ca7fcc2e.png',
    title: 'کیک شکلاتی',
    category: 'cafe-cakes',
    authentic: false,
  },
  {
    file: 'cake-chocolate-layered',
    source: 'file_000000004188820a8d9bf32de8de601a.png',
    title: 'کیک شکلاتی لایه‌ای',
    category: 'cafe-cakes',
    authentic: false,
  },
  {
    file: 'cake-chocolate-moist',
    source: 'file_000000004d5c81f49862b9f304f13012.png',
    title: 'کیک شکلاتی خیس',
    category: 'cafe-cakes',
    authentic: false,
  },
  {
    file: 'cake-pumpkin-tins',
    source: 'file_00000000625c81f48f9fd0cbd8c4e944.png',
    title: 'کیک کدو',
    category: 'cafe-cakes',
    authentic: false,
  },
  {
    file: 'cake-raisin',
    source: 'file_0000000065848243bc67f1cbc50895c9.png',
    title: 'کیک کشمشی',
    category: 'cafe-cakes',
    authentic: false,
  },
  {
    file: 'cake-saffron-pistachio',
    source: 'file_000000006c607243b371efe45e571f3c.png',
    title: 'کیک زعفرانی پسته',
    category: 'cafe-cakes',
    authentic: false,
  },
  {
    file: 'muffin-carrot-chocolate',
    source: 'file_00000000786c81f48f0027c0b11eb2a9.png',
    title: 'مافین هویج و شکلات',
    category: 'cafe-cakes',
    authentic: false,
  },
  {
    file: 'cake-carrot',
    source: 'file_000000008cc482438f174c13c2e30b56.png',
    title: 'کیک هویج',
    category: 'cafe-cakes',
    authentic: false,
  },
  {
    file: 'cake-pumpkin',
    source: 'file_00000000c11c722f846c511612c0bd1d.png',
    title: 'کیک کدو حلوایی',
    category: 'cafe-cakes',
    authentic: false,
    needsBetterSource: 'متن تبلیغاتی روی عکس چاپ شده است',
  },
  {
    file: 'cake-chocolate-cream',
    source: 'file_00000000e5d481f4badc7803e6122025.png',
    title: 'کیک شکلاتی خامه‌ای',
    category: 'cafe-cakes',
    authentic: false,
  },
  {
    file: 'cake-coconut',
    source: 'file_00000000eacc8210b73441242de1c6d3.png',
    title: 'کیک نارگیلی',
    category: 'cafe-cakes',
    authentic: false,
  },

  // ---- Dry pastries ----
  {
    file: 'pastry-rice-cookie',
    source: 'IMG-20260706-WA0002.jpg',
    title: 'نان برنجی',
    category: 'dry-pastries',
    authentic: true,
    featured: true,
  },
  {
    file: 'pastry-coconut-balls',
    source: 'IMG_20260815_130528_912.jpg',
    title: 'نارگیلی',
    category: 'dry-pastries',
    authentic: true,
  },
  {
    file: 'pastry-baklava',
    source: 'file_0000000012ec71fb8ff3038b85478010.png',
    title: 'باقلوا',
    category: 'dry-pastries',
    authentic: false,
  },
  {
    file: 'pastry-nut-topped',
    source: 'file_00000000135c8243832fe94a3924cf72.png',
    title: 'شیرینی مغزدار',
    category: 'dry-pastries',
    authentic: false,
  },
  {
    file: 'pastry-rose-pistachio',
    source: 'file_000000001cc87246b619f73f707d0e93.png',
    title: 'شیرینی گل رز پسته‌ای',
    category: 'dry-pastries',
    authentic: false,
  },
  {
    file: 'pastry-walnut-tart',
    source: 'file_000000006bcc820aaf45418d2bc3588f.png',
    title: 'تارت گردویی',
    category: 'dry-pastries',
    authentic: false,
  },
  {
    file: 'pastry-jam-thumbprint',
    source: 'file_000000006d9c8246b454bf9ee4a8e53a.png',
    title: 'شیرینی مربایی',
    category: 'dry-pastries',
    authentic: false,
  },
  {
    file: 'pastry-coconut-bowl',
    source: 'file_00000000d45c720a992a20eed947fbdf.png',
    title: 'شیرینی نارگیلی',
    category: 'dry-pastries',
    authentic: false,
  },
  {
    file: 'pastry-rose-tray',
    source: 'file_00000000d9d471f4b66b44e9b5a1bb3e.png',
    title: 'شیرینی گل رز',
    category: 'dry-pastries',
    authentic: false,
  },

  // ---- Desserts ----
  {
    file: 'dessert-cups',
    source: 'IMG-20260801-WA0008.jpg',
    title: 'دسر لیوانی',
    category: 'desserts',
    authentic: true,
    featured: true,
  },
  {
    file: 'dessert-tiramisu-trays',
    source: 'file_000000009ff872469fa04344975a2e5b.png',
    title: 'تیرامیسو و دسر ظرفی',
    category: 'desserts',
    authentic: false,
  },
  {
    file: 'dessert-chocolate-cheesecake',
    source: 'file_00000000bb8881f4aed6e2c5f96b7c95.png',
    title: 'چیزکیک شکلاتی',
    category: 'desserts',
    authentic: false,
  },

  // ---- Gift packs ----
  {
    file: 'giftpack-colourful-box',
    source: 'Picsart_26-06-24_18-51-49-161.jpg',
    title: 'پک شیرینی رنگی',
    category: 'gift-packs',
    authentic: true,
    featured: true,
  },
  {
    file: 'giftpack-traditional-boxes',
    source: 'Picsart_26-06-27_23-39-52-687.jpg',
    title: 'جعبه شیرینی سنتی',
    category: 'gift-packs',
    authentic: true,
  },
  {
    file: 'giftpack-mixed-tray',
    source: 'file_00000000200871f792087f00e8c210ce.png',
    title: 'سینی شیرینی مخلوط',
    category: 'gift-packs',
    authentic: false,
  },
  {
    file: 'giftpack-party-tray',
    source: 'file_0000000038e871f7a449e9651a0a50d9.png',
    title: 'سینی شیرینی مجلسی',
    category: 'gift-packs',
    authentic: false,
  },

  // ---- Health-focused ----
  {
    file: 'healthy-energy-balls',
    source: 'file_000000007aa471fbb972c24ab529afff.png',
    title: 'توپک انرژی',
    category: 'healthy',
    authentic: false,
  },
]

export interface SeedProduct {
  title: string
  category: CategoryValue
  /** `file` of the `SEED_PHOTOS` entry whose media this product reuses. */
  photo: string
  description: string
  /**
   * Set when the photo is a stand-in rather than a picture of this product.
   * The client has no photos for these categories yet; until she sends some,
   * this is the one-line query that finds every product still using a
   * borrowed image.
   */
  borrowedPhoto?: string
}

/**
 * Five of the ten categories had no products, so the homepage card and the
 * `/products` filter both rendered empty. These give each one something real
 * to show — all products she actually sells, priced on request like the rest,
 * and all editable or deletable from the admin.
 */
export const SEED_PRODUCTS: SeedProduct[] = [
  {
    title: 'کیک تولد سفارشی',
    category: 'birthday-cakes',
    photo: 'cake-red-velvet',
    description: 'کیک تولد و مناسبتی، با طعم و تزیین دلخواه شما. برای سفارش تماس بگیرید.',
  },
  {
    title: 'کوکی خرمایی بدون شکر',
    category: 'diet-cookies',
    photo: 'cookie-date-filled',
    description: 'شیرین‌شده فقط با خرما، بدون شکر افزوده. مناسب رژیم و میان‌وعده کودکان.',
  },
  {
    title: 'توپک انرژی خرما و مغزها',
    category: 'healthy',
    photo: 'healthy-energy-balls',
    description: 'خرما، مغزها و پودر کاکائو؛ بدون شکر و بدون آرد. یک میان‌وعده پرانرژی.',
  },
  {
    title: 'کره بادام‌زمینی خانگی',
    category: 'spreads',
    photo: 'cookie-chocolate-jar',
    description: 'صددرصد بادام‌زمینی، بدون روغن پالم و شکر افزوده. در شیشه‌های درب‌دار.',
    borrowedPhoto: 'عکس محصول ندارد — از مشتری عکس شیشه ارده/عسل/کره بادام‌زمینی گرفته شود',
  },
  {
    title: 'معجون انرژی‌زا',
    category: 'sport-drinks',
    photo: 'cookie-coffee',
    description: 'معجون رژیمی و ورزشکاری با شیر، عسل و مغزها. تازه و به‌سفارش آماده می‌شود.',
    borrowedPhoto: 'عکس محصول ندارد — از مشتری عکس معجون در لیوان گرفته شود',
  },
]

/** The homepage hero. One of her own photos, deliberately. */
export const HERO_PHOTO = 'cake-fruit-nut'

/** Illustrates «درباره من». Also one of hers — the section is about her kitchen. */
export const ABOUT_PHOTO = 'cookie-chocolate-walnut'
