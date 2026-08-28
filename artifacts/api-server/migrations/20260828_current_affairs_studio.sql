CREATE TABLE IF NOT EXISTS content.current_affairs_sources (
  id UUID PRIMARY KEY,
  source_key TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  source_type TEXT NOT NULL CHECK (
    source_type IN (
      'official',
      'regulator',
      'state_government',
      'international_organization',
      'newswire',
      'newspaper',
      'other'
    )
  ),
  base_url TEXT NOT NULL,
  feed_url TEXT,
  trust_score NUMERIC(5,4) NOT NULL DEFAULT 0.7000
    CHECK (trust_score >= 0 AND trust_score <= 1),
  is_primary_source BOOLEAN NOT NULL DEFAULT false,
  is_active BOOLEAN NOT NULL DEFAULT true,
  metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT current_affairs_sources_key_format
    CHECK (source_key ~ '^[a-z0-9][a-z0-9_-]{1,79}$'),
  CONSTRAINT current_affairs_sources_base_url_https
    CHECK (base_url ~ '^https://'),
  CONSTRAINT current_affairs_sources_feed_url_https
    CHECK (feed_url IS NULL OR feed_url ~ '^https://')
);

CREATE TABLE IF NOT EXISTS content.current_affairs_ingestion_candidates (
  id UUID PRIMARY KEY,
  source_id UUID NOT NULL
    REFERENCES content.current_affairs_sources(id) ON DELETE RESTRICT,
  source_url TEXT NOT NULL UNIQUE,
  external_id TEXT,
  raw_title TEXT NOT NULL,
  raw_summary TEXT NOT NULL DEFAULT '',
  published_at TIMESTAMPTZ,
  dedupe_key TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'queued' CHECK (
    status IN ('queued', 'clustered', 'rejected', 'error')
  ),
  rejection_reason TEXT,
  payload JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT current_affairs_candidates_source_url_https
    CHECK (source_url ~ '^https://'),
  CONSTRAINT current_affairs_candidates_dedupe_key_format
    CHECK (dedupe_key ~ '^[a-f0-9]{64}$')
);

CREATE TABLE IF NOT EXISTS content.current_affairs_events (
  id UUID PRIMARY KEY,
  public_code TEXT NOT NULL UNIQUE,
  canonical_title TEXT NOT NULL,
  summary TEXT NOT NULL DEFAULT '',
  importance_reason TEXT NOT NULL DEFAULT '',
  event_date DATE NOT NULL,
  category TEXT NOT NULL CHECK (
    category IN (
      'national',
      'economy_banking',
      'international',
      'appointments',
      'awards',
      'reports_indices',
      'sports',
      'science_technology',
      'space',
      'defence',
      'environment',
      'books_authors',
      'important_days',
      'summits',
      'obituaries',
      'punjab',
      'other'
    )
  ),
  subcategory TEXT,
  status TEXT NOT NULL DEFAULT 'candidate' CHECK (
    status IN (
      'candidate',
      'review',
      'verified',
      'rejected',
      'published',
      'superseded'
    )
  ),
  verification_confidence NUMERIC(5,4) NOT NULL DEFAULT 0
    CHECK (verification_confidence >= 0 AND verification_confidence <= 1),
  event_fingerprint TEXT NOT NULL UNIQUE,
  valid_from DATE,
  valid_until DATE,
  supersedes_event_id UUID
    REFERENCES content.current_affairs_events(id) ON DELETE SET NULL,
  published_learning_resource_id UUID
    REFERENCES content.learning_resources(id) ON DELETE SET NULL,
  metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_by UUID REFERENCES identity.users(id) ON DELETE SET NULL,
  updated_by UUID REFERENCES identity.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT current_affairs_events_public_code_format
    CHECK (public_code ~ '^CA-[0-9]{8}-[A-Z0-9]{6,12}$'),
  CONSTRAINT current_affairs_events_fingerprint_format
    CHECK (event_fingerprint ~ '^[a-f0-9]{64}$'),
  CONSTRAINT current_affairs_events_validity_order
    CHECK (valid_until IS NULL OR valid_from IS NULL OR valid_until >= valid_from)
);

