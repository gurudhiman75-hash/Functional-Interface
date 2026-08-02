# SER-CP-007 Wave D — Permutation, complement, insertion and k-row saturation

## Purpose

Wave D targets the four unresolved mathematical blockers from the chapter-wide audit. It does not claim final source-ledger completion and does not allocate permanent QLs.

```text
Checkpoint:                 SER-CP-007
Wave:                       D
Maturity:                   OPEN_DISCOVERY
Permanent QLs:              0
Question Studio:            disabled
Question Bank:              disabled
Test eligibility:           disabled
Public publication:         disabled
Localization:               not started
```

## Source-shaped probes

```text
PAIRWISE_ADJACENT_SWAP_PERMUTATION
FULL_REVERSAL_PERMUTATION
ODD_EVEN_POSITION_REORDERING
ALPHABET_COMPLEMENT_CLUSTER
ALPHABET_COMPLEMENT_WITH_ROTATION
CENTER_INSERTION_GROWTH
ALTERNATING_INTERIOR_INSERTION_GROWTH
FOUR_INTERLEAVED_CLUSTER_ROWS
```

Each probe supports:

```text
NEXT_TERM
MISSING_TERM
PREVIOUS_TERM
WRONG_TERM
```

## Expected authority decisions

```text
PAIRWISE_ADJACENT_SWAP_PERMUTATION
FULL_REVERSAL_PERMUTATION
ODD_EVEN_POSITION_REORDERING
  -> FIXED_POSITION_PERMUTATION_CLUSTER

ALPHABET_COMPLEMENT_CLUSTER
ALPHABET_COMPLEMENT_WITH_ROTATION
  -> ALPHABET_COMPLEMENT_CLUSTER_SEQUENCE

CENTER_INSERTION_GROWTH
ALTERNATING_INTERIOR_INSERTION_GROWTH
  -> PATTERNED_INTERIOR_INSERTION_GROWTH

FOUR_INTERLEAVED_CLUSTER_ROWS
  -> K_INTERLEAVED_CLUSTER_SERIES
```

The first three authority groups remain provisional. Four-row interleaving is expected to collide with the k-row authority introduced in Wave C.

## Structural proof requirements

### Fixed permutations

- Every term contains the same letters.
- The next term equals the declared position permutation of the current term.
- Pair swap, reversal and odd/even reorder remain parameters of one permutation authority unless the audit disproves this.

### Alphabet complement

- Every transformed letter follows `A ↔ Z`, `B ↔ Y`, ..., `M ↔ N`.
- The rotation variant must prove complement first and rotation second.
- It must not be misreported as a fixed additive shift.

### Interior insertion

- Existing letters remain in the same order.
- Exactly one new letter is inserted at each step.
- The insertion place follows the declared centre or alternating-centre rule.

### Four-row interleaving

- Positions `1,5,9...`, `2,6,10...`, `3,7,11...` and `4,8,12...` form four independent rows.
- Each row has fixed column movement.
- A successful result merges into `K_INTERLEAVED_CLUSTER_SERIES`; it does not create a separate four-row QL.

## Presentation contract

All visible choices use `1–4`. Explanations use direct classroom wording and the headings `Rule`, `Solution`, `Quick Method`, `Common Mistake`.

## Executable target

```text
Source probes:                  8
Temporary templates:           32
Seeds per template:           120
Generated questions:        3,840
Answer positions:       960 each
Expected retained questions: 3,360
Expected collision questions:  480
Permanent QLs:                  0
```

## Remaining non-mathematical gate

Even after Wave D, final English discovery freeze requires a source-to-authority ledger with page-level or item-level dispositions for the uploaded references.

## Next authority

```text
SER_CP007_FINAL_SOURCE_LEDGER_AND_ENGLISH_FREEZE_REVIEW
```
