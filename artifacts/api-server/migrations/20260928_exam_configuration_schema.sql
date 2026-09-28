-- Align the canonical exam-family schema with the Exam Configuration API.
-- Additive and idempotent; existing rows are preserved.

ALTER TABLE catalog.exam_families
  ADD COLUMN IF NOT EXISTS description TEXT;
