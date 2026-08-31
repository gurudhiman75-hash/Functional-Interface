-- CP-029: independent Punjab official-source resilience.
-- Punjab Government portal endpoints remain core official. This adds an
-- independent official Punjab source family on a separate host so a transient
-- punjab.gov.in outage does not erase the entire Punjab official domain.

INSERT INTO content.current_affairs_sources (
  id, source_key, name, source_type, base_url, feed_url, trust_score,
  is_primary_source, is_active, metadata, content_policy, ingestion_mode,
  allow_raw_text_persistence, listing_url, listing_adapter,
  source_family, source_tier, coverage_domain
) VALUES (
  'ca000011-0000-4000-8000-000000000011'::uuid,
  'punjab_lok_bhavan_press',
  'Punjab Lok Bhavan — Press Releases',
  'official',
  'https://www.punjabrajbhavan.gov.in/',
  null,
  0.9600,
  true,
  true,
  '{"coverage":"Official Punjab Governor and Lok Bhavan press releases","sourceFamily":"punjab_lok_bhavan","coverageRole":"core_official","surface":"press_releases","independentHost":true,"officialOffice":"Governor of Punjab"}'::jsonb,
  'primary_facts',
  'listing',
  false,
  'https://www.punjabrajbhavan.gov.in/home/press/',
  'punjab_lok_bhavan_press',
  'punjab_lok_bhavan',
  'core_official',
  'punjab'
)
ON CONFLICT (source_key) DO UPDATE
SET name = EXCLUDED.name,
    source_type = EXCLUDED.source_type,
    base_url = EXCLUDED.base_url,
    trust_score = EXCLUDED.trust_score,
    is_primary_source = true,
    is_active = true,
    metadata = content.current_affairs_sources.metadata || EXCLUDED.metadata,
    content_policy = 'primary_facts',
    ingestion_mode = 'listing',
    allow_raw_text_persistence = false,
    listing_url = EXCLUDED.listing_url,
    listing_adapter = EXCLUDED.listing_adapter,
    source_family = EXCLUDED.source_family,
    source_tier = 'core_official',
    coverage_domain = 'punjab',
    updated_at = now();

-- Keep I&PR registered as an official department surface, but do not make an
-- unvalidated listing a readiness dependency. The Punjab Government portal
-- itself identifies ipr.punjab.gov.in and diprpunjab.gov.in as departmental
-- websites; they remain candidates for a later stable adapter.
UPDATE content.current_affairs_sources
SET metadata = metadata || '{"officialDepartmentWebsite":"https://ipr.punjab.gov.in/","alternateDepartmentWebsite":"https://www.diprpunjab.gov.in/","resilienceRole":"supplementary_pending_stable_adapter"}'::jsonb,
    updated_at = now()
WHERE source_key = 'punjab_ipr';
