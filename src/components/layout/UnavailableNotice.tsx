import { Container } from '@/components/layout/Container'
import { Button } from '@/components/ui/Button'
import { content } from '@/data/content'

export function UnavailableNotice() {
  const { title, description, retry } = content.unavailable

  return (
    <main className="flex min-h-[calc(100dvh-var(--spacing-nav))] flex-col justify-center bg-card py-section">
      <Container>
        <div className="mx-auto max-w-xl text-center">
          <h1 className="text-h1 font-black text-card-foreground text-balance">{title}</h1>
          <p className="mt-5.5 text-body text-muted-foreground">{description}</p>
          <Button href="/" size="lg" className="mt-10">
            {retry}
          </Button>
        </div>
      </Container>
    </main>
  )
}