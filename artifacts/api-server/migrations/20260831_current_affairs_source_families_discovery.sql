-- CP-028: institution-level official coverage + Punjab discovery-source registry.
-- Newspaper sources are discovery-only and remain non-automated unless publisher terms/licensing permit commercial ingestion.

ALTER TABLE content.current_affairs_sources
  ADD COLUMN IF NOT EXISTS source_family text,
  ADD COLUMN IF NOT EXISTS source_tier text NOT NULL DEFAULT 'supplementary_official',
  ADD COLUMN IF NOT EXISTS coverage_domain text;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'current_affairs_sources_source_tier_check'
  ) THEN
    ALTER TABLE content.current_affairs_sources
      ADD CONSTRAINT current_affairs_sources_source_tier_check
      CHECK (source_tier IN ('core_official','supplementary_official','trusted_news','specialist'));
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'current_affairs_sources_coverage_domain_check'
  ) THEN
    ALTER TABLE content.current_affairs_sources
      ADD CONSTRAINT current_affairs_sources_coverage_domain_check
      CHECK (coverage_domain IS NULL OR coverage_domain IN (
        'national','economy_banking','science_space','punjab','international','sports','environment','other'
      ));
  END IF;
END $$;

UPDATE content.current_affairs_sources
SET source_family = CASE source_key
      WHEN 'pib' THEN 'pib'
      WHEN 'rbi' THEN 'rbi'
      WHEN 'sebi' THEN 'sebi'
      WHEN 'isro' THEN 'isro'
      WHEN 'punjab_gov' THEN 'punjab_government'
      ELSE COALESCE(NULLIF(source_family, ''), source_key)
    END,
    source_tier = CASE source_key
      WHEN 'pib' THEN 'core_official'
      WHEN 'rbi' THEN 'core_official'
      WHEN 'sebi' THEN 'core_official'
      WHEN 'isro' THEN 'core_official'
      WHEN 'punjab_gov' THEN 'core_official'
      ELSE source_tier
    END,
    coverage_domain = CASE source_key
      WHEN 'pib' THEN 'national'
      WHEN 'rbi' THEN 'economy_banking'
      WHEN 'sebi' THEN 'economy_banking'
      WHEN 'isro' THEN 'science_space'
      WHEN 'punjab_gov' THEN 'punjab'
      ELSE coverage_domain
    END,
    name = CASE source_key
      WHEN 'punjab_gov' THEN 'Government of Punjab — Orders & Notifications'
      ELSE name
    END,
    metadata = CASE source_key
      WHEN 'punjab_gov' THEN metadata || '{"sourceFamily":"punjab_government","coverageRole":"core_official","surface":"orders_notifications"}'::jsonb
      ELSE metadata
    END,
    updated_at = now();

UPDATE content.current_affairs_sources
SET source_family = source_key
WHERE source_family IS NULL OR BTRIM(source_family) = '';

ALTER TABLE content.current_affairs_sources
  ALTER COLUMN source_family SET NOT NULL;

CREATE INDEX IF NOT EXISTS current_affairs_sources_family_idx
  ON content.current_affairs_sources (source_tier, source_family, coverage_domain, is_active);

-- A second Punjab Government endpoint provides institution-level redundancy.
INSERT INTO content.current_affairs_sources (
  id, source_key, name, source_type, base_url, feed_url, trust_score,
  is_primary_source, is_active, metadata, content_policy, ingestion_mode,
  allow_raw_text_persistence, listing_url, listing_adapter,
  source_family, source_tier, coverage_domain
) VALUES (
  'ca000006-0000-4000-8000-000000000006'::uuid,
  'punjab_gov_press',
  'Government of Punjab — Press Release / Announcement',
  'state_government',
  'https://punjab.gov.in/press-release-announcement/',
  null,
  0.95,
  true,
  true,
  '{"coverage":"Punjab Government press releases and official announcements","sourceFamily":"punjab_government","coverageRole":"core_official","surface":"press_release_announcement"}'::jsonb,
  'primary_facts',
  'listing',
  false,
  'https://punjab.gov.in/press-release-announcement/',
  'punjab_press_releases',
  'punjab_government',
  'core_official',
  'punjab'
)
ON CONFLICT (source_key) DO UPDATE
SET name = EXCLUDED.name,
    source_type = EXCLUDED.source_type,
    base_url = EXCLUDED.base_url,
    trust_score = EXCLUDED.trust_score,
    is_primary_source = EXCLUDED.is_primary_source,
    is_active = EXCLUDED.is_active,
    metadata = content.current_affairs_sources.metadata || EXCLUDED.metadata,
    content_policy = EXCLUDED.content_policy,
    ingestion_mode = EXCLUDED.ingestion_mode,
    allow_raw_text_persistence = false,
    listing_url = EXCLUDED.listing_url,
    listing_adapter = EXCLUDED.listing_adapter,
    source_family = EXCLUDED.source_family,
    source_tier = EXCLUDED.source_tier,
    coverage_domain = EXCLUDED.coverage_domain,
    updated_at = now();

