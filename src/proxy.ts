import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'

const THEME_COOKIE = 'payload-theme'
const ONE_YEAR = 60 * 60 * 24 * 365

/** Payload follows the OS when this cookie is missing. First visit stays light. */
export function proxy(request: NextRequest) {
  if (request.cookies.has(THEME_COOKIE)) {
    return NextResponse.next()
  }

  request.cookies.set(THEME_COOKIE, 'light')

  const response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  response.cookies.set({
    name: THEME_COOKIE,
    value: 'light',
    maxAge: ONE_YEAR,
    path: '/',
  })

  return response
}

export const config = {
  matcher: ['/admin', '/admin/:path*'],
}
