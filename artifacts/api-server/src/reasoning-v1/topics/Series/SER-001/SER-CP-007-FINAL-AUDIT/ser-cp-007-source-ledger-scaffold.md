# SER-CP-007 source-to-authority ledger

## Purpose

This ledger records page- or item-level evidence from the uploaded reference files for `SER-CP-007` letter-cluster and continuous-pattern discovery. It distinguishes covered authorities, delegated surfaces, unresolved classifications, mathematical saturation probes and newly discovered source gaps. It does not allocate permanent QLs.

No page reference is inferred from memory. A row is marked verified only when the uploaded file exposes the printed page or item identifier together with enough of the question to classify its ownership.

## Reference identity

| Source key | Uploaded file | Bibliographic identity | Relevant source range | Trace state |
|---|---|---|---|---|
| `RADIAN-2022` | `reasoning_aggarwal.pdf` | Preeti Aggarwal and Tanvy Aggarwal, *A New Approach to Reasoning for Competitions*, Radian Book Company, first edition 2022 | Chapter 6, Series, printed pp. `6-1`–`6-20` | opened; two CP-007 tranches mapped |
| `DISHA-VNV` | `reasoning book.pdf` | Gajendra Kumar and Abhishek Banerjee, *Verbal & Non-Verbal Reasoning for Competitive Exams with Practice Sets*, Disha Publication | Alpha Series Completion, printed pp. `15`–`26`; Miscellaneous Question Bank | opened; first CP-007 tranche mapped |

## Verified source-to-authority records

