# ARG-001 CP015 — Perceived Diversity Expansion

Status: **CERTIFIED / MERGED TO `New-main`**

## Trigger

The deterministic CP014 1,000-question English diversity audit found 843/1,000 exact-unique full questions. Diagnostics isolated the issue:

- core: 591/600 unique (98.5%);
- SSC 2x4: 48/120 unique (40.0%);
- Banking classic 2x5: 48/118 unique (40.7%);
- Banking combo 3x5: 102/108 unique (94.4%);
- Banking combo 4x5: 54/54 unique (100%).

The main defect was the small curated two-argument real-paper cycle, not the 48-template core engine or the advanced combination profiles.

## CP015 remediation

CP015 is additive and does not rewrite CP013 or CP014 historical evidence.

- Two-argument `SSC_RECENT_2X4` and `BANKING_CLASSIC_2X5` requests draw learner semantics from the approved core surface pool.
- SSC keeps a four-option two-argument presentation.
- Banking classic keeps a five-option presentation with `Either I or II` as a distractor, not a fifth semantic truth class.
- Banking 3x5 and 4x5 retain the approved correlated real-paper semantics.
- Every CP015 batch uses deterministic no-repeat selection; exact learner-visible duplicates are rejected and another deterministic candidate is probed.
- CP014 manual approval and internal Question Bank/test/mock eligibility are retained.
- Public release, direct student delivery and automatic student publication remain false.

## Certified result

The authoritative CP015 proof now requires and passes:

- 1,000/1,000 exact-unique full questions;
- all 48 approved core templates represented;
- deterministic replay;
- all four certified profile shapes intact;
- at least 200 unique real-paper statements across the 400 real-paper questions;
- CP014 approval/lifecycle preservation;
- CP013 editorial preservation;
- CP006 and CP008 byte-freeze preservation;
- production API and admin builds.

The final CP012–CP015 integration was merged to `New-main` in PR #1408 at merge commit `50b35dd417a1c51ca772061b52da8e35592e8a3c` after reconciling the canonical Question Studio registry with the then-current `New-main` state.

## Lifecycle boundary

Current CP015 lifecycle is internal-only:

- Question Bank writable: **true**
- test eligible: **true**
- mock-test eligible: **true**
- learner lifecycle: `INTERNAL_ELIGIBLE`
- publicly publishable: **false**
- public release authorized: **false**
- direct student delivery authorized: **false**
- automatic student publication: **false**

Public/student release remains a separate explicit authorization gate.
