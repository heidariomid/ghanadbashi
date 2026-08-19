/**
 * Replace the local Postgres database `bakery` with a full copy of production Neon
 * (schema + data). Wipes local `bakery` before restore. Re-run anytime for a
 * fresh production copy.
 *
 * Photos may 404 locally if they live on Vercel Blob (URLs still point at
 * production); content and structure still restore.
 *
 *   NEON_DATABASE_URI="postgresql://user:pass@....neon.tech/neondb?sslmode=require" pnpm db:pull
 *
 * Get NEON_DATABASE_URI from the Neon dashboard Connection details, or from
 * Vercel → Project → Settings → Environment Variables → DATABASE_URI.
 * Use the direct (not pooled) connection string. Do not pass local DATABASE_URI
 * as the source.
 */

import { spawnSync, type SpawnSyncReturns } from 'node:child_process'
import { existsSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const LOCAL_DB = 'bakery'
const TOOLS = ['pg_dump', 'dropdb', 'createdb', 'psql'] as const
/** GUCs emitted by newer Postgres dumps that older local servers reject on restore. */
const UNSUPPORTED_GUC = /transaction_timeout/

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
process.chdir(root)

function fail(message: string): never {
  console.error(message)
  process.exit(1)
}

function loadEnvFile(filePath: string): void {
  let text: string
  try {
    text = readFileSync(filePath, 'utf8')
  } catch {
    return
  }

  for (const raw of text.split('\n')) {
    const line = raw.trim()
    if (!line || line.startsWith('#')) continue
    const eq = line.indexOf('=')
    if (eq <= 0) continue
    const key = line.slice(0, eq).trim()
    if (!/^[A-Za-z_][A-Za-z0-9_]*$/.test(key)) continue
    if (process.env[key] !== undefined) continue
    let value = line.slice(eq + 1).trim()
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1)
    }
    process.env[key] = value
  }
}

function hasCommand(name: string): boolean {
  const probe = spawnSync(name, ['--version'], { encoding: 'utf8', stdio: 'pipe' })
  return probe.error === undefined && probe.status === 0
}

function requireTools(): void {
  const missing = TOOLS.filter((name) => !hasCommand(name))
  if (missing.length === 0) return
  fail(
    `PostgreSQL client tools are not installed (missing: ${missing.join(', ')}). Install them (apt install postgresql-client / brew install libpq) and retry.`,
  )
}

function requireNeonUri(): string {
  const uri = process.env.NEON_DATABASE_URI?.trim()
  if (!uri) {
    fail(
      `NEON_DATABASE_URI is not set. Pass the production Neon connection string:\n\n  NEON_DATABASE_URI="postgresql://user:pass@....neon.tech/neondb?sslmode=require" pnpm db:pull\n\nGet it from Neon → Connection details, or Vercel → Project → Settings → Environment Variables → DATABASE_URI.\nDo not use local DATABASE_URI as the source.`,
    )
  }
  if (!/^postgres(ql)?:\/\//.test(uri)) {
    fail('NEON_DATABASE_URI must be a postgres:// or postgresql:// connection string.')
  }
  return uri
}

function isLocalHostname(hostname: string): boolean {
  const host = hostname.replace(/^\[|\]$/g, '').toLowerCase()
  return host === 'localhost' || host === '127.0.0.1' || host === '::1'
}

function withSslRequire(uri: string): string {
  if (/[?&]sslmode=/.test(uri)) return uri
  return uri.includes('?') ? `${uri}&sslmode=require` : `${uri}?sslmode=require`
}

function withPgClientPath(env: NodeJS.ProcessEnv): NodeJS.ProcessEnv {
  const brewPg18 = '/opt/homebrew/opt/postgresql@18/bin'
  if (existsSync(`${brewPg18}/pg_dump`)) {
    return { ...env, PATH: `${brewPg18}:${env.PATH ?? ''}` }
  }
  return env
}

