BEGIN;

CREATE TABLE IF NOT EXISTS platform.mobile_analytics_events (
  id uuid PRIMARY KEY,
  user_id uuid NULL REFERENCES identity.users(id) ON DELETE SET NULL,
  session_id text NOT NULL DEFAULT '',
  event_name text NOT NULL CHECK (event_name IN (
    'app_open','home_view','hero_impression','hero_click',
    'promotion_impression','promotion_click',
    'content_plan_impression','content_plan_click',
    'notification_open','feature_used'
  )),
  entity_type text NOT NULL DEFAULT '',
  entity_id text NOT NULL DEFAULT '',
  placement text NOT NULL DEFAULT '',
  app_version text NOT NULL DEFAULT '',
  platform text NOT NULL DEFAULT 'android' CHECK (platform IN ('android','ios','web')),
  locale text NOT NULL DEFAULT '',
  metadata jsonb NOT NULL DEFAULT '{}'::jsonb,
  occurred_at timestamptz NOT NULL DEFAULT now(),
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS mobile_analytics_events_time_idx
  ON platform.mobile_analytics_events (occurred_at DESC);

CREATE INDEX IF NOT EXISTS mobile_analytics_events_name_time_idx
  ON platform.mobile_analytics_events (event_name, occurred_at DESC);

CREATE INDEX IF NOT EXISTS mobile_analytics_events_entity_idx
  ON platform.mobile_analytics_events (entity_type, entity_id, occurred_at DESC);

COMMIT;
