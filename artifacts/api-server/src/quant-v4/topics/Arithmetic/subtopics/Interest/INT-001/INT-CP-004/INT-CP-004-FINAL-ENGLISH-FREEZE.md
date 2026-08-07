# INT-CP-004 — Final English Freeze

Status: **Product-owner approved English implementation; frozen and inactive**  
Freeze ID: **INT-CP-004-EN-v1-frozen**  
QL range: **INT-QL-067..INT-QL-085**  
QL count: **19**

## Approved source

```text
Source branch:           feat/int-001-cp004-frequency-broken-periods
Approved source head:    9f8790d3ec0f630d37fd5e832fc5740f1c1928d9
Approval comment:        5218194545
Approval date:           2026-08-07
Workflow run:            31186746512
Artifact ID:             8997051817
Artifact digest:         sha256:5be96c82b904083b8312380ff218dbaf7bb291b868fbde3b2967137bd4b9686b
Review Markdown SHA-256: cee76ec6e1b44cf53467c4229cbe9ef360021fe992365f9378b09f91687baaf5
Review data SHA-256:     d8cc8d9c09b7dce91eeee2752819a4c46fc78fd5633fe454ee8be55f20d53da1
Registry SHA-256:        a7de3966fd4d2471fbee203f532c9ed4084336a5312ba7d7ec328ccdce260b67
```

## Frozen learner scope

The freeze covers the approved English questions, options, keyed answers and explanations for:

- complete-period compound interest under annual, half-yearly, quarterly and monthly schedules;
- amount, compound-interest, principal, rate and duration tasks;
- rates stated directly for each compounding period;
- frequency comparison and effective annual rate;
- identification of a compounding schedule from exact amount evidence;
- explicitly stated broken periods using annual compounding followed by simple interest;
- mixed-frequency intervals.

The final human review specifically confirmed:

- principal inverses use a transparent ₹100 reference method rather than circular use of the unknown principal;
- inverse rates and durations are numerically established;
- every wrong option has a distinct misconception owner;
- high rates use neutral contexts;
- effective-rate answers requested to two decimal places are displayed uniformly to two decimals;
- terms tables, balance records, schedule comparisons and timelines are genuine structured representations;
- learner-facing grammar and direct-period rate wording are natural.

## Immutable authority

```text
authority:             INT-CP-004-MATH-AUTHORITY-v1
generator:             INT-CP-004-EXAM-GENERATOR-v1
solver:                INT-CP-004-CANONICAL-SOLVER-v1
verifier:              INT-CP-004-RELATION-VERIFIER-v1
editorial remediation: INT-CP-004-EDITORIAL-REMEDIATION-v3
```

The frozen runtime must preserve every approved mathematical and learner-facing field. It may add only freeze, approval and closed-lifecycle metadata.

## Freeze validation contract

The dedicated freeze audit must:

- regenerate the approved 76-question review pack and match both approved SHA-256 digests;
- verify the approved registry digest;
- replay 100 deterministic seeds for each of 19 QLs, totalling 1,900 questions;
- compare source and frozen questions after removing only permitted freeze metadata;
- prove deep immutability and reject root and nested mutations;
- retain all four answer positions, all difficulty levels, all answer semantics, all four frequencies, all four representations and all five CP-004 domains;
- run the inherited CP-003 approved English freeze audit;
- build the API server;
- keep all delivery gates closed.

## Lifecycle boundary

```text
maturity:                    ENGLISH_IMPLEMENTATION_FROZEN
reviewStatus:                APPROVED_ENGLISH_FROZEN
enabled:                     false
stagingStatus:               NOT_STAGED
registrationStatus:          NOT_REGISTERED
questionStudioDiscoverable:  false
questionBankStatus:          NOT_STORED
testEligibility:             INELIGIBLE
publiclyPublishable:         false
```

This freeze does not authorize merge, staging, registration, Question Studio discovery, question-bank storage, test use or public publication. Hindi and Punjabi localisation must preserve exact mathematical and option parity with this frozen English authority.
