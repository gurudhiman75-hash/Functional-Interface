# PFC-001 / TPF-001 — Source-Saturated End-to-End Design V2

## 1. Why V2 exists

V1 over-concentrated on square opaque paper and treated a controlled 10-representation inventory as if it were enough to proceed toward permanent runtime freeze. A fresh audit of uploaded reference material plus indexed SSC PYQs proves that this is too narrow.

V2 therefore reopens source saturation and separates mechanisms before further permanent allocation or Question Studio work.

## 2. Chapter ownership after source saturation

### PFC-001 — Paper Cutting, Punching and Unfolding

PFC-001 owns opaque-paper tasks where folds create a physical layer stack and a later cut/punch is propagated through the layers.

It includes two solve directions:

1. `OPAQUE_CUT_UNFOLD_FORWARD` — fold/cut sequence is given; choose the completely unfolded result.
2. `OPAQUE_FOLD_PUNCH_REVERSE_INFERENCE` — final unfolded pattern is given; choose the fold/punch process that could produce it.

The reverse task remains inside PFC because the physical authority is the same fold/layer/cut model; only the solve direction changes. Discovery must determine whether reverse inference deserves its own permanent QL.

### TPF-001 — Transparent Pattern Folding

Transparent patterned-sheet folding is a separate discovery chapter candidate.

It owns:

- `TRANSPARENT_PATTERN_FOLD_SUPERPOSITION`.

The input contains a visible pattern before folding. Folding reflects the moving region and superimposes the reflected pattern on the stationary region. There is no punch/cut layer-propagation authority. This is a different solver from PFC and must not be faked through the cut engine.

No permanent TPF QL is allocated in V2.

## 3. Source-supported original sheet shapes

PFC discovery must support at least:

- square;
- rectangle with non-1:1 aspect ratio;
- circle with an analytic curved boundary.

Square remains common but cannot be the only production shape.

Additional source-sheet shapes are not added merely for visual variety. They require direct recurrence evidence.

TPF currently has strong evidence for square transparent sheets. Rectangle/circle TPF variants remain unsupported until direct source evidence is found.

## 4. Required PFC cut geometry

The production cut model must be shape-aware, not centre-only.

Required cut primitives:

- circular hole;
- square/rectangular cut;
- diamond cut;
- triangular cut;
- V-notch;
- rounded/semicircular notch;
- straight slit;
- multiple mixed cuts in one folded state.

Non-symmetric cuts must preserve orientation under every reflection. Boundary cuts must alter the visible boundary rather than render as circles placed on an edge.

## 5. Revised source boundary model

```ts
type PfcSourceBoundaryV2 =
  | {
      kind: "POLYGON";
      shape: "SQUARE" | "RECTANGLE";
      vertices: PfcPoint[];
    }
  | {
      kind: "CIRCLE";
      center: PfcPoint;
      radius: number;
    };
```

A circle is first-class semantic geometry, not a decorative SVG circle around a square solver and not an arbitrary low-resolution polygon approximation used as answer authority.

Rendering may tessellate curved regions, but the semantic validator must preserve analytic boundary membership/contact rules.

## 6. Fold-state model

PFC continues to require explicit ordered folds:

```ts
type PfcFoldV2 = {
  foldId: string;
  line: { a: PfcPoint; b: PfcPoint };
  movingSide: "POSITIVE" | "NEGATIVE";
  order: number;
  kind: "VERTICAL" | "HORIZONTAL" | "DIAGONAL" | "CORNER" | "GENERAL_LINE";
};
```

Every learner diagram must show:

- state before the fold;
- dotted crease;
- unambiguous fold arrow;
- moving side where needed;
- resulting packet/silhouette;
- actual cut/punch only after the last fold.

## 7. Curved-boundary engine requirement

The existing polygon-only fragment engine is reusable for square and rectangle, but circular paper adds a mandatory engine extension.

The circle engine must support:

- signed classification against fold lines;
- clipping a disk/curved fragment by a half-plane;
- reflecting curved fragments across arbitrary lines;
- preserving arc endpoints and arc orientation;
- exact boundary-contact classification for cuts on the circumference;
- unfolded cut placement back on the original circle;
- mobile-safe SVG arc rendering.

Correctness may not depend on a coarse polygon approximation of the circle.

## 8. Forward PFC discovery matrix

Executable discovery must deliberately cover combinations rather than treating them as incidental random parameters.

### Source sheet

- square;
- rectangle landscape;
- rectangle portrait;
- circle.

### Fold family

- centred vertical;
- centred horizontal;
- off-centre axial;
- repeated same-axis;
- two perpendicular axes;
- diagonal;
- corner fold;
- axial then diagonal;
- diagonal then axial;
- three-fold sequences;
- circle half-fold and repeated sector-like fold sequences where source-supported.

### Cut family

- one circular hole;
- multiple circular holes;
- square/rectangular cut;
- diamond cut;
- triangle cut;
- V-notch;
- rounded notch;
- slit;
- mixed hole + polygon cut;
- mixed hole + edge notch;
- mixed asymmetric cuts.

### Contact family

- interior;
- outer boundary;
- fold edge/crease;
- corner/intersection of fold edges;
- curved circumference for circular paper.

The audit pool must prove every retained combination has reachable material, unique correct semantics and readable options.

## 9. Reverse-inference PFC solver

Reverse inference is not produced by simply swapping the stem and answer of a forward question.

