import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
  CREATE TABLE "categories" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL,
  	"slug" varchar,
  	"emoji" varchar,
  	"sort_order" numeric DEFAULT 0,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );

  INSERT INTO "categories" ("title", "slug", "emoji", "sort_order") VALUES
  	('کیک تولد و مناسبتی', 'birthday-cakes', '🎂', 0),
  	('کیک‌های کافه‌ای و عصرانه', 'cafe-cakes', '🍰', 1),
  	('کوکی', 'cookies', '🍪', 2),
  	('شیرینی خشک', 'dry-pastries', '🧁', 3),
  	('دسرها', 'desserts', '🍮', 4),
  	('محصولات سلامت‌محور و رژیمی', 'healthy', '🌿', 5),
  	('شیرینی و کیک‌های رژیمی و کوکی', 'diet-cookies', '🥗', 6),
  	('ارده، عسل و کره بادام‌زمینی', 'spreads', '🥜', 7),
  	('پک‌های هدیه', 'gift-packs', '🎁', 8),
  	('معجون رژیمی و ورزشکاری', 'sport-drinks', '🥤', 9);

  ALTER TABLE "products" ADD COLUMN "category_id" integer;
  ALTER TABLE "gallery" ADD COLUMN "category_id" integer;

  UPDATE "products" SET "category_id" = "categories"."id"
  	FROM "categories" WHERE "categories"."slug" = "products"."category"::text;
  UPDATE "gallery" SET "category_id" = "categories"."id"
  	FROM "categories" WHERE "categories"."slug" = "gallery"."category"::text;

  ALTER TABLE "products" ALTER COLUMN "category_id" SET NOT NULL;
  ALTER TABLE "gallery" ALTER COLUMN "category_id" SET NOT NULL;

  DROP INDEX "products_category_idx";
  DROP INDEX "gallery_category_idx";
  ALTER TABLE "products" DROP COLUMN "category";
  ALTER TABLE "gallery" DROP COLUMN "category";

  ALTER TABLE "products" ADD CONSTRAINT "products_category_id_categories_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."categories"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "gallery" ADD CONSTRAINT "gallery_category_id_categories_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."categories"("id") ON DELETE set null ON UPDATE no action;
  CREATE UNIQUE INDEX "categories_slug_idx" ON "categories" USING btree ("slug");
  CREATE INDEX "categories_updated_at_idx" ON "categories" USING btree ("updated_at");
  CREATE INDEX "categories_created_at_idx" ON "categories" USING btree ("created_at");
  CREATE INDEX "products_category_idx" ON "products" USING btree ("category_id");
  CREATE INDEX "gallery_category_idx" ON "gallery" USING btree ("category_id");

  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "categories_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_categories_fk" FOREIGN KEY ("categories_id") REFERENCES "public"."categories"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "payload_locked_documents_rels_categories_id_idx" ON "payload_locked_documents_rels" USING btree ("categories_id");

  DROP TYPE "public"."enum_products_category";
  DROP TYPE "public"."enum_gallery_category";`)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
  CREATE TYPE "public"."enum_products_category" AS ENUM('birthday-cakes', 'cafe-cakes', 'cookies', 'dry-pastries', 'desserts', 'healthy', 'diet-cookies', 'spreads', 'gift-packs', 'sport-drinks');
  CREATE TYPE "public"."enum_gallery_category" AS ENUM('birthday-cakes', 'cafe-cakes', 'cookies', 'dry-pastries', 'desserts', 'healthy', 'diet-cookies', 'spreads', 'gift-packs', 'sport-drinks');

  ALTER TABLE "products" ADD COLUMN "category" "enum_products_category";
  ALTER TABLE "gallery" ADD COLUMN "category" "enum_gallery_category";

  UPDATE "products" SET "category" = "categories"."slug"::"enum_products_category"
  	FROM "categories" WHERE "categories"."id" = "products"."category_id";
  UPDATE "gallery" SET "category" = "categories"."slug"::"enum_gallery_category"
  	FROM "categories" WHERE "categories"."id" = "gallery"."category_id";

  ALTER TABLE "products" ALTER COLUMN "category" SET NOT NULL;
  ALTER TABLE "gallery" ALTER COLUMN "category" SET NOT NULL;

  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_categories_fk";
  DROP INDEX "payload_locked_documents_rels_categories_id_idx";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "categories_id";

  ALTER TABLE "products" DROP CONSTRAINT "products_category_id_categories_id_fk";
  ALTER TABLE "gallery" DROP CONSTRAINT "gallery_category_id_categories_id_fk";
  DROP INDEX "products_category_idx";
  DROP INDEX "gallery_category_idx";
  ALTER TABLE "products" DROP COLUMN "category_id";
  ALTER TABLE "gallery" DROP COLUMN "category_id";
  CREATE INDEX "products_category_idx" ON "products" USING btree ("category");
  CREATE INDEX "gallery_category_idx" ON "gallery" USING btree ("category");

  DROP TABLE "categories" CASCADE;`)
}
