-- Current Affairs coverage discovery v1.
-- Adds a metadata-only Tavily open-web discovery provider used for broad category sweeps,
-- coverage-hole rescue and bounded 72-hour catch-up. It never grants primary verification.

INSERT INTO content.current_affairs_sources (
  id, source_key, name, source_type, base_url, feed_url, trust_score,
  is_primary_source, is_active, metadata, content_policy, ingestion_mode,
  allow_raw_text_persistence, source_family, source_tier, coverage_domain
) VALUES (
  'ca000019-0000-4000-8000-000000000019'::uuid,
  'tavily_open_news',
  'Tavily Open-Web News Discovery',
  'other',
  'https://api.tavily.com/',
  null,
  0.70,
  false,
  true,
  '{
    "provider":"Tavily Search API",
    "purpose":"broad metadata-only current-affairs discovery",
    "coverageMode":"mandatory category sweeps + coverage-hole rescue + bounded 72-hour catch-up",
    "publisherArticleBodiesFetched":false,
    "rawArticlePersistence":false,
    "snippetPersistence":false,
    "verificationAuthority":false,
    "publicationAuthority":false
  }'::jsonb,
  'discovery_only',
  'api',
  false,
  'tavily_open_web',
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
    source_family='tavily_open_web',
    source_tier='specialist',
    coverage_domain='other',
    updated_at=now();

COMMENT ON COLUMN content.current_affairs_sources.allow_raw_text_persistence IS
  'False for metadata-only search providers; publisher article bodies and search snippets must not be persisted by discovery runtimes.';
