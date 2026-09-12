# Current Affairs CP-029 — Punjab Official Resilience

## Problem

CP-028 correctly separated official verification coverage from trusted-news discovery, but production exposed a remaining infrastructure concentration risk: both Punjab Government core endpoints were hosted on `punjab.gov.in`. When that host timed out from Render, both endpoints failed together and the required Punjab official domain became unavailable even though other official Punjab institutions remained online.

CP-029 removes that single-host dependency without weakening Current Affairs verification policy.

## Independent Punjab official family

CP-029 adds:

- source key: `punjab_lok_bhavan_press`
- source family: `punjab_lok_bhavan`
- source tier: `core_official`
- coverage domain: `punjab`
- listing: `https://www.punjabrajbhavan.gov.in/home/press/`
- adapter: `punjab_lok_bhavan_press`
- raw article-body persistence: disabled

Punjab Lok Bhavan is the official office/residence surface of the Governor of Punjab. Its press-release listing is hosted independently from `punjab.gov.in`, so it provides a separate official Punjab availability path.

The existing `punjab_government` family remains unchanged and still contains the Orders & Notifications and Press Release / Announcement endpoints.

With the current source set there are six core official families. If both `punjab.gov.in` endpoints fail but Punjab Lok Bhavan remains healthy, official family coverage is 5/6 (83%) and the required Punjab domain remains present. If every official Punjab family is unavailable, the Punjab hard blocker remains in force.

Trusted newspapers never satisfy this rule.

## Department of Information & Public Relations

Punjab Government's own department directory identifies `ipr.punjab.gov.in` and `diprpunjab.gov.in` as Department of Information & Public Relations websites.

CP-029 records both in the existing supplementary I&PR source metadata, but does not promote them to the readiness denominator yet because a stable listing/parser contract has not been validated. This avoids converting an unproven endpoint into a new production dependency.

## Lok Bhavan listing adapter

The Lok Bhavan press surface uses tabular rows where the article title/date are row text and the actual anchor is often labelled `Read More...`.

The dedicated adapter therefore:

- extracts title and explicit date from the press-release row;
- resolves the row's detail link;
- accepts only `punjabrajbhavan.gov.in` / `www.punjabrajbhavan.gov.in` links;
- rejects external links;
- keeps only Current Affairs-relevant official items;
- persists headline/link/date metadata as ingestion candidates, not article bodies.

## Transport resilience

The bounded official fetcher now has a second public-host resilience mechanism in addition to safe redirect following and transient retry:

- public HTTPS remains mandatory;
- private-network targets remain blocked;
- redirects remain restricted to the same canonical official host;
- each attempt is bounded to 12 seconds;
- retryable HTTP statuses remain bounded;
- for apex-like official hosts, a network-level failure may try the canonical `www` / non-`www` host alias;
- nested departmental hosts do not receive invented `www` aliases;
- cross-domain fallback is never automatic.

This specifically addresses infrastructure cases where `punjab.gov.in` and `www.punjab.gov.in` are routed differently while preserving the same official-domain trust boundary.

## Readiness invariants

CP-029 does not change:

- the 80% core-official family threshold;
- mandatory National coverage;
- mandatory Economy/Banking coverage;
- mandatory Punjab official coverage;
- trusted-news discovery-only status;
- publication authority;
- Question Bank promotion authority;
- learner publication authority;
- Generate Yesterday's draft-only behavior.

The desired failure mode is resilience, not bypass: independent official Punjab evidence can keep Punjab available, but newspapers can never replace an unavailable official Punjab domain.
