CREATE TABLE IF NOT EXISTS platform.web_exam_pages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  exam_slug text NOT NULL UNIQUE,
  title text NOT NULL DEFAULT '',
  is_active boolean NOT NULL DEFAULT true,
  configuration jsonb NOT NULL DEFAULT '{"sections":[]}'::jsonb,
  created_by text,
  updated_by text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS web_exam_pages_active_updated_idx
  ON platform.web_exam_pages (is_active, updated_at DESC);
