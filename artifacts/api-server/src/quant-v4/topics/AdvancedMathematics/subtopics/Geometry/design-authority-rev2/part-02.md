AA_SIMILARITY
SAS_SIMILARITY
SSS_SIMILARITY
BASIC_PROPORTIONALITY_THEOREM
BPT_CONVERSE
ANGLE_BISECTOR_THEOREM
MIDPOINT_THEOREM
MIDPOINT_CONVERSE

PARALLELOGRAM_OPPOSITE_SIDES
PARALLELOGRAM_OPPOSITE_ANGLES
PARALLELOGRAM_DIAGONALS_BISECT
RECTANGLE_DIAGONALS_EQUAL
RHOMBUS_DIAGONALS_PERPENDICULAR
SQUARE_COMBINED_PROPERTIES
TRAPEZIUM_PARALLEL_RELATIONS

POLYGON_INTERIOR_SUM
POLYGON_EXTERIOR_SUM
REGULAR_POLYGON_ANGLE
POLYGON_DIAGONAL_COUNT

EQUAL_CHORD_EQUAL_ARC
EQUAL_CHORD_EQUAL_CENTRE_DISTANCE
PERPENDICULAR_FROM_CENTRE_BISECTS_CHORD
CENTRAL_ANGLE_DOUBLE_INSCRIBED
SAME_SEGMENT_ANGLE
ANGLE_IN_SEMICIRCLE
CYCLIC_OPPOSITE_SUPPLEMENTARY
CYCLIC_EXTERIOR_EQUALS_INTERIOR_OPPOSITE

RADIUS_PERPENDICULAR_TANGENT
TANGENTS_FROM_EXTERNAL_POINT_EQUAL
TANGENT_CHORD_ANGLE
INTERSECTING_CHORD_PRODUCT
SECANT_SECANT_POWER
TANGENT_SECANT_POWER
```

Student explanations must render natural theorem names, never internal IDs.

---

# 9. Proof-event model

The solver must emit structured proof events.

Example:

```ts
type GeoProofEvent =
  | {
      kind: "ANGLE_EQUALITY";
      leftAngle: AngleRef;
      rightAngle: AngleRef;
      reason: TheoremId;
    }
  | {
      kind: "ANGLE_SUM";
      angles: AngleRef[];
      total: ExactAngle;
      reason: TheoremId;
    }
  | {
      kind: "SEGMENT_RATIO";
      left: SegmentRatio;
      right: SegmentRatio;
      reason: TheoremId;
    }
  | {
      kind: "SEGMENT_PRODUCT";
      left: SegmentProduct;
      right: SegmentProduct;
      reason: TheoremId;
    }
  | {
      kind: "CONGRUENCE";
      triangle1: TriangleRef;
      triangle2: TriangleRef;
      criterion: TheoremId;
    }
  | {
      kind: "SIMILARITY";
      triangle1: TriangleRef;
      triangle2: TriangleRef;
      criterion: TheoremId;
      correspondence: VertexCorrespondence;
    };
```

The learner explanation compiler converts these proof events into human teaching prose.

---

# 9A. Checkpoint dependency graph

Implementation order should follow mathematical dependencies rather than file-count convenience.

```text
GEO-CP-001
   │
   ├──────────────→ GEO-CP-002
   │                   │
   │                   └────────→ GEO-CP-003
   │                                  │
   │                                  ├────→ GEO-CP-004
   │                                  │          │
   │                                  │          └────→ GEO-CP-005
   │                                  │
   │                                  ├────→ GEO-CP-006
   │                                  └────→ GEO-CP-007
   │
   ├──────────────→ GEO-CP-008 → GEO-CP-009
   │
   └──────────────→ GEO-CP-010 → GEO-CP-011 → GEO-CP-012 → GEO-CP-013

