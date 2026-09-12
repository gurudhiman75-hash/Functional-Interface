-- CP-052: broaden Current Affairs discovery attribution without granting publication or verification authority.
-- News publishers remain headline/link-metadata discovery sources only. Raw article text persistence stays disabled.
-- Department of Consumer Affairs is registered as a supplementary primary authority for future/direct evidence attachment;
-- this migration does not enable arbitrary scraping of its website.

UPDATE content.current_affairs_sources
SET name='The Indian Express',
    source_family='indian_express',
    metadata=metadata || '{"discoveryScope":"National plus Punjab/Chandigarh","usagePolicy":"headline_link_metadata_only","verificationAuthority":false,"rawArticlePersistence":false,"cp052BroadenedAttribution":true}'::jsonb,
    updated_at=now()
WHERE source_key='indian_express_chandigarh';

UPDATE content.current_affairs_sources
SET name='Hindustan Times',
    source_family='hindustan_times',
    metadata=metadata || '{"discoveryScope":"National plus Punjab/Chandigarh","usagePolicy":"headline_link_metadata_only","verificationAuthority":false,"rawArticlePersistence":false,"cp052BroadenedAttribution":true}'::jsonb,
    updated_at=now()
WHERE source_key='ht_chandigarh';

UPDATE content.current_affairs_sources
SET name='The Tribune',
    source_family='tribune',
    metadata=metadata || '{"discoveryScope":"Punjab/Chandigarh plus national coverage","usagePolicy":"headline_link_metadata_only","verificationAuthority":false,"rawArticlePersistence":false,"cp052BroadenedAttribution":true}'::jsonb,
    updated_at=now()
WHERE source_key='tribune_punjab';

INSERT INTO content.current_affairs_sources (
  id, source_key, name, source_type, base_url, feed_url, trust_score,
  is_primary_source, is_active, metadata, content_policy, ingestion_mode,
  allow_raw_text_persistence, listing_url, listing_adapter,
  source_family, source_tier, coverage_domain
) VALUES
(
  'ca000011-0000-4000-8000-000000000011'::uuid,
  'consumer_affairs',
  'Department of Consumer Affairs',
  'official',
  'https://consumeraffairs.nic.in/',
  null,
  0.9700,
  true,
  true,
  '{"coverage":"Consumer protection, Legal Metrology, standards and regulatory notifications","automationStatus":"manual_pending_curated_adapter","verificationAuthority":true,"rawArticlePersistence":false,"cp052SourceExpansion":true}'::jsonb,
  'primary_facts',
  'manual',
  false,
  null,
  null,
  'consumer_affairs',
  'supplementary_official',
  'national'
),
(
  'ca000012-0000-4000-8000-000000000012'::uuid,
  'the_hindu',
  'The Hindu',
  'newspaper',
  'https://www.thehindu.com/',
  null,
  0.8600,
  false,
  true,
  '{"discoveryScope":"National current affairs and explainers","usagePolicy":"headline_link_metadata_only","verificationAuthority":false,"rawArticlePersistence":false,"cp052SourceExpansion":true}'::jsonb,
  'discovery_only',
  'manual',
  false,
  null,
  null,
  'the_hindu',
  'trusted_news',
  'national'
),
(
  'ca000013-0000-4000-8000-000000000013'::uuid,
  'business_standard',
  'Business Standard',
  'newspaper',
  'https://www.business-standard.com/',
  null,
  0.8200,
  false,
  true,
  '{"discoveryScope":"Economy, banking, business and regulation","usagePolicy":"headline_link_metadata_only","verificationAuthority":false,"rawArticlePersistence":false,"cp052SourceExpansion":true}'::jsonb,
  'discovery_only',
  'manual',
  false,
  null,
  null,
  'business_standard',
  'trusted_news',
  'economy_banking'
),
(
  'ca000014-0000-4000-8000-000000000014'::uuid,
  'mint',
  'Mint',
  'newspaper',
  'https://www.livemint.com/',
  null,
  0.8000,
  false,
  true,
  '{"discoveryScope":"Economy, banking, markets and policy explainers","usagePolicy":"headline_link_metadata_only","verificationAuthority":false,"rawArticlePersistence":false,"cp052SourceExpansion":true}'::jsonb,
  'discovery_only',
  'manual',
  false,
  null,
  null,
  'mint',
  'trusted_news',
  'economy_banking'
),
(
  'ca000015-0000-4000-8000-000000000015'::uuid,
  'economic_times',
  'The Economic Times',
  'newspaper',
  'https://economictimes.indiatimes.com/',
  null,
  0.8000,
  false,
  true,
  '{"discoveryScope":"Economy, banking, markets, companies and regulation","usagePolicy":"headline_link_metadata_only","verificationAuthority":false,"rawArticlePersistence":false,"cp052SourceExpansion":true}'::jsonb,
  'discovery_only',
  'manual',
  false,
  null,
  null,
  'economic_times',
  'trusted_news',
  'economy_banking'
),
(
  'ca000016-0000-4000-8000-000000000016'::uuid,
  'down_to_earth',
  'Down To Earth',
  'newspaper',
  'https://www.downtoearth.org.in/',
  null,
  0.8100,
  false,
  true,
  '{"discoveryScope":"Environment, climate, science and public policy","usagePolicy":"headline_link_metadata_only","verificationAuthority":false,"rawArticlePersistence":false,"cp052SourceExpansion":true}'::jsonb,
  'discovery_only',
  'manual',
  false,
  null,
  null,
  'down_to_earth',
  'specialist',
  'environment'
),
(
  'ca000017-0000-4000-8000-000000000017'::uuid,
  'mongabay_india',
  'Mongabay India',
  'newspaper',
  'https://india.mongabay.com/',
  null,
  0.8000,
  false,
  true,
  '{"discoveryScope":"Environment, biodiversity, conservation and climate","usagePolicy":"headline_link_metadata_only","verificationAuthority":false,"rawArticlePersistence":false,"cp052SourceExpansion":true}'::jsonb,
  'discovery_only',
  'manual',
  false,
  null,
  null,
  'mongabay_india',
  'specialist',
  'environment'
)
ON CONFLICT (source_key) DO UPDATE
SET name=EXCLUDED.name,
    source_type=EXCLUDED.source_type,
    base_url=EXCLUDED.base_url,
    trust_score=EXCLUDED.trust_score,
    is_primary_source=EXCLUDED.is_primary_source,
    is_active=EXCLUDED.is_active,
    metadata=content.current_affairs_sources.metadata || EXCLUDED.metadata,
    content_policy=EXCLUDED.content_policy,
    ingestion_mode=EXCLUDED.ingestion_mode,
    allow_raw_text_persistence=false,
    listing_url=EXCLUDED.listing_url,
    listing_adapter=EXCLUDED.listing_adapter,
    source_family=EXCLUDED.source_family,
    source_tier=EXCLUDED.source_tier,
    coverage_domain=EXCLUDED.coverage_domain,
    updated_at=now();
