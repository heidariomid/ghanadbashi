'use client'

import { QuantityStepper } from '@/components/cart/QuantityStepper'
import { useCart } from '@/components/cart/CartProvider'
import { content } from '@/data/content'
import { CART_MAX_QUANTITY, cartLineKey, type CartProductInput } from '@/lib/cart'

export function AddToCartButton({ product }: { product: CartProductInput }) {
  const { items, addItem, setQuantity } = useCart()
  const copy = content.cart
  const key = cartLineKey(product.kind ?? 'product', product.id)
  const current = items.find((item) => item.key === key)

  return (
    <div className="mt-3">
      {current ? (
        <QuantityStepper
          value={current.quantity}
          onDecrease={() => setQuantity(key, current.quantity - 1)}
          onIncrease={() => setQuantity(key, current.quantity + 1)}
          decreaseLabel={copy.decrement}
          increaseLabel={copy.increment}
          disableIncrease={current.quantity >= CART_MAX_QUANTITY}
        />
      ) : (
        <button
          type="button"
          onClick={() => addItem(product)}
          className="group/cta inline-flex min-h-11 w-fit items-center text-small"
        >
          <span className="border-b border-border pb-1 transition-all duration-200 group-hover/cta:border-primary group-hover/cta:text-primary-strong">
            {copy.add}
          </span>
        </button>
      )}
    </div>
  )
}
