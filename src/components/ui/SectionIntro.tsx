import { Eyebrow } from './Eyebrow'

interface SectionIntroProps {
  eyebrow: string
  title: string
  description: string
}

/** Heading on the inline start, supporting line pushed to the end. */
export function SectionIntro({ eyebrow, title, description }: SectionIntroProps) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-6">
      <div>
        <Eyebrow>{eyebrow}</Eyebrow>
        <h2 className="mt-5.5 text-h1 font-black text-card-foreground text-balance">
          {title}
        </h2>
      </div>
      <p className="max-w-96 text-body text-muted-foreground">{description}</p>
    </div>
  )
}
