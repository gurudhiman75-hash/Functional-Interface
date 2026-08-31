-- Recover two official primary-source polls without weakening the ingestion security policy.
-- PIB's canonical www host serves the RSS XML directly; the legacy non-www URL redirects.
-- Punjab's legacy press-release page no longer exposes a usable listing, while the official
-- Orders / Notifications page remains live and provides dated government documents.

UPDATE content.current_affairs_sources
SET feed_url = 'https://www.pib.gov.in/RssMain.aspx?ModId=6&Lang=1&Regid=3',
    metadata = metadata || '{"sourceRecovery":"2026-08-31","canonicalFeedHost":"www.pib.gov.in"}'::jsonb,
    updated_at = now()
WHERE source_key = 'pib';

UPDATE content.current_affairs_sources
SET listing_url = 'https://punjab.gov.in/impnotifications/',
    listing_adapter = 'punjab_press_releases',
    ingestion_mode = 'listing_and_pdf',
    metadata = metadata || '{"sourceRecovery":"2026-08-31","coverage":"Punjab Government orders, notifications and official announcements","legacyPressReleaseListingUnavailable":true}'::jsonb,
    updated_at = now()
WHERE source_key = 'punjab_gov';
