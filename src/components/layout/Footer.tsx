import { Container } from '@/components/layout/Container'
import { content } from '@/data/content'
import {
  cleanContactValue,
  instagramHref,
  phoneHref,
  whatsappHref,
} from '@/lib/contact'
import { faPhone } from '@/lib/format'
import { newTabProps } from '@/lib/links'
import { getSiteSettings } from '@/lib/site-settings'

export async function Footer() {
  const { brand, footer } = content
  const settings = await getSiteSettings()
  const brandName = settings?.brand?.brandName?.trim() || brand.name
  const tagline = settings?.brand?.tagline?.trim()
  const phone = cleanContactValue(settings?.contact?.phone)
  const whatsapp = cleanContactValue(settings?.contact?.whatsapp)
  const instagram = cleanContactValue(settings?.contact?.instagram)
  const serviceArea = cleanContactValue(settings?.contact?.serviceArea)
  const phoneLink = phone ? phoneHref(phone) : null
  const whatsappLink = whatsapp ? whatsappHref(whatsapp) : null
  const instagramLink = instagram ? instagramHref(instagram) : null
  const year = new Date().toLocaleString('fa-IR', { year: 'numeric' })
  const hasContact = phoneLink || whatsappLink || instagramLink || serviceArea

  // Extra bottom room on phones so the floating WhatsApp button clears the text.
  return (
    <footer className="border-t border-border pt-10 pb-24 sm:py-10">
      <Container>
        <div className="flex flex-col gap-7 lg:flex-row lg:items-start lg:justify-between lg:gap-10">
          <div>
            <p className="text-brand font-black text-card-foreground">{brandName}</p>
            {tagline ? (
              <p className="mt-2 text-caption text-muted-foreground">{tagline}</p>
            ) : null}
          </div>

          {hasContact ? (
            <div className="flex max-w-3xl flex-wrap items-center gap-x-6 gap-y-2 text-small text-muted-foreground">
              {phone && phoneLink ? (
                <a
                  href={phoneLink}
                  dir="ltr"
                  {...newTabProps}
                  aria-label={`${content.contact.channels.phone.label}: ${faPhone(phone)}`}
                  className="inline-flex min-h-11 items-center transition-colors duration-200 hover:text-primary-strong"
                >
                  {faPhone(phone)}
                </a>
              ) : null}
              {whatsapp && whatsappLink ? (
                <a
                  href={whatsappLink}
                  dir="ltr"
                  {...newTabProps}
                  aria-label={`${content.contact.channels.whatsapp.label}: ${faPhone(whatsapp)}`}
                  className="inline-flex min-h-11 items-center transition-colors duration-200 hover:text-primary-strong"
                >
                  {faPhone(whatsapp)}
                </a>
              ) : null}
              {instagram && instagramLink ? (
                <a
                  href={instagramLink}
                  {...newTabProps}
                  aria-label={`${content.contact.channels.instagram.label}: @${instagram.replace(/^@+/, '')}`}
                  className="inline-flex min-h-11 items-center transition-colors duration-200 hover:text-primary-strong"
                >
                  @{instagram.replace(/^@+/, '')}
                </a>
              ) : null}
              {serviceArea ? <span>{serviceArea}</span> : null}
            </div>
          ) : null}
        </div>

        <div className="mt-7 flex flex-col gap-2 border-t border-border pt-5 text-caption text-muted-foreground sm:flex-row sm:flex-wrap sm:items-center sm:justify-between sm:gap-x-6">
          <p>
            © {year} {brandName}
          </p>
          <p>{footer.credit}</p>
        </div>
      </Container>
    </footer>
  )
}
