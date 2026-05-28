CREATE SCHEMA IF NOT EXISTS app;

CREATE OR REPLACE FUNCTION app.current_user_id()
RETURNS uuid
LANGUAGE sql
STABLE
AS $$
  SELECT NULLIF(current_setting('app.current_user_id', true), '')::uuid;
$$;

CREATE OR REPLACE FUNCTION app.current_organization_id()
RETURNS uuid
LANGUAGE sql
STABLE
AS $$
  SELECT NULLIF(current_setting('app.current_organization_id', true), '')::uuid;
$$;

CREATE OR REPLACE FUNCTION app.current_account_type()
RETURNS text
LANGUAGE sql
STABLE
AS $$
  SELECT lower(COALESCE(NULLIF(current_setting('app.current_account_type', true), ''), 'user'));
$$;

CREATE OR REPLACE FUNCTION app.current_capabilities()
RETURNS text[]
LANGUAGE sql
STABLE
AS $$
  SELECT CASE
    WHEN NULLIF(current_setting('app.current_capabilities', true), '') IS NULL THEN ARRAY[]::text[]
    ELSE regexp_split_to_array(lower(current_setting('app.current_capabilities', true)), '\s*,\s*')
  END;
$$;

CREATE OR REPLACE FUNCTION app.is_admin()
RETURNS boolean
LANGUAGE sql
STABLE
AS $$
  SELECT app.current_account_type() = 'admin';
$$;

CREATE OR REPLACE FUNCTION app.same_org(org_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
AS $$
  SELECT org_id IS NOT NULL AND org_id = app.current_organization_id();
$$;

CREATE OR REPLACE FUNCTION app.has_capability(capability_name text)
RETURNS boolean
LANGUAGE sql
STABLE
AS $$
  SELECT lower(capability_name) = ANY(app.current_capabilities());
$$;

