# TRG-002 Phase 5 — Spatial / Diagram Foundation Status

Status: **IMPLEMENTED AS FOUNDATION ONLY — NO TRG-002 QLS OR ACTIVATION**

## Purpose

Phase 5 establishes the canonical geometry authority required before any Heights & Distances stem, solver, option set, explanation or diagram is generated.

The governing rule is now encoded in runtime contracts:

> canonical coordinates first; prose and diagrams are projections of that state, never independent geometry authorities.

## Files

- `spatial/types.ts`
- `spatial/solver.ts`
- `spatial/builders.ts`
- `spatial/verifier.ts`
- `spatial/diagram.ts`
- `spatial/index.ts`
- `spatial/foundation.test.ts`

## Canonical state model

The foundation models:

- exact x/y coordinates;
- ground reference line;
- vertical-object base/top points;
- observers and eye heights;
- elevation/depression observations;
- exact sight-line angle authority;
- same-side/opposite-side metadata;
- observer movement and point order;
- requested target quantity;
- deterministic diagram strategy.

All distances/heights are backed by the existing TRG exact-number authority rather than JavaScript floating-point values.

## Exact solver primitives

Implemented:

- vertical delta from horizontal distance + angle;
- horizontal distance from vertical delta + angle;
- single-elevation height including eye height;
- single-depression target height;
- shadow height / shadow length;
- ladder vertical height and base distance;
- same-side two-observation system;
- opposite-side two-observation system;
- clean 30°/45°/60° angle recovery from an exact rise/run ratio.

The same-side and opposite-side systems solve algebraically in exact trig-number form.

## Canonical scene builders

Implemented foundation builders for:

- single elevation;
- single depression;
- observer-height elevation;
- same-side observer moving closer;
- opposite-side observations;
- ladder against a wall.

These builders produce canonical state only. No exam QL is claimed from them yet.

## Independent verifier

`verifyTrg002SpatialState(...)` independently reconstructs/checks:

- unique point IDs;
- finite coordinates;
- ground-point placement;
- vertical-object x alignment;
- object-height consistency;
- eye point directly above observer ground point;
- eye height applied exactly once;
- non-zero horizontal sight-line separation;
- elevation/depression sign from coordinate direction;
- sight-line angle through numeric `atan2` reconstruction;
- movement distance;
- closer/farther movement direction;
- declared point order;
- object-between-observers constraint for opposite-side scenes.

The verifier does not trust the future question stem or the primary algebraic solver.

## Diagram authority

All 14 Phase 0 strategies are represented in the type contract:

- `SINGLE_ELEVATION`
- `SINGLE_DEPRESSION`
- `SHADOW`
- `LADDER`
- `BROKEN_TREE`
- `GUY_WIRE`
- `TWO_OBSERVATIONS_SAME_SIDE`
- `OBSERVER_MOVES_CLOSER`
- `OBSERVER_MOVES_FARTHER`
- `OPPOSITE_SIDE_OBSERVATIONS`
- `OBSERVER_HEIGHT`
- `BUILDING_TO_BUILDING`
- `ELEVATION_AND_DEPRESSION`
- `RIVER_WIDTH`

`buildTrg002DiagramSpec(...)` derives a deterministic normalized diagram from canonical coordinates and can emit:

- ground segment;
- vertical-object segments;
- sight lines;
- explicit eye-level horizontal references;
- angle markers;
- observer movement segments;
- ladder/shadow/wire segments when applicable;
- de-duplicated point labels.

`validateTrg002DiagramSpec(...)` checks viewport containment, endpoint integrity, label anchors and one eye-level/sight-line pair per angle marker.

## Regression fixtures committed

`spatial/foundation.test.ts` contains positive fixtures for:

1. 20 m horizontal distance at 45° → 20 m rise;
2. observer eye height 1.5 m + 10 m at 45° → 11.5 m object height;
3. 45° depression from 10 m eye height over 10 m horizontal distance;
4. same-side 30° → 60° observation after moving 20 m closer → 30 m / 10 m distances and 10√3 m vertical delta;
5. symmetric 45°/45° opposite-side system over 20 m separation → 10 m + 10 m and 10 m height delta;
6. 10 m ladder at 30° → 5 m vertical reach and 5√3 m base distance.

Negative/tamper fixtures require rejection of:

- elevation mislabeled as depression;
- closer movement mislabeled as farther;
- opposite-side object moved outside the observer interval.

The fixture also locks the 14 diagram-strategy names.

## Execution evidence

The tests are committed as executable evidence.

No execution pass is claimed yet. The current environment cannot clone the GitHub repository because external DNS/network resolution is unavailable, and no GitHub Actions run has been observed for this Phase-5 branch.

Therefore:

- strict TypeScript compile: **NOT CLAIMED**
- spatial foundation fixture execution: **NOT CLAIMED**
- GitHub Actions pass: **NOT CLAIMED**

## QL / editorial state

- TRG-002 production target: **96 QLs**
- TRG-002 runtime QLs implemented in Phase 5: **0**
- AI QL review: **0 / 96**
- human review: **0 / 96**

Phase 5 is infrastructure only.

## Activation

Still OFF:

- Question Studio discovery
- Test Builder eligibility
- question-bank storage
- public publication
- Hindi/Punjabi runtime

No registration or activation file is changed.

## Next checkpoint — Phase 6 runtime proof

Target: approximately **20 permanent English QLs**, roughly five per CP.

Unlike the early TRG-001 proof strategy, the TRG-002 proof should **sample across locked subfamilies rather than consume the first five contiguous IDs of each CP**. This prevents a proof implementation from accidentally redefining permanent QL-family allocations.

Suggested representative proof IDs:

### CP-007
- `QL-001` height from elevation
- `QL-007` distance from elevation
- `QL-012` clean angle from height/distance
- `QL-015` depression height
- `QL-023` reverse/combined single observation

### CP-008
- `QL-025` shadow → height
- `QL-030` height → shadow
- `QL-033` changed-shadow relation
- `QL-036` ladder
- `QL-045` guy wire / anchor

### CP-009
- `QL-049` same-side two observations
- `QL-056` move closer
- `QL-061` move farther
- `QL-065` original distance
- `QL-068` movement/separation

### CP-010
- `QL-073` eye-height correction
- `QL-078` opposite-side observations
- `QL-083` building-to-building
- `QL-088` elevation + depression
- `QL-092` river width / horizontal separation

Broken-object and composite-vertical-object families remain mandatory for subsequent MVP/production expansion even though the 20-QL proof cannot sample every locked family.