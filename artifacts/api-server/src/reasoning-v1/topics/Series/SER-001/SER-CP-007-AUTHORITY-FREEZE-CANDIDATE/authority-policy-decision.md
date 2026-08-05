# SER-CP-007 authority policy decision candidate

## Policy

```text
Permanent QL identity = mathematical solve contract
```

The following remain metadata and do not create a permanent QL by themselves:

```text
source frequency
source-backed versus saturation-only provenance
presentation style
difficulty band
task direction
answer position
row count
movement direction
subtype-specific shortcut
subtype-specific distractor family
```

## Recommendation

```text
Discovery authorities: 17
Conservative candidate: 14
Recommended candidate: 13
Approval state:         RECOMMENDED_NOT_FROZEN
Permanent QLs:          0
```

Recommended candidate authorities:

```text
ALPHABET_COMPLEMENT_CLUSTER_SEQUENCE
COLUMNWISE_FIXED_CLUSTER_MOVEMENT
COLUMNWISE_PROGRESSIVE_CLUSTER_MOVEMENT
CUMULATIVE_PREFIX_CLUSTER
DIRECTIONAL_CONSECUTIVE_CLUSTER
EDGE_DELETION_WORD_SEQUENCE
INTERLEAVED_CLUSTER_SERIES
MARKER_BLOCK_POSITION_SHIFT_OVER_PERIODIC_FRAME
PATTERNED_INTERIOR_INSERTION_GROWTH
PERIODIC_BLOCK_COMPLETION
POSITION_PERMUTATION_CLUSTER
PROGRESSIVE_POSITIONAL_SUBSTITUTION
SYMMETRIC_EDGE_GROWTH
```

## Recommended merges

```text
TWO_INTERLEAVED_CLUSTER_SERIES
K_INTERLEAVED_CLUSTER_SERIES
  -> INTERLEAVED_CLUSTER_SERIES

VARIABLE_LENGTH_CONSECUTIVE_CLUSTER
GROWING_CONSECUTIVE_CLUSTER
  -> DIRECTIONAL_CONSECUTIVE_CLUSTER

REPEATED_BLOCK_COMPLETION
ALTERNATING_BLOCK_COMPLETION
  -> PERIODIC_BLOCK_COMPLETION

CYCLIC_CLUSTER_PERMUTATION
FIXED_POSITION_PERMUTATION_CLUSTER
  -> POSITION_PERMUTATION_CLUSTER
```

No split is recommended at this stage.

## Mandatory metadata

All merged authorities must retain:

```text
candidate version
migration source authority
source rule
source disposition
proof model
subtype
learner renderer
recoverable task directions
permanentQlId = null until freeze
```

Authority-specific metadata:

```text
INTERLEAVED_CLUSTER_SERIES
  rowCount
  row partition
  row parameters

DIRECTIONAL_CONSECUTIVE_CLUSTER
  length delta
  start delta / inter-group gap
  direction
  alphabet wrap

PERIODIC_BLOCK_COMPLETION
  block-cycle length
  block definitions
  blank indexes
  answer grouping

POSITION_PERMUTATION_CLUSTER
  permutation kind
  permutation order
  rotation amount
```

## Mandatory position-permutation subtypes

```text
CYCLIC_ROTATION
PAIRWISE_ADJACENT_SWAP
FULL_REVERSAL
ODD_EVEN_REORDER
```

Subtype selects the learner renderer:

```text
CYCLIC_ROTATION        -> ROTATION_MOVEMENT
PAIRWISE_ADJACENT_SWAP -> NEIGHBOUR_PAIR_SWAP
FULL_REVERSAL          -> RIGHT_TO_LEFT_REVERSAL
ODD_EVEN_REORDER       -> ODD_THEN_EVEN_POSITIONS
```

One merged authority must not force one generic explanation.

## Fallback rule

Use the conservative 14-authority model if any real production handoff cannot preserve required subtype and provenance metadata immutably.

Fallback separation:

```text
CYCLIC_CLUSTER_PERMUTATION
FIXED_POSITION_PERMUTATION_CLUSTER
```

Fallback triggers:

```text
Question Studio drops subtype or provenance
Question Bank conversion drops migration authority
analytics can report only the merged authority
learner renderer cannot be selected by subtype
source weighting cannot separate source-shaped and saturation-only records
regeneration cannot reproduce the exact subtype
```

## Why 13 is preferred

1. Rotation is a fixed positional permutation.
2. Source frequency is a weighting concern, not a solve-contract difference.
3. Subtype metadata preserves specialized explanations and distractors.
4. Migration authority preserves discovery history.
5. A 14-authority rollback remains available.
6. The shared registry computes all counts from the live template inventory.

## Gates before freeze

1. Corrected 17→14 and 17→13 candidates pass from one shared registry.
2. All 140 templates and 420 sampled questions preserve answers and lifecycle locks.
3. Position-permutation subtype preservation passes through candidate Studio, Bank and analytics handoffs.
4. The complete adaptive-English V2 pack is manually reviewed.
5. All 13 authority rows receive an explicit decision.
6. Real production metadata schemas are implemented and tested.
7. Final deterministic regeneration passes.
8. Only then allocate permanent QLs.

## Not approved by this policy

```text
full manual English approval
final distractor approval
production task-frequency weights
real Question Studio schema changes
real Question Bank conversion changes
localization
permanent QL allocation
public release
CP-008
```

## Current state

```text
Authority recommendation:    13
Fallback:                    14
Policy approval:             PENDING MANUAL DECISION
Adaptive English V2:         EXECUTABLE_TARGETED_SPOT_REVIEW_PASS
Full English review:         PENDING
English discovery freeze:    BLOCKED
Permanent QLs:               0
Question Studio:             disabled
Question Bank:               disabled
CP-008:                      blocked
```

## Next authority

```text
SER_CP007_13_AUTHORITY_MANUAL_REVIEW_AND_INTEGRATION_METADATA_PROOF
```
