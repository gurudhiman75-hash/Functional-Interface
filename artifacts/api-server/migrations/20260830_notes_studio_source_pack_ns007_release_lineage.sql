ALTER TABLE content.note_authoring_jobs
  ADD COLUMN IF NOT EXISTS revision_number INTEGER NOT NULL DEFAULT 1,
  ADD COLUMN IF NOT EXISTS predecessor_approved_version_id UUID REFERENCES content.note_approved_versions(id) ON DELETE RESTRICT,
  ADD COLUMN IF NOT EXISTS lineage_root_approved_version_id UUID REFERENCES content.note_approved_versions(id) ON DELETE RESTRICT,
  ADD COLUMN IF NOT EXISTS revision_reason TEXT;

CREATE UNIQUE INDEX IF NOT EXISTS note_authoring_jobs_predecessor_unique_idx
  ON content.note_authoring_jobs(predecessor_approved_version_id)
  WHERE predecessor_approved_version_id IS NOT NULL;

CREATE INDEX IF NOT EXISTS note_authoring_jobs_lineage_root_idx
  ON content.note_authoring_jobs(lineage_root_approved_version_id, revision_number, created_at);

CREATE OR REPLACE FUNCTION content.guard_note_authoring_lineage()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  IF NEW.revision_number < 1 THEN
    RAISE EXCEPTION 'Notes Studio revision number must be at least 1';
  END IF;

  IF NEW.revision_number = 1 AND (
    NEW.predecessor_approved_version_id IS NOT NULL
    OR NEW.lineage_root_approved_version_id IS NOT NULL
  ) THEN
    RAISE EXCEPTION 'Initial Notes Studio jobs cannot declare predecessor lineage';
  END IF;

  IF NEW.revision_number > 1 AND (
    NEW.predecessor_approved_version_id IS NULL
    OR NEW.lineage_root_approved_version_id IS NULL
    OR char_length(btrim(COALESCE(NEW.revision_reason, ''))) < 4
  ) THEN
    RAISE EXCEPTION 'Successor Notes Studio jobs require immutable predecessor/root lineage and a revision reason';
  END IF;

  IF TG_OP = 'UPDATE' AND (
    OLD.revision_number IS DISTINCT FROM NEW.revision_number
    OR OLD.predecessor_approved_version_id IS DISTINCT FROM NEW.predecessor_approved_version_id
    OR OLD.lineage_root_approved_version_id IS DISTINCT FROM NEW.lineage_root_approved_version_id
    OR OLD.revision_reason IS DISTINCT FROM NEW.revision_reason
  ) THEN
    RAISE EXCEPTION 'Notes Studio revision lineage is immutable after job creation';
  END IF;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS note_authoring_jobs_lineage_guard ON content.note_authoring_jobs;
CREATE TRIGGER note_authoring_jobs_lineage_guard
BEFORE INSERT OR UPDATE ON content.note_authoring_jobs
FOR EACH ROW EXECUTE FUNCTION content.guard_note_authoring_lineage();

CREATE OR REPLACE FUNCTION content.apply_note_approved_version_revision_number()
RETURNS trigger
LANGUAGE plpgsql
AS $$
DECLARE
  job_revision INTEGER;
BEGIN
  SELECT revision_number INTO job_revision
  FROM content.note_authoring_jobs
  WHERE id = NEW.job_id;

  IF job_revision IS NULL THEN
    RAISE EXCEPTION 'Notes Studio authoring job is missing for approved version';
  END IF;

  NEW.version_number := job_revision;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS note_approved_versions_revision_number ON content.note_approved_versions;
CREATE TRIGGER note_approved_versions_revision_number
BEFORE INSERT ON content.note_approved_versions
FOR EACH ROW EXECUTE FUNCTION content.apply_note_approved_version_revision_number();

