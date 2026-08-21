'use client'

import { useEffect, useState } from 'react'

import { CloseIcon, MenuIcon } from '@/components/ui/icons'
import type { NavItem } from '@/data/content'
import { newTabProps } from '@/lib/links'

interface MobileNavProps {
  items: NavItem[]
  primaryCta: NavItem
  whatsapp?: { label: string; href: string }
  brandName: string
}

export function MobileNav({ items, primaryCta, whatsapp, brandName }: MobileNavProps) {
  const [open, setOpen] = useState(false)

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [open])

  useEffect(() => {
    if (!open) return
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open])

  const drawer = (
    <div
      className={`fixed inset-0 z-50 overflow-hidden md:hidden ${
        open ? '' : 'pointer-events-none'
      }`}
    >
      <div
        onClick={() => setOpen(false)}
        aria-hidden={!open}
        className={`absolute inset-0 bg-card-foreground/25 transition-opacity duration-500 ${
          open ? 'opacity-100' : 'opacity-0'
        }`}
      />

      {/* anchored to the inline start, which is the right edge in RTL */}
      <aside
        // See CartDrawer: off-canvas links stay tabbable under aria-hidden.
        inert={!open}
        className={`absolute inset-y-0 inset-s-0 flex w-[86%] max-w-sm flex-col bg-card transition-transform duration-500 ease-rise ${
          open ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between border-b border-border px-6 py-5">
          <span className="text-brand font-black text-card-foreground">{brandName}</span>
          <button
            type="button"
            onClick={() => setOpen(false)}
            aria-label="بستن منو"
            className="flex size-11 items-center justify-center text-card-foreground transition-colors duration-200 hover:text-primary-strong"
          >
            <CloseIcon className="size-6" />
          </button>
        </div>

        <nav className="flex flex-col px-6 py-4">
          {items.map((item) => (
            <a
              key={item.href}
              href={item.href}
              onClick={() => setOpen(false)}
              className="border-b border-border py-5 text-h2 text-card-foreground transition-colors duration-200 hover:text-primary-strong"
            >
              {item.label}
            </a>
          ))}
        </nav>

        <div className="mt-auto flex flex-col gap-3 px-6 pb-8">
          <a
            href={primaryCta.href}
            onClick={() => setOpen(false)}
            className="flex min-h-13 items-center justify-center rounded-full bg-primary text-body font-semibold text-primary-foreground transition-all duration-200 hover:-translate-y-0.5 hover:shadow-primary active:translate-y-0 active:brightness-95"
          >
            {primaryCta.label}
          </a>
          {whatsapp ? (
            <a
              href={whatsapp.href}
              dir="ltr"
              {...newTabProps}
              className="flex min-h-13 items-center justify-center rounded-full border-[1.5px] border-input text-body font-semibold text-foreground transition-all duration-200 hover:border-primary hover:bg-muted hover:text-primary-strong active:brightness-95"
            >
              {whatsapp.label}
            </a>
          ) : null}
        </div>
      </aside>
    </div>
  )

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label="باز کردن منو"
        aria-expanded={open}
        className="flex size-11 items-center justify-center text-card-foreground transition-colors duration-200 hover:text-primary-strong md:hidden"
      >
        <MenuIcon className="size-6" />
      </button>

      {drawer}
    </>
  )
}