CREATE TABLE IF NOT EXISTS content.current_affairs_event_sources (
  event_id UUID NOT NULL
    REFERENCES content.current_affairs_events(id) ON DELETE CASCADE,
  source_id UUID NOT NULL
    REFERENCES content.current_affairs_sources(id) ON DELETE RESTRICT,
  source_url TEXT NOT NULL,
  source_title TEXT NOT NULL DEFAULT '',
  source_published_at TIMESTAMPTZ,
  is_primary_evidence BOOLEAN NOT NULL DEFAULT false,
  evidence_confidence NUMERIC(5,4) NOT NULL DEFAULT 0.5000
    CHECK (evidence_confidence >= 0 AND evidence_confidence <= 1),
  metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  PRIMARY KEY (event_id, source_url),
  CONSTRAINT current_affairs_event_sources_url_https
    CHECK (source_url ~ '^https://')
);

CREATE TABLE IF NOT EXISTS content.current_affairs_facts (
  id UUID PRIMARY KEY,
  event_id UUID NOT NULL
    REFERENCES content.current_affairs_events(id) ON DELETE CASCADE,
  fact_key TEXT NOT NULL,
  fact_value TEXT NOT NULL,
  fact_type TEXT NOT NULL DEFAULT 'string' CHECK (
    fact_type IN ('string', 'number', 'date', 'money', 'percentage', 'entity', 'boolean')
  ),
  normalized_value JSONB,
  is_verified BOOLEAN NOT NULL DEFAULT false,
  confidence NUMERIC(5,4) NOT NULL DEFAULT 0.5000
    CHECK (confidence >= 0 AND confidence <= 1),
  sort_order INTEGER NOT NULL DEFAULT 0,
  metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT current_affairs_facts_nonempty_key CHECK (BTRIM(fact_key) <> ''),
  CONSTRAINT current_affairs_facts_nonempty_value CHECK (BTRIM(fact_value) <> ''),
  UNIQUE (event_id, fact_key, fact_value)
);

CREATE TABLE IF NOT EXISTS content.current_affairs_exam_scores (
  event_id UUID NOT NULL
    REFERENCES content.current_affairs_events(id) ON DELETE CASCADE,
  exam_family_key TEXT NOT NULL CHECK (
    exam_family_key IN ('ssc', 'banking', 'punjab', 'railways', 'general')
  ),
  relevance_score SMALLINT NOT NULL CHECK (relevance_score BETWEEN 0 AND 100),
  include_recommended BOOLEAN NOT NULL DEFAULT false,
  reasons JSONB NOT NULL DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  PRIMARY KEY (event_id, exam_family_key)
);

CREATE INDEX IF NOT EXISTS current_affairs_sources_active_idx
  ON content.current_affairs_sources(is_active, is_primary_source DESC, trust_score DESC);

CREATE INDEX IF NOT EXISTS current_affairs_candidates_queue_idx
  ON content.current_affairs_ingestion_candidates(status, published_at DESC, created_at DESC);

CREATE INDEX IF NOT EXISTS current_affairs_candidates_dedupe_idx
  ON content.current_affairs_ingestion_candidates(dedupe_key, status);

CREATE INDEX IF NOT EXISTS current_affairs_events_review_idx
  ON content.current_affairs_events(status, event_date DESC, category);

CREATE INDEX IF NOT EXISTS current_affairs_events_category_idx
  ON content.current_affairs_events(category, event_date DESC);

CREATE INDEX IF NOT EXISTS current_affairs_event_sources_source_idx
  ON content.current_affairs_event_sources(source_id, source_published_at DESC);

CREATE INDEX IF NOT EXISTS current_affairs_facts_event_idx
  ON content.current_affairs_facts(event_id, sort_order, fact_key);

CREATE INDEX IF NOT EXISTS current_affairs_exam_scores_relevance_idx
  ON content.current_affairs_exam_scores(exam_family_key, include_recommended, relevance_score DESC);

COMMENT ON TABLE content.current_affairs_sources IS
  'Curated source registry for Current Affairs Studio ingestion and trust weighting.';

COMMENT ON TABLE content.current_affairs_ingestion_candidates IS
  'Normalized source items awaiting event clustering; this is not learner-facing content.';

COMMENT ON TABLE content.current_affairs_events IS
  'Canonical current-affairs event records. Published learner content remains in content.learning_resources.';

COMMENT ON TABLE content.current_affairs_event_sources IS
  'Evidence links connecting a canonical event to one or more supporting sources.';

COMMENT ON TABLE content.current_affairs_facts IS
  'Atomic, independently reviewable facts extracted from a current-affairs event.';

COMMENT ON TABLE content.current_affairs_exam_scores IS
  'Per-exam-family relevance scores used to decide inclusion in SSC, banking, Punjab and related feeds.';
