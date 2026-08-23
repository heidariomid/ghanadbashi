import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TABLE "orders_gallery_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"gallery_id" integer NOT NULL,
  	"quantity" numeric NOT NULL
  );
  
  ALTER TABLE "gallery" ADD COLUMN "is_available" boolean DEFAULT true;
  ALTER TABLE "orders_gallery_items" ADD CONSTRAINT "orders_gallery_items_gallery_id_gallery_id_fk" FOREIGN KEY ("gallery_id") REFERENCES "public"."gallery"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "orders_gallery_items" ADD CONSTRAINT "orders_gallery_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."orders"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "orders_gallery_items_order_idx" ON "orders_gallery_items" USING btree ("_order");
  CREATE INDEX "orders_gallery_items_parent_id_idx" ON "orders_gallery_items" USING btree ("_parent_id");
  CREATE INDEX "orders_gallery_items_gallery_idx" ON "orders_gallery_items" USING btree ("gallery_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "orders_gallery_items" CASCADE;
  ALTER TABLE "gallery" DROP COLUMN "is_available";`)
}
