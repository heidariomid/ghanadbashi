import Link from 'next/link'
import type { ReactNode } from 'react'

import { isExternalHref, newTabProps } from '@/lib/links'

type Variant = 'default' | 'outline'
type Size = 'md' | 'lg'

interface ButtonProps {
  href: string
  children: ReactNode
  variant?: Variant
  size?: Size
  className?: string
  dir?: 'ltr' | 'rtl'
}

/** Ported from the design system's Button: pill, weight 600, warm hover lift. */
const base =
  'inline-flex items-center justify-center gap-2 rounded-full font-semibold leading-normal whitespace-nowrap transition-all duration-200'

/* Press settles the button back down and dims the fill, the way a UIButton
   does — without it the hover lift has no release and the tap feels dead. */
const press = 'active:translate-y-0 active:brightness-95 active:shadow-none'

const variants: Record<Variant, string> = {
  default: `border-[1.5px] border-transparent bg-primary text-primary-foreground hover:-translate-y-0.5 hover:shadow-primary ${press}`,
  /* `input`, not `border`: a card-on-parchment fill differs by 1.06:1, so the
     outline is the only thing telling a visitor this is a button at all. */
  outline: `border-[1.5px] border-input bg-card text-foreground hover:border-primary hover:bg-muted hover:text-primary-strong ${press}`,
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
  dir,
}: ButtonProps) {
  const classes = `${base} ${variants[variant]} ${sizes[size]} ${className ?? ''}`

  if (isExternalHref(href)) {
    return (
      <a href={href} dir={dir} {...newTabProps} className={classes}>
        {children}
      </a>
    )
  }

  return (
    <Link href={href} prefetch dir={dir} className={classes}>
      {children}
    </Link>
  )
}
