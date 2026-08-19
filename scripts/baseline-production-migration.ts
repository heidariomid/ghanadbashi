/**
 * One-time baseline for Neon when the schema was created before migrations
 * existed (Drizzle push in early dev). Records the initial migration as applied
 * without re-running CREATE TABLE statements.
 *
 * Run once against production (VPN/Shecan required from Iran):
 *
 *   DATABASE_URI="<neon-url>" pnpm migrate:baseline
 *
 * Safe to re-run — exits if the migration is already recorded or the DB is empty.
 */

import { sql } from '@payloadcms/db-postgres'
import { getPayload } from 'payload'
import config from '@payload-config'

const INITIAL_MIGRATION = '20260819_153742_initial'

async function main() {
  const payload = await getPayload({ config })

  const existing = await payload.find({
    collection: 'payload-migrations',
    where: { name: { equals: INITIAL_MIGRATION } },
    limit: 1,
  })

  if (existing.docs.length > 0) {
    payload.logger.info(`Migration "${INITIAL_MIGRATION}" is already recorded — nothing to do.`)
    process.exit(0)
  }

  const result = await payload.db.execute(sql`
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

  await payload.create({
    collection: 'payload-migrations',
    data: {
      name: INITIAL_MIGRATION,
      batch: 1,
    },
  })

  payload.logger.info(`Recorded baseline for "${INITIAL_MIGRATION}". Future deploys can run migrations normally.`)
  process.exit(0)
}

await main()
