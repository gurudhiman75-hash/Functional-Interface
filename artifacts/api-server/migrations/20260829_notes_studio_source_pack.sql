CREATE TABLE IF NOT EXISTS content.source_documents (
  id UUID PRIMARY KEY,
  source_type TEXT NOT NULL CHECK (source_type IN ('web', 'uploaded_pdf', 'existing_content')),
  source_uri TEXT NOT NULL,
  title TEXT NOT NULL,
  publisher TEXT NOT NULL DEFAULT '',
  mime_type TEXT,
  captured_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  content_hash TEXT NOT NULL,
  rights_basis TEXT NOT NULL CHECK (rights_basis IN ('user_supplied', 'licensed', 'public_domain', 'publisher_authorized', 'reference_only')),
  retention_mode TEXT NOT NULL CHECK (retention_mode IN ('extracted_text', 'metadata_only')),
  extraction_status TEXT NOT NULL CHECK (extraction_status IN ('processed', 'metadata_only', 'failed')),
  extracted_text TEXT,
  extraction_metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
  failure_reason TEXT,
  created_by UUID REFERENCES identity.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT source_documents_hash_format CHECK (content_hash ~ '^[0-9a-f]{64}$'),
  CONSTRAINT source_documents_retention_integrity CHECK (
    (retention_mode = 'metadata_only' AND extracted_text IS NULL)
    OR retention_mode = 'extracted_text'
  )
);

CREATE TABLE IF NOT EXISTS content.note_authoring_jobs (
  id UUID PRIMARY KEY,
  title TEXT NOT NULL,
  source_language TEXT NOT NULL DEFAULT 'en',
  state TEXT NOT NULL DEFAULT 'brief' CHECK (state IN (
    'brief', 'sources_ready', 'evidence_ready', 'outline_ready', 'drafting',
    'qa_required', 'review_ready', 'approved', 'materialized'
  )),
  brief JSONB NOT NULL DEFAULT '{}'::jsonb,
  target_resource_id UUID REFERENCES content.learning_resources(id) ON DELETE SET NULL,
  created_by UUID REFERENCES identity.users(id) ON DELETE SET NULL,
  updated_by UUID REFERENCES identity.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS content.note_authoring_sources (
  job_id UUID NOT NULL REFERENCES content.note_authoring_jobs(id) ON DELETE CASCADE,
  source_document_id UUID NOT NULL REFERENCES content.source_documents(id) ON DELETE RESTRICT,
  inclusion_state TEXT NOT NULL DEFAULT 'included' CHECK (inclusion_state IN ('included', 'excluded')),
  relevance_score NUMERIC(5,2),
  position INTEGER NOT NULL DEFAULT 0,
  added_by UUID REFERENCES identity.users(id) ON DELETE SET NULL,
  added_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  PRIMARY KEY (job_id, source_document_id),
  CONSTRAINT note_authoring_source_relevance CHECK (
    relevance_score IS NULL OR (relevance_score >= 0 AND relevance_score <= 100)
  )
);

CREATE INDEX IF NOT EXISTS source_documents_hash_idx
  ON content.source_documents(content_hash, captured_at DESC);
CREATE INDEX IF NOT EXISTS source_documents_status_idx
  ON content.source_documents(extraction_status, captured_at DESC);
CREATE INDEX IF NOT EXISTS note_authoring_jobs_state_idx
  ON content.note_authoring_jobs(state, updated_at DESC);
CREATE INDEX IF NOT EXISTS note_authoring_sources_job_idx
  ON content.note_authoring_sources(job_id, inclusion_state, position, added_at);

COMMENT ON TABLE content.source_documents IS
  'Reusable provenance-bearing research sources. Extracted text is retained only when the declared rights basis permits it.';
COMMENT ON TABLE content.note_authoring_jobs IS
  'Syllabus-first Notes Studio authoring jobs. Learner publication remains in content.learning_resources.';
COMMENT ON TABLE content.note_authoring_sources IS
  'Auditable source-pack membership for Notes Studio authoring jobs.';