CREATE TABLE IF NOT EXISTS content.note_publish_handoffs (
  id UUID PRIMARY KEY,
  approved_version_id UUID NOT NULL REFERENCES content.note_approved_versions(id) ON DELETE RESTRICT,
  localization_id UUID REFERENCES content.note_localizations(id) ON DELETE RESTRICT,
  resource_id UUID NOT NULL UNIQUE REFERENCES content.learning_resources(id) ON DELETE RESTRICT,
  variant_key TEXT NOT NULL CHECK (variant_key IN ('source', 'hi', 'pa')),
  language_code TEXT NOT NULL,
  frozen_content_hash TEXT NOT NULL,
  resource_snapshot JSONB NOT NULL DEFAULT '{}'::jsonb,
  handed_off_by UUID REFERENCES identity.users(id) ON DELETE SET NULL,
  handed_off_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT note_publish_handoffs_hash CHECK (frozen_content_hash ~ '^[0-9a-f]{64}$'),
  CONSTRAINT note_publish_handoffs_variant_shape CHECK (
    (variant_key = 'source' AND localization_id IS NULL)
    OR (variant_key IN ('hi', 'pa') AND localization_id IS NOT NULL)
  ),
  UNIQUE (approved_version_id, variant_key)
);

CREATE INDEX IF NOT EXISTS note_publish_handoffs_version_idx
  ON content.note_publish_handoffs(approved_version_id, handed_off_at DESC);

CREATE OR REPLACE FUNCTION content.prevent_materialized_note_resource_content_mutation()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM content.note_materializations WHERE resource_id = OLD.id
    UNION ALL
    SELECT 1 FROM content.note_localizations WHERE materialized_resource_id = OLD.id
    LIMIT 1
  ) AND (
    OLD.public_code IS DISTINCT FROM NEW.public_code
    OR OLD.category IS DISTINCT FROM NEW.category
    OR OLD.format IS DISTINCT FROM NEW.format
    OR OLD.title IS DISTINCT FROM NEW.title
    OR OLD.summary IS DISTINCT FROM NEW.summary
    OR OLD.language_code IS DISTINCT FROM NEW.language_code
    OR OLD.content_date IS DISTINCT FROM NEW.content_date
    OR OLD.body_markdown IS DISTINCT FROM NEW.body_markdown
    OR OLD.content_url IS DISTINCT FROM NEW.content_url
    OR OLD.expires_at IS DISTINCT FROM NEW.expires_at
  ) THEN
    RAISE EXCEPTION 'Notes Studio materialized learner copy is frozen; create a successor authoring revision instead';
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS learning_resources_notes_studio_content_freeze ON content.learning_resources;
CREATE TRIGGER learning_resources_notes_studio_content_freeze
BEFORE UPDATE ON content.learning_resources
FOR EACH ROW EXECUTE FUNCTION content.prevent_materialized_note_resource_content_mutation();

CREATE OR REPLACE FUNCTION content.prevent_materialized_note_exam_target_mutation()
RETURNS trigger
LANGUAGE plpgsql
AS $$
DECLARE
  target_resource_id UUID;
BEGIN
  target_resource_id := CASE WHEN TG_OP = 'DELETE' THEN OLD.resource_id ELSE NEW.resource_id END;
  IF EXISTS (
    SELECT 1 FROM content.note_materializations WHERE resource_id = target_resource_id
    UNION ALL
    SELECT 1 FROM content.note_localizations WHERE materialized_resource_id = target_resource_id
    LIMIT 1
  ) THEN
    RAISE EXCEPTION 'Notes Studio materialized exam targets are frozen; create a successor authoring revision instead';
  END IF;
  RETURN CASE WHEN TG_OP = 'DELETE' THEN OLD ELSE NEW END;
END;
$$;

DROP TRIGGER IF EXISTS learning_resource_exams_notes_studio_freeze ON content.learning_resource_exams;
CREATE TRIGGER learning_resource_exams_notes_studio_freeze
BEFORE INSERT OR UPDATE OR DELETE ON content.learning_resource_exams
FOR EACH ROW EXECUTE FUNCTION content.prevent_materialized_note_exam_target_mutation();

COMMENT ON COLUMN content.note_authoring_jobs.predecessor_approved_version_id IS
  'Immutable direct predecessor approved version for a successor/replacement Notes Studio job.';
COMMENT ON COLUMN content.note_authoring_jobs.lineage_root_approved_version_id IS
  'Immutable first approved version in the Notes Studio replacement lineage.';
COMMENT ON TABLE content.note_publish_handoffs IS
  'Auditable readiness handoff from an exact frozen Notes Studio learner variant to the existing Learning Resources publish workflow; handoff never publishes.';
