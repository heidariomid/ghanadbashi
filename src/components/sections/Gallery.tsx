import { Container } from '@/components/layout/Container'
import { Photo } from '@/components/ui/Photo'
import { SectionIntro } from '@/components/ui/SectionIntro'
import { content } from '@/data/content'

export function Gallery() {
  const { eyebrow, title, description, items } = content.gallery

  return (
    <section id="gallery" className="py-section">
      <Container>
        <SectionIntro eyebrow={eyebrow} title={title} description={description} />

        {/* Even square grid on phones so rows line up; the uneven masonry, which
            needs width to read as composition, starts at lg. */}
        <div className="mt-9 grid grid-cols-2 gap-4 sm:mt-11 sm:gap-5 lg:block lg:columns-3 lg:gap-8 md:mt-20">
          {items.map((item) => (
            <figure key={item.id} className="break-inside-avoid lg:mb-8">
              <Photo
                photo={item.photo}
                sizes="(max-width: 1024px) 45vw, 30vw"
                className={`aspect-square ${item.aspectLg} w-full rounded-xl sm:rounded-2xl`}
                imageClassName="transition-transform duration-500 hover:scale-105"
              />
              <figcaption className="mt-3 text-caption text-muted-foreground">
                {item.caption}
              </figcaption>
            </figure>
          ))}
        </div>
      </Container>
    </section>
  )
}
