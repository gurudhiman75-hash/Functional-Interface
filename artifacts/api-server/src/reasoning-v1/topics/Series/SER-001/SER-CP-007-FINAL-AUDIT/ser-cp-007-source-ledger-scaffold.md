# SER-CP-007 source-to-authority ledger

## Purpose

This ledger records page- or item-level evidence from the uploaded reference files for `SER-CP-007` letter-cluster and continuous-pattern discovery. It distinguishes covered authorities, delegated surfaces, unresolved classifications, mathematical saturation probes and source gaps closed by executable discovery. It does not allocate permanent QLs.

No page reference is inferred from memory. A row is marked verified only when the source exposes the printed page or item identifier together with enough of the question or printed solution to classify its ownership. Independently reconstructed blank strings are labelled as such.

## Reference identity

| Source key | Uploaded file | Bibliographic identity | Relevant source range | Trace state |
|---|---|---|---|---|
| `RADIAN-2022` | `reasoning_aggarwal.pdf` | Preeti Aggarwal and Tanvy Aggarwal, *A New Approach to Reasoning for Competitions*, Radian Book Company, first edition 2022 | Chapter 6, Series, printed pp. `6-1`–`6-20` | opened; three CP-007 tranches mapped |
| `DISHA-VNV` | `reasoning book.pdf` | Gajendra Kumar and Abhishek Banerjee, *Verbal & Non-Verbal Reasoning for Competitive Exams with Practice Sets*, Disha Publication | Alpha Series Completion, printed pp. `15`–`26`; Miscellaneous Question Bank pp. `QB-7`–`QB-8` | opened; two CP-007 tranches mapped |

## Verified source-to-authority records

