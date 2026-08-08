# SER-CP-007 authority policy decision candidate

## Policy

```text
Permanent QL identity = mathematical solve contract
```

The following do not create a separate permanent QL by themselves:

```text
source frequency
source-backed versus saturation-only provenance
presentation style
difficulty band
task direction
answer position
number of rows
movement direction
subtype-specific shortcut
subtype-specific distractor family
```

They must remain first-class metadata.

## Recommended authority count

```text
Current discovery authorities: 17
Conservative candidate:        14
Contract-first candidate:      13
Recommendation:                13
Approval state:                RECOMMENDED_NOT_FROZEN
Permanent QLs:                 0
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

## Mandatory metadata for the 13-authority model

### All merged authorities

```text
migrationSourceAuthorityId
sourceRuleId
sourceDisposition
examWeightClass
learnerRenderer
misconceptionProfile
recoverableTaskKinds
```

### Interleaved cluster series

```text
rowCount
rowPartition
rowRuleParameters
```

### Directional consecutive clusters

```text
lengthDelta
startDelta
interGroupGap
direction
alphabetWrap
```

### Periodic block completion

```text
blockCycleLength
blockDefinitions
blankIndexes
answerGrouping
```

### Position permutation cluster

```text
permutationKind
permutationOrder
rotationAmount
```

## Position-permutation subtype contract

```text
CYCLIC_ROTATION
PAIRWISE_ADJACENT_SWAP
FULL_REVERSAL
ODD_EVEN_REORDER
```

Each subtype keeps its own learner renderer and misconception profile.

```text
CYCLIC_ROTATION           -> ROTATION_MOVEMENT
PAIRWISE_ADJACENT_SWAP    -> NEIGHBOUR_PAIR_SWAP
FULL_REVERSAL             -> RIGHT_TO_LEFT_REVERSAL
ODD_EVEN_REORDER          -> ODD_THEN_EVEN_POSITIONS
```

The merged authority must never force one generic permutation explanation.

## Fallback rule

Use the conservative 14-authority model if any production handoff cannot preserve the required subtype metadata immutably.

```text
Fallback separation:
CYCLIC_CLUSTER_PERMUTATION
FIXED_POSITION_PERMUTATION_CLUSTER
```

The fallback is triggered by any of these failures:

```text
Question Studio drops subtype or provenance
Question Bank conversion drops migration authority
analytics can report only the merged authority
learner renderer cannot be selected by subtype
source-backed and saturation-only weighting cannot be separated
regeneration cannot reproduce the exact subtype
```

## Why 13 is preferred

1. A cyclic rotation is a fixed positional permutation.
2. Source frequency is a weighting concern, not a solve-contract difference.
3. Specialized explanations are selected by subtype metadata.
4. The merged contract prevents duplicate permanent identities for one equation.
5. Migration-source metadata preserves the full discovery history.
6. The 14-authority candidate remains a safe rollback path.

## What this decision does not approve

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

## Required gates before freeze

1. Both 17→14 and corrected 17→13 executable candidates pass.
2. Position-permutation subtype/provenance preservation passes.
3. The complete V2 English pack is manually reviewed.
4. All 13 candidate authority rows receive retain/merge/split approval.
5. The real integration schema preserves mandatory metadata.
6. Final deterministic regeneration and lifecycle proofs pass.
7. Only then allocate permanent QLs.

## Current state

```text
Policy recommendation:       13 AUTHORITIES
Fallback:                     14 AUTHORITIES
Policy approval:              PENDING MANUAL DECISION
Adaptive English V2:          EXECUTABLE_TARGETED_SPOT_REVIEW_PASS
Full English review:          PENDING
English discovery freeze:     BLOCKED
Permanent QLs:                0
Question Studio:              disabled
Question Bank:                disabled
CP-008:                       blocked
```

## Next authority

```text
SER_CP007_13_AUTHORITY_MANUAL_REVIEW_AND_INTEGRATION_METADATA_PROOF
```
