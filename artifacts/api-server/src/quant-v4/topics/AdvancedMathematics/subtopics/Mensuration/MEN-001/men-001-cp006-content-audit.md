# MEN-001 CP-006 Content and Exhaustiveness Audit

## Audit conclusion

Within the approved ownership boundary for unit transformation, similarity scaling, map/plan scaling, wire reshaping and fixed-boundary area reasoning, CP-006 is solve-contract complete at the current runtime-proof checkpoint.

This does not mean that every possible story wording has been added. New QLs should be introduced only when they require a genuinely new equation, conserved quantity or reverse transformation.

## Current CP-006 snapshot

- 36 active English QLs;
- 36 distinct solve modes;
- 6 Easy, 13 Medium and 17 Hard QLs;
- 720 deterministic CP-006 runtime cases at 20 states per QL;
- 108 CP-006 human-review samples at 3 states per QL;
- no Hindi or Punjabi exposure;
- no question-stem diagrams or explanation illustrations;
- maturity: `RUNTIME_PROOF`;
- `publiclyPublishable: false`.

## MEN-001 integrated snapshot

- 6 active canonical problems;
- 194 active English QLs;
- 168 registry-derived solve modes;
- 3,880 deterministic runtime generations;
- 582 human-review samples.

These counts describe the current implementation and are not fixed quotas or terminal identifiers.

## Coverage audit

### Unit transformation

Covered:

- cm to m;
- m to cm;
- cm² to m²;
- m² to cm²;
- rectangle area with mixed linear units;
- rectangle perimeter with mixed linear units;
- reverse rectangle length with mixed units;
- square area after converting the side before squaring.

The square-unit contracts are separate from linear conversion because they require the squared factor 10,000.

### Similarity scaling

Covered:

- perimeter after linear scaling;
- area after linear scaling;
- scale factor from perimeter ratio;
- scale factor from area ratio;
- original area from enlarged area;
- uniform percentage increase in area;
- uniform percentage decrease in area;
- independent increase/decrease of rectangle dimensions;
- new area after independent percentage changes.

Direct perimeter and area scaling, reverse scale recovery and percentage-change reasoning are treated as separate contracts because they use different operations and common misconceptions.

### Map and plan transformation

Covered:

- actual distance from map distance;
- map distance from actual distance;
- actual area from map area;
- map area from actual area;
- actual rectangular plot area from two plan dimensions.

Length questions use the scale once; area questions use its square. Both direct and reverse directions are represented.

### Boundary conservation and wire reshaping

Covered:

- square to rectangle;
- rectangle to square;
- square to circle;
- circle to square;
- rectangle to circle;
- square to equilateral triangle;
- square to regular hexagon;
- circle to rectangle with one rectangle dimension known;
- square area after rectangle-wire reshaping;
- circle area after square-wire reshaping;
- square area after circle-wire reshaping.

Dimension recovery and resulting-area recovery remain separate because the latter adds a second mensuration stage after the conserved boundary has been used.

### Fixed-boundary area reasoning

Covered:

- square-versus-rectangle area increase at equal perimeter;
- maximum rectangular area for a fixed perimeter;
- circle-versus-square area difference at equal perimeter.

These contracts test optimization or area comparison after enforcing one common boundary.

## Explanation audit

CP-006 does not use the older chapter-wide prose compactor. Its authored steps render directly.

Final generated distribution:

- 25 direct or single-reversal QLs use 5 meaningful lines;
- 11 percentage, reverse-scale, plan-area, comparison or resulting-area QLs use 6 meaningful lines.

Each explanation contains:

- a QL-specific contextual opening;
- the governing conversion, scale law or conserved boundary;
- generated-value substitution;
- the necessary intermediate measure;
- the evaluated target;
- a contextual conclusion where the extra stage is needed.

The review confirmed that no CP-006 explanation uses `Check:`, `Substitution:` or `Calculation:` labels, generic padding or automatically merged prose.

## Distractor audit

Every QL declares exactly three misconception-derived strategies. Covered misconception classes include:

- using 100 instead of 10,000 for area conversion;
- mixing metres and centimetres directly;
- applying a linear scale to area;
- using an area ratio directly instead of square-rooting it;
- combining percentage changes additively;
- using map scale once for area;
- reversing multiplication and division in map questions;
- failing to conserve the full wire boundary;
- dividing wire by the wrong number of sides;
- confusing radius and diameter;
- reporting a component area rather than the requested difference.

Generated review found and corrected three weak map distractors:

- a zero-rounded map-area option was replaced by a one-place area-scale error;
- an unrealistically tiny actual-distance option was replaced by a metre/centimetre conversion mistake;
- an unrealistically tiny map-length option was replaced by division by 100.

The final review contains no non-positive options, duplicate option sets or generic fallback choices.

## Validator coverage

Dedicated CP-006 validation checks:

- direct and squared unit conversion;
- mixed-unit conservation;
- linear versus square scale laws;
- reverse perimeter and area ratios;
- independent percentage factors;
- direct and reverse map scaling;
- complete boundary conservation for every wire transformation;
- same-perimeter area comparison;
- maximum-area square relation;
- first-class `%` and `times` answer units;
- explicit `π = 22/7` for every circular transformation;
- human-authored five-to-eight-line explanation range;
- no decorative illustration generation.

## Explicit exclusions

Not owned by CP-006:

- CP-004 path, flooring, fencing and rate applications;
- CP-005 composite, shaded, inscribed and regular-polygon decomposition;
- theorem-based Geometry;
- trigonometric side recovery;
- solid-mensuration similarity and volume scaling;
- currency story variants that do not introduce a new mathematical contract.

## Freeze-readiness decision

CP-006 is ready for product review as a complete runtime-proof checkpoint. It remains English-only, unpublished and disconnected from production generation until the MEN-001 chapter-wide integration and editorial review is approved.
