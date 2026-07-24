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

Only `MEN-CP-001` is active. It contains 24 English QLs across 14 solve modes:

- direct triangle area from base and perpendicular height;
- reverse height and reverse base recovery;
- Heron's formula with exact integer states;
- right-triangle area from perpendicular legs;
- exact equilateral-triangle area with preserved `√3`;
- equilateral side/perimeter reverse problems;
- isosceles altitude and area recovery;
- side-ratio plus perimeter recovery;
- largest/smallest side from a ratio and perimeter;
- triangular plot area-cost applications.

The runtime-proof suite generates 20 deterministic states per QL: 480 questions in total.

## Mathematical rules

- Length, area and cost are distinct answer dimensions.
- Linear and square units must match the requested quantity.
- Triangle sides must satisfy triangle inequality.
- Isosceles altitude states must satisfy Pythagoras exactly.
- Ratio-derived sides must conserve the stated perimeter.
- Exact surds remain exact unless approximation is explicitly requested.
- Cost equals the computed area multiplied by the registered rate.
- Difficulty comes from the mathematical state, not inflated arithmetic.
- Stem, solver, options, reasoning graph and explanation use one generated state.

## Current maturity

- `MEN-CP-001`: `RUNTIME_PROOF`
- publicly publishable: `false`
- supported runtime language: English only
- Question Studio wiring: intentionally deferred until integration review
