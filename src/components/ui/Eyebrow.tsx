interface EyebrowProps {
  children: string
  /** The order section sits on blush, where the rosé accent loses contrast. */
  tone?: 'primary' | 'onSecondary'
  className?: string
}

const tones = {
  primary: { text: 'text-primary-strong', rule: 'bg-primary/50' },
  onSecondary: { text: 'text-secondary-foreground', rule: 'bg-secondary-foreground/40' },
} as const

export function Eyebrow({ children, tone = 'primary', className }: EyebrowProps) {
  const { text, rule } = tones[tone]

  return (
    <p className={`flex items-center gap-3 text-caption ${text} ${className ?? ''}`}>
      <span className={`inline-block h-px w-6.5 ${rule}`} />
      {children}
    </p>
  )
}
