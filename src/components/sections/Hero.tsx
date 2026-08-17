import { Container } from '@/components/layout/Container'
import { Button } from '@/components/ui/Button'
import { Eyebrow } from '@/components/ui/Eyebrow'
import { Photo } from '@/components/ui/Photo'
import { content } from '@/data/content'

export function Hero() {
  const { brand, primaryCta } = content

  return (
    <section className="pt-12 pb-section md:pt-24">
      <Container>
        <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-2 lg:gap-20">
          <div className="animate-rise">
            <Eyebrow>{brand.eyebrow}</Eyebrow>

            <h1 className="mt-7 text-display font-black text-card-foreground text-balance">
              {brand.name}
            </h1>
            <p className="mt-5 text-h2 font-medium">{brand.tagline}</p>
            <p className="mt-7 max-w-[34rem] text-lead text-muted-foreground">
              {brand.intro}
            </p>

            <div className="mt-10 flex flex-wrap items-center gap-5">
              <Button href={primaryCta.href} size="lg">
                {primaryCta.label}
              </Button>
              <Button href="#products" variant="outline" size="lg">
                مشاهده محصولات
              </Button>
            </div>

            <p className="mt-10 flex items-center gap-3 text-caption text-muted-foreground">
              <span className="inline-block h-px w-8 bg-border" />
              {brand.heroNote}
            </p>
          </div>

          <div className="relative animate-rise-slow">
            {/* blush blob, tucked behind the portrait and spilling past its start edge */}
            <div className="absolute -bottom-[8%] -start-[6%] end-[12%] h-[62%] rounded-4xl bg-blob-pink/55" />

            <Photo
              photo={brand.heroPhoto}
              priority
              sizes="(max-width: 1024px) 100vw, 45vw"
              className="relative aspect-4/5 w-full rounded-3xl shadow-portrait"
            />

            <div className="relative mt-[-34px] me-auto w-fit rounded-4xl border border-border bg-card px-6.5 py-3 text-tiny text-muted-foreground shadow-warm">
              {brand.heroBadge}
            </div>
          </div>
        </div>
      </Container>
    </section>
  )
}
