# SER-CP-007 — Letter-cluster, word-like-block and token-grammar discovery plan

## Status

```text
Checkpoint:                 SER-CP-007
Maturity:                   OPEN_DISCOVERY
Permanent QLs:              0
Question Studio:            disabled
Question Bank:              disabled
Test eligibility:           disabled
Public publication:         disabled
Localization:               not started
```

This checkpoint begins only after explicit approval of the refreshed CP-006 English review. It does not freeze QL counts or solve-mode counts.

## Source-backed scope

The first executable wave is based on recurring forms found in the uploaded reasoning books and SSC papers:

- fixed-length letter groups whose corresponding positions move by fixed jumps;
- fixed-length groups whose position-wise jumps themselves change;
- odd-position and even-position cluster rows;
- groups formed by rotating the same letters;
- word-like groups shortened from the beginning, end or alternating edges;
- consecutive-letter groups whose lengths shrink;
- continuous letter lines completed by a repeated block;
- continuous letter lines completed by two alternating blocks.

Examples such as `BAZ, DBY, ?, HDW`, `ACE, BDF, CEG, ?`, `ABC, PQR, DEF, STU, ?`, alternating edge deletion, and repeated-block fill-in-the-blank questions are treated as source evidence, not as permanent identities.

## Candidate source families

```text
UNIFORM_COLUMN_SHIFTS
MIXED_COLUMN_SHIFTS
PROGRESSIVE_COLUMN_SHIFTS
TWO_INTERLEAVED_CLUSTER_ROWS
CYCLIC_CLUSTER_ROTATION
FIXED_FRONT_DELETION
FIXED_END_DELETION
ALTERNATING_EDGE_DELETION
SHRINKING_CONSECUTIVE_BLOCKS
REPEATED_BLOCK_GAPS
ALTERNATING_BLOCK_GAPS
```

## Provisional authority compression

```text
UNIFORM_COLUMN_SHIFTS
MIXED_COLUMN_SHIFTS
  -> COLUMNWISE_FIXED_CLUSTER_MOVEMENT

PROGRESSIVE_COLUMN_SHIFTS
  -> COLUMNWISE_PROGRESSIVE_CLUSTER_MOVEMENT

TWO_INTERLEAVED_CLUSTER_ROWS
  -> TWO_INTERLEAVED_CLUSTER_SERIES

CYCLIC_CLUSTER_ROTATION
  -> CYCLIC_CLUSTER_PERMUTATION

FIXED_FRONT_DELETION
FIXED_END_DELETION
ALTERNATING_EDGE_DELETION
  -> EDGE_DELETION_WORD_SEQUENCE

SHRINKING_CONSECUTIVE_BLOCKS
  -> VARIABLE_LENGTH_CONSECUTIVE_CLUSTER

REPEATED_BLOCK_GAPS
  -> REPEATED_BLOCK_COMPLETION

ALTERNATING_BLOCK_GAPS
  -> ALTERNATING_BLOCK_COMPLETION
```

These are provisional reasoning authorities. Surface form, operation direction and deletion phase remain parameters unless later evidence proves otherwise.

## Task applicability

Task counts are discovered from mathematical uniqueness rather than forced into one Cartesian grid.

The five invertible fixed-length families support:

```text
NEXT_TERM
MISSING_TERM
PREVIOUS_TERM
WRONG_TERM
```

Deletion and shrinking-length families currently support:

```text
NEXT_TERM
MISSING_TERM
WRONG_TERM
```

`PREVIOUS_TERM` is deliberately excluded because deleted letters are not uniquely recoverable from the shown terms.

Continuous block families support:

```text
FILL_GAPS
```

Their answer is the group of missing letters in left-to-right order.

## Learner presentation contract

Every review item uses:

```text
1, 2, 3, 4
Rule
Solution
Quick Method
Common Mistake
```

A–D option labels are prohibited because answer values are themselves letters and letter groups.

Learner-facing text must not expose internal family names, authority names or taxonomy terms. Explanations use direct instructions such as:

- follow each letter position separately;
- put odd and even groups in separate rows;
- move the first letter to the end;
- remove one letter from the beginning;
- mark the repeating block boundaries.

## Executable proof target

```text
Temporary templates:             34
Source-shaped families:          11
Provisional authorities:          8
Seeds per template:             120
Generated questions:          4,080
Expected answer positions:  1,020 each
Permanent QLs:                    0
```

The audit must prove deterministic replay, four unique options, one correct answer, task-applicability locks, exact answer balance, difficulty reach, numeric labels, plain learner language and lifecycle isolation.

## Deferred evidence

This wave does not claim source saturation. Later CP-007 waves must still audit:

- paired opening/closing letter movement;
- mirror/opposite-letter cluster movement;
- embedded fixed frames around changing inner groups;
- growing groups and inserted-letter grammars;
- multi-blank answers split into two or more groups;
- matching-series and wrong-group answer semantics;
- cross-collision with CP-006 single-letter series;
- cross-collision with COD-001 when an explicit input is transformed;
- cross-collision with ANA-001 and CLS-001;
- Hindi and Punjabi rendering;
- final merge/split decisions and permanent identity allocation.
