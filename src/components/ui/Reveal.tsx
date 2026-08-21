'use client'

import { useEffect, useRef, useState } from 'react'
import type { CSSProperties, ReactNode } from 'react'

interface RevealProps {
  children: ReactNode
  /** Milliseconds to hold before rising, so siblings can stagger. */
  delay?: number
  className?: string
}

/**
 * Rises its children into place the first time they scroll into view. The
 * hidden starting state lives in `globals.css` behind a `scripting: enabled`
 * query, so the markup stays visible when this never gets to run.
 */
export function Reveal({ children, delay = 0, className }: RevealProps) {
  const ref = useRef<HTMLDivElement>(null)
  const [shown, setShown] = useState(false)

  useEffect(() => {
    const node = ref.current
    if (!node || shown) return

    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries.some((entry) => entry.isIntersecting)) return
        setShown(true)
        observer.disconnect()
      },
      // Holds the reveal back until the section is a little way up the
      // viewport, rather than firing on the first pixel of overlap.
      { rootMargin: '0px 0px -12% 0px' },
    )

    observer.observe(node)
    return () => observer.disconnect()
  }, [shown])

  return (
    <div
      ref={ref}
      data-reveal={shown ? 'shown' : ''}
      className={className}
      style={delay ? ({ '--reveal-delay': `${delay}ms` } as CSSProperties) : undefined}
    >
      {children}
    </div>
  )
}
