CREATE TABLE "content"."data_store_entries" (
  "id" UUID NOT NULL DEFAULT gen_random_uuid(),
  "scope" TEXT NOT NULL DEFAULT 'GLOBAL',
  "owner_user_id" UUID,
  "namespace" TEXT NOT NULL,
  "key" TEXT NOT NULL,
  "value" JSONB NOT NULL DEFAULT '{}',
  "encrypted" BOOLEAN NOT NULL DEFAULT false,
  "created_by_user_id" UUID,
  "updated_by_user_id" UUID,
  "created_at" TIMESTAMPTZ NOT NULL DEFAULT now(),
  "updated_at" TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT "data_store_entries_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "data_store_entries_scope_check" CHECK ("scope" IN ('GLOBAL', 'USER')),
  CONSTRAINT "data_store_entries_global_owner_check" CHECK (("scope" = 'USER' AND "owner_user_id" IS NOT NULL) OR ("scope" = 'GLOBAL' AND "owner_user_id" IS NULL)),
  CONSTRAINT "data_store_entries_owner_user_id_fkey" FOREIGN KEY ("owner_user_id") REFERENCES "identity"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT "data_store_entries_created_by_user_id_fkey" FOREIGN KEY ("created_by_user_id") REFERENCES "identity"."users"("id") ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT "data_store_entries_updated_by_user_id_fkey" FOREIGN KEY ("updated_by_user_id") REFERENCES "identity"."users"("id") ON DELETE SET NULL ON UPDATE CASCADE
);

CREATE INDEX "data_store_entries_scope_idx" ON "content"."data_store_entries"("scope");
CREATE INDEX "data_store_entries_namespace_idx" ON "content"."data_store_entries"("namespace");
CREATE INDEX "data_store_entries_key_idx" ON "content"."data_store_entries"("key");
CREATE INDEX "data_store_entries_owner_user_id_idx" ON "content"."data_store_entries"("owner_user_id");
CREATE INDEX "data_store_entries_updated_at_idx" ON "content"."data_store_entries"("updated_at");

CREATE UNIQUE INDEX "data_store_entries_global_namespace_key_uidx"
  ON "content"."data_store_entries"("namespace", "key")
  WHERE "scope" = 'GLOBAL';

CREATE UNIQUE INDEX "data_store_entries_user_namespace_key_uidx"
  ON "content"."data_store_entries"("owner_user_id", "namespace", "key")
  WHERE "scope" = 'USER';

ALTER TABLE "content"."data_store_entries" ENABLE ROW LEVEL SECURITY;

CREATE POLICY "data_store_entries_admin_only" ON "content"."data_store_entries"
  FOR ALL
  USING (app.is_admin())
  WITH CHECK (app.is_admin());
