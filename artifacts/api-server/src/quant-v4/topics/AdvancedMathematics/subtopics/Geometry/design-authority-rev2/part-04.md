- changed names;
- changed point labels;
- changed numbers;
- mirrored orientation;
- rotated diagram;
- swapping top/bottom or left/right while preserving the same theorem;
- English/Hindi/Punjabi;
- different SVG layout;
- trivial wording changes.

---

# 25. QL discovery/freeze protocol

For each CP:

```text
Wave 0 — source inventory
Wave 1 — temporary prototype implementation
Wave 2 — direct/inverse gap audit
Wave 3 — representation and diagram audit
Wave 4 — misconception/edge audit
Wave 5 — cross-CP ownership audit
Wave 6 — merge/split compression
Wave 7 — no-known-gap proof
Wave 8 — permanent QL proposal
Wave 9 — English review and approval
Wave 10 — English freeze
```

Only after Wave 10 should downstream language/product work begin.

No permanent QL number should be reserved simply because a design table currently lists a family.

---

# 26. Question Studio package contract

A mature Geometry package should expose:

```text
packageId
cpId
qlId
solveMode
difficulty
language
seed
stem
stemDiagramDirective?
options
correctIndex
answer
solution
solutionDiagramDirective?
theoremTrace (internal/reviewer)
canonicalGeometryFingerprint
diagramFingerprint
validation
lifecycle
```

Reviewer metadata may additionally include:

```text
theoremIds
proofDepth
misconceptionIds
sourceFamily
representation
diagramStrategy
minimalityProof
independentVerifierResult
```

Internal metadata must not leak into the learner surface.

---

# 27. Lifecycle

Recommended progression:

```text
DISCOVERY
→ RUNTIME_PROOF
→ REVIEW_CANDIDATE
→ ENGLISH_APPROVED
→ ENGLISH_FROZEN
→ HI_PA_REVIEW_CANDIDATE
→ MULTILINGUAL_APPROVED
→ MULTILINGUAL_FROZEN
→ QUESTION_STUDIO_ACTIVE
→ QUESTION_BANK_WRITABLE
→ TEST_ELIGIBLE
→ PUBLICLY_PUBLISHABLE
```

Each transition requires explicit executable evidence.

Content freeze does not automatically authorize merge, Question Bank writes, tests or publication.

---

# 28. Audit matrix

## 28.1 Mathematical audits

- exact solver result;
- independent verifier agreement;
- theorem preconditions satisfied;
- target unique;
- answer option unique;
- no invalid domain state;
- no unintended shortcut;
- clue minimality;
- cross-CP ownership.

## 28.2 Diagram audits

- semantic diagram parity;
- no hidden relation leakage;
- label uniqueness;
- visibility;
- point-on-circle correctness;
- tangent/secant rendering correctness;
- relation marks match state;
- mobile/desktop rendering.

## 28.3 Editorial audits

Reject:

- formula-only explanations;
- theorem-name-only explanations;
- internal IDs;
- robotic `Given... First... Then...`;
- ambiguous pronouns;
- unclear angle naming;
- diagram references to missing labels;
- claims that rely on visual appearance rather than marked givens;
- unexplained use of similarity/congruence;
- excessively long option-by-option lectures for simple questions.

## 28.4 Diversity audits

Track:

- theorem family;
- target type;
- state fingerprint;
- diagram topology;
- stem structure;
- answer position;
- difficulty;
- distractor ancestry.

Reject fake diversity produced only by renaming points.

---

# 29. Metamorphic tests

Geometry should have unusually strong metamorphic proof.

Examples:

## Point renaming

Renaming:

```text
A→P, B→Q, C→R
```

must preserve answer semantics.

## Rotation/reflection of layout

Changing only diagram orientation must preserve the mathematical answer.

## Diagram scale change

Resizing/reflowing must not change geometry semantics.

## Equivalent theorem representation

A parallel-line configuration mirrored left/right should preserve the same solve contract.

## Similarity scaling

Uniformly scaling all hidden coordinates must preserve angles and ratios.

## Circle rotation

Rotating all circle points around the centre must preserve chord/arc/tangent relations.

These tests are especially valuable because they detect accidental dependence on absolute diagram position.

---

# 30. Cross-chapter collision audit

Before any permanent freeze, compare Geometry candidates against:

```text
MEN-001
TRG-001
TRG-002
ALG-001/002
future CGE-001
```

A candidate must be reassigned if the actual learner burden belongs elsewhere.

Examples:

