# P&C Current-State Amendment — CP-011 Discovery

**Date:** 2026-07-27  
**Base:** `feat/pnc-002-cp010-circular-runtime-proof` at `713d761208ad7c64571aff0d7b0ac47b4d75924e`  
**Branch:** `feat/pnc-002-cp011-grouping-distribution`

## State change

`PNC-CP-011 — Grouping & Distribution` has moved from `Not started` to:

`EXECUTABLE DISCOVERY IN PROGRESS — NO PERMANENT QL IDS ALLOCATED`

The checkpoint adds an ownership document, provisional discovery matrix, exact formula prototype, independent enumerators, a proof test and a dedicated CI workflow.

## Verified discovery surface

The prototype currently exercises 35 formula-versus-independent-enumerator checks across:

- distinct objects into prescribed labelled/unlabelled groups;
- distinct objects into labelled boxes;
- distinct objects into identical boxes;
- identical objects into labelled boxes;
- identical objects into identical boxes;
- same-group/different-group restrictions;
- bounded inverse recovery.

## ID safety

- Current implemented family range remains `PNC-QL-001` through `PNC-QL-208`.
- No CP-011 QL has been admitted yet.
- The next available immutable ID remains `PNC-QL-209`.

## Release safety

- no generation-engine registration;
- no Question Studio exposure;
- no admin discovery;
- no public-test routing;
- no Hindi or Punjabi runtime;
- no claim of CP-011 saturation or implementation completion.

## Next gate

Audit the provisional contracts against target-exam references, freeze wording semantics for labelled versus unnamed groups, then admit the first need-based English QLs beginning at `PNC-QL-209`.
