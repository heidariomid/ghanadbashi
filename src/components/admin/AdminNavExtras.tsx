'use client'

import { useEffect } from 'react'
import { useTheme } from '@payloadcms/ui'

/** Sidebar extras the baker can reach without hunting through account settings. */
export function AdminNavExtras() {
  const { autoMode, setTheme, theme } = useTheme()
  const dark = theme === 'dark'

  useEffect(() => {
    if (autoMode) setTheme('light')
  }, [autoMode, setTheme])

  return (
    <div className="nav-group">
      <a
        className="nav__link"
        href="/"
        target="_blank"
        rel="noopener noreferrer"
      >
        <span className="nav__link-label">صفحه اصلی سایت</span>
      </a>
      <button
        className="nav__link"
        type="button"
        onClick={() => setTheme(dark ? 'light' : 'dark')}
      >
        <span className="nav__link-label">{dark ? 'تم روشن' : 'تم تاریک'}</span>
      </button>
    </div>
  )
}
