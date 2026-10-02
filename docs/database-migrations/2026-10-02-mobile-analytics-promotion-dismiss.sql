BEGIN;

ALTER TABLE platform.mobile_analytics_events
  DROP CONSTRAINT IF EXISTS mobile_analytics_events_event_name_check;

ALTER TABLE platform.mobile_analytics_events
  ADD CONSTRAINT mobile_analytics_events_event_name_check
  CHECK (event_name IN (
    'app_open','home_view','hero_impression','hero_click',
    'promotion_impression','promotion_click','promotion_dismiss',
    'content_plan_impression','content_plan_click',
    'notification_open','feature_used'
  ));

COMMIT;
