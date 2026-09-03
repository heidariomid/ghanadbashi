'use client'

import { useRef, useState, type FormEvent } from 'react'

import { submitDepositReceipt } from '@/actions/deposit-receipt'
import { Eyebrow } from '@/components/ui/Eyebrow'
import { CheckIcon } from '@/components/ui/icons'
import { content } from '@/data/content'

const MAX_RECEIPT_BYTES = 4 * 1024 * 1024

const cardClass =
  'rounded-3xl border border-white/80 bg-white/60 px-6 py-8 shadow-warm backdrop-blur-xl sm:px-8 sm:py-10 dark:border-white/10 dark:bg-white/8'

interface DepositReceiptFormProps {
  token: string
  orderTitle: string
  customerName: string
  alreadyUploaded: boolean
}

export function DepositReceiptForm({
  token,
  orderTitle,
  customerName,
  alreadyUploaded,
}: DepositReceiptFormProps) {
  const copy = content.depositReceipt
  const fileRef = useRef<HTMLInputElement>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [pending, setPending] = useState(false)
  const [success, setSuccess] = useState(alreadyUploaded)
  const [error, setError] = useState<string | null>(null)

  if (success) {
    return (
      <div role="status" aria-live="polite" className={`${cardClass} text-center`}>
        <div className="mx-auto flex size-16 items-center justify-center rounded-full bg-success text-success-foreground shadow-[0_8px_24px_-8px_rgba(31,138,76,0.45)]">
          <CheckIcon className="size-8" />
        </div>
        <p className="mt-5 text-h2 font-semibold tracking-tight text-card-foreground text-balance">
          {copy.successTitle}
        </p>
        <p className="mt-3 text-body leading-relaxed text-muted-foreground text-balance">
          {copy.successBody}
        </p>
      </div>
    )
  }

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const file = fileRef.current?.files?.[0]
    if (!file) {
      setError(copy.missingFile)
      return
    }
    if (!file.type.startsWith('image/')) {
      setError(copy.invalidType)
      return
    }
    if (file.size > MAX_RECEIPT_BYTES) {
      setError(copy.tooLarge)
      return
    }

    setPending(true)
    setError(null)
    try {
      const formData = new FormData()
      formData.set('receipt', file)
      const result = await submitDepositReceipt(token, formData)
      if (result.success) {
        setSuccess(true)
      } else {
        setError(result.error)
      }
    } catch {
      setError(copy.error)
    } finally {
      setPending(false)
    }
  }

  function onFileChange() {
    const file = fileRef.current?.files?.[0]
    if (preview) URL.revokeObjectURL(preview)
    if (!file) {
      setPreview(null)
      return
    }
    setPreview(URL.createObjectURL(file))
    setError(null)
  }

  return (
    <form className={cardClass} onSubmit={(event) => void onSubmit(event)}>
      <header className="space-y-3 text-center">
        <Eyebrow className="justify-center">{copy.eyebrow}</Eyebrow>
        <h1 className="text-h2 font-semibold tracking-tight text-card-foreground text-balance">
          {copy.title}
        </h1>
        <p className="text-body leading-relaxed text-muted-foreground text-balance">
          {copy.description}
        </p>
        <div className="mx-auto mt-1 inline-flex max-w-full flex-col gap-1 rounded-2xl border border-success/25 bg-success/10 px-4 py-3 text-center">
          <p className="text-caption font-semibold text-success">سفارش</p>
          <p className="text-body font-bold text-success">{orderTitle}</p>
          <p className="text-small text-success/80">{customerName}</p>
        </div>
      </header>

      <div className="mt-8 space-y-2">
        <label className="block text-small font-semibold text-card-foreground" htmlFor="deposit-receipt-file">
          {copy.fields.receipt}
        </label>
        <label
          className="group flex cursor-pointer flex-col items-center gap-3 rounded-2xl border border-dashed border-input bg-background/80 px-4 py-8 text-center transition-colors hover:border-primary/60 hover:bg-background"
          htmlFor="deposit-receipt-file"
        >
          <span className="flex size-12 items-center justify-center rounded-full bg-secondary text-secondary-foreground transition-transform group-hover:scale-105">
            <PhotoIcon className="size-6" />
          </span>
          <span className="text-body font-semibold text-card-foreground">انتخاب عکس رسید</span>
          <span className="text-caption text-muted-foreground">{copy.photoHint}</span>
        </label>
        <input
          ref={fileRef}
          id="deposit-receipt-file"
          className="sr-only"
          type="file"
          accept="image/*"
          disabled={pending}
          onChange={onFileChange}
        />
        {preview ? (
          // eslint-disable-next-line @next/next/no-img-element -- local blob preview
          <img
            alt=""
            className="mt-2 max-h-72 w-full rounded-2xl border border-border bg-background object-contain shadow-warm"
            src={preview}
          />
        ) : null}
      </div>

      {error ? (
        <p className="mt-5 text-small font-semibold text-primary-strong" role="alert">
          {error}
        </p>
      ) : null}

      <button
        className="mt-6 inline-flex min-h-12 w-full items-center justify-center rounded-full bg-success px-8 text-body font-bold text-success-foreground transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_6px_18px_-6px_rgba(31,138,76,0.45)] active:translate-y-0 active:brightness-95 disabled:translate-y-0 disabled:opacity-60 disabled:shadow-none"
        type="submit"
        disabled={pending}
      >
        {pending ? copy.submitting : copy.submit}
      </button>
    </form>
  )
}

function PhotoIcon({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden
      className={className}
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
      viewBox="0 0 24 24"
    >
      <path d="M4 7a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V7Z" />
      <path d="m4 15 4.5-4.5a1.5 1.5 0 0 1 2.12 0L14 14" />
      <path d="M13 13h.01" />
      <circle cx="16" cy="9" r="1.25" fill="currentColor" stroke="none" />
    </svg>
  )
}
