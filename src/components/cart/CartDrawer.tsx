'use client'

import { useEffect } from 'react'

import { CartItems } from '@/components/cart/CartItems'
import { useCart } from '@/components/cart/CartProvider'
import { CloseIcon } from '@/components/ui/icons'
import { content } from '@/data/content'
import { faNumber } from '@/lib/format'

export function CartDrawer() {
  const { items, count, open, setOpen } = useCart()
  const copy = content.cart

  useEffect(() => {
    if (!open) return
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, setOpen])

  return (
    <div
      className={`fixed inset-0 z-50 overflow-hidden ${open ? '' : 'pointer-events-none'}`}
    >
      <div
        onClick={() => setOpen(false)}
        aria-hidden={!open}
        className={`absolute inset-0 bg-card-foreground/25 transition-opacity duration-500 ${
          open ? 'opacity-100' : 'opacity-0'
        }`}
      />

      <aside
        role="dialog"
        aria-modal="true"
        aria-labelledby="cart-title"
        // `inert`, not `aria-hidden`: the closed drawer is parked off-canvas
        // with its buttons still in the DOM, and aria-hidden alone would leave
        // them tabbable — invisible stops on the way down the page.
        inert={!open}
        className={`absolute inset-y-0 inset-e-0 flex w-[86%] max-w-md flex-col bg-card shadow-warm transition-transform duration-500 ease-rise ${
          open ? 'translate-x-0' : 'translate-x-full rtl:-translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between border-b border-border px-6 py-5">
          <h2 id="cart-title" className="text-h3 font-semibold text-card-foreground">
            {copy.title}
            {count > 0 ? (
              <span className="ms-2 text-small font-normal text-muted-foreground">
                ({faNumber(count)})
              </span>
            ) : null}
          </h2>
          <button
            type="button"
            onClick={() => setOpen(false)}
            aria-label={copy.close}
            className="flex size-11 items-center justify-center text-card-foreground transition-colors duration-200 hover:text-primary-strong"
          >
            <CloseIcon className="size-6" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-6">
          {items.length === 0 ? (
            <div className="py-16 text-center">
              <p className="text-body text-card-foreground">{copy.empty}</p>
              <p className="mt-2 text-small text-muted-foreground">{copy.emptyHint}</p>
              <a
                href="/products"
                onClick={() => setOpen(false)}
                className="mt-6 inline-flex min-h-11 items-center text-small text-primary-strong"
              >
                {copy.browse}
              </a>
            </div>
          ) : (
            <CartItems />
          )}
        </div>

        {items.length > 0 ? (
          <div className="border-t border-border px-6 py-5">
            <a
              href="/order"
              onClick={() => setOpen(false)}
              className="flex min-h-13 items-center justify-center rounded-full bg-primary text-body font-semibold text-primary-foreground transition-all duration-200 hover:-translate-y-0.5 hover:shadow-primary active:translate-y-0 active:brightness-95"
            >
              {copy.checkout}
            </a>
          </div>
        ) : null}
      </aside>
    </div>
  )
}