| Record | Source location | Faithful short identifier | Authority or owner | Task direction | Answer semantic | Disposition | Notes |
|---|---|---|---|---|---|---|---|
| `SER-SRC-007-001` | `RADIAN-2022`, printed p. `6-4`, Example 34 | `BAZ, DBY, ?, HDW` → `FCX` | `COLUMNWISE_FIXED_CLUSTER_MOVEMENT` | `MISSING_TERM` | `SINGLE_CLUSTER` | `COVERED` | Corresponding positions move by fixed signed steps; this is the exact source-shaped example already named in CP-007 discovery. |
| `SER-SRC-007-002` | `RADIAN-2022`, printed p. `6-4`, Example 35 | `TABCT, TZYXT, TBCDT, TYXWT, ?, ?` | `TWO_INTERLEAVED_CLUSTER_SERIES` | `NEXT_TWO_TERMS` | `TWO_CLUSTER_LIST` | `COVERED` | Odd and even term rows progress independently. Fixed outer `T` characters are presentation structure, not a new authority. |
| `SER-SRC-007-003` | `RADIAN-2022`, printed p. `6-4`, Example 36 | `B, C, O, D, E, P, F, G, Q, ?, ?, ?` | `SER-CP-006` | `NEXT_THREE_TERMS` | `THREE_SINGLE_LETTERS` | `DELEGATED` | Every displayed term has width one; CP-007 must not duplicate single-letter series ownership. |
| `SER-SRC-007-004` | `RADIAN-2022`, printed p. `6-4`, Example 37 | `REGULAR, EGULAR, EGULA, ?` → `GULA` | `EDGE_DELETION_WORD_SEQUENCE` | `NEXT_TERM` | `SINGLE_CLUSTER` | `COVERED` | Beginning and end deletion alternate. Deletion side/order remains an instance parameter. |
| `SER-SRC-007-005` | `RADIAN-2022`, printed pp. `6-4`–`6-5`, Example 38 | `a b _ _ _ b a b a` completed by repeating `ab` | `REPEATED_BLOCK_COMPLETION` | `FILL_GAPS` | `FLAT_GAP_LETTER_GROUP` | `COVERED` | Repeated-block completion is directly source-backed; the blanks are answer positions rather than separate solve authorities. |
| `SER-SRC-007-006` | `DISHA-VNV`, printed p. `15`, Example 1 | `A, D, G, J, M, ?` | `SER-CP-006` | `NEXT_TERM` | `SINGLE_LETTER` | `DELEGATED` | The source itself introduces Alpha Series with a width-one `+3` sequence. |
| `SER-SRC-007-007` | `DISHA-VNV`, printed p. `23`, answer explanation for item 12 | successive terms remove one letter from each end; answer `PENDICU` | `EDGE_DELETION_WORD_SEQUENCE` | `MISSING_TERM` | `SINGLE_CLUSTER` | `COVERED` | Both-edge shrinking is represented by the same deletion authority; it does not require a word-specific QL. |
| `SER-SRC-007-008` | `DISHA-VNV`, Miscellaneous Question Bank p. `QB-7`, item 166 | `ACE, BDF, CEG, ?` | `COLUMNWISE_FIXED_CLUSTER_MOVEMENT` | `NEXT_TERM` | `SINGLE_CLUSTER` | `COVERED` | Each corresponding letter position advances uniformly. |
| `SER-SRC-007-009` | `DISHA-VNV`, Miscellaneous Question Bank p. `QB-7`, item 167 | `ABC, PQR, DEF, STU, ?` | `TWO_INTERLEAVED_CLUSTER_SERIES` | `NEXT_TERM` | `SINGLE_CLUSTER` | `COVERED` | Odd terms and even terms form independent consecutive-cluster rows. |
| `SER-SRC-007-010` | `DISHA-VNV`, Miscellaneous Question Bank p. `QB-7`, items 169–170 | continuous letter lines with multiple blanks | `REPEATED_BLOCK_COMPLETION` or `ALTERNATING_BLOCK_COMPLETION` | `FILL_GAPS` | `FLAT_GAP_LETTER_GROUP` | `CLASSIFICATION_PENDING` | Page and item trace are verified, but the answer-key structure must be reopened before selecting the canonical block authority. |
| `SER-SRC-007-011` | `DISHA-VNV`, Miscellaneous Question Bank p. `QB-8`, item 188 and items 195–197 | continuous-pattern letter lines with several gaps | `REPEATED_BLOCK_COMPLETION` or `ALTERNATING_BLOCK_COMPLETION` | `FILL_GAPS` | `FLAT_GAP_LETTER_GROUP` | `CLASSIFICATION_PENDING` | These are source-backed task surfaces; exact block segmentation and answer order remain to be attached. |
| `SER-SRC-007-012` | `RADIAN-2022`, printed p. `6-17`, items 133–141 | multi-letter cluster completion set; item 133 explicitly separates odd/even rows | `TWO_INTERLEAVED_CLUSTER_SERIES` plus other existing cluster authorities | mixed completion tasks | mixed cluster answers | `STEM_EXTRACTION_PENDING` | The page and answer range are verified. Exact stems must be attached one by one before this row can be split into final records. |
| `SER-SRC-007-013` | `RADIAN-2022`, printed p. `6-12`, item 228 | `CCABABAB, ACCBABAB, ABCCABAB, ABACCBAB, ABABCCAB, ?` | candidate `MARKER_BLOCK_POSITION_SHIFT_OVER_PERIODIC_FRAME` | `NEXT_TERM` | `SINGLE_CLUSTER` | `NEW_GAP` | The `CC` marker block moves one position right while the exposed positions retain the recurring `AB` background. This is not a whole-token rotation or one fixed permutation applied repeatedly. |
| `SER-SRC-007-014` | `RADIAN-2022`, printed p. `6-12`, item 229 | `ABCABABAB, ABABCABAB, ABABABCAB, ABABABABC, ACBABABAB, ?` | candidate `MARKER_BLOCK_POSITION_SHIFT_OVER_PERIODIC_FRAME` | `NEXT_TERM` | `SINGLE_CLUSTER` | `NEW_GAP` | A single `C` marker advances by two positions and wraps through a recurring `AB` frame. Shift size and wrap are instance properties. |
| `SER-SRC-007-015` | `RADIAN-2022`, printed p. `6-12`, item 230 | `PQPQPQPQ, RQPQPQPQ, RSPQPQPQ, RSRQPQPQ, RSRSPQPQ, ?` | candidate `PROGRESSIVE_POSITIONAL_SUBSTITUTION` | `NEXT_TERM` | `SINGLE_CLUSTER` | `NEW_GAP` | One additional left-to-right position is converted from the `PQ` source pattern into the `RS` target pattern at every step. |
| `SER-SRC-007-016` | `RADIAN-2022`, printed p. `6-12`, item 231 | `XXXXXXx, XXXXXxX, XXXXxXX, XXXxXXX, XXxXXXX, ?` | candidate `MARKER_BLOCK_POSITION_SHIFT_OVER_PERIODIC_FRAME` | `NEXT_TERM` | `SINGLE_CLUSTER` | `NEW_GAP` | A lowercase `x` marker moves left one position through an uppercase `X` frame. Letter case must be preserved as a meaningful token state. |
| `SER-SRC-007-017` | `RADIAN-2022`, printed p. `6-12`, item 232 | `PQPPPPQ, PPQPPPPQ, PPPQPPPQ, PPPPQPPQ, PPPPPQPQ, ?` | candidate `MARKER_BLOCK_POSITION_SHIFT_OVER_PERIODIC_FRAME` | `NEXT_TERM` | `SINGLE_CLUSTER` | `NEW_GAP` | The interior `Q` marker moves one position right through a fixed-width `P` frame while the terminal `Q` remains fixed. |
| `SER-SRC-007-018` | `RADIAN-2022`, printed p. `6-12`, item 233 | `YXZYXYXY, YXYXZYXY, YXYXYXZY, YZXYXYXY, YXYZXYXY, ?` | candidate `MARKER_BLOCK_POSITION_SHIFT_OVER_PERIODIC_FRAME` | `NEXT_TERM` | `SINGLE_CLUSTER` | `NEW_GAP` | A `Z` marker advances by two positions through the periodic `YX` frame and wraps after reaching the right edge. |
| `SER-SRC-007-019` | `RADIAN-2022`, printed p. `6-12`, item 234 | `ABCABcABC, ABCAbCABC, ABCaBCABC, ABcABCABC, AbCABCABC, ?` | candidate `MARKER_BLOCK_POSITION_SHIFT_OVER_PERIODIC_FRAME` | `NEXT_TERM` | `SINGLE_CLUSTER` | `NEW_GAP` | The lowercase-state marker moves left through an otherwise uppercase recurring frame. Case sensitivity is representation data, not by itself a new solve authority. |
| `SER-SRC-007-020` | `RADIAN-2022`, printed p. `6-12`, item 235 | `abaBABAB, AbabABAB, ABabaBAB, ABAbabAB, ABABabaB, ?` | candidate `MARKER_BLOCK_POSITION_SHIFT_OVER_PERIODIC_FRAME` | `NEXT_TERM` | `SINGLE_CLUSTER` | `NEW_GAP` | A multi-letter lowercase marker block moves right through an uppercase periodic background. Marker width is an instance property. |
| `SER-SRC-007-021` | `RADIAN-2022`, printed p. `6-12`, item 236 | `CDCDCBAB, CDCDABAB, CDCBABAB, CDABABAB, CBABABAB, ?` | candidate `PROGRESSIVE_POSITIONAL_SUBSTITUTION` | `NEXT_TERM` | `SINGLE_CLUSTER` | `NEW_GAP` | The boundary between the source pattern `CD` and target pattern `AB` moves left one position at each step until the target frame fills the term. |
| `SER-SRC-007-022` | `RADIAN-2022`, printed p. `6-20`, solution notes for items 221, 222, 225 and 227 | fixed-step `Z`/`R` marker movement, progressive `X→Y` replacement and moving lowercase state | the same two Wave-E candidate authorities | `NEXT_TERM` | `SINGLE_CLUSTER` | `STEM_EXTRACTION_PENDING` | The printed solutions corroborate both candidate families, but their complete question stems must still be attached before final row-level traceability. |

