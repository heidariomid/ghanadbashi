'use client'

import Image from 'next/image'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { categoryLabel } from '@/lib/categories'
import { CloseIcon } from '@/components/ui/icons'

export interface GalleryPhoto {
  id: string
  category: string
  caption: string
  src: string
  alt: string
}

interface GalleryGridProps {
  photos: GalleryPhoto[]
  /** Only categories that actually have photos, already in display order. */
  categories: string[]
}

const ALL = 'all'

export function GalleryGrid({ photos, categories }: GalleryGridProps) {
  const [active, setActive] = useState<string>(ALL)
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  const visible = useMemo(
    () => (active === ALL ? photos : photos.filter((photo) => photo.category === active)),
    [active, photos],
  )

  const close = useCallback(() => setOpenIndex(null), [])

  const step = useCallback(
    (delta: number) =>
      setOpenIndex((current) =>
        current === null ? null : (current + delta + visible.length) % visible.length,
      ),
    [visible.length],
  )

  useEffect(() => {
    if (openIndex === null) return

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') close()
      // The grid reads right-to-left, so the next photo sits to the left.
      if (event.key === 'ArrowLeft') step(1)
      if (event.key === 'ArrowRight') step(-1)
    }

    document.addEventListener('keydown', onKeyDown)
    const { overflow } = document.body.style
    document.body.style.overflow = 'hidden'

    return () => {
      document.removeEventListener('keydown', onKeyDown)
      document.body.style.overflow = overflow
    }
  }, [openIndex, close, step])

  const openPhoto = openIndex === null ? null : visible[openIndex]

  return (
    <>
      {categories.length > 1 && (
        <div
          role="tablist"
          aria-label="فیلتر دسته‌بندی"
          className="mt-8 flex flex-wrap justify-center gap-2 sm:mt-10 sm:gap-3"
        >
          {[ALL, ...categories].map((category) => {
            const isActive = category === active
            return (
              <button
                key={category}
                type="button"
                role="tab"
                aria-selected={isActive}
                onClick={() => setActive(category)}
                className={`min-h-11 rounded-full px-4 text-small transition-colors duration-200 sm:px-5 ${
                  isActive
                    ? 'bg-primary text-white'
                    : 'bg-card text-muted-foreground hover:text-card-foreground'
                }`}
              >
                {category === ALL ? 'همه' : categoryLabel(category)}
              </button>
            )
          })}
        </div>
      )}

      <ul className="mt-8 grid grid-cols-2 gap-4 sm:mt-11 sm:gap-5 lg:grid-cols-3 lg:gap-8">
        {visible.map((photo, index) => (
          <li key={photo.id}>
            <button
              type="button"
              onClick={() => setOpenIndex(index)}
              className="group block w-full text-start"
              aria-label={`بزرگ‌نمایی ${photo.caption || photo.alt}`}
            >
              <div className="relative aspect-square w-full overflow-hidden rounded-xl sm:rounded-2xl">
                <Image
                  src={photo.src}
                  alt={photo.alt}
                  fill
                  sizes="(max-width: 640px) 45vw, (max-width: 1024px) 45vw, 30vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>
              {photo.caption && (
                <p className="mt-3 text-caption text-muted-foreground">{photo.caption}</p>
              )}
            </button>
          </li>
        ))}
      </ul>

      {openPhoto && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={openPhoto.caption || openPhoto.alt}
          // Solid rather than a translucent black: a see-through backdrop
          // competes with the photo, and its alpha renders inconsistently.
          className="fixed inset-0 z-50 flex items-center justify-center bg-[#1b1714] p-4"
          onClick={close}
        >
          <button
            type="button"
            onClick={close}
            aria-label="بستن"
            className="absolute end-4 top-4 flex size-11 items-center justify-center rounded-full bg-white/10 text-white transition-colors duration-200 hover:bg-white/20"
          >
            <CloseIcon className="size-5" />
          </button>

          <figure
            className="max-h-full w-full max-w-4xl"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="relative mx-auto aspect-4/5 max-h-[78vh] w-full sm:aspect-3/2">
              <Image
                src={openPhoto.src}
                alt={openPhoto.alt}
                fill
                sizes="(max-width: 1024px) 100vw, 900px"
                className="rounded-xl object-contain"
              />
            </div>
            {openPhoto.caption && (
              <figcaption className="mt-4 text-center text-small text-white/80">
                {openPhoto.caption}
              </figcaption>
            )}
          </figure>

          {visible.length > 1 && (
            <>
              <NavButton side="start" label="عکس قبلی" onClick={() => step(-1)} />
              <NavButton side="end" label="عکس بعدی" onClick={() => step(1)} />
            </>
          )}
        </div>
      )}
    </>
  )
}

function NavButton({
  side,
  label,
  onClick,
}: {
  side: 'start' | 'end'
  label: string
  onClick: () => void
}) {
  return (
    <button
      type="button"
      aria-label={label}
      onClick={(event) => {
        event.stopPropagation()
        onClick()
      }}
      className={`absolute top-1/2 flex size-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-2xl text-white transition-colors duration-200 hover:bg-white/20 ${
        side === 'start' ? 'start-4' : 'end-4'
      }`}
    >
      {side === 'start' ? '‹' : '›'}
    </button>
  )
}
