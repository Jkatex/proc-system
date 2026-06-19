CREATE TABLE "compliance"."compliance_rules" (
  "id" UUID NOT NULL DEFAULT gen_random_uuid(),
  "owner_org_id" UUID,
  "code" TEXT NOT NULL,
  "title" TEXT NOT NULL,
  "description" TEXT,
  "severity" "compliance"."AuditSeverity" NOT NULL DEFAULT 'WARNING',
  "status" TEXT NOT NULL DEFAULT 'ACTIVE',
  "condition" JSONB NOT NULL DEFAULT '{}',
  "payload" JSONB NOT NULL DEFAULT '{}',
  "created_by_user_id" UUID,
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMP(3) NOT NULL,

  CONSTRAINT "compliance_rules_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "compliance_rules_owner_org_id_fkey" FOREIGN KEY ("owner_org_id") REFERENCES "organization"."organizations"("id") ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT "compliance_rules_created_by_user_id_fkey" FOREIGN KEY ("created_by_user_id") REFERENCES "identity"."users"("id") ON DELETE SET NULL ON UPDATE CASCADE
);

CREATE UNIQUE INDEX "compliance_rules_code_key" ON "compliance"."compliance_rules"("code");
CREATE INDEX "compliance_rules_status_idx" ON "compliance"."compliance_rules"("status");
CREATE INDEX "compliance_rules_severity_idx" ON "compliance"."compliance_rules"("severity");
CREATE INDEX "compliance_rules_owner_org_id_idx" ON "compliance"."compliance_rules"("owner_org_id");

ALTER TABLE "compliance"."compliance_rules" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "compliance"."compliance_rules" FORCE ROW LEVEL SECURITY;

CREATE POLICY "compliance_rules_admin_or_org" ON "compliance"."compliance_rules"
  FOR ALL
  USING (app.is_admin() OR app.same_org(owner_org_id))
  WITH CHECK (app.is_admin() OR app.same_org(owner_org_id));
