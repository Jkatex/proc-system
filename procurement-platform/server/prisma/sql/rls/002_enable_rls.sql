DO $$
DECLARE
  target record;
BEGIN
  FOR target IN
    SELECT * FROM (VALUES
      ('organization', 'organizations', 'id'),
      ('organization', 'organization_members', 'organization_id'),
      ('organization', 'organization_capabilities', 'organization_id'),
      ('organization', 'organization_profiles', 'organization_id'),
      ('organization', 'buyer_profiles', 'organization_id'),
      ('organization', 'supplier_profiles', 'organization_id'),
      ('documents', 'document_objects', 'owner_org_id'),
      ('procurement', 'tenders', 'buyer_org_id'),
      ('procurement', 'tender_requirements', NULL),
      ('procurement', 'tender_milestones', NULL),
      ('procurement', 'tender_commercial_items', NULL),
      ('bidding', 'bids', 'supplier_org_id'),
      ('contract', 'contracts', 'buyer_org_id'),
      ('financial', 'purchase_orders', 'buyer_org_id'),
      ('financial', 'invoices', 'buyer_org_id'),
      ('communication', 'communication_items', 'owner_org_id'),
      ('compliance', 'audit_events', 'owner_org_id'),
      ('compliance', 'compliance_cases', 'owner_org_id'),
      ('compliance', 'admin_actions', 'owner_org_id')
    ) AS t(schema_name, table_name, org_column)
  LOOP
    EXECUTE format('ALTER TABLE %I.%I ENABLE ROW LEVEL SECURITY', target.schema_name, target.table_name);
    EXECUTE format('ALTER TABLE %I.%I FORCE ROW LEVEL SECURITY', target.schema_name, target.table_name);

    IF target.org_column IS NOT NULL THEN
      EXECUTE format(
        'CREATE POLICY tenant_isolation ON %I.%I FOR ALL USING (app.is_admin() OR app.same_org(%I)) WITH CHECK (app.is_admin() OR app.same_org(%I))',
        target.schema_name,
        target.table_name,
        target.org_column,
        target.org_column
      );
    END IF;
  END LOOP;
END $$;

ALTER TABLE identity.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE identity.users FORCE ROW LEVEL SECURITY;
CREATE POLICY users_self_or_admin ON identity.users
  FOR ALL
  USING (app.is_admin() OR id = app.current_user_id())
  WITH CHECK (app.is_admin() OR id = app.current_user_id());

ALTER TABLE identity.accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE identity.accounts FORCE ROW LEVEL SECURITY;
CREATE POLICY accounts_self_or_admin ON identity.accounts
  FOR ALL
  USING (app.is_admin() OR user_id = app.current_user_id())
  WITH CHECK (app.is_admin() OR user_id = app.current_user_id());

ALTER TABLE identity.sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE identity.sessions FORCE ROW LEVEL SECURITY;
CREATE POLICY sessions_self_or_admin ON identity.sessions
  FOR ALL
  USING (app.is_admin() OR user_id = app.current_user_id())
  WITH CHECK (app.is_admin() OR user_id = app.current_user_id());

ALTER TABLE identity.verification_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE identity.verification_profiles FORCE ROW LEVEL SECURITY;
CREATE POLICY verification_self_org_or_admin ON identity.verification_profiles
  FOR ALL
  USING (app.is_admin() OR user_id = app.current_user_id() OR app.same_org(organization_id))
  WITH CHECK (app.is_admin() OR user_id = app.current_user_id() OR app.same_org(organization_id));

ALTER TABLE procurement.tenders ENABLE ROW LEVEL SECURITY;
ALTER TABLE procurement.tenders FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS tenant_isolation ON procurement.tenders;
CREATE POLICY tenders_company_or_public ON procurement.tenders
  FOR SELECT
  USING (app.is_admin() OR app.same_org(buyer_org_id) OR (visibility = 'PUBLIC_MARKETPLACE' AND status IN ('PUBLISHED', 'OPEN')));
CREATE POLICY tenders_buyer_write ON procurement.tenders
  FOR INSERT
  WITH CHECK (app.is_admin() OR (app.same_org(buyer_org_id) AND app.has_capability('buyer')));
CREATE POLICY tenders_buyer_update ON procurement.tenders
  FOR UPDATE
  USING (app.is_admin() OR app.same_org(buyer_org_id))
  WITH CHECK (app.is_admin() OR (app.same_org(buyer_org_id) AND app.has_capability('buyer')));
