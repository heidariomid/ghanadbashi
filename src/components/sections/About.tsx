import { Container } from '@/components/layout/Container'
import { Eyebrow } from '@/components/ui/Eyebrow'
import { Photo } from '@/components/ui/Photo'
import { content } from '@/data/content'

export function About() {
  const { eyebrow, title, paragraphs, signature, signatureRole, values, photo } =
    content.about

  return (
    <section id="about" className="bg-card py-section">
      <Container>
        <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-2 lg:gap-22">
          <div>
            <Eyebrow>{eyebrow}</Eyebrow>
            <h2 className="mt-5.5 text-h1 font-black text-card-foreground text-balance">
              {title}
            </h2>

            {paragraphs.map((paragraph, index) => (
              <p
                key={paragraph.slice(0, 24)}
                className={`max-w-[60ch] text-body leading-[1.9] text-muted-foreground ${
                  index === 0 ? 'mt-7' : 'mt-5'
                }`}
              >
                {paragraph}
              </p>
            ))}

            <div className="mt-10 flex items-center gap-4">
              <span className="h-px w-10 bg-border" />
              <span className="text-body font-semibold text-card-foreground">
                {signature}
              </span>
              <span className="text-caption text-muted-foreground">{signatureRole}</span>
            </div>

            <ul className="mt-11 grid grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-x-8 gap-y-1">
              {values.map((value) => (
                <li key={value.title} className="border-t border-border py-5">
                  <h3 className="text-[0.9375rem] font-semibold text-card-foreground">
                    {value.title}
                  </h3>
                  <p className="mt-1.5 text-tiny text-muted-foreground">
                    {value.description}
                  </p>
                </li>
              ))}
            </ul>
          </div>

          <Photo
            photo={photo}
            sizes="(max-width: 1024px) 100vw, 45vw"
            className="aspect-4/5 w-full rounded-3xl shadow-portrait"
          />
        </div>
      </Container>
    </section>
  )
}
