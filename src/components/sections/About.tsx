import { RichText } from '@payloadcms/richtext-lexical/react'

import { Container } from '@/components/layout/Container'
import { Eyebrow } from '@/components/ui/Eyebrow'
import { Photo } from '@/components/ui/Photo'
import { content } from '@/data/content'
import { resolveImage } from '@/lib/media'
import { getSiteSettings } from '@/lib/site-settings'
import type { SiteSetting } from '@/payload-types'

type AboutText = SiteSetting['brand']['aboutText']

function hasRichTextContent(value: AboutText): value is NonNullable<AboutText> {
  function hasContent(node: unknown): boolean {
    if (!node || typeof node !== 'object') return false

    const record = node as Record<string, unknown>
    if (typeof record.text === 'string' && record.text.trim()) return true
    if (Array.isArray(record.children) && record.children.some(hasContent)) return true

    return record.type === 'upload' || record.type === 'block' || record.type === 'horizontalrule'
  }

  return Boolean(value && hasContent(value.root))
}

export async function About() {
  const { eyebrow, title, signature, signatureRole, values } = content.about

  const settings = await getSiteSettings()
  const photo = resolveImage(settings.brand?.aboutImage)
  const aboutText = settings.brand?.aboutText
  const hasAboutText = hasRichTextContent(aboutText)

  if (!hasAboutText && !photo) return null

  return (
    <section id="about" className="bg-card py-section">
      <Container>
        <div
          className={`grid grid-cols-1 items-center gap-10 ${
            photo ? 'lg:grid-cols-2 lg:gap-22' : ''
          }`}
        >
          <div>
            <Eyebrow>{eyebrow}</Eyebrow>
            <h2 className="mt-5.5 text-h1 font-black text-card-foreground text-balance">
              {title}
            </h2>

            {hasAboutText ? (
              <RichText
                data={aboutText}
                className="mt-7 max-w-[60ch] text-body leading-[1.9] text-muted-foreground [&_a]:text-primary [&_a]:underline [&_li]:ms-5 [&_li]:list-disc [&_p:not(:first-child)]:mt-5"
              />
            ) : null}

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

          {photo && (
            <Photo
              photo={photo}
              sizes="(max-width: 1024px) 100vw, 45vw"
              className="aspect-4/5 w-full rounded-3xl shadow-portrait"
            />
          )}
        </div>
      </Container>
    </section>
  )
}
