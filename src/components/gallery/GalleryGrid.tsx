'use client'

import Image from 'next/image'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
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
  /**
   * Preload the first photo. Only true where the grid starts near the top of
   * the page; on the homepage it sits far below the hero, which owns the
   * preload slot.
   */
  priorityFirst?: boolean
}

const ALL = 'all'

export function GalleryGrid({ photos, categories, priorityFirst = false }: GalleryGridProps) {
  const [active, setActive] = useState<string>(ALL)
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  const visible = useMemo(
    () => (active === ALL ? photos : photos.filter((photo) => photo.category === active)),
    [active, photos],
  )

  const dialogRef = useRef<HTMLDivElement>(null)
  const isOpen = openIndex !== null

  const close = useCallback(() => setOpenIndex(null), [])

  const step = useCallback(
    (delta: number) =>
      setOpenIndex((current) =>
        current === null ? null : (current + delta + visible.length) % visible.length,
      ),
    [visible.length],
  )

  // Keyed on `isOpen`, not `openIndex`: stepping to the next photo keeps the
  // same dialog open, and re-running this would hand focus back to the grid.
  useEffect(() => {
    if (!isOpen) return

    const opener = document.activeElement as HTMLElement | null
    const { overflow } = document.body.style
    document.body.style.overflow = 'hidden'
    focusableButtons(dialogRef.current)[0]?.focus()

    return () => {
      document.body.style.overflow = overflow
      opener?.focus()
    }
  }, [isOpen])

  useEffect(() => {
    if (!isOpen) return

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') close()
      // The grid reads right-to-left, so the next photo sits to the left.
      if (event.key === 'ArrowLeft') step(1)
      if (event.key === 'ArrowRight') step(-1)
      if (event.key === 'Tab') trapTab(event, dialogRef.current)
    }

    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [isOpen, close, step])

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
                    ? 'bg-primary text-primary-foreground'
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
                  preload={priorityFirst && index === 0}
                  fetchPriority={priorityFirst && index === 0 ? 'high' : undefined}
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
          ref={dialogRef}
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
            className="absolute inset-e-4 top-4 flex size-11 items-center justify-center rounded-full bg-white/10 text-white transition-colors duration-200 hover:bg-white/20"
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

/** Close plus the two arrows — every control the lightbox renders. */
function focusableButtons(dialog: HTMLElement | null): HTMLElement[] {
  return Array.from(dialog?.querySelectorAll<HTMLElement>('button') ?? [])
}

/** Keep Tab inside the open lightbox instead of walking the page behind it. */
function trapTab(event: KeyboardEvent, dialog: HTMLElement | null) {
  const buttons = focusableButtons(dialog)
  if (buttons.length === 0) return

  const first = buttons[0]
  const last = buttons[buttons.length - 1]
  const current = document.activeElement
  const outside = !dialog?.contains(current)

  if (event.shiftKey && (outside || current === first)) {
    event.preventDefault()
    last.focus()
  } else if (!event.shiftKey && (outside || current === last)) {
    event.preventDefault()
    first.focus()
  }
}

const navInsetClass = {
  start: 'inset-s-4',
  end: 'inset-e-4',
} as const

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
      className={`absolute ${navInsetClass[side]} top-1/2 flex size-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-2xl text-white transition-colors duration-200 hover:bg-white/20`}
    >
      {side === 'start' ? '‹' : '›'}
    </button>
  )
}
