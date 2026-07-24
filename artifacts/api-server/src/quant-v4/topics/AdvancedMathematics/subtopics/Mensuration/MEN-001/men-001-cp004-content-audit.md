# MEN-001 CP-004 Content Audit

Status: runtime-proof and generated-content review complete.

## Scope

`MEN-CP-004 — Paths, Borders, Flooring, Fencing and Cost Applications` now covers:

- inside and outside rectangular, square and circular paths;
- direct path area, path cost and reverse path-width recovery;
- crossed roads with overlap correction and remaining field area;
- rectangular and square floor-tile counts;
- complete and partial tiling, including uncovered area;
- inside and outside path paving-tile counts;
- tile purchase, flooring, paving and painting costs;
- reverse area-rate and fencing-rate recovery;
- rectangular and circular fencing;
- gate exclusions and gate-width recovery;
- multiple wire rounds and multiple-round fencing cost.

## Content rules

- all current question stems are text-complete and use `diagramRequirement: NONE`;
- explanation illustrations appear only for border subtraction or reverse-width reasoning;
- circular questions explicitly state `π = 22/7`;
- count answers distinguish `tiles` from `revolutions`;
- rate answers use `₹/m²` or `₹/m`, not plain currency;
- all tile and path states divide exactly;
- crossed-road area subtracts the overlap exactly once;
- each QL has three named, misconception-derived distractors;
- question, solver, options, reasoning graph, validation and explanation share one generated state.

## Editorial review corrections

Generated samples were used to correct:

- duplicate or colliding misconception options;
- disproportionate circular path states;
- implausibly large wall and paving dimensions;
- overly extreme reverse-rate distractors;
- an explanation diagram that inherited centimetres from a count answer despite a metre-based stem.

## Verified checkpoint

The full MEN-001 CP-001–CP-004 package currently contains:

- 125 active English QLs;
- 106 registry-derived solve modes;
- 2,500 deterministic runtime cases;
- 375 generated review samples.

Final verified branch head:

`57ce9afd6ecff8a1810491ef5bab86c574513105`

Successful workflows on that head:

- MEN-001 runtime proof: `30103924501`;
- integrated admin-panel validation: `30103924532`;
- Render production build: `30103924510`.

## Deliberate exclusions

- mixed-unit conversion, wire reshaping, scaling and boundary conservation remain in CP-006;
- irregular composite and shaded figures remain in CP-005;
- theorem/property reasoning remains in Geometry;
- Question Studio and public generation routing remain disabled;
- Hindi and Punjabi are not yet implemented;
- maturity remains `RUNTIME_PROOF` and `publiclyPublishable: false`.
