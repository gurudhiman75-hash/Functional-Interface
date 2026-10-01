BEGIN;

CREATE TABLE IF NOT EXISTS platform.mobile_content_plan_items (
  id uuid PRIMARY KEY,
  slot_key text NOT NULL CHECK (char_length(slot_key) BETWEEN 2 AND 80),
  entity_type text NOT NULL CHECK (entity_type IN ('exam_family','test_series','learning_resource','current_affairs_release')),
  entity_id uuid NOT NULL,
  label_override text NOT NULL DEFAULT '',
  badge_text text NOT NULL DEFAULT '',
  language_code text NOT NULL DEFAULT '',
  sort_order integer NOT NULL DEFAULT 1 CHECK (sort_order BETWEEN 0 AND 999),
  is_active boolean NOT NULL DEFAULT true,
  start_at timestamptz NULL,
  end_at timestamptz NULL,
  created_by uuid NULL REFERENCES identity.users(id) ON DELETE SET NULL,
  updated_by uuid NULL REFERENCES identity.users(id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CHECK (end_at IS NULL OR start_at IS NULL OR end_at >= start_at)
);

CREATE INDEX IF NOT EXISTS mobile_content_plan_slot_idx
  ON platform.mobile_content_plan_items (slot_key, is_active, sort_order, start_at, end_at);

COMMIT;
