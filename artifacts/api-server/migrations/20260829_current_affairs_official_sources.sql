ALTER TABLE content.current_affairs_sources
  ADD COLUMN IF NOT EXISTS listing_url TEXT,
  ADD COLUMN IF NOT EXISTS listing_adapter TEXT;

ALTER TABLE content.current_affairs_sources
  DROP CONSTRAINT IF EXISTS current_affairs_sources_ingestion_mode_check;

ALTER TABLE content.current_affairs_sources
  ADD CONSTRAINT current_affairs_sources_ingestion_mode_check
  CHECK (ingestion_mode IN (
    'manual', 'feed', 'pdf', 'feed_and_pdf', 'listing', 'listing_and_pdf'
  ));

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'current_affairs_sources_listing_url_https'
  ) THEN
    ALTER TABLE content.current_affairs_sources
      ADD CONSTRAINT current_affairs_sources_listing_url_https
      CHECK (listing_url IS NULL OR listing_url ~ '^https://');
  END IF;
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'current_affairs_sources_listing_adapter_check'
  ) THEN
    ALTER TABLE content.current_affairs_sources
      ADD CONSTRAINT current_affairs_sources_listing_adapter_check
      CHECK (
        listing_adapter IS NULL
        OR listing_adapter IN ('sebi_press_releases', 'isro_latest_news', 'punjab_press_releases')
      );
  END IF;
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'current_affairs_sources_listing_config_required'
  ) THEN
    ALTER TABLE content.current_affairs_sources
      ADD CONSTRAINT current_affairs_sources_listing_config_required
      CHECK (
        ingestion_mode NOT IN ('listing', 'listing_and_pdf')
        OR (listing_url IS NOT NULL AND listing_adapter IS NOT NULL)
      );
  END IF;
END $$;

INSERT INTO content.current_affairs_sources (
  id, source_key, name, source_type, base_url, feed_url, trust_score,
  is_primary_source, is_active, metadata, content_policy, ingestion_mode,
  allow_raw_text_persistence, listing_url, listing_adapter, created_at, updated_at
) VALUES
  (
    'ca000001-0000-4000-8000-000000000001'::uuid,
    'pib', 'Press Information Bureau', 'official',
    'https://pib.gov.in/',
    'https://pib.gov.in/RssMain.aspx?ModId=6&Lang=1&Regid=3',
    0.9800, true, true,
    '{"sourcePack":"ca-cp007","coverage":"Government of India press releases"}'::jsonb,
    'primary_facts', 'feed', false, null, null, now(), now()
  ),
  (
    'ca000002-0000-4000-8000-000000000002'::uuid,
    'rbi', 'Reserve Bank of India', 'regulator',
    'https://www.rbi.org.in/',
    'https://rbi.org.in/pressreleases_rss.xml',
    0.9900, true, true,
    '{"sourcePack":"ca-cp007","coverage":"RBI press releases"}'::jsonb,
    'primary_facts', 'feed', false, null, null, now(), now()
  ),
  (
    'ca000003-0000-4000-8000-000000000003'::uuid,
    'sebi', 'Securities and Exchange Board of India', 'regulator',
    'https://www.sebi.gov.in/', null,
    0.9800, true, true,
    '{"sourcePack":"ca-cp007","coverage":"SEBI press releases"}'::jsonb,
    'primary_facts', 'listing', false,
    'https://www.sebi.gov.in/sebiweb/home/HomeAction.do?doListing=yes&sid=6&smid=0&ssid=23',
    'sebi_press_releases', now(), now()
  ),
  (
    'ca000004-0000-4000-8000-000000000004'::uuid,
    'isro', 'Indian Space Research Organisation', 'official',
    'https://www.isro.gov.in/', null,
    0.9800, true, true,
    '{"sourcePack":"ca-cp007","coverage":"ISRO latest news and releases"}'::jsonb,
    'primary_facts', 'listing', false,
    'https://www.isro.gov.in/', 'isro_latest_news', now(), now()
  ),
  (
    'ca000005-0000-4000-8000-000000000005'::uuid,
    'punjab_gov', 'Government of Punjab', 'state_government',
    'https://punjab.gov.in/', null,
    0.9600, true, true,
    '{"sourcePack":"ca-cp007","coverage":"Punjab Government press release and announcement portal"}'::jsonb,
    'primary_facts', 'listing_and_pdf', false,
    'https://punjab.gov.in/press-release-announcement/', 'punjab_press_releases', now(), now()
  )
ON CONFLICT (source_key) DO UPDATE
SET name = EXCLUDED.name,
    source_type = EXCLUDED.source_type,
    base_url = EXCLUDED.base_url,
    feed_url = EXCLUDED.feed_url,
    trust_score = EXCLUDED.trust_score,
    is_primary_source = EXCLUDED.is_primary_source,
    is_active = EXCLUDED.is_active,
    metadata = content.current_affairs_sources.metadata || EXCLUDED.metadata,
    content_policy = EXCLUDED.content_policy,
    ingestion_mode = EXCLUDED.ingestion_mode,
    allow_raw_text_persistence = false,
    listing_url = EXCLUDED.listing_url,
    listing_adapter = EXCLUDED.listing_adapter,
    updated_at = now();

CREATE INDEX IF NOT EXISTS current_affairs_sources_listing_due_idx
  ON content.current_affairs_sources(is_active, ingestion_mode, last_ingested_at)
  WHERE listing_url IS NOT NULL;

COMMENT ON COLUMN content.current_affairs_sources.listing_url IS
  'Official source index/listing page used when a stable RSS/Atom feed is not available.';

COMMENT ON COLUMN content.current_affairs_sources.listing_adapter IS
  'Curated parser contract for a known official listing-page structure; arbitrary web scraping is not enabled.';
