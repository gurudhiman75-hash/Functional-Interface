# TRG-002 48-QL MVP Status

Status: **48-QL MVP IMPLEMENTED AND STATICALLY REMEDIATED — EXECUTION / RENDERED VISUAL INSPECTION / HUMAN REVIEW PENDING**

## Scope

`TRG-002 — Heights & Distances Applications` now has a composed 48-QL MVP candidate:

- TRG-CP-007: 12 permanent QLs
- TRG-CP-008: 12 permanent QLs
- TRG-CP-009: 12 permanent QLs
- TRG-CP-010: 12 permanent QLs
- total: **48 permanent English QLs**
- full production target remains 96

The audited 20 proof anchors are retained. The MVP adds 28 permanent roles selected from the Phase-0 allocation ledger.

## Active runtime surface

- permanent registry: `mvp-48-registry.ts`
- shared exact factory: `mvp-runtime-core.ts`
- composed math/diagram runtime: `mvp-runtime-48.ts`
- labelled solution-diagram delivery: `mvp-runtime-48-labelled.ts`
- exact added-QL label resolver: `mvp-diagram-label-core.ts`
- exact 28-added-QL label plans: `mvp-diagram-label-plans.ts`

The 20 proof anchors continue through `runtime-proof-solution-diagram.ts`; the 28 additions use the MVP factory and then receive the same solution-only disclosure policy.

## New MVP coverage

### CP-007

Added QLs: 002, 005, 009, 014, 018, 020, 024.

Coverage adds distinct direct/reverse elevation and depression roles, including exact surd height, clean 45-degree angle recovery, level-difference depression, and a reverse sloping-distance target.

### CP-008

Added QLs: 028, 032, 035, 038, 041, 043, 048.

Coverage adds:

- clean 45-degree shadow roles;
- changed-shadow two-state geometry;
- ladder foot-distance role with explicit canonical 60-degree angle;
- first BROKEN_TREE roles with canonical stump, break point and ground-touch point;
- additional mast/anchor role.

### CP-009

Added QLs: 052, 055, 058, 064, 067, 069, 071.

Coverage adds near/far distance targets, move-closer height, move-farther movement, original-distance recovery, movement recovery and a controlled two-object comparison.

### CP-010

Added QLs: 076, 081, 086, 091, 094, 095, 096.

Coverage adds eye-height distance recovery, unequal opposite-side observations, building separation, unequal elevation/depression, 30-degree river width, and two stacked composite vertical-object roles.

## Static remediation completed

Fresh implementation review found and corrected the following before this checkpoint:

- QL-024: removed equivalent `h√3` option collision and routed through clean reverse-distance authority.
- QL-035: replaced single-final-shadow geometry with canonical old + new shadow tips and both 45-degree/30-degree observations.
- QL-038: corrected distractor provenance and added its canonical 60-degree ladder angle to the solution geometry.
- QL-064: recalibrated Hard -> Medium; known height leads to two direct distances followed by subtraction.
- QL-076: removed a duplicate option caused by full-height and eye-height arithmetic coinciding.
- QL-094: removed a distractor collision and routed through clean river-width authority.
- QL-095: recalibrated Hard -> Medium; it is two direct standard-angle level calculations followed by subtraction.
- old compile-invalid CP-007 draft module was retired and removed; active CP-007 routes through compile-safe modules.

No known static mathematical/editorial blocker remains in the active 48-QL route at this checkpoint.

## Diagram policy

For all 48 MVP QLs:

- solution diagram: **REQUIRED**
- stem diagram: **OPTIONAL**, not automatic
- disclosure: **AFTER_ATTEMPT**
- canonical-state fingerprint binding remains required
- solution labels use exact canonical semantic sources or the exact answer
- solved target values are explanation-stage only

The 28 additions have explicit solution-label plans. The 20 proof anchors keep their existing annotation authority.

## Diagram coverage

The 48-QL MVP now represents all **14 locked TRG-002 diagram strategies**, including BROKEN_TREE for the first time.

`mvp-visual-review-14.ts` defines one representative for every locked strategy.

A supplementary special-form review set in `mvp-special-visual-review.ts` targets visually distinct high-risk subforms that share an existing strategy:

- changed shadow with two solar rays;
- ladder with explicit ground angle;
- broken-object stump/fallen-part geometry;
- stacked composite vertical object with roof junction and two sight lines.

Actual rendered visual inspection is still pending and is not replaced by these committed structural review fixtures.

## Gate targets

`mvp-runtime-48.test.ts` targets:

- 48 unique permanent IDs;
- 12 per CP;
- all 20 proof anchors preserved;
- 12 canonical seeds × 48 = **576 canonical cases**;
- 50 sweep seeds × 48 = **2,400 sweep cases**;
- canonical spatial and requested-target verification;
- required solution-diagram policy;
- no automatic stem diagram;
- four mathematically unique options and one correct option;
- difficulty-aware explanation depth;
- broken-object, comparative and composite regressions;
- clean QL-024 / QL-038 / QL-094 option authority;
- activation locks.

Additional committed gates:

- `mvp-label-smoke.test.ts` — exact solution-label smoke coverage for all 28 additions;
- `mvp-difficulty-regression.test.ts` — QL-064/095 Medium and QL-096 Hard;
- `mvp-visual-review-14.test.ts` — one labelled representative for every locked diagram strategy.

## Review truth

- static AI implementation/remediation review of the 28 additions: completed for this checkpoint;
- known static blocker count: 0;
- human reviewed: **0 / 48**;
- actual rendered diagram visual review: pending;
- production freeze eligible: **NO**.

Runtime review metadata remains conservative; this status document is not a substitute for human review.

## Execution truth

No execution pass is claimed unless an actual run is observed.

Current status before final CI lookup:

- strict TypeScript compile: NOT CLAIMED
- 576-case MVP gate: NOT CLAIMED
- 2,400-case sweep: NOT CLAIMED
- label smoke gate: NOT CLAIMED
- 14-strategy visual gate: NOT CLAIMED
- rendered visual inspection: NOT CLAIMED

## Activation

Still OFF:

- Question Studio discovery
- Test Builder eligibility
- question-bank storage
- public publication
- Hindi/Punjabi runtime

## Next checkpoint

1. obtain actual TypeScript/runtime execution evidence if available;
2. inspect rendered solution diagrams, especially the 14 strategy representatives and the four special forms;
3. perform the 48-QL human/editorial review;
4. only then consider expanding 48 -> 96 production QLs.
