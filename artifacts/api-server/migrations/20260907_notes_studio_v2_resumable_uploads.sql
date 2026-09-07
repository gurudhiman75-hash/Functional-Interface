BEGIN;

CREATE TABLE IF NOT EXISTS notes_studio_v2.corpus_upload_sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  period_id uuid NOT NULL REFERENCES notes_studio_v2.periods(id) ON DELETE CASCADE,
  corpus_doc_id uuid NOT NULL,
  file_name text NOT NULL,
  mime_type text NOT NULL,
  total_bytes bigint NOT NULL CHECK (total_bytes > 0),
  chunk_size integer NOT NULL CHECK (chunk_size > 0),
  source_type notes_studio_v2.source_type NOT NULL,
  sub_category_hints jsonb NOT NULL DEFAULT '[]'::jsonb,
  page_ranges text,
  idempotency_key text NOT NULL,
  status text NOT NULL DEFAULT 'uploading' CHECK (status IN ('uploading', 'uploaded', 'extracting', 'ready', 'failed')),
  uploaded_bytes bigint NOT NULL DEFAULT 0 CHECK (uploaded_bytes >= 0),
  file_sha256 text,
  created_by text,
  error_code text,
  error_message text,
  expires_at timestamptz NOT NULL DEFAULT (now() + interval '24 hours'),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  completed_at timestamptz,
  CONSTRAINT notes_studio_v2_upload_idempotency_uq UNIQUE (period_id, idempotency_key),
  CONSTRAINT notes_studio_v2_upload_sha256_ck CHECK (file_sha256 IS NULL OR file_sha256 ~ '^[0-9a-f]{64}$')
);
CREATE INDEX IF NOT EXISTS notes_studio_v2_upload_status_idx
  ON notes_studio_v2.corpus_upload_sessions(status, updated_at);
CREATE INDEX IF NOT EXISTS notes_studio_v2_upload_corpus_idx
  ON notes_studio_v2.corpus_upload_sessions(corpus_doc_id);

CREATE TABLE IF NOT EXISTS notes_studio_v2.corpus_upload_chunks (
  upload_id uuid NOT NULL REFERENCES notes_studio_v2.corpus_upload_sessions(id) ON DELETE CASCADE,
  chunk_index integer NOT NULL CHECK (chunk_index >= 0),
  offset_bytes bigint NOT NULL CHECK (offset_bytes >= 0),
  size_bytes integer NOT NULL CHECK (size_bytes > 0),
  sha256 text NOT NULL CHECK (sha256 ~ '^[0-9a-f]{64}$'),
  data bytea NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (upload_id, chunk_index),
  CONSTRAINT notes_studio_v2_upload_chunk_offset_uq UNIQUE (upload_id, offset_bytes)
);
CREATE INDEX IF NOT EXISTS notes_studio_v2_upload_chunks_upload_offset_idx
  ON notes_studio_v2.corpus_upload_chunks(upload_id, offset_bytes);

CREATE TABLE IF NOT EXISTS notes_studio_v2.corpus_extraction_runs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  corpus_doc_id uuid NOT NULL REFERENCES notes_studio_v2.corpus_docs(id) ON DELETE CASCADE,
  upload_id uuid REFERENCES notes_studio_v2.corpus_upload_sessions(id) ON DELETE SET NULL,
  status text NOT NULL DEFAULT 'running' CHECK (status IN ('running', 'ready', 'failed')),
  total_pages integer,
  provider text,
  model text,
  usage jsonb NOT NULL DEFAULT '{"inputTokens":0,"outputTokens":0,"totalTokens":0}'::jsonb,
  error_code text,
  error_message text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  completed_at timestamptz
);
CREATE INDEX IF NOT EXISTS notes_studio_v2_extraction_runs_corpus_idx
  ON notes_studio_v2.corpus_extraction_runs(corpus_doc_id, created_at DESC);

CREATE TABLE IF NOT EXISTS notes_studio_v2.corpus_extraction_segments (
  run_id uuid NOT NULL REFERENCES notes_studio_v2.corpus_extraction_runs(id) ON DELETE CASCADE,
  start_page integer NOT NULL CHECK (start_page > 0),
  end_page integer NOT NULL CHECK (end_page >= start_page),
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'running', 'ready', 'failed')),
  attempts integer NOT NULL DEFAULT 0 CHECK (attempts >= 0),
  metadata jsonb NOT NULL DEFAULT '{}'::jsonb,
  candidates jsonb NOT NULL DEFAULT '[]'::jsonb,
  extracted_fact_ids jsonb NOT NULL DEFAULT '[]'::jsonb,
  error_code text,
  error_message text,
  updated_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (run_id, start_page, end_page)
);
CREATE INDEX IF NOT EXISTS notes_studio_v2_extraction_segments_status_idx
  ON notes_studio_v2.corpus_extraction_segments(run_id, status, start_page);

COMMIT;
