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

`MEN-CP-001` through `MEN-CP-004` are active.

Current checkpoint:

- 125 active English QLs;
- 106 registry-derived solve modes;
- 20 deterministic states per QL;
- 2,500 generated runtime-proof questions;
- 375 generated human-review samples.

These figures describe the current checkpoint. They are not fixed quotas or terminal identifiers.

### MEN-CP-001 — triangles

Coverage includes direct and reverse area, perimeter, Heron's formula, right-triangle side and area recovery, exact equilateral area and height, isosceles height and area, side-ratio/perimeter recovery, and area-cost applications.

### MEN-CP-002 — quadrilaterals

Coverage includes rectangle, square, parallelogram, rhombus, trapezium, kite and general diagonal-plus-perpendicular quadrilateral measurement. Direct, reverse, perimeter, diagonal and area families are represented.

### MEN-CP-003 — circles

Coverage includes radius, diameter, circumference, area, semicircles, quadrants, arcs, sectors, central-angle recovery, annuli and wheel-distance/revolution problems. Every circular question explicitly states `π = 22/7`.

### MEN-CP-004 — applications

Coverage includes inside/outside rectangular, square and circular paths; reverse path-width recovery; crossed roads; uncovered area; paving and tile counts; flooring, painting and paving costs; area and fencing rate recovery; fencing with gates and multiple rounds.

## Mathematical rules

- Length, area, cost, rate, angle and count are distinct answer dimensions.
- Linear, square, currency-rate, degree, tile and revolution units must match the requested quantity.
- Triangle sides must satisfy triangle inequality.
- Right-triangle and isosceles recovery states must satisfy Pythagoras exactly.
- Ratio-derived sides must conserve the stated perimeter.
- Exact surds remain exact unless approximation is explicitly requested.
- Circular states use the explicit registered `π = 22/7` policy.
- Border and annular states conserve outer-minus-inner area.
- Crossed-road states use inclusion-exclusion and subtract overlap once.
- Tile counts are exact whole-number area quotients.
- Cost and reverse-rate states conserve `cost = measure × rate`.
- Difficulty comes from the mathematical state, not inflated arithmetic.
- Stem, solver, options, reasoning graph, validation and explanation use one generated state.

## Ownership boundaries

- `MEN-CP-005` owns irregular composite, inscribed, shaded and regular-polygon figures.
- `MEN-CP-006` owns mixed-unit conversion, scaling, wire reshaping and boundary-conservation transformations.
- Geometry owns theorem/property reasoning.
- Trigonometry owns trigonometric side/area recovery.

## Current maturity

- `MEN-CP-001` through `MEN-CP-004`: `RUNTIME_PROOF`
- publicly publishable: `false`
- supported runtime language: English only
- Question Studio wiring: intentionally deferred until integration review
