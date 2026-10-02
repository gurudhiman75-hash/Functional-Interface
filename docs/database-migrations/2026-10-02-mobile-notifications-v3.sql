BEGIN;

ALTER TABLE platform.mobile_notification_deliveries
  ADD COLUMN IF NOT EXISTS read_at timestamptz NULL;

UPDATE platform.mobile_notification_deliveries
SET read_at=opened_at
WHERE read_at IS NULL
  AND opened_at IS NOT NULL;

CREATE INDEX IF NOT EXISTS mobile_notification_deliveries_user_unread_idx
  ON platform.mobile_notification_deliveries (user_id,created_at DESC)
  WHERE is_test=false
    AND read_at IS NULL
    AND status IN ('sent','opened');

COMMIT;
