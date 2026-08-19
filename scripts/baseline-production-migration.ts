/**
 * One-time baseline for a database whose schema was created before migrations
 * existed (Drizzle push in early dev). Does two things:
 *
 *   1. Removes the `batch: -1` row Payload writes when dev push touches the DB.
 *      While that row exists, `payload migrate` stops to ask an interactive
 *      question, which hangs a Vercel build until it times out.
 *   2. Records the initial migration as applied, so migrate skips it instead of
 *      re-running CREATE TABLE against tables that already exist.
 *
 * Run once per database. For production (VPN/Shecan required from Iran):
 *
 *   DATABASE_URI="<neon-url>" pnpm migrate:baseline
 *
 * Safe to re-run — it exits cleanly when there is nothing left to fix.
 */

import { sql } from '@payloadcms/db-postgres'
import { getPayload } from 'payload'
import config from '@payload-config'

const INITIAL_MIGRATION = '20260819_153742_initial'

async function main() {
  const payload = await getPayload({ config })

  const result = await payload.db.drizzle.execute(sql`
    SELECT EXISTS (
      SELECT 1
      FROM information_schema.tables
      WHERE table_schema = 'public' AND table_name = 'products'
    ) AS "exists"
  `)

  const row = result.rows[0] as { exists?: boolean } | undefined
  if (!row?.exists) {
    payload.logger.error('Database has no Payload schema yet — run `pnpm migrate` instead of baseline.')
    process.exit(1)
  }

  const devRows = await payload.find({
    collection: 'payload-migrations',
    where: { batch: { equals: -1 } },
    limit: 100,
  })

  for (const doc of devRows.docs) {
    await payload.delete({ collection: 'payload-migrations', id: doc.id })
    payload.logger.info(`Removed dev-push marker "${doc.name}" (batch -1).`)
  }

  const existing = await payload.find({
    collection: 'payload-migrations',
    where: { name: { equals: INITIAL_MIGRATION } },
    limit: 1,
  })

  if (existing.docs.length === 0) {
    await payload.create({
      collection: 'payload-migrations',
      data: { name: INITIAL_MIGRATION, batch: 1 },
    })
    payload.logger.info(`Recorded baseline for "${INITIAL_MIGRATION}".`)
  } else {
    payload.logger.info(`"${INITIAL_MIGRATION}" was already recorded.`)
  }

  if (devRows.docs.length === 0 && existing.docs.length > 0) {
    payload.logger.info('Nothing to do — this database is already baselined.')
  } else {
    payload.logger.info('Done. `payload migrate` will now run without prompting.')
  }

  process.exit(0)
}

await main()
