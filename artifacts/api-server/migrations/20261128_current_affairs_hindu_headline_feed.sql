-- Automate The Hindu as a headline/link discovery source. The owner states that
-- the necessary permission is held. Authority is unchanged: no verification,
-- no publication, and no raw article text persistence.
UPDATE content.current_affairs_sources
SET feed_url='https://www.thehindu.com/news/national/feeder/default.rss',
    ingestion_mode='feed',
    is_active=true,
    content_policy='discovery_only',
    allow_raw_text_persistence=false,
    metadata=metadata || '{"automationStatus":"headline_feed_enabled","permissionBasis":"owner_attested_2026-11-28","usagePolicy":"registry_headline_link_metadata_only","verificationAuthority":false,"rawArticlePersistence":false}'::jsonb,
    updated_at=now()
WHERE source_key='the_hindu_national';
