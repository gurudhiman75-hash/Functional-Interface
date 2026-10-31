-- Explicit, sale-independent access classification for canonical tests.
-- SOURCE ONLY: apply to the canonical database before deploying routes that read this table.
-- Additive. Existing orders, entitlements, attempts, and published versions remain untouched.
-- A historical paid offer is sufficient to backfill premium, even if its product is
-- archived or the current product version no longer contains the test.
CREATE TABLE IF NOT EXISTS commerce.test_access_policies (
  test_id uuid PRIMARY KEY REFERENCES assessment.tests(id) ON DELETE RESTRICT,
  access_mode text NOT NULL CHECK (access_mode IN ('free', 'premium')),
  source text NOT NULL CHECK (source IN ('backfill', 'package_activation', 'admin')),
  changed_by uuid REFERENCES identity.users(id) ON DELETE SET NULL,
  updated_at timestamptz NOT NULL DEFAULT now()
);

INSERT INTO commerce.test_access_policies (test_id, access_mode, source)
SELECT t.id,
  CASE WHEN EXISTS (
    SELECT 1
    FROM commerce.product_version_tests pvt
    JOIN commerce.product_versions pv ON pv.id = pvt.product_version_id
    WHERE pvt.test_id = t.id AND pv.sale_price_minor > 0
  ) THEN 'premium' ELSE 'free' END,
  'backfill'
FROM assessment.tests t
ON CONFLICT (test_id) DO NOTHING;

CREATE INDEX IF NOT EXISTS test_access_policies_mode_idx
  ON commerce.test_access_policies (access_mode);

-- Classification for new tests without a row is 'premium' (fail closed).
-- Use the permission-gated admin endpoint to explicitly mark any preview as free.