Given an unfolded target pattern, the solver must:

1. enumerate only permitted fold sequences from the source-supported fold grammar;
2. enumerate candidate punch/cut positions and shapes on the resulting folded packet;
3. run the normal forward physical solver for each candidate;
4. compare the forward result with the target canonical fingerprint;
5. require the intended fold/punch candidate to be uniquely consistent among the answer options;
6. reject reverse questions with multiple physically valid answer choices.

Reverse distractors should represent real alternatives such as wrong fold axis, wrong fold order, wrong punch position or wrong number of folds.

## 10. TPF-001 transparent superposition engine

TPF works on pattern primitives rather than cuts.

```ts
type TpfPatternPrimitiveV1 =
  | { kind: "LINE"; a: Point; b: Point }
  | { kind: "POLYLINE"; points: Point[] }
  | { kind: "CIRCLE"; center: Point; radius: number }
  | { kind: "ARC"; ... }
  | { kind: "SYMBOL"; glyphId: string; transform: ... };
```

For each fold:

1. split primitives or primitive segments by the fold line when necessary;
2. retain stationary-side geometry;
3. reflect moving-side geometry across the fold line;
4. clip to the folded destination region;
5. superimpose coincident strokes deterministically;
6. canonicalise the final pattern independent of stroke order.

Vertical-fold behavior is mirror superposition; horizontal-fold behavior is water-image superposition. Diagonal behavior must be implemented only when source evidence supports it.

TPF must reuse the Spatial glyph/vector authority where possible rather than raster images.

## 11. QL governance

The historical branch allocation `SPA-QL-035..038` is not deleted, but V2 marks it as a superseded candidate allocation pending source-saturated merge/split review.

No Question Studio integration may consume those four QLs from the remediated runtime until the new discovery proves the final authority boundaries.

Potential PFC authority dimensions to test, not allocate yet:

- direct single/repeated axial unfolding;
- compound/mixed-axis unfolding;
- diagonal/corner/partial-overlap unfolding;
- multi-cut and boundary topology;
- curved/circular-sheet unfolding;
- reverse fold/punch inference.

Potential TPF authority dimensions to test, not allocate yet:

- single vertical transparent superposition;
- single horizontal transparent superposition;
- multi-fold transparent superposition if recurrent;
- glyph/shape-pattern complexity as a difficulty dimension, not automatically a QL.

QLs are based on materially different solve authority, not source sheet shape alone.

## 12. Source saturation rule

A source-saturated claim requires all of the following:

- uploaded books/reference material reviewed for mechanism and representation diversity;
- indexed PYQ recurrence established for retained exam targets;
- every observed high-value task mechanism mapped to an executable discovery candidate or explicitly held with a reason;
- every observed source sheet shape mapped to engine support or an explicit blocker;
- every observed cut family mapped to semantic geometry or an explicit blocker;
- forward/reverse solve direction classified;
- transparent-sheet tasks separated from opaque cut propagation;
- no high-value unexplained source pattern remains.

Generating hundreds of variants from a narrow grammar does not count as saturation.

## 13. Exam scope

### SSC

Direct recurrence is established across CGL/CHSL/CPO/MTS/GD-style indexed previous-year sources for opaque folding/cutting, including circular and rectangular paper, and for transparent-sheet folding.

### Banking

Do not claim direct SBI/IBPS PFC saturation until reliable named PYQ evidence is found. Preparation relevance alone is insufficient.

### Punjab state exams

Do not claim direct Punjab PFC saturation until reliable named PYQ evidence is found. Generic non-verbal reasoning syllabus coverage is not direct question evidence.

### Railway

Secondary preparation/PYQ indexes indicate paper folding/cutting relevance. Treat Railway as supplemental until the dedicated source ledger records named paper/date evidence.

## 14. Review/export standard

All learner review artifacts must use:

- white background;
- black/grey exam-standard line work;
- no decorative dark cards;
- no correctness-revealing colour;
- exact source-sheet shape, including rectangle/circle;
- actual fold direction and resulting packet;
- distinct cut geometry;
- identical-scale options;
- answer/explanation hidden or visually separated during learner-surface review.

Review packs must be stratified by mechanism and coverage mode, not merely random QL sampling.

## 15. Lifecycle after V2

```text
PFC V1 English/HI/PA freeze: HISTORICAL ONLY
PFC V5 30-mode candidate:    SUPERSEDED / NOT SOURCE-SATURATED
SPA-QL-035..038:             HISTORICAL CANDIDATE ALLOCATION
TPF-001 permanent QLs:       NONE
Question Studio:             BLOCKED
Question Bank:               NOT_STORED
test eligibility:            INELIGIBLE
public publication:          false
merge/deployment:            NOT AUTHORIZED
```

## 16. Next implementation gate

`PFC_TPF_SOURCE_SATURATED_EXECUTABLE_DISCOVERY_V1`

This gate must implement and prove, before any new freeze:

1. square + rectangle + analytic circle source boundaries for PFC;
2. shape-aware cut geometry including oriented polygon cuts;
3. forward opaque cut/unfold cases across the expanded source matrix;
4. reverse fold/punch inference with uniqueness checking;
5. separate TPF vector-pattern superposition discovery;
6. a new source-gap audit after executable coverage;
7. merge/split review of PFC authorities and first TPF authority proposal;
8. only then permanent allocation/refreeze review.
