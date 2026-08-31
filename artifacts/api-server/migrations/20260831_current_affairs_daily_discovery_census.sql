-- CP-036: Daily discovery census + canonical master-pack foundation.
-- The census measures yesterday's discovery breadth without granting publication authority.
-- The master pack stores one canonical English text payload that future web/PDF renderers can share.

CREATE TABLE IF NOT EXISTS content.current_affairs_daily_discovery_census (
  id uuid PRIMARY KEY,
  target_date date NOT NULL UNIQUE,
  status text NOT NULL DEFAULT 'draft' CHECK (status IN ('draft','review','complete','blocked')),
  coverage_confidence_score integer NOT NULL DEFAULT 0 CHECK (coverage_confidence_score BETWEEN 0 AND 100),
  raw_candidate_count integer NOT NULL DEFAULT 0 CHECK (raw_candidate_count >= 0),
  distinct_source_count integer NOT NULL DEFAULT 0 CHECK (distinct_source_count >= 0),
  distinct_source_family_count integer NOT NULL DEFAULT 0 CHECK (distinct_source_family_count >= 0),
  official_candidate_count integer NOT NULL DEFAULT 0 CHECK (official_candidate_count >= 0),
  trusted_news_candidate_count integer NOT NULL DEFAULT 0 CHECK (trusted_news_candidate_count >= 0),
  specialist_candidate_count integer NOT NULL DEFAULT 0 CHECK (specialist_candidate_count >= 0),
  cluster_count integer NOT NULL DEFAULT 0 CHECK (cluster_count >= 0),
  unresolved_cluster_count integer NOT NULL DEFAULT 0 CHECK (unresolved_cluster_count >= 0),
  event_count integer NOT NULL DEFAULT 0 CHECK (event_count >= 0),
  verified_event_count integer NOT NULL DEFAULT 0 CHECK (verified_event_count >= 0),
  review_event_count integer NOT NULL DEFAULT 0 CHECK (review_event_count >= 0),
  authoring_ready_count integer NOT NULL DEFAULT 0 CHECK (authoring_ready_count >= 0),
  high_priority_unresolved_count integer NOT NULL DEFAULT 0 CHECK (high_priority_unresolved_count >= 0),
  domain_snapshot jsonb NOT NULL DEFAULT '{}'::jsonb,
  source_snapshot jsonb NOT NULL DEFAULT '{}'::jsonb,
  evidence_snapshot jsonb NOT NULL DEFAULT '{}'::jsonb,
  blockers jsonb NOT NULL DEFAULT '[]'::jsonb,
  warnings jsonb NOT NULL DEFAULT '[]'::jsonb,
  generated_at timestamptz NOT NULL DEFAULT now(),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS current_affairs_daily_discovery_census_status_idx
  ON content.current_affairs_daily_discovery_census (status, target_date DESC);

CREATE TABLE IF NOT EXISTS content.current_affairs_daily_master_packs (
  id uuid PRIMARY KEY,
  public_code text NOT NULL UNIQUE,
  content_date date NOT NULL,
  language_code text NOT NULL DEFAULT 'en' CHECK (language_code IN ('en','hi','pa')),
  status text NOT NULL DEFAULT 'draft' CHECK (status IN ('draft','review','approved','archived')),
  census_id uuid REFERENCES content.current_affairs_daily_discovery_census(id) ON DELETE SET NULL,
  learning_resource_id uuid NOT NULL UNIQUE REFERENCES content.learning_resources(id) ON DELETE CASCADE,
  event_count integer NOT NULL DEFAULT 0 CHECK (event_count >= 0),
  category_count integer NOT NULL DEFAULT 0 CHECK (category_count >= 0),
  body_markdown text NOT NULL,
  payload jsonb NOT NULL DEFAULT '{}'::jsonb,
  render_targets jsonb NOT NULL DEFAULT '["web","text","pdf"]'::jsonb,
  generated_at timestamptz NOT NULL DEFAULT now(),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (content_date, language_code)
);

CREATE INDEX IF NOT EXISTS current_affairs_daily_master_packs_date_idx
  ON content.current_affairs_daily_master_packs (content_date DESC, language_code, status);

-- Broaden the national/economy discovery registry. These rows are deliberately
-- rights-gated and non-automated; they improve census/source planning but do not
-- authorize scraping, raw-article persistence, official verification or readiness substitution.
INSERT INTO content.current_affairs_sources (
  id, source_key, name, source_type, base_url, feed_url, trust_score,
  is_primary_source, is_active, metadata, content_policy, ingestion_mode,
  allow_raw_text_persistence, source_family, source_tier, coverage_domain
) VALUES
(
  'ca000012-0000-4000-8000-000000000012'::uuid,
  'the_hindu_national', 'The Hindu — National', 'newspaper',
  'https://www.thehindu.com/news/national/', null, 0.88,
  false, true,
  '{"discoveryScope":"India national current affairs","automationStatus":"disabled_pending_license_or_permitted_feed","usagePolicy":"registry_headline_link_metadata_only","verificationAuthority":false,"rawArticlePersistence":false}'::jsonb,
  'discovery_only', 'manual', false, 'the_hindu', 'trusted_news', 'national'
),
(
  'ca000013-0000-4000-8000-000000000013'::uuid,
  'reuters_india', 'Reuters — India', 'news_agency',
  'https://www.reuters.com/world/india/', null, 0.90,
  false, true,
  '{"discoveryScope":"India and international developments","automationStatus":"disabled_pending_license_or_permitted_feed","usagePolicy":"registry_headline_link_metadata_only","verificationAuthority":false,"rawArticlePersistence":false}'::jsonb,
  'discovery_only', 'manual', false, 'reuters', 'trusted_news', 'national'
),
(
  'ca000014-0000-4000-8000-000000000014'::uuid,
  'indian_express_national', 'The Indian Express — National', 'newspaper',
  'https://indianexpress.com/section/india/', null, 0.86,
  false, true,
  '{"discoveryScope":"India national current affairs","automationStatus":"disabled_pending_license_or_permitted_feed","usagePolicy":"registry_headline_link_metadata_only","verificationAuthority":false,"rawArticlePersistence":false}'::jsonb,
  'discovery_only', 'manual', false, 'indian_express', 'trusted_news', 'national'
),
(
  'ca000015-0000-4000-8000-000000000015'::uuid,
  'business_standard_economy', 'Business Standard — Economy', 'newspaper',
  'https://www.business-standard.com/economy', null, 0.84,
  false, true,
  '{"discoveryScope":"Economy, policy and markets","automationStatus":"disabled_pending_license_or_permitted_feed","usagePolicy":"registry_headline_link_metadata_only","verificationAuthority":false,"rawArticlePersistence":false}'::jsonb,
  'discovery_only', 'manual', false, 'business_standard', 'trusted_news', 'economy_banking'
),
(
  'ca000016-0000-4000-8000-000000000016'::uuid,
  'mint_economy', 'Mint — Economy', 'newspaper',
  'https://www.livemint.com/economy', null, 0.83,
  false, true,
  '{"discoveryScope":"Economy, policy and business","automationStatus":"disabled_pending_license_or_permitted_feed","usagePolicy":"registry_headline_link_metadata_only","verificationAuthority":false,"rawArticlePersistence":false}'::jsonb,
  'discovery_only', 'manual', false, 'mint', 'trusted_news', 'economy_banking'
),
(
  'ca000017-0000-4000-8000-000000000017'::uuid,
  'economic_times_economy', 'The Economic Times — Economy', 'newspaper',
  'https://economictimes.indiatimes.com/news/economy', null, 0.82,
  false, true,
  '{"discoveryScope":"Economy, banking, policy and business","automationStatus":"disabled_pending_license_or_permitted_feed","usagePolicy":"registry_headline_link_metadata_only","verificationAuthority":false,"rawArticlePersistence":false}'::jsonb,
  'discovery_only', 'manual', false, 'economic_times', 'trusted_news', 'economy_banking'
)
ON CONFLICT (source_key) DO UPDATE
SET name=EXCLUDED.name,
    base_url=EXCLUDED.base_url,
    trust_score=EXCLUDED.trust_score,
    is_primary_source=false,
    is_active=true,
    metadata=content.current_affairs_sources.metadata || EXCLUDED.metadata,
    content_policy='discovery_only',
    ingestion_mode='manual',
    allow_raw_text_persistence=false,
    source_family=EXCLUDED.source_family,
    source_tier='trusted_news',
    coverage_domain=EXCLUDED.coverage_domain,
    updated_at=now();

COMMENT ON TABLE content.current_affairs_daily_discovery_census IS
  'Daily coverage audit for the target date. It measures discovery/evidence breadth and does not itself authorize learner publication.';
COMMENT ON TABLE content.current_affairs_daily_master_packs IS
  'Canonical daily Current Affairs text payload. Web, text and future PDF renderers should derive from this one draft instead of researching independently.';
