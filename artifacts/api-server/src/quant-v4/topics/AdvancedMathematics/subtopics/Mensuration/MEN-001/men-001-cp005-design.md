# MEN-001 CP-005 — Composite, Shaded, Inscribed and Regular Plane Figures

## Ownership

CP-005 owns plane figures whose answer depends on decomposing, combining, overlapping or subtracting standard shapes. It includes rectangle-plus-semicircle figures, stadium figures, rectangle-plus-triangle figures, joined or overlapping rectangles, L-shapes, shaded square/circle combinations, inscribed square/circle relations, regular hexagons, outer and inner composite boundaries, and reverse recovery from composite area, shaded area or composite perimeter.

CP-005 does not own general paths, flooring or fencing rates (CP-004), nor unit conversion, scaling, wire reshaping or same-boundary transformations (CP-006).

## Audited runtime scope

The runtime-proof checkpoint contains 33 English QLs across 26 need-based solve modes. Counts are descriptive, not quotas.

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
- regular hexagon perimeter from side
- regular hexagon side from perimeter
- regular hexagon exact area from perimeter

### Composite boundaries
- rectangle plus semicircle exposed perimeter
- stadium exposed perimeter
- corner-cut L-shape perimeter
- two rectangles joined along a shared edge
- total boundary of a square region containing a circular hole

### Reverse recovery
- rectangle length from rectangle-plus-semicircle total area
- square side from square-minus-circle shaded area
- stadium straight-side length from total perimeter
- circle radius from circle-minus-inscribed-square shaded area

## Diagram policy

Question stems remain text-only where the construction is unambiguous in words. Explanation-only diagrams show decomposition, overlap correction, shared edges, inner holes, inscribed relations, removed regions, regular-hexagon splitting or exposed boundaries. No decorative diagrams are admitted.

## Exhaustiveness decision

Within CP-005 ownership, the audited runtime covers the distinct mathematical contracts required by the chapter authority:

- composite area by addition;
- composite area by subtraction;
- shaded area;
- overlapping union area;
- inscribed circle and square relations;
- direct and reverse regular-hexagon measurement;
- composite exposed perimeter;
- shared-edge perimeter correction;
- outer-plus-inner boundary measurement;
- largest-fit plane shapes;
- reverse recovery from composite area, shaded area and composite perimeter.

Further QLs should be added only when a genuinely different mathematical contract is identified, not to meet a fixed count.

## Safety

- maturity: RUNTIME_PROOF
- publiclyPublishable: false
- English only
- no Question Studio or production routing exposure
