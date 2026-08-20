# SEA-002 / SEA-CP-006 — Source-realness audit

Status: **OPEN — source-backed expansion implemented, residual semantic gaps remain**

This audit is discovery evidence only. It allocates no permanent `SEA-QL-*` authority and does not freeze English, localisation, Question Studio, Question Bank, mocks, staging or public delivery.

## Checkpoint boundary

`SEA-CP-006` owns two equal parallel rows facing each other: one row faces south, the other north. It owns same-row positional reasoning, explicit corresponding columns, opposite/not-opposite, row identity and source-backed diagonal relations. Linear-row semantics such as adjacency and exact persons-between remain ordinary CP006 relations when applied inside one of the two rows.

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
| BOB Apprentice Sample Paper 02 (2026), Adda247/Bankersadda | 6+6 | exact gaps; extreme ends; not-near; second-from-end; neighbour and relative-position queries | endpoint-domain and negative-neighbour language are residual candidates |
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

The generator/solver path now supports 3+3 through 6+6. The scalable production solver and independently implemented audit oracle stop after the second solution when checking uniqueness, avoiding factorial full-permutation enumeration at wider widths.

### Added source-natural clue semantics

1. `SAME_ROW_GAP`
   - `between = 0` covers immediate-neighbour/adjacency semantics;
   - positive `between` covers exact persons-between semantics.

2. `FACING_REFERENT_RELATIVE`
   - represents forms equivalent to “the person facing X sits k-th left/right of the person facing Y”;
   - evaluated semantically through the explicit opposite-column map and the facing of the opposite row;
   - independently checked by production solver and audit oracle.

### Added source-natural query mix

No new permanent query IDs were invented. Existing chapter contracts are reused:

- `SEA-QC-010` — opposite person;
- `SEA-QC-003` — person-relative position;
- `SEA-QC-006` — immediate-neighbour pair;
- `SEA-QC-009` — persons-between count.

A dedicated proof executes 24 source-real caselets / 96 child questions across PBA-021..024 and widths 4+4, 5+5 and 6+6.

## Merge/split observations

### Keep merged for now

- Exact gap and adjacency are not separate puzzle blueprints. They are ordinary same-row linear constraints embedded in the two-row topology.
- `FACING_REFERENT_RELATIVE` is a clue-language/composition family, not yet proven to require a separate blueprint. It should first saturate across the existing solve families.
- 4+4, 5+5 and 6+6 are size variants, not separate authorities.

### Do not merge into CP006

- linked colour/profession/city/etc. semantics;
- conditional either/or identity logic;
- data-sufficiency answer semantics;
- hypothetical exchange/rotation or controlled multi-model questions.

## Residual gap inventory before solve/query freeze

The following source-natural families still require explicit accept/reject decisions and, where accepted, executable proof:

1. `NOT_ADJACENT` / “does not sit near” within a known row;
2. minimum-gap language such as “more than one person sits between”;
3. endpoint-domain forms such as “second from one of the ends”, “not at an end”, or “only one person sits to the left/right”;
4. neighbour-to-facing composition such as “an immediate neighbour of X faces Y”;
5. relative-position answer contracts (“position of A with respect to B”) after chapter query-ID authority audit;
6. extreme-end occupant/pair query forms;
7. equal-gap comparison language, if source saturation shows it is common enough to justify typed support rather than editorial exclusion.

## Current freeze verdict

**NOT READY TO FREEZE.**

The former width blocker is closed and the first source-realness gap wave is executable and green. CP006 still needs the residual semantic-gap decisions above, query-contract/inverse audit, larger saturation, manual English review, and final merge/split/gap review before permanent QL allocation.
