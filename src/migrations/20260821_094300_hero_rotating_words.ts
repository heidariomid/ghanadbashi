import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TABLE "site_settings_brand_rotating_words" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"word" varchar NOT NULL
  );
  
  ALTER TABLE "site_settings" ADD COLUMN "brand_rotating_prefix" varchar;
  ALTER TABLE "site_settings_brand_rotating_words" ADD CONSTRAINT "site_settings_brand_rotating_words_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."site_settings"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "site_settings_brand_rotating_words_order_idx" ON "site_settings_brand_rotating_words" USING btree ("_order");
  CREATE INDEX "site_settings_brand_rotating_words_parent_id_idx" ON "site_settings_brand_rotating_words" USING btree ("_parent_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "site_settings_brand_rotating_words" CASCADE;
  ALTER TABLE "site_settings" DROP COLUMN "brand_rotating_prefix";`)
}
