CREATE TABLE IF NOT EXISTS content.note_research_restarts (
  id UUID PRIMARY KEY,
  job_id UUID NOT NULL REFERENCES content.note_authoring_jobs(id) ON DELETE RESTRICT,
  restart_number INTEGER NOT NULL CHECK (restart_number >= 1),
  from_state TEXT NOT NULL CHECK (from_state IN ('evidence_ready', 'outline_ready', 'drafting', 'qa_required', 'review_ready')),
  to_state TEXT NOT NULL CHECK (to_state IN ('brief', 'sources_ready')),
  reason TEXT NOT NULL,
  coverage_item_id UUID,
  recommended_source_document_id UUID REFERENCES content.source_documents(id) ON DELETE SET NULL,
  discard_snapshot JSONB NOT NULL DEFAULT '{}'::jsonb,
  intent_snapshot JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_by UUID REFERENCES identity.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT note_research_restart_reason_length CHECK (char_length(btrim(reason)) BETWEEN 4 AND 1000),
  UNIQUE (job_id, restart_number)
);

CREATE INDEX IF NOT EXISTS note_research_restarts_job_idx
  ON content.note_research_restarts(job_id, restart_number DESC, created_at DESC);

CREATE OR REPLACE FUNCTION content.prevent_note_research_restart_mutation()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  RAISE EXCEPTION 'Notes Studio research-restart records are immutable';
END;
$$;

DROP TRIGGER IF EXISTS note_research_restarts_immutable ON content.note_research_restarts;
CREATE TRIGGER note_research_restarts_immutable
BEFORE UPDATE OR DELETE ON content.note_research_restarts
FOR EACH ROW EXECUTE FUNCTION content.prevent_note_research_restart_mutation();

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
    RAISE EXCEPTION 'Notes Studio source pack is frozen after evidence work begins; run an explicit research restart for an unapproved job or create a successor revision after approval'
      USING ERRCODE = '23514';
  END IF;

  RETURN COALESCE(NEW, OLD);
END;
$$;

COMMENT ON TABLE content.note_research_restarts IS
  'Immutable audit ledger for explicit pre-approval Notes Studio research restarts. A restart discards derived evidence/review artifacts, preserves editorial coverage targets and returns the same job to source collection.';
