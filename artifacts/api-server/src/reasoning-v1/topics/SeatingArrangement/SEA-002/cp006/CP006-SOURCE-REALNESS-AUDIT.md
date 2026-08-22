# SEA-002 / SEA-CP-006 — Completion and source-realness audit

Status: **TECHNICALLY COMPLETE / ENGLISH REVIEW ARTIFACT PINNED — signed owner review pending before permanent allocation**

This record covers `SEA-CP-006 — Two parallel rows facing each other`. Solve/query/source/inverse/merge-gap implementation and learner-language / solution hardening are complete. The signed English-review gate is deliberately not fabricated; permanent `SEA-QL-*` allocation, localisation, Question Studio, Question Bank, mocks, staging and public delivery remain locked.

## Checkpoint boundary

CP006 owns equal parallel rows with the upper row facing south and the lower row facing north, for 3–6 seats per row. It owns row identity, person-relative same-row movement, opposite/corresponding columns, not-opposite, diagonal, same-row adjacency/gaps and source-backed endpoint-domain language.

Excluded by design:

- non-uniform, same-direction or mixed row facings -> `SEA-CP-007`;
- person-to-attribute layers -> `SEA-CP-011`;
- either/or, implication and genuinely conditional clues -> `SEA-CP-013`;
- data-sufficiency decision format -> Data Sufficiency chapter;
- exchange/rotation/hypothetical multi-model questions -> designated advanced seating checkpoint.

## Retained solve authorities

No merge or split is justified. The four provisional solve authorities remain materially distinct:

- `SEA-PBA-021` — fixed row membership with opposites;
- `SEA-PBA-022` — row membership partly inferred;
- `SEA-PBA-023` — same-row positional chains linked through opposite seats;
- `SEA-PBA-024` — opposite/not-opposite/diagonal/endpoint composition.

Width is a size variant, not an authority: 3+3, 4+4, 5+5 and 6+6 use the same topology and solver contract.

## Final clue ontology

The executable CP006 clue layer covers:

- `ROW_MEMBERSHIP`;
- `OPPOSITE`;
- `NOT_OPPOSITE`;
- `SAME_ROW_RELATIVE`;
- `SAME_ROW_GAP` — adjacency when `between = 0`, otherwise exact persons-between;
- `SAME_ROW_MIN_BETWEEN` — lower-bound gap language;
- `SAME_ROW_EQUAL_GAP` — equal persons-between comparison;
- `NOT_ADJACENT`;
- `FACING_REFERENT_RELATIVE` — nested “person facing X … person facing Y” composition;
- `END_POSITION`;
- `ROW_END_DISTANCE` — nth-from-either-end and negative end-distance domains;
- `DIAGONAL`.

“An immediate neighbour of X faces Y” is not a separate solver family in this topology: it is equivalent to the existing diagonal relation and is therefore a language variant, not duplicate semantics.

## Query-contract authority audit

No new query IDs are introduced. Final retained CP006 query inventory:

- `SEA-QC-003` — person-relative occupant;
- `SEA-QC-006` — immediate-neighbour pair;
- `SEA-QC-008` — ordinary linear count-between;
- `SEA-QC-010` — opposite/corresponding occupant;
- `SEA-QC-011` — same-row/different-row occupant;
- `SEA-QC-012` — diagonal occupant;
- `SEA-QC-014` — pair occupying designated positions; reused for facing-pair and row-end-pair forms;
- `SEA-QC-015` — relative-position phrase.

Important correction: frozen SEA-001 authority shows `SEA-QC-009` is directional cyclic counting; ordinary same-row count-between is `SEA-QC-008`. CP006 uses `QC008` and does not retain `QC009`.

## Source evidence decisions

SSC and banking source sampling across 4+4, 5+5 and 6+6 validated exact gaps, adjacency/non-adjacency, nested facing referents, endpoint distance, facing pairs, row-end pairs, relative-position outputs and equal-gap comparisons as relevant CP006 surfaces.

Residual decisions are closed:

1. not-adjacent — accepted and implemented;
2. minimum-gap — accepted and implemented;
3. nth-from-end domains — accepted and implemented;
4. neighbour-to-facing — merged into diagonal semantics;
5. relative-position query — existing `QC015` reused;
6. facing/extreme-end pair query — existing `QC014` reused;
7. equal-gap comparison — accepted as `SAME_ROW_EQUAL_GAP`, without a new PBA.

## Separation of audit coverage from exam generation

`source-realness.ts` is an all-semantics audit bundle. It composes every accepted source-natural semantic onto a uniquely solvable base so each semantic can be proved against both solvers. It is not the learner-facing generation strategy.

`exam-real.ts` is the product-candidate generator. Each caselet:

- preserves the defining PBA contract;
- retains a compact clue set;
- includes a source-natural clue that is solution-essential rather than decorative;
- proves removing that source clue changes the unique-solution policy;
- preserves production-solver / independent-oracle agreement;
- groups fixed row-membership facts;
- avoids full-clue-list repetition in the learner solution.

## Learner-language and solution contract

### Question / passage language

