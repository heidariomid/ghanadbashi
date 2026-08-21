import { Container } from '@/components/layout/Container'
import { Button } from '@/components/ui/Button'
import { Eyebrow } from '@/components/ui/Eyebrow'
import { content } from '@/data/content'
import { cleanContactValue, phoneHref } from '@/lib/contact'
import { faNumber } from '@/lib/format'
import { getSiteSettings } from '@/lib/site-settings'

export async function OrderCta() {
  const { eyebrow, title, description, primary, secondary, steps } = content.orderCta
  const settings = await getSiteSettings()
  const phone = cleanContactValue(settings?.contact?.phone)
  const phoneLink = phone ? phoneHref(phone) : null

  return (
    <section id="order" className="bg-secondary py-section">
      <Container>
        <div className="mx-auto max-w-2xl text-center">
          <Eyebrow tone="onSecondary" className="justify-center">
            {eyebrow}
          </Eyebrow>
          <h2 className="mt-5.5 text-h1 font-black text-secondary-foreground text-balance">
            {title}
          </h2>
          <p className="mx-auto mt-5.5 max-w-136 text-body leading-[1.9] text-secondary-foreground/85">
            {description}
          </p>

          <div className="mt-10 flex flex-wrap items-center justify-center gap-4.5">
            <Button href="/order" size="lg">
              {primary}
            </Button>
            {phoneLink ? (
              <Button href={phoneLink} dir="ltr" variant="outline" size="lg">
                {secondary}
              </Button>
            ) : null}
          </div>
        </div>

        <ol className="mx-auto mt-13 grid max-w-232 grid-cols-[repeat(auto-fit,minmax(220px,1fr))] gap-6 md:mt-22 md:gap-10">
          {steps.map((step, index) => (
            <li key={step} className="border-t border-secondary-foreground/20 pt-5.5">
              <span className="text-caption text-primary-strong">{faNumber(index + 1)}</span>
              <p className="mt-3 text-[0.9375rem] leading-[1.75] text-secondary-foreground">
                {step}
              </p>
            </li>
          ))}
        </ol>
      </Container>
    </section>
  )
}
