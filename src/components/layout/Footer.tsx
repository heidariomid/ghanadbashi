import { Container } from '@/components/layout/Container'
import { content } from '@/data/content'

export function Footer() {
  const { brand, footer } = content

  // Extra bottom room on phones so the floating WhatsApp button clears the text.
  return (
    <footer className="border-t border-border pt-10 pb-24 sm:py-10">
      <Container>
        <div className="flex flex-col items-start gap-2 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between sm:gap-x-6">
          <p className="text-brand font-black text-card-foreground">{brand.name}</p>
          <p className="text-caption text-muted-foreground">{footer.credit}</p>
        </div>
      </Container>
    </footer>
  )
}
