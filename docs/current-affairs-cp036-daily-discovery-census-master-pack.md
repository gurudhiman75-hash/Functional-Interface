# Current Affairs CP-036 — Daily Discovery Census + Master Pack Foundation

## Purpose

CP-036 moves Examtree from source-health-only monitoring toward a daily Current Affairs coverage audit.

Official sources remain the strongest evidence tier, but official feeds are not assumed to discover every exam-relevant development. The new daily census records how broad yesterday's actual discovery was, which source families contributed, how many clusters/events remain unresolved, and how much of the final event set has strong evidence.

The checkpoint also creates one canonical English Daily Master Pack. It is stored as a draft Learning Resource and as a structured JSON/Markdown snapshot. Web text and future PDF rendering must derive from this same master object instead of researching or authoring independently.

## Discovery tiers

Existing source tiers remain authoritative:

- `core_official` — drives hard official-source health/coverage;
- `supplementary_official` — additional official discovery/evidence without inflating the core denominator;
- `trusted_news` — discovery/corroboration only;
- `specialist` — domain-specific discovery/evidence.

CP-036 registers additional trusted-news discovery surfaces for The Hindu, Reuters India, The Indian Express national, Business Standard, Mint and The Economic Times.

These rows are intentionally `manual` + `discovery_only` with raw-text persistence disabled. Registration does not grant permission to scrape or commercially reuse publisher content. A licensed or otherwise permitted ingestion path can activate a source later without changing the evidence model.

## Daily Discovery Census

`content.current_affairs_daily_discovery_census` stores one row per target date with:

- raw candidate count;
- distinct source/source-family count;
- official/trusted-news/specialist candidate counts;
- cluster and unresolved-cluster counts;
- event, verified-event, review and authoring-ready counts;
- high-priority unresolved-event count;
- source-domain and event-category snapshots;
- A/B/C/D evidence-grade snapshot;
- coverage-confidence score;
- explicit blockers and warnings.

The score is a coverage-confidence diagnostic, not a claim that Examtree has observed literally every event in the world. It combines source diversity, verification ratio, authoring readiness, cluster resolution, category breadth and evidence strength.

A narrow official-only day therefore remains usable but visibly warns that trusted-news discovery breadth is absent.

## Evidence grades

CP-036 records a coarse internal evidence census:

- **A** — verified event with primary-source evidence and no open conflict;
- **B** — verified event corroborated by multiple sources where no primary source is attached;
- **C** — event still in review without an open conflict;
- **D** — conflicting or otherwise unresolved event.

Grades are internal diagnostics and do not by themselves publish content.

## Canonical Daily Master Pack

`content.current_affairs_daily_master_packs` stores a canonical language/date master pack linked to a draft `content.learning_resources` record.

The English pack contains every target-date event that is:

- verified;
- learner-authoring ready/manual;
- free of open fact conflicts.

Each event snapshot contains:

- Examtree learner title;
- learner summary/Why in News;
- one-liner;
- verified atomic facts;
- recommended exam families;
- evidence source names/URLs.

The pack is grouped into stable Current Affairs sections and rendered once to Markdown.

`render_targets = ["web", "text", "pdf"]` means these formats are expected to share this canonical content. CP-036 activates web/text storage and the authenticated Markdown download endpoint. Binary PDF rendering is intentionally a later renderer checkpoint; PDF must consume this stored pack instead of generating independent prose.

Approved or already-published master packs are immutable to automatic recovery.

## On-demand integration

`Generate Yesterday Now` now ends with:

1. existing official-source refresh and historical discovery;
2. enrichment, clustering, reconciliation and verification;
3. authoring/localization/question recovery;
4. **Daily Discovery Census refresh**;
5. **Daily Master Pack materialization**;
6. existing production-readiness evaluation.

This preserves all existing draft-only authority boundaries.

## Admin endpoints

Read-only endpoints:

- `GET /api/admin/current-affairs/production/discovery-census?date=YYYY-MM-DD`
- `GET /api/admin/current-affairs/production/master-pack?date=YYYY-MM-DD`
- `GET /api/admin/current-affairs/production/master-pack/text?date=YYYY-MM-DD`

The text endpoint downloads the canonical Markdown master pack.

## Authority invariants

CP-036 does not:

- auto-publish the master pack;
- promote BANK_ONLY questions;
- count newspapers as official verification;
- persist newspaper article bodies;
- enable rights-gated newspaper automation;
- weaken verification or conflict rules;
- change learner release authority.

`publicationAuthority`, `canonicalQuestionPromotion`, and `automaticStudentPublication` remain false in the on-demand workflow.
