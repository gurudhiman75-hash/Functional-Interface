BEGIN;

CREATE TABLE IF NOT EXISTS platform.mobile_push_devices (
  id uuid PRIMARY KEY,
  user_id uuid NOT NULL REFERENCES identity.users(id) ON DELETE CASCADE,
  firebase_uid text NOT NULL,
  token text NOT NULL UNIQUE,
  platform text NOT NULL CHECK (platform IN ('android','ios','web')),
  app_version text NOT NULL DEFAULT '',
  locale text NOT NULL DEFAULT '',
  is_active boolean NOT NULL DEFAULT true,
  last_seen_at timestamptz NOT NULL DEFAULT now(),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS mobile_push_devices_user_active_idx
  ON platform.mobile_push_devices (user_id, is_active, updated_at DESC);

CREATE TABLE IF NOT EXISTS platform.mobile_notification_campaigns (
  id uuid PRIMARY KEY,
  title text NOT NULL CHECK (char_length(title) BETWEEN 2 AND 120),
  body text NOT NULL CHECK (char_length(body) BETWEEN 2 AND 500),
  image_url text NOT NULL DEFAULT '',
  destination_type text NOT NULL DEFAULT 'none'
    CHECK (destination_type IN ('exam','test_series','learn','url','none')),
  destination_value text NOT NULL DEFAULT '',
  audience jsonb NOT NULL DEFAULT '{}'::jsonb,
  status text NOT NULL DEFAULT 'draft'
    CHECK (status IN ('draft','scheduled','sending','sent','cancelled','failed')),
  scheduled_at timestamptz NULL,
  sent_at timestamptz NULL,
  created_by uuid NULL REFERENCES identity.users(id) ON DELETE SET NULL,
  updated_by uuid NULL REFERENCES identity.users(id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS mobile_notification_campaigns_schedule_idx
  ON platform.mobile_notification_campaigns (status, scheduled_at);

CREATE TABLE IF NOT EXISTS platform.mobile_notification_deliveries (
  id uuid PRIMARY KEY,
  campaign_id uuid NOT NULL REFERENCES platform.mobile_notification_campaigns(id) ON DELETE CASCADE,
  user_id uuid NULL REFERENCES identity.users(id) ON DELETE SET NULL,
  device_id uuid NULL REFERENCES platform.mobile_push_devices(id) ON DELETE SET NULL,
  provider text NOT NULL DEFAULT 'fcm',
  provider_message_id text NULL,
  status text NOT NULL CHECK (status IN ('queued','sent','failed','opened')),
  error_code text NULL,
  error_message text NULL,
  sent_at timestamptz NULL,
  opened_at timestamptz NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS mobile_notification_deliveries_campaign_idx
  ON platform.mobile_notification_deliveries (campaign_id, status);

COMMIT;