mature earlier theorem families ─────────────────────────────→ GEO-CP-014
```

This graph is an implementation dependency guide. It does not mean every later question must use every earlier theorem family.

# 10. GEO-001 checkpoint authority

## GEO-CP-001 — Basic lines, rays and angle relations

Owns:

- complementary and supplementary angles;
- linear pair;
- vertically opposite angles;
- angles around a point;
- straight-line angle equations;
- intersecting-line angle inference;
- bounded algebraic angle expressions.

Provisional solve families:

```text
find vertical angle
find adjacent linear-pair angle
solve x from linear pair
solve x from vertical equality
find angle from around-point sum
identify supplementary/complementary relation
reverse-find stated angle expression parameter
verify angle claim
```

Do not create separate QLs merely for changing `2x+10` to `3x-5`.

---

## GEO-CP-002 — Parallel lines and transversals

Owns:

- corresponding angles;
- alternate interior/exterior angles;
- co-interior angles;
- identifying parallelism from converse relations;
- multiple-transversal angle transfer;
- parallel line plus triangle combinations where the parallel relation is the primary burden.

Mandatory edges:

- do not assume lines are parallel from appearance;
- parallel marks must be explicit in the canonical diagram;
- converse questions must not be solved by a forward theorem accidentally embedded elsewhere in the givens.

Provisional solve families:

```text
find corresponding angle
find alternate angle
find co-interior supplement
solve algebraic angle parameter
prove/select parallel lines from angle equality
two-transversal chained angle
parallel-through-triangle transfer
```

---

## GEO-CP-003 — Triangle angle and side properties

Owns:

- triangle angle sum;
- exterior-angle theorem;
- isosceles/equilateral angle relations;
- side-angle ordering;
- triangle inequality;
- valid/invalid triangle classification;
- special-angle triangle theorem relations that do not require trigonometry.

Provisional solve families:

```text
find third angle
find angle from exterior angle
find base/apex angle in isosceles triangle
use converse isosceles property
compare sides from angles
compare angles from sides
find permissible third-side range
count integer third-side possibilities
classify triangle from angle/side evidence
```

Direct area/perimeter remains Mensuration.

---

## GEO-CP-004 — Congruence and rigid triangle inference

Owns:

- SSS;
- SAS;
- ASA/AAS;
- RHS;
- identifying correspondence;
- CPCT-derived equality;
- deciding whether supplied information is sufficient for congruence.

Important distinction:

```text
SSA is not a general congruence rule.
AAA proves similarity, not congruence.
```

Provisional solve families:

```text
select valid congruence criterion
find missing equal side/angle after congruence
recover vertex correspondence
identify CPCT conclusion
reject insufficient congruence evidence
statement sufficiency for congruence
```

---

## GEO-CP-005 — Similarity and proportional geometry

Owns:

- AA;
- SAS similarity;
- SSS similarity;
- corresponding side ratios;
- unknown segment recovery;
- scale factor;
- Basic Proportionality Theorem;
- converse BPT;
- similarity-based segment chains.

Provisional solve families:

```text
identify similar triangles
recover correspondence
find missing side
find scale factor
find side ratio
BPT direct segment
BPT converse parallelism
nested-similarity segment chain
```

### Boundary

Area ratio of similar figures is owned by Mensuration when the task is fundamentally area measurement. Geometry may use area-ratio consequences only if a future source audit proves a theorem-centric recurring contract that cannot be cleanly owned by Mensuration.

---

## GEO-CP-006 — Triangle centres, medians, altitudes and bisectors

Owns theorem/property reasoning involving:

- median;
- centroid;
- angle bisector;
- perpendicular bisector;
- altitude;
- incenter;
- circumcenter;
- orthocenter;
- centroid division ratio;
- midpoint theorem;
- angle-bisector theorem;
- perpendicular-bisector equal-distance property.

Provisional solve families:

```text
centroid 2:1 segment relation
recover median parts
angle-bisector side ratio
recover side from angle-bisector ratio
point on perpendicular bisector → equal distances
equal distances → perpendicular-bisector membership
identify centre from intersection description
midpoint theorem direct
midpoint theorem converse
```

Euler-line or advanced centre relations are source-audit only, not assumed production scope.

---

## GEO-CP-007 — Right-triangle theorem properties and special relations

This checkpoint exists to preserve theorem ownership without duplicating routine Mensuration/Trigonometry questions.

Allowed families:

- Pythagorean theorem where theorem application is the burden;
- Pythagorean converse;
- right-triangle classification;
- altitude-to-hypotenuse geometric mean relations if source-backed;
- special right-triangle structural relations if source-backed;
- median-to-hypotenuse theorem;
- circumcenter of right triangle at hypotenuse midpoint.

Excluded:

- routine area;
- trig ratios;
- heights/distances;
- repeated plain `a²+b²=c²` third-side drills already owned elsewhere.

Every retained QL must survive the cross-chapter duplication audit.

---

## GEO-CP-008 — Quadrilaterals and special quadrilateral properties

Owns theorem/property reasoning for:

- general quadrilateral angle sum;
- parallelogram;
- rectangle;
- rhombus;
- square;
- trapezium/trapezoid;
- kite where source-backed;
- diagonal properties;
- converse identification.

Provisional solve families:

```text
find fourth angle
parallelogram opposite angle
parallelogram opposite side
parallelogram diagonal bisection
identify parallelogram from converse property
rectangle diagonal equality
rhombus perpendicular diagonals
square combined relation
trapezium parallel-angle relation
mid-segment relation if source-backed
```

Direct quadrilateral area/perimeter remains Mensuration.

---

### GEO-CP-008 mandatory quadrilateral validity gate

Every generated quadrilateral must prove:

```text
all vertices distinct
all edges non-zero
non-adjacent edges do not cross unless explicitly intended
vertex order consistent
convexity / concavity matches intended family
parallel requirements exact
perpendicular requirements exact
equal-side requirements exact
diagonal requirements exact
no unintended stronger subtype
```

Reject accidental strengthening such as:

```text
parallelogram → rectangle
rectangle → square
rhombus → square
trapezium → parallelogram
kite → rhombus
```

Shape validity belongs in construction, not post-hoc repair.

## GEO-CP-009 — Polygons and regular-polygon angle structure

Owns:

- interior-angle sum;
- exterior-angle sum;
- regular polygon interior/exterior angle;
- number of sides from angle;
- diagonal count;
- angle relations in regular polygons where theorem-based.

Provisional solve families:

```text
interior sum from n
n from interior sum
regular exterior angle from n
n from exterior angle
regular interior angle from n
n from interior angle
number of diagonals
recover n from diagonal count
mixed interior/exterior relation
```

Polygon area remains Mensuration.

---

# 11. GEO-002 checkpoint authority

## GEO-CP-010 — Circle fundamentals, chords, arcs and centre relations

Owns:

- radius/diameter structural relations;
- equal chords ↔ equal arcs;
- equal chords ↔ equal distance from centre;
- perpendicular from centre to chord bisects chord;
- converse centre-chord relations;
- chord-distance configurations;
- diameter special cases.

Provisional solve families:

```text
equal chord → equal arc/angle
equal distance from centre → equal chords
centre perpendicular → chord bisection
chord midpoint → perpendicular centre line
recover half chord / full chord from theorem state
compare chords from centre distances
```

Circumference/area/sector/arc length remains Mensuration.

---

## GEO-CP-011 — Inscribed angles, cyclic quadrilaterals and arc-angle relations

Owns:

- angle at centre versus angle at circumference;
- angles in same segment;
- angle in semicircle;
- cyclic quadrilateral opposite angles;
- cyclic exterior angle relation;
- identifying cyclicity from converse relations;
- chord/arc subtended-angle reasoning.

Provisional solve families:

```text
central angle from inscribed angle
inscribed angle from central angle
same-segment angle
semicircle right angle
cyclic opposite angle
cyclic exterior angle
prove/select cyclic quadrilateral
multi-arc angle chain
```

---

## GEO-CP-012 — Tangents and tangent-based relations

Owns:

- radius perpendicular to tangent;
- two tangents from an external point are equal;
- tangent-chord theorem;
- angle between tangents;
- centre-external-point-tangent triangle relations when theorem-led;
- common tangent relations between two circles only when source-backed and exam-relevant.

Provisional solve families:

```text
radius-tangent right angle
equal tangent lengths
missing segment from equal tangents
tangent-chord angle
angle between tangents from central angle
central angle from tangent angle
tangent configuration theorem verification
```

---

## GEO-CP-013 — Secants, intersecting chords and power-of-a-point relations

Owns exact product relations:

```text
intersecting chords:
PA × PB = PC × PD

