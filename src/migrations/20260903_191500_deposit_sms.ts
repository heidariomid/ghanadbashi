import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "site_settings" ADD COLUMN "contact_card_number" varchar;
  ALTER TABLE "orders" ADD COLUMN "deposit_amount" numeric;
  ALTER TABLE "orders" ADD COLUMN "last_deposit_sms_sent_at" timestamp(3) with time zone;
  ALTER TABLE "orders" ADD COLUMN "last_deposit_sms_ok" boolean;
  ALTER TABLE "orders" ADD COLUMN "last_deposit_sms_note" varchar;
  ALTER TABLE "orders" ADD COLUMN "last_deposit_sms_message_id" varchar;`)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "site_settings" DROP COLUMN "contact_card_number";
  ALTER TABLE "orders" DROP COLUMN "deposit_amount";
  ALTER TABLE "orders" DROP COLUMN "last_deposit_sms_sent_at";
  ALTER TABLE "orders" DROP COLUMN "last_deposit_sms_ok";
  ALTER TABLE "orders" DROP COLUMN "last_deposit_sms_note";
  ALTER TABLE "orders" DROP COLUMN "last_deposit_sms_message_id";`)
}
