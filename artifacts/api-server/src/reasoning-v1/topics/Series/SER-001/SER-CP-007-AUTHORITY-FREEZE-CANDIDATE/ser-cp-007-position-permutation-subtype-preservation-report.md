# SER-CP-007 position-permutation subtype preservation

## Purpose

The 13-authority contract-first candidate merges:

```text
CYCLIC_CLUSTER_PERMUTATION
FIXED_POSITION_PERMUTATION_CLUSTER
  -> POSITION_PERMUTATION_CLUSTER
```

That merge is acceptable only if subtype, source provenance, weighting and learner-renderer metadata survive every internal handoff.

## Required candidate metadata

```text
candidateAuthorityId
migrationSourceAuthorityId
sourceRuleId
permutationKind
provenanceClass
examWeightClass
learnerRenderer
permutationOrder
rotationAmount
```

### Permutation kinds

```text
CYCLIC_ROTATION
PAIRWISE_ADJACENT_SWAP
FULL_REVERSAL
ODD_EVEN_REORDER
```

### Provenance classes

```text
SERIES_SOURCE_SHAPED
SOURCE_LEDGER_COLLISION
SATURATION_ONLY_SERIES
```

### Learner renderers

```text
ROTATION_MOVEMENT
NEIGHBOUR_PAIR_SWAP
RIGHT_TO_LEFT_REVERSAL
ODD_THEN_EVEN_POSITIONS
```

### Weight classes

```text
SOURCE_PRIMARY
SOURCE_COLLISION_SUPPORTED
SATURATION_GUARD
```

## Coverage

The merged candidate contains 21 temporary templates:

```text
Wave A cyclic rotation:              4
Wave C next-two rotation:            1
Wave D fixed-permutation probes:    12
Wave E case-marker rotation collision: 4
Total:                              21
```

Three seeds from every template produce 63 preservation proofs.

Expected subtype totals:

```text
CYCLIC_ROTATION:          27
PAIRWISE_ADJACENT_SWAP:   12
FULL_REVERSAL:            12
ODD_EVEN_REORDER:         12
```

Expected provenance totals:

```text
SERIES_SOURCE_SHAPED:     15
SOURCE_LEDGER_COLLISION:  12
SATURATION_ONLY_SERIES:   36
```

## Handoffs simulated

### Generation → Question Studio

The Studio record must retain the complete candidate metadata alongside temporary identity, task, answer and answer index.

### Question Studio → Question Bank

The converted record must preserve:

```text
candidate authority
migration source authority
permutation subtype
source rule
provenance
weight class
renderer
permutation parameters
```

### Question Bank → analytics

Analytics must still distinguish subtype and provenance after the authority merge. A report that only sees `POSITION_PERMUTATION_CLUSTER` is insufficient.

## Safety rules

```text
- cyclic records must use ROTATION_MOVEMENT;
- saturation-only fixed permutations must use SATURATION_GUARD;
- non-cyclic subtypes must retain a concrete permutation order;
- migration source authority must never be dropped;
- all lifecycle locks remain false during discovery;
- permanent QLs remain unallocated.
```

## Decision effect

If this test passes in the isolated candidate layer, the 13-authority model becomes technically credible.

It does not yet prove the production Question Studio and Question Bank schemas contain these exact fields. Before permanent freeze, the approved metadata contract must be implemented in the real integration path and retested there.

If the production architecture cannot preserve this information immutably, choose the conservative 14-authority model and retain cyclic rotation separately.

## Lifecycle

```text
Candidate subtype contract: EXECUTABLE_PENDING_CI
Production schema implementation: NOT_STARTED
Final 14-vs-13 decision: PENDING
English full-pack approval: PENDING
English discovery freeze: BLOCKED
Permanent QLs: 0
```

## Next authority

```text
SER_CP007_AUTHORITY_COMPRESSION_14_VS_13_POLICY_DECISION
```
