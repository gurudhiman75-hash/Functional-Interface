# ExamTree Quant V4 — Geometry
## End-to-End Design Authority — Revision 2

**Status:** `DESIGN_COMPLETE_READY_FOR_PHASE_0`  
**Student-facing chapter:** Geometry  
**Runtime packages:** `GEO-001`, `GEO-002`  
**Canonical checkpoint range:** `GEO-CP-001..GEO-CP-014`  
**Permanent QLs:** 0  
**Frozen solve modes:** 0  
**Question Studio:** disabled until package-level review/freeze gates pass  
**Question Bank / test / public eligibility:** disabled  
**Primary exams:** SSC CGL/CHSL/MTS/GD, Railway, PSSSB/PPSC/Punjab Police and comparable state examinations; Banking only where geometry is actually present in the target paper/profile  
**Languages:** English (`en-IN`), Hindi (`hi-IN`), Punjabi (`pa-IN`)  
**Design date:** 18 August 2026  

---

# 1. Executive decision

Geometry is one learner-facing chapter with two Euclidean runtime packages:

```text
Geometry
├── GEO-001 — Lines, Triangles, Quadrilaterals & Polygons
│   ├── GEO-CP-001 — Basic lines, rays and angle relations
│   ├── GEO-CP-002 — Parallel lines and transversals
│   ├── GEO-CP-003 — Triangle angle and side properties
│   ├── GEO-CP-004 — Congruence and rigid triangle inference
│   ├── GEO-CP-005 — Similarity and proportional geometry
│   ├── GEO-CP-006 — Triangle centres, medians, altitudes and bisectors
│   ├── GEO-CP-007 — Right-triangle theorem properties and special relations
│   ├── GEO-CP-008 — Quadrilaterals and special quadrilateral properties
│   └── GEO-CP-009 — Polygons and regular-polygon angle structure
└── GEO-002 — Circle Geometry & Euclidean Synthesis
    ├── GEO-CP-010 — Circle fundamentals, chords, arcs and centre relations
    ├── GEO-CP-011 — Inscribed angles, cyclic quadrilaterals and arc-angle relations
    ├── GEO-CP-012 — Tangents and tangent-based relations
    ├── GEO-CP-013 — Secants, intersecting chords and power-of-a-point relations
    └── GEO-CP-014 — Mixed Euclidean theorem synthesis and diagram reasoning
```

This design deliberately **does not include Coordinate Geometry**. The existing Quant authority separates:

- Geometry — theorem/property reasoning;
- Mensuration — perimeter/area/surface/volume measurement;
- Trigonometry — ratio/identity and angle-led side recovery;
- Coordinate Geometry — Cartesian/slope/distance/equation reasoning.

A future Coordinate Geometry family should therefore use its own package authority, for example `CGE-001`, rather than being hidden inside `GEO-001` or `GEO-002`.

No QL count, solve-mode count, difficulty quota or checkpoint QL quota is predetermined. Permanent QLs are allocated only after executable source discovery, merge/split analysis, ambiguity proof, diagram review and human editorial approval.

Revision 2 deliberately retains the 14-CP structure rather than collapsing Geometry into broad textbook headings. The narrower CPs are solver/discovery/freeze ownership boundaries, not merely syllabus labels. Coordinate Geometry remains a separate future Cartesian family; its candidate topics may be preserved for later design work but are not owned by `GEO-001` or `GEO-002`.

---

# 2. Authority order

When material sources conflict, use this order:

1. approved permanent Geometry CP/QL allocation and freeze record;
2. this end-to-end design authority;
3. source-audited solve-mode discovery inventory;
4. executable runtime, diagram, QA and localisation contracts;
5. package implementation reports;
6. current Mensuration/Trigonometry/Algebra ownership locks;
7. legacy Quant evidence;
8. exploratory inventories or generic textbook taxonomies.

Legacy headings are evidence, not automatic chapter ownership.

