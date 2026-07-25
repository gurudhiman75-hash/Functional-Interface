# MEN-001 CP-005 — Composite, Shaded, Inscribed and Regular Plane Figures

## Ownership

CP-005 owns plane figures whose answer depends on decomposing, combining, overlapping or subtracting standard shapes. It includes rectangle-plus-semicircle figures, stadium figures, rectangle-plus-triangle figures, joined or overlapping rectangles, L-shapes, shaded square/circle combinations, inscribed square/circle relations, regular hexagons, exposed composite boundaries and reverse recovery from a composite or shaded area.

CP-005 does not own general paths, flooring or fencing rates (CP-004), nor unit conversion, scaling, wire reshaping or same-boundary transformations (CP-006).

## Audited runtime scope

The runtime-proof checkpoint contains 27 English QLs across 20 need-based solve modes. Counts are descriptive, not quotas.

### Addition
- rectangle plus one semicircle area
- rectangle plus two semicircles (stadium) area
- rectangle plus triangle area
- two non-overlapping rectangles area

### Overlap and inclusion–exclusion
- union area of two rectangles with a known rectangular overlap
- add both component areas and subtract the common region exactly once

### Subtraction and shading
- L-shape area by rectangular cut-out
- square minus inscribed circle
- circle minus inscribed square
- rectangle minus two semicircular cut-outs
- square minus four corner quadrants

### Inscribed and largest-fit figures
- inscribed circle area in a square
- inscribed square area in a circle
- largest circle radius that fits in a rectangle

### Regular polygons
- regular hexagon exact area from side
- regular hexagon perimeter

### Composite boundaries
- rectangle plus semicircle exposed perimeter
- stadium exposed perimeter
- corner-cut L-shape perimeter

### Reverse recovery
- rectangle length from rectangle-plus-semicircle total area
- square side from square-minus-circle shaded area

## Diagram policy

Question stems remain text-only where the construction is unambiguous in words. Explanation-only diagrams show decomposition, overlap correction, shared edges, inscribed relations, removed regions or exposed boundaries. No decorative diagrams are admitted.

## Exhaustiveness decision

Within CP-005 ownership, the current runtime covers all required mathematical families from the chapter authority:

- composite area by addition;
- composite area by subtraction;
- shaded area;
- overlapping union area;
- inscribed circle and square relations;
- regular-hexagon measurement;
- composite exposed perimeter;
- largest-fit plane shapes;
- controlled reverse recovery.

Further QLs should be added only when a genuinely different mathematical contract is identified, not to meet a fixed count.

## Safety

- maturity: RUNTIME_PROOF
- publiclyPublishable: false
- English only
- no Question Studio or production routing exposure
