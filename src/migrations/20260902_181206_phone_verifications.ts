import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TABLE "phone_verifications" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"phone" varchar NOT NULL,
  	"code_hash" varchar NOT NULL,
  	"expires_at" timestamp(3) with time zone NOT NULL,
  	"attempts" numeric DEFAULT 0 NOT NULL,
  	"consumed_at" timestamp(3) with time zone,
  	"ip" varchar NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "phone_verifications_id" integer;
  CREATE INDEX "phone_verifications_phone_idx" ON "phone_verifications" USING btree ("phone");
  CREATE INDEX "phone_verifications_updated_at_idx" ON "phone_verifications" USING btree ("updated_at");
  CREATE INDEX "phone_verifications_created_at_idx" ON "phone_verifications" USING btree ("created_at");
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_phone_verifications_fk" FOREIGN KEY ("phone_verifications_id") REFERENCES "public"."phone_verifications"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "payload_locked_documents_rels_phone_verifications_id_idx" ON "payload_locked_documents_rels" USING btree ("phone_verifications_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "phone_verifications" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "phone_verifications" CASCADE;
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_phone_verifications_fk";
  
  DROP INDEX "payload_locked_documents_rels_phone_verifications_id_idx";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "phone_verifications_id";`)
}