## Authority conclusions from the traced sources

```text
Existing authorities directly source-backed:
  COLUMNWISE_FIXED_CLUSTER_MOVEMENT
  TWO_INTERLEAVED_CLUSTER_SERIES
  EDGE_DELETION_WORD_SEQUENCE
  REPEATED_BLOCK_COMPLETION

Delegation reaffirmed:
  width-one alphabetic terms -> SER-CP-006

New source-backed candidate authorities:
  MARKER_BLOCK_POSITION_SHIFT_OVER_PERIODIC_FRAME
  PROGRESSIVE_POSITIONAL_SUBSTITUTION
```

The first tranche supported the existing inventory without adding an authority. The second tranche does not.

The marker-series examples cannot be generated by the current `CYCLIC_CLUSTER_PERMUTATION`, which rotates the whole displayed token, or by `FIXED_POSITION_PERMUTATION_CLUSTER`, which repeats one unchanged positional permutation at every step. They instead move a marker relative to a regenerated fixed or periodic background. The substitution examples change one additional position from a source pattern to a target pattern at each step while keeping the term width fixed.

Case, marker width, direction, shift size, wrap behaviour, fixed edge markers and source/target background periods remain instance properties unless executable collision proof shows otherwise.

## Saturation decision

```text
Previous mathematical status: PROVISIONALLY_COMPLETE
Source-ledger result:          MEANINGFUL_UNCOVERED_MODES_FOUND
Mathematical saturation:      REOPENED_BY_SOURCE_LEDGER
English freeze:               PROHIBITED
```

