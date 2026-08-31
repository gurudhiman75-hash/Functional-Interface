CREATE TABLE IF NOT EXISTS content.current_affairs_clusters (
  id UUID PRIMARY KEY,
  public_code TEXT NOT NULL UNIQUE,
  representative_title TEXT NOT NULL,
  category_guess TEXT NOT NULL DEFAULT 'other',
  event_date_guess DATE NOT NULL,
  cluster_fingerprint TEXT NOT NULL UNIQUE,
  confidence NUMERIC(5,4) NOT NULL DEFAULT 0 CHECK (confidence >= 0 AND confidence <= 1),
  status TEXT NOT NULL DEFAULT 'open' CHECK (
    status IN ('open', 'promoted', 'merged', 'rejected')
  ),
  promoted_event_id UUID REFERENCES content.current_affairs_events(id) ON DELETE SET NULL,
  metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT current_affairs_clusters_code_format
    CHECK (public_code ~ '^CAC-[0-9]{8}-[A-Z0-9]{6,12}$'),
  CONSTRAINT current_affairs_clusters_fingerprint_format
    CHECK (cluster_fingerprint ~ '^[a-f0-9]{64}$')
);

CREATE TABLE IF NOT EXISTS content.current_affairs_cluster_members (
  cluster_id UUID NOT NULL
    REFERENCES content.current_affairs_clusters(id) ON DELETE CASCADE,
  candidate_id UUID NOT NULL
    REFERENCES content.current_affairs_ingestion_candidates(id) ON DELETE CASCADE,
  similarity_score NUMERIC(5,4) NOT NULL DEFAULT 1
    CHECK (similarity_score >= 0 AND similarity_score <= 1),
  member_role TEXT NOT NULL DEFAULT 'supporting' CHECK (
    member_role IN ('representative', 'supporting')
  ),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  PRIMARY KEY (cluster_id, candidate_id),
  UNIQUE (candidate_id)
);

