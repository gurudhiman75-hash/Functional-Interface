CREATE TABLE IF NOT EXISTS content.note_sections (
  id UUID PRIMARY KEY,
  job_id UUID NOT NULL REFERENCES content.note_authoring_jobs(id) ON DELETE CASCADE,
  coverage_item_id UUID NOT NULL,
  title TEXT NOT NULL,
  sort_order INTEGER NOT NULL DEFAULT 0 CHECK (sort_order >= 0),
  state TEXT NOT NULL DEFAULT 'draft' CHECK (state IN ('draft', 'needs_editorial', 'accepted')),
  markdown TEXT NOT NULL DEFAULT '',
  input_fingerprint TEXT NOT NULL,
  output_fingerprint TEXT NOT NULL,
  prompt_version TEXT NOT NULL,
  provider TEXT NOT NULL,
  model TEXT NOT NULL,
  generation_metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_by UUID REFERENCES identity.users(id) ON DELETE SET NULL,
  updated_by UUID REFERENCES identity.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT note_section_coverage_fk FOREIGN KEY (job_id, coverage_item_id)
    REFERENCES content.note_coverage_plan_items(job_id, id) ON DELETE CASCADE,
  CONSTRAINT note_section_title_length CHECK (char_length(title) BETWEEN 2 AND 300),
  CONSTRAINT note_section_markdown_length CHECK (char_length(markdown) <= 30000),
  CONSTRAINT note_section_input_hash CHECK (input_fingerprint ~ '^[0-9a-f]{64}$'),
  CONSTRAINT note_section_output_hash CHECK (output_fingerprint ~ '^[0-9a-f]{64}$'),
  UNIQUE (job_id, coverage_item_id),
  UNIQUE (job_id, id)
);

CREATE TABLE IF NOT EXISTS content.note_section_claims (
  job_id UUID NOT NULL REFERENCES content.note_authoring_jobs(id) ON DELETE CASCADE,
  section_id UUID NOT NULL,
  claim_id UUID NOT NULL,
  position INTEGER NOT NULL DEFAULT 0 CHECK (position >= 0),
  role TEXT NOT NULL DEFAULT 'core' CHECK (role IN ('core', 'supporting')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  PRIMARY KEY (section_id, claim_id),
  CONSTRAINT note_section_claim_section_fk FOREIGN KEY (job_id, section_id)
    REFERENCES content.note_sections(job_id, id) ON DELETE CASCADE,
  CONSTRAINT note_section_claim_claim_fk FOREIGN KEY (job_id, claim_id)
    REFERENCES content.note_source_claims(job_id, id) ON DELETE RESTRICT
);

CREATE TABLE IF NOT EXISTS content.note_section_blocks (
  id UUID PRIMARY KEY,
  job_id UUID NOT NULL REFERENCES content.note_authoring_jobs(id) ON DELETE CASCADE,
  section_id UUID NOT NULL,
  block_index INTEGER NOT NULL CHECK (block_index >= 0),
  kind TEXT NOT NULL CHECK (kind IN ('paragraph', 'bullet_list', 'table', 'exam_tip', 'memory_aid')),
  markdown TEXT NOT NULL,
  claim_ids JSONB NOT NULL DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT note_section_block_section_fk FOREIGN KEY (job_id, section_id)
    REFERENCES content.note_sections(job_id, id) ON DELETE CASCADE,
  CONSTRAINT note_section_block_markdown_length CHECK (char_length(markdown) BETWEEN 1 AND 10000),
  UNIQUE (section_id, block_index)
);

CREATE TABLE IF NOT EXISTS content.note_generation_events (
  id UUID PRIMARY KEY,
  job_id UUID NOT NULL REFERENCES content.note_authoring_jobs(id) ON DELETE CASCADE,
  section_id UUID,
  coverage_item_id UUID NOT NULL,
  provider TEXT NOT NULL,
  model TEXT NOT NULL,
  prompt_version TEXT NOT NULL,
  input_fingerprint TEXT NOT NULL,
  output_fingerprint TEXT,
  status TEXT NOT NULL CHECK (status IN ('started', 'succeeded', 'failed')),
  error_code TEXT,
  error_message TEXT,
  metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_by UUID REFERENCES identity.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  finished_at TIMESTAMPTZ,
  CONSTRAINT note_generation_input_hash CHECK (input_fingerprint ~ '^[0-9a-f]{64}$'),
  CONSTRAINT note_generation_output_hash CHECK (output_fingerprint IS NULL OR output_fingerprint ~ '^[0-9a-f]{64}$')
);

CREATE INDEX IF NOT EXISTS note_sections_job_state_idx
  ON content.note_sections(job_id, state, sort_order, created_at);
CREATE INDEX IF NOT EXISTS note_section_claims_job_idx
  ON content.note_section_claims(job_id, section_id, position);
CREATE INDEX IF NOT EXISTS note_section_blocks_job_idx
  ON content.note_section_blocks(job_id, section_id, block_index);
CREATE INDEX IF NOT EXISTS note_generation_events_job_idx
  ON content.note_generation_events(job_id, created_at DESC);

CREATE OR REPLACE FUNCTION content.invalidate_notes_sections_on_source_pack_change()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
DECLARE
  affected_job_id UUID;
  current_state TEXT;
  has_extractable_source BOOLEAN;
BEGIN
  affected_job_id := COALESCE(NEW.job_id, OLD.job_id);

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
    RETURN COALESCE(NEW, OLD);
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

  RETURN COALESCE(NEW, OLD);
END;
$$;

DROP TRIGGER IF EXISTS note_source_pack_insert_delete_invalidation ON content.note_authoring_sources;
CREATE TRIGGER note_source_pack_insert_delete_invalidation
AFTER INSERT OR DELETE ON content.note_authoring_sources
FOR EACH ROW EXECUTE FUNCTION content.invalidate_notes_sections_on_source_pack_change();

DROP TRIGGER IF EXISTS note_source_pack_inclusion_invalidation ON content.note_authoring_sources;
CREATE TRIGGER note_source_pack_inclusion_invalidation
AFTER UPDATE OF inclusion_state ON content.note_authoring_sources
FOR EACH ROW
WHEN (OLD.inclusion_state IS DISTINCT FROM NEW.inclusion_state)
EXECUTE FUNCTION content.invalidate_notes_sections_on_source_pack_change();

COMMENT ON TABLE content.note_sections IS
  'Review-only Notes Studio section drafts synthesized from accepted, coverage-linked claims. They are not learner publications.';
COMMENT ON TABLE content.note_section_blocks IS
  'Structured section blocks whose claim_ids must be a subset of the accepted claim inputs used for that section.';
COMMENT ON TABLE content.note_generation_events IS
  'Auditable model-execution ledger storing stable historical identifiers, fingerprints and bounded metadata, not raw source documents or unrestricted prompts.';