```text
triangle area from base and height
→ Mensuration

find tower height using tan 30°
→ Trigonometry

solve 3x + 7 = 25
→ Algebra

find slope through (2,3) and (5,9)
→ Coordinate Geometry

AB ∥ CD; find alternate angle
→ Geometry

two triangles are similar; find corresponding side
→ Geometry

sector area from radius and angle
→ Mensuration

tangent-chord angle relation
→ Geometry
```

---

# 31. Initial implementation phases

## Phase 0 — Authority lock and exact foundation

Deliver:

- this design committed as sole Geometry design authority;
- package manifests;
- cross-chapter ownership map;
- shared exact geometry types;
- canonical points/lines/segments/circle primitives;
- relation model;
- theorem registry skeleton;
- shared angle-engine skeleton;
- independent coordinate-oracle skeleton;
- diagram semantic model;
- minimal semantic SVG renderer sufficient for Phase-1 prototypes;
- lifecycle locks;
- no permanent QLs.

Exit gate:

```text
foundation compile PASS
primitive geometry proof PASS
shared angle-engine smoke proof PASS
coordinate-oracle smoke proof PASS
minimal diagram semantic-parity PASS
ownership lock PASS
Question Studio disabled
```

The renderer must evolve from real Geometry question needs. Do not block mathematical discovery by attempting to design a universal cross-Quant figure renderer before the semantic API is proven.

---

## Phase 1 — GEO-CP-001..003 executable discovery

Implement temporary prototypes for:

- basic angles;
- parallel lines/transversal;
- triangle angle/side properties.

This establishes:

- exact angle constraint engine;
- theorem proof events;
- first diagram renderer;
- misconception option model;
- coordinate oracle;
- clue minimality proof.

No permanent QLs yet.

---

## Phase 2 — GEO-CP-004..006

Implement:

- congruence;
- similarity;
- triangle centres/bisectors/midpoints.

This phase adds:

- correspondence engine;
- exact segment ratios;
- proportional constraints;
- congruence/similarity validators;
- more advanced diagram marks.

---

## Phase 3 — GEO-CP-007..009

Implement:

- right-triangle theorem properties;
- quadrilaterals;
- polygons.

Run a major collision audit against Mensuration and Trigonometry before retaining CP-007 families.

---

## Phase 4 — GEO-CP-010..013

Implement circle foundation:

- chords/centre;
- cyclic/inscribed angles;
- tangents;
- secants/power relations.

This phase must establish the full circle diagram oracle before QL freeze.

---

## Phase 5 — GEO-CP-014 mixed synthesis

Only after all ordinary theorem families are stable.

Add mixed two-family questions and high-value diagram reasoning.

No difficulty stacking for its own sake.

---

## Phase 6 — Chapter-wide English saturation

For every CP:

- source-gap audit;
- inverse-gap audit;
- edge audit;
- representation audit;
- diagram audit;
- cross-CP overlap audit;
- cross-chapter ownership audit;
- merge/split compression;
- no-known-gap evidence.

Then propose permanent QL counts.

---

## Phase 7 — Permanent allocation and English review

- allocate package-local contiguous QLs;
- generate representative review corpus;
- independently re-solve high-risk samples;
- inspect all diagram strategies;
- remediate editorial issues;
- obtain explicit English approval;
- freeze content fingerprint.

---

## Phase 8 — Hindi/Punjabi localisation

- localise from frozen English semantic authority;
- preserve diagrams and theorem sequence;
- run native terminology/grammar review;
- export side-by-side review corpus;
- obtain explicit approval;
- freeze multilingual content.

---

## Phase 9 — Standard Question Studio integration

Only after chapter/package freeze:

```text
capabilities discovery
generation by CP/QL
difficulty filter
language filter
seeded batch generation
review queue
Question Bank conversion
test eligibility
publication gates
```

Activation must be independent from content freeze.

---

# 32. Suggested repository structure

```text
artifacts/api-server/src/quant-v4/
├── shared/
│   └── geometry/
│       ├── exact.ts
│       ├── point.ts
│       ├── line.ts
│       ├── circle.ts
│       ├── relations.ts
│       ├── angle.ts
│       ├── theorem-registry.ts
│       ├── constraint-graph.ts
│       ├── synthetic-solver.ts
│       ├── coordinate-oracle.ts
│       ├── admissibility.ts
│       ├── diagram-model.ts
│       ├── diagram-layout.ts
│       └── index.ts
└── topics/
    └── AdvancedMathematics/
        └── subtopics/
            └── Geometry/
                ├── GEO-END-TO-END-DESIGN.md
                ├── GEO-FAMILY-AUTHORITY.md
                ├── GEO-SOURCE-AND-OWNERSHIP-AUDIT.md
                ├── GEO-OPEN-QL-DISCOVERY-AND-FREEZE-PROTOCOL.md
                ├── GEO-001/
                │   ├── manifest.ts
                │   ├── GEO-CP-001/
                │   ├── GEO-CP-002/
                │   ├── ...
                │   └── GEO-CP-009/
                ├── GEO-002/
                │   ├── manifest.ts
                │   ├── GEO-CP-010/
                │   ├── ...
                │   └── GEO-CP-014/
                └── tests/
```

