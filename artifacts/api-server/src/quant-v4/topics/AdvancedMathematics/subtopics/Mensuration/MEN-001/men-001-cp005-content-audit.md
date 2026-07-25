# MEN-001 CP-005 Content and Exhaustiveness Audit

## Decision

The current CP-005 runtime slice is solve-mode exhaustive within the approved ownership boundary for composite, shaded, inscribed, largest-fit and regular plane figures.

This is a checkpoint decision, not a permanent limit on future exam-specific variants.

## Current coverage

- 26 active English QLs
- 19 registry-derived solve modes
- 520 deterministic CP-005 runtime generations at 20 states per QL
- 78 CP-005 human-review samples at 3 states per QL
- no question-stem diagrams
- explanation-only visuals where decomposition, inscribed relations or exposed boundary materially clarify the reasoning

## Ownership matrix

### Composite addition

- rectangle plus one semicircle
- rectangle plus two semicircles treated as a stadium
- rectangle plus triangle
- two non-overlapping rectangles

### Composite subtraction and shading

- L-shape from rectangular cut-out
- square minus inscribed circle
- circle minus inscribed square
- rectangle minus two semicircular cut-outs
- square minus four equal corner quadrants

### Inscribed and largest-fit relations

- circle inscribed in square
- square inscribed in circle
- largest circle fitting inside a rectangle

### Regular polygon measurement

- exact regular-hexagon area in `coefficient√3` form
- regular-hexagon perimeter

### Composite exposed boundary

- rectangle plus semicircle
- stadium
- corner-cut L-shape

### Reverse recovery

- rectangle length from rectangle-plus-semicircle total area
- square side from square-minus-inscribed-circle shaded area

## Why the solve modes are exhaustive for this CP

The approved chapter authority names eight broad families: composite addition, composite subtraction, shaded area, circle in square, square in circle, regular polygon area, composite perimeter and largest-fit plane shape. The 19 concrete runtime modes cover each broad family and separate only when the mathematical invariant changes.

Additional story variants that preserve the same decomposition do not require new solve modes. For example, a garden, plate, floor or field formed from the same rectangle-plus-semicircle construction uses the same invariant and solver.

## Explicit exclusions

- paths, borders, flooring, fencing rates and general cost applications remain in CP-004;
- mixed-unit conversion, scale laws, wire reshaping and same-boundary transformations remain in CP-006;
- theorem/property proofs remain in Geometry;
- trigonometric dimension recovery remains in Trigonometry;
- ambiguous irregular diagrams are not admitted into the current text-only stem slice.

## Runtime invariants

- all circular states explicitly state and enforce `π = 22/7`;
- component addition uses positive, non-overlapping areas;
- shaded and cut-out states conserve enclosing area minus removed area;
- an inscribed circle uses the square side as diameter;
- an inscribed square uses the circle diameter as diagonal;
- the largest circle in a rectangle uses the smaller rectangle side as diameter;
- regular-hexagon area remains exact as `(3√3/2)a²`;
- shared internal edges are excluded from composite perimeter;
- both reverse modes reproduce the stated original area after recovery.

## Generated-review findings

- unresolved placeholders: 0
- invalid or duplicate options: 0
- generic fallback options: 0
- answer/unit mismatches: 0
- circular π-policy mismatches: 0
- missing explanation illustrations for registered modes: 0
- inaccessible or empty illustration labels: 0
- duplicate normalized explanation prose signatures: 0

The existing MEN-001 explanation flow is intentionally preserved for consistency with CP-001 through CP-004. Any later chapter-wide explanation-style revision should be handled as a separate editorial task.
