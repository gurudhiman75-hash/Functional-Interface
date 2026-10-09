-- 2026-10-09: Restore missing canonical commerce permissions for the
-- existing super_admin role. Safe and idempotent; no other role is changed.
--
-- Diagnosis: permissions were seeded by the commerce foundation migration,
-- but eight commerce.* keys were never linked to identity.role_permissions.
-- This made a verified active super_admin receive HTTP 403 on Orders & Payments.
--
-- Intended access: super_admin owns all canonical commerce administration
-- capabilities, while individual non-admin roles remain unchanged.
--
-- Run against the canonical Examtree Neon database only.
INSERT INTO identity.role_permissions (role_id, permission_id)
SELECT r.id, p.id
FROM identity.roles AS r
JOIN identity.permissions AS p
  ON p.key IN (
    'commerce.products.read',
    'commerce.products.manage',
    'commerce.orders.read',
    'commerce.orders.manage',
    'commerce.coupons.read',
    'commerce.coupons.manage',
    'commerce.entitlements.read',
    'commerce.entitlements.manage'
  )
WHERE r.key = 'super_admin'
  AND r.is_active = true
  AND NOT EXISTS (
    SELECT 1 FROM identity.role_permissions rp
    WHERE rp.role_id = r.id AND rp.permission_id = p.id
  )
ON CONFLICT DO NOTHING;