| Record | Source location | Faithful short identifier | Authority or owner | Task direction | Answer semantic | Disposition | Notes |
|---|---|---|---|---|---|---|---|
| `SER-SRC-007-001` | `RADIAN-2022`, printed p. `6-4`, Example 34 | `BAZ, DBY, ?, HDW` → `FCX` | `COLUMNWISE_FIXED_CLUSTER_MOVEMENT` | `MISSING_TERM` | `SINGLE_CLUSTER` | `COVERED` | Corresponding positions move by fixed signed steps. |
| `SER-SRC-007-002` | `RADIAN-2022`, printed p. `6-4`, Example 35 | `TABCT, TZYXT, TBCDT, TYXWT, ?, ?` | `TWO_INTERLEAVED_CLUSTER_SERIES` | `NEXT_TWO_TERMS` | `TWO_CLUSTER_LIST` | `COVERED` | Odd and even term rows progress independently. Fixed outer `T` characters are presentation structure. |
| `SER-SRC-007-003` | `RADIAN-2022`, printed p. `6-4`, Example 36 | `B, C, O, D, E, P, F, G, Q, ?, ?, ?` | `SER-CP-006` | `NEXT_THREE_TERMS` | `THREE_SINGLE_LETTERS` | `DELEGATED` | Every displayed term has width one. |
| `SER-SRC-007-004` | `RADIAN-2022`, printed p. `6-4`, Example 37 | `REGULAR, EGULAR, EGULA, ?` → `GULA` | `EDGE_DELETION_WORD_SEQUENCE` | `NEXT_TERM` | `SINGLE_CLUSTER` | `COVERED` | Beginning and end deletion alternate. |
| `SER-SRC-007-005` | `RADIAN-2022`, printed pp. `6-4`–`6-5`, Example 38 | `a b _ _ _ b a b a` completed by repeating `ab` | `REPEATED_BLOCK_COMPLETION` | `FILL_GAPS` | `FLAT_GAP_LETTER_GROUP` | `COVERED` | The blanks are answer positions, not separate solve authorities. |
| `SER-SRC-007-006` | `DISHA-VNV`, printed p. `15`, Example 1 | `A, D, G, J, M, ?` | `SER-CP-006` | `NEXT_TERM` | `SINGLE_LETTER` | `DELEGATED` | The source introduces Alpha Series with a width-one `+3` sequence. |
| `SER-SRC-007-007` | `DISHA-VNV`, printed p. `23`, answer explanation for item 12 | successive terms remove one letter from each end; answer `PENDICU` | `EDGE_DELETION_WORD_SEQUENCE` | `MISSING_TERM` | `SINGLE_CLUSTER` | `COVERED` | Both-edge shrinking uses the same deletion authority. |
| `SER-SRC-007-008` | `DISHA-VNV`, Miscellaneous Question Bank p. `QB-7`, item 166 | `ACE, BDF, CEG, ?` | `COLUMNWISE_FIXED_CLUSTER_MOVEMENT` | `NEXT_TERM` | `SINGLE_CLUSTER` | `COVERED` | Each corresponding letter position advances uniformly. |
| `SER-SRC-007-009` | `DISHA-VNV`, Miscellaneous Question Bank p. `QB-7`, item 167 | `ABC, PQR, DEF, STU, ?` | `TWO_INTERLEAVED_CLUSTER_SERIES` | `NEXT_TERM` | `SINGLE_CLUSTER` | `COVERED` | Odd and even positions form independent consecutive-cluster rows. |
| `SER-SRC-007-010` | `DISHA-VNV`, Miscellaneous Question Bank p. `QB-7`, item 169 | `ccbab_caa_bccc_a_`; answer letters `babb` | `REPEATED_BLOCK_COMPLETION` | `FILL_GAPS` | `FLAT_GAP_LETTER_GROUP` | `COVERED` | Independent reconstruction gives `ccb | abb | caa | abc | ccb | ab...`, a repeated four-group cycle. |
| `SER-SRC-007-011` | `DISHA-VNV`, Miscellaneous Question Bank p. `QB-7`, item 170 | `a__dba__bcad__da__cd`; answer letters `bccdbcab` | `MARKER_BLOCK_POSITION_SHIFT_OVER_PERIODIC_FRAME` | `FILL_GAPS` | `FLAT_GAP_LETTER_GROUP` | `COVERED_BY_WAVE_E` | Reconstruction gives `abcd | bacd | bcad | bcda | abcd`: the `a` marker moves right through a regenerated `bcd` frame. Presentation as one blank line does not make it a repeated-block authority. |
| `SER-SRC-007-012` | `RADIAN-2022`, printed p. `6-17`, solution for item 133 | printed solution separates odd-position vowel groups from even-position `K→L→M→N` and `Q→R→S→T` rows | `TWO_INTERLEAVED_CLUSTER_SERIES` | completion | `SINGLE_CLUSTER` | `SOLUTION_TRACE_VERIFIED` | The printed solution proves two-row ownership; the exact question stem remains to be attached. |
| `SER-SRC-007-013` | `RADIAN-2022`, printed p. `6-12`, item 228 | `CCABABAB, ACCBABAB, ABCCABAB, ABACCBAB, ABABCCAB, ?` | `MARKER_BLOCK_POSITION_SHIFT_OVER_PERIODIC_FRAME` | `NEXT_TERM` | `SINGLE_CLUSTER` | `COVERED_BY_WAVE_E` | The `CC` marker block moves right while uncovered positions return to the recurring `AB` background. |
| `SER-SRC-007-014` | `RADIAN-2022`, printed p. `6-12`, item 229 | `ABCABABAB, ABABCABAB, ABABABCAB, ABABABABC, ACBABABAB, ?` | `MARKER_BLOCK_POSITION_SHIFT_OVER_PERIODIC_FRAME` | `NEXT_TERM` | `SINGLE_CLUSTER` | `COVERED_BY_WAVE_E` | A single `C` marker advances by two positions and wraps through a recurring `AB` frame. |
| `SER-SRC-007-015` | `RADIAN-2022`, printed p. `6-12`, item 230 | `PQPQPQPQ, RQPQPQPQ, RSPQPQPQ, RSRQPQPQ, RSRSPQPQ, ?` | `PROGRESSIVE_POSITIONAL_SUBSTITUTION` | `NEXT_TERM` | `SINGLE_CLUSTER` | `COVERED_BY_WAVE_E` | One additional left-to-right position changes from the `PQ` source pattern into the `RS` target pattern. |
| `SER-SRC-007-016` | `RADIAN-2022`, printed p. `6-12`, item 231 | `XXXXXXx, XXXXXxX, XXXXxXX, XXXxXXX, XXxXXXX, ?` | `CYCLIC_CLUSTER_PERMUTATION` | `NEXT_TERM` | `SINGLE_CLUSTER` | `COLLIDES_EXISTING_AUTHORITY` | Independent solving proves that the moving lowercase marker description and whole-group cyclic rotation generate the same terms. |
| `SER-SRC-007-017` | `RADIAN-2022`, printed p. `6-12`, item 232 | `PQPPPPQ, PPQPPPPQ, PPPQPPPQ, PPPPQPPQ, PPPPPQPQ, ?` | `MARKER_BLOCK_POSITION_SHIFT_OVER_PERIODIC_FRAME` | `NEXT_TERM` | `SINGLE_CLUSTER` | `COVERED_BY_WAVE_E` | The interior `Q` marker moves right while the terminal `Q` stays fixed. |
| `SER-SRC-007-018` | `RADIAN-2022`, printed p. `6-12`, item 233 | `YXZYXYXY, YXYXZYXY, YXYXYXZY, YZXYXYXY, YXYZXYXY, ?` | `MARKER_BLOCK_POSITION_SHIFT_OVER_PERIODIC_FRAME` | `NEXT_TERM` | `SINGLE_CLUSTER` | `COVERED_BY_WAVE_E` | A `Z` marker advances by two positions through the periodic `YX` frame and wraps. |
| `SER-SRC-007-019` | `RADIAN-2022`, printed p. `6-12`, item 234 | `ABCABcABC, ABCAbCABC, ABCaBCABC, ABcABCABC, AbCABCABC, ?` | `MARKER_BLOCK_POSITION_SHIFT_OVER_PERIODIC_FRAME` | `NEXT_TERM` | `SINGLE_CLUSTER` | `COVERED_BY_WAVE_E` | A lowercase-state marker moves left through an uppercase recurring frame. |
| `SER-SRC-007-020` | `RADIAN-2022`, printed p. `6-12`, item 235 | `abaBABAB, AbabABAB, ABabaBAB, ABAbabAB, ABABabaB, ?` | `MARKER_BLOCK_POSITION_SHIFT_OVER_PERIODIC_FRAME` | `NEXT_TERM` | `SINGLE_CLUSTER` | `COVERED_BY_WAVE_E` | A multi-letter lowercase marker block moves right through an uppercase periodic background. |
| `SER-SRC-007-021` | `RADIAN-2022`, printed p. `6-12`, item 236 | `CDCDCBAB, CDCDABAB, CDCBABAB, CDABABAB, CBABABAB, ?` | `PROGRESSIVE_POSITIONAL_SUBSTITUTION` | `NEXT_TERM` | `SINGLE_CLUSTER` | `COVERED_BY_WAVE_E` | The boundary between source pattern `CD` and target pattern `AB` moves left. |
| `SER-SRC-007-022` | `RADIAN-2022`, printed p. `6-12`, item 225; solution p. `6-20` | `XyXYXYXY, XYxYXYXY, XYXyXYXY, XYXYxYXY, XYXYXyXY, ?` | `MARKER_BLOCK_POSITION_SHIFT_OVER_PERIODIC_FRAME` | `NEXT_TERM` | `SINGLE_CLUSTER` | `COVERED_BY_WAVE_E` | The lowercase state moves right through the `XY` background; the previously lowercase position returns to its uppercase background value. |
| `SER-SRC-007-023` | `DISHA-VNV`, Miscellaneous Question Bank p. `QB-8`, item 188 | `aac_bba_cc_baa_cb_`; option `cabcb` | `REPEATED_BLOCK_COMPLETION` | `FILL_GAPS` | `FLAT_GAP_LETTER_GROUP` | `COVERED` | Independent reconstruction gives `aaccbb | aaccbb | aaccbb`. |
| `SER-SRC-007-024` | `DISHA-VNV`, Miscellaneous Question Bank p. `QB-8`, item 195 | `opo__po_ppo__pppo_op_p` | unresolved continuous-pattern authority | `FILL_GAPS` | `FLAT_GAP_LETTER_GROUP` | `CLASSIFICATION_PENDING` | The extracted source has inconsistent spacing and one option transcription differs across accessible copies. Do not force a canonical block authority until the printed page is inspected visually. |
| `SER-SRC-007-025` | `DISHA-VNV`, Miscellaneous Question Bank p. `QB-8`, item 196 | `i___ij_l___l`; option `jklkijk` | `REPEATED_BLOCK_COMPLETION` | `FILL_GAPS` | `FLAT_GAP_LETTER_GROUP` | `COVERED` | Independent reconstruction gives `ijkl | ijkl | ijkl`. |
| `SER-SRC-007-026` | `DISHA-VNV`, Miscellaneous Question Bank p. `QB-8`, item 197 | `ab___b_bbaa_`; option `baaab` | `REPEATED_BLOCK_COMPLETION` | `FILL_GAPS` | `FLAT_GAP_LETTER_GROUP` | `COVERED` | Independent reconstruction gives `abbaab | abbaab`. |
| `SER-SRC-007-027` | `RADIAN-2022`, printed p. `6-12`, item 227; solution p. `6-20` | an `R` marker moves right by one position through a recurring `QP` background | `MARKER_BLOCK_POSITION_SHIFT_OVER_PERIODIC_FRAME` | `NEXT_TERM` | `SINGLE_CLUSTER` | `COVERED_BY_WAVE_E` | The printed solution explicitly states the one-place right shift. The text extraction contains one noisy term, so the row uses a faithful short identifier instead of silently correcting the source. |
| `SER-SRC-007-028` | `RADIAN-2022`, printed p. `6-17`, items 134–141 | printed answers `EHJ`, `ZQV`, `GSU`, `OEM`, `HMY`, `UCI`, `TQU`, `IFC` | existing cluster authorities, item-level split pending | mixed completion tasks | `SINGLE_CLUSTER` | `STEM_EXTRACTION_PENDING` | Printed answer identities are attached, but each exact stem and rule must still be mapped before final traceability. |
| `SER-SRC-007-029` | `RADIAN-2022`, printed p. `6-20`, solution notes for items 221 and 222 | item 221: `Z` moves two places with wrap; item 222: one additional leftmost `X` becomes `Y` | Wave E marker movement and `PROGRESSIVE_POSITIONAL_SUBSTITUTION` | `NEXT_TERM` | `SINGLE_CLUSTER` | `STEM_EXTRACTION_PENDING` | The solution logic is exact; complete stems remain to be attached. |

