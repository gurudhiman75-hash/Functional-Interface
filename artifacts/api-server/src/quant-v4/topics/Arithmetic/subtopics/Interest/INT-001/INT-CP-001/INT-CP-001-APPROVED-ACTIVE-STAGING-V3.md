# INT-CP-001 Approved Active Staging V3

Date: 2026-07-31

This checkpoint promotes the explicitly approved calculation-rich V6 corpus to an internally active staging provider.

## Provider

```text
Provider:  INT-001:INT-CP-001:APPROVED-ACTIVE-STAGING-V3
English:   INT-CP-001-EN-v6
Hindi:     INT-CP-001-HI-v6
Punjabi:   INT-CP-001-PA-v6
enabled:   true
staging:   ACTIVE_STAGING
```

## Meaning of Active Staging

The approved provider can be exercised directly for deterministic preview, single-question generation and batch-generation proof. It is exported from the INT-001 package authority.

It is deliberately absent from the shared Quant V4 package registry, so it is not available through central Question Studio routes.

## Deterministic seed recovery

Staging validation exposed one recoverable generator seed for which the close-distractor layer could not construct a third distinct near miss. The provider boundary now applies a bounded deterministic retry policy without changing the approved corpus:

- the requested seed is always retained in trace metadata;
- the effective seed and attempt count are recorded;
- retries use deterministic suffixes;
- at most 32 attempts are allowed;
- invalid QL, language and empty-seed requests still fail closed.

In the exhaustive provider proof, 3 of 3,780 direct packages required recovery and all succeeded on attempt 2. The same request always resolves to the same effective seed and package.

## Pre-record proof

```text
Head:       6346c020860c5d426d2749c43b330163b63fde99
Workflow:   Validate INT-CP-001 approved active staging V3
Run:        30599507270
Conclusion: PASS
Artifact:   8781375227
Digest:     sha256:848482111e6974abb17b541ed77c8b3b958658eccd59aac143c9409d064d3182
```

```text
Direct packages:                         3,780
Deterministic envelope checks:           3,780
Deterministic preview checks:            3,780
Approved release checks:                 3,780
Approved lifecycle checks:               3,780
Production-shape checks:                 3,780
Calculation-rich checks:                 3,780
Cross-language parity checks:            2,520
Recovered requested seeds:                   3
Maximum generation attempts:                 2
Batch runs:                                  36
Batch packages:                           1,512
Batch determinism checks:                    36
```

All three languages cover all 21 QLs and all four answer positions.

## Delivery locks

```text
registrationStatus:          NOT_REGISTERED
questionStudioDiscoverable: false
questionBankStatus:          NOT_STORED
testEligibility:             INELIGIBLE
publiclyPublishable:         false
```

## Supersession

This provider supersedes `INT-001:INT-CP-001:APPROVED-INACTIVE-V2` as the future integration authority. The V2 checkpoint remains immutable historical evidence.

The staging PR remains draft and unmerged. The exact record-inclusive proof is supplied by the workflow run on this record commit.
