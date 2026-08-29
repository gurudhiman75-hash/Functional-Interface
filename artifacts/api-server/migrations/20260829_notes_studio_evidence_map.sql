CREATE TABLE IF NOT EXISTS content.note_evidence_runs (
  id UUID PRIMARY KEY,
  job_id UUID NOT NULL REFERENCES content.note_authoring_jobs(id) ON DELETE CASCADE,
  input_hash TEXT NOT NULL,
  extractor_version TEXT NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('running', 'completed', 'failed')),
  source_count INTEGER NOT NULL DEFAULT 0 CHECK (source_count >= 0),
  claim_count INTEGER NOT NULL DEFAULT 0 CHECK (claim_count >= 0),
  support_count INTEGER NOT NULL DEFAULT 0 CHECK (support_count >= 0),
  coverage_target_count INTEGER NOT NULL DEFAULT 0 CHECK (coverage_target_count >= 0),
  coverage_mapped_count INTEGER NOT NULL DEFAULT 0 CHECK (coverage_mapped_count >= 0),
  failure_reason TEXT,
  created_by UUID REFERENCES identity.users(id) ON DELETE SET NULL,
  started_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  finished_at TIMESTAMPTZ,
  CONSTRAINT note_evidence_run_hash_format CHECK (input_hash ~ '^[0-9a-f]{64}$'),
  CONSTRAINT note_evidence_run_unique_input UNIQUE (job_id, input_hash)
);

CREATE TABLE IF NOT EXISTS content.note_evidence_claims (
  id UUID PRIMARY KEY,
  run_id UUID NOT NULL REFERENCES content.note_evidence_runs(id) ON DELETE CASCADE,
  job_id UUID NOT NULL REFERENCES content.note_authoring_jobs(id) ON DELETE CASCADE,
  normalized_key TEXT NOT NULL,
  claim_text TEXT NOT NULL,
  claim_type TEXT NOT NULL CHECK (claim_type IN ('definition', 'provision', 'statistic', 'date_fact', 'fact')),
  evidence_state TEXT NOT NULL DEFAULT 'candidate' CHECK (evidence_state IN ('candidate', 'accepted', 'rejected')),
  extraction_method TEXT NOT NULL,
  confidence NUMERIC(5,4) NOT NULL DEFAULT 0 CHECK (confidence >= 0 AND confidence <= 1),
  created_by UUID REFERENCES identity.users(id) ON DELETE SET NULL,
  reviewed_by UUID REFERENCES identity.users(id) ON DELETE SET NULL,
  reviewed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT note_evidence_claim_key_format CHECK (normalized_key ~ '^[0-9a-f]{64}$'),
  CONSTRAINT note_evidence_claim_unique_per_run UNIQUE (run_id, normalized_key)
);

CREATE TABLE IF NOT EXISTS content.note_evidence_support (
  id UUID PRIMARY KEY,
  claim_id UUID NOT NULL REFERENCES content.note_evidence_claims(id) ON DELETE CASCADE,
  source_document_id UUID NOT NULL REFERENCES content.source_documents(id) ON DELETE RESTRICT,
  relation TEXT NOT NULL DEFAULT 'support' CHECK (relation IN ('support', 'contradict')),
  evidence_excerpt TEXT NOT NULL,
  excerpt_hash TEXT NOT NULL,
  source_location JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT note_evidence_excerpt_length CHECK (char_length(evidence_excerpt) BETWEEN 1 AND 600),
  CONSTRAINT note_evidence_excerpt_hash_format CHECK (excerpt_hash ~ '^[0-9a-f]{64}$'),
  CONSTRAINT note_evidence_support_unique UNIQUE (claim_id, source_document_id, excerpt_hash)
);

CREATE TABLE IF NOT EXISTS content.note_coverage_targets (
  id UUID PRIMARY KEY,
  job_id UUID NOT NULL REFERENCES content.note_authoring_jobs(id) ON DELETE CASCADE,
  target_key TEXT NOT NULL,
  label TEXT NOT NULL,
  source_kind TEXT NOT NULL CHECK (source_kind IN ('topic', 'syllabus_emphasis', 'manual')),
  required BOOLEAN NOT NULL DEFAULT true,
  position INTEGER NOT NULL DEFAULT 0,
  created_by UUID REFERENCES identity.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT note_coverage_target_key_format CHECK (target_key ~ '^[0-9a-f]{64}$'),
  CONSTRAINT note_coverage_target_unique UNIQUE (job_id, target_key)
);

CREATE TABLE IF NOT EXISTS content.note_claim_coverage (
  run_id UUID NOT NULL REFERENCES content.note_evidence_runs(id) ON DELETE CASCADE,
  target_id UUID NOT NULL REFERENCES content.note_coverage_targets(id) ON DELETE CASCADE,
  claim_id UUID NOT NULL REFERENCES content.note_evidence_claims(id) ON DELETE CASCADE,
  score NUMERIC(5,4) NOT NULL CHECK (score >= 0 AND score <= 1),
  mapping_method TEXT NOT NULL CHECK (mapping_method IN ('token_overlap_v1', 'manual')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  PRIMARY KEY (run_id, target_id, claim_id)
);

CREATE INDEX IF NOT EXISTS note_evidence_runs_job_idx
  ON content.note_evidence_runs(job_id, finished_at DESC, started_at DESC);
CREATE INDEX IF NOT EXISTS note_evidence_claims_run_state_idx
  ON content.note_evidence_claims(run_id, evidence_state, claim_type);
CREATE INDEX IF NOT EXISTS note_evidence_support_claim_idx
  ON content.note_evidence_support(claim_id, relation, source_document_id);
CREATE INDEX IF NOT EXISTS note_coverage_targets_job_idx
  ON content.note_coverage_targets(job_id, required DESC, position, created_at);
CREATE INDEX IF NOT EXISTS note_claim_coverage_target_idx
  ON content.note_claim_coverage(target_id, run_id, score DESC);

COMMENT ON TABLE content.note_evidence_runs IS
  'Immutable Notes Studio evidence extraction snapshots keyed by the included retained source-pack and authoring brief.';
COMMENT ON TABLE content.note_evidence_claims IS
  'Candidate source-grounded assertions. Automatic extraction never makes these learner-facing facts; reviewers may accept or reject them.';
COMMENT ON TABLE content.note_evidence_support IS
  'Exact source provenance for evidence claims. Excerpts are bounded and originate only from rights-retainable extracted source text.';
COMMENT ON TABLE content.note_coverage_targets IS
  'Topic/syllabus/manual coverage requirements for one Notes Studio authoring job.';
COMMENT ON TABLE content.note_claim_coverage IS
  'Evidence-to-coverage mappings for a specific immutable evidence run.';
