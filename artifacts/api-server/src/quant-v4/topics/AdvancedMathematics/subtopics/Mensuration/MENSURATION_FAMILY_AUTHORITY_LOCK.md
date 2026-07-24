# Mensuration / Trigonometry Quant V4 Authority Lock

Status: **Phase 0 design lock**. This file authorizes implementation structure; it does not claim runtime completion.

## Student-facing families

- Geometry — separate theorem/property chapter family.
- Mensuration — measurement chapter family.
- Trigonometry — ratio/identity/application chapter family.
- Coordinate Geometry — separate Cartesian chapter family.

## Runtime packages

### Mensuration

- `MEN-001` — Plane Mensuration & Boundary Transformations.
- `MEN-002` — Solid Mensuration, Recasting & Composite Solids.

### Trigonometry

- `TRG-001` — Trigonometric Ratios, Exact Values & Identities.
- `TRG-002` — Heights & Distances Applications.

## MEN-001 canonical problems

1. `MEN-CP-001` — Triangle Measurement Systems.
2. `MEN-CP-002` — Quadrilateral Measurement Systems.
3. `MEN-CP-003` — Circles, Arcs, Sectors & Annular Regions.
4. `MEN-CP-004` — Paths, Borders, Flooring, Fencing & Cost.
5. `MEN-CP-005` — Composite, Inscribed & Regular Plane Figures.
6. `MEN-CP-006` — Boundary Conservation, Scaling & Unit Transformation.

## MEN-002 canonical problems

1. `MEN-CP-007` — Cubes, Cuboids & Prisms.
2. `MEN-CP-008` — Cylinders & Cones.
3. `MEN-CP-009` — Spheres & Hemispheres.
4. `MEN-CP-010` — Pyramids & Frustums.
5. `MEN-CP-011` — Surface Exposure, Open/Closed & Hollow Solids.
6. `MEN-CP-012` — Recasting, Melting & Volume Conservation.
7. `MEN-CP-013` — Composite/Inscribed Solids, Tanks & Displacement.

## Ownership boundaries

- Geometry owns theorem-based angle, similarity, congruence, centre, chord and tangent reasoning.
- Mensuration owns perimeter, area, surface area, volume, capacity and measurement-cost applications.
- Trigonometry owns side recovery through trig ratios and triangle area through `1/2 ab sin C`.
- Ratio & Proportion owns abstract scaling; Mensuration owns shape-specific scaling with dimensions and units.
- Pipes/Cisterns owns fill/empty rates; Mensuration owns static tank capacity and displacement.

## Runtime rules

- Exact fractions, pi multiples and surds must be preserved until approximation is explicitly requested.
- Every answer carries dimension and unit metadata.
- Stem, solver, explanation and future diagram must derive from one canonical mathematical state.
- Recasting preserves volume, not surface area.
- Diagram rendering will be deterministic and added only where mathematically or pedagogically justified.
- English is the only publishable language during runtime proof and MVP.

## Implementation sequence

1. Build `MEN-001` / `MEN-CP-001` runtime proof with five forced QLs.
2. Validate exact arithmetic, units, deterministic generation, options and teacher-style explanations.
3. Expand CP-001 only after runtime proof passes.
4. Add the remaining MEN-001 CPs checkpoint by checkpoint.
5. Start MEN-002 only after shared plane/solid contracts are deliberately separated.

## Numbering decision

Use package-local contiguous IDs:

- `MEN-001-QL-001...`
- `MEN-002-QL-001...`

This avoids global gaps and lets both packages evolve independently.