two secants from external point:
external × whole = external × whole

tangent-secant:
PT² = PA × PB
```

Provisional solve families:

```text
intersecting-chord missing segment
secant-secant missing external/whole segment
tangent-secant tangent length
reverse missing secant piece
compare two products
identify invalid product setup
multi-step power relation
```

Mandatory safeguards:

- distinguish internal chord intersection from external secants;
- do not confuse external part with whole secant;
- all segments must be positive;
- diagram labels must make segment ordering unambiguous.

---

## GEO-CP-014 — Mixed Euclidean theorem synthesis and diagram reasoning

Implemented last.

Owns questions requiring genuine combination of earlier Geometry engines, for example:

```text
parallel line + similar triangles
cyclic quadrilateral + tangent
centre/chord + Pythagorean theorem
similarity + angle bisector
congruence + parallel relation
circle theorem + triangle property
```

Rules:

- ordinary mixed questions should require at most two major theorem families unless authentic source evidence supports more;
- one family must not be cosmetic;
- the mixed question must not duplicate an earlier single-theorem QL with extra irrelevant givens;
- clue minimality is mandatory;
- diagram clarity gate is stricter than for single-family questions.

Potential higher-order presentation families such as statement-based Geometry, Quantity Comparison or Data Sufficiency should be introduced here only after the underlying ordinary theorem QLs are frozen.

---

# 12. Generator architecture

Canonical generation flow:

```text
select runtime package
→ select CP
→ select provisional/permanent QL
→ choose exam profile
→ choose difficulty topology
→ construct valid canonical geometry
→ derive theorem relations
→ choose target
→ choose displayed givens
→ solve synthetically
→ verify independently
→ test clue minimality
→ build misconception distractors
→ canonicalise options
→ project diagram
→ render stem
→ compile human solution
→ localise
→ run parity and diagram audits
→ emit Question Studio package
```

Determinism key:

```text
runtimePackageId
+ cpId
+ qlId
+ seed
+ language
+ generatorVersion
+ diagramVersion
