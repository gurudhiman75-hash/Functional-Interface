BEGIN;

ALTER TABLE platform.mobile_promotions
  ADD COLUMN IF NOT EXISTS repeat_on_every_open boolean NOT NULL DEFAULT false;

UPDATE platform.mobile_promotions
SET repeat_on_every_open = true,
    frequency_cap_per_day = NULL,
    updated_at = now()
WHERE id = '7f9e7e53-7b75-4dd8-8d79-6e32d8c90d01'::uuid;

COMMIT;
