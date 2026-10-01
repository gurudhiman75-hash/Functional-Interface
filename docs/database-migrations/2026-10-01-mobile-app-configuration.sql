BEGIN;

CREATE TABLE IF NOT EXISTS platform.mobile_app_configuration (
  singleton_key text PRIMARY KEY DEFAULT 'default' CHECK (singleton_key = 'default'),
  configuration jsonb NOT NULL DEFAULT '{}'::jsonb,
  updated_by uuid NULL REFERENCES identity.users(id) ON DELETE SET NULL,
  updated_at timestamptz NOT NULL DEFAULT now()
);

INSERT INTO platform.mobile_app_configuration (singleton_key, configuration)
VALUES (
  'default',
  jsonb_build_object(
    'minimumSupportedVersion', '',
    'latestVersion', '',
    'forceUpdate', false,
    'maintenanceMode', false,
    'maintenanceMessage', '',
    'playStoreUrl', '',
    'supportUrl', '',
    'defaultLanguage', 'en',
    'featureFlags', '{}'::jsonb
  )
)
ON CONFLICT (singleton_key) DO NOTHING;

COMMIT;
