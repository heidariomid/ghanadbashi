import { Container } from '@/components/layout/Container'
import { SectionIntro } from '@/components/ui/SectionIntro'
import { content } from '@/data/content'
import {
  cleanContactValue,
  instagramHref,
  phoneHref,
  whatsappHref,
} from '@/lib/contact'
import { faPhone } from '@/lib/format'
import { isExternalHref, newTabProps } from '@/lib/links'
import { getSiteSettings } from '@/lib/site-settings'

interface ContactChannel {
  id: string
  label: string
  value: string
  note: string
  href?: string
  dir?: 'ltr'
}

export async function Contact() {
  const { eyebrow, title, description, channels: copy } = content.contact
  const settings = await getSiteSettings()
  const phone = cleanContactValue(settings?.contact?.phone)
  const whatsapp = cleanContactValue(settings?.contact?.whatsapp)
  const instagram = cleanContactValue(settings?.contact?.instagram)
  const serviceArea = cleanContactValue(settings?.contact?.serviceArea)
  const channels: ContactChannel[] = []

  const phoneLink = phone ? phoneHref(phone) : null
  if (phone && phoneLink) {
    channels.push({
      id: 'phone',
      ...copy.phone,
      value: faPhone(phone),
      href: phoneLink,
      dir: 'ltr',
    })
  }

  const whatsappLink = whatsapp ? whatsappHref(whatsapp) : null
  if (whatsapp && whatsappLink) {
    channels.push({
      id: 'whatsapp',
      ...copy.whatsapp,
      value: faPhone(whatsapp),
      href: whatsappLink,
      dir: 'ltr',
    })
  }

  const instagramLink = instagram ? instagramHref(instagram) : null
  if (instagram && instagramLink) {
    channels.push({
      id: 'instagram',
      ...copy.instagram,
      value: `@${instagram.replace(/^@+/, '')}`,
      href: instagramLink,
    })
  }

  if (serviceArea) {
    channels.push({
      id: 'service-area',
      ...copy.serviceArea,
      value: serviceArea,
    })
  }

  return (
    <section id="contact" className="py-section">
      <Container>
        <SectionIntro eyebrow={eyebrow} title={title} description={description} />

        {channels.length > 0 ? (
          <dl className="mt-11 grid grid-cols-[repeat(auto-fit,minmax(220px,1fr))] gap-7 md:mt-18 md:gap-11">
            {channels.map((channel) => (
              <div key={channel.id} className="border-t border-border pt-5.5">
                <dt className="text-caption text-muted-foreground">{channel.label}</dt>
                <dd className="mt-2">
                  {channel.href ? (
                    <a
                      href={channel.href}
                      dir={channel.dir}
                      {...(isExternalHref(channel.href) ? newTabProps : {})}
                      className="inline-flex min-h-11 items-center text-h3 font-semibold text-card-foreground transition-colors duration-200 hover:text-primary"
                    >
                      {channel.value}
                    </a>
                  ) : (
                    <span className="inline-flex min-h-11 items-center text-h3 font-semibold text-card-foreground">
                      {channel.value}
                    </span>
                  )}
                  <p className="mt-1.5 text-tiny text-muted-foreground">{channel.note}</p>
                </dd>
              </div>
            ))}
          </dl>
        ) : null}
      </Container>
    </section>
  )
}
