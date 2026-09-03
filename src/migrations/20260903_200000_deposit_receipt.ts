import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "orders" ADD COLUMN "deposit_receipt_token" varchar;
  ALTER TABLE "orders" ADD COLUMN "deposit_receipt_id" integer;
  ALTER TABLE "orders" ADD COLUMN "deposit_receipt_at" timestamp(3) with time zone;
  CREATE UNIQUE INDEX IF NOT EXISTS "orders_deposit_receipt_token_idx" ON "orders" ("deposit_receipt_token");
  DO $$ BEGIN
    ALTER TABLE "orders" ADD CONSTRAINT "orders_deposit_receipt_id_media_id_fk"
      FOREIGN KEY ("deposit_receipt_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION
    WHEN duplicate_object THEN null;
  END $$;`)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "orders" DROP CONSTRAINT IF EXISTS "orders_deposit_receipt_id_media_id_fk";
  DROP INDEX IF EXISTS "orders_deposit_receipt_token_idx";
  ALTER TABLE "orders" DROP COLUMN "deposit_receipt_at";
  ALTER TABLE "orders" DROP COLUMN "deposit_receipt_id";
  ALTER TABLE "orders" DROP COLUMN "deposit_receipt_token";`)
}
