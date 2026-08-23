'use client'

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  useSyncExternalStore,
} from 'react'
import type { ReactNode } from 'react'

import {
  CART_STORAGE_KEY,
  cartCount,
  ensureCartItem,
  parseStoredCart,
  setCartQuantity,
  upsertCartItem,
  type CartItem,
  type CartProductInput,
} from '@/lib/cart'

const CART_EVENT = 'ghanadbashi-cart'

interface CartContextValue {
  items: CartItem[]
  count: number
  ready: boolean
  open: boolean
  setOpen: (open: boolean) => void
  addItem: (product: CartProductInput, addBy?: number) => void
  ensureItem: (product: CartProductInput) => void
  setQuantity: (key: string, quantity: number) => void
  removeItem: (key: string) => void
  clear: () => void
}

const CartContext = createContext<CartContextValue | null>(null)

function subscribe(onStoreChange: () => void) {
  window.addEventListener('storage', onStoreChange)
  window.addEventListener(CART_EVENT, onStoreChange)
  return () => {
    window.removeEventListener('storage', onStoreChange)
    window.removeEventListener(CART_EVENT, onStoreChange)
  }
}

function getSnapshot() {
  return window.localStorage.getItem(CART_STORAGE_KEY) ?? '[]'
}

function getServerSnapshot() {
  return '[]'
}

function writeCart(items: CartItem[]) {
  window.localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items))
  window.dispatchEvent(new Event(CART_EVENT))
}

export function CartProvider({ children }: { children: ReactNode }) {
  const raw = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)
  const items = useMemo(() => parseStoredCart(raw), [raw])
  const [open, setOpen] = useState(false)

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [open])

  const update = useCallback((next: (current: CartItem[]) => CartItem[]) => {
    writeCart(next(parseStoredCart(window.localStorage.getItem(CART_STORAGE_KEY))))
  }, [])

  const addItem = useCallback(
    (product: CartProductInput, addBy = 1) => {
      update((current) => upsertCartItem(current, product, addBy))
    },
    [update],
  )

  const ensureItem = useCallback(
    (product: CartProductInput) => {
      update((current) => ensureCartItem(current, product))
    },
    [update],
  )

  const setQuantity = useCallback(
    (key: string, quantity: number) => {
      update((current) => setCartQuantity(current, key, quantity))
    },
    [update],
  )

  const removeItem = useCallback(
    (key: string) => {
      update((current) => current.filter((item) => item.key !== key))
    },
    [update],
  )

  const clear = useCallback(() => writeCart([]), [])

  const value = useMemo(
    () => ({
      items,
      count: cartCount(items),
      ready: true,
      open,
      setOpen,
      addItem,
      ensureItem,
      setQuantity,
      removeItem,
      clear,
    }),
    [addItem, clear, ensureItem, items, open, removeItem, setQuantity],
  )

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export function useCart(): CartContextValue {
  const value = useContext(CartContext)
  if (!value) {
    throw new Error('useCart must be used within CartProvider')
  }
  return value
}