- ordinary SSC/Banking wording such as “two parallel rows”, “faces north/south”, “faces each other”, “immediate neighbour”, “persons between” and “second from either end”;
- no internal solver/oracle/blueprint/fingerprint/observer language;
- compact passage wording;
- learner-facing opposite-seat wording uses **same position in the two rows**, not column terminology;
- white-background parallel-row diagram as a seating aid.

### Shared solution

The final shared-solution contract keeps SEA-001-style reasoning but removes unnecessary tutorial framing and uses **position** consistently on learner surfaces.

- Starts with one compact working frame only: positions numbered left-to-right, upper row south-facing, lower row north-facing, same position in the two rows = facing pair.
- Goes immediately into case formation or positional deductions; the previous multi-paragraph “draw the rows / remember left-right” opening is forbidden.
- Uses concrete seating language: `row`, `position`, `left/right end`, `position difference`, and `persons between`.
- Uses `Position:` for the deduction outcome instead of the generic `Result:` label.
- For person-relative clues, states the reference row, facing and position, then the resulting target position.
- Shows `Case 1`, `Case 2` and `Case 3` only when genuine alternatives exist, then rejects/retains cases with the deciding condition.
- Groups row-membership givens instead of narrating one sentence per person when several are supplied.
- Diagrams use `Positions:` with `P1`, `P2`, ... markers.
- Ends at the final arrangement; the generic “use this arrangement to answer…” closing sentence is removed.

The review gate forbids the old generic opening/closing boilerplate, `observer` leakage, malformed direction grammar, excessive row-membership repetition, and any learner-facing `column` / `columns` wording.

## Executable completion evidence

### Discovery and width

- baseline 3+3: 48 caselets / 192 child questions;
- wide 4+4–6+6: 24 caselets / 96 child questions.

### All-semantics source proof

- 48 caselets / 192 child questions;
- all accepted source clue kinds exercised;
- q3 surfaces include immediate-neighbour pair, facing pair and row-end pair;
- q4 exercises both `QC008` and `QC015`;
- production/oracle uniqueness, clue truth, clue-order invariance, option integrity and lifecycle locks required.

### Completion saturation / inverse / metamorphic proof

- 320 caselets / 1,280 child questions;
- 80 structural signatures per PBA, 320 total;
- all eight retained query contracts reached;
- balanced answer positions;
- exact duplicate clue sets rejected;
- 16 supportive-clue invariance checks;
- 16 minimized unique-set audits yielding 120 proven essential clues;
- 16 rename-invariance proofs;
- 16 mirror-metamorphic proofs;
- 3,192 opposite involution checks;
- 13,152 left/right inverse checks;
- 14,748 diagonal-symmetry checks.

### Compact exam-real proof

- 320 caselets / 1,280 child questions;
- 319 structural signatures;
- every caselet contains exactly one source-natural relation selected as solution-essential;
- all six source-essential families reached: facing-referent, not-adjacent, row-end-distance, equal-gap, exact/adjacent gap and minimum-gap;
- maximum displayed clue count: 11;
- 295 / 320 explicitly exercise candidate-case teaching;
- no full-clue-list repetition in the shared explanation.

## English review corpus

A deterministic 100-caselet `en-IN` review corpus is pinned:

- 25 caselets per PBA;
- 80 compact exam-real cases + 20 baseline cases;
- widths 3–6 represented;
- all eight retained query contracts represented;
- 15 normalized question-stem surfaces;
- 36 normalized clue-language surfaces;
- 100 distinct structural fingerprints;
- 100 / 100 contain detailed position-first shared solutions;
- 100 / 100 contain concrete `Position:` + position-based working;
- 88 / 100 explicitly show candidate-case formation and elimination;
- zero learner-facing `column` / `columns` wording in the pinned corpus;
- zero old generic opening paragraphs, zero `Result:` labels, zero old closing filler and zero learner-facing `observer` language;
- options, answer positions, punctuation, explanation depth and internal-language leakage are automatically checked.

Pinned review fingerprint:

`07216e2a08c198266bd25e40484a477d5c6e4de73b2dae06b8235fc3773a0c3e`

Verified executable/review workflow: run `32565913630` on content head `9f827326085d823ea02cab666bb43191c2be3017` — every CP006 executable and review gate passed.

Uploaded artifact: `cp006-english-review-100`, artifact ID `9474071929`.

ZIP digest:

`sha256:7e37d79da61f4b4edca8601e353cd1cf4b8fc1b85fa427dfd89591fa7f747ccc`

The manifest decision state remains `AWAITING_SIGNED_REVIEW`.

## Lifecycle verdict

Technical implementation verdict: **COMPLETE**.

Learner-language / detailed-solution hardening verdict: **COMPLETE AND GREEN**.

Signed English freeze verdict: **PENDING OWNER REVIEW OF THE EXACT PINNED ARTIFACT**.

Until that exact fingerprint receives a signed review, lifecycle remains:

```text
permanent QLs              0
solve inventory            technically complete, allocation pending
query inventory            technically complete, allocation pending
English freeze             false
Hindi/Punjabi freeze       false
Question Studio registered false
Question Bank writable     false
mock-test eligible         false
production staging         false
public delivery            false
```

The next available permanent seating ID after SEA-001 is `SEA-QL-021`; candidate mapping for PBA-021..024 must not be committed as permanent authority until the signed English-review gate is satisfied.