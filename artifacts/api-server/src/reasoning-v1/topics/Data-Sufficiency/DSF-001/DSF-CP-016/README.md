# DSF-CP-016 — Data Sufficiency Closure Policy

## Status

**CLOSURE POLICY FOUNDATION — NOT A CHAPTER CLOSURE CLAIM**

CP016 is intentionally implemented independently from still-unmerged CP011–CP015 feature branches. Its first responsibility is to define what evidence is required before anyone may call the expanded DSF chapter closed.

The policy uses synthetic fixtures only. It contains no hard-coded live PR/run ledger and therefore cannot become stale merely because a feature branch advances.

## Two closure levels

### 1. Implementation closure

`implementationClosureReady` requires:

- exact evidence for DSF-CP-011 through DSF-CP-015;
- every required checkpoint marked `EXECUTABLE_GREEN`;
- a positive executable run id and full 40-character exact head for every green checkpoint;
- current permanent semantic identities exactly `DSF-QL-001` and `DSF-QL-002`;
- next available identity exactly `DSF-QL-003`; and
- all learner-delivery lifecycle capabilities locked false.

A checkpoint may record an explicit external source-authority hold without failing implementation closure. This is for gaps such as Geometry or a generic puzzle family where DSF correctly refuses to invent a duplicate truth engine.

### 2. Common-base closure

`commonBaseClosureReady` additionally requires every CP011–CP015 checkpoint to report `mergedToCommonBase: true`.

This prevents exact-head green feature work from being misrepresented as if it already coexisted on `New-main`.

## Learner release remains separate

`learnerReleaseReady` is deliberately hard-coded to `false` in this closure policy.

Chapter implementation closure does not authorize:

- Question Studio discovery;
- Question Bank writes;
- scored tests;
- mock tests;
- public publication; or
- automatic student delivery.

Those capabilities require their own governed downstream checkpoints.

## Policy audit

The deterministic test suite verifies:

1. all-green but unmerged feature evidence may reach implementation closure while common-base closure remains false;
2. all-green merged evidence can reach common-base closure;
3. missing QL002 or a wrong next-Ql identity blocks closure;
4. a pending CP015 blocks closure;
5. any accidentally opened learner lifecycle capability blocks closure;
6. duplicate checkpoint evidence is rejected;
7. duplicate permanent QL identities are rejected; and
8. source-authority holds remain visible in the assessment.

All test run ids and SHAs are unmistakably synthetic fixture values; live checkpoint evidence will be supplied only by a later integration ledger once the feature branches are ready to coexist.

## Current external source holds observed during design

These are examples for the closure policy, not imported source code:

- Geometry DS: no canonical merged `GEO-001`/Geometry solver authority currently discoverable.
- Generic floor/box/scheduling puzzle DS: no standalone merged source solver authority currently discoverable; searches resolve to Seating or generic generator infrastructure.

If source authority appears before final common-base closure, these holds should be re-audited rather than carried forward mechanically.
