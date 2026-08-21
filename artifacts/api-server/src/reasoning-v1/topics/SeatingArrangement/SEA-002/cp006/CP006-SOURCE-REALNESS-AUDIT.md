# SEA-002 / SEA-CP-006 — Completion and source-realness audit

Status: **TECHNICALLY COMPLETE / ENGLISH REVIEW ARTIFACT PINNED — signed owner review pending before permanent allocation**

This record covers `SEA-CP-006 — Two parallel rows facing each other`. It closes the solve/query/source/inverse/merge-gap implementation work. It deliberately does **not** fabricate the signed English-review gate and therefore does not yet allocate permanent `SEA-QL-*` IDs or activate localisation, Question Studio, Question Bank, mocks, staging or public delivery.

## Checkpoint boundary

CP006 owns equal parallel rows with the upper row facing south and the lower row facing north, for 3–6 seats per row. It owns row identity, person-relative same-row movement, corresponding/opposite columns, not-opposite, diagonal, same-row adjacency/gaps and source-backed endpoint-domain language.

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

No new query IDs are introduced.

Final retained CP006 query inventory:

- `SEA-QC-003` — person-relative occupant;
- `SEA-QC-006` — immediate-neighbour pair;
- `SEA-QC-008` — ordinary linear count-between;
- `SEA-QC-010` — opposite/corresponding occupant;
- `SEA-QC-011` — same-row/different-row occupant;
- `SEA-QC-012` — diagonal occupant;
- `SEA-QC-014` — pair occupying designated positions; reused for facing-pair and row-end-pair forms;
- `SEA-QC-015` — relative-position phrase.

Important correction: CP006 previously used `SEA-QC-009` for an ordinary same-row persons-between question. Frozen SEA-001 authority shows `QC009` is directional cyclic counting, while ordinary linear count-between is `QC008`. CP006 now uses `QC008`; `QC009` is removed from its type/query inventory.

## Source evidence decisions

SSC and banking source sampling across 4+4, 5+5 and 6+6 validated exact gaps, adjacency/non-adjacency, nested facing referents, endpoint distance, facing pairs, row-end pairs, relative-position outputs and equal-gap comparisons as relevant CP006 surfaces.

All earlier residual decisions are now closed:

1. not-adjacent — accepted and implemented;
2. minimum-gap — accepted and implemented;
3. nth-from-end domains — accepted and implemented;
4. neighbour-to-facing — merged into diagonal semantics;
5. relative-position query — existing `QC015` reused;
6. facing/extreme-end pair query — existing `QC014` reused;
7. equal-gap comparison — accepted as `SAME_ROW_EQUAL_GAP`, without adding a new PBA.

## Separation of audit coverage from exam generation

`source-realness.ts` is an **all-semantics audit bundle**. It deliberately composes every accepted source-natural semantic onto an already unique base arrangement so each semantic can be independently proved against both solvers.

That bundle is not the final learner-facing generation strategy.

`exam-real.ts` is the product-candidate generator. For each caselet it:

- preserves the defining PBA contract;
- retains a compact clue set;
- includes a source-natural clue that is **solution-essential** rather than decorative;
- proves removing that source clue changes the unique-solution policy;
- preserves production-solver / independent-oracle agreement;
- groups fixed row-membership facts for PBA-021 rather than printing one row sentence per person;
- avoids repeating the full clue list in the shared explanation.

## Executable completion evidence

### Discovery and width

- baseline 3+3: 48 caselets / 192 child questions;
- wide 4+4–6+6: 24 caselets / 96 child questions.

### All-semantics source proof

- 48 caselets / 192 child questions;
- all accepted source clue kinds exercised;
- q3 surfaces include immediate-neighbour pair, facing pair and row-end pair;
- q4 exercises both `QC008` and `QC015`;
- production/oracle uniqueness, clue truth, clue-order invariance, option integrity and lifecycle locks are required.

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
- all six source-essential families are reached: facing-referent, not-adjacent, row-end-distance, equal-gap, exact/adjacent gap and minimum-gap;
- maximum displayed clue count in the proof corpus: 11;
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
- options, answer positions, punctuation, explanation length and internal-language leakage are automatically checked.

Pinned review fingerprint:

`58b48161ce40f9fff38b0d36b855659bc99eeca8163de287e219f3e9875dbfa2`

The exporter produces HTML, JSON and manifest artifacts and labels the decision state `AWAITING_SIGNED_REVIEW`.

## Lifecycle verdict

Technical implementation verdict: **COMPLETE**.

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
