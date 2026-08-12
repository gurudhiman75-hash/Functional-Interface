# TRG-002 Phase 5 Self-Review

Status: **TWO FOUNDATION DEFECTS FOUND AND CORRECTED BEFORE PR**

## 1. Physical-feasibility guards

The first exact solver implementation could algebraically produce a state from invalid inputs such as:

- zero movement;
- zero observer separation;
- zero ladder length;
- a claimed `move closer` system where the near angle was actually smaller than the far angle.

That is mathematically computable in some cases but physically invalid for Heights & Distances content.

The solver layer now rejects these states before they can become canonical geometry.

Guarded conditions include:

- positive horizontal/vertical working distances;
- non-negative observer eye height;
- positive ladder/wire length;
- positive sine/cosine for the ladder geometry used here;
- positive observer movement;
- `near elevation angle > far elevation angle` for a closer same-side observation;
- positive opposite-side observer separation;
- positive solved observer distances and vertical delta.

`spatial/foundation.test.ts` now contains four explicit rejection checks for these conditions.

## 2. Exact-zero eye-height semantics

The first `buildSingleElevationState(...)` selected `SINGLE_ELEVATION` vs `OBSERVER_HEIGHT` by JavaScript object identity:

`eyeHeight === ground`

That works when the default zero object is reused, but fails if a caller explicitly supplies another exact-number object representing zero.

The builder now compares mathematical exact keys instead. Therefore:

- omitted eye height `0` → `SINGLE_ELEVATION`
- explicitly supplied exact `0` → `SINGLE_ELEVATION`
- positive eye height → `OBSERVER_HEIGHT` unless a strategy is explicitly supplied

A regression assertion now locks this behavior.

## Result

The Phase-5 branch now has:

- 6 positive canonical-scene fixtures;
- 3 verifier tamper/rejection fixtures;
- 4 physical-feasibility input rejection fixtures;
- 1 explicit exact-zero strategy regression;
- 14 diagram-strategy name locks.

No test execution pass is claimed until the suite actually runs.