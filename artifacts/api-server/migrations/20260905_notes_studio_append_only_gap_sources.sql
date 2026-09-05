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

  -- Existing source membership, inclusion and role stay frozen once evidence work begins.
  -- Gap research may only append a new included source while research/outline review is
  -- still open. The existing source-pack invalidation trigger safely moves an
  -- outline-ready job back to evidence-ready after such an append.
  IF TG_OP = 'INSERT' AND target_state IN ('brief', 'sources_ready', 'evidence_ready', 'outline_ready') THEN
    RETURN NEW;
  END IF;

  IF target_state IN ('brief', 'sources_ready') THEN
    RETURN COALESCE(NEW, OLD);
  END IF;

  RAISE EXCEPTION 'Notes Studio source pack is append-only after evidence work begins; existing sources cannot be changed and no sources can be added after drafting starts'
    USING ERRCODE = '23514';
END;
$$;

COMMENT ON FUNCTION content.enforce_notes_source_pack_pre_evidence_freeze() IS
  'Guided gap-research guard: existing source membership/role/inclusion freezes after evidence begins, while new sources may be appended only through outline review; all source-pack mutation freezes once drafting starts.';
