-- Canonical Commerce foundation
-- Source-only migration. NOT yet applied to the canonical Neon project.
-- Additive migration: existing identity, assessment, learning and platform rows are not rewritten.

CREATE SCHEMA IF NOT EXISTS commerce;

CREATE TABLE commerce.products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  code varchar(120) NOT NULL UNIQUE,
  current_version_number integer NOT NULL DEFAULT 1 CHECK (current_version_number > 0),
  status varchar(24) NOT NULL DEFAULT 'draft' CHECK (status IN ('draft','active','archived')),
  created_by uuid REFERENCES identity.users(id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  archived_at timestamptz
);

CREATE TABLE commerce.product_versions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id uuid NOT NULL REFERENCES commerce.products(id) ON DELETE RESTRICT,
  version_number integer NOT NULL CHECK (version_number > 0),
  title varchar(255) NOT NULL,
  description text NOT NULL DEFAULT '',
  currency char(3) NOT NULL CHECK (currency = upper(currency)),
  list_price_minor bigint NOT NULL CHECK (list_price_minor >= 0),
  sale_price_minor bigint NOT NULL CHECK (sale_price_minor >= 0 AND sale_price_minor <= list_price_minor),
  validity_days integer CHECK (validity_days IS NULL OR validity_days > 0),
  sale_start_at timestamptz,
  sale_end_at timestamptz,
  configuration jsonb NOT NULL DEFAULT '{}'::jsonb,
  change_reason text NOT NULL,
  created_by uuid REFERENCES identity.users(id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (product_id, version_number),
  CHECK (sale_start_at IS NULL OR sale_end_at IS NULL OR sale_end_at > sale_start_at)
);

CREATE TABLE commerce.product_version_tests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_version_id uuid NOT NULL REFERENCES commerce.product_versions(id) ON DELETE CASCADE,
  test_id uuid NOT NULL REFERENCES assessment.tests(id) ON DELETE RESTRICT,
  sort_order integer NOT NULL CHECK (sort_order > 0),
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (product_version_id, test_id),
  UNIQUE (product_version_id, sort_order)
);

CREATE TABLE commerce.coupons (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  code varchar(80) NOT NULL UNIQUE,
  status varchar(24) NOT NULL DEFAULT 'draft' CHECK (status IN ('draft','active','paused','expired','archived')),
  discount_type varchar(24) NOT NULL CHECK (discount_type IN ('fixed','percentage')),
  discount_value bigint NOT NULL CHECK (discount_value > 0),
  currency char(3),
  maximum_discount_minor bigint CHECK (maximum_discount_minor IS NULL OR maximum_discount_minor >= 0),
  minimum_order_minor bigint NOT NULL DEFAULT 0 CHECK (minimum_order_minor >= 0),
  starts_at timestamptz,
  ends_at timestamptz,
  max_redemptions integer CHECK (max_redemptions IS NULL OR max_redemptions > 0),
  max_redemptions_per_user integer CHECK (max_redemptions_per_user IS NULL OR max_redemptions_per_user > 0),
  created_by uuid REFERENCES identity.users(id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CHECK (currency IS NULL OR currency = upper(currency)),
  CHECK (discount_type <> 'percentage' OR discount_value <= 10000),
  CHECK (starts_at IS NULL OR ends_at IS NULL OR ends_at > starts_at)
);

CREATE TABLE commerce.coupon_products (
  coupon_id uuid NOT NULL REFERENCES commerce.coupons(id) ON DELETE CASCADE,
  product_id uuid NOT NULL REFERENCES commerce.products(id) ON DELETE CASCADE,
  PRIMARY KEY (coupon_id, product_id)
);

CREATE TABLE commerce.orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_number bigint GENERATED ALWAYS AS IDENTITY UNIQUE,
  user_id uuid NOT NULL REFERENCES identity.users(id) ON DELETE RESTRICT,
  status varchar(32) NOT NULL DEFAULT 'created' CHECK (status IN ('created','payment_pending','paid','cancelled','expired','partially_refunded','refunded','payment_failed')),
  currency char(3) NOT NULL CHECK (currency = upper(currency)),
  subtotal_minor bigint NOT NULL CHECK (subtotal_minor >= 0),
  discount_minor bigint NOT NULL DEFAULT 0 CHECK (discount_minor >= 0),
  tax_minor bigint NOT NULL DEFAULT 0 CHECK (tax_minor >= 0),
  total_minor bigint NOT NULL CHECK (total_minor >= 0),
  coupon_id uuid REFERENCES commerce.coupons(id) ON DELETE SET NULL,
  pricing_snapshot jsonb NOT NULL,
  idempotency_key varchar(160) NOT NULL,
  expires_at timestamptz,
  paid_at timestamptz,
  cancelled_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, idempotency_key),
  CHECK (subtotal_minor - discount_minor + tax_minor = total_minor)
);

CREATE TABLE commerce.order_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id uuid NOT NULL REFERENCES commerce.orders(id) ON DELETE RESTRICT,
  product_id uuid NOT NULL REFERENCES commerce.products(id) ON DELETE RESTRICT,
  product_version_id uuid NOT NULL REFERENCES commerce.product_versions(id) ON DELETE RESTRICT,
  quantity integer NOT NULL DEFAULT 1 CHECK (quantity = 1),
  unit_price_minor bigint NOT NULL CHECK (unit_price_minor >= 0),
  discount_minor bigint NOT NULL DEFAULT 0 CHECK (discount_minor >= 0),
  tax_minor bigint NOT NULL DEFAULT 0 CHECK (tax_minor >= 0),
  total_minor bigint NOT NULL CHECK (total_minor >= 0),
  item_snapshot jsonb NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (order_id, product_version_id),
  CHECK (unit_price_minor - discount_minor + tax_minor = total_minor)
);