-- Punjab I&PR is registered as an official supplementary discovery surface.
-- It does not affect the hard coverage denominator until a stable ingestible listing is validated.
INSERT INTO content.current_affairs_sources (
  id, source_key, name, source_type, base_url, feed_url, trust_score,
  is_primary_source, is_active, metadata, content_policy, ingestion_mode,
  allow_raw_text_persistence, listing_url, listing_adapter,
  source_family, source_tier, coverage_domain
) VALUES (
  'ca000007-0000-4000-8000-000000000007'::uuid,
  'punjab_ipr',
  'Punjab Department of Information & Public Relations',
  'state_government',
  'https://punjab.gov.in/government/departments/department-of-information-and-public-relation/',
  null,
  0.94,
  false,
  true,
  '{"coverage":"Punjab Information and Public Relations discovery surface","automationStatus":"manual_pending_stable_listing","officialDepartmentWebsite":"https://ipr.punjab.gov.in/"}'::jsonb,
  'discovery_only',
  'manual',
  false,
  null,
  null,
  'punjab_government',
  'supplementary_official',
  'punjab'
)
ON CONFLICT (source_key) DO UPDATE
SET name = EXCLUDED.name,
    base_url = EXCLUDED.base_url,
    trust_score = EXCLUDED.trust_score,
    is_primary_source = false,
    is_active = true,
    metadata = content.current_affairs_sources.metadata || EXCLUDED.metadata,
    content_policy = 'discovery_only',
    ingestion_mode = 'manual',
    allow_raw_text_persistence = false,
    source_family = EXCLUDED.source_family,
    source_tier = EXCLUDED.source_tier,
    coverage_domain = EXCLUDED.coverage_domain,
    updated_at = now();

-- Trusted newspaper sources are registered for discovery/corroboration only.
-- Automated ingestion remains disabled pending commercial-use rights review or licensing.
INSERT INTO content.current_affairs_sources (
  id, source_key, name, source_type, base_url, feed_url, trust_score,
  is_primary_source, is_active, metadata, content_policy, ingestion_mode,
  allow_raw_text_persistence, source_family, source_tier, coverage_domain
) VALUES
(
  'ca000008-0000-4000-8000-000000000008'::uuid,
  'tribune_punjab',
  'The Tribune — Punjab',
  'newspaper',
  'https://www.tribuneindia.com/news/state/punjab/',
  'https://publish.tribuneindia.com/state/punjab/feed/',
  0.82,
  false,
  true,
  '{"discoveryScope":"Punjab and Chandigarh","automationStatus":"disabled_pending_rights_review","usagePolicy":"headline_link_metadata_only","verificationAuthority":false,"rawArticlePersistence":false}'::jsonb,
  'discovery_only',
  'manual',
  false,
  'tribune',
  'trusted_news',
  'punjab'
),
(
  'ca000009-0000-4000-8000-000000000009'::uuid,
  'ht_chandigarh',
  'Hindustan Times — Chandigarh',
  'newspaper',
  'https://www.hindustantimes.com/cities/chandigarh-news',
  'https://www.hindustantimes.com/feeds/rss/cities/chandigarh-news/rssfeed.xml',
  0.80,
  false,
  true,
  '{"discoveryScope":"Punjab and Chandigarh","automationStatus":"disabled_noncommercial_rss_terms","usagePolicy":"registry_only_until_license","verificationAuthority":false,"rawArticlePersistence":false}'::jsonb,
  'discovery_only',
  'manual',
  false,
  'hindustan_times',
  'trusted_news',
  'punjab'
),
(
  'ca000010-0000-4000-8000-000000000010'::uuid,
  'indian_express_chandigarh',
  'The Indian Express — Chandigarh',
  'newspaper',
  'https://indianexpress.com/section/cities/chandigarh/',
  'https://indianexpress.com/section/cities/chandigarh/feed/',
  0.84,
  false,
  true,
  '{"discoveryScope":"Punjab and Chandigarh","automationStatus":"disabled_noncommercial_rss_terms","usagePolicy":"registry_only_until_license","verificationAuthority":false,"rawArticlePersistence":false}'::jsonb,
  'discovery_only',
  'manual',
  false,
  'indian_express',
  'trusted_news',
  'punjab'
)
ON CONFLICT (source_key) DO UPDATE
SET name = EXCLUDED.name,
    source_type = EXCLUDED.source_type,
    base_url = EXCLUDED.base_url,
    feed_url = EXCLUDED.feed_url,
    trust_score = EXCLUDED.trust_score,
    is_primary_source = false,
    is_active = true,
    metadata = content.current_affairs_sources.metadata || EXCLUDED.metadata,
    content_policy = 'discovery_only',
    ingestion_mode = 'manual',
    allow_raw_text_persistence = false,
    source_family = EXCLUDED.source_family,
    source_tier = EXCLUDED.source_tier,
    coverage_domain = EXCLUDED.coverage_domain,
    updated_at = now();

COMMENT ON COLUMN content.current_affairs_sources.source_family IS
  'Institution-level family used for readiness coverage. Multiple endpoints from one institution count once.';
COMMENT ON COLUMN content.current_affairs_sources.source_tier IS
  'core_official drives production coverage; supplementary_official and trusted_news improve discovery without inflating the hard readiness denominator.';
COMMENT ON COLUMN content.current_affairs_sources.coverage_domain IS
  'High-level coverage domain used to preserve required National, Economy/Banking and Punjab official evidence even when overall family coverage remains >=80%.';
