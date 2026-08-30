CREATE TABLE IF NOT EXISTS content.note_source_evidence_blocks (
  id UUID PRIMARY KEY,
  job_id UUID NOT NULL,
  source_document_id UUID NOT NULL,
  block_index INTEGER NOT NULL CHECK (block_index >= 0),
  excerpt TEXT NOT NULL,
  excerpt_hash TEXT NOT NULL,
  char_start INTEGER NOT NULL CHECK (char_start >= 0),
  char_end INTEGER NOT NULL CHECK (char_end > char_start),
  locator JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT note_source_evidence_excerpt_length CHECK (char_length(excerpt) BETWEEN 20 AND 1200),
  CONSTRAINT note_source_evidence_hash_format CHECK (excerpt_hash ~ '^[0-9a-f]{64}$'),
  CONSTRAINT note_source_evidence_source_fk FOREIGN KEY (job_id, source_document_id)
    REFERENCES content.note_authoring_sources(job_id, source_document_id) ON DELETE CASCADE,
  UNIQUE (job_id, source_document_id, excerpt_hash),
  UNIQUE (job_id, id)
);

CREATE TABLE IF NOT EXISTS content.note_source_claims (
  id UUID PRIMARY KEY,
  job_id UUID NOT NULL REFERENCES content.note_authoring_jobs(id) ON DELETE CASCADE,
  claim_text TEXT NOT NULL,
  claim_hash TEXT NOT NULL,
  state TEXT NOT NULL DEFAULT 'candidate' CHECK (state IN ('candidate', 'accepted', 'rejected', 'conflict')),
  confidence NUMERIC(4,3) CHECK (confidence IS NULL OR (confidence >= 0 AND confidence <= 1)),
  contradiction_key TEXT,
  editorial_note TEXT NOT NULL DEFAULT '',
  created_by UUID REFERENCES identity.users(id) ON DELETE SET NULL,
  updated_by UUID REFERENCES identity.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT note_source_claim_text_length CHECK (char_length(claim_text) BETWEEN 5 AND 1200),
  CONSTRAINT note_source_claim_hash_format CHECK (claim_hash ~ '^[0-9a-f]{64}$'),
  UNIQUE (job_id, claim_hash),
  UNIQUE (job_id, id)
);

CREATE TABLE IF NOT EXISTS content.note_source_claim_evidence (
  job_id UUID NOT NULL REFERENCES content.note_authoring_jobs(id) ON DELETE CASCADE,
  claim_id UUID NOT NULL,
  evidence_block_id UUID NOT NULL,
  relation TEXT NOT NULL DEFAULT 'supports' CHECK (relation IN ('supports', 'contradicts')),
  created_by UUID REFERENCES identity.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  PRIMARY KEY (claim_id, evidence_block_id),
  CONSTRAINT note_claim_evidence_claim_fk FOREIGN KEY (job_id, claim_id)
    REFERENCES content.note_source_claims(job_id, id) ON DELETE CASCADE,
  CONSTRAINT note_claim_evidence_block_fk FOREIGN KEY (job_id, evidence_block_id)
    REFERENCES content.note_source_evidence_blocks(job_id, id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS content.note_coverage_plan_items (
  id UUID PRIMARY KEY,
  job_id UUID NOT NULL REFERENCES content.note_authoring_jobs(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  syllabus_ref TEXT NOT NULL DEFAULT '',
  priority TEXT NOT NULL DEFAULT 'required' CHECK (priority IN ('required', 'high', 'supporting', 'exclude')),
  planned_depth TEXT NOT NULL DEFAULT 'standard' CHECK (planned_depth IN ('brief', 'standard', 'deep')),
  exam_rationale TEXT NOT NULL DEFAULT '',
  sort_order INTEGER NOT NULL DEFAULT 0 CHECK (sort_order >= 0),
  created_by UUID REFERENCES identity.users(id) ON DELETE SET NULL,
  updated_by UUID REFERENCES identity.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT note_coverage_title_length CHECK (char_length(title) BETWEEN 2 AND 300),
  UNIQUE (job_id, id)
);

CREATE TABLE IF NOT EXISTS content.note_coverage_item_claims (
  job_id UUID NOT NULL REFERENCES content.note_authoring_jobs(id) ON DELETE CASCADE,
  coverage_item_id UUID NOT NULL,
  claim_id UUID NOT NULL,
  created_by UUID REFERENCES identity.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  PRIMARY KEY (coverage_item_id, claim_id),
  CONSTRAINT note_coverage_claim_item_fk FOREIGN KEY (job_id, coverage_item_id)
    REFERENCES content.note_coverage_plan_items(job_id, id) ON DELETE CASCADE,
  CONSTRAINT note_coverage_claim_claim_fk FOREIGN KEY (job_id, claim_id)
    REFERENCES content.note_source_claims(job_id, id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS note_source_evidence_job_idx
  ON content.note_source_evidence_blocks(job_id, source_document_id, block_index);
CREATE INDEX IF NOT EXISTS note_source_claims_job_state_idx
  ON content.note_source_claims(job_id, state, updated_at DESC);
CREATE INDEX IF NOT EXISTS note_claim_evidence_job_idx
  ON content.note_source_claim_evidence(job_id, relation, claim_id);
CREATE INDEX IF NOT EXISTS note_coverage_plan_job_idx
  ON content.note_coverage_plan_items(job_id, priority, sort_order, created_at);
CREATE INDEX IF NOT EXISTS note_coverage_claims_job_idx
  ON content.note_coverage_item_claims(job_id, coverage_item_id, claim_id);

COMMENT ON TABLE content.note_source_evidence_blocks IS
  'Bounded, provenance-bearing evidence units derived only from Notes Studio sources whose rights policy permits extracted-text retention.';
COMMENT ON TABLE content.note_source_claims IS
  'Atomic Notes Studio claims under editorial review. Accepted claims remain linked to one or more source evidence blocks.';
COMMENT ON TABLE content.note_coverage_plan_items IS
  'Syllabus-first coverage plan for a Notes Studio authoring job. Coverage is computed from linked claim state and active source evidence.';