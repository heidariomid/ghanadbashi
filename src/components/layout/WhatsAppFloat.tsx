import { content } from '@/data/content'
import { cleanContactValue, whatsappHref } from '@/lib/contact'
import { getSiteSettings } from '@/lib/site-settings'

export async function WhatsAppFloat() {
  const settings = await getSiteSettings()
  const whatsapp = cleanContactValue(settings.contact?.whatsapp)
  const href = whatsapp ? whatsappHref(whatsapp) : null

  if (!href) return null

  return (
    <a
      href={href}
      dir="ltr"
      aria-label={content.whatsapp.floatingLabel}
      className="fixed bottom-6.5 inset-e-6.5 z-30 flex size-14.5 items-center justify-center rounded-full bg-card-foreground text-primary-foreground shadow-float transition-all duration-200 hover:-translate-y-0.5 hover:bg-primary"
    >
      <svg
        width="26"
        height="26"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z" />
      </svg>
    </a>
  )
}
