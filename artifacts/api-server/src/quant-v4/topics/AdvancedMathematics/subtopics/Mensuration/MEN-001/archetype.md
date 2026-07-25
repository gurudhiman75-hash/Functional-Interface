# MEN-001 — Plane Mensuration & Boundary Transformations

## Purpose

Generate SSC, Banking and Punjab-state-exam style plane-mensuration questions with exact mathematics, dimensional unit safety, realistic stems and question-specific explanations.

## Canonical problems

- `MEN-CP-001` — Triangle Measurement Systems.
- `MEN-CP-002` — Quadrilateral Measurement Systems.
- `MEN-CP-003` — Circles, Arcs, Sectors & Annular Regions.
- `MEN-CP-004` — Paths, Borders, Flooring, Fencing & Cost.
- `MEN-CP-005` — Composite, Inscribed & Regular Plane Figures.
- `MEN-CP-006` — Boundary Conservation, Scaling & Unit Transformation.

## Active runtime-proof scope

`MEN-CP-001` through `MEN-CP-006` are active.

Current checkpoint:

- 194 active English QLs;
- 168 registry-derived solve modes;
- 20 deterministic states per QL;
- 3,880 generated runtime-proof questions;
- 582 generated human-review samples.

These figures describe the current checkpoint. They are not fixed quotas or terminal identifiers.

### MEN-CP-001 — triangles

Coverage includes direct and reverse area, perimeter, Heron's formula, right-triangle side and area recovery, exact equilateral area and height, isosceles height and area, side-ratio/perimeter recovery, and area-cost applications.

### MEN-CP-002 — quadrilaterals

Coverage includes rectangle, square, parallelogram, rhombus, trapezium, kite and general diagonal-plus-perpendicular quadrilateral measurement. Direct, reverse, perimeter, diagonal and area families are represented.

### MEN-CP-003 — circles

Coverage includes radius, diameter, circumference, area, semicircles, quadrants, arcs, sectors, central-angle recovery, annuli and wheel-distance/revolution problems. Every circular question explicitly states `π = 22/7`.

### MEN-CP-004 — applications

Coverage includes inside/outside rectangular, square and circular paths; reverse path-width recovery; crossed roads; uncovered area; paving and tile counts; flooring, painting and paving costs; area and fencing rate recovery; fencing with gates and multiple rounds.

### MEN-CP-005 — composite and inscribed figures

Coverage includes rectangle-plus-semicircle and stadium figures, rectangle-plus-triangle and two-rectangle composites, overlapping rectangle unions, L-shaped regions, shaded square/circle combinations, semicircular and quadrant cut-outs, inscribed and largest-fit figures, exact regular-hexagon measurement, shared-edge and inner-hole boundaries, exposed composite boundaries, and reverse recovery from composite area, shaded area, regular-polygon perimeter and stadium perimeter.

### MEN-CP-006 — transformation systems

Coverage includes linear and square-unit conversion, mixed-unit rectangle measurement, direct and reverse similarity scaling, percentage area change, map and plan scaling, conserved-wire reshaping among standard plane figures, same-perimeter area comparison and maximum rectangular area for a fixed boundary.

CP-006 explanations are human-authored around the actual transformation. Direct questions normally render in five meaningful steps; multi-stage percentage, plan, comparison and area-recovery questions retain six.

## Mathematical rules

- Length, area, cost, rate, angle, count, percentage and dimensionless scale are distinct answer dimensions.
- Linear, square, currency-rate, degree, count, percent and scalar units must match the requested quantity.
- Triangle sides must satisfy triangle inequality.
- Right-triangle and isosceles recovery states must satisfy Pythagoras exactly.
- Ratio-derived sides must conserve the stated perimeter.
- Exact surds remain exact unless approximation is explicitly requested.
- Circular states use the explicit registered `π = 22/7` policy.
- Border, annular, shaded and cut-out states conserve outer-minus-inner area.
- Composite addition states contain non-overlapping components and conserve their summed area.
- Overlapping composite states use inclusion–exclusion and subtract the common region exactly once.
- Inscribed figures preserve the defining diameter/diagonal relation.
- Composite perimeter questions count only exposed boundary and omit shared internal edges.
- A region with a hole counts both its outer boundary and its inner boundary when both touch the required region.
- Reverse composite-boundary states reproduce the stated total perimeter after recovery.
- Crossed-road states use inclusion-exclusion and subtract overlap once.
- Tile counts are exact whole-number area quotients.
- Cost and reverse-rate states conserve `cost = measure × rate`.
- Linear conversion uses the direct unit factor; area conversion uses its square.
- Similar-figure perimeters follow the linear scale factor and areas follow its square.
- Percentage area change multiplies independent dimension factors rather than adding them.
- Map and plan areas use the square of the stated linear scale.
- Wire reshaping conserves the complete boundary length before any new dimension or area is calculated.
- Among rectangles with a fixed perimeter, the square gives the maximum area.
- Difficulty comes from the mathematical state, not inflated arithmetic.
- Stem, solver, options, reasoning graph, validation and explanation use one generated state.

## Ownership boundaries

- `MEN-CP-005` owns composite, inscribed, shaded and regular-polygon figures.
- `MEN-CP-006` owns mixed-unit conversion, scaling, wire reshaping and boundary-conservation transformations.
- Geometry owns theorem/property reasoning.
- Trigonometry owns trigonometric side/area recovery.
- Solid-mensuration scaling and volume laws belong to a later three-dimensional package.

## Current maturity

- `MEN-CP-001` through `MEN-CP-006`: `RUNTIME_PROOF`
- publicly publishable: `false`
- supported runtime language: English only
- Question Studio wiring: intentionally deferred until integration review
