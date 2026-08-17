import { Container } from '@/components/layout/Container'
import { Photo } from '@/components/ui/Photo'
import { SectionIntro } from '@/components/ui/SectionIntro'
import { content } from '@/data/content'

export function Categories() {
  const { eyebrow, title, description, items } = content.categories

  return (
    <section id="categories" className="pb-section">
      <Container>
        <SectionIntro eyebrow={eyebrow} title={title} description={description} />

        {/* two-up on phones: seven full-width squares is far too much scrolling */}
        <ul className="mt-9 grid grid-cols-2 gap-x-4 gap-y-8 sm:mt-11 sm:grid-cols-[repeat(auto-fit,minmax(230px,1fr))] sm:gap-7 md:mt-18 md:gap-11">
          {items.map((category) => (
            <li key={category.id}>
              <a href="#products" className="group block">
                <Photo
                  photo={category.photo}
                  sizes="(max-width: 640px) 45vw, (max-width: 1024px) 45vw, 25vw"
                  className="aspect-square w-full rounded-xl sm:rounded-2xl"
                  imageClassName="transition-transform duration-500 group-hover:scale-105"
                />
                <h3 className="mt-4 text-small font-semibold text-card-foreground transition-colors duration-200 group-hover:text-primary sm:mt-5 sm:text-[1.0625rem]">
                  {category.title}
                </h3>
                <p className="mt-1.5 text-tiny text-muted-foreground sm:mt-2 sm:text-small">
                  {category.description}
                </p>
              </a>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  )
}