CREATE POLICY tenders_buyer_delete ON procurement.tenders
  FOR DELETE
  USING (app.is_admin() OR (app.same_org(buyer_org_id) AND app.has_capability('buyer')));

CREATE POLICY tender_requirements_parent_access ON procurement.tender_requirements
  FOR ALL
  USING (
    app.is_admin()
    OR EXISTS (
      SELECT 1
      FROM procurement.tenders t
      WHERE t.id = tender_id
      AND app.same_org(t.buyer_org_id)
    )
  )
  WITH CHECK (
    app.is_admin()
    OR EXISTS (
      SELECT 1
      FROM procurement.tenders t
      WHERE t.id = tender_id
      AND app.same_org(t.buyer_org_id)
    )
  );

CREATE POLICY tender_milestones_parent_access ON procurement.tender_milestones
  FOR ALL
  USING (
    app.is_admin()
    OR EXISTS (
      SELECT 1
      FROM procurement.tenders t
      WHERE t.id = tender_id
      AND app.same_org(t.buyer_org_id)
    )
  )
  WITH CHECK (
    app.is_admin()
    OR EXISTS (
      SELECT 1
      FROM procurement.tenders t
      WHERE t.id = tender_id
      AND app.same_org(t.buyer_org_id)
    )
  );

CREATE POLICY tender_commercial_items_parent_access ON procurement.tender_commercial_items
  FOR ALL
  USING (
    app.is_admin()
    OR EXISTS (
      SELECT 1
      FROM procurement.tenders t
      WHERE t.id = tender_id
      AND app.same_org(t.buyer_org_id)
    )
  )
  WITH CHECK (
    app.is_admin()
    OR EXISTS (
      SELECT 1
      FROM procurement.tenders t
      WHERE t.id = tender_id
      AND app.same_org(t.buyer_org_id)
    )
  );

ALTER TABLE bidding.bids ENABLE ROW LEVEL SECURITY;
ALTER TABLE bidding.bids FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS tenant_isolation ON bidding.bids;
CREATE POLICY bids_buyer_or_supplier_select ON bidding.bids
  FOR SELECT
  USING (app.is_admin() OR app.same_org(buyer_org_id) OR app.same_org(supplier_org_id));
CREATE POLICY bids_supplier_write ON bidding.bids
  FOR INSERT
  WITH CHECK (app.is_admin() OR (app.same_org(supplier_org_id) AND app.has_capability('supplier')));
CREATE POLICY bids_supplier_update ON bidding.bids
  FOR UPDATE
  USING (app.is_admin() OR app.same_org(supplier_org_id))
  WITH CHECK (app.is_admin() OR (app.same_org(supplier_org_id) AND app.has_capability('supplier')));

ALTER TABLE evaluation.evaluation_scores ENABLE ROW LEVEL SECURITY;
ALTER TABLE evaluation.evaluation_scores FORCE ROW LEVEL SECURITY;
CREATE POLICY evaluation_scores_read ON evaluation.evaluation_scores
  FOR SELECT
  USING (
    app.is_admin()
    OR EXISTS (
      SELECT 1
      FROM evaluation.evaluation_workspaces ew
      WHERE ew.id = workspace_id
      AND app.same_org(ew.buyer_org_id)
    )
  );
CREATE POLICY evaluation_scores_insert ON evaluation.evaluation_scores
  FOR INSERT
  WITH CHECK (
    app.is_admin() = false
    AND EXISTS (
      SELECT 1
      FROM evaluation.evaluation_workspaces ew
      WHERE ew.id = workspace_id
      AND app.same_org(ew.buyer_org_id)
    )
  );
CREATE POLICY evaluation_scores_update ON evaluation.evaluation_scores
  FOR UPDATE
  USING (
    app.is_admin() = false
    AND EXISTS (
      SELECT 1
      FROM evaluation.evaluation_workspaces ew
      WHERE ew.id = workspace_id
      AND app.same_org(ew.buyer_org_id)
    )
  )
  WITH CHECK (
    app.is_admin() = false
    AND EXISTS (
      SELECT 1
      FROM evaluation.evaluation_workspaces ew
      WHERE ew.id = workspace_id
      AND app.same_org(ew.buyer_org_id)
    )
  );