---

# 3. Core design principles

## 3.1 Geometry state comes before prose

Question wording is never the mathematical source of truth.

```text
canonical geometric state
→ theorem/constraint graph
→ canonical solve
→ materially independent verification
→ uniqueness/minimality proof
→ distractors
→ diagram projection
→ stem
→ human solution
→ localisation
→ Question Studio payload
```

Every stem, option, solution, diagram and verifier must derive from the same canonical mathematical state.

## 3.2 The tested theorem determines ownership

Geometry owns a question when the essential learner burden is a geometric theorem/property such as:

- angle relation;
- parallel-line property;
- triangle property;
- congruence;
- similarity;
- midpoint/median/bisector theorem;
- quadrilateral property;
- polygon angle structure;
- circle/chord/arc relation;
- cyclic relation;
- tangent theorem;
- secant/chord product relation.

The mere presence of a triangle or circle does not make a question Geometry.

## 3.3 Exact mathematics

Authoritative Geometry math must preserve exactness:

- integers;
- reduced rational values;
- exact degrees/rational-degree values;
- exact squared lengths;
- exact quadratic surds where unavoidable;
- exact ratios;
- exact symbolic segment products.

Floating point may be used only for non-authoritative visual layout or secondary numeric diagnostics after exact proof.

## 3.4 Diagram semantics are mathematical data

Geometry diagrams are not decoration.

A diagram must be a projection of structured geometry evidence:

```text
point
line / ray / segment
parallel relation
perpendicular relation
equal-length relation
equal-angle relation
circle
radius
diameter
chord
arc
tangent
secant
angle marker
right-angle marker
midpoint marker
intersection
polygon boundary
```

A rendered SVG must not invent any relation that is absent from the canonical state.

## 3.5 Human solutions, not theorem dumps

Every solution must tell the learner:

1. what is given;
2. what is being asked;
3. which geometric fact connects them;
4. how that fact is applied here;
5. the calculation or inference;
6. the final answer.

A solution such as:

```text
∠A = ∠B
∠C = 180° - 2x
x = 40°
```

is unacceptable without explaining why those angle relations hold.

## 3.6 Difficulty comes from proof topology

Difficulty must come from:

- hidden intermediate relations;
- proof depth;
- theorem chaining;
- inverse reasoning;
- selecting the correct correspondence;
- ambiguity among plausible relations;
- case distinction;
- indirect circle relations;
- diagram interpretation;
- constraint minimality.

Do not create Hard questions merely by using awkward numbers.

---

# 4. Ownership boundaries

## 4.1 Geometry vs Mensuration

### Geometry owns

```text
find an angle using triangle properties
prove/find a length ratio using similarity
find a segment using angle-bisector theorem
identify a parallelogram property
find a chord relation from equal arcs
find an angle in a cyclic quadrilateral
find tangent length using tangent theorem/power relation
```

### Mensuration owns

```text
find triangle area
find perimeter
find area of similar figures
find area of sector
find circumference
find shaded region area
find fencing/flooring/cost
find composite area
```

### Boundary rule

If the final burden is **measurement with units**, Mensuration usually owns it.

If the final burden is **theorem/property inference**, Geometry owns it even if the answer is a numeric angle, ratio or segment length.

---

## 4.2 Geometry vs Trigonometry

### Geometry owns

- angle chasing;
- similarity;
- congruence;
- Pythagorean theorem as a geometric property/converse/classification;
- chord/tangent/centre theorems;
- theorem-based length ratios.

### Trigonometry owns

- `sin`, `cos`, `tan`, `cot`, `sec`, `cosec`;
- standard-angle values;
- side recovery by trigonometric ratio;
- heights and distances;
- angle of elevation/depression;
- triangle area using `1/2 ab sin C`.

Pure third-side recovery by Pythagoras should not be duplicated merely to fill Geometry. Geometry should retain Pythagorean questions only when the **theorem/converse/geometric configuration** is the tested skill.

