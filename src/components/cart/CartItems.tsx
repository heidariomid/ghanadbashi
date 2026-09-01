'use client'

import Image from 'next/image'

import { QuantityStepper } from '@/components/cart/QuantityStepper'
import { useCart } from '@/components/cart/CartProvider'
import { content } from '@/data/content'
import { CART_MAX_QUANTITY } from '@/lib/cart'

export function CartItems() {
  const { items, setQuantity, removeItem } = useCart()
  const copy = content.cart

  return (
    <ul className="divide-y divide-border">
      {items.map((item) => (
        <li key={item.key} className="flex gap-4 py-4">
          <div className="relative size-20 shrink-0 overflow-hidden rounded-lg bg-muted">
            {item.imageSrc ? (
              <Image
                src={item.imageSrc}
                alt={item.imageAlt || item.title}
                fill
                sizes="80px"
                className="object-cover"
              />
            ) : null}
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-small font-semibold text-card-foreground">{item.title}</p>
            <QuantityStepper
              value={item.quantity}
              onDecrease={() => setQuantity(item.key, item.quantity - 1)}
              onIncrease={() => setQuantity(item.key, item.quantity + 1)}
              decreaseLabel={copy.decrement}
              increaseLabel={copy.increment}
              disableIncrease={item.quantity >= CART_MAX_QUANTITY}
            />
            <button
              type="button"
              onClick={() => removeItem(item.key)}
              className="min-h-11 text-caption text-muted-foreground underline-offset-4 hover:text-primary-strong hover:underline"
            >
              {copy.remove}
            </button>
          </div>
        </li>
      ))}
    </ul>
  )
}
