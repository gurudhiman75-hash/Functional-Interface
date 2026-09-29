# SEA-001 — Deep Audit Wave 04

Date: 2026-09-29

Status: `NINE_PERMANENT_QLS_ALLOCATED__SOLVE_INVENTORY_AND_QUERY_MIX_FROZEN__PRODUCT_GATES_LOCKED`

## Permanent allocation

SEA-001 now has nine permanent learner contracts:

1. `SEA-QL-001` — endpoint identification;
2. `SEA-QL-002` — identify person at relative position;
3. `SEA-QL-003` — describe relative position;
4. `SEA-QL-004` — identify immediate neighbours;
5. `SEA-QL-005` — linear number-between;
6. `SEA-QL-006` — directional circular number-between;
7. `SEA-QL-007` — identify opposite person;
8. `SEA-QL-008` — directional ordered sequence;
9. `SEA-QL-009` — resolve facing state.

Permanent range: `SEA-QL-001..009`.

## Runtime ownership

Existing generated query contracts are mapped without changing topology or solver semantics:

- `SEA-QC-001` -> QL001;
- `SEA-QC-003`, `SEA-QC-005`, `SEA-QC-022` -> QL002;
- `SEA-QC-006` -> QL004;
- `SEA-QC-008` -> QL005;
- `SEA-QC-009` -> QL006;
- `SEA-QC-010` -> QL007;
- `SEA-QC-020` -> QL008.

Review-extension ownership:

- extreme-end pair -> QL001;
- relative-position description -> QL003;
- definitely-true relation statement -> QL003;
- facing-direction count -> QL009;
- end-person + facing -> QL009.

## Practice-only transformed-state variant

`SEA-QC-022` asks the learner to flip everyone’s facing and then solve a relative-position query.

It remains a practice variant inside QL002 and does not receive a separate permanent identity.

No recurring source evidence was found that justified a separate mock-authentic QL for this shell.

## Planning-only IDs

The following declared query IDs remain unallocated because no generated evidence exists:

- `SEA-QC-004`
- `SEA-QC-014`
- `SEA-QC-015`

An unused planning ID is not evidence for a learner contract.

## Lifecycle reconciliation

All checkpoint lifecycle records now report nine permanent QLs.

The package-level states are:

- solve inventory: `FROZEN`;
- query mix: `FROZEN`;
- English freeze: `NOT_STARTED`;
- Question Studio: not registered;
- Question Bank: locked;
- test/mock eligibility: locked;
- public/student publication: locked.

Historical implementation-evidence documents that state zero permanent QLs remain valid snapshots of the earlier discovery phase; this Wave 04 authority supersedes their lifecycle count for current state.

## Backward compatibility

Permanent allocation does not alter:

- hidden-state generation;
- clue selection;
- production solvers;
- independent oracles;
- option semantics;
- correct answers;
- clue sensitivity;
- diagrams;
- existing child-query text.

The QL registry is an ownership layer over already verified learner operations.

## Next audit wave

Wave 05 should focus on:

- English editorial quality across CP001–CP005;
- explanation concision and pedagogical usefulness;
- diagram placement/policy;
- distractor realism and misconception provenance;
- structural Easy/Medium/Hard calibration;
- English review freeze;
- only then Hindi/Punjabi localization/parity and Question Studio review integration.

## Novelty

Novel seating questions remain deferred to the later cross-chapter novelty pass.

## Result

`SEA_001_NINE_QL_ALLOCATION_COMPLETE__ENGLISH_FREEZE_NEXT`
