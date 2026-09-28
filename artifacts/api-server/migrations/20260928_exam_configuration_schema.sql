-- Align canonical exam catalogue schema with the production Exam Configuration API.
-- Additive and idempotent: safe on databases where some/all columns already exist.

ALTER TABLE catalog.exam_families
  ADD COLUMN IF NOT EXISTS description TEXT;

ALTER TABLE catalog.exams
  ADD COLUMN IF NOT EXISTS description TEXT,
  ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ NOT NULL DEFAULT now();

ALTER TABLE catalog.exam_versions
  ADD COLUMN IF NOT EXISTS effective_from TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS effective_until TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ NOT NULL DEFAULT now();

CREATE TABLE IF NOT EXISTS catalog.exam_version_languages (
  exam_version_id UUID NOT NULL REFERENCES catalog.exam_versions(id) ON DELETE CASCADE,
  language_id UUID NOT NULL REFERENCES catalog.languages(id) ON DELETE RESTRICT,
  is_primary BOOLEAN NOT NULL DEFAULT false,
  PRIMARY KEY (exam_version_id, language_id)
);

CREATE UNIQUE INDEX IF NOT EXISTS exam_version_languages_one_primary_idx
  ON catalog.exam_version_languages (exam_version_id)
  WHERE is_primary = true;
