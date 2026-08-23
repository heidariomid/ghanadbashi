'use client'

import { useEffect, useId, useRef, useState } from 'react'
import type { FormEvent, ReactNode } from 'react'
import DatePicker, { DateObject } from 'react-multi-date-picker'
import persian from 'react-date-object/calendars/persian'
import persian_fa from 'react-date-object/locales/persian_fa'

import { submitOrder } from '@/actions/orders'
import { CartItems } from '@/components/cart/CartItems'
import { useCart } from '@/components/cart/CartProvider'
import { Eyebrow } from '@/components/ui/Eyebrow'
import { content } from '@/data/content'
import type { CartProductInput } from '@/lib/cart'

interface OrderFormProps {
  preselected: CartProductInput | null
}

const OTHER_PRODUCT_VALUE = '__other__'
const MAX_SAMPLE_IMAGE_BYTES = 4 * 1024 * 1024
const TARGET_SAMPLE_IMAGE_BYTES = 1.5 * 1024 * 1024

const inputClass =
  'min-h-11 w-full rounded-lg border border-input bg-background px-4 text-body text-card-foreground transition-colors duration-200 focus:border-primary'

export function OrderForm({ preselected }: OrderFormProps) {
  const copy = content.orderForm
  const formId = useId()
  const fileRef = useRef<HTMLInputElement>(null)
  const seeded = useRef(false)
  const { items, ready, ensureItem, clear } = useCart()

  const [otherSelected, setOtherSelected] = useState(false)
  const [deliveryDate, setDeliveryDate] = useState('')
  const [preview, setPreview] = useState<string | null>(null)
  const [pending, setPending] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    if (!ready || !preselected || seeded.current) return
    seeded.current = true
    ensureItem(preselected)
  }, [ensureItem, preselected, ready])

  useEffect(() => {
    return () => {
      if (preview) URL.revokeObjectURL(preview)
    }
  }, [preview])

  if (success) {
    return (
      <p className="py-16 text-center text-h2 font-semibold text-card-foreground text-balance md:py-24">
        <span aria-hidden="true" className="mb-4 block text-4xl">
          ✅
        </span>
        {copy.success}
      </p>
    )
  }

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setPending(true)
    setError(null)
    setFieldErrors({})

    try {
      const form = event.currentTarget
      const formData = new FormData(form)
      const file = fileRef.current?.files?.[0]

      if (file) {
        if (!file.type.startsWith('image/')) {
          setFieldErrors({ sampleImage: 'فقط فایل تصویری مجاز است' })
          setError(copy.error)
          return
        }

        const compressed = await compressImage(file)
        if (compressed.size > MAX_SAMPLE_IMAGE_BYTES) {
          setFieldErrors({ sampleImage: 'حجم عکس نباید بیشتر از ۴ مگابایت باشد' })
          setError(copy.error)
          return
        }

        formData.set('sampleImage', compressed)
      }

      const result = await submitOrder(formData)
      if (result.success) {
        clear()
        setSuccess(true)
        return
      }

      setError(result.error)
      setFieldErrors(result.fieldErrors ?? {})
    } catch {
      setError(copy.error)
    } finally {
      setPending(false)
    }
  }

  function onFileChange() {
    const file = fileRef.current?.files?.[0]
    if (preview) URL.revokeObjectURL(preview)
    setPreview(file ? URL.createObjectURL(file) : null)
    setFieldErrors((current) => {
      if (!current.sampleImage) return current
      const next = { ...current }
      delete next.sampleImage
      return next
    })
  }

  function clearPhoto() {
    if (fileRef.current) fileRef.current.value = ''
    if (preview) URL.revokeObjectURL(preview)
    setPreview(null)
  }

  const itemsJson = JSON.stringify(
    items.map((item) => ({ kind: item.kind, id: item.id, quantity: item.quantity })),
  )

  return (
    <div>
      <Eyebrow>{copy.eyebrow}</Eyebrow>
      <h1 className="mt-5.5 text-h1 font-black text-card-foreground text-balance">
        {copy.title}
      </h1>
      <p className="mt-5.5 text-body text-muted-foreground">{copy.description}</p>

      <section className="mt-10">
        <h2 className="text-small font-semibold text-card-foreground">{copy.reviewTitle}</h2>
        {items.length === 0 ? (
          <div className="mt-4 rounded-xl border border-border bg-background px-4 py-6 text-center">
            <p className="text-body text-card-foreground">{copy.emptyCart}</p>
            <p className="mt-2 text-small text-muted-foreground">{copy.emptyCartHint}</p>
            <div className="mt-4 flex flex-col items-center gap-1">
              <a href="/products" className="inline-flex min-h-11 items-center text-small text-primary-strong">
                {content.cart.browse}
              </a>
              <a href="/gallery" className="inline-flex min-h-11 items-center text-small text-primary-strong">
                {content.cart.browseGallery}
              </a>
            </div>
          </div>
        ) : (
          <CartItems />
        )}
        {fieldErrors.items ? (
          <p className="mt-2 text-small text-primary-strong" role="alert">
            {fieldErrors.items}
          </p>
        ) : null}
      </section>

      <form onSubmit={onSubmit} className="relative mt-10 space-y-5" noValidate>
        {error ? (
          <p
            className="rounded-xl border border-primary/40 bg-secondary px-4 py-3 text-small text-secondary-foreground"
            role="alert"
          >
            {error}
          </p>
        ) : null}

        <input type="hidden" name="items" value={itemsJson} />

        <div
          className="pointer-events-none absolute h-0 w-0 overflow-hidden opacity-0"
          aria-hidden="true"
        >
          <label htmlFor={`${formId}-website`}>وب‌سایت</label>
          <input
            id={`${formId}-website`}
            name="website"
            type="text"
            tabIndex={-1}
            autoComplete="off"
          />
        </div>

        <Field
          id={`${formId}-name`}
          label={copy.fields.customerName}
          error={fieldErrors.customerName}
          required
        >
          <input
            id={`${formId}-name`}
            name="customerName"
            autoComplete="name"
            required
            className={inputClass}
          />
        </Field>

        <Field id={`${formId}-phone`} label={copy.fields.phone} error={fieldErrors.phone} required>
          <input
            id={`${formId}-phone`}
            name="phone"
            type="tel"
            inputMode="tel"
            autoComplete="tel"
            required
            className={inputClass}
            dir="ltr"
          />
        </Field>

        <label className="flex min-h-11 cursor-pointer items-center gap-3 text-body text-card-foreground">
          <input
            type="checkbox"
            name="productOther"
            value={OTHER_PRODUCT_VALUE}
            checked={otherSelected}
            onChange={(event) => setOtherSelected(event.target.checked)}
            className="size-5 shrink-0 rounded border-input accent-primary"
          />
          {copy.otherProduct}
        </label>

        {otherSelected ? (
          <div className="grid gap-5 sm:grid-cols-[1fr_7rem]">
            <Field
              id={`${formId}-productNote`}
              label={copy.otherProductLabel}
              error={fieldErrors.productNote}
              required
            >
              <input
                id={`${formId}-productNote`}
                name="productNote"
                required
                placeholder={copy.otherProductPlaceholder}
                className={inputClass}
              />
            </Field>
            <Field
              id={`${formId}-otherQuantity`}
              label={copy.fields.quantity}
              error={fieldErrors.otherQuantity}
              required
            >
              <input
                id={`${formId}-otherQuantity`}
                name="otherQuantity"
                type="text"
                inputMode="numeric"
                defaultValue="1"
                required
                className={inputClass}
              />
            </Field>
          </div>
        ) : null}

        <Field
          id={`${formId}-date`}
          label={copy.fields.deliveryDate}
          error={fieldErrors.deliveryDate}
          required
        >
          <input type="hidden" name="deliveryDate" value={deliveryDate} />
          <DatePicker
            id={`${formId}-date`}
            value={deliveryDate || undefined}
            onChange={(date: DateObject | null) => {
              setDeliveryDate(date ? date.format() : '')
            }}
            calendar={persian}
            locale={persian_fa}
            format="YYYY/MM/DD"
            calendarPosition="bottom-start"
            portal
            editable={false}
            containerClassName="w-full"
            inputClass={inputClass}
          />
        </Field>

        <Field id={`${formId}-notes`} label={copy.fields.notes} error={fieldErrors.notes}>
          <textarea
            id={`${formId}-notes`}
            name="notes"
            rows={4}
            className={`${inputClass} py-3`}
          />
        </Field>

        <div className="space-y-2">
          <label htmlFor={`${formId}-photo`} className="block text-small text-card-foreground">
            {copy.fields.sampleImage}
          </label>
          <input
            ref={fileRef}
            id={`${formId}-photo`}
            name="sampleImage"
            type="file"
            accept="image/*"
            onChange={onFileChange}
            className="block w-full text-small text-muted-foreground file:me-3 file:min-h-11 file:rounded-full file:border-0 file:bg-secondary file:px-5 file:text-small file:font-semibold file:text-secondary-foreground"
          />
          <p className="text-caption text-muted-foreground">{copy.photoHint}</p>
          {fieldErrors.sampleImage ? (
            <p className="text-small text-primary-strong" role="alert">
              {fieldErrors.sampleImage}
            </p>
          ) : null}
          {preview ? (
            <div className="flex items-start gap-4">
              {/* blob preview — next/image cannot optimize a local object URL */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={preview} alt="" className="h-28 w-28 rounded-lg object-cover" />
              <button
                type="button"
                onClick={clearPhoto}
                className="min-h-11 text-small text-muted-foreground underline-offset-4 hover:text-primary-strong hover:underline"
              >
                {copy.photoClear}
              </button>
            </div>
          ) : null}
        </div>

        <button
          type="submit"
          disabled={pending}
          className="inline-flex min-h-13 w-full items-center justify-center rounded-full bg-primary px-8 text-body font-semibold text-primary-foreground transition-all duration-200 hover:-translate-y-0.5 hover:shadow-primary active:translate-y-0 active:brightness-95 disabled:translate-y-0 disabled:opacity-70 disabled:shadow-none"
        >
          {pending ? (
            <span className="inline-flex items-center gap-2">
              <span className="size-4 animate-spin rounded-full border-2 border-primary-foreground/30 border-t-primary-foreground" />
              {copy.submitting}
            </span>
          ) : (
            copy.submit
          )}
        </button>
      </form>
    </div>
  )
}

