# SER-CP-007 authority compression candidates

## Corrected inventory

All counts are computed from the shared live 140-template registry.

```text
Discovery authorities:          17
Temporary templates:           140
Conservative candidate:         14 authorities
Contract-first candidate:       13 authorities
Permanent QLs:                   0
```

## Conservative 17→14 candidate

```text
TWO_INTERLEAVED_CLUSTER_SERIES
K_INTERLEAVED_CLUSTER_SERIES
  -> INTERLEAVED_CLUSTER_SERIES
  Templates: 17

VARIABLE_LENGTH_CONSECUTIVE_CLUSTER
GROWING_CONSECUTIVE_CLUSTER
  -> DIRECTIONAL_CONSECUTIVE_CLUSTER
  Templates: 8

REPEATED_BLOCK_COMPLETION
ALTERNATING_BLOCK_COMPLETION
  -> PERIODIC_BLOCK_COMPLETION
  Templates: 4
```

The periodic-block total is **four**, not eight:

```text
Wave A repeated block:       1
Wave A alternating block:    1
Wave B repeated grouped gaps: 1
Wave B alternating grouped gaps: 1
Total:                        4
```

## Contract-first 17→13 candidate

The 13-authority model includes all three conservative merges plus:

```text
CYCLIC_CLUSTER_PERMUTATION
FIXED_POSITION_PERMUTATION_CLUSTER
  -> POSITION_PERMUTATION_CLUSTER
  Templates: 21
```

Position-permutation composition:

```text
Wave A cyclic rotation:                 4
Wave C next-two rotation:               1
Wave D fixed-permutation probes:       12
Wave E case-marker rotation collision:  4
Total:                                 21
```

## Why the shared registry matters

The previous draft copied candidate counts into separate tests and reports. That allowed a periodic-block count error to survive until policy review.

The rebuilt layer now has one source of truth:

```text
authority-compression-contract.ts
```

It derives:

```text
17 discovery authority IDs
140 temporary template probes
17→14 mapping
17→13 mapping
candidate template counts
wave, source rule, task and generator trace
```

Every test and future exporter must consume this registry rather than restating counts manually.

## Mechanical proof

Across three seeds from every template:

```text
Generated spot proofs: 420
Answer/option proofs:   420
Lifecycle-lock proofs:  420
Templates preserved:    140
Tasks preserved:        140 template-task identities
```

Task inventory:

```text
NEXT_TERM:              33 templates
MISSING_TERM:           33
PREVIOUS_TERM:          29
REPLACE_WRONG_TERM:     33
FILL_GAPS:               2
FILL_GAP_GROUPS:         2
NEXT_TWO_TERMS:          6
MISSING_TWO_TERMS:       1
WRONG_AND_REPLACEMENT:   1
```

## Position-permutation subtype preservation

The 13-authority model is acceptable only when the merged 21-template authority preserves:

```text
migration source authority
source rule
permutation subtype
provenance
learner renderer
permutation order
rotation amount
```

Subtype totals across 63 sampled generated questions:

```text
CYCLIC_ROTATION:          27
PAIRWISE_ADJACENT_SWAP:   12
FULL_REVERSAL:            12
ODD_EVEN_REORDER:         12
```

Provenance totals:

```text
SERIES_SOURCE_SHAPED:     15
SOURCE_LEDGER_COLLISION:  12
SATURATION_ONLY_SERIES:   36
```

The candidate simulates preservation through:

```text
generation -> Question Studio record
Question Studio -> Question Bank record
Question Bank -> analytics event
```

This is candidate-layer proof. The real production schemas still require explicit implementation before freeze.

## Policy choice

### Conservative 14

Choose 14 when production cannot guarantee immutable permutation subtype and provenance metadata.

```text
CYCLIC_CLUSTER_PERMUTATION
FIXED_POSITION_PERMUTATION_CLUSTER
```

remain separate.

### Contract-first 13

Choose 13 when a permanent QL identifies the mathematical solve contract and subtype metadata controls:

```text
learner renderer
distractor family
source weighting
difficulty
analytics
regeneration
```

A cyclic rotation is a constrained fixed positional permutation, so this is the cleaner mathematical model.

## Recommendation

```text
Recommended candidate: 13 authorities
Fallback candidate:    14 authorities
Approval:               PENDING MANUAL AND REAL-INTEGRATION PROOF
```

The 13-authority recommendation must automatically fall back to 14 if production metadata preservation fails.

## Freeze boundary

```text
Adaptive English V2:      EXECUTABLE_TARGETED_SPOT_REVIEW_PASS
Full English review:      PENDING
Authority policy:         RECOMMENDED_NOT_APPROVED
English discovery freeze: BLOCKED
Permanent QLs:            0
Question Studio:          disabled
Question Bank:            disabled
CP-008:                   blocked
```

## Next authority

```text
SER_CP007_13_AUTHORITY_MANUAL_REVIEW_AND_INTEGRATION_METADATA_PROOF
```
