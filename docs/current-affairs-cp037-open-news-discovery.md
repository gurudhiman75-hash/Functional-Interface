# Current Affairs CP-037 — Open News Discovery

## Purpose

CP-037 addresses the biggest limitation of official-source-only Current Affairs discovery: many exam-relevant developments are reported by reputable media but never appear in PIB/RBI/SEBI/ISRO/state-government feeds.

The checkpoint adds **GDELT DOC 2.0** as a broad, open news-discovery provider. GDELT is used only to discover article metadata (headline, URL, observation time, publisher domain and source-country/language metadata). Examtree does not fetch or persist publisher article bodies.

GDELT's published terms state that its datasets are available for unrestricted academic, commercial and governmental use. The original publisher's rights still apply to the underlying article, so this integration deliberately stores no article body and grants no republication authority.

## Target-date discovery

`Generate Yesterday Now` now runs:

1. normal official feed/listing refresh;
2. exact-date PIB historical recovery;
3. **open-news discovery via GDELT**;
4. official-candidate reclassification;
5. fact enrichment;
6. clustering/intelligence/verification;
7. authoring/localization/questions;
8. daily discovery census and canonical master pack.

The GDELT search is partitioned across multiple bounded queries so a single broad 250-result response is not the only discovery surface. Current query families cover:

- broad Indian press;
- India-focused global coverage;
- economy and banking;
- Punjab/Chandigarh and major Punjab cities;
- science, defence and sports;
- high-yield exam signals such as reports, indices, appointments, awards, treaties and launches.

Each query is limited to 250 records and to the exact target date.

## Publisher mapping

When GDELT returns an article from a publisher already registered in Examtree's trusted-news registry (for example The Hindu, Indian Express, Tribune or Hindustan Times), the candidate is attributed to that existing discovery source.

Unknown publishers remain attributed to the GDELT provider. This avoids automatically assigning trust to thousands of unseen domains while still letting their headlines enter the story-census/clustering layer.

## Stored data

For each accepted discovery candidate Examtree stores only bounded metadata:

- article URL;
- headline;
- observed/published timestamp supplied by GDELT;
- publisher domain;
- language/source-country metadata;
- query family that discovered the article;
- Examtree category guess, discovery score and keywords.

It explicitly records:

- `rawArticlePersistence: false`;
- `fetchedPublisherBody: false`;
- `evidenceRole: discovery_only`.

Only HTTPS article URLs are admitted.

## Evidence and authority

GDELT is registered as:

- non-primary;
- `source_tier = specialist`;
- `content_policy = discovery_only`;
- `ingestion_mode = api`;
- raw-text persistence disabled.

Therefore GDELT discovery cannot by itself make an event primary-verified or satisfy official-source health. It improves recall and clustering; strong facts still need the strongest available evidence or editorial review.

No release, Question Bank promotion or automatic learner publication authority is added.

## Why this matters

The Daily Discovery Census can now measure more than official feed availability. Once deployed, a target day can contain:

- official candidates from primary sources;
- trusted-news candidates mapped from known publishers;
- broader GDELT discovery candidates from other outlets;
- clusters that combine multiple reports around the same event.

This moves Examtree toward a real **yesterday story census** rather than an official-RSS digest.