function Field({
  id,
  label,
  error,
  required,
  children,
}: {
  id: string
  label: string
  error?: string
  required?: boolean
  children: ReactNode
}) {
  return (
    <div className="space-y-2">
      <label htmlFor={id} className="block text-small text-card-foreground">
        {label}
        {required ? <span className="text-primary-strong"> *</span> : null}
      </label>
      {children}
      {error ? (
        <p id={`${id}-error`} className="text-small text-primary-strong" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  )
}

async function compressImage(file: File): Promise<File> {
  if (file.size <= TARGET_SAMPLE_IMAGE_BYTES) return file

  let bitmap: ImageBitmap
  try {
    bitmap = await createImageBitmap(file)
  } catch {
    return file
  }

  const maxEdge = 1920
  const scale = Math.min(1, maxEdge / Math.max(bitmap.width, bitmap.height))
  const canvas = document.createElement('canvas')
  canvas.width = Math.max(1, Math.round(bitmap.width * scale))
  canvas.height = Math.max(1, Math.round(bitmap.height * scale))
  const context = canvas.getContext('2d')
  if (!context) {
    bitmap.close()
    return file
  }

  context.drawImage(bitmap, 0, 0, canvas.width, canvas.height)
  bitmap.close()

  let quality = 0.82
  let blob = await canvasToBlob(canvas, quality)
  while (blob && blob.size > MAX_SAMPLE_IMAGE_BYTES && quality > 0.5) {
    quality -= 0.1
    blob = await canvasToBlob(canvas, quality)
  }

  if (!blob) return file
  return new File([blob], file.name.replace(/\.\w+$/, '.jpg'), { type: 'image/jpeg' })
}

function canvasToBlob(canvas: HTMLCanvasElement, quality: number): Promise<Blob | null> {
  return new Promise((resolve) => {
    canvas.toBlob(resolve, 'image/jpeg', quality)
  })
}
