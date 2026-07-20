-- Canonical Test Series schema.
-- Prepared and verified on Neon temporary branch br-odd-darkness-atnevjdq.

CREATE TABLE assessment.test_series (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  exam_version_id uuid NOT NULL REFERENCES catalog.exam_versions(id) ON DELETE RESTRICT,
  code varchar(80) NOT NULL UNIQUE,
  name varchar(240) NOT NULL,
  current_version_number integer NOT NULL DEFAULT 1,
  created_by uuid REFERENCES identity.users(id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  deleted_at timestamptz
);

CREATE TABLE assessment.test_series_versions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  series_id uuid NOT NULL REFERENCES assessment.test_series(id) ON DELETE RESTRICT,
  version_number integer NOT NULL,
  status varchar(30) NOT NULL,
  description text,
  validity_days integer,
  progression_rules jsonb NOT NULL DEFAULT '{}'::jsonb,
  settings jsonb NOT NULL DEFAULT '{}'::jsonb,
  change_reason text NOT NULL,
  created_by uuid REFERENCES identity.users(id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT test_series_versions_series_version_unique UNIQUE (series_id, version_number),
  CONSTRAINT test_series_versions_status_check CHECK (status IN ('draft','active','deprecated','archived')),
  CONSTRAINT test_series_versions_validity_check CHECK (validity_days IS NULL OR validity_days > 0)
);

CREATE TABLE assessment.test_series_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  series_version_id uuid NOT NULL REFERENCES assessment.test_series_versions(id) ON DELETE CASCADE,
  test_id uuid NOT NULL REFERENCES assessment.tests(id) ON DELETE RESTRICT,
  sort_order integer NOT NULL,
  access_mode varchar(20) NOT NULL DEFAULT 'included',
  availability jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT test_series_items_version_test_unique UNIQUE (series_version_id, test_id),
  CONSTRAINT test_series_items_version_order_unique UNIQUE (series_version_id, sort_order),
  CONSTRAINT test_series_items_access_check CHECK (access_mode IN ('free','included','premium'))
);

CREATE INDEX test_series_exam_version_idx
  ON assessment.test_series (exam_version_id)
  WHERE deleted_at IS NULL;

CREATE INDEX test_series_status_idx
  ON assessment.test_series_versions (status, created_at DESC);

CREATE INDEX test_series_items_test_idx
  ON assessment.test_series_items (test_id);
