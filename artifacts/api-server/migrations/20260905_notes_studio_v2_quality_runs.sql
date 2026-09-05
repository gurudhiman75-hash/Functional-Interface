CREATE TABLE IF NOT EXISTS notes_studio_v2.quality_runs (
  id uuid PRIMARY KEY,
  note_version_id uuid NOT NULL REFERENCES notes_studio_v2.note_versions(id) ON DELETE CASCADE,
  review_ready boolean NOT NULL,
  gates jsonb NOT NULL,
  checker_version text NOT NULL,
  model_metadata jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_by text,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS notes_studio_v2_quality_runs_version_created_idx
  ON notes_studio_v2.quality_runs(note_version_id, created_at DESC);

COMMENT ON TABLE notes_studio_v2.quality_runs IS
  'Immutable quality-review evidence for Notes Studio v2 note versions. Checks may inspect verification evidence, but never mutate generated content.';

CREATE OR REPLACE FUNCTION notes_studio_v2.require_latest_review_ready_quality()
RETURNS trigger
LANGUAGE plpgsql
AS $$
DECLARE
  latest_ready boolean;
BEGIN
  IF NEW.status IS DISTINCT FROM OLD.status
     AND NEW.status IN ('in-review'::notes_studio_v2.note_status, 'published'::notes_studio_v2.note_status) THEN
    SELECT run.review_ready
      INTO latest_ready
      FROM notes_studio_v2.quality_runs run
     WHERE run.note_version_id = NEW.id
     ORDER BY run.created_at DESC, run.id DESC
     LIMIT 1;

    IF latest_ready IS DISTINCT FROM true THEN
      RAISE EXCEPTION 'Notes Studio v2 requires a latest persisted review-ready quality run before review or publication.'
        USING ERRCODE = 'check_violation';
    END IF;
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS notes_studio_v2_require_quality_before_review ON notes_studio_v2.note_versions;
CREATE TRIGGER notes_studio_v2_require_quality_before_review
BEFORE UPDATE OF status ON notes_studio_v2.note_versions
FOR EACH ROW
EXECUTE FUNCTION notes_studio_v2.require_latest_review_ready_quality();
