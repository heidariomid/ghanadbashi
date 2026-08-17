import type { ReactNode } from 'react'

type Variant = 'default' | 'outline'
type Size = 'md' | 'lg'

interface ButtonProps {
  href: string
  children: ReactNode
  variant?: Variant
  size?: Size
  className?: string
}

/** Ported from the design system's Button: pill, weight 600, warm hover lift. */
const base =
  'inline-flex items-center justify-center gap-2 rounded-full font-semibold leading-normal whitespace-nowrap transition-all duration-200'

const variants: Record<Variant, string> = {
  default:
    'border-[1.5px] border-transparent bg-primary text-primary-foreground hover:-translate-y-0.5 hover:shadow-primary',
  outline:
    'border-[1.5px] border-border bg-card text-foreground hover:border-primary hover:bg-muted hover:text-primary',
}

const sizes: Record<Size, string> = {
  md: 'min-h-11 px-6 text-small',
  lg: 'min-h-13 px-8 text-body',
}

export function Button({
  href,
  children,
  variant = 'default',
  size = 'md',
  className,
}: ButtonProps) {
  return (
    <a
      href={href}
      className={`${base} ${variants[variant]} ${sizes[size]} ${className ?? ''}`}
    >
      {children}
    </a>
  )
}
