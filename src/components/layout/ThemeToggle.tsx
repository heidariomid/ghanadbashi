'use client'

import { useSyncExternalStore } from 'react'

import { MoonIcon, SunIcon } from '@/components/ui/icons'

const STORAGE_KEY = 'theme'
const listeners = new Set<() => void>()

function emit() {
  for (const listener of listeners) listener()
}

function subscribe(listener: () => void) {
  listeners.add(listener)
  return () => {
    listeners.delete(listener)
  }
}

function getSnapshot() {
  return document.documentElement.classList.contains('dark')
}

function applyTheme(dark: boolean) {
  document.documentElement.classList.toggle('dark', dark)
  localStorage.setItem(STORAGE_KEY, dark ? 'dark' : 'light')
  emit()
}

export function ThemeToggle() {
  const dark = useSyncExternalStore(subscribe, getSnapshot, () => false)

  return (
    <button
      type="button"
      onClick={() => applyTheme(!dark)}
      aria-label={dark ? 'تم روشن' : 'تم تاریک'}
      className="flex size-11 items-center justify-center text-card-foreground transition-colors duration-200 hover:text-primary-strong"
    >
      {dark ? <SunIcon className="size-5" /> : <MoonIcon className="size-5" />}
    </button>
  )
}
