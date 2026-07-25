# DIR-001 Foundation Implementation Report

Branch: `feat/dir-001-foundation`

## Implemented

- Need-based QL allocation policy with continuous permanent IDs after merge.
- Optional, open solve-mode identifiers rather than a fixed enum.
- Eight-direction compass model.
- Rotation in validated 45-degree increments.
- Left, right, about-turn and opposite-direction operations.
- Direction classification from coordinate signs with same-position support.
- Cartesian coordinate arithmetic.
- Physically correct diagonal movement components using `d / sqrt(2)`.
- Path operations with explicit absolute or relative headings.
- Explicit movement effect on facing direction.
- Deterministic path-state traces.
- Static entity-position graph solving with connectivity and contradiction detection.
- Endpoint, displacement, return-vector and relative-entity answer helpers.
- Generic four-option uniqueness and exactly-one-correct validation.
- Stable path and relation topology fingerprints.
- Standalone exhaustive foundation contract test.
- Need-based chapter runtime registry.
- Package and foundation entry points.
- First three need-proven English QLs under `DIR-CP-001`.

## Need-based policy correction

The earlier 240-QL table is not an implementation quota. `DIR-001-NEED-BASED-QL-POLICY.md` is an authoritative amendment. The machine-readable manifest exposes:

```text
fixedQlTotal: null
fixedSolveModeInventory: null
qlAllocation: NEED_BASED
solveModeAllocation: NEED_BASED_OPTIONAL
```

A new QL is permitted only after a material runtime difference is documented. A new solve mode is permitted only when a separate solver entry point or validation contract is required.

## Files added

```text
DIR-001-CHAPTER-MANIFEST.ts
DIR-001-NEED-BASED-QL-POLICY.md
chapter-registry.ts
index.ts
foundation/types.ts
foundation/directions.ts
foundation/coordinates.ts
foundation/path-state.ts
foundation/entity-position-graph.ts
foundation/answer-classifier.ts
foundation/option-validator.ts
foundation/fingerprint.ts
foundation/index.ts
foundation/foundation.test.ts
DIR-CP-001/rule-definitions.ts
DIR-CP-001/independent-solver.ts
DIR-CP-001/question-language.en.ts
DIR-CP-001/task-registry.ts
DIR-CP-001/generator.ts
DIR-CP-001/index.ts
DIR-CP-001/dir-cp-001.test.ts
DIR-CP-001/dir-cp-001-implementation-report.md
```

## Validation status

- Tests written: yes.
- Strict TypeScript source-equivalent compile: passed.
- Core foundation runtime assertions: passed.
- CP-001 source-equivalent runtime audit: passed for 600 cases.
- Answer-position balance defect found and corrected: yes.
- Exact tests executed from a checked-out repository: not yet.
- CI executed: not yet; the draft PR produced no matching workflow run.
- Production QLs implemented: 3 need-proven English QLs.
- Question Studio integration: not yet.

The local source-equivalent execution is evidence of code correctness, but it is not represented as repository CI or as execution from a full checked-out workspace.

## Next implementation boundary

Perform human review of the three CP-001 patterns and search real exam formats for any additional materially different orientation contract. Do not expand CP-001 by quota. When no further need is proven, proceed to CP-002 using the already implemented path foundation.
