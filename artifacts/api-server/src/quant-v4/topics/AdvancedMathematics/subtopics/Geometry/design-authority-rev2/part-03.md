```

Runtime free-form invention is not authoritative production generation.

---

# 13. Geometry construction strategy

## 13.1 Construct valid states, do not repair invalid random states

The structural class is selected first. Triangle type, quadrilateral subtype, circle configuration and tangent/secant topology are authoritative generator choices; measurements are derived from that valid state.

Preferred pattern:

```text
choose theorem family
→ choose hidden clean geometric parameters
→ construct a mathematically valid figure
→ derive dependent angles/segments
→ choose givens from the valid state
→ choose target
```

Do not randomly assign angle/length values and then try to make a figure fit them.

## 13.2 Parametric coordinate construction

Hidden coordinates can safely generate many families:

- intersecting lines;
- parallel lines;
- triangles;
- midpoint/median configurations;
- parallelograms;
- rectangles/rhombi/squares;
- circles and chords;
- tangent points;
- secant points.

Coordinate construction provides an independent geometric oracle while the learner solution remains theorem-based.

## 13.3 Synthetic-only states

Some angle-only states can be built as exact theorem graphs without exposing coordinates. Such states still need an independent consistency check, for example:

- exact linear angle-equation validation;
- second construction path;
- sampled coordinate realization satisfying the constraints.

---

# 14. Canonical solving

The primary solver is theorem/constraint based.

Example angle engine:

```text
known angle facts
+ equality constraints
+ supplementary constraints
+ fixed-sum constraints
→ exact linear system
→ solve target angle
```

Example similarity engine:

```text
establish triangle similarity
→ establish vertex correspondence
→ derive side-ratio equation
→ solve exact target
```

Example circle engine:

```text
identify circle theorem
→ construct angle/product relation
→ solve target
```

The solver must record which theorem relation was actually required.

---

# 15. Independent verification

**Revision-2 mandatory rule:** wherever a theorem state can be independently realized in coordinates, every permanent QL must use the coordinate oracle as the secondary verifier. The production solver remains synthetic/theorem-based; the oracle must be materially independent.


Every permanent QL needs a materially different verification path.

Examples:

```text
angle chase:
  primary = theorem constraint graph
  verifier = hidden coordinate/direction-vector geometry where available

parallel lines:
  primary = angle theorem
  verifier = vector cross-product / direction equality

congruence:
  primary = criterion proof
  verifier = exact side/angle equality from canonical realization

similarity:
  primary = AA/SAS/SSS theorem proof
  verifier = proportional side measurements from hidden coordinates

midpoint/bisector:
  primary = named theorem
  verifier = coordinate ratio / equal-distance check

circle chord theorem:
  primary = circle theorem
  verifier = exact or high-precision circle-coordinate geometry

cyclic angle:
  primary = inscribed-angle theorem
  verifier = coordinate circle realization

tangent:
  primary = tangent theorem
  verifier = radius/tangent dot product plus equal-distance geometry

power of point:
  primary = theorem product relation
  verifier = direct coordinate intersection distances
