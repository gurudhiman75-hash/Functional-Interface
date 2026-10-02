BEGIN;

ALTER TABLE platform.mobile_promotions
  ADD COLUMN IF NOT EXISTS cta_label text NOT NULL DEFAULT 'Explore';

ALTER TABLE platform.mobile_promotions
  DROP CONSTRAINT IF EXISTS mobile_promotions_placement_check;

ALTER TABLE platform.mobile_promotions
  ADD CONSTRAINT mobile_promotions_placement_check
  CHECK (placement IN ('home','login_popup','learn','tests','results'));

ALTER TABLE platform.mobile_promotions
  DROP CONSTRAINT IF EXISTS mobile_promotions_destination_type_check;

ALTER TABLE platform.mobile_promotions
  ADD CONSTRAINT mobile_promotions_destination_type_check
  CHECK (destination_type IN ('exam','test_series','learn','page','url','none'));

COMMIT;