CREATE TABLE IF NOT EXISTS content.current_affairs_event_candidates (
  event_id UUID NOT NULL
    REFERENCES content.current_affairs_events(id) ON DELETE CASCADE,
  candidate_id UUID NOT NULL
    REFERENCES content.current_affairs_ingestion_candidates(id) ON DELETE RESTRICT,
  cluster_id UUID
    REFERENCES content.current_affairs_clusters(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  PRIMARY KEY (event_id, candidate_id)
);

CREATE TABLE IF NOT EXISTS content.current_affairs_fact_claims (
  id UUID PRIMARY KEY,
  cluster_id UUID
    REFERENCES content.current_affairs_clusters(id) ON DELETE CASCADE,
  event_id UUID
    REFERENCES content.current_affairs_events(id) ON DELETE CASCADE,
  candidate_id UUID
    REFERENCES content.current_affairs_ingestion_candidates(id) ON DELETE SET NULL,
  source_id UUID
    REFERENCES content.current_affairs_sources(id) ON DELETE SET NULL,
  fact_key TEXT NOT NULL,
  fact_value TEXT NOT NULL,
  normalized_value TEXT NOT NULL,
  fact_type TEXT NOT NULL DEFAULT 'string' CHECK (
    fact_type IN ('string', 'number', 'date', 'money', 'percentage', 'entity', 'boolean')
  ),
  confidence NUMERIC(5,4) NOT NULL DEFAULT 0.5000
    CHECK (confidence >= 0 AND confidence <= 1),
  extraction_method TEXT NOT NULL DEFAULT 'rule' CHECK (
    extraction_method IN ('rule', 'structured_feed', 'model', 'manual')
  ),
  is_primary_evidence BOOLEAN NOT NULL DEFAULT false,
  metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT current_affairs_fact_claims_origin_required
    CHECK (cluster_id IS NOT NULL OR event_id IS NOT NULL),
  CONSTRAINT current_affairs_fact_claims_key_nonempty CHECK (BTRIM(fact_key) <> ''),
  CONSTRAINT current_affairs_fact_claims_value_nonempty CHECK (BTRIM(fact_value) <> ''),
  UNIQUE (candidate_id, fact_key, normalized_value)
);

CREATE TABLE IF NOT EXISTS content.current_affairs_fact_conflicts (
  id UUID PRIMARY KEY,
  cluster_id UUID
    REFERENCES content.current_affairs_clusters(id) ON DELETE CASCADE,
  event_id UUID
    REFERENCES content.current_affairs_events(id) ON DELETE CASCADE,
  fact_key TEXT NOT NULL,
  competing_values JSONB NOT NULL DEFAULT '[]'::jsonb,
  status TEXT NOT NULL DEFAULT 'open' CHECK (
    status IN ('open', 'auto_resolved', 'manually_resolved', 'ignored')
  ),
  preferred_value TEXT,
  resolution_reason TEXT,
  resolved_by UUID REFERENCES identity.users(id) ON DELETE SET NULL,
  resolved_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT current_affairs_fact_conflicts_origin_required
    CHECK (cluster_id IS NOT NULL OR event_id IS NOT NULL),
  CONSTRAINT current_affairs_fact_conflicts_key_nonempty CHECK (BTRIM(fact_key) <> '')
);

ALTER TABLE content.current_affairs_facts
  ADD COLUMN IF NOT EXISTS reconciliation_status TEXT NOT NULL DEFAULT 'unreviewed',
  ADD COLUMN IF NOT EXISTS support_count INTEGER NOT NULL DEFAULT 1,
  ADD COLUMN IF NOT EXISTS primary_support_count INTEGER NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS provenance JSONB NOT NULL DEFAULT '[]'::jsonb;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'current_affairs_facts_reconciliation_status_check'
  ) THEN
    ALTER TABLE content.current_affairs_facts
      ADD CONSTRAINT current_affairs_facts_reconciliation_status_check
      CHECK (reconciliation_status IN ('unreviewed', 'corroborated', 'primary_backed', 'manual'));
  END IF;
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'current_affairs_facts_support_nonnegative_check'
  ) THEN
    ALTER TABLE content.current_affairs_facts
      ADD CONSTRAINT current_affairs_facts_support_nonnegative_check
      CHECK (support_count >= 0 AND primary_support_count >= 0 AND primary_support_count <= support_count);
  END IF;
END $$;

CREATE INDEX IF NOT EXISTS current_affairs_clusters_review_idx
  ON content.current_affairs_clusters(status, event_date_guess DESC, confidence DESC);

CREATE INDEX IF NOT EXISTS current_affairs_cluster_members_candidate_idx
  ON content.current_affairs_cluster_members(candidate_id, cluster_id);

CREATE INDEX IF NOT EXISTS current_affairs_event_candidates_candidate_idx
  ON content.current_affairs_event_candidates(candidate_id, event_id);

CREATE INDEX IF NOT EXISTS current_affairs_fact_claims_cluster_idx
  ON content.current_affairs_fact_claims(cluster_id, fact_key, normalized_value);

CREATE INDEX IF NOT EXISTS current_affairs_fact_claims_event_idx
  ON content.current_affairs_fact_claims(event_id, fact_key, normalized_value);

CREATE INDEX IF NOT EXISTS current_affairs_fact_conflicts_open_idx
  ON content.current_affairs_fact_conflicts(status, created_at DESC)
  WHERE status = 'open';

COMMENT ON TABLE content.current_affairs_clusters IS
  'Same-event candidate groups. A cluster is research state and is not learner-facing or a verified event.';

COMMENT ON TABLE content.current_affairs_fact_claims IS
  'Provenance-preserving extracted claims. Claims remain non-canonical until reconciliation.';

COMMENT ON TABLE content.current_affairs_fact_conflicts IS
  'Explicit contradiction records. Conflicting values must not be silently collapsed into canonical facts.';
