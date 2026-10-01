BEGIN;

CREATE TABLE IF NOT EXISTS platform.mobile_promotions (
  id uuid PRIMARY KEY,
  title text NOT NULL CHECK (char_length(title) BETWEEN 2 AND 140),
  subtitle text NOT NULL DEFAULT '',
  image_url text NOT NULL DEFAULT '',
  placement text NOT NULL CHECK (placement IN ('home','learn','tests','results')),
  destination_type text NOT NULL DEFAULT 'none' CHECK (destination_type IN ('exam','test_series','learn','url','none')),
  destination_value text NOT NULL DEFAULT '',
  campaign_kind text NOT NULL DEFAULT 'internal' CHECK (campaign_kind IN ('internal','external')),
  is_dismissible boolean NOT NULL DEFAULT true,
  frequency_cap_per_day integer NULL CHECK (frequency_cap_per_day IS NULL OR frequency_cap_per_day BETWEEN 1 AND 50),
  audience jsonb NOT NULL DEFAULT '{}'::jsonb,
  is_active boolean NOT NULL DEFAULT true,
  start_at timestamptz NULL,
  end_at timestamptz NULL,
  sort_order integer NOT NULL DEFAULT 1 CHECK (sort_order BETWEEN 0 AND 999),
  created_by uuid NULL REFERENCES identity.users(id) ON DELETE SET NULL,
  updated_by uuid NULL REFERENCES identity.users(id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CHECK (end_at IS NULL OR start_at IS NULL OR end_at >= start_at)
);

CREATE INDEX IF NOT EXISTS mobile_promotions_active_placement_idx
  ON platform.mobile_promotions (placement, is_active, sort_order, start_at, end_at);

COMMIT;
