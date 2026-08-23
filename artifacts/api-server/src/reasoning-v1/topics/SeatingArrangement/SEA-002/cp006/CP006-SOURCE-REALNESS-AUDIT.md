# SEA-002 / SEA-CP-006 — Completion, source-realness and freeze audit

Status: **TECHNICALLY COMPLETE / ENGLISH FROZEN / PERMANENT QLs ALLOCATED INACTIVE**

This record covers `SEA-CP-006 — Two parallel rows facing each other`. Solve/query/source/inverse/merge-gap implementation, learner-language hardening, manual English review and permanent inactive allocation are complete. Localization, Question Studio, Question Bank, mocks, staging and public delivery remain locked.

## Checkpoint boundary

CP006 owns equal parallel rows with the upper row facing south and the lower row facing north, for 3–6 seats per row. It owns row identity, person-relative same-row movement, opposite/corresponding positions, not-opposite, diagonal, same-row adjacency/gaps and source-backed endpoint-domain language.

Excluded by design:

- non-uniform, same-direction or mixed row facings -> `SEA-CP-007`;
- person-to-attribute layers -> `SEA-CP-011`;
- either/or, implication and genuinely conditional clues -> `SEA-CP-013`;
- data-sufficiency decision format -> Data Sufficiency chapter;
- exchange/rotation/hypothetical multi-model questions -> designated advanced seating checkpoint.

## Frozen solve authorities and permanent IDs

No merge or split is justified. Four permanent inactive QLs are allocated:

| Permanent QL | Blueprint authority | Solve contract |
|---|---|---|
| `SEA-QL-021` | `SEA-PBA-021` | fixed row membership with opposites |
| `SEA-QL-022` | `SEA-PBA-022` | row membership partly inferred |
| `SEA-QL-023` | `SEA-PBA-023` | same-row positional chains linked through opposite seats |
| `SEA-QL-024` | `SEA-PBA-024` | opposite/not-opposite/diagonal/endpoint composition |

Width is a size variant, not an authority: 3+3, 4+4, 5+5 and 6+6 use the same topology and solver contract.

Next available permanent seating ID: `SEA-QL-025`.

## Final clue ontology

The executable CP006 clue layer covers `ROW_MEMBERSHIP`, `OPPOSITE`, `NOT_OPPOSITE`, `SAME_ROW_RELATIVE`, `SAME_ROW_GAP`, `SAME_ROW_MIN_BETWEEN`, `SAME_ROW_EQUAL_GAP`, `NOT_ADJACENT`, `FACING_REFERENT_RELATIVE`, `END_POSITION`, `ROW_END_DISTANCE`, and `DIAGONAL`.

“An immediate neighbour of X faces Y” remains a language variant of the existing diagonal relation, not a duplicate solver family.

## Frozen query-contract inventory

No new query IDs are introduced. Frozen CP006 query inventory:

- `SEA-QC-003` — person-relative occupant;
- `SEA-QC-006` — immediate-neighbour pair;
- `SEA-QC-008` — ordinary linear count-between;
- `SEA-QC-010` — opposite/corresponding occupant;
- `SEA-QC-011` — same-row/different-row occupant;
- `SEA-QC-012` — diagonal occupant;
- `SEA-QC-014` — pair occupying designated positions, reused for facing-pair and row-end-pair forms;
- `SEA-QC-015` — relative-position phrase.

`SEA-QC-009` is not owned by CP006; frozen SEA-001 authority defines it as directional cyclic counting.

## Learner-language contract

Questions use compact exam-style SSC/Banking language. Internal engine language such as solver/oracle/blueprint/fingerprint/observer coordinates is prohibited from learner-facing prose.

The final shared-solution contract:

- starts with one compact working frame only;
- uses **position / positions** for learner-facing seat numbering;
- uses `Positions:` plus `P1`, `P2`, ... in diagrams;
- never exposes learner-facing `column` / `columns`;
- goes directly into case formation or positional deductions;
- uses `Position:` for deduction outcomes rather than `Result:`;
- states reference row/facing/position and resulting target position for person-relative clues;
- shows Case 1 / Case 2 / Case 3 only when genuine alternatives exist;
- groups repeated row-membership givens;
- ends at the final arrangement without generic closing filler.

Internal solver state may continue to use a coordinate field named `column`; that implementation term is not part of learner-facing output.

## Executable completion evidence before approval

- baseline 3+3: **48 caselets / 192 child questions**;
- wide 4+4–6+6: **24 / 96**;
- all-semantics source proof: **48 / 192**;
- completion saturation / inverse / metamorphic proof: **320 / 1,280**;
- compact source-essential exam-real proof: **320 / 1,280**;
- deterministic English review corpus: **100 / 400**.

Completion saturation proved 320 structural signatures, 120 essential clues, 16 rename-invariance checks, 16 mirror-metamorphic checks, 3,192 opposite involutions, 13,152 left/right inverse checks and 14,748 diagonal-symmetry checks.

Compact exam-real proof retained one solution-essential source-natural clue per caselet, reached all six source-essential clue families, produced 319 structural signatures, kept maximum displayed clues at 11 and exercised candidate-case teaching in 295/320 cases.

The English review corpus contains 25 cases per PBA, widths 3–6, all eight frozen query contracts, 15 normalized question surfaces, 36 normalized clue surfaces, 100 distinct structural fingerprints, 100/100 detailed position-first solutions and 88/100 explicit case-formation solutions.

## Signed English approval

The exact reviewed corpus is frozen by fingerprint:

`07216e2a08c198266bd25e40484a477d5c6e4de73b2dae06b8235fc3773a0c3e`

Approved artifact: `cp006-english-review-100`

Artifact ID: `9474071929`

Artifact ZIP digest:

`sha256:7e37d79da61f4b4edca8601e353cd1cf4b8fc1b85fa427dfd89591fa7f747ccc`

Reviewer: `gurudhiman75-hash`

Reviewed at: `2026-08-22T15:37:00+05:30`

Approval source: project owner approval in ChatGPT immediately after review of the exact position-wording artifact.

Decision: `100_ACCEPT_0_REWRITE_0_REJECT`.

The immutable reviewed artifact itself is not rewritten after approval. Approval is recorded separately in `review/approved-review.ts`. `buildApprovedCp006ReviewLedger()` recomputes the complete corpus fingerprint and throws if the current review content no longer matches the approved fingerprint.

## Permanent freeze implementation

- `review/approved-review.ts` — signed review record and 100-entry ACCEPT ledger;
- `permanent/registry.ts` — permanent inactive mapping `SEA-QL-021`..`SEA-QL-024`, next ID `SEA-QL-025`;
- `permanent/freeze.ts` — frozen solve inventory, query mix and English state;
- `cp006-freeze-proof.test.ts` — stale-review, mapping, duplicate-ID and downstream-inactivity proof;
- workflow includes the permanent freeze proof after the English review proof.

The pre-approval content/review head is already green on workflow `32565913630`. The post-approval freeze workflow is queued on GitHub for the final freeze head; until that runner completes, do not describe the new freeze proof itself as CI-verified.

## Lifecycle verdict

```text
technical CP006             COMPLETE
permanent QLs               SEA-QL-021..SEA-QL-024 ALLOCATED INACTIVE
solve inventory             FROZEN
query mix                   FROZEN
English freeze              FROZEN
Hindi/Punjabi freeze        false / NOT STARTED
Question Studio registered  false
Question Bank writable      false
mock-test eligible          false
production staging          false
public delivery             false
next permanent seating ID   SEA-QL-025
```

English freeze is an identity/content freeze only. No downstream surface becomes active without a separate explicit gate.
