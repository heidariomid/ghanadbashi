'use client'

import { useEffect, useState } from 'react'

const TYPE_MS = 95
const DELETE_MS = 45
const HOLD_MS = 2200

interface TypewriterProps {
  words: string[]
  /** Static copy that stays put while the word after it cycles. */
  prefix?: string
  className?: string
}

/**
 * Types each word out, holds it, deletes it, moves to the next. The first word
 * is rendered whole on the server, so crawlers and reduced-motion visitors get
 * real text rather than an empty line.
 */
export function Typewriter({ words, prefix, className }: TypewriterProps) {
  const [wordIndex, setWordIndex] = useState(0)
  const [length, setLength] = useState(words[0]?.length ?? 0)
  const [deleting, setDeleting] = useState(false)

  const word = words[wordIndex] ?? ''

  useEffect(() => {
    if (words.length < 2) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const settled = !deleting && length === word.length
    const timer = setTimeout(
      () => {
        if (!deleting) {
          if (settled) setDeleting(true)
          else setLength(length + 1)
          return
        }

        if (length > 0) {
          setLength(length - 1)
          return
        }

        setDeleting(false)
        setWordIndex((current) => (current + 1) % words.length)
      },
      settled ? HOLD_MS : deleting ? DELETE_MS : TYPE_MS,
    )

    return () => clearTimeout(timer)
  }, [words, word, length, deleting])

  return (
    <p className={className}>
      {prefix ? <span className="text-muted-foreground">{prefix} </span> : null}
      <span className="font-bold text-primary-strong">{word.slice(0, length)}</span>
      <span
        aria-hidden="true"
        className="ms-0.5 inline-block h-[1em] w-0.5 translate-y-[0.15em] animate-caret bg-primary-strong"
      />
    </p>
  )
}