## Authority conclusions from the traced sources

```text
Existing authorities directly source-backed:
  COLUMNWISE_FIXED_CLUSTER_MOVEMENT
  TWO_INTERLEAVED_CLUSTER_SERIES
  EDGE_DELETION_WORD_SEQUENCE
  REPEATED_BLOCK_COMPLETION
  CYCLIC_CLUSTER_PERMUTATION

Delegation reaffirmed:
  width-one alphabetic terms -> SER-CP-006

Wave E retained authorities:
  MARKER_BLOCK_POSITION_SHIFT_OVER_PERIODIC_FRAME
  PROGRESSIVE_POSITIONAL_SUBSTITUTION
```

The renewed source pass also proves that presentation cannot decide ownership. Disha items 169 and 170 are both continuous lines with blanks, yet item 169 repeats a block while item 170 moves a marker through a regenerated frame.

## Wave E executable result

```text
Source-shaped probes:          9
Canonical authorities in pool: 3
New provisional authorities:   2
Temporary templates:          36
Seeds per template:          120
Generated questions:       4,320
Independent solver proofs:  4,320
Rotation collision proofs:    480
Permanent QLs:                  0
```

## Post-Wave-E collision result

```text
Retained provisional authorities: 17
Pairwise authority comparisons:  136
Unresolved retained collisions:    0
Temporary templates:             140
Generated structural spot proofs: 420
Declared source-shape collisions:  20
Ambiguous source-rule mappings:     0
```

