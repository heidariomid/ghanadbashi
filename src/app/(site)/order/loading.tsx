import { Container } from '@/components/layout/Container'
import { content } from '@/data/content'

export default function OrderLoading() {
  return (
    <main className="flex min-h-[calc(100dvh-var(--spacing-nav))] flex-col">
      <section className="flex flex-1 flex-col justify-center bg-card py-section">
        <Container>
          <div className="mx-auto flex max-w-xl flex-col items-center justify-center py-16 text-center md:py-24">
            <span
              aria-hidden="true"
              className="size-8 animate-spin rounded-full border-2 border-primary/30 border-t-primary motion-reduce:animate-none"
            />
            <p className="mt-4 text-body text-muted-foreground">{content.orderForm.loading}</p>
          </div>
        </Container>
      </section>
    </main>
  )
}
