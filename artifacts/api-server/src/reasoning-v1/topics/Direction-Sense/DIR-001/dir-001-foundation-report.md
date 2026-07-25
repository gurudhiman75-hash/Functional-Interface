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
- Package and foundation entry points.

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
```

## Validation status

- Tests written: yes.
- Static strict-TypeScript review: completed manually and two total-serialization defects corrected.
- Tests executed in a checked-out repository: not yet.
- CI executed: not yet.
- Production QLs implemented: none.
- Question Studio integration: not yet.

No unexecuted test is claimed as passing.

## Next implementation boundary

Before starting `DIR-CP-001`, execute the foundation test through the repository test runner and resolve any compile or runtime failure. Then research and allocate only the QLs that prove a distinct orientation/facing runtime need.
