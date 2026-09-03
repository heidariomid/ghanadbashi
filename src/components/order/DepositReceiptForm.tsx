'use client'

import { useRef, useState, type FormEvent } from 'react'

import { submitDepositReceipt } from '@/actions/deposit-receipt'
import { Eyebrow } from '@/components/ui/Eyebrow'
import { CheckIcon } from '@/components/ui/icons'
import { content } from '@/data/content'

const MAX_RECEIPT_BYTES = 4 * 1024 * 1024

const inputClass =
  'min-h-11 w-full rounded-lg border border-input bg-background px-4 text-body text-card-foreground transition-colors duration-200 focus:border-primary'

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
      <div className="rounded-2xl border border-primary/20 bg-card p-8 text-center shadow-sm">
        <span className="mx-auto mb-4 flex size-14 items-center justify-center rounded-full bg-primary/10 text-primary">
          <CheckIcon className="size-7" />
        </span>
        <p className="text-h3 text-card-foreground">{copy.successTitle}</p>
        <p className="mt-2 text-body text-muted">{copy.successBody}</p>
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
    <form className="space-y-6" onSubmit={(event) => void onSubmit(event)}>
      <header className="space-y-2 text-center">
        <Eyebrow>{copy.eyebrow}</Eyebrow>
        <h1 className="text-h2 text-card-foreground">{copy.title}</h1>
        <p className="text-body text-muted">{copy.description}</p>
        <p className="text-body font-bold text-card-foreground">
          {orderTitle} — {customerName}
        </p>
      </header>

      <div>
        <label className="mb-2 block text-body font-bold" htmlFor="deposit-receipt-file">
          {copy.fields.receipt}
        </label>
        <input
          ref={fileRef}
          id="deposit-receipt-file"
          className={inputClass}
          type="file"
          accept="image/*"
          disabled={pending}
          onChange={onFileChange}
        />
        <p className="mt-2 text-caption text-muted">{copy.photoHint}</p>
        {preview ? (
          // eslint-disable-next-line @next/next/no-img-element -- local blob preview
          <img
            alt=""
            className="mt-4 max-h-72 w-full rounded-xl border border-input object-contain"
            src={preview}
          />
        ) : null}
      </div>

      {error ? <p className="text-body font-bold text-primary-strong">{error}</p> : null}

      <button
        className="btn-primary min-h-11 w-full disabled:opacity-60"
        type="submit"
        disabled={pending}
      >
        {pending ? copy.submitting : copy.submit}
      </button>
    </form>
  )
}