The previous Wave-D result correctly saturated the structural inventory then under test. It is superseded as a freeze claim by the newly traced source evidence. This is the intended purpose of the source ledger: source evidence outranks an incomplete synthetic inventory.

## Recorded discovery examples still awaiting exact page attachment

| Example shape | Current authority | Disposition | Evidence state |
|---|---|---|---|
| alternating two repeated blocks with blanks | `ALTERNATING_BLOCK_COMPLETION` | separate odd and even blocks | source pages found; exact item-to-answer mapping pending |
| shrinking consecutive-letter groups | `VARIABLE_LENGTH_CONSECUTIVE_CLUSTER` | length decreases by one | structure executable; exact source row pending |
| growing consecutive-letter groups | `GROWING_CONSECUTIVE_CLUSTER` | length increases by one | executable saturation recorded; exact source row pending |
| whole-cluster rotation | `CYCLIC_CLUSTER_PERMUTATION` | rotate the entire displayed cluster through fixed positions | executable source-shaped family; exact page row pending |
| progressive movement by corresponding positions | `COLUMNWISE_PROGRESSIVE_CLUSTER_MOVEMENT` | position values change regularly | executable source-shaped family; exact page row pending |

## Structural saturation probes without attached page trace

The following Wave D probes remain executable coverage probes. They are not yet claimed as directly source-backed:

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

Their individual mathematical coverage remains valid, but final source status requires either a traceable exam/book example or an explicit `SATURATION_ONLY` disposition at freeze.

## Delegated surfaces

| Surface | Owner | Reason |
|---|---|---|
| single-letter terms | `SER-CP-006` | every term contains one letter |
| explicit group-to-code transformation | `COD-001` | input is converted into an output code |
| relation transfer between cluster pairs | `ANA-001` | one pair teaches the relation for another pair |
| classification of independent option series | `CLS-001` | task is odd-one-out/classification, not continuation |
| mixed letter-number cluster series | `SER-CP-008` candidate boundary | token grammar is not purely alphabetic |

## Required Wave-E discovery

1. Implement source-shaped probes for single-marker, multi-marker and marker-block movement over fixed or periodic backgrounds.
2. Include both left and right movement, multiple step sizes, wrap and non-wrap domains, fixed edge markers and case-sensitive marker states.
3. Implement progressive positional substitution between two bounded periodic patterns.
4. Prove collisions against whole-token rotation, fixed positional permutation, column-wise shifts, edge deletion and cumulative-prefix growth.
5. Test next, missing, previous and wrong-term directions only where hidden material remains uniquely recoverable.
6. Require independent solving, complete-pool ambiguity rejection, misconception-specific options and natural English explanations.
7. Return to page-level source tracing after Wave E to determine whether another meaningful mode remains.

## Remaining source-ledger work

1. Split `RADIAN-2022` items 133–141 into exact stem-level records.
2. Attach complete stems for Radian items 221, 222, 225 and 227.
3. Reopen the answer keys for the Disha continuous-pattern items and decide repeated versus alternating block ownership.
4. Trace source rows for whole-cluster rotation, variable-length consecutive clusters, progressive column movement, cumulative prefix and symmetric growth.
5. Inspect the remaining uploaded reasoning references for complement, insertion and fixed-permutation examples.
6. Record every uncovered shape as a new gap, delegated surface, ambiguity rejection or explicit saturation-only authority.
7. Run full English question and explanation review only after Wave E and the renewed source ledger stop changing.

## Freeze state

```text
Traceability pass:          IN_PROGRESS
Verified source records:    18 covered/delegated/new-gap
Pending traced records:     4 grouped or stem/classification-pending
Meaningful uncovered modes: 2 candidate authorities
Mathematical saturation:    REOPENED_BY_SOURCE_LEDGER
Ledger completeness:       BLOCKED
Page-level traceability:   BLOCKED
English discovery freeze:  BLOCKED
Permanent QLs:             0
CP-008:                    BLOCKED
```

Next authority:

```text
SER_CP007_WAVE_E_MOVING_MARKER_AND_POSITIONAL_SUBSTITUTION_DISCOVERY
```
