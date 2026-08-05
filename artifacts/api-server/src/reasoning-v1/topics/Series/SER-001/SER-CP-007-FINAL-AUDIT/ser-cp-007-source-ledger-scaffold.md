# SER-CP-007 source-to-authority ledger

## Purpose

This ledger records page- or item-level evidence from the uploaded reference files for `SER-CP-007` letter-cluster and continuous-pattern discovery. It distinguishes source-backed authorities from mathematical saturation probes and does not allocate permanent QLs.

No page reference is inferred from memory. A row is marked verified only when the uploaded file exposes the printed page or item identifier together with enough of the question to classify its ownership.

## Reference identity

| Source key | Uploaded file | Bibliographic identity | Relevant source range | Trace state |
|---|---|---|---|---|
| `RADIAN-2022` | `reasoning_aggarwal.pdf` | Preeti Aggarwal and Tanvy Aggarwal, *A New Approach to Reasoning for Competitions*, Radian Book Company, first edition 2022 | Chapter 6, Series, printed pp. `6-1`–`6-20` | opened; first CP-007 tranche mapped |
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

## Authority conclusions from the verified tranche

```text
Source-backed now:
  COLUMNWISE_FIXED_CLUSTER_MOVEMENT
  TWO_INTERLEAVED_CLUSTER_SERIES
  EDGE_DELETION_WORD_SEQUENCE
  REPEATED_BLOCK_COMPLETION

Delegation reaffirmed:
  width-one alphabetic terms -> SER-CP-006

Task semantics directly evidenced:
  NEXT_TERM
  MISSING_TERM
  NEXT_TWO_TERMS
  FILL_GAPS

Answer semantics directly evidenced:
  SINGLE_CLUSTER
  TWO_CLUSTER_LIST
  FLAT_GAP_LETTER_GROUP
```

The verified rows support existing authorities; they do not justify an additional permanent identity. The `TABCT...` example is especially important because it sources both interleaved cluster reasoning and a two-cluster ordered answer without turning the fixed outer frame into a separate authority.

## Recorded discovery examples still awaiting exact page attachment

| Example shape | Current authority | Disposition | Evidence state |
|---|---|---|---|
| alternating two repeated blocks with blanks | `ALTERNATING_BLOCK_COMPLETION` | separate odd and even blocks | source pages found; exact item-to-answer mapping pending |
| shrinking consecutive-letter groups | `VARIABLE_LENGTH_CONSECUTIVE_CLUSTER` | length decreases by one | structure executable; exact source row pending |
| growing consecutive-letter groups | `GROWING_CONSECUTIVE_CLUSTER` | length increases by one | mathematical saturation recorded; exact source row pending |
| fixed cluster rotation | `CYCLIC_CLUSTER_PERMUTATION` | rotate one cluster through fixed positions | executable source-shaped family; exact page row pending |
| progressive movement by corresponding positions | `COLUMNWISE_PROGRESSIVE_CLUSTER_MOVEMENT` | position steps change regularly | executable source-shaped family; exact page row pending |

## Structural saturation probes without attached page trace

The following Wave D probes were introduced to close mathematical gaps identified by the chapter audit. They are executable saturation probes, not yet claimed as directly source-backed:

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

Their mathematical coverage remains valid, but final source status requires either a traceable exam/book example or an explicit `SATURATION_ONLY` disposition at freeze.

## Delegated surfaces

| Surface | Owner | Reason |
|---|---|---|
| single-letter terms | `SER-CP-006` | every term contains one letter |
| explicit group-to-code transformation | `COD-001` | input is converted into an output code |
| relation transfer between cluster pairs | `ANA-001` | one pair teaches the relation for another pair |
| classification of independent option series | `CLS-001` | task is odd-one-out/classification, not continuation |
| mixed letter-number cluster series | `SER-CP-008` candidate boundary | token grammar is not purely alphabetic |

## Remaining source-ledger work

1. Split `RADIAN-2022` items 133–141 into exact stem-level records.
2. Reopen the answer keys for the Disha continuous-pattern items and decide repeated versus alternating block ownership.
3. Trace source rows for rotation, variable-length consecutive clusters, progressive column movement, cumulative prefix and symmetric growth.
4. Inspect the remaining uploaded reasoning references for complement, insertion and fixed-permutation examples.
5. Record every uncovered shape as a new gap, delegated surface, ambiguity rejection or explicit saturation-only authority.
6. Run full English question and explanation review only after the source ledger stops changing.

## Freeze state

```text
Traceability pass:          IN_PROGRESS
Verified source records:    9 covered/delegated
Pending traced records:     3 grouped or classification-pending
Ledger completeness:       BLOCKED
Page-level traceability:   BLOCKED
English discovery freeze:  BLOCKED
Permanent QLs:             0
CP-008:                    BLOCKED
```

`SER_CP007_FINAL_SOURCE_LEDGER_AND_ENGLISH_FREEZE_REVIEW` remains the active authority. The first traceability tranche is committed, but the chapter must not be frozen until the remaining records and saturation-only decisions are resolved.
