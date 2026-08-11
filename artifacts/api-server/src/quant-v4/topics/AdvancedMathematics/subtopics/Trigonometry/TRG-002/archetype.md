# TRG-002 Archetype — Heights & Distances Applications

Status: **Phase 0 design lock**. No runtime completion is claimed.

## Package purpose

`TRG-002` owns competitive-exam line-of-sight applications in which a physical scene is reduced to one or more right triangles and solved using trigonometric ratios.

The package is spatially stricter than `TRG-001`: the canonical geometry state must exist before the stem, diagram, solver, options or explanation are rendered.

## Canonical spatial state

A generated problem must model, as applicable:

- horizontal ground/reference line;
- one or more vertical objects;
- object base and top points;
- one or more observers;
- observer eye height;
- target point for every line of sight;
- elevation/depression classification;
- sight-line angle;
- horizontal separation;
- movement direction/order for multiple observations;
- requested target quantity.

Prose must never be used as the authoritative geometry model.

## TRG-CP-007 — Single-Observation Elevation & Depression

Target: 24 QLs (`TRG-002-QL-001...024`).

Coverage:

- find height from horizontal distance and elevation angle;
- find horizontal distance from height and elevation angle;
- find a clean standard angle from height/distance relation;
- angle of depression with correct eye-level horizontal reference;
- reverse single-observation forms;
- simple top-of-object/ground-reference states.

Representative solve-mode contract:

- `findHeightFromElevation`
- `findDistanceFromElevation`
- `findAngleFromHeightDistance`
- `findHeightFromDepression`
- `findDistanceFromDepression`
- `solveSingleObservationReverse`

## TRG-CP-008 — Shadows, Ladders, Poles & Broken Objects

Target: 24 QLs (`TRG-002-QL-025...048`).

Coverage:

- height from shadow and solar elevation angle;
- shadow length from height and angle;
- changed-shadow problems;
- ladder against a vertical wall;
- guy wire/anchor applications;
- broken tree/pole touching the ground;
- flagpole/mast variants when mathematically distinct.

Physical feasibility is mandatory: ladder/wire must be long enough, break point must lie within the object, and contact points must match the intended right triangle.

## TRG-CP-009 — Two-Observation & Moving-Point Systems

Target: 24 QLs (`TRG-002-QL-049...072`).

Coverage:

- two observation points on the same side of an object;
- observer moves closer;
- observer moves farther;
- two known angles with known movement;
- find object height;
- find original distance;
- find movement/separation;
- controlled two-object comparison forms where the same geometry authority applies.

Point order is part of the canonical state and must be validated independently of prose.

## TRG-CP-010 — Observer Height, Opposite-Side & Composite Sight-Line Systems

Target: 24 QLs (`TRG-002-QL-073...096`).

Coverage:

- observer/eye height corrections;
- one building viewed from another;
- top/base observations;
- observation points on opposite sides of a vertical object;
- simultaneous elevation and depression;
- river/horizontal-separation forms;
- two vertical objects with controlled composite relations.

Observer height must be applied exactly once and the diagram must distinguish eye level from ground level.

## Preferred exact-angle policy

Production should heavily favour:

- `30°`
- `45°`
- `60°`

because they produce clean exact SSC/state-exam arithmetic.

`15°` and `75°` may be introduced only in controlled QLs after exact angle-sum support is proven.

Arbitrary calculator-style angles such as `37°` should not be used merely to create difficulty.

## Parameter-generation policy

Generate backwards from clean exact solutions whenever possible.

Examples:

- choose height and angle, derive exact distance;
- choose distance and angle, derive exact height;
- choose a clean pair of observation angles and a clean target, then derive the movement/separation.

Typical generation bands may include:

- pole/tree: 5–40 m;
- tower/building: 10–150 m;
- horizontal separation: 5–250 m;
- ladder/wire: 4–25 m;
- eye height: exact rational values such as 1.5 m, 1.6 m, 1.7 m.

These are content-quality bands, not mathematical limits.

## Scenario authority

Approved scenario families include:

- tower;
- building;
- pole/flagpole;
- tree;
- chimney;
- mast;
- wall;
- ladder;
- guy wire;
- shadow;
- broken tree/pole;
- river bank;
- two buildings;
- abstract observation point.

Scenario wording must make clear:

- where the observer stands;
- which point is observed;
- which distance is horizontal;
- whether eye height matters;
- whether multiple observations are same-side or opposite-side.

## Diagram strategy contract

Substantive `TRG-002` QLs should normally require a deterministic diagram.

Approved strategy families:

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

Diagram validation must check geometry, labels, angle placement, eye-level reference, point order, clipping and overlap.

## Difficulty contract

- Easy: one right triangle and one direct ratio.
- Medium: reverse target, shadow/ladder relation, or two linked steps.
- Hard: two observations, movement, observer-height correction, opposite-side geometry or composite sight lines.

Difficulty must not be created solely by larger numbers or awkward decimal angles.

## Stem contract

Typical target ranges:

- Easy: 18–35 words;
- Medium: 28–50 words;
- Hard: 40–75 words.

One or two precise sentences are preferred to decorative storytelling.

## Explanation contract

Reasoning nodes may include:

- `INTERPRET_GIVEN`
- `IDENTIFY_TRIANGLE_OR_RELATION`
- `SELECT_RATIO`
- `SUBSTITUTE`
- `ALGEBRAIC_TRANSFORM`
- `SIMPLIFY_EXACT_FORM`
- `ACCOUNT_FOR_OBSERVER_HEIGHT`
- `INTERPRET_PHYSICAL_RESULT`
- `SANITY_CHECK`

Explanations must explicitly identify why `tan`, `sin` or `cos` is appropriate when that choice is instructional.

## Distractor contract

Approved misconception families include:

- sine used instead of tangent;
- cosine used instead of tangent;
- height/distance swapped;
- depression angle measured from the wrong reference;
- observer height omitted;
- observer height applied twice;
- same-side distances added instead of subtracted;
- opposite-side distances subtracted instead of added;
- ladder treated as a horizontal side;
- broken upper part not added to the stump where required.

## Independent verification

Primary solution uses the package's trig solver.

Independent verification reconstructs observer/object coordinates and checks:

- horizontal/vertical distances;
- Euclidean sight-line length when relevant;
- `atan2`-derived angle against canonical angle;
- object height/observer height relationships;
- point ordering and same/opposite-side state.

Published answers remain exact even when the verifier uses floating-point tolerances.

## Activation

`TRG-002` remains inactive and unregistered until its diagram, engineering, mathematical and editorial gates are passed and explicit approval is recorded.
