import type { ReactNode } from 'react'
import Script from 'next/script'
import config from '@payload-config'
import { RootLayout, handleServerFunctions } from '@payloadcms/next/layouts'
import '@payloadcms/next/css'
import './custom.scss'
import { importMap } from './admin/importMap'
import { adminThemeBootScript } from '@/components/layout/theme-boot'
// HAND EDIT (keep minimal, re-apply if this scaffold is regenerated):
// the import below plus htmlProps are what put Vazirmatn in the admin panel.
import { fontVariables } from '@/lib/fonts'

const serverFunction = async (args: { args: Record<string, unknown>; name: string }) => {
  'use server'

  return handleServerFunctions({
    ...args,
    config,
    importMap,
  })
}

export default function PayloadLayout({ children }: { children: ReactNode }) {
  return (
    <RootLayout
      config={config}
      importMap={importMap}
      serverFunction={serverFunction}
      htmlProps={{ className: fontVariables }}
    >
      <Script id="admin-theme-boot" strategy="beforeInteractive">
        {adminThemeBootScript}
      </Script>
      {children}
    </RootLayout>
  )
}
