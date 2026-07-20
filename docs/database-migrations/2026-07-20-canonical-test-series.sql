-- Canonical Test Series schema
-- Applied to Neon project empty-sunset-07552954 on 2026-07-20.
-- Migration ID: b4ea416f-eea3-4033-8503-bd21fe6f5faa
-- Additive migration: no existing assessment rows were rewritten.

CREATE TABLE assessment.test_series (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  exam_version_id uuid NOT NULL REFERENCES catalog.exam_versions(id) ON DELETE RESTRICT,
  code varchar(120) NOT NULL UNIQUE,
  name varchar(255) NOT NULL,
  current_version_number integer NOT NULL DEFAULT 1 CHECK (current_version_number > 0),
  created_by uuid REFERENCES identity.users(id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  deleted_at timestamptz
);

CREATE TABLE assessment.test_series_versions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  series_id uuid NOT NULL REFERENCES assessment.test_series(id) ON DELETE RESTRICT,
  version_number integer NOT NULL CHECK (version_number > 0),
  description text NOT NULL DEFAULT '',
  availability_start_at timestamptz,
  availability_end_at timestamptz,
  progression_mode varchar(32) NOT NULL DEFAULT 'open',
  completion_threshold numeric(5,2),
  configuration jsonb NOT NULL DEFAULT '{}'::jsonb,
  change_reason text NOT NULL,
  created_by uuid REFERENCES identity.users(id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT test_series_versions_series_version_key UNIQUE (series_id, version_number),
  CONSTRAINT test_series_versions_availability_window_check CHECK (
    availability_start_at IS NULL OR availability_end_at IS NULL OR availability_end_at > availability_start_at
  ),
  CONSTRAINT test_series_versions_progression_mode_check CHECK (
    progression_mode IN ('open', 'sequential', 'score_gated')
  ),
  CONSTRAINT test_series_versions_completion_threshold_check CHECK (
    completion_threshold IS NULL OR (completion_threshold >= 0 AND completion_threshold <= 100)
  ),
  CONSTRAINT test_series_versions_score_gate_check CHECK (
    progression_mode <> 'score_gated' OR completion_threshold IS NOT NULL
  )
);

CREATE TABLE assessment.test_series_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  series_version_id uuid NOT NULL REFERENCES assessment.test_series_versions(id) ON DELETE CASCADE,
  test_id uuid NOT NULL REFERENCES assessment.tests(id) ON DELETE RESTRICT,
  sort_order integer NOT NULL CHECK (sort_order > 0),
  title_override varchar(255),
  unlock_at timestamptz,
  minimum_score numeric(5,2),
  is_required boolean NOT NULL DEFAULT true,
  configuration jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT test_series_items_version_order_key UNIQUE (series_version_id, sort_order),
  CONSTRAINT test_series_items_version_test_key UNIQUE (series_version_id, test_id),
  CONSTRAINT test_series_items_minimum_score_check CHECK (
    minimum_score IS NULL OR (minimum_score >= 0 AND minimum_score <= 100)
  )
);

CREATE INDEX test_series_active_exam_idx
  ON assessment.test_series (exam_version_id, updated_at DESC)
  WHERE deleted_at IS NULL;

CREATE INDEX test_series_versions_series_idx
  ON assessment.test_series_versions (series_id, version_number DESC);

CREATE INDEX test_series_items_version_order_idx
  ON assessment.test_series_items (series_version_id, sort_order);
