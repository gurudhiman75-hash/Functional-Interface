CREATE OR REPLACE FUNCTION content.invalidate_notes_sections_on_source_pack_change()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
DECLARE
  affected_job_id UUID;
  current_state TEXT;
  has_extractable_source BOOLEAN;
BEGIN
  IF TG_OP = 'DELETE' THEN
    affected_job_id := OLD.job_id;
  ELSE
    affected_job_id := NEW.job_id;
  END IF;

  SELECT job.state,
         EXISTS (
           SELECT 1
           FROM content.note_authoring_sources link
           JOIN content.source_documents document ON document.id = link.source_document_id
           WHERE link.job_id = affected_job_id
             AND link.inclusion_state = 'included'
             AND document.retention_mode = 'extracted_text'
             AND document.extraction_status = 'processed'
             AND LENGTH(COALESCE(document.extracted_text, '')) >= 100
         )
  INTO current_state, has_extractable_source
  FROM content.note_authoring_jobs job
  WHERE job.id = affected_job_id;

  IF current_state IS NULL OR current_state = 'materialized' THEN
    IF TG_OP = 'DELETE' THEN RETURN OLD; END IF;
    RETURN NEW;
  END IF;

  UPDATE content.note_authoring_jobs
  SET state = CASE
        WHEN NOT has_extractable_source THEN 'brief'
        WHEN current_state IN ('outline_ready', 'drafting', 'qa_required', 'review_ready', 'approved') THEN 'evidence_ready'
        ELSE current_state
      END,
      updated_at = now()
  WHERE id = affected_job_id;

  IF current_state IN ('outline_ready', 'drafting', 'qa_required', 'review_ready', 'approved') THEN
    UPDATE content.note_sections
    SET state = 'needs_editorial',
        generation_metadata = generation_metadata || '{"staleBecauseSourcePackChanged":true}'::jsonb,
        updated_at = now()
    WHERE job_id = affected_job_id AND state <> 'needs_editorial';
  END IF;

  IF TG_OP = 'DELETE' THEN RETURN OLD; END IF;
  RETURN NEW;
END;
$$;
