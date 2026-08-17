import { Container } from '@/components/layout/Container'
import { Button } from '@/components/ui/Button'
import { Eyebrow } from '@/components/ui/Eyebrow'
import { content } from '@/data/content'
import { faNumber } from '@/lib/format'

export function OrderCta() {
  const { eyebrow, title, description, primary, secondary, steps } = content.orderCta
  const { whatsapp, phoneHref } = content

  return (
    <section id="order" className="bg-secondary py-section">
      <Container>
        <div className="mx-auto max-w-[42rem] text-center">
          <Eyebrow tone="onSecondary" className="justify-center">
            {eyebrow}
          </Eyebrow>
          <h2 className="mt-5.5 text-h1 font-black text-secondary-foreground text-balance">
            {title}
          </h2>
          <p className="mx-auto mt-5.5 max-w-[34rem] text-body leading-[1.9] text-secondary-foreground/85">
            {description}
          </p>

          <div className="mt-10 flex flex-wrap items-center justify-center gap-4.5">
            <Button href={whatsapp.href} size="lg">
              {primary}
            </Button>
            <Button href={phoneHref} variant="outline" size="lg">
              {secondary}
            </Button>
          </div>
        </div>

        <ol className="mx-auto mt-13 grid max-w-[58rem] grid-cols-[repeat(auto-fit,minmax(220px,1fr))] gap-6 md:mt-22 md:gap-10">
          {steps.map((step, index) => (
            <li key={step} className="border-t border-secondary-foreground/20 pt-5.5">
              <span className="text-caption text-primary">{faNumber(index + 1)}</span>
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