---

# 33. Phase-0 mandatory test inventory

At minimum:

```text
exact-angle.test.ts
line-incidence.test.ts
parallel-perpendicular.test.ts
segment-ratio.test.ts
circle-incidence.test.ts
theorem-registry.test.ts
constraint-graph.test.ts
angle-engine.test.ts
coordinate-oracle.test.ts
quadrilateral-validity.test.ts
diagram-semantic-parity.test.ts
diagram-metamorphic.test.ts
lifecycle-lock.test.ts
```

Later checkpoint tests must be package-specific rather than one giant chapter test.

---

# 34. First executable prototype recommendations

The first implementation wave should deliberately use simple but architecture-revealing families:

```text
1. vertically opposite angle
2. linear-pair unknown
3. corresponding angle on parallel lines
4. co-interior supplementary angle
5. triangle third angle
6. exterior-angle theorem
7. isosceles base angle
8. triangle-inequality range
```

Why these first:

- they exercise exact angles;
- they exercise equation constraints;
- they exercise relation marks;
- they exercise diagram layout;
- they exercise theorem traces;
- they expose ambiguity/minimality problems early;
- they do not require the more complex similarity/circle engines yet.

These are **temporary prototypes**, not pre-approved permanent QLs.

---

# 35. Freeze criteria

A package may be proposed for English freeze only when all are true:

```text
source discovery closed
no-known-gap audit passed
cross-CP merge/split closed
cross-chapter ownership closed
permanent QLs contiguous
every QL deterministic
every QL independently verified
coordinate oracle used wherever applicable
every state admissible
quadrilateral subtype validity proven where relevant
exactly one correct option
all distractors misconception-backed
all required diagrams semantic
representative visual strategies reviewed
human explanations approved
no internal metadata leakage
English review approved
content fingerprint recorded
Question Studio/product gates still safely controlled
```

---

# 36. Non-goals for Geometry V1

Do not silently expand V1 into:

- Coordinate Geometry;
- construction-with-compass problems;
- formal Euclidean proof-writing;
- advanced olympiad geometry;
- inversion;
- projective geometry;
- conic sections;
- advanced loci;
- arbitrary 3D geometry;
- trigonometric geometry;
- mensuration disguised as theorem questions.

A later source audit may add a family only if target competitive exams justify it.

---

# 37. Final design verdict

Geometry should be built as a **theorem-driven, diagram-aware exact reasoning engine**, not as another measurement chapter.

The central architecture is:

```text
canonical Euclidean state
→ shared theorem / angle engine
→ synthetic solver
→ independent coordinate oracle
→ minimal displayed evidence
→ misconception-backed options
→ semantic SVG
→ human explanation
→ multilingual parity
→ controlled Question Studio lifecycle
```

The recommended package boundary is:

```text
GEO-001
  Lines → Triangles → Congruence → Similarity
  → Triangle centres → Right-triangle theorem properties
  → Quadrilaterals → Polygons

GEO-002
  Circle fundamentals → Cyclic/inscribed angles
  → Tangents → Secants/power of point
  → Mixed Euclidean synthesis
```

Coordinate Geometry remains a separate future Cartesian family.

No permanent QL count is authorized by this design. The next implementation action is **Phase 0 foundation + executable discovery for GEO-CP-001..003**, using temporary prototype identities only.

---

## Revision-2 incorporated improvements

This revision integrates the strongest architecture ideas from the external Geometry design review while preserving ExamTree's existing ownership decisions:

- one reusable chapter-wide angle-chasing engine;
- coordinate reconstruction/oracle as mandatory independent verification wherever applicable;
- structure-first figure generation;
- explicit quadrilateral degeneracy/subtype validation;
- neutral reuse of Pythagorean and other clean parameter pools;
- theorem-confusion distractors as the default wrong-option strategy;
- explicit checkpoint dependency graph;
- point-reference grammar audit for Hindi/Punjabi;
- formal `DEFERRED_SOURCE_AUDIT` register;
- minimal semantic renderer first, evolved from executable Geometry needs;
- Coordinate Geometry remains separate.
