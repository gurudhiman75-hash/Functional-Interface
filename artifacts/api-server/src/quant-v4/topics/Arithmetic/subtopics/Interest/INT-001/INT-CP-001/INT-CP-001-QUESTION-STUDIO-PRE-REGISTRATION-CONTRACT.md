# INT-CP-001 Question Studio Pre-Registration Contract

## Status

`PRE_REGISTRATION_CONTRACT_READY`

This checkpoint proves that the approved calculation-rich Active Staging V3 provider for `INT-001 / INT-CP-001` can satisfy the existing Quant V4 Question Studio selector and response contract without central registration.

It does not modify the central Quant V4 package registry, shared Question Studio routes, Question Bank storage, test eligibility or public publication.

## Authority

```text
Package:             INT-001
Canonical problem:   INT-CP-001
Provider:            INT-001:INT-CP-001:APPROVED-ACTIVE-STAGING-V3
English release:     INT-CP-001-EN-v6
Hindi release:       INT-CP-001-HI-v6
Punjabi release:     INT-CP-001-PA-v6
QL range:            INT-QL-001 through INT-QL-021
```

## Pre-registration adapter

The isolated adapter accepts the central Quant V4 selector family:

- `packageId` or `archetypeId`;
- `patternId` for an explicit `INT-QL-*` identity or the CP aggregate;
- `canonicalProblemId` or `cpId`;
- topic and subtopic aliases;
- `language` or `questionLanguageId`;
- Easy, Medium or Hard package-level difficulty;
- explicit deterministic seed;
- count from 1 through 1000.

The adapter directly invokes the Active Staging V3 provider. It is not exported through `listQuantV4Packages()` and is not reachable through the shared Question Studio generation route.

## Difficulty contract

Difficulty is generated from the mathematical state. It is therefore a package-level selector rather than a promise that every QL supports every difficulty band.

```text
Package-level policy:     PACKAGE_LEVEL_STATE_DERIVED
Explicit-pattern policy:  BEST_EFFORT_FAIL_CLOSED
Maximum attempts per QL:  96
```

Aggregate difficulty requests deterministically select a compatible QL. An explicit incompatible `QL + difficulty` request fails closed.

### Proven QL difficulty support

```text
INT-QL-001: Easy, Medium, Hard
INT-QL-002: Easy, Medium, Hard
INT-QL-003: Medium
INT-QL-004: Medium
INT-QL-005: Medium
INT-QL-006: Medium
INT-QL-007: Medium
INT-QL-008: Medium
INT-QL-009: Easy, Medium, Hard
INT-QL-010: Hard
INT-QL-011: Hard
INT-QL-012: Hard
INT-QL-013: Hard
INT-QL-014: Hard
INT-QL-015: Hard
INT-QL-016: Hard
INT-QL-017: Hard
INT-QL-018: Medium
INT-QL-019: Medium
INT-QL-020: Medium
INT-QL-021: Hard
```

## API-shape hardening

The adapter proves:

- deterministic selector replay;
- complete preview, package and envelope traceability;
- JSON-safe payload conversion;
- bigint conversion to decimal strings before API delivery;
- four distinct options and valid answer index;
- learner-facing calculation-rich explanation presence;
- bounded provider seed recovery and bounded difficulty selection;
- fail-closed invalid package, CP, pattern, language, difficulty, seed and count requests.

## Validated pre-record proof

```text
Head:       df5d041e9a2ee5b2a8f25c2421203a36b58d4ad4
Workflow:   Validate INT-CP-001 Question Studio pre-registration contract
Run:        30680613406
Conclusion: PASS
Artifact:   8812071921
Digest:     sha256:b46676b5cb99a07d630b72de6d6ed11dad08379aa8a2e4399d7bc503644ee47f
```

```text
Direct requests:                         63
Deterministic request checks:            63
JSON serialization checks:               97
Lifecycle checks:                        63
Cross-language parity checks:            42
Supported explicit QL/difficulty checks: 27
Unsupported explicit combinations:       36
Package-level difficulty questions:      63
Selector alias checks:                    3
Batch boundary checks:                    4
Invalid request checks:                  13
Maximum difficulty selector attempts:    18
Maximum provider generation attempts:     1
Maximum batch size proved:             1000
```

The retained Active Staging V3 regression also passed on the same head:

```text
Direct packages:                    3,780
Cross-language parity checks:       2,520
Batch packages:                     1,512
Recovered provider seeds:               3
Maximum provider attempts:              2
```

## Central isolation and delivery locks

```text
enabled:                     true
stagingStatus:               ACTIVE_STAGING
registrationStatus:          NOT_REGISTERED
centralRegistryContainsInt001:false
questionStudioDiscoverable:  false
questionBankStatus:          NOT_STORED
testEligibility:             INELIGIBLE
publiclyPublishable:         false
```

The central registry was byte-stable before and after the pre-registration audit.

## Downstream boundary

A future central-registration change must be a separate explicitly authorised checkpoint. It must not be inferred from this contract, the Active Staging status, or the passing pre-registration proof.

Until that approval is provided:

- do not add `INT-001` to `listQuantV4Packages()`;
- do not expose it through shared Question Studio capabilities or routes;
- do not store generated questions;
- do not enable mock-test eligibility;
- do not publish learner content;
- do not merge or mark the stacked PRs ready.
