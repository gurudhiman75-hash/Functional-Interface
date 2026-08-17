# TRG-002 Production-96 Status

Status: **96 ENGLISH PERMANENT QLS IMPLEMENTED — RUNTIME PASS — NEW 48 AI/EDITORIAL PASS — REPRESENTATIVE REAL-APP VISUAL CI PASS — HUMAN REVIEW PENDING**

## Production allocation

`TRG-002 — Heights & Distances Applications` has the complete English production surface:

- `TRG-CP-007`: QL-001..024 — **24 / 24**
- `TRG-CP-008`: QL-025..048 — **24 / 24**
- `TRG-CP-009`: QL-049..072 — **24 / 24**
- `TRG-CP-010`: QL-073..096 — **24 / 24**
- total permanent English QLs: **96 / 96**

The surface remains split into:

- **48 previously human-approved and frozen QLs**;
- **48 Phase-8 expansion QLs**, runtime-gated and AI/editorially gated, but still human-review pending and unfrozen.

## Frozen baseline integrity

The frozen 48 remain bound to approved content fingerprint:

`b60217f9b29af79435ab065e4c64c40449dc43df2fa9646b055f41763bce04db`

The production gate re-verifies that baseline and fails on drift.

## Latest substantive green checkpoint

Source head:

`64e270debbc15442add122867d0f6158a7c5be33`

Workflow run:

`32027641399` — `Verify TRG-002 Production 96` — **SUCCESS**

Passed on that head:

- targeted TRG-002 TypeScript compile;
- frozen-48 approval fingerprint re-verification;
- 96-ID registry reconciliation;
- exact 48 frozen + 48 expansion partition;
- 24 QLs per CP;
- all 48 expansion generator preflights;
- 48 distinct expansion solve modes;
- zero normalized expansion-stem duplicate groups;
- canonical spatial validation;
- independent answer reconstruction;
- solution-diagram and diagram-policy verification;
- unique four-option structure with exactly one correct option;
- activation-lock checks;
- **1,152 production sweep cases** across all 96 QLs;
- **576 Phase-8 editorial cases**;
- exact-presentation and normalized-stem uniqueness checks;
- named/distinct distractor misconception checks;
- hard-question explanation-depth checks;
- numeric article-grammar regression coverage across the Phase-8 seed sweep;
- deterministic **48-record** editorial review export and verification.

The editorial polish now covers generated vowel-sound numeric wording such as `an 8 m tower` and `an 18 m ...`; the regression gate caught and prevented additional seed variants rather than only patching one designated record.

### Exact-head artifacts

Production execution evidence:

- id: `9287666578`
- digest: `sha256:a4c58e75ffabac2fb637cd66bde8a9168f81d50ef6b2230ef8c1bd21cc8e9b1d`

Phase-8 editorial review pack:

- id: `9287666964`
- digest: `sha256:cc4039e89affec7b136471139bfc63db6c7b5cceaf81ad0e4fcd79db3d07b866`

Representative real-app visual evidence:

- id: `9287715888`
- digest: `sha256:a745380e8208041103989f8cccff93f6237a13a7c2be44eb78f591c4bee13ac0`

## Representative real ExamTree visual gate

The browser gate covers **14 new QLs representing all 14 Phase-8 solution-diagram strategies**:

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

For every representative, CI:

- builds the real ExamTree student app with the E2E auth path;
- opens the real `/test/:id` student route and enters Practice mode;
- answers the exact runtime-derived question;
- proves the solution diagram is hidden before `Show Solution`;
- renders the exact runtime-derived solution directive after disclosure;
- verifies QL and strategy metadata;
- verifies visible SVG geometry and no diagram horizontal overflow at **390 × 844**;
- saves one mobile screenshot and one evidence JSON record.

Latest result: **PASS — 14 / 14 representatives, 14 / 14 screenshot records, 14 / 14 evidence JSON records.**

This is representative automated render evidence only. It does not claim visual approval for every generated seed and does not substitute for human visual review.

## Review truth for the new 48

Current governance boundary:

- runtime validation: **PASS**
- AI/editorial review: **PASS**
- representative automated real-app visual gate: **PASS**
- human editorial review: **PENDING**
- human visual review: **PENDING**
- freeze status: **NOT FROZEN**
- freeze eligible: **false**
- per-generated-seed visual PASS: **NOT CLAIMED**

No automated or AI result is treated as explicit human approval.

## Activation boundary

Still OFF for the complete 96-QL package:

- Question Studio discovery
- Test Builder eligibility
- question-bank storage
- public publication
- Hindi/Punjabi runtime

## Next controlled checkpoint

Perform human editorial and visual review of the **48 Phase-8 expansion QLs** using the regenerated review pack and representative screenshot evidence. Only explicit human approval may authorize freezing those 48. Activation remains a separate later decision and must stay OFF unless specifically authorized.
