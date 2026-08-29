CREATE OR REPLACE FUNCTION content.materialize_current_affairs_candidate_fact_claim()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  INSERT INTO content.current_affairs_fact_claims (
    id,
    cluster_id,
    event_id,
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
    cluster.promoted_event_id,
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
  JOIN content.current_affairs_clusters cluster ON cluster.id = member.cluster_id
  JOIN content.current_affairs_sources source ON source.id = NEW.source_id
  WHERE member.candidate_id = NEW.candidate_id
  ON CONFLICT (candidate_id, fact_key, normalized_value) DO UPDATE
  SET event_id = COALESCE(EXCLUDED.event_id, content.current_affairs_fact_claims.event_id),
      fact_value = EXCLUDED.fact_value,
      fact_type = EXCLUDED.fact_type,
      confidence = GREATEST(content.current_affairs_fact_claims.confidence, EXCLUDED.confidence),
      is_primary_evidence = content.current_affairs_fact_claims.is_primary_evidence OR EXCLUDED.is_primary_evidence,
      metadata = content.current_affairs_fact_claims.metadata || EXCLUDED.metadata;

  RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION content.materialize_current_affairs_cluster_member_fact_claims()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  INSERT INTO content.current_affairs_fact_claims (
    id,
    cluster_id,
    event_id,
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
    cluster.promoted_event_id,
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
  JOIN content.current_affairs_clusters cluster ON cluster.id = NEW.cluster_id
  WHERE staged.candidate_id = NEW.candidate_id
  ON CONFLICT (candidate_id, fact_key, normalized_value) DO UPDATE
  SET event_id = COALESCE(EXCLUDED.event_id, content.current_affairs_fact_claims.event_id),
      fact_value = EXCLUDED.fact_value,
      fact_type = EXCLUDED.fact_type,
      confidence = GREATEST(content.current_affairs_fact_claims.confidence, EXCLUDED.confidence),
      is_primary_evidence = content.current_affairs_fact_claims.is_primary_evidence OR EXCLUDED.is_primary_evidence,
      metadata = content.current_affairs_fact_claims.metadata || EXCLUDED.metadata;

  RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION content.attach_current_affairs_event_to_cluster_claims()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  IF NEW.promoted_event_id IS NOT NULL
     AND (OLD.promoted_event_id IS DISTINCT FROM NEW.promoted_event_id) THEN
    UPDATE content.current_affairs_fact_claims
    SET event_id = NEW.promoted_event_id
    WHERE cluster_id = NEW.id
      AND event_id IS NULL;
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_attach_current_affairs_event_to_cluster_claims
  ON content.current_affairs_clusters;

CREATE TRIGGER trg_attach_current_affairs_event_to_cluster_claims
AFTER UPDATE OF promoted_event_id
ON content.current_affairs_clusters
FOR EACH ROW
EXECUTE FUNCTION content.attach_current_affairs_event_to_cluster_claims();

COMMENT ON FUNCTION content.attach_current_affairs_event_to_cluster_claims() IS
  'Backfills event_id on staged/enriched claims when an already-enriched cluster is later promoted or merged into a canonical event.';
