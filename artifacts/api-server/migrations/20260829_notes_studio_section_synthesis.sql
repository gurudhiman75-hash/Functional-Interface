CREATE TABLE IF NOT EXISTS content.note_outline_versions (
  id UUID PRIMARY KEY,
  job_id UUID NOT NULL REFERENCES content.note_authoring_jobs(id) ON DELETE CASCADE,
  evidence_run_id UUID NOT NULL REFERENCES content.note_evidence_runs(id) ON DELETE RESTRICT,
  version_number INTEGER NOT NULL CHECK (version_number >= 1),
  input_hash TEXT NOT NULL,
  policy_version TEXT NOT NULL,
  state TEXT NOT NULL CHECK (state IN ('active', 'superseded')),
  created_by UUID REFERENCES identity.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT note_outline_input_hash_format CHECK (input_hash ~ '^[0-9a-f]{64}$'),
  CONSTRAINT note_outline_version_unique UNIQUE (job_id, version_number)
);

CREATE TABLE IF NOT EXISTS content.note_sections (
  id UUID PRIMARY KEY,
  job_id UUID NOT NULL REFERENCES content.note_authoring_jobs(id) ON DELETE CASCADE,
  outline_version_id UUID NOT NULL REFERENCES content.note_outline_versions(id) ON DELETE CASCADE,
  section_key TEXT NOT NULL,
  title TEXT NOT NULL,
  objective TEXT NOT NULL,
  position INTEGER NOT NULL CHECK (position >= 0),
  state TEXT NOT NULL DEFAULT 'planned' CHECK (state IN ('planned', 'generated', 'needs_editorial', 'reviewed')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT note_section_unique_key UNIQUE (outline_version_id, section_key)
);

CREATE TABLE IF NOT EXISTS content.note_section_coverage (
  section_id UUID NOT NULL REFERENCES content.note_sections(id) ON DELETE CASCADE,
  target_id UUID NOT NULL REFERENCES content.note_coverage_targets(id) ON DELETE RESTRICT,
  PRIMARY KEY (section_id, target_id)
);

CREATE TABLE IF NOT EXISTS content.note_section_versions (
  id UUID PRIMARY KEY,
  section_id UUID NOT NULL REFERENCES content.note_sections(id) ON DELETE CASCADE,
  version_number INTEGER NOT NULL CHECK (version_number >= 1),
  title TEXT NOT NULL,
  markdown TEXT NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('generated', 'manual', 'needs_editorial')),
  provider TEXT NOT NULL,
  model TEXT NOT NULL,
  prompt_policy_version TEXT NOT NULL,
  input_hash TEXT NOT NULL,
  output_hash TEXT NOT NULL,
  input_claim_ids UUID[] NOT NULL DEFAULT '{}'::uuid[],
  used_claim_ids UUID[] NOT NULL DEFAULT '{}'::uuid[],
  warnings JSONB NOT NULL DEFAULT '[]'::jsonb,
  change_reason TEXT,
  created_by UUID REFERENCES identity.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT note_section_version_unique UNIQUE (section_id, version_number),
  CONSTRAINT note_section_input_hash_format CHECK (input_hash ~ '^[0-9a-f]{64}$'),
  CONSTRAINT note_section_output_hash_format CHECK (output_hash ~ '^[0-9a-f]{64}$')
);

CREATE TABLE IF NOT EXISTS content.note_generation_events (
  id UUID PRIMARY KEY,
  job_id UUID NOT NULL REFERENCES content.note_authoring_jobs(id) ON DELETE CASCADE,
  section_id UUID REFERENCES content.note_sections(id) ON DELETE CASCADE,
  section_version_id UUID REFERENCES content.note_section_versions(id) ON DELETE SET NULL,
  provider TEXT NOT NULL,
  model TEXT NOT NULL,
  prompt_policy_version TEXT NOT NULL,
  input_hash TEXT NOT NULL,
  output_hash TEXT,
  usage JSONB NOT NULL DEFAULT '{}'::jsonb,
  latency_ms INTEGER CHECK (latency_ms IS NULL OR latency_ms >= 0),
  state TEXT NOT NULL CHECK (state IN ('succeeded', 'failed', 'manual')),
  error_message TEXT,
  created_by UUID REFERENCES identity.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT note_generation_input_hash_format CHECK (input_hash ~ '^[0-9a-f]{64}$'),
  CONSTRAINT note_generation_output_hash_format CHECK (output_hash IS NULL OR output_hash ~ '^[0-9a-f]{64}$')
);

CREATE TABLE IF NOT EXISTS content.note_draft_versions (
  id UUID PRIMARY KEY,
  job_id UUID NOT NULL REFERENCES content.note_authoring_jobs(id) ON DELETE CASCADE,
  outline_version_id UUID NOT NULL REFERENCES content.note_outline_versions(id) ON DELETE RESTRICT,
  version_number INTEGER NOT NULL CHECK (version_number >= 1),
  markdown TEXT NOT NULL,
  input_hash TEXT NOT NULL,
  output_hash TEXT NOT NULL,
  state TEXT NOT NULL DEFAULT 'assembled' CHECK (state IN ('assembled', 'superseded')),
  created_by UUID REFERENCES identity.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT note_draft_version_unique UNIQUE (job_id, version_number),
  CONSTRAINT note_draft_input_hash_format CHECK (input_hash ~ '^[0-9a-f]{64}$'),
  CONSTRAINT note_draft_output_hash_format CHECK (output_hash ~ '^[0-9a-f]{64}$')
);

CREATE INDEX IF NOT EXISTS note_outline_job_state_idx
  ON content.note_outline_versions(job_id, state, version_number DESC);
CREATE INDEX IF NOT EXISTS note_sections_outline_idx
  ON content.note_sections(outline_version_id, position);
CREATE INDEX IF NOT EXISTS note_section_versions_section_idx
  ON content.note_section_versions(section_id, version_number DESC);
CREATE INDEX IF NOT EXISTS note_generation_events_job_idx
  ON content.note_generation_events(job_id, created_at DESC);
CREATE INDEX IF NOT EXISTS note_draft_versions_job_idx
  ON content.note_draft_versions(job_id, version_number DESC);

COMMENT ON TABLE content.note_outline_versions IS
  'Immutable deterministic Notes Studio outline plans derived from a reviewed evidence run and coverage targets.';
COMMENT ON TABLE content.note_section_versions IS
  'Immutable model/manual section drafts. Model inputs are accepted evidence claims, never raw source excerpts.';
COMMENT ON TABLE content.note_generation_events IS
  'Provider-neutral generation telemetry with prompt-policy, hash, usage, latency and failure provenance.';
COMMENT ON TABLE content.note_draft_versions IS
  'Internal assembled learner-copy candidates awaiting NS-005 QA; these are not content.learning_resources.';
