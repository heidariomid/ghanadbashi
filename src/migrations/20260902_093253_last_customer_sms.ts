import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "orders" ADD COLUMN "last_customer_sms_sent_at" timestamp(3) with time zone;
  ALTER TABLE "orders" ADD COLUMN "last_customer_sms_ok" boolean;
  ALTER TABLE "orders" ADD COLUMN "last_customer_sms_note" varchar;
  ALTER TABLE "orders" ADD COLUMN "last_customer_sms_message_id" varchar;`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "orders" DROP COLUMN "last_customer_sms_sent_at";
  ALTER TABLE "orders" DROP COLUMN "last_customer_sms_ok";
  ALTER TABLE "orders" DROP COLUMN "last_customer_sms_note";
  ALTER TABLE "orders" DROP COLUMN "last_customer_sms_message_id";`)
}
