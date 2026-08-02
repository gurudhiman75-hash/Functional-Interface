# SER-CP-007 Wave C — Source saturation and answer-semantics plan

## Purpose

Wave C tests whether richer answer formats or multi-row surfaces require new reasoning authorities. It also records explicit delegation boundaries for Coding-Decoding, Analogy, Classification and CP-006 single-letter series.

```text
Checkpoint:                 SER-CP-007
Wave:                       C
Maturity:                   OPEN_DISCOVERY
Permanent QLs:              0
Question Studio:            disabled
Question Bank:              disabled
Test eligibility:           disabled
Public publication:         disabled
Localization:               not started
```

## Executable source probes

```text
THREE_INTERLEAVED_CLUSTER_ROWS
NEXT_TWO_COLUMNWISE_FIXED
NEXT_TWO_INTERLEAVED_ROWS
NEXT_TWO_ROTATION
NEXT_TWO_EDGE_DELETION
MISSING_TWO_COLUMNWISE_FIXED
WRONG_WITH_REPLACEMENT_PAIR
NEXT_TWO_GROWING_CLUSTER
NEXT_TWO_SYMMETRIC_GROWTH
```

`THREE_INTERLEAVED_CLUSTER_ROWS` carries the four ordinary series tasks. Every other probe exists to test a distinct answer renderer or source-backed task direction.

## Task and answer semantics

```text
NEXT_TERM                 -> one cluster
MISSING_TERM              -> one cluster
PREVIOUS_TERM             -> one cluster
WRONG_TERM                -> one replacement cluster
NEXT_TWO_TERMS            -> two clusters in sequence order
MISSING_TWO_TERMS         -> two missing clusters in left-to-right order
WRONG_AND_REPLACEMENT     -> displayed wrong cluster → correct replacement
```

Multiple returned values are answer semantics. They do not create a new reasoning authority when the underlying series rule is already represented.

## Expected collision decisions

```text
NEXT_TWO_COLUMNWISE_FIXED
MISSING_TWO_COLUMNWISE_FIXED
WRONG_WITH_REPLACEMENT_PAIR
  -> COLUMNWISE_FIXED_CLUSTER_MOVEMENT

NEXT_TWO_INTERLEAVED_ROWS
  -> TWO_INTERLEAVED_CLUSTER_SERIES

NEXT_TWO_ROTATION
  -> CYCLIC_CLUSTER_PERMUTATION

NEXT_TWO_EDGE_DELETION
  -> EDGE_DELETION_WORD_SEQUENCE

NEXT_TWO_GROWING_CLUSTER
  -> GROWING_CONSECUTIVE_CLUSTER

NEXT_TWO_SYMMETRIC_GROWTH
  -> SYMMETRIC_EDGE_GROWTH
```

## Provisional retained candidate

```text
THREE_INTERLEAVED_CLUSTER_ROWS
  -> K_INTERLEAVED_CLUSTER_SERIES
```

This candidate is retained provisionally because solving it requires separating positions into three rows rather than the two rows already represented in Wave A. Wave C must prove that this is not merely a fixed-column surface.

## Explicit chapter exclusions

The following surfaces are documented but not generated as CP-007 question families:

```text
MATCHING_SERIES_OPTION_SET
  -> CLS-001 when the task is to classify independent option series

EXPLICIT_INPUT_OUTPUT_CLUSTER_TRANSFORM
  -> COD-001 when a supplied group is converted into a code

CLUSTER_PAIR_RELATION_TRANSFER
  -> ANA-001 when a relation from one pair is applied to another pair

WIDTH_ONE_MULTI_ANSWER_SERIES
  -> SER-CP-006 when every term is a single letter
```

## Learner presentation

Every review item uses numeric choices `1–4` and the headings `Rule`, `Solution`, `Quick Method`, `Common Mistake`.

For grouped answers:

```text
Two terms:          ABC, DEF
Wrong/replacement:  ABC → ABD
```

A–D labels and internal taxonomy terms are prohibited.

## Executable target

```text
Executable source probes:       9
Temporary templates:           12
Seeds per template:           120
Generated questions:        1,440
Answer positions:       360 each
Permanent QLs:                  0
```

Expected ownership split:

```text
Existing CP-007 authority:    960
New provisional candidate:    480
```

## Next boundary

After Wave C, CP-007 must receive a chapter-wide source-saturation, collision and editorial gap audit before any QL freeze proposal.

```text
Next authority:
SER_CP007_CHAPTER_WIDE_GAP_AUDIT_AND_FREEZE_PROPOSAL
```
