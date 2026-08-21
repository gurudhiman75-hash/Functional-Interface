# SEA-002 / SEA-CP-006 — Source-realness audit

Status: **ADVANCED OPEN — source-backed width, clue-semantic and core query gaps implemented; final saturation/editorial gates remain**

This audit is discovery evidence only. It allocates no permanent `SEA-QL-*` authority and does not freeze English, localisation, Question Studio, Question Bank, mocks, staging or public delivery.

## Checkpoint boundary

`SEA-CP-006` owns two equal parallel rows facing each other: one row faces south, the other north. It owns same-row positional reasoning, explicit corresponding columns, opposite/not-opposite, row identity and source-backed diagonal relations. Linear-row semantics such as adjacency and persons-between remain ordinary CP006 relations when applied inside one of the two rows.

Do **not** absorb the following into CP006 merely because they appear in a parallel-row passage:

- person-to-attribute layers -> `SEA-CP-011`;
- either/or, implication and genuinely conditional clues -> `SEA-CP-013`;
- data-sufficiency decision format -> Data Sufficiency chapter;
- exchange/rotation/hypothetical multi-model queries -> designated advanced seating checkpoint.

## Source sample

The audit intentionally mixes SSC and banking material and covers 4, 5 and 6 seats per row.

| Evidence | Width | Source-natural structures observed | CP006 implication |
|---|---:|---|---|
| SSC GD Constable 2025 official paper, Testbook | 4+4 | fixed row membership; exact one-person gaps; facing-pair query | exact same-row gap is required; pair-valued opposite query is exam-natural |
| SBI Clerk Pre memory-based paper 10 Jul 2021, Adda247/Bankersadda | 5+5 | exact two-person gap; diagonal opposite; direct opposite; non-adjacency; relative-position query | 5+5 is source-real; gap/adjacency family cannot be omitted |
| SBI PO Pre 2022 previous-year mock, Adda247/Bankersadda | 5+5 | `person facing X` referent chain; row deduction; opposite query; persons-between query | anonymous facing-referent composition is a genuine parallel-row language family |
| SBI PO Pre 2023 shift-wise PYP mock, Adda247/Bankersadda | 6+6 | `one who faces X` relative chain; exact two-person gap; adjacency and non-adjacency; kth-left query | 6+6 needs nested facing referents plus richer same-row relation wording |
| BOB Apprentice Sample Paper 02 (2026), Adda247/Bankersadda | 6+6 | exact gaps; extreme ends; not-near; second-from-end; neighbour and relative-position queries | endpoint-domain and negative-neighbour language belong in ordinary CP006 |
| Testbook 12-person dual-row example | 6+6 | exact gaps, ends, opposite, immediate/right; either/or endpoint condition | ordinary relations stay CP006; the either/or semantic itself belongs to conditional seating |

### Evidence URLs

- https://testbook.com/question-answer/eight-people-are-sitting-in-two-parallel-rows-cont--67d8b590f6f79b1840b92b1f
- https://www.bankersadda.com/wp-content/uploads/multisite/2021/07/12170722/Formatted-SBI-Clerk-Pre-Memory-Based-Paper-10.Jul_.2021-Questions-with-Solutions.pdf
- https://www.bankersadda.com/wp-content/uploads/multisite/2025/01/30113028/SBI-PO-Pre-2022-20th-Dec-Shift-Wise-Previous-Year-Paper-Mock-10.pdf
- https://www.bankersadda.com/wp-content/uploads/multisite/2025/08/15011225/SBI-PO-Pre-2023-1st-Nov-Shift-wise-Paper-Mock-02.pdf
- https://www.bankersadda.com/wp-content/uploads/multisite/2026/05/20004934/BOB-Apprentice-Sample-Paper-02-English.pdf
- https://testbook.com/question-answer/who-sits-at-end-of-the-row--60ec020a930cefc2e772f045

## Implemented from this audit

### Width coverage

The generator/solver path supports 3+3 through 6+6. The scalable production solver and independently implemented audit oracle stop after the second solution when checking uniqueness, avoiding factorial full-permutation enumeration at wider widths.

### Source-natural clue semantics

