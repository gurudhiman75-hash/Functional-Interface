# SER-CP-007 contract-first authority compression candidate

## Status

```text
Current provisional authorities: 17
Conservative compression:        14
Contract-first compression:      13
Contract-first proposed merges:   4
Proposed splits:                  0
Permanent QLs:                    0
Decision: PROVISIONAL_PENDING_POLICY_AND_MANUAL_REVIEW
```

This candidate asks one policy question:

> Does a permanent QL identify the mathematical solve contract, or does it also encode source frequency and learner-facing presentation?

If QL identity is the mathematical contract, the 13-authority candidate is cleaner. Source provenance, exam frequency, subtype, difficulty and specialized explanation style should remain metadata.

## Shared merges with the conservative 14-authority candidate

### Interleaved cluster series

```text
TWO_INTERLEAVED_CLUSTER_SERIES
K_INTERLEAVED_CLUSTER_SERIES
  -> INTERLEAVED_CLUSTER_SERIES
```

Parameter:

```text
rowCount = 2 | 3 | 4 | ...
```

The invariant is one: partition displayed positions modulo `rowCount`, solve each row independently, and continue the required row.

### Directional consecutive clusters

```text
VARIABLE_LENGTH_CONSECUTIVE_CLUSTER
GROWING_CONSECUTIVE_CLUSTER
  -> DIRECTIONAL_CONSECUTIVE_CLUSTER
```

Parameters:

```text
lengthDelta
startDelta or inter-group gap
direction
alphabet wrap
recoverable task directions
```

Shrinking and growing are signed variants of one consecutive-group contract. Previous-term recoverability remains a template-level constraint.

### Periodic block completion

```text
REPEATED_BLOCK_COMPLETION
ALTERNATING_BLOCK_COMPLETION
  -> PERIODIC_BLOCK_COMPLETION
```

Parameter:

```text
blockCycleLength = 1 | 2 | ...
```

The solver reconstructs the periodic block cycle and reads missing letters or groups in blank order. Flat and grouped answers remain answer semantics, not authorities.

## Additional contract-first merge

### Position permutation cluster

```text
CYCLIC_CLUSTER_PERMUTATION
FIXED_POSITION_PERMUTATION_CLUSTER
  -> POSITION_PERMUTATION_CLUSTER
```

### Shared invariant

Each next term is produced by applying one fixed permutation to the positions of the current term.

```text
next[i] = current[permutation[i]]
```

A rotation is a constrained permutation. Pair swaps, full reversal and odd/even reordering are other permutation subtypes.

### Required subtype metadata

The merge is safe only if the runtime preserves:

```text
permutationKind:
  CYCLIC_ROTATION
  PAIRWISE_ADJACENT_SWAP
  FULL_REVERSAL
  ODD_EVEN_REORDER
  GENERAL_FIXED_PERMUTATION

permutationOrder
rotationAmount
sourceDisposition:
  DIRECT_SOURCE_BACKED
  SATURATION_ONLY_SERIES
examWeight
learnerRenderer
misconceptionProfile
```

### Why source provenance must not define QL identity

`CYCLIC_CLUSTER_PERMUTATION` is directly source-backed and common. The other fixed-permutation probes are mathematical saturation coverage without direct autonomous Series ancestry in the uploaded evidence set.

That difference should control generation frequency and review priority. It does not change the equation used to generate or solve the sequence.

Creating two permanent QLs solely because one subtype is frequent and another is saturation-only risks confusing taxonomy with content weighting.

### Why specialized explanations remain possible

One authority does not require one generic explanation.

```text
CYCLIC_ROTATION
  -> show movement around the group or the rotation amount

PAIRWISE_ADJACENT_SWAP
  -> divide into neighbouring pairs and reverse each pair

FULL_REVERSAL
  -> read the group from right to left

ODD_EVEN_REORDER
  -> list original odd positions, then original even positions
```

The subtype selects the renderer and distractors while the authority records the shared solve contract.

## Contract-first 13-authority inventory

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

## Why the other authorities remain separate

### Alphabet complement versus position permutation

Complement changes letter values while preserving or separately rotating positions. Position permutation changes positions without changing letter identities. Their change axes and misconception models differ.

### Fixed versus progressive column movement

Fixed movement repeats one position-wise step vector. Progressive movement changes the step according to another sequence. Their solver state differs.

### Cumulative prefix versus interior insertion

Cumulative prefix growth preserves a boundary and extends one side. Interior insertion preserves the old order while inserting at changing internal positions. Recovery and distractors differ.

### Marker movement versus positional substitution

Marker movement relocates a marker relative to a regenerated background. Positional substitution moves a boundary between source and target patterns. Wave E proved them as distinct.

### Symmetric edge growth versus general insertion

Symmetric edge growth adds at both boundaries. Patterned interior insertion changes internal structure while retaining the previous term as an ordered subsequence.

## Executable proof requirements

The contract-first test must prove:

```text
17 original authority IDs mapped exactly once
13 candidate authority IDs
4 explicit merge groups
0 splits
140 temporary templates preserved
420 deterministic generated spot proofs
420 answer and option proofs
420 lifecycle-lock proofs
one shared proof model inside each merge group
no task removed
no source authority silently dropped
```

Expected merged template counts:

```text
INTERLEAVED_CLUSTER_SERIES:       17
DIRECTIONAL_CONSECUTIVE_CLUSTER:   8
PERIODIC_BLOCK_COMPLETION:         8
POSITION_PERMUTATION_CLUSTER:     17
```

## Policy comparison: 14 versus 13

### Choose 14 when

```text
- permanent QLs intentionally encode common exam pedagogy;
- rotation needs a separately reviewable lifecycle;
- source-backed and saturation-only content must never share one QL;
- analytics cannot reliably preserve permutation subtype;
- the runtime would otherwise force one generic explanation.
```

### Choose 13 when

```text
- permanent QLs represent mathematical solve contracts;
- subtype metadata is first-class and immutable;
- generation weighting is separate from identity;
- specialized renderers and distractors can be selected by subtype;
- source provenance remains attached to every generated question.
```

## Recommendation

**Recommend the 13-authority contract-first candidate**, subject to full manual English review and an implementation proof that subtype metadata survives generation, Question Studio review, Question Bank conversion and analytics.

Reasons:

1. Rotation is not a different mathematical contract from a fixed positional permutation.
2. The 13-authority model avoids using source frequency as identity.
3. It preserves richer subtype analytics than two coarse authorities if subtype metadata is required.
4. Specialized learner explanations remain available.
5. The existing 17-authority and conservative 14-authority models remain useful migration evidence and must not be deleted before freeze.

The recommendation must be rejected if the product architecture cannot guarantee subtype preservation end to end.

## Freeze boundary

```text
Contract-first candidate: EXECUTABLE_PENDING_CI
Policy recommendation:    13 AUTHORITIES
Full manual English review: PENDING
Final authority decision:   PENDING
English discovery freeze:   BLOCKED
Permanent QLs:               0
Question Studio:             disabled
Question Bank:               disabled
CP-008:                     blocked
```

## Next authority

```text
SER_CP007_AUTHORITY_COMPRESSION_14_VS_13_POLICY_DECISION
```
