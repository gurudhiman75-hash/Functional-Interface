# Current Affairs CP-028 — Source Families + Punjab Discovery Expansion

## Goal

Make Current Affairs source coverage more resilient without weakening verification.

CP-028 separates **official verification authority** from **news discovery** and changes production readiness from raw endpoint counting to institution-level source-family coverage.

## Source tiers

### Core official

Core official sources can support primary facts and drive the production-readiness coverage gate.

Current core families:

- `pib` — National
- `rbi` — Economy / Banking
- `sebi` — Economy / Banking
- `isro` — Science / Space
- `punjab_government` — Punjab

Multiple endpoints from one institution count as one family. Punjab now has both the Orders / Notifications surface and the Press Release / Announcement surface under `punjab_government`.

### Supplementary official

Official sources that improve discovery breadth but do not enlarge the hard readiness denominator until their ingestion contract is stable.

CP-028 registers Punjab Information & Public Relations as a supplementary official source.

### Trusted news

Trusted newspapers are discovery/corroboration sources only. They never:

- count as primary evidence;
- count toward the 80% official coverage score;
- satisfy a required official coverage domain;
- authorize verification or publication;
- permit raw article-body persistence.

CP-028 registers Punjab/Chandigarh discovery entries for:

- The Tribune;
- Hindustan Times;
- The Indian Express.

Their automated ingestion is disabled pending commercial-use rights/licensing review. Feed URLs may be kept in the registry for future activation without treating availability as permission to automate them.

## Readiness semantics

The 80% threshold remains unchanged, but the denominator is now **core official source families**, not individual endpoints.

A family is healthy when at least one configured endpoint is scheduled, fresh and successful.

Example: if Punjab Orders / Notifications fails while Punjab Press Release / Announcement succeeds, `punjab_government` remains healthy but is marked degraded. The two endpoints still count as one family.

In addition to >=80% family coverage, three coverage domains must remain available:

- National
- Economy / Banking
- Punjab

This means an optional family such as SEBI or ISRO can temporarily fail when overall coverage remains >=80% and the required domains are still represented. PIB cannot silently disappear if it is the only healthy National core family, and the Punjab domain cannot be replaced by newspaper coverage.

## Punjab expansion

The Punjab source family now contains:

1. Government of Punjab — Orders & Notifications (`core_official`)
2. Government of Punjab — Press Release / Announcement (`core_official`)
3. Punjab Department of Information & Public Relations (`supplementary_official`, manual until a stable ingestible listing is validated)

Trusted-news registry entries provide additional Punjab/Chandigarh discovery surfaces while remaining non-primary.

## Ingestion provenance

Scheduled candidates now carry:

- source family;
- source tier;
- coverage domain;
- content policy;
- raw-text-persistence=false.

This keeps provenance explicit throughout clustering and review.

## Production UI

Production Readiness now shows:

- core official family coverage;
- family-level healthy/degraded/unavailable state;
- underlying official endpoint health;
- separate trusted-news discovery registry;
- newspaper automation/licensing state.

The trusted-news panel is informational and cannot change readiness.

## Safety invariants

CP-028 does not change publication authority.

It does not:

- lower the 80% official coverage requirement;
- allow trusted news to become primary evidence;
- persist newspaper article bodies;
- automatically publish Current Affairs;
- bypass factual conflict resolution;
- bypass editorial review;
- activate newspaper RSS feeds whose stated terms restrict commercial use.
