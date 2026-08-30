ALTER TABLE content.note_authoring_sources
  ADD COLUMN IF NOT EXISTS source_role TEXT NOT NULL DEFAULT 'core_reference';

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_constraint
    WHERE conname = 'note_authoring_sources_source_role_check'
      AND conrelid = 'content.note_authoring_sources'::regclass
  ) THEN
    ALTER TABLE content.note_authoring_sources
      ADD CONSTRAINT note_authoring_sources_source_role_check
      CHECK (source_role IN ('primary_authority', 'core_reference', 'exam_context', 'supplemental'));
  END IF;
END $$;

UPDATE content.note_authoring_jobs
SET brief = jsonb_set(
      COALESCE(brief, '{}'::jsonb),
      '{sourcePackTemplate}',
      to_jsonb(CASE
        WHEN state IN ('brief', 'sources_ready') THEN 'balanced'::text
        ELSE 'quick_revision'::text
      END),
      true
    ),
    updated_at = now()
WHERE NOT COALESCE(brief, '{}'::jsonb) ? 'sourcePackTemplate';

CREATE INDEX IF NOT EXISTS note_authoring_sources_role_idx
  ON content.note_authoring_sources(job_id, inclusion_state, source_role, position);

DROP TRIGGER IF EXISTS note_source_pack_inclusion_invalidation ON content.note_authoring_sources;
CREATE TRIGGER note_source_pack_inclusion_invalidation
AFTER UPDATE OF inclusion_state, source_role ON content.note_authoring_sources
FOR EACH ROW
WHEN (
  OLD.inclusion_state IS DISTINCT FROM NEW.inclusion_state
  OR OLD.source_role IS DISTINCT FROM NEW.source_role
)
EXECUTE FUNCTION content.invalidate_notes_sections_on_source_pack_change();

COMMENT ON COLUMN content.note_authoring_sources.source_role IS
  'Job-specific research role used by Notes Studio source-pack policy gates. Rights and retention remain properties of content.source_documents.';