---

## 4.3 Geometry vs Algebra

Algebra may be used internally to solve angle equations, ratios or segment constraints, but ownership remains Geometry when the equation exists because of a geometric theorem.

Example:

```text
alternate interior angles give 3x + 10 = 5x - 20
```

This is Geometry, not Algebra.

A free-standing equation with no geometric theorem is Algebra.

---

## 4.4 Geometry vs Coordinate Geometry

Coordinate Geometry is separate.

The following do **not** belong in this design:

- slope;
- distance formula from coordinates;
- section formula;
- midpoint from ordered pairs;
- equation of a line;
- collinearity from determinant/slope;
- coordinate area;
- circle equation;
- coordinate transformations.

Geometry may use hidden coordinates internally as an independent verifier, but learner-facing ownership remains synthetic Euclidean Geometry.

---

## 4.5 Geometry vs Reasoning Spatial

Non-verbal figure analogy, mirror image, paper folding, figure completion and embedded figures remain Reasoning/Spatial.

A mathematical diagram with theorem relations belongs to Geometry.

---

# 5. Universal Geometry discovery matrix

Every checkpoint must be audited across relevant dimensions before any permanent QL freeze.

## 5.1 Target direction

```text
direct missing angle
reverse missing given
find segment length
find ratio
find number of equal parts
classify relation
identify valid theorem conclusion
identify impossible statement
parameter recovery
proof/claim verification
minimum information
statement-based geometry
quantity comparison
data sufficiency wrapper
```

## 5.2 Evidence topology

```text
single theorem
two-step theorem chain
three-step theorem chain
parallel-line transfer
triangle sum
exterior angle
congruence correspondence
similarity correspondence
bisector / midpoint relation
centre-based relation
arc-chord relation
cyclic relation
tangent relation
secant/chord product
mixed configuration
```

## 5.3 Unknown semantic

```text
angle
angle sum
side
segment
ratio
relationship
classification
count
boolean theorem claim
ordered option
statement sufficiency
```

## 5.4 Diagram topology

```text
no diagram required
single triangle
nested / overlapping triangles
parallel-line transversal
quadrilateral
polygon
circle with centre/chord
circle with cyclic quadrilateral
circle with tangent
circle with secant
two-circle configuration
mixed line-circle configuration
```

## 5.5 Edge states

```text
acute / right / obtuse
isosceles / equilateral / scalene
degenerate-state rejection
parallel versus non-parallel
internal versus external angle bisector
correspondence reversal
equal/supplementary confusion
diameter special case
semicircle angle
tangent at endpoint
internal/external secant intersection
two tangents from one point
equal chords / equal arcs
regular-polygon parity cases
```

## 5.6 Representation

```text
plain prose
diagram-led MCQ
statement set
which statement is true
quantity comparison
data sufficiency
caselet
```

Representation becomes a separate QL only when it materially changes the learner inference, evidence topology or answer contract.

---

# 6. Shared Geometry foundation

Recommended structure:

```text
quant-v4/shared/geometry/
  exact.ts
  point.ts
  vector.ts
  line.ts
  segment.ts
  circle.ts
  polygon.ts
  incidence.ts
  relations.ts
  angle.ts
  theorem-registry.ts
  constraint-graph.ts
  synthetic-solver.ts
  coordinate-oracle.ts
  admissibility.ts
  diagram-model.ts
  diagram-layout.ts
  equivalence.ts
  formatting.ts
  index.ts
```

If the generic exact rational/surd primitives from Algebra later become an approved shared authority, Geometry should reuse them rather than maintaining duplicate exact-number implementations. Until then, no mature package should be refactored merely for architectural neatness.

---

## 6.1 Shared angle-chasing engine — chapter-wide authority

Angle reasoning is implemented once and extended by theorem registry entries. No CP may fork a private angle solver.

