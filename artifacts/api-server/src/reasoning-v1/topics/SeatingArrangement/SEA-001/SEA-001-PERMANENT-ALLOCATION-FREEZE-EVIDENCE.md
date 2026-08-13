# SEA-001 — Permanent QL Allocation and English Freeze Evidence

Authority: **SEA Seating Arrangement Master End-to-End Family Design V3 (merged)**.

Status: **PERMANENT QL IDS ALLOCATED; SOLVE INVENTORY / QUERY MIX / ENGLISH FROZEN; INACTIVE**.

## Prerequisite closure

The exact final balanced 100-caselet English review corpus was approved by the project owner and recorded with a content-fingerprinted ledger:

- reviewer: `gurudhiman75-hash`;
- review decision: 100 `ACCEPT`, 0 `PENDING`, 0 `REWRITE`, 0 `REJECT`;
- reviewed at: `2026-08-13T07:56:00+05:30`;
- approved review fingerprint: `e3a4bdcd5c3afb656bed4a695e50f2f4218e45907647e23d8c733feffb59ca22`;
- approved review artifact SHA-256: `68972a48f078118b45fffbd69e6552b66c71a2373df741e678270de3657f29cf`.

The approval fails closed if the reviewed content fingerprints no longer match.

## Permanent solve-inventory allocation

The V3 merge/split audit retains every named `SEA-PBA-001` through `SEA-PBA-020` as a distinct solve authority:

- retained authorities: 20;
- merge candidates: 0;
- split candidates: 0.

Accordingly, permanent identities are allocated one-to-one, in authority order:

- `SEA-PBA-001 -> SEA-QL-001`;
- ...
- `SEA-PBA-020 -> SEA-QL-020`.

The next unused permanent identity is `SEA-QL-021`.

The registry is implemented in `permanent/registry.ts`. Historical discovery generators and their embedded lifecycle records are intentionally not rewritten; the permanent registry is a separate inactive layer so the approved discovery/review evidence remains reproducible.

## Solve-inventory freeze

`permanent/freeze.ts` freezes:

- 20 permanent QLs;
- exactly 20 retained solve authorities;
- zero merges;
- zero splits;
- each permanent QL's checkpoint, PBA authority contract and defining discriminators.

`sea-001-permanent-allocation-freeze-proof.test.ts` recomputes the real 1,600-caselet production corpus and the merge/split audit. The proof fails if any permanent solve authority disappears, merges, splits or changes its defining contract.

## Query-mix freeze

Each caselet remains a four-child passage. The owned query-contract sets are frozen as follows:

- `SEA-CP-001`: QC001, QC002, QC003, QC005, QC007, QC008, QC014, QC015, QC016, QC017, QC019, QC020, QC021;
- `SEA-CP-002`: QC003, QC005, QC006, QC008, QC015;
- `SEA-CP-003`: QC003, QC004, QC006, QC009, QC010, QC020;
- `SEA-CP-004`: QC003, QC006, QC009, QC010, QC020;
- `SEA-CP-005`: QC003, QC005, QC006, QC010, QC020, QC022.

The permanent freeze proof compares these frozen sets against the contracts actually reached by the real saturation corpus.

## English freeze

English is frozen for the approved `en-IN` student-facing presentation:

- teaching style: `PLAIN_TEACHER`;
- clue-by-clue coaching solution;
- question-specific correct-answer explanation;
- student-friendly wrong-option explanation;
- signed approval fingerprint is part of the freeze authority.

The diagram-enhanced HTML used in manual review is reviewer evidence. Native Question Studio/runtime diagram support is **not** activated by this freeze and remains a separate downstream product-integration concern.

Any generated-content or teaching-explanation change that changes a reviewed fingerprint invalidates the signed review rather than silently inheriting the freeze.

## Lifecycle after freeze

```text
Permanent QLs:                 20 (SEA-QL-001..SEA-QL-020)
Next permanent QL:             SEA-QL-021
Signed English review:         APPROVED — 100/100 ACCEPT
Solve-inventory freeze:        FROZEN
Query-mix freeze:              FROZEN
English freeze:                FROZEN
Localization:                  NOT_STARTED
Question Studio registration:  false
Question Bank writes:          false
Mock-test eligibility:         false
Public publication:            false
```

This is a **permanent-but-inactive** freeze. Allocation/freeze does not authorize activation. Localization and downstream activation/publication remain separate gates.

The PR must remain draft/unmerged unless an explicit later instruction changes that state.
