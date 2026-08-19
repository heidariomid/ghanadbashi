const CONNECT_CODES = new Set([
  'ECONNREFUSED',
  'ETIMEDOUT',
  'ENOTFOUND',
  'EAI_AGAIN',
  'EPERM',
  'ENETUNREACH',
  'ECONNRESET',
  'EHOSTUNREACH',
])

/**
 * Neon is unreachable (VPN off, Shecan, local network). Walks `cause` so we
 * do not treat a real query bug as "database down".
 */
export function isDatabaseUnreachable(error: unknown): boolean {
  const seen = new Set<unknown>()
  const codes: string[] = []
  const messages: string[] = []

  function walk(value: unknown) {
    if (!value || typeof value !== 'object' || seen.has(value)) return
    seen.add(value)
    const err = value as {
      code?: unknown
      errno?: unknown
      message?: unknown
      cause?: unknown
      errors?: unknown[]
    }
    if (typeof err.code === 'string' || typeof err.code === 'number') {
      codes.push(String(err.code))
    }
    if (typeof err.errno === 'number') codes.push(String(err.errno))
    if (typeof err.message === 'string') messages.push(err.message)
    if (err.cause) walk(err.cause)
    if (Array.isArray(err.errors)) err.errors.forEach(walk)
  }

  walk(error)

  if (codes.some((code) => CONNECT_CODES.has(code))) return true
  return messages.some((message) =>
    /ECONNREFUSED|ETIMEDOUT|ENOTFOUND|EAI_AGAIN|cannot connect to Postgres|connect EPERM|Connection terminated|the database system is (starting up|shutting down)/i.test(
      message,
    ),
  )
}
