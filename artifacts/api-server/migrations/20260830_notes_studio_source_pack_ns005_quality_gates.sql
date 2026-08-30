ALTER TABLE content.note_sections
  DROP CONSTRAINT IF EXISTS note_sections_state_check;

ALTER TABLE content.note_sections
  ADD CONSTRAINT note_sections_state_check
  CHECK (state IN ('draft', 'needs_editorial', 'qa_passed', 'accepted'));

CREATE TABLE IF NOT EXISTS content.note_quality_runs (
  id UUID PRIMARY KEY,
  job_id UUID NOT NULL REFERENCES content.note_authoring_jobs(id) ON DELETE CASCADE,
  section_id UUID NOT NULL,
  section_output_fingerprint TEXT NOT NULL,
  evidence_fingerprint TEXT NOT NULL,
  policy_version TEXT NOT NULL,
  verifier_provider TEXT,
  verifier_model TEXT,
  verifier_prompt_version TEXT,
  verifier_metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
  status TEXT NOT NULL CHECK (status IN ('passed', 'failed')),
  warning_count INTEGER NOT NULL DEFAULT 0 CHECK (warning_count >= 0),
  fail_count INTEGER NOT NULL DEFAULT 0 CHECK (fail_count >= 0),
  created_by UUID REFERENCES identity.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT note_quality_run_section_fk FOREIGN KEY (job_id, section_id)
    REFERENCES content.note_sections(job_id, id) ON DELETE CASCADE,
  CONSTRAINT note_quality_run_output_hash CHECK (section_output_fingerprint ~ '^[0-9a-f]{64}$'),
  CONSTRAINT note_quality_run_evidence_hash CHECK (evidence_fingerprint ~ '^[0-9a-f]{64}$')
);

CREATE TABLE IF NOT EXISTS content.note_quality_checks (
  run_id UUID NOT NULL REFERENCES content.note_quality_runs(id) ON DELETE CASCADE,
  check_code TEXT NOT NULL,
  label TEXT NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('pass', 'warning', 'fail')),
  blocking BOOLEAN NOT NULL DEFAULT true,
  summary TEXT NOT NULL,
  metrics JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  PRIMARY KEY (run_id, check_code),
  CONSTRAINT note_quality_check_code_length CHECK (char_length(check_code) BETWEEN 2 AND 80),
  CONSTRAINT note_quality_check_summary_length CHECK (char_length(summary) BETWEEN 2 AND 2000)
);

CREATE INDEX IF NOT EXISTS note_quality_runs_section_idx
  ON content.note_quality_runs(job_id, section_id, created_at DESC);
CREATE INDEX IF NOT EXISTS note_quality_runs_status_idx
  ON content.note_quality_runs(job_id, status, created_at DESC);
CREATE INDEX IF NOT EXISTS note_quality_checks_status_idx
  ON content.note_quality_checks(status, blocking, created_at DESC);

CREATE OR REPLACE FUNCTION content.invalidate_notes_quality_after_section_change()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  IF OLD.output_fingerprint IS DISTINCT FROM NEW.output_fingerprint
     OR (OLD.state = 'qa_passed' AND NEW.state <> 'qa_passed') THEN
    UPDATE content.note_authoring_jobs
    SET state = 'qa_required', updated_at = now()
    WHERE id = NEW.job_id AND state = 'review_ready';
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS note_sections_invalidate_quality_trg ON content.note_sections;
CREATE TRIGGER note_sections_invalidate_quality_trg
AFTER UPDATE OF output_fingerprint, state ON content.note_sections
FOR EACH ROW
EXECUTE FUNCTION content.invalidate_notes_quality_after_section_change();

COMMENT ON TABLE content.note_quality_runs IS
  'Immutable Notes Studio QA runs tied to the exact section output and evidence fingerprints, including bounded semantic-grounding verifier metadata.';
COMMENT ON TABLE content.note_quality_checks IS
  'Per-gate QA results for evidence support, semantic grounding, contradiction state, source overlap, duplication, readability, formatting and planned depth.';