1. `SAME_ROW_GAP`
   - `between = 0` covers immediate-neighbour/adjacency semantics;
   - positive `between` covers exact persons-between semantics.

2. `SAME_ROW_MIN_BETWEEN`
   - covers lower-bound gap wording such as “at least two persons sit between”.

3. `NOT_ADJACENT`
   - covers “does not sit near / is not an immediate neighbour” without turning a negative clue into a new blueprint.

4. `ROW_END_DISTANCE`
   - supports nth-from-either-end and negative nth-from-either-end domains;
   - current source-real proof exercises second-from-either-end and not-second-from-either-end.

5. `FACING_REFERENT_RELATIVE`
   - represents forms equivalent to “the person facing X sits k-th left/right of the person facing Y”;
   - evaluated semantically through the explicit opposite-column map and the facing of the opposite row;
   - independently checked by production solver and audit oracle.

### Source-natural query mix

No new permanent query IDs were invented. Existing chapter contracts are reused:

- `SEA-QC-010` — opposite person;
- `SEA-QC-003` — person-relative position;
- `SEA-QC-006` — immediate-neighbour pair;
- `SEA-QC-009` — persons-between count;
- `SEA-QC-015` — relative-position relation (“What is the position of A with respect to B?”).

The source-real generator alternates the fourth child between `SEA-QC-009` and `SEA-QC-015`. The dedicated proof requires both families to appear across the corpus.

## Executable evidence

- baseline 3+3 discovery: 48 caselets / 192 child questions;
- width expansion proof: 24 caselets / 96 child questions across 4+4, 5+5 and 6+6;
- source-realness proof: 24 caselets / 96 child questions across PBA-021..024 and widths 4+4, 5+5 and 6+6;
- source-real proof requires all accepted source semantic families, both `QC009` and `QC015`, unique arrangements, production/oracle agreement, reversed-clue-order invariance, four-option uniqueness and lifecycle locks.

Latest verified workflow head after the QC015 proof correction: `e13c318491401a1174d64b36e7a57330d2579062` — all CP006 workflow stages passed.

## Merge/split decisions so far

### Keep merged

- Exact gap, minimum gap, adjacency and non-adjacency are same-row linear constraints embedded in the two-row topology, not separate solve blueprints.
- `FACING_REFERENT_RELATIVE` is a composition/language family over the existing opposite map plus same-row relative movement; it has not shown a distinct solve mechanism requiring another PBA.
- 4+4, 5+5 and 6+6 are size variants, not authorities.
- “an immediate neighbour of X faces Y” collapses to the existing `DIAGONAL` semantic in equal parallel rows facing each other, so duplicate solver semantics are explicitly rejected.
- relative-position output reuses frozen chapter query contract `SEA-QC-015`; no new query ID is justified.

### Do not merge into CP006

- linked colour/profession/city/etc. semantics;
- conditional either/or identity logic;
- data-sufficiency answer semantics;
- hypothetical exchange/rotation or controlled multi-model questions.

## Residual gap inventory before solve/query freeze

The earlier residuals for not-adjacent, minimum gap, nth-from-end domains, facing-referent composition and relative-position output are now closed at executable discovery level.

Remaining decisions/evidence:

1. pair-valued opposite/facing query such as “Which pair faces each other?” — audit existing query authority before adding anything;
2. extreme-end occupant/pair query forms — determine whether existing frozen seating query contracts already cover them;
3. equal-gap comparison wording — accept only if wider source saturation shows material frequency beyond equivalent exact-gap phrasing;
4. inverse/counterfactual query audit across all retained CP006 query families;
5. larger source saturation to test whether any genuinely distinct solve mechanism is still missing;
6. manual English review of stems, clue naturalness, explanations and distractors;
7. final merge/split/gap decision before permanent `SEA-QL-*` allocation.

## Current freeze verdict

**NOT READY TO FREEZE.**

The former width blocker and the major source-semantic/query gaps are closed and green. CP006 still requires the residual authority/inverse audits, larger saturation and English human review before permanent QL allocation. Localisation, Question Studio registration, Question Bank writes, mock eligibility, production staging and public delivery remain locked.
