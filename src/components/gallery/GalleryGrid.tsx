'use client'

import Image from 'next/image'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { AddToCartButton } from '@/components/cart/AddToCartButton'
import { CloseIcon } from '@/components/ui/icons'
import { content } from '@/data/content'
import { cartGalleryFrom } from '@/lib/cart'
import { categoryLabel } from '@/lib/categories'
import type { GalleryPhoto } from '@/lib/gallery'

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
  /** Active filter from `?category=`. `undefined` means «همه». */
  category?: string
  /** When set, chips are links on this path instead of local-state buttons. */
  filterBasePath?: string
}

const ALL = 'all'

function resolveActive(category: string | undefined, categories: string[]): string {
  if (category && categories.includes(category)) return category
  return ALL
}

export function GalleryGrid({
  photos,
  categories,
  priorityFirst = false,
  category,
  filterBasePath,
}: GalleryGridProps) {
  const urlActive = resolveActive(category, categories)
  const [localActive, setLocalActive] = useState<string>(ALL)
  const [openIndex, setOpenIndex] = useState<number | null>(null)
  const active = filterBasePath ? urlActive : localActive

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
        <nav
          role={filterBasePath ? undefined : 'tablist'}
          aria-label="فیلتر دسته‌بندی"
          className="mt-8 flex flex-wrap justify-center gap-2 sm:mt-10 sm:gap-3"
        >
          {[ALL, ...categories].map((value) => {
            const isActive = value === active
            const label = value === ALL ? 'همه' : categoryLabel(value)
            const className = `min-h-11 rounded-full border px-4 text-small transition-colors duration-200 sm:px-5 ${
              isActive
                ? 'border-primary bg-primary text-primary-foreground'
                : 'border-border text-muted-foreground hover:border-input hover:text-card-foreground'
            }`

            if (filterBasePath) {
              const href = value === ALL ? filterBasePath : `${filterBasePath}?category=${value}`
              return (
                <a
                  key={value}
                  href={href}
                  aria-current={isActive ? 'page' : undefined}
                  className={`inline-flex items-center ${className}`}
                >
                  {label}
                </a>
              )
            }

            return (
              <button
                key={value}
                type="button"
                role="tab"
                aria-selected={isActive}
                onClick={() => setLocalActive(value)}
                className={className}
              >
                {label}
              </button>
            )
          })}
        </nav>
      )}

      <ul className="mt-8 grid grid-cols-2 gap-4 sm:mt-11 sm:gap-5 lg:grid-cols-3 lg:gap-8">
        {visible.map((photo, index) => (
          <li key={photo.id} className="flex flex-col">
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
                  className={`object-cover transition-transform duration-500 group-hover:scale-105 ${
                    photo.available ? '' : 'grayscale'
                  }`}
                />
                {photo.available ? null : (
                  <span className="absolute inset-s-2 top-2 rounded-full bg-card/95 px-2.5 py-1 text-caption text-muted-foreground shadow-warm sm:inset-s-3 sm:top-3 sm:px-3 sm:py-1.5">
                    {content.gallery.unavailable}
                  </span>
                )}
              </div>
            </button>
            {photo.caption ? (
              <p className="mt-3 text-caption text-muted-foreground">{photo.caption}</p>
            ) : null}
            {photo.available ? <AddToCartButton product={cartGalleryFrom(photo)} /> : null}
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
