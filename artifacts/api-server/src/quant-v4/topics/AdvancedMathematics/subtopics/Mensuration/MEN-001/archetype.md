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

`MEN-CP-001` through `MEN-CP-005` are active.

Current checkpoint:

- 158 active English QLs;
- 132 registry-derived solve modes;
- 20 deterministic states per QL;
- 3,160 generated runtime-proof questions;
- 474 generated human-review samples.

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

## Mathematical rules

- Length, area, cost, rate, angle and count are distinct answer dimensions.
- Linear, square, currency-rate, degree, tile and revolution units must match the requested quantity.
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
- Difficulty comes from the mathematical state, not inflated arithmetic.
- Stem, solver, options, reasoning graph, validation and explanation use one generated state.

## Ownership boundaries

- `MEN-CP-005` owns composite, inscribed, shaded and regular-polygon figures.
- `MEN-CP-006` owns mixed-unit conversion, scaling, wire reshaping and boundary-conservation transformations.
- Geometry owns theorem/property reasoning.
- Trigonometry owns trigonometric side/area recovery.

## Current maturity

- `MEN-CP-001` through `MEN-CP-005`: `RUNTIME_PROOF`
- publicly publishable: `false`
- supported runtime language: English only
- Question Studio wiring: intentionally deferred until integration review
