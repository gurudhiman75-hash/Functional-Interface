# MEN-CP-006 — Implementation and Exhaustiveness Audit

## Status

- maturity: `RUNTIME_PROOF`;
- language: English only;
- publicly publishable: `false`;
- production routing: intentionally absent;
- current QLs: 36;
- current solve modes: 36.

The counts are descriptive rather than contractual. CP-006 is considered complete only because the ownership matrix below has been audited without a remaining distinct transformation family.

## Ownership matrix

### Unit conversion

- centimetres to metres;
- metres to centimetres;
- square centimetres to square metres;
- square metres to square centimetres;
- mixed-unit rectangle area;
- mixed-unit rectangle perimeter;
- reverse breadth from mixed-unit area;
- reverse length from mixed-unit perimeter;
- convert a side before squaring.

### Similarity and scaling

- perimeter under linear scaling;
- area under linear scaling;
- linear scale from perimeter change;
- linear scale from area change;
- original area from enlarged area;
- percentage area increase under uniform enlargement;
- percentage area decrease under uniform reduction;
- area multiplier after independent length and breadth changes;
- percentage area change after independent changes;
- resulting area after independent changes.

### Map and plan scale

- actual length from map length;
- map length from actual length;
- actual area from map area;
- map area from actual area;
- actual rectangular area from two plan dimensions.

### Boundary conservation and reshaping

- square wire to rectangle length;
- rectangle wire to square side;
- square wire to circle radius;
- circle wire to square side;
- rectangle wire to circle radius;
- circle wire to rectangle length;
- square wire to equilateral-triangle side;
- square wire to regular-hexagon side;
- resulting square area after reshaping;
- resulting circle area after reshaping.

### Fixed-boundary comparison

- area increase from rectangle to square at equal perimeter;
- maximum rectangular area for a fixed perimeter;
- area difference between circle and square at equal perimeter.

## Explanation authorship

- each QL has its own contextual opening and conclusion;
- each solve definition supplies explicit worked reasoning tied to the actual invariant;
- direct and single-reversal modes normally use five meaningful lines;
- genuine percentage, comparison, plan-area and resulting-area modes use six;
- line count is selected by need and is not a validator quota;
- CP-006 bypasses the older chapter-wide prose compactor so authored lines are not mechanically merged;
- no generic `Check:`, `Substitution:` or `Calculation:` padding is used.

## Diagram policy

All current CP-006 stems are text-sufficient, so CP-006 itself registers no question or explanation diagrams.

The MEN human-review exporter now creates a browser-ready `men-001-human-review.html` file. It renders all registered chapter illustrations as inline, accessible SVGs while showing a clear no-diagram state for CP-006. The current visual export contains 75 diagrams from CP-001 through CP-005 and 36 text-only CP-006 review cards.

## Runtime proof

The final proof validates:

- active CP coverage;
- QL, task and solve-mode registry exhaustiveness;
- deterministic generation;
- exact answer and unit contracts, including first-class `%` and `times` answers;
- option uniqueness and positive misconception outputs;
- linear and square conversion factors;
- perimeter and area scale laws;
- independent-dimension area multipliers;
- map-scale linear and square factors;
- wire/boundary conservation;
- same-perimeter comparison states;
- QL-specific explanation profiles;
- worked arithmetic and human-readable explanation structure;
- accessible visual review rendering for every registered illustration kind.

Current MEN-001 totals after CP-006:

- 194 active English QLs;
- 168 registry-derived solve modes;
- 3,880 deterministic runtime cases at 20 states per QL;
- 582 human-review samples at three states per QL.

## Explicit exclusions

- paths, paving, flooring, fencing and rates remain CP-004;
- composite, shaded, inscribed and regular-polygon figures remain CP-005;
- theorem/property reasoning remains Geometry;
- trigonometric side and area recovery remains Trigonometry;
- three-dimensional scaling and volume belong to the later solid-mensuration package.
