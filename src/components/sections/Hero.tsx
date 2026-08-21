import { Container } from '@/components/layout/Container'
import { Button } from '@/components/ui/Button'
import { Eyebrow } from '@/components/ui/Eyebrow'
import { Photo } from '@/components/ui/Photo'
import { Typewriter } from '@/components/ui/Typewriter'
import { content } from '@/data/content'
import { resolveImage } from '@/lib/media'
import { getSiteSettings } from '@/lib/site-settings'

export async function Hero() {
  const { brand, primaryCta } = content

  const settings = await getSiteSettings()

  const name = settings?.brand?.brandName?.trim() || brand.name
  const tagline = settings?.brand?.tagline?.trim()
  const heroPhoto = resolveImage(settings?.brand?.heroImage)

  const rotatingPrefix = settings?.brand?.rotatingPrefix?.trim()
  const rotatingWords =
    settings?.brand?.rotatingWords
      ?.map((entry) => entry.word?.trim())
      .filter((word): word is string => Boolean(word)) ?? []

  return (
    <section className="pt-12 pb-section md:pt-24">
      <Container>
        <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-2 lg:gap-20">
          {/* Each line rises a beat after the one above it, so the column reads
              top to bottom on first paint instead of arriving all at once. */}
          <div>
            <div className="animate-rise [animation-delay:120ms]">
              <Eyebrow>{brand.eyebrow}</Eyebrow>
            </div>

            <h1 className="mt-7 animate-rise text-display font-black text-card-foreground text-balance [animation-delay:240ms]">
              {name}
            </h1>

            <div className="animate-rise [animation-delay:360ms]">
              {tagline ? <p className="mt-5 text-h2 font-medium">{tagline}</p> : null}
              {rotatingWords.length > 0 ? (
                <Typewriter
                  words={rotatingWords}
                  prefix={rotatingPrefix || undefined}
                  className="mt-4 text-lead"
                />
              ) : null}
            </div>

            <p className="mt-7 max-w-136 animate-rise text-lead text-muted-foreground [animation-delay:480ms]">
              {brand.intro}
            </p>

            <div className="mt-10 flex animate-rise flex-wrap items-center gap-5 [animation-delay:600ms]">
              <Button href={primaryCta.href} size="lg">
                {primaryCta.label}
              </Button>
              <Button href="/products" variant="outline" size="lg">
                مشاهده محصولات
              </Button>
            </div>

            <p className="mt-10 flex animate-rise items-center gap-3 text-caption text-muted-foreground [animation-delay:720ms]">
              <span className="inline-block h-px w-8 bg-border" />
              {brand.heroNote}
            </p>
          </div>

          <div className="relative animate-rise-slow">
            {/* blush blob, tucked behind the portrait and spilling past its start edge */}
            <div
              aria-hidden="true"
              className="absolute inset-be-[-8%] inset-s-[-6%] inset-e-[12%] h-[62%] animate-blob bg-blob-pink/55"
            />
            {/* smaller counterweight at the opposite corner, off its own clock */}
            <div
              aria-hidden="true"
              className="absolute inset-bs-[-5%] inset-e-[-6%] size-32 animate-blob-slow bg-secondary/45 md:size-44"
            />

            {/* photo and badge drift together; the blobs stay put behind them */}
            <div className="relative animate-float">
              {heroPhoto ? (
                <Photo
                  photo={heroPhoto}
                  priority
                  sizes="(max-width: 1024px) 100vw, 45vw"
                  className="aspect-4/5 w-full rounded-3xl shadow-portrait"
                />
              ) : (
                <div
                  aria-hidden="true"
                  className="aspect-4/5 w-full rounded-3xl bg-secondary shadow-portrait"
                />
              )}

              <div className="relative -mt-8.5 me-auto w-fit rounded-4xl border border-border bg-card px-6.5 py-3 text-tiny text-muted-foreground shadow-warm">
                {brand.heroBadge}
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  )
}
