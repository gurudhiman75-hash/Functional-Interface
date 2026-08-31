-- CP-037: Open news discovery via GDELT.
-- GDELT is an open discovery dataset, never primary verification. Publisher article
-- bodies are not fetched or persisted; only short discovery metadata is stored.

ALTER TABLE content.current_affairs_sources
  DROP CONSTRAINT IF EXISTS current_affairs_sources_ingestion_mode_check;

ALTER TABLE content.current_affairs_sources
  ADD CONSTRAINT current_affairs_sources_ingestion_mode_check
  CHECK (ingestion_mode IN (
    'manual', 'feed', 'pdf', 'feed_and_pdf', 'listing', 'listing_and_pdf', 'api'
  ));

INSERT INTO content.current_affairs_sources (
  id, source_key, name, source_type, base_url, feed_url, trust_score,
  is_primary_source, is_active, metadata, content_policy, ingestion_mode,
  allow_raw_text_persistence, source_family, source_tier, coverage_domain
) VALUES (
  'ca000018-0000-4000-8000-000000000018'::uuid,
  'gdelt_open_news',
  'GDELT Open News Discovery',
  'other',
  'https://www.gdeltproject.org/',
  null,
  0.72,
  false,
  true,
  '{
    "provider":"GDELT Project DOC 2.0 API",
    "purpose":"broad discovery and corroboration only",
    "rightsBasis":"GDELT datasets permit unrestricted academic/commercial/governmental use; original publisher article bodies remain outside Examtree storage",
    "rawArticlePersistence":false,
    "verificationAuthority":false,
    "apiHost":"api.gdeltproject.org"
  }'::jsonb,
  'discovery_only',
  'api',
  false,
  'gdelt',
  'specialist',
  'other'
)
ON CONFLICT (source_key) DO UPDATE
SET name=EXCLUDED.name,
    source_type=EXCLUDED.source_type,
    base_url=EXCLUDED.base_url,
    trust_score=EXCLUDED.trust_score,
    is_primary_source=false,
    is_active=true,
    metadata=content.current_affairs_sources.metadata || EXCLUDED.metadata,
    content_policy='discovery_only',
    ingestion_mode='api',
    allow_raw_text_persistence=false,
    source_family='gdelt',
    source_tier='specialist',
    coverage_domain='other',
    updated_at=now();

COMMENT ON CONSTRAINT current_affairs_sources_ingestion_mode_check ON content.current_affairs_sources IS
  'Permitted acquisition transports. API mode is used only for explicitly allowed structured data providers such as GDELT; it does not authorize publisher scraping.';
