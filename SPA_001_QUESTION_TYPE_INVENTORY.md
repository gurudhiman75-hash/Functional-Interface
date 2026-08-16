# SPA-001 Spatial Question-Type Inventory

## Purpose

This inventory freezes the first-pass chapter boundaries, canonical problem families and implementation dependencies for ExamTree Spatial Reasoning. Final QL counts must be coverage-driven; the ranges below are planning targets, not mandatory quotas.

## 1. Foundation proof allocation

| Chapter | Proof count | Minimum coverage |
|---|---:|---|
| `MIR-001` | 12 | simple shape, arrow, marker, shading, nested and multi-object figures |
| `WAT-001` | 8 | top-bottom reversal, marker/shading and multi-object figures |
| `FAN-001` | 10 | rotation, reflection, add/remove, position and compound rules |
| `FCL-001` | 8 | structural, count, orientation and shading classification |
| `FSR-001` | 10 | rotation, movement, count, alternation and compound progression |

Every proof question requires a fixed seed, expected semantic answer, misconception tags and explanation evidence.

## 2. `MIR-001` Mirror Images

Canonical problem families:

1. single asymmetric geometric figure;
2. arrow or directional symbol;
3. dot/marker position;
4. shading position;
5. nested shapes;
6. multi-object arrangement;
7. alphanumeric symbol using an approved font;
8. mirror placed on the left;
9. mirror placed on the right;
10. closest-distractor rotation versus reflection.

Key validator: vertical reflection about the declared mirror line. The line location must be explicit and the result must not be inferred from a generic “mirror” label.

Planning range: 60–80 English QLs.

## 3. `WAT-001` Water Images

Canonical problem families:

1. simple horizontal reflection;
2. arrow orientation;
3. marker or dot position;
4. shading movement;
5. nested figure;
6. multi-object arrangement;
7. alphanumeric symbol where unambiguous;
8. closest-distractor mirror versus water image.

Key validator: horizontal reflection about the declared water line.

Planning range: 50–70 English QLs.

## 4. `FAN-001` Figure Analogy

Canonical rule families:

1. fixed-angle rotation;
2. reflection;
3. translation/position movement;
4. addition or deletion;
5. shape substitution;
6. shading inversion or movement;
7. inner/outer exchange;
8. object-count change;
9. direction reversal;
10. segment change;
11. two-object independent transformation;
12. compound two-step rule.

The generator must prove that the selected A→B rule is sufficiently unique before applying it to C. Questions with several equally simple interpretations are rejected.

Planning range: 100–130 English QLs.

## 5. `FCL-001` Figure Classification

Canonical common-property families:

1. same transformation family;
2. same component count;
3. same intersection topology;
4. same inside/outside relationship;
5. same rotational class;
6. same shading rule;
7. same orientation relation;
8. same composition/decomposition rule;
9. one violation in a multi-object relationship.

The odd figure must violate a semantic property, not drawing quality, spacing or accidental visual style.

Planning range: 70–90 English QLs.

## 6. `FSR-001` Figure Series

Canonical progression families:

1. constant rotation;
2. alternating rotation;
3. position cycling;
4. shading movement;
5. add/remove progression;
6. object-count progression;
7. shape substitution cycle;
8. two-object independent movement;
9. alternate-term rules;
10. compound transformation;
11. progressive partition or segment change;
12. advanced matrix-like sequence.

Each series stores explicit state transitions. A visually selected sequence without a machine-readable transition rule is invalid.

Planning range: 110–150 English QLs.

## 7. `FGC-001` Figure Completion

Canonical problem families:

- missing quadrant or tile;
- continuation through boundary points;
- symmetry completion;
- line and curve continuation;
- shading continuity;
- concentric or nested completion;
- grid/intersection completion;
- multi-rule completion.

Every candidate is checked against all entry and exit points on the missing-region boundary.

Planning range: 60–80 English QLs.

## 8. `PFC-001` Paper Folding and Cutting

Canonical progression:

1. single vertical or horizontal fold, single hole;
2. single fold with an edge cut;
3. two perpendicular folds;
4. repeated same-direction folds;
5. corner fold;
6. diagonal fold;
7. diagonal plus axial fold;
8. multiple cuts or holes;
9. cut touching an edge;
10. three-fold advanced unfolding.

The solver records the fold stack, folded side, active polygon, layer count and inverse transformations. Purely pictorial unfolding without fold-state evidence is prohibited.

Planning range: 100–130 English QLs.

## 9. `EMB-001` Embedded Figures

Canonical problem families:

- direct target embedding;
- rotated target;
- reflected target only when allowed;
- additional crossing lines;
- multiple overlaps;
- topologically similar but invalid distractor;
- target containing curved and straight edges.

The target must exist as an exact permitted graph substructure. Visual resemblance is insufficient.

Planning range: 70–90 English QLs.

## 10. `FFM-001` Figure Formation

Canonical problem families:

- select pieces forming a target;
- identify result of joining pieces;
- two-piece and three-piece assembly;
- tangram-style assembly;
- rotation allowed but reflection disallowed;
- hidden joined edge;
- matching boundary lengths and angles.

The solver stores the placement transform for every piece.

Planning range: 50–70 English QLs.

## 11. `FCT-001` Counting Figures

Canonical problem families:

1. line segments;
2. triangles in simple divisions;
3. triangles in grids or composite polygons;
4. squares;
5. rectangles;
6. mixed squares and rectangles;
7. quadrilaterals;
8. overlapping polygons/circles;
9. combined-shape counting.

Every counted object stores its vertices, edges, size class and orientation. Explanations group small, medium, large and whole figures instead of presenting an unsupported total.

Planning range: 100–140 English QLs.

## 12. `CND-001` Cubes and Dice

Internal modules:

- dice orientation and common-face reasoning;
- opposite and adjacent faces;
- possible/impossible arrangements;
- cube nets;
- painted cubes and cuboids;
- incomplete cube stacks;
- top/front/side views.

All 3D rotations are canonicalised so rotated views of the same cube compare equal. Painted-cube answers are derived from coordinates or face exposure, not memorised formulas alone.

Planning range: 130–180 English QLs.

## 13. Secondary chapters

### `DOT-001` Dot Situation

Region membership, inside/outside relationships and matching relative positions. Planning range: 40–60 QLs.

### `FMT-001` Figure Matrix

Row/column rotation, addition, subtraction, superimposition, shading and count logic. Planning range: 70–100 QLs.

### `IDF-001` Identical Figure

Exact matching under the question’s allowed equivalence policy. Lower architectural priority. Planning range: 30–50 QLs.

## 14. Dependency order

1. Scene schema, deterministic geometry and option renderer.
2. Mirror and Water Images.
3. Figure Analogy and Classification.
4. Figure Series and Completion.
5. Fold engine for Paper Folding and Cutting.
6. Graph engine for Embedded, Formation and Counting Figures.
7. 3D orientation engine for Cubes and Dice.
8. Matrix and secondary chapters.

## 15. Editorial coverage requirements

Every chapter inventory must eventually record:

- exam pattern and source family;
- canonical problem and task kind;
- solve mode and answer type;
- allowed difficulty bands;
- required primitives and transformations;
- misconception/distractor families;
- solver evidence type;
- explanation pattern;
- exclusions and ambiguity controls;
- English/Hindi/Punjabi terminology requirements.

A chapter cannot begin bulk QL production until its canonical problem inventory and exclusions are approved.