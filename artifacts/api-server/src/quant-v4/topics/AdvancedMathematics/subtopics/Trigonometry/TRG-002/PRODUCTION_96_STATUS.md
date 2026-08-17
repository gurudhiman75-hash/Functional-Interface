# TRG-002 Production-96 Status

Status: **96 ENGLISH PERMANENT QLS IMPLEMENTED — RUNTIME PASS — NEW 48 AI/EDITORIAL PASS — REPRESENTATIVE REAL-APP VISUAL CI PENDING**

## Production allocation

`TRG-002 — Heights & Distances Applications` now has the complete Phase-0 English ID surface:

- `TRG-CP-007`: QL-001..024 — **24 / 24**
- `TRG-CP-008`: QL-025..048 — **24 / 24**
- `TRG-CP-009`: QL-049..072 — **24 / 24**
- `TRG-CP-010`: QL-073..096 — **24 / 24**
- total permanent English QLs: **96 / 96**

The production surface is deliberately split into:

- **48 previously human-approved and frozen QLs**, routed through `mvp-human-approved-runtime.ts`;
- **48 Phase-8 expansion QLs**, now runtime-gated and AI/editorially gated but still human-review pending and unfrozen.

## Frozen baseline integrity

The frozen 48 remain bound to approved content fingerprint:

`b60217f9b29af79435ab065e4c64c40449dc43df2fa9646b055f41763bce04db`

Phase 8 does not rewrite their approved stems, options, answers, explanations, canonical geometry, diagrams, or validation content. The production gate compares the frozen approved content projection and fails on drift.

## Runtime evidence

Verified runtime source head:

`f81e040c809c25141df8797d3d6fa66a639bc4b3`

Workflow run:

`31988969366` — `Verify TRG-002 Production 96`

Passed on that head:

- targeted TRG-002 TypeScript compile;
- frozen-48 human-approval fingerprint re-verification;
- 96-ID registry reconciliation;
- exact 48 frozen + 48 expansion partition;
- 24 QLs per CP;
- all 48 expansion generator preflights;
- 48 distinct expansion solve modes;
- zero normalized expansion-stem duplicate groups;
- canonical spatial validation;
- independent answer reconstruction;
- solution-diagram and diagram-policy verification;
- unique four-option structure with one correct option;
- activation lock checks;
- **1,152 production sweep cases** across all 96 QLs.

Runtime execution artifact:

- id: `9274671403`
- digest: `sha256:38b8da135b60f82cc2b76b87360b554bf6c34a7afd0c86d4d89af3cc679b5e25`

## Phase-8 AI/editorial evidence

Latest green editorial source head:

`7f6cc189ba13101e3ae968a5e301c4aad95f6799`

Workflow run:

`31989332232` — **SUCCESS**

That run re-proved the frozen baseline and production runtime, then passed:

- **576 Phase-8 editorial cases**;
- exact-presentation checks;
- unique four-option presentation after editorial formatting;
- named and distinct distractor misconception roles;
- hard-question explanation-depth checks;
- normalized editorial-stem uniqueness;
- deterministic export of one designated runtime record for every new QL;
- verification of the complete **48-record editorial review pack**.

Editorial review artifact:

- id: `9274809344`
- digest: `sha256:a31168279eee73d42e5ad172855781f78b8dd5ca4ef3966e8660639d5a2d6542`

Editorial execution artifact:

- id: `9274809311`
- digest: `sha256:183f7f46ff3f47da70c7517547a17018ec041b5cc1515a137c3bc5510d9d6212`

After that green checkpoint, only minor presentation polish was added for numeric article grammar such as `an 8 m shadow` / `an 18 m supporting wire`, together with the real-app visual workflow wiring. The current branch therefore requires exact-head re-verification before those latest presentation changes are treated as a new final green head.

## Representative real ExamTree visual gate

The branch now contains `scripts/e2e/tests/trg002-production-wrapper.spec.ts` and the dependent `browser-expansion` workflow job.

The designated set contains **14 new QLs covering all 14 solution-diagram strategies present in the Phase-8 expansion**:

- single elevation;
- single depression;
- shadow;
- ladder;
- broken tree;
- guy wire;
- same-side two observations;
- observer moves closer;
- observer moves farther;
- building-to-building;
- observer-height correction;
- opposite-side observations;
- combined elevation and depression;
- river width.

For each representative, the automated browser gate is designed to:

- build the real ExamTree student app with the proven E2E Firebase/auth environment;
- open the real `/test/:id` student route;
- enter Practice mode;
- answer the exact runtime-derived question;
- prove the solution diagram is hidden before `Show Solution`;
- render the exact runtime-derived solution directive after disclosure;
- verify QL and strategy metadata;
- verify visible SVG geometry and no diagram horizontal overflow at **390 × 844**;
- save one mobile screenshot plus one evidence JSON record.

Current result: **CI PENDING / QUEUED** because the repository currently has many other Actions consuming runners. This is not counted as a visual PASS yet.

## Review truth for the new 48

Current governance boundary:

- latest green AI/editorial status: **PASS**
- current-head editorial re-verification after minor presentation polish: **PENDING**
- human review status: **PENDING**
- freeze status: **NOT FROZEN**
- freeze eligible: **false**
- per-generated-seed visual PASS: **NOT CLAIMED**
- representative automated real-app visual PASS: **PENDING**
- human visual review: **PENDING**

AI/editorial review and automated browser rendering do **not** substitute for explicit human approval.

## Activation boundary

Still OFF for the complete 96-QL package:

- Question Studio discovery
- Test Builder eligibility
- question-bank storage
- public publication
- Hindi/Punjabi runtime

## Next controlled checkpoint

Complete exact-head CI including the 14-strategy real ExamTree browser job and record its screenshot artifact if green. Human approval and freeze of the 48 new QLs remain separate later checkpoints and must not be inferred from runtime/editorial/browser automation.
