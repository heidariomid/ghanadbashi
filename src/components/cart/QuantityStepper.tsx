'use client'

import { faNumber } from '@/lib/format'

interface QuantityStepperProps {
  value: number
  onDecrease: () => void
  onIncrease: () => void
  decreaseLabel: string
  increaseLabel: string
  disableIncrease?: boolean
}

export function QuantityStepper({
  value,
  onDecrease,
  onIncrease,
  decreaseLabel,
  increaseLabel,
  disableIncrease,
}: QuantityStepperProps) {
  return (
    <div className="inline-flex items-center">
      <button
        type="button"
        aria-label={decreaseLabel}
        onClick={onDecrease}
        className="flex size-11 items-center justify-center rounded-full text-card-foreground transition-colors duration-200 hover:text-primary-strong"
      >
        −
      </button>
      <span className="min-w-7 text-center text-small font-semibold tabular-nums text-card-foreground">
        {faNumber(value)}
      </span>
      <button
        type="button"
        aria-label={increaseLabel}
        onClick={onIncrease}
        disabled={disableIncrease}
        className="flex size-11 items-center justify-center rounded-full text-card-foreground transition-colors duration-200 hover:text-primary-strong disabled:opacity-40"
      >
        +
      </button>
    </div>
  )
}