The collision matrix compares surface, width behaviour, change axis, partition model, state model and recovery model. It also regenerates three samples from every temporary template and checks that observed width behaviour agrees with the authority contract.

This closes the collision audit for the current inventory. It does not close source traceability.

## Structural saturation probes without attached page trace

The following Wave D probes remain executable coverage probes and are provisionally classified `SATURATION_ONLY` until a traceable source example is attached:

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

`SATURATION_ONLY` does not mean invalid or removable. It means the authority is retained by executable mathematical coverage while direct page ancestry remains pending.

## Delegated surfaces

| Surface | Owner | Reason |
|---|---|---|
| single-letter terms | `SER-CP-006` | every term contains one letter |
| explicit group-to-code transformation | `COD-001` | input is converted into an output code |
| relation transfer between cluster pairs | `ANA-001` | one pair teaches the relation for another pair |
| classification of independent option series | `CLS-001` | task is odd-one-out/classification, not continuation |
| mixed letter-number cluster series | `SER-CP-008` candidate boundary | token grammar is not purely alphabetic |

## Remaining source-ledger work

1. Inspect the printed image for Disha item 195 and resolve the blank/option transcription.
2. Attach exact stems and authority rows for Radian items 134–141.
3. Attach complete stems for Radian items 221 and 222.
4. Trace direct source rows for variable-length clusters, progressive column movement, cumulative prefix and symmetric growth where available.
5. Replace each provisional Wave D `SATURATION_ONLY` decision with direct source ancestry when found; otherwise retain the explicit saturation-only label.
6. Begin full English question and explanation review only after these remaining traceability rows stop changing.

## Freeze state

```text
Traceability pass:          IN_PROGRESS
Verified source records:    26 covered/delegated/Wave-E-resolved
Pending traced records:     3 grouped or stem/classification-pending
Wave E executable discovery: COMPLETE
Post-Wave-E collision audit: COMPLETE
Mathematical saturation:    PENDING_SOURCE_LEDGER_COMPLETION
Ledger completeness:       BLOCKED
Page-level traceability:   BLOCKED
English discovery freeze:  BLOCKED
Permanent QLs:             0
CP-008:                    BLOCKED
```

Next authority:

```text
SER_CP007_POST_WAVE_E_SOURCE_LEDGER_COMPLETION
```
