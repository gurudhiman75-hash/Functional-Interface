# INT-CP-001 Approved Inactive Release V2

## Scope

This record freezes the production-shaped but deliberately inactive provider for:

`INT-CP-001 — Simple-Interest Fundamentals and Direct Inverses`

```text
Provider:  INT-001:INT-CP-001:APPROVED-INACTIVE-V2
Package:   INT-001
QL range:  INT-QL-001..INT-QL-021
English:   INT-CP-001-EN-v5
Hindi:     INT-CP-001-HI-v4
Punjabi:   INT-CP-001-PA-v4
```

The provider consumes the approved readable-stem and close-distractor contracts. It supersedes `APPROVED-INACTIVE-V1` as the future integration authority; the earlier V1 checkpoint remains immutable historical evidence.

## Provider contract

`cp001-approved-inactive-release-provider-v2.ts` provides:

- explicit deterministic QL generation;
- English, Hindi and Punjabi approved-release selection;
- deterministic batches of 1–1000 questions;
- a Question Studio-shaped preview envelope;
- canonical plain-text stems;
- sanitised rich-text stem HTML and structured emphasis spans;
- exact release, language, QL and seed traceability;
- approved close-distractor ownership and proximity traces;
- fail-closed validation for missing seeds, unknown QLs and unsupported languages.

The approved question object is enclosed inside a separate provider envelope and is not rewritten.

## Approved learner authorities

```text
maturity:                    APPROVED_CLOSE_DISTRACTOR_CONTRACT
reviewStatus:                APPROVED_CLOSE_DISTRACTOR_CONTRACT
localeReviewStatus:          APPROVED_HUMAN_REVIEW
questionBankStatus:          NOT_STORED
testEligibility:             INELIGIBLE
publiclyPublishable:         false
questionStudioDiscoverable:  false
```

## Central-engine isolation

The provider is not registered in the shared Quant V4 generation engine. The audit requires `listQuantV4Packages()` to contain no package whose ID is `INT-001`.

```text
enabled:                     false
registrationStatus:          NOT_REGISTERED
questionStudioDiscoverable:  false
```

Therefore this checkpoint cannot be invoked through the public Question Studio generation route.

## Pre-record exact proof

```text
Head:       990e6f91179d24868924419176d8f2fa80b832ff
Workflow:   Validate INT-CP-001 approved inactive release V2
Run:        30507443291
Conclusion: PASS
Artifact:   8745868009
Digest:     sha256:b5d4e833a476230336699dce1345d553c1ed55c6bb83719c40d86425c1a2a25f
```

## Exhaustive provider evidence

```text
21 QLs × 60 seeds × 3 languages = 3,780 direct packages
Deterministic envelope checks:          3,780
Deterministic preview checks:           3,780
Approved release checks:                3,780
Approved lifecycle checks:              3,780
Production-shape checks:                3,780
Rich-stem presentation checks:          3,780
Distractor checks:                     11,340
Proximity-trace checks:                 3,780
Cross-language option parity checks:    2,520
Retained concept distractors:             927
Generated numerical near misses:       10,413
```

Deterministic batch evidence:

```text
Batch runs:                 36
Batch packages:          1,512
Batch determinism checks:   36
```

Coverage:

```text
All three languages covered all 21 QLs.
English distinct stems: 1,233
Hindi distinct stems:   1,233
Punjabi distinct stems: 1,233
Answer positions per language: 316 / 314 / 314 / 316
```

The same exact-head workflow also passed the approved close-distractor regression, including 5,040 candidate-to-approved identity checks and 15,120 approved wrong-option checks.

## Safety boundary

This record does not:

- register `INT-001` in the central generation engine;
- expose the package in Question Studio capabilities;
- store generated questions in Question Bank;
- enable mock-test eligibility;
- make any question publicly publishable;
- mark a pull request ready for review;
- merge any pull request or stacked dependency.

Central Question Studio registration remains the next separate explicit approval gate.
