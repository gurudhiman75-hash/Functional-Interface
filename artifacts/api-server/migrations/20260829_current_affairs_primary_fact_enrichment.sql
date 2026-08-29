ALTER TABLE content.current_affairs_automation_runs
  DROP CONSTRAINT IF EXISTS current_affairs_automation_runs_job_type_check;

ALTER TABLE content.current_affairs_automation_runs
  ADD CONSTRAINT current_affairs_automation_runs_job_type_check
  CHECK (job_type IN (
    'feed_ingestion',
    'primary_fact_enrichment',
    'intelligence_processing',
    'daily_compilation'
  ));

CREATE TABLE IF NOT EXISTS content.current_affairs_candidate_enrichments (
  candidate_id UUID PRIMARY KEY
    REFERENCES content.current_affairs_ingestion_candidates(id) ON DELETE CASCADE,
  source_id UUID NOT NULL
    REFERENCES content.current_affairs_sources(id) ON DELETE RESTRICT,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (
    status IN ('pending', 'success', 'failure', 'skipped')
  ),
  attempt_count INTEGER NOT NULL DEFAULT 0 CHECK (attempt_count >= 0),
  content_hash TEXT,
  visible_char_count INTEGER NOT NULL DEFAULT 0 CHECK (visible_char_count >= 0),
  extracted_fact_count INTEGER NOT NULL DEFAULT 0 CHECK (extracted_fact_count >= 0),
  last_attempted_at TIMESTAMPTZ,
  last_enriched_at TIMESTAMPTZ,
  failure_reason TEXT,
  metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT current_affairs_candidate_enrichments_hash_format
    CHECK (content_hash IS NULL OR content_hash ~ '^[a-f0-9]{64}$')
);

CREATE TABLE IF NOT EXISTS content.current_affairs_candidate_fact_claims (
  id UUID PRIMARY KEY,
  candidate_id UUID NOT NULL
    REFERENCES content.current_affairs_ingestion_candidates(id) ON DELETE CASCADE,
  source_id UUID NOT NULL
    REFERENCES content.current_affairs_sources(id) ON DELETE RESTRICT,
  fact_key TEXT NOT NULL,
  fact_value TEXT NOT NULL,
  normalized_value TEXT NOT NULL,
  fact_type TEXT NOT NULL DEFAULT 'string' CHECK (
    fact_type IN ('string', 'number', 'date', 'money', 'percentage', 'entity', 'boolean')
  ),
  confidence NUMERIC(5,4) NOT NULL DEFAULT 0.5000
    CHECK (confidence >= 0 AND confidence <= 1),
  extraction_method TEXT NOT NULL DEFAULT 'rule' CHECK (
    extraction_method IN ('rule', 'model', 'manual')
  ),
  metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT current_affairs_candidate_fact_claims_key_nonempty CHECK (BTRIM(fact_key) <> ''),
  CONSTRAINT current_affairs_candidate_fact_claims_value_nonempty CHECK (BTRIM(fact_value) <> ''),
  UNIQUE (candidate_id, fact_key, normalized_value)
);

CREATE INDEX IF NOT EXISTS current_affairs_candidate_enrichments_status_idx
  ON content.current_affairs_candidate_enrichments(status, last_attempted_at, attempt_count);

CREATE INDEX IF NOT EXISTS current_affairs_candidate_fact_claims_candidate_idx
  ON content.current_affairs_candidate_fact_claims(candidate_id, fact_key);

CREATE OR REPLACE FUNCTION content.materialize_current_affairs_candidate_fact_claim()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  INSERT INTO content.current_affairs_fact_claims (
    id,
    cluster_id,
    candidate_id,
    source_id,
    fact_key,
    fact_value,
    normalized_value,
    fact_type,
    confidence,
    extraction_method,
    is_primary_evidence,
    metadata,
    created_at
  )
  SELECT
    gen_random_uuid(),
    member.cluster_id,
    NEW.candidate_id,
    NEW.source_id,
    NEW.fact_key,
    NEW.fact_value,
    NEW.normalized_value,
    NEW.fact_type,
    NEW.confidence,
    NEW.extraction_method,
    source.is_primary_source,
    NEW.metadata || jsonb_build_object('claimStage', 'primary_page_enrichment'),
    now()
  FROM content.current_affairs_cluster_members member
  JOIN content.current_affairs_sources source ON source.id = NEW.source_id
  WHERE member.candidate_id = NEW.candidate_id
  ON CONFLICT (candidate_id, fact_key, normalized_value) DO UPDATE
  SET fact_value = EXCLUDED.fact_value,
      fact_type = EXCLUDED.fact_type,
      confidence = GREATEST(content.current_affairs_fact_claims.confidence, EXCLUDED.confidence),
      is_primary_evidence = content.current_affairs_fact_claims.is_primary_evidence OR EXCLUDED.is_primary_evidence,
      metadata = content.current_affairs_fact_claims.metadata || EXCLUDED.metadata;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_materialize_current_affairs_candidate_fact_claim
  ON content.current_affairs_candidate_fact_claims;

CREATE TRIGGER trg_materialize_current_affairs_candidate_fact_claim
AFTER INSERT OR UPDATE OF fact_value, fact_type, confidence, metadata
ON content.current_affairs_candidate_fact_claims
FOR EACH ROW
EXECUTE FUNCTION content.materialize_current_affairs_candidate_fact_claim();

CREATE OR REPLACE FUNCTION content.materialize_current_affairs_cluster_member_fact_claims()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  INSERT INTO content.current_affairs_fact_claims (
    id,
    cluster_id,
    candidate_id,
    source_id,
    fact_key,
    fact_value,
    normalized_value,
    fact_type,
    confidence,
    extraction_method,
    is_primary_evidence,
    metadata,
    created_at
  )
  SELECT
    gen_random_uuid(),
    NEW.cluster_id,
    staged.candidate_id,
    staged.source_id,
    staged.fact_key,
    staged.fact_value,
    staged.normalized_value,
    staged.fact_type,
    staged.confidence,
    staged.extraction_method,
    source.is_primary_source,
    staged.metadata || jsonb_build_object('claimStage', 'primary_page_enrichment'),
    now()
  FROM content.current_affairs_candidate_fact_claims staged
  JOIN content.current_affairs_sources source ON source.id = staged.source_id
  WHERE staged.candidate_id = NEW.candidate_id
  ON CONFLICT (candidate_id, fact_key, normalized_value) DO UPDATE
  SET fact_value = EXCLUDED.fact_value,
      fact_type = EXCLUDED.fact_type,
      confidence = GREATEST(content.current_affairs_fact_claims.confidence, EXCLUDED.confidence),
      is_primary_evidence = content.current_affairs_fact_claims.is_primary_evidence OR EXCLUDED.is_primary_evidence,
      metadata = content.current_affairs_fact_claims.metadata || EXCLUDED.metadata;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_materialize_current_affairs_cluster_member_fact_claims
  ON content.current_affairs_cluster_members;

CREATE TRIGGER trg_materialize_current_affairs_cluster_member_fact_claims
AFTER INSERT
ON content.current_affairs_cluster_members
FOR EACH ROW
EXECUTE FUNCTION content.materialize_current_affairs_cluster_member_fact_claims();

COMMENT ON TABLE content.current_affairs_candidate_enrichments IS
  'Operational record for transient primary-source page enrichment. Full source-page text is never stored.';

COMMENT ON TABLE content.current_affairs_candidate_fact_claims IS
  'Structured atomic facts derived from transient primary-source page reads before or after clustering. No source body text is stored.';
