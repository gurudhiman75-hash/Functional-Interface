# SER-CP-007 authority candidate V1 registry

## Purpose

`SER_CP007_AUTHORITY_CANDIDATE_V1` is a non-permanent metadata registry for the recommended 13-authority model.

It does not allocate QLs and does not enable Question Studio or Question Bank.

## Registry scope

```text
Candidate authorities: 13
Temporary templates:   140
Sampled questions:     420
Permanent QLs:           0
Freeze approved:     false
```

Every template retains:

```text
candidate version
candidate authority
migration source authority
discovery wave
source rule
source disposition
editorial task
proof model
subtype
learner renderer
merged-authority parameters
permanentQlId = null
freezeApproved = false
```

## Merged-authority parameter proof

```text
INTERLEAVED_CLUSTER_SERIES
  templates with rowCount metadata: 17

DIRECTIONAL_CONSECUTIVE_CLUSTER
  templates with GROWING/SHRINKING metadata: 8

PERIODIC_BLOCK_COMPLETION
  templates with blockCycleLength 1/2: 4

POSITION_PERMUTATION_CLUSTER
  templates with permutationKind metadata: 21
```

## Source-disposition inventory

```text
SOURCE_SHAPED_DISCOVERY:           72
SOURCE_LEDGER_RESOLVED:            32
SOURCE_LEDGER_COLLISION:            4
SATURATION_ONLY_SERIES:            28
SATURATION_ONLY_SERIES_COLLISION:   4
Total:                             140
```

This separation is mandatory. The candidate authority must not erase whether a subtype came from source-shaped discovery, source-ledger remediation, a collision, or a saturation-only probe.

## Candidate handoff proof

For three seeds from each temporary template, the audit serializes and verifies:

```text
generation -> candidate Question Studio record: 420
a candidate Studio record -> candidate Question Bank record: 420
candidate Bank record -> analytics event: 420
lifecycle-lock proof: 420
```

Required fields remain intact after each JSON-safe handoff:

```text
candidateAuthorityId
migrationSourceAuthorityId
sourceRuleId
sourceDisposition
subtypeId
proofModel
learnerRenderer
merged-authority parameters
```

## What this proves

The recommended 13-authority policy can be represented without losing the 17-authority discovery history or the distinctions required for learner rendering and analytics.

## What this does not prove

The audit uses isolated candidate records. It does not modify or prove the real production schemas.

Still required:

```text
real Question Studio schema fields
real persistence and immutable item-version support
real Question Bank conversion
real analytics registry
real deterministic regeneration from stored metadata
real admin display and review filters
```

If the production implementation cannot preserve all mandatory metadata, the chapter must fall back to the conservative 14-authority model.

## Lifecycle

```text
Candidate registry:          EXECUTABLE_PENDING_CI
Production integration:      NOT_STARTED
Full English V2 review:      PENDING
Final authority approval:    PENDING
English discovery freeze:    BLOCKED
Permanent QLs:               0
Question Studio:             disabled
Question Bank:               disabled
CP-008:                      blocked
```

## Next authority

```text
SER_CP007_13_AUTHORITY_MANUAL_REVIEW_AND_REAL_INTEGRATION_PROOF
```