function localEnv(): NodeJS.ProcessEnv {
  const env: NodeJS.ProcessEnv = withPgClientPath({ ...process.env })
  delete env.PGDATABASE
  delete env.PGSSLMODE

  const uri = process.env.DATABASE_URI?.trim()
  if (!uri) return env

  let url: URL
  try {
    url = new URL(uri)
  } catch {
    return env
  }

  if (!isLocalHostname(url.hostname)) return env

  env.PGHOST = url.hostname
  if (url.port) env.PGPORT = url.port
  if (url.username) env.PGUSER = decodeURIComponent(url.username)
  if (url.password) env.PGPASSWORD = decodeURIComponent(url.password)
  const sslmode = url.searchParams.get('sslmode')
  if (sslmode) env.PGSSLMODE = sslmode
  return env
}

function run(command: string, args: string[], env: NodeJS.ProcessEnv): SpawnSyncReturns<Buffer> {
  const result = spawnSync(command, args, { stdio: 'inherit', env })
  if (result.error) {
    const err = result.error as NodeJS.ErrnoException
    if (err.code === 'ENOENT') {
      fail(
        `PostgreSQL client tools are not installed (missing: ${command}). Install them (apt install postgresql-client / brew install libpq) and retry.`,
      )
    }
    fail(result.error.message)
  }
  return result
}

function runOrFail(command: string, args: string[], env: NodeJS.ProcessEnv): void {
  const result = run(command, args, env)
  if (result.status !== 0) {
    fail(`${command} failed with exit code ${result.status ?? 'unknown'}.`)
  }
}

function main(): void {
  loadEnvFile(join(root, '.env'))
  loadEnvFile(join(root, '.env.local'))

  const neonUri = withSslRequire(requireNeonUri())
  try {
    const host = new URL(neonUri).hostname
    if (isLocalHostname(host)) {
      fail('NEON_DATABASE_URI points at localhost. Pass the production Neon URL.')
    }
  } catch {
    fail('NEON_DATABASE_URI is not a valid URL.')
  }

  requireTools()

  const env = localEnv()
  const dumpDir = mkdtempSync(join(tmpdir(), 'bakery-db-pull-'))
  const dumpFile = join(dumpDir, 'bakery.sql')
  const restoreFile = join(dumpDir, 'bakery-restore.sql')
  const cleanup = (): void => rmSync(dumpDir, { recursive: true, force: true })
  process.on('exit', cleanup)
  process.on('SIGINT', () => process.exit(130))
  process.on('SIGTERM', () => process.exit(143))

  console.log(`Dumping production Neon, then replacing local database "${LOCAL_DB}" (local data will be wiped).`)

  const dumpEnv = withPgClientPath({ ...process.env })
  delete dumpEnv.PGHOST
  delete dumpEnv.PGPORT
  delete dumpEnv.PGUSER
  delete dumpEnv.PGPASSWORD
  delete dumpEnv.PGDATABASE
  delete dumpEnv.PGSSLMODE

  runOrFail(
    'pg_dump',
    ['--no-owner', '--no-acl', '--format=plain', '--file', dumpFile, `--dbname=${neonUri}`],
    dumpEnv,
  )

  const sql = readFileSync(dumpFile, 'utf8')
    .split('\n')
    .filter((line) => !UNSUPPORTED_GUC.test(line))
    .join('\n')
  writeFileSync(restoreFile, sql)

  // Prefer --force (Postgres 13+) so leftover connections do not block dropdb.
  const drop = run('dropdb', ['--if-exists', '--force', LOCAL_DB], env)
  if (drop.status !== 0) {
    run(
      'psql',
      [
        '-d',
        'postgres',
        '-v',
        'ON_ERROR_STOP=1',
        '-c',
        `SELECT pg_terminate_backend(pid) FROM pg_stat_activity WHERE datname = '${LOCAL_DB}' AND pid <> pg_backend_pid();`,
      ],
      env,
    )
    runOrFail('dropdb', ['--if-exists', LOCAL_DB], env)
  }

  runOrFail('createdb', [LOCAL_DB], env)
  runOrFail('psql', ['-v', 'ON_ERROR_STOP=1', '-d', LOCAL_DB, '-f', restoreFile], env)

  console.log(`Done. Local "${LOCAL_DB}" now matches production. Photos may 404 locally if they live on Vercel Blob.`)
}

main()
