ALTER TABLE content.current_affairs_sources
  ADD COLUMN IF NOT EXISTS content_policy TEXT NOT NULL DEFAULT 'discovery_only',
  ADD COLUMN IF NOT EXISTS ingestion_mode TEXT NOT NULL DEFAULT 'manual',
  ADD COLUMN IF NOT EXISTS allow_raw_text_persistence BOOLEAN NOT NULL DEFAULT false;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'current_affairs_sources_content_policy_check'
  ) THEN
    ALTER TABLE content.current_affairs_sources
      ADD CONSTRAINT current_affairs_sources_content_policy_check
      CHECK (content_policy IN ('primary_facts', 'discovery_only', 'licensed_research'));
  END IF;
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'current_affairs_sources_ingestion_mode_check'
  ) THEN
    ALTER TABLE content.current_affairs_sources
      ADD CONSTRAINT current_affairs_sources_ingestion_mode_check
      CHECK (ingestion_mode IN ('manual', 'feed', 'pdf', 'feed_and_pdf'));
  END IF;
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'current_affairs_sources_no_raw_text_check'
  ) THEN
    ALTER TABLE content.current_affairs_sources
      ADD CONSTRAINT current_affairs_sources_no_raw_text_check
      CHECK (allow_raw_text_persistence = false);
  END IF;
END $$;

UPDATE content.current_affairs_sources
SET content_policy = CASE
      WHEN is_primary_source THEN 'primary_facts'
      ELSE 'discovery_only'
    END,
    ingestion_mode = CASE
      WHEN feed_url IS NOT NULL THEN 'feed'
      ELSE 'manual'
    END,
    allow_raw_text_persistence = false
WHERE content_policy = 'discovery_only'
   OR ingestion_mode = 'manual';

CREATE TABLE IF NOT EXISTS content.current_affairs_research_documents (
  id UUID PRIMARY KEY,
  source_id UUID NOT NULL
    REFERENCES content.current_affairs_sources(id) ON DELETE RESTRICT,
  file_name TEXT NOT NULL,
  sha256 TEXT NOT NULL,
  publication_date DATE,
  origin_url TEXT,
  rights_basis TEXT NOT NULL CHECK (
    rights_basis IN ('user_supplied', 'licensed', 'public_domain', 'publisher_authorized')
  ),
  status TEXT NOT NULL DEFAULT 'processing' CHECK (
    status IN ('processing', 'processed', 'failed')
  ),
  extraction_metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
  signal_count INTEGER NOT NULL DEFAULT 0 CHECK (signal_count >= 0),
  raw_text_persisted BOOLEAN NOT NULL DEFAULT false CHECK (raw_text_persisted = false),
  failure_reason TEXT,
  created_by UUID REFERENCES identity.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT current_affairs_research_document_hash_format
    CHECK (sha256 ~ '^[a-f0-9]{64}$'),
  CONSTRAINT current_affairs_research_document_origin_https
    CHECK (origin_url IS NULL OR origin_url ~ '^https://'),
  UNIQUE (source_id, sha256)
);

CREATE TABLE IF NOT EXISTS content.current_affairs_research_signals (
  id UUID PRIMARY KEY,
  document_id UUID NOT NULL
    REFERENCES content.current_affairs_research_documents(id) ON DELETE CASCADE,
  headline TEXT NOT NULL,
  category_guess TEXT NOT NULL DEFAULT 'other',
  relevance_score SMALLINT NOT NULL CHECK (relevance_score BETWEEN 0 AND 100),
  keywords JSONB NOT NULL DEFAULT '[]'::jsonb,
  signal_fingerprint TEXT NOT NULL,
  promoted_candidate_id UUID
    REFERENCES content.current_affairs_ingestion_candidates(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT current_affairs_research_signal_headline_nonempty
    CHECK (BTRIM(headline) <> ''),
  CONSTRAINT current_affairs_research_signal_fingerprint_format
    CHECK (signal_fingerprint ~ '^[a-f0-9]{64}$'),
  UNIQUE (document_id, signal_fingerprint)
);

ALTER TABLE content.current_affairs_ingestion_candidates
  ADD COLUMN IF NOT EXISTS source_document_id UUID
    REFERENCES content.current_affairs_research_documents(id) ON DELETE SET NULL;

ALTER TABLE content.current_affairs_ingestion_candidates
  ALTER COLUMN source_url DROP NOT NULL;

ALTER TABLE content.current_affairs_ingestion_candidates
  DROP CONSTRAINT IF EXISTS current_affairs_candidates_source_url_https;

ALTER TABLE content.current_affairs_ingestion_candidates
  ADD CONSTRAINT current_affairs_candidates_source_url_https
  CHECK (source_url IS NULL OR source_url ~ '^https://');

ALTER TABLE content.current_affairs_ingestion_candidates
  ADD CONSTRAINT current_affairs_candidates_origin_required
  CHECK (source_url IS NOT NULL OR source_document_id IS NOT NULL);

CREATE INDEX IF NOT EXISTS current_affairs_research_documents_date_idx
  ON content.current_affairs_research_documents(publication_date DESC, created_at DESC);

CREATE INDEX IF NOT EXISTS current_affairs_research_signals_relevance_idx
  ON content.current_affairs_research_signals(relevance_score DESC, created_at DESC);

CREATE INDEX IF NOT EXISTS current_affairs_candidates_document_idx
  ON content.current_affairs_ingestion_candidates(source_document_id, status, created_at DESC);

COMMENT ON COLUMN content.current_affairs_sources.content_policy IS
  'Controls whether a source supplies primary facts or discovery/research signals. Newspaper sources should normally be discovery_only.';

COMMENT ON COLUMN content.current_affairs_sources.allow_raw_text_persistence IS
  'Safety invariant: Current Affairs Studio does not persist fetched newspaper/article body text.';

COMMENT ON TABLE content.current_affairs_research_documents IS
  'Metadata-only record for lawfully supplied research PDFs. Extracted full text is processed transiently and is not persisted.';

COMMENT ON TABLE content.current_affairs_research_signals IS
  'Short discovery signals derived from transient PDF extraction. No article body or long verbatim passage is stored.';