```

A verifier may not simply call the same theorem helper chain under a different function name.

---

# 16. Admissibility and ambiguity

Every generated question must prove:

```text
canonical state valid
all displayed givens true
target exists
target uniquely determined
exactly one option correct
all options semantically distinct
diagram matches state
no hidden unstated assumption required
```

## 16.1 Triangle admissibility

Reject:

- non-positive sides;
- failed triangle inequality;
- inconsistent angle sums;
- unintended degenerate triangle;
- accidental extra equality that changes classification.

## 16.2 Circle admissibility

Reject:

- zero/negative radius;
- chord longer than diameter;
- tangent point not on circle;
- secant ordering inconsistent with labels;
- unintended diameter/chord special case unless required.

## 16.3 Angle admissibility

Reject learner-facing internal angles outside their intended geometric domain.

An algebraic equation producing `220°` cannot be accepted as an ordinary triangle interior angle simply because the algebra solves.

---

# 17. Clue minimality and anti-shortcut audit

For each displayed non-structural clue:

```text
remove clue
→ re-solve
→ target must become non-unique, unsolved, or materially change
```

If the target remains uniquely solvable without the clue, classify the clue:

```text
ESSENTIAL
SUPPORTIVE_EXAM_AUTHENTIC
REDUNDANT_REMOVE
DIAGRAM_LABEL_ONLY
```

Production questions should normally contain only essential clues plus a very small amount of authentic structural wording.

This prevents:

- bloated Geometry stems;
- decorative theorem clues;
- accidental one-step shortcuts;
- multi-theorem questions in which one theorem family is unnecessary.

---

# 18. Distractor architecture

Every wrong option must have a misconception owner.

## 18.1 Angle misconceptions

```text
USED_EQUAL_INSTEAD_OF_SUPPLEMENTARY
USED_SUPPLEMENTARY_INSTEAD_OF_EQUAL
WRONG_CORRESPONDING_ANGLE
WRONG_ALTERNATE_PAIR
FORGOT_TRIANGLE_SUM
USED_EXTERIOR_AS_INTERIOR
DOUBLED_ANGLE
HALVED_ANGLE
```

## 18.2 Congruence/similarity misconceptions

```text
AAA_AS_CONGRUENCE
SSA_AS_CONGRUENCE
WRONG_VERTEX_CORRESPONDENCE
INVERTED_SIDE_RATIO
MIXED_NONCORRESPONDING_SIDES
CONGRUENT_INSTEAD_OF_SIMILAR
```

## 18.3 Triangle-centre misconceptions

```text
CENTROID_1_TO_1_INSTEAD_OF_2_TO_1
REVERSED_CENTROID_RATIO
ANGLE_BISECTOR_ASSUMED_MEDIAN
MEDIAN_ASSUMED_ALTITUDE
WRONG_PERPENDICULAR_BISECTOR_INFERENCE
```

## 18.4 Quadrilateral misconceptions

```text
ASSUMED_ALL_DIAGONALS_EQUAL
ASSUMED_ALL_DIAGONALS_PERPENDICULAR
ASSUMED_TRAPEZIUM_PARALLELOGRAM_PROPERTY
USED_RECTANGLE_PROPERTY_FOR_RHOMBUS
```

## 18.5 Circle misconceptions

```text
CENTRAL_EQUALS_INSCRIBED
CENTRAL_HALF_INSCRIBED
CYCLIC_OPPOSITE_EQUAL
SAME_SEGMENT_SUPPLEMENTARY
RADIUS_NOT_PERPENDICULAR_TANGENT
UNEQUAL_TANGENTS_FROM_SAME_POINT
TANGENT_SECANT_USED_LINEAR_PRODUCT
SECANT_EXTERNAL_USED_AS_WHOLE
INTERSECTING_CHORD_WRONG_PAIRING
```

## 18.6 Option rules

- exactly one correct semantic answer;
- no numeric duplicate after simplification;
- no equivalent angle representation collision;
- no fallback `answer ± 1` unless that value corresponds to a defined misconception;
- no impossible physical/geometric values unless the distractor specifically represents a plausible misconception and remains context-valid.

---

# 19. Difficulty model

Recommended factors:

```text
proof depth
theorem-selection burden
inverse reasoning
correspondence burden
diagram density
number of interacting objects
need for auxiliary relation
case distinction
distractor proximity
representation burden
```

Suggested qualitative bands:

## Easy

- one theorem;
- direct correspondence;
- clean integer angle;
- obvious diagram relation explicitly marked.

## Medium

- two linked inferences;
- one reverse step;
- similarity/congruence correspondence;
- one algebraic parameter after theorem selection;
- circle relation with one intermediate angle.

## Hard

- two theorem families genuinely required;
- hidden intermediate relation;
- difficult correspondence;
- multi-circle/line configuration;
- mixed cyclic+tangent or parallel+similarity chain;
- statement/quantity/data-sufficiency wrapper over already mature theorem states.

Hard must never mean tiny labels, ugly diagrams or huge arithmetic.

---

# 20. Diagram contract

## 20.1 Diagram classes

```text
NO_DIAGRAM
OPTIONAL_STEM_DIAGRAM
REQUIRED_STEM_DIAGRAM
REQUIRED_SOLUTION_DIAGRAM
REQUIRED_BOTH
```

Geometry differs from most Quant chapters: some questions are naturally diagram-led. If the learner cannot unambiguously identify the configuration from prose alone, a stem diagram is required.

## 20.2 Diagram model

Recommended semantic payload:

```ts
interface GeoDiagramModel {
  points: DiagramPoint[];
  segments: DiagramSegment[];
  circles: DiagramCircle[];
  angleMarks: DiagramAngleMark[];
  rightAngleMarks: DiagramRightAngleMark[];
  equalLengthMarks: DiagramEqualLengthMark[];
  parallelMarks: DiagramParallelMark[];
  arcs: DiagramArc[];
  labels: DiagramLabel[];
  disclosure: "STEM" | "SOLUTION";
  notToScale: boolean;
}
```

## 20.3 Stem diagram anti-leak rules

A stem diagram must not reveal:

- requested angle value;
- requested segment value;
- unprovided equality;
- unprovided parallelism;
- hidden tangent/perpendicular mark;
- hidden midpoint;
- hidden centre relation;
- visually precise scale that makes the answer guessable when the question says not to scale.

## 20.4 Solution diagram

A solution diagram may add derived relations after the learner has attempted the question.

It should show only teaching-relevant derived evidence, not every solver fact.

## 20.5 Rendering

Preferred initial renderer:

```text
EXAMTREE_GEOMETRY_SVG_V1
```

The directive should be versioned and carried through the explanation/solution channel unless the question explicitly requires a stem figure.

## 20.6 Visual QA

Every diagram strategy must pass representative real-app review:

- desktop;
- mobile around `390×844`;
- no clipped labels;
- no overlapping point labels;
- no angle text on top of arcs;
- no unintended line crossing;
- right-angle markers visible;
- parallel/equal marks distinguishable;
- tangent point visually on circle;
- centre label clear;
- no horizontal overflow;
- accessible alternative description present.

Representative visual review is evidence; do not claim every generated seed visually reviewed unless it actually is.

---

# 21. Explanation architecture

The learner-facing solution should use a flexible teacher structure rather than rigid metadata headings.

Recommended semantic blocks:

```text
What is given
What we need
Key geometric idea
Worked reasoning
Answer
Exam shortcut / caution (only when genuinely useful)
```

Example style:

```text
AB is parallel to CD, so the alternate interior angle at C is equal to 65°.
Now look at triangle PCD. Its three interior angles must add to 180°.
Therefore x = 180° - 65° - 45° = 70°.

