'use client'

import { useCart } from '@/components/cart/CartProvider'
import { BagIcon } from '@/components/ui/icons'
import { content } from '@/data/content'
import { faNumber } from '@/lib/format'

export function CartButton() {
  const { count, ready, setOpen } = useCart()
  const label = count > 0 ? `${content.cart.countLabel} (${faNumber(count)})` : content.cart.countLabel

  return (
    <button
      type="button"
      onClick={() => setOpen(true)}
      aria-label={label}
      className="relative flex size-11 items-center justify-center text-card-foreground transition-colors duration-200 hover:text-primary-strong"
    >
      <BagIcon className="size-6" />
      {ready && count > 0 ? (
        <span className="absolute top-1.5 end-1.5 flex min-h-4.5 min-w-4.5 items-center justify-center rounded-full bg-primary px-1 text-[0.625rem] font-semibold leading-none text-primary-foreground">
          {faNumber(count)}
        </span>
      ) : null}
    </button>
  )
}