```text
shared angle engine
├── generic facts
│   ├── exact angle value
│   ├── equality
│   ├── supplementary relation
│   ├── fixed-sum relation
│   └── algebraic angle expression
├── line / transversal rules
├── triangle rules
├── quadrilateral / polygon rules
└── circle / tangent rules
```

The same engine must support:

```text
GEO-CP-001 basic line angles
GEO-CP-002 parallel/transversal angles
GEO-CP-003 triangle angles
GEO-CP-008 quadrilateral angles
GEO-CP-009 polygon angles
GEO-CP-010/011 circle angle relations
GEO-CP-012 tangent angles
GEO-CP-014 mixed angle synthesis
```

Circle Geometry extends the shared theorem registry; it never creates a second angle-chase implementation.

## 6.2 Reusable exact parameter pools

When a clean mathematical parameter pool has already been proven elsewhere, Geometry should reuse it through neutral shared infrastructure rather than importing another chapter runtime.

Recommended neutral pools:

```text
quant-v4/shared/math-parameter-pools/
  pythagorean-triples.ts
  clean-ratios.ts
  clean-angle-sets.ts
```

Potential Geometry use includes right-triangle theorem states, tangent-length configurations, chord-distance constructions and hidden exact coordinate realizations. Reuse must preserve chapter ownership: Geometry consumes neutral parameters, not Trigonometry runtime behavior.

# 7. Canonical geometric model

## 7.1 Points

```ts
interface GeoPoint {
  id: string;
  label: string;
}
```

Learner-facing point labels normally remain Latin capitals:

```text
A, B, C, D, O, P, Q, R ...
```

Labels are presentation data; point identity is internal.

## 7.2 Hidden coordinate realization

A canonical state may optionally carry exact hidden coordinates:

```ts
interface ExactCoordinate {
  x: Rational;
  y: Rational;
}
```

These coordinates are:

- generator/oracle evidence;
- never automatically learner-visible;
- not a substitute for theorem-based solving;
- useful for independent incidence, parallelism, perpendicularity and distance checks.

## 7.3 Primitive objects

```ts
GeoSegment
GeoRay
GeoLine
GeoCircle
GeoArc
GeoPolygon
```

## 7.4 Relations

The canonical state should explicitly store relations instead of expecting the renderer to infer them:

```text
COLLINEAR
PARALLEL
PERPENDICULAR
EQUAL_LENGTH
EQUAL_ANGLE
MIDPOINT
BISECTS_ANGLE
BISECTS_SEGMENT
TANGENT
SECANT
ON_CIRCLE
CENTRE_OF
DIAMETER
RADIUS
CHORD
CYCLIC
CONGRUENT
SIMILAR
```

## 7.5 Exact angles

Angles should be stored as exact rational degrees for the first implementation wave:

```ts
interface ExactAngle {
  numerator: bigint;
  denominator: bigint;
  unit: "DEGREE";
}
```

Radian learner-facing geometry is out of scope unless a future source audit proves recurring demand.

---

# 8. Theorem registry

Every permanent QL must declare the theorem families it is allowed to use.

Example internal theorem IDs:

```text
LINEAR_PAIR_SUM
VERTICAL_OPPOSITE_ANGLES
ANGLE_AROUND_POINT
CORRESPONDING_ANGLES_PARALLEL
ALTERNATE_INTERIOR_ANGLES
CO_INTERIOR_SUPPLEMENTARY

TRIANGLE_ANGLE_SUM
TRIANGLE_EXTERIOR_ANGLE
ISOSCELES_BASE_ANGLES
ISOSCELES_CONVERSE
TRIANGLE_INEQUALITY
PYTHAGORAS
PYTHAGORAS_CONVERSE

SSS_CONGRUENCE
SAS_CONGRUENCE
ASA_AAS_CONGRUENCE
RHS_CONGRUENCE
CPCT
