ALTER TABLE "compliance"."admin_actions"
  ADD COLUMN IF NOT EXISTS "payload" JSONB NOT NULL DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS "previous_state" JSONB NOT NULL DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS "next_state" JSONB NOT NULL DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS "reversible" BOOLEAN NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS "reverted_at" TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS "reverted_by_user_id" UUID,
  ADD COLUMN IF NOT EXISTS "reverse_action_id" UUID;

CREATE INDEX IF NOT EXISTS "admin_actions_reverted_by_user_id_idx"
  ON "compliance"."admin_actions"("reverted_by_user_id");

CREATE INDEX IF NOT EXISTS "admin_actions_reverse_action_id_idx"
  ON "compliance"."admin_actions"("reverse_action_id");

ALTER TABLE "compliance"."admin_actions"
  ADD CONSTRAINT "admin_actions_reverted_by_user_id_fkey"
  FOREIGN KEY ("reverted_by_user_id") REFERENCES "identity"."users"("id")
  ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "compliance"."admin_actions"
  ADD CONSTRAINT "admin_actions_reverse_action_id_fkey"
  FOREIGN KEY ("reverse_action_id") REFERENCES "compliance"."admin_actions"("id")
  ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "content"."data_store_entries"
  ADD COLUMN IF NOT EXISTS "deleted_by_user_id" UUID,
  ADD COLUMN IF NOT EXISTS "deleted_at" TIMESTAMPTZ;

CREATE INDEX IF NOT EXISTS "data_store_entries_deleted_at_idx"
  ON "content"."data_store_entries"("deleted_at");

ALTER TABLE "content"."data_store_entries"
  ADD CONSTRAINT "data_store_entries_deleted_by_user_id_fkey"
  FOREIGN KEY ("deleted_by_user_id") REFERENCES "identity"."users"("id")
  ON DELETE SET NULL ON UPDATE CASCADE;

DROP INDEX IF EXISTS "content"."data_store_entries_global_namespace_key_uidx";
DROP INDEX IF EXISTS "content"."data_store_entries_user_namespace_key_uidx";

CREATE UNIQUE INDEX "data_store_entries_global_namespace_key_uidx"
  ON "content"."data_store_entries"("namespace", "key")
  WHERE "scope" = 'GLOBAL' AND "deleted_at" IS NULL;

CREATE UNIQUE INDEX "data_store_entries_user_namespace_key_uidx"
  ON "content"."data_store_entries"("owner_user_id", "namespace", "key")
  WHERE "scope" = 'USER' AND "deleted_at" IS NULL;

CREATE TABLE IF NOT EXISTS "content"."data_store_entry_versions" (
  "id" UUID NOT NULL DEFAULT gen_random_uuid(),
  "entry_id" UUID NOT NULL,
  "actor_user_id" UUID,
  "action" TEXT NOT NULL,
  "previous_value" JSONB,
  "next_value" JSONB,
  "created_at" TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT "data_store_entry_versions_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "data_store_entry_versions_entry_id_fkey" FOREIGN KEY ("entry_id") REFERENCES "content"."data_store_entries"("id") ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT "data_store_entry_versions_actor_user_id_fkey" FOREIGN KEY ("actor_user_id") REFERENCES "identity"."users"("id") ON DELETE SET NULL ON UPDATE CASCADE
);

CREATE INDEX IF NOT EXISTS "data_store_entry_versions_entry_id_created_at_idx"
  ON "content"."data_store_entry_versions"("entry_id", "created_at");

CREATE INDEX IF NOT EXISTS "data_store_entry_versions_actor_user_id_idx"
  ON "content"."data_store_entry_versions"("actor_user_id");

ALTER TABLE "content"."data_store_entry_versions" ENABLE ROW LEVEL SECURITY;

CREATE POLICY "data_store_entry_versions_admin_only" ON "content"."data_store_entry_versions"
  FOR ALL
  USING (app.is_admin())
  WITH CHECK (app.is_admin());
