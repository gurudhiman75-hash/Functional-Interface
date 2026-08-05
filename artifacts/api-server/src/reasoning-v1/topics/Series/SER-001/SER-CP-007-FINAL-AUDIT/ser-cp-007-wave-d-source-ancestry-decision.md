# SER-CP-007 Wave-D source-ancestry decision

## Purpose

This decision classifies the eight Wave-D source-shaped probes after a renewed search of the current uploaded evidence set.

The search distinguishes:

```text
direct autonomous Series ancestry
related transformation evidence owned by another chapter
mathematical saturation coverage without direct Series ancestry
```

A transformation appearing in Analogy, Coding-Decoding or Alphabet Test is not direct ancestry for an autonomous Series solve contract.

## Evidence scope searched

Direct Series sources:

```text
RADIAN-2022, Chapter 6 Series, printed pp. 6-1–6-20
DISHA-VNV, Alpha Series Completion and Miscellaneous Question Bank
```

Related uploaded chapter evidence:

```text
ANA-001 cluster transformation review
COD-001 multi-stage coding review
ALP-001 alphabet/word operation review
```

No direct autonomous Series row was found for the eight probes below in the currently uploaded evidence set.

## Final probe decisions

| Wave-D probe | Canonical authority | Direct Series ancestry | Related cross-chapter evidence | Final disposition | Reason |
|---|---|---:|---|---|---|
| `PAIRWISE_ADJACENT_SWAP_PERMUTATION` | `FIXED_POSITION_PERMUTATION_CLUSTER` | none found | `ANA-001` adjacent-pair exchange; `ALP-001` word pair swap; `COD-001` pair-swap coding stage | `SATURATION_ONLY_SERIES` | The operation is source-backed elsewhere, but no autonomous continuation series was found. |
| `FULL_REVERSAL_PERMUTATION` | `FIXED_POSITION_PERMUTATION_CLUSTER` | none found | `ANA-001` full-cluster reversal | `SATURATION_ONLY_SERIES` | Analogy relation transfer does not establish Series ancestry. |
| `ODD_EVEN_POSITION_REORDERING` | `FIXED_POSITION_PERMUTATION_CLUSTER` | none found | `ANA-001` odd/even regrouping; `ALP-001` full-alphabet even/odd rearrangement | `SATURATION_ONLY_SERIES` | The operation exists, but not as a traced autonomous cluster sequence. |
| `ALPHABET_COMPLEMENT_CLUSTER` | `ALPHABET_COMPLEMENT_CLUSTER_SEQUENCE` | none found | `ANA-001` opposite-alphabet cluster substitution; `ALP-001` opposite-letter operations | `SATURATION_ONLY_SERIES` | Cross-chapter substitution evidence cannot be promoted to Series ancestry. |
| `ALPHABET_COMPLEMENT_WITH_ROTATION` | `ALPHABET_COMPLEMENT_CLUSTER_SEQUENCE` | none found | complement and rotation occur separately in `ANA-001` | `SATURATION_ONLY_SERIES` | No traced source combines them as an autonomous repeated Series rule. |
| `CENTER_INSERTION_GROWTH` | `PATTERNED_INTERIOR_INSERTION_GROWTH` | none found | `ANA-001` bounded letter insertion transformations | `SATURATION_ONLY_SERIES` | A one-pair analogy insertion is not a growing term sequence. |
| `ALTERNATING_INTERIOR_INSERTION_GROWTH` | `PATTERNED_INTERIOR_INSERTION_GROWTH` | none found | `ANA-001` insertion transformations | `SATURATION_ONLY_SERIES` | No traced source repeats alternating interior insertion across a series. |
| `FOUR_INTERLEAVED_CLUSTER_ROWS` | `K_INTERLEAVED_CLUSTER_SERIES` | none found | no close direct cross-chapter source found | `SATURATION_ONLY_SERIES_COLLISION` | It remains a mathematical K-row saturation probe and correctly collapses into the existing K-interleaved authority. |

## Authority-level result

The eight probes do not create eight authorities.

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

The first three authority groups remain provisional mathematical coverage. The four-row probe remains a collision into an existing authority.

## Why these probes remain

`SATURATION_ONLY_SERIES` is not a claim of exam frequency or direct book ancestry. It means:

```text
- the rule is mathematically well-defined;
- deterministic generation and independent validation pass;
- it protects the chapter against a bounded structural gap;
- it is not counted as directly source-backed;
- final permanent-QL decisions must not cite page ancestry that does not exist.
```

Removing the probes would reopen known mathematical gaps. Calling them source-backed would overstate the evidence. The explicit saturation-only label preserves both coverage and traceability honesty.

## Final ancestry state

```text
Wave-D source-shaped probes reviewed:       8
Direct autonomous Series ancestry found:   0
Final SATURATION_ONLY_SERIES decisions:     7
Final SATURATION_ONLY_SERIES_COLLISION:     1
Unresolved Wave-D ancestry decisions:       0
Permanent QLs:                              0
```

## Remaining chapter blocker

```text
Unresolved traced exam record: DISHA-VNV item 195
Mathematical saturation:       PENDING_ITEM_195_RESOLUTION
Source-ledger completeness:    BLOCKED
English discovery freeze:      BLOCKED
CP-008:                        BLOCKED
```

The next authority is:

```text
SER_CP007_ITEM_195_RESOLUTION_AND_SOURCE_LEDGER_CLOSE
```
