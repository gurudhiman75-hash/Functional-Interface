# MEN-001 CP-001 to CP-004 Exhaustiveness Audit

Status: runtime-proof implementation and generated-content audit complete.

## Audit principle

A solve-mode set is not considered exhaustive merely because every existing QL has a handler. Exhaustiveness is judged against the canonical-problem ownership boundary and common SSC, Banking and Punjab-state mensuration families.

This expansion is additive. Previously validated solve modes and QLs remain intact; missing families are supplied through a separate registry, QL library, task registry, misconception library and validation layer.

## CP-001 — Triangle Measurement Systems

Added:

- perimeter from three sides;
- right-triangle hypotenuse from perpendicular legs;
- missing perpendicular leg from hypotenuse and one leg;
- exact equilateral height from side;
- equilateral side from exact area.

Still excluded by ownership:

- angle, similarity, congruence and theorem problems belong to Geometry;
- area from two sides and included angle belongs to Trigonometry.

## CP-002 — Quadrilateral Measurement Systems

Added:

- square side from perimeter;
- rhombus area from base and perpendicular height;
- kite perimeter from the two equal adjacent-side pairs;
- trapezium perimeter from all four sides.

Existing coverage already includes rectangle, square, parallelogram, rhombus, trapezium, kite and diagonal-plus-perpendicular quadrilateral area families.

Theorem/property reasoning remains owned by Geometry.

## CP-003 — Circles, Arcs, Sectors and Annular Regions

Added:

- diameter from circumference;
- diameter from area;
- radius from arc length and central angle;
- radius from sector area and central angle;
- inner radius from annular area and outer radius;
- wheel revolutions from distance;
- wheel radius from distance and revolutions.

All circular runtime questions explicitly state and validate `π = 22/7`.

Chord, tangent, cyclic-quadrilateral and circle-theorem reasoning remain owned by Geometry.

## CP-004 — Paths, Borders, Flooring, Fencing and Cost

Added:

- outside rectangular path width from area;
- inside rectangular path width from area;
- outside circular path width from area;
- inside circular path width from area;
- crossed-road union area with overlap correction;
- remaining field area after crossed roads;
- uncovered floor area after partial tiling;
- area rate from total cost;
- fencing rate from total cost;
- inside rectangular-path paving-tile count.

The parallel CP-004 implementation had already added uncovered floor area after a mat, painting cost excluding a door, outside-path paving tiles and multiple-round fencing cost; these are retained.

## Shared-contract changes

- `RATE` is a first-class answer dimension.
- `₹/m²` and `₹/m` are first-class rate units.
- `revolutions` is a first-class count unit and is not represented as tiles.
- exact `√3` length answers are supported for equilateral height.
- QL, task-registry and solve-mode inventories remain exhaustive mirrors.
- every QL declares exactly three named misconception strategies.
- question stems remain text-only; explanation diagrams are emitted only for reverse radius/width and border-subtraction reasoning where they materially help.
- explanation diagrams preserve the source measurement unit even when the answer is a count or rate.

## Ownership boundaries retained

- CP-005 owns irregular composite, inscribed, shaded and regular-polygon figures.
- CP-006 owns mixed-unit conversion, shape-specific scaling, wire reshaping and boundary-conservation transformations.
- Geometry owns theorem/property reasoning.
- Trigonometry owns `1/2 ab sin C` and trig-ratio side recovery.

## Verified checkpoint

Final audited runtime snapshot:

- 4 active canonical problems;
- 125 active English QLs;
- 106 registry-derived solve modes;
- 2,500 deterministic generated questions at 20 seeds per QL;
- 375 generated human-review samples at 3 samples per QL.

The dedicated MEN-001 workflow verified:

- every active QL has exactly one task contract and one runtime solve mode;
- every registered solve mode has active QL coverage;
- deterministic generation and option order;
- exact answer/unit contracts including rates, revolutions and surds;
- no duplicate or correct-answer-colliding misconception option;
- shape and area conservation for reverse path, road, annulus, tiling and rate families;
- explicit `π = 22/7` policy for circular runtime questions;
- explanation-illustration necessity, accessibility, source-unit correctness and font neutrality;
- English-only, unpublished runtime-proof status.

Generated-content review also tightened reverse-rate distractors and corrected a count-answer diagram that had inherited centimetres instead of the metre units stated in its stem.
