BEGIN;

ALTER TABLE platform.mobile_notification_campaigns
  DROP CONSTRAINT IF EXISTS mobile_notification_campaigns_destination_type_check;

ALTER TABLE platform.mobile_notification_campaigns
  ADD CONSTRAINT mobile_notification_campaigns_destination_type_check
  CHECK (destination_type IN ('exam','test_series','learn','page','url','none'));

ALTER TABLE platform.mobile_notification_deliveries
  ADD COLUMN IF NOT EXISTS is_test boolean NOT NULL DEFAULT false;

CREATE INDEX IF NOT EXISTS mobile_notification_deliveries_campaign_real_idx
  ON platform.mobile_notification_deliveries (campaign_id,status)
  WHERE is_test=false;

COMMIT;
