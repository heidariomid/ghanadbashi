import { Container } from '@/components/layout/Container'
import { SectionIntro } from '@/components/ui/SectionIntro'
import { content } from '@/data/content'
import { faPhone } from '@/lib/format'

export function Contact() {
  const { eyebrow, title, description, channels } = content.contact

  return (
    <section id="contact" className="py-section">
      <Container>
        <SectionIntro eyebrow={eyebrow} title={title} description={description} />

        <dl className="mt-11 grid grid-cols-[repeat(auto-fit,minmax(220px,1fr))] gap-7 md:mt-18 md:gap-11">
          {channels.map((channel) => {
            const display = channel.localizeDigits
              ? faPhone(channel.value)
              : channel.value

            return (
              <div key={channel.id} className="border-t border-border pt-5.5">
                <dt className="text-caption text-muted-foreground">{channel.label}</dt>
                <dd className="mt-2">
                  {channel.href ? (
                    <a
                      href={channel.href}
                      dir="ltr"
                      className="inline-flex min-h-11 items-center text-h3 font-semibold text-card-foreground transition-colors duration-200 hover:text-primary"
                    >
                      {display}
                    </a>
                  ) : (
                    <span className="inline-flex min-h-11 items-center text-h3 font-semibold text-card-foreground">
                      {display}
                    </span>
                  )}
                  {channel.note ? (
                    <p className="mt-1.5 text-tiny text-muted-foreground">
                      {channel.note}
                    </p>
                  ) : null}
                </dd>
              </div>
            )
          })}
        </dl>
      </Container>
    </section>
  )
}