CREATE TABLE commerce.coupon_redemptions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  coupon_id uuid NOT NULL REFERENCES commerce.coupons(id) ON DELETE RESTRICT,
  order_id uuid NOT NULL UNIQUE REFERENCES commerce.orders(id) ON DELETE RESTRICT,
  user_id uuid NOT NULL REFERENCES identity.users(id) ON DELETE RESTRICT,
  discount_minor bigint NOT NULL CHECK (discount_minor >= 0),
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE commerce.payment_attempts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id uuid NOT NULL REFERENCES commerce.orders(id) ON DELETE RESTRICT,
  provider varchar(40) NOT NULL,
  provider_order_id varchar(160),
  provider_payment_id varchar(160),
  status varchar(32) NOT NULL DEFAULT 'created' CHECK (status IN ('created','authorized','captured','failed','cancelled','partially_refunded','refunded')),
  amount_minor bigint NOT NULL CHECK (amount_minor >= 0),
  currency char(3) NOT NULL CHECK (currency = upper(currency)),
  idempotency_key varchar(160) NOT NULL,
  failure_code varchar(120),
  failure_message text,
  authorized_at timestamptz,
  captured_at timestamptz,
  failed_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (provider, idempotency_key),
  UNIQUE (provider, provider_order_id),
  UNIQUE (provider, provider_payment_id)
);

CREATE TABLE commerce.payment_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  payment_attempt_id uuid REFERENCES commerce.payment_attempts(id) ON DELETE SET NULL,
  provider varchar(40) NOT NULL,
  provider_event_id varchar(180) NOT NULL,
  event_type varchar(120) NOT NULL,
  signature_verified boolean NOT NULL,
  payload jsonb NOT NULL,
  received_at timestamptz NOT NULL DEFAULT now(),
  processed_at timestamptz,
  processing_error text,
  UNIQUE (provider, provider_event_id)
);

CREATE TABLE commerce.refunds (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  payment_attempt_id uuid NOT NULL REFERENCES commerce.payment_attempts(id) ON DELETE RESTRICT,
  provider_refund_id varchar(160),
  status varchar(24) NOT NULL DEFAULT 'created' CHECK (status IN ('created','processed','failed')),
  amount_minor bigint NOT NULL CHECK (amount_minor > 0),
  reason text NOT NULL,
  created_by uuid REFERENCES identity.users(id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  processed_at timestamptz,
  UNIQUE (provider_refund_id)
);

CREATE TABLE commerce.entitlements (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES identity.users(id) ON DELETE RESTRICT,
  order_item_id uuid REFERENCES commerce.order_items(id) ON DELETE RESTRICT,
  product_version_id uuid NOT NULL REFERENCES commerce.product_versions(id) ON DELETE RESTRICT,
  status varchar(24) NOT NULL DEFAULT 'active' CHECK (status IN ('active','expired','revoked')),
  starts_at timestamptz NOT NULL DEFAULT now(),
  ends_at timestamptz,
  revoked_at timestamptz,
  revoke_reason text,
  grant_source varchar(32) NOT NULL CHECK (grant_source IN ('paid_order','manual','migration','promotion')),
  idempotency_key varchar(160) NOT NULL,
  granted_by uuid REFERENCES identity.users(id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, idempotency_key),
  CHECK (ends_at IS NULL OR ends_at > starts_at)
);

CREATE TABLE commerce.entitlement_tests (
  entitlement_id uuid NOT NULL REFERENCES commerce.entitlements(id) ON DELETE CASCADE,
  test_id uuid NOT NULL REFERENCES assessment.tests(id) ON DELETE RESTRICT,
  PRIMARY KEY (entitlement_id, test_id)
);

CREATE INDEX commerce_products_status_idx ON commerce.products (status, updated_at DESC);
CREATE INDEX commerce_product_versions_product_idx ON commerce.product_versions (product_id, version_number DESC);
CREATE INDEX commerce_orders_user_created_idx ON commerce.orders (user_id, created_at DESC);
CREATE INDEX commerce_orders_status_created_idx ON commerce.orders (status, created_at DESC);
CREATE INDEX commerce_payment_attempts_order_idx ON commerce.payment_attempts (order_id, created_at DESC);
CREATE INDEX commerce_payment_events_unprocessed_idx ON commerce.payment_events (received_at) WHERE processed_at IS NULL;
CREATE INDEX commerce_entitlements_user_active_idx ON commerce.entitlements (user_id, ends_at) WHERE status = 'active';
CREATE INDEX commerce_entitlement_tests_test_idx ON commerce.entitlement_tests (test_id, entitlement_id);

INSERT INTO identity.permissions (key, description)
VALUES
  ('commerce.products.read', 'View canonical package and product records.'),
  ('commerce.products.manage', 'Create and version canonical package and product records.'),
  ('commerce.orders.read', 'View canonical order and payment evidence.'),
  ('commerce.orders.manage', 'Perform approved order, payment and refund operations.'),
  ('commerce.coupons.read', 'View canonical coupon definitions and redemption evidence.'),
  ('commerce.coupons.manage', 'Create and manage canonical coupon definitions.'),
  ('commerce.entitlements.read', 'View canonical student entitlement records.'),
  ('commerce.entitlements.manage', 'Grant or revoke entitlements through audited workflows.')
ON CONFLICT (key) DO NOTHING;