So the required angle is 70°.
```

Not acceptable:

```text
Alternate angles.
Triangle sum = 180°.
x = 180 - 65 - 45 = 70.
```

The first explains why the steps apply; the second is a formula dump.

## 21.1 Theorem wording

Explanations should use natural names:

```text
angles on a straight line add to 180°
alternate interior angles are equal because the lines are parallel
opposite angles of a cyclic quadrilateral add to 180°
a radius is perpendicular to the tangent at the point of contact
```

Do not expose identifiers such as `CYCLIC_OPPOSITE_SUPPLEMENTARY`.

---

# 22. Localisation architecture

English is the mathematical/editorial source authority until separately approved native freezes exist.

## 22.1 Preserve exactly across locales

- canonical geometry;
- QL identity;
- theorem sequence;
- options and order;
- correct index;
- requested semantic;
- point labels;
- numeric values;
- diagram geometry;
- diagram relation markers;
- proof-event sequence.

## 22.2 Localise naturally

- stems;
- theorem descriptions;
- reasoning sentences;
- exam cautions;
- accessibility text;
- diagram captions where present.

## 22.3 Point labels

Latin point labels such as `A`, `B`, `C`, `O`, `P` remain unchanged in Hindi and Punjabi. They are mathematical symbols, not English fallback.

## 22.3A Point-reference grammar audit

Latin mathematical labels remain unchanged, but surrounding Hindi/Punjabi grammar is reviewable content. Explicitly audit constructions such as:

```text
बिंदु A से
बिंदु B तक
रेखा AB के समानांतर

ਬਿੰਦੂ A ਤੋਂ
ਬਿੰਦੂ B ਤੱਕ
ਰੇਖਾ AB ਦੇ ਸਮਾਂਤਰ
```

Do not assume Latin point labels eliminate localisation risk.

## 22.4 Native theorem glossary

Create governed glossaries instead of ad-hoc translation.

Examples requiring deliberate approved wording:

```text
parallel lines
transversal
vertically opposite angles
alternate interior angles
congruent triangles
similar triangles
angle bisector
perpendicular bisector
centroid
circumcenter
orthocenter
cyclic quadrilateral
chord
arc
tangent
secant
point of contact
```

Punjabi should be natural learner language, not literal textbook calques where a simpler established phrase is clearer.

---

# 22A. Deferred source-audit inventory

Some mathematically valid families should be recorded explicitly rather than silently omitted or prematurely implemented.

Initial disposition:

```text
Euler-line relations                         → DEFERRED_SOURCE_AUDIT
advanced triangle-centre identities          → DEFERRED_SOURCE_AUDIT
common tangents between two circles          → DEFERRED_SOURCE_AUDIT
radical-axis style two-circle relations      → DEFERRED_SOURCE_AUDIT
advanced Apollonius-type constructions       → DEFERRED_SOURCE_AUDIT
non-routine loci                             → DEFERRED_SOURCE_AUDIT
advanced cyclic/tangent synthesis            → DEFERRED_SOURCE_AUDIT
Olympiad-style auxiliary-line constructions  → DEFERRED_SOURCE_AUDIT
```

A deferred family enters executable discovery only when target competitive-exam evidence justifies it.

# 23. Source-discovery policy

Before freezing a CP, audit sources for:

- SSC;
- Railway;
- Punjab state recruitment;
- school-level geometry only where it appears in competitive-exam form;
- Banking only where the target banking profile actually contains the family.

Do not inflate Geometry using Olympiad or board-exam proof families that do not recur in target competitive exams.

Every candidate family gets one disposition:

```text
RETAIN_AS_QL
MERGE_AS_PARAMETER
MERGE_AS_REPRESENTATION
MERGE_AS_ANSWER_VARIANT
SPLIT_BY_SOLVE_CONTRACT
REASSIGN_TO_MENSURATION
REASSIGN_TO_TRIGONOMETRY
REASSIGN_TO_COORDINATE_GEOMETRY
REASSIGN_TO_ALGEBRA
REJECT_SOURCE_THIN
REJECT_TOO_ADVANCED
DEFERRED_SOURCE_AUDIT
REJECT_DUPLICATE
```

---

# 24. QL allocation rules

A QL represents a materially distinct learner contract.

Create a separate QL only when at least one of these changes materially:

- target semantic;
- theorem/inference chain;
- evidence topology;
- inverse direction;
- correspondence burden;
- domain/admissibility condition;
- answer class;
- misconception profile;
- required diagram interpretation;
- proof topology.

Do **not** create a new QL for:
