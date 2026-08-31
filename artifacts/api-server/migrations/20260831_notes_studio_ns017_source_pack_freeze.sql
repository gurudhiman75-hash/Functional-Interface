CREATE OR REPLACE FUNCTION content.enforce_notes_source_pack_pre_evidence_freeze()
RETURNS trigger
LANGUAGE plpgsql
AS $$
DECLARE
  target_job_id uuid;
  target_state text;
BEGIN
  target_job_id := COALESCE(NEW.job_id, OLD.job_id);

  SELECT state
  INTO target_state
  FROM content.note_authoring_jobs
  WHERE id = target_job_id;

  IF target_state IS NULL THEN
    RAISE EXCEPTION 'Notes Studio authoring job % does not exist', target_job_id
      USING ERRCODE = '23503';
  END IF;

  IF target_state NOT IN ('brief', 'sources_ready') THEN
    RAISE EXCEPTION 'Notes Studio source pack is frozen after evidence work begins; create a successor revision before changing sources'
      USING ERRCODE = '23514';
  END IF;

  RETURN COALESCE(NEW, OLD);
END;
$$;

DROP TRIGGER IF EXISTS note_authoring_sources_pre_evidence_freeze ON content.note_authoring_sources;
CREATE TRIGGER note_authoring_sources_pre_evidence_freeze
BEFORE INSERT OR DELETE OR UPDATE OF source_document_id, inclusion_state, source_role
ON content.note_authoring_sources
FOR EACH ROW
EXECUTE FUNCTION content.enforce_notes_source_pack_pre_evidence_freeze();

COMMENT ON FUNCTION content.enforce_notes_source_pack_pre_evidence_freeze() IS
  'NS-017 fail-closed guard: governed Notes Studio source-pack membership/role/inclusion can change only before evidence work begins; later research must use a successor revision.';
