# ARG-001 CP015 — Perceived Diversity Expansion

Status: **IMPLEMENTED / CERTIFICATION PENDING**

## Trigger

The deterministic CP014 1,000-question English diversity audit found 843/1,000 exact-unique full questions. Diagnostics isolated the issue:

- core: 591/600 unique (98.5%);
- SSC 2x4: 48/120 unique (40.0%);
- Banking classic 2x5: 48/118 unique (40.7%);
- Banking combo 3x5: 102/108 unique (94.4%);
- Banking combo 4x5: 54/54 unique (100%).

The main defect was therefore the small curated two-argument real-paper cycle, not the 48-template core engine or the advanced combination profiles.

## CP015 remediation

CP015 is additive and does not rewrite CP013 or CP014 historical evidence.

- Two-argument `SSC_RECENT_2X4` and `BANKING_CLASSIC_2X5` requests now draw learner semantics from the already approved CP014/core surface pool.
- SSC keeps a four-option two-argument presentation.
- Banking classic keeps a five-option presentation with `Either I or II` as a distractor, not a fifth semantic truth class.
- Banking 3x5 and 4x5 retain the approved correlated real-paper semantics.
- Every CP015 batch uses deterministic no-repeat selection; exact learner-visible duplicates are rejected and another deterministic candidate is probed.
- CP014 manual approval and internal Question Bank/test/mock eligibility are retained.
- Public release, direct student delivery and automatic student publication remain false.

## Certification target

The dedicated CP015 proof builds the same 1,000-question corpus used to expose the defect and requires:

- 1,000/1,000 exact-unique full questions;
- all 48 approved core templates represented;
- deterministic replay;
- all four profile shapes intact;
- at least 200 unique real-paper statements across the 400 real-paper questions;
- CP014 approval/lifecycle preservation;
- CP013 editorial preservation;
- CP006 and CP008 byte-freeze preservation;
- production API and admin builds.
