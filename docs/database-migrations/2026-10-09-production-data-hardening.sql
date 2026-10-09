-- Production hardening for shared analytics + attempt lifecycle.
-- Additive and backward-compatible. Existing data is preserved.

ALTER TABLE learning.attempts
  ADD COLUMN IF NOT EXISTS last_activity_at timestamptz,
  ADD COLUMN IF NOT EXISTS abandoned_at timestamptz,
  ADD COLUMN IF NOT EXISTS abandonment_reason varchar(80);

UPDATE learning.attempts
SET last_activity_at = COALESCE(updated_at, started_at)
WHERE last_activity_at IS NULL;

ALTER TABLE learning.attempts
  ALTER COLUMN last_activity_at SET DEFAULT now();

CREATE INDEX IF NOT EXISTS attempts_in_progress_activity_idx
  ON learning.attempts (last_activity_at)
  WHERE status = 'in_progress';

-- The existing analytics table already supports web in its platform constraint.
-- Extend the event vocabulary instead of creating a duplicate web table.
ALTER TABLE platform.mobile_analytics_events
  DROP CONSTRAINT IF EXISTS mobile_analytics_events_event_name_check;

ALTER TABLE platform.mobile_analytics_events
  ADD CONSTRAINT mobile_analytics_events_event_name_check
  CHECK (event_name = ANY (ARRAY[
    'app_open','home_view','hero_impression','hero_click',
    'promotion_impression','promotion_click','promotion_dismiss',
    'content_plan_impression','content_plan_click','notification_open','feature_used',
    'page_view','exam_view','test_view','test_start','checkout_start',
    'purchase_complete','login_complete','signup_complete'
  ]::text[]));
