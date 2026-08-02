# SER-CP-007 Wave B — Rich cluster grammar and cross-collision plan

## Purpose

Wave B tests richer letter-group surfaces without assuming that every new-looking arrangement deserves a new reasoning authority.

```text
Checkpoint:                 SER-CP-007
Wave:                       B
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
PAIRED_EDGE_SHIFTS
FIXED_OUTER_FRAME_CORE_SHIFT
ALTERNATING_FRAME_CORE_ROWS
GROWING_CONSECUTIVE_BLOCKS
CUMULATIVE_PREFIX_GROWTH
SYMMETRIC_EDGE_GROWTH
REPEATED_BLOCK_MULTI_GAP_GROUPS
ALTERNATING_BLOCK_MULTI_GAP_GROUPS
```

## Expected collision decisions

The first three probes are designed to challenge Wave A rather than inflate the inventory.

```text
PAIRED_EDGE_SHIFTS
FIXED_OUTER_FRAME_CORE_SHIFT
  -> COLUMNWISE_FIXED_CLUSTER_MOVEMENT

ALTERNATING_FRAME_CORE_ROWS
  -> TWO_INTERLEAVED_CLUSTER_SERIES

REPEATED_BLOCK_MULTI_GAP_GROUPS
  -> REPEATED_BLOCK_COMPLETION

ALTERNATING_BLOCK_MULTI_GAP_GROUPS
  -> ALTERNATING_BLOCK_COMPLETION
```

Paired edge movement and a fixed outer frame are still position-wise movement. Zero movement in one or more positions is a parameter, not automatically a new solve mode. Alternating framed groups remain two position rows. Splitting one continuous-pattern answer into several visible gap groups changes the answer renderer, not the repeating-block inference.

## Provisional retained candidates

```text
GROWING_CONSECUTIVE_CLUSTER
CUMULATIVE_PREFIX_CLUSTER
SYMMETRIC_EDGE_GROWTH
```

These candidates require length grammar or insertion/removal reasoning that is not represented by Wave A's fixed-length column movement, rotation, deletion or block completion.

## Task applicability

The first six term-series probes support:

```text
NEXT_TERM
MISSING_TERM
PREVIOUS_TERM
WRONG_TERM
```

The two continuous-pattern probes support:

```text
FILL_GAP_GROUPS
```

For multi-group gap questions, the answer is rendered as ordered groups separated by commas. The same missing letters are also retained as one flat internal sequence for parity checks.

## Cross-chapter ownership gates

Every generated Wave B item must prove the following boundaries:

### CP-006 single-letter series

- every term-series item uses groups of at least two letters;
- the decisive rule concerns group length, multiple positions or inserted edges;
- width-one cases are rejected.

### COD-001 Coding-Decoding

- there is no explicit source-to-code mapping;
- no input word is transformed into an output code;
- the learner infers an autonomous sequence of terms.

### ANA-001 Analogy

- there is no transfer from one completed pair to another pair;
- the answer continues or repairs one sequence.

### CLS-001 Classification

- options are candidate answers to one sequence, not independent objects to classify;
- wrong-term tasks identify a position inside the sequence rather than an odd option group.

## Presentation contract

All learner review output uses:

```text
1, 2, 3, 4
Rule
Solution
Quick Method
Common Mistake
```

A–D option labels, internal authority names and technical taxonomy language are prohibited.

## Executable target

```text
Source probes:                  8
Term-series probes:             6
Continuous-pattern probes:      2
Temporary templates:           26
Seeds per template:           120
Generated questions:        3,120
Answer positions:       780 each
Permanent QLs:                  0
```

## Next boundary

Wave B remains provisional until the executable collision matrix and English review pass.

```text
Next authority after Wave B:
SER_CP007_WAVE_C_SOURCE_SATURATION_AND_ANSWER_SEMANTICS
```
