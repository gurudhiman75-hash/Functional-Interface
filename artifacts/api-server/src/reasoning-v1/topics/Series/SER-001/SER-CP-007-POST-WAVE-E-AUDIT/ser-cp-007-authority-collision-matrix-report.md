# SER-CP-007 post-Wave-E authority collision audit

## Scope

This audit compares the complete five-wave `SER-CP-007` authority pool after Wave E. It is a retained-contract and generated-structure audit, not a claim that every imaginable finite sequence has been enumerated.

The audit asks four questions:

1. Does every temporary template map to exactly one canonical authority?
2. Are the 17 retained authority contracts structurally distinct?
3. Are known source-shaped collisions explicitly registered instead of duplicated?
4. Do generated samples agree with the declared surface and width behaviour while all lifecycle locks remain closed?

## Authority pool

```text
Retained provisional authorities: 17
Pairwise off-diagonal comparisons: 136
Unresolved contract collisions:     0
Temporary templates:              140
Generated structural spot proofs: 420
Declared source-shape collisions:  20
Permanent QLs:                      0
```

Each authority is represented by an independently written contract across:

```text
surface
width behaviour
change axis
partition model
state model
recovery model
```

No two retained authorities have the same complete contract vector.

## Important distinctions preserved

```text
COLUMNWISE_FIXED_CLUSTER_MOVEMENT
  != COLUMNWISE_PROGRESSIVE_CLUSTER_MOVEMENT
```

Both change corresponding letter positions, but one repeats a fixed signed step vector while the other changes the step vector regularly.

```text
TWO_INTERLEAVED_CLUSTER_SERIES
  != K_INTERLEAVED_CLUSTER_SERIES
```

The first owns exactly two position rows. The second owns three or more independent rows.

```text
CYCLIC_CLUSTER_PERMUTATION
  != FIXED_POSITION_PERMUTATION_CLUSTER
```

Cyclic rotation is a constrained positional permutation. The general fixed-permutation authority owns non-rotational repeated orderings.

```text
MARKER_BLOCK_POSITION_SHIFT_OVER_PERIODIC_FRAME
  != CYCLIC_CLUSTER_PERMUTATION
```

The retained marker authority regenerates a fixed or periodic background around a moving marker. The one uniform `X/x` surface that also equals whole-cluster rotation is explicitly collapsed into the cyclic authority.

```text
PROGRESSIVE_POSITIONAL_SUBSTITUTION
  != PATTERNED_INTERIOR_INSERTION_GROWTH
```

Positional substitution keeps width fixed and changes existing positions across a moving source/target boundary. Interior insertion increases term length.

```text
REPEATED_BLOCK_COMPLETION
  != ALTERNATING_BLOCK_COMPLETION
```

Both use continuous blank lines, but one reconstructs one periodic block while the other separates two alternating blocks.

## Declared collisions

The executable registry verifies 20 source-shaped collisions, including:

```text
UNIFORM_COLUMN_SHIFTS
MIXED_COLUMN_SHIFTS
PAIRED_EDGE_SHIFTS
FIXED_OUTER_FRAME_CORE_SHIFT
  -> existing column-wise fixed movement authority

FIXED_FRONT_DELETION
FIXED_END_DELETION
ALTERNATING_EDGE_DELETION
  -> one edge-deletion authority

ALTERNATING_FRAME_CORE_ROWS
NEXT_TWO_INTERLEAVED_ROWS
  -> two interleaved rows

FOUR_INTERLEAVED_CLUSTER_ROWS
  -> K interleaved rows

UNIFORM_FRAME_CASE_MARKER_ROTATION
  -> cyclic cluster permutation
```

A source shape may change presentation, answer grouping or task direction without creating a new solve contract.

## Generated proof

Three deterministic samples are regenerated for every one of the 140 temporary templates.

For all 420 samples, the audit checks:

```text
canonical authority agrees with template registry
four unique options exist
correct answer occupies the declared position
observed width mode agrees with the authority contract
all lifecycle locks remain false
permanent QL remains null
```

Observed width classes are:

```text
FIXED
GROWING
SHRINKING
GAP_LINE
```

This catches high-risk false merges such as fixed-width substitution into insertion growth, or shrinking edge deletion into fixed-width permutation.

## Result

```text
Status: PASS_SER_CP007_POST_WAVE_E_17_AUTHORITY_COLLISION_MATRIX
Unresolved retained-contract collisions: 0
Ambiguous source-rule mappings:          0
Permanent QLs:                            0
```

The collision audit is complete for the current 17-authority inventory. This does not complete the source ledger. Exact remaining Radian and Disha records must still be attached before English freeze.

## Next authority

```text
SER_CP007_POST_WAVE_E_SOURCE_LEDGER_COMPLETION
```
