# PFC-001 — Paper Folding and Cutting — End-to-End Design V1

## 1. Chapter identity

- Family: `SPA-001`
- Chapter: `PFC-001`
- Name: Paper Folding and Cutting
- Priority: P1
- Stage: FOUNDATION / DISCOVERY
- Parent authority: `SPA_001_SPATIAL_FAMILY_MASTER_BLUEPRINT.md`
- Frozen Spatial allocation before this chapter: `SPA-QL-001..034`
- Next available permanent coordinate: `SPA-QL-035`
- Permanent PFC QLs: **not allocated until discovery proves natural reasoning authorities**

PFC-001 must be generated from a deterministic semantic fold model. Stored or hand-picked pictures are not answer authority. The generator must replay every fold, determine the active folded polygon and real layer coverage, apply a hole/cut only to reachable layers, reverse folds in exact reverse order, and derive the unfolded result independently of option position.

## 2. Learner task families

### 2.1 Core progression

1. Single vertical fold + interior hole.
2. Single horizontal fold + interior hole.
3. Single fold + boundary/edge cut.
4. Two perpendicular axial folds.
5. Two same-direction/parallel folds.
6. Repeated half-folds producing 4/8-layer symmetry.
7. Corner fold.
8. Single diagonal fold.
9. Diagonal + axial fold.
10. Axial + diagonal fold where order matters.
11. Multiple holes in one folded state.
12. Multiple cuts in one folded state.
13. Mixed hole + edge cut.
14. Cut touching a fold line.
15. Cut touching an outer boundary.
16. Three-fold advanced unfolding.
17. Unequal/off-centre fold where source evidence supports it.
18. Reverse task only if exam-source evidence justifies a separate permanent authority.

### 2.2 Representation families

Discovery must exercise these separately from QL allocation:

- square/rectangular sheet;
- explicit fold-arrow diagrams;
- crease/fold-line diagrams;
- triangular folded silhouette;
- quadrilateral folded silhouette;
- point/circular hole;
- V/notch cut;
- straight edge cut;
- triangular/polygon cut;
- short slit only if mobile-readable;
- multiple cut marks;
- folded-side shading only when necessary for disambiguation.

Representation families are not permanent QLs by themselves.

## 3. Semantic source of truth

SVG is presentation only.

```ts
type PfcPoint = { x: number; y: number };

type PfcPolygon = {
  id: string;
  vertices: PfcPoint[];
};

type PfcSheet = {
  sheetId: string;
  boundary: PfcPolygon;
};
```

Initial production should use a square sheet unless a question authority requires another aspect ratio.

### 3.1 Fold

```ts
type PfcFold = {
  foldId: string;
  line: { a: PfcPoint; b: PfcPoint };
  foldedSide: "NEGATIVE" | "POSITIVE";
  order: number;
  kind: "VERTICAL" | "HORIZONTAL" | "DIAGONAL" | "CORNER" | "GENERAL_LINE";
};
```

The folded side is explicit. “Fold along this line” is insufficient as semantic authority unless the scene uniquely communicates direction and the semantic state stores the actual moving side.

### 3.2 Layer state

```ts
type PfcLayerFragment = {
  fragmentId: string;
  sourceSheetRegionId: string;
  polygon: PfcPolygon;
  transformHistory: PfcReflectionTransform[];
  layerOrdinal: number;
};

type PfcFoldState = {
  activeBoundary: PfcPolygon;
  fragments: PfcLayerFragment[];
  completedFolds: PfcFold[];
};
```

Layer count is derived from actual overlap, never assumed as `2^foldCount`; partial, corner and off-centre folds can invalidate that shortcut.

### 3.3 Cuts and holes

```ts
type PfcCut =
  | { cutId: string; kind: "POINT_HOLE"; center: PfcPoint; radius: number }
  | { cutId: string; kind: "EDGE_NOTCH"; polygon: PfcPolygon }
  | { cutId: string; kind: "POLYGON_CUT"; polygon: PfcPolygon }
  | { cutId: string; kind: "SLIT"; a: PfcPoint; b: PfcPoint; width: number };
```

A cut applies only to fragments geometrically covering the cut region in the final folded state. A cut partially outside folded material is either an intentional boundary notch or invalid according to the QL contract.

## 4. Fold engine

### 4.1 Required geometry operations

- signed-side classification against an infinite fold line;
- polygon split by line;
- point reflection across arbitrary line;
- polygon reflection across arbitrary line;
- polygon clipping/intersection;
- overlap and coverage test;
- canonical point snapping within strict epsilon;
- polygon orientation/canonicalisation;
- removal of zero-area/sliver fragments;
- deterministic stable ordering of fragments.

### 4.2 Forward fold algorithm

For each fold in order:

1. Validate the fold line against active material.
2. Split active fragments by the fold line.
3. Identify stationary and moving portions from `foldedSide`.
4. Reflect moving portions across the fold line.
5. Preserve source provenance and append reflection history.
6. Preserve coincident layer provenance even when presentation boundaries coincide.
7. Compute new visible active boundary.
8. Reject impossible self-crossing or zero-area active states.
9. Record the folded-footprint coverage/layer map.

### 4.3 Cut application

1. Check that cut geometry intersects folded material as intended.
2. Determine every covering layer fragment.
3. Require at least one reachable layer.
4. Apply the cut only to those layers.
5. Record `affectedFragmentIds` as solver evidence.
6. Reject accidental tangent-only hits below readability limits.

### 4.4 Unfold algorithm

Reverse folds in exact reverse chronological order.

For each fold being undone:

1. Take cut imprints associated with fragment provenance.
2. Apply the inverse reflection for provenance traversing that fold.
3. Preserve the original imprint plus its mirrored counterpart where physical layers were cut.
4. Reconstruct boundary notches through polygon subtraction, not point duplication.
5. Canonicalise equivalent imprints.
6. Continue until all imprints are in original sheet coordinates.

The final answer authority is the canonical set of holes/interior cuts/boundary notches on the original sheet.

## 5. Canonical answer representation

```ts
type PfcUnfoldedResult = {
  sheetBoundary: PfcPolygon;
  holeImprints: Array<{
    sourceCutId: string;
    center: PfcPoint;
    radius: number;
  }>;
  boundaryCuts: Array<{
    sourceCutId: string;
    polygon: PfcPolygon;
  }>;
  interiorCuts: Array<{
    sourceCutId: string;
    polygon: PfcPolygon;
  }>;
};
```

Fingerprints quantise geometry using foundation tolerance and sort by semantic cut ID + position + shape. Correctness is semantic `EXACT` in original sheet coordinates unless a later task explicitly declares another policy.

## 6. Independent solver evidence

Every question stores:

- original sheet boundary;
- ordered fold list;
- folded side for each fold;
- active polygon after each fold;
- layer-fragment count after each fold;
- cut geometry;
- affected layer fragment IDs;
- inverse reflection sequence;
- final unfolded cut coordinates;
- final symmetry axes actually produced;
- correct-option semantic fingerprint.

Option index is never solver input.

## 7. Candidate reasoning authorities for discovery

Do **not** allocate these as permanent QLs yet.

### A — Single-axis unfolding
- one axial fold;
- one hole/simple boundary cut;
- one reflection pair.

### B — Orthogonal repeated unfolding
- two or more axial folds;
- Cartesian replication;
- layer count/position reasoning.

### C — Same-direction / nested parallel folds
- parallel folds;
- repeated half-folds or unequal spacing;
- order/spacing-sensitive replication.

### D — Diagonal/corner unfolding
- diagonal or corner fold;
- non-axis-aligned reflection.

### E — Mixed-axis compound unfolding
- diagonal + horizontal/vertical or reverse order;
- fold order matters.

### F — Multi-cut / boundary-contact state
- more than one cut/hole;
- edge/fold-line contact;
- notch topology.

### G — Three-fold advanced state
- three valid folds;
- higher position/layer burden;
- must remain mobile-readable.

Permanent QLs must be based on reasoning authority and solve mode, not cut shape.

## 8. Distractor taxonomy

- `PFC-D01-MISSED-LAST-UNFOLD`
- `PFC-D02-WRONG-FOLD-ORDER`
- `PFC-D03-WRONG-AXIS`
- `PFC-D04-ROTATE-NOT-REFLECT`
- `PFC-D05-MISSING-LAYER`
- `PFC-D06-EXTRA-LAYER`
- `PFC-D07-WRONG-SIDE`
- `PFC-D08-DIAGONAL-SIGN`
- `PFC-D09-EDGE-NOTCH-AS-HOLE`
- `PFC-D10-HOLE-AS-NOTCH`
- `PFC-D11-COUNT-CORRECT-POSITION-WRONG`
- `PFC-D12-SYMMETRY-OVERGENERALISATION`
- `PFC-D13-PARALLEL-FOLD-SPACING`
- `PFC-D14-CUT-TO-ALL-THEORETICAL-LAYERS`

Malformed geometry, clipped strokes, tiny distinctions, or decorative differences are never distractors.

## 9. Difficulty model

### L1 Direct
- one fold;
- one hole/simple cut;
- centred axial/simple diagonal fold.

### L2 Standard exam
- two folds or one fold with boundary cut;
- up to four principal imprints;
- close misconception distractors.

### L3 Advanced
- mixed fold directions/order;
- diagonal/corner involvement;
- multiple cuts or edge contact;
- typically 4–8 meaningful imprints.

### L4 High discrimination
- three folds and/or partial/corner/off-centre folds;
- actual layer coverage differs from naive `2^n`;
- multi-cut topology;
- only when mobile-readable and source-supported.

Difficulty is based on reasoning burden, not fold count alone.

## 10. Option generation

1. Solve canonical result.
2. Generate misconception results by mutating solver operations, never arbitrary SVG.
3. Canonicalise every option.
4. Reject distractor = answer.
5. Reject duplicate distractors.
6. Render options under identical bounds/stroke policy.
7. Run perceptual/minimum-feature checks at mobile size.
8. Deterministically permute A/B/C/D.
9. Recheck semantic uniqueness after permutation.

## 11. Validation contract

PFC validation must prove:

- fold line valid against active polygon;
- folded side explicit;
- reflected moving polygon matches transform;
- layer provenance retained;
- cuts apply only to reachable layers;
- folds reverse in exact reverse order;
- boundary notches preserved as topology;
- unfolded imprints canonical and unique;
- exactly one option equals solver output;
- distractors do not collide;
- cut/hole spacing is mobile-readable;
- no accidental clipping/tangency;
- explanation evidence matches solver evidence;
- deterministic replay is stable.

### PFC rejection codes

- `PFC_INVALID_FOLD_LINE`
- `PFC_AMBIGUOUS_FOLDED_SIDE`
- `PFC_DEGENERATE_ACTIVE_POLYGON`
- `PFC_INVALID_LAYER_PROVENANCE`
- `PFC_CUT_MISSES_FOLDED_MATERIAL`
- `PFC_CUT_TANGENCY_UNREADABLE`
- `PFC_INVALID_EDGE_CUT_TOPOLOGY`
- `PFC_UNFOLD_ORDER_MISMATCH`
- `PFC_LAYER_COVERAGE_MISMATCH`
- `PFC_DUPLICATE_UNFOLDED_IMPRINT`
- `PFC_OPTION_SEMANTIC_COLLISION`
- `PFC_OPTION_UNREADABLE_MOBILE`
- `PFC_EXPLANATION_EVIDENCE_MISMATCH`

Each requires a fixed regression fixture before freeze.

## 12. Rendering and mobile rules

- Stable page orientation across stages.
- Dashed fold line distinct from cut marks.
- Fold arrow must not occlude geometry.
- Cut/hole remains visible at review floor.
- Correctness must not depend on colour.
- Options show original unfolded sheet at identical scale.
- No perspective effect unless explicitly validated.
- No decorative shadows that become clues.
- Every stage fits Question Studio and student mobile cards without zoom.

## 13. Explanation standard

Explanations must be human, question-specific and not formula-heavy.

Preferred flow:

1. **What happened:** actual fold sequence and cut location.
2. **Open the last fold:** state where the first mirror copy appears.
3. **Continue unfolding:** repeat for remaining creases.
4. **Check the final sheet:** state final count/positions/notches and matching option.

Example:

> The paper was first folded to the left and then upward. The hole was punched in the folded corner. When the last fold is opened, the hole appears at the same distance on the other side of that horizontal crease. Opening the first fold mirrors both holes across the vertical crease, so four holes appear in the four corresponding positions. Therefore the option showing those four positions is correct.

Do not expose internal fragment IDs or matrix terminology to learners.

## 14. English/Hindi/Punjabi localization

Geometry is language-neutral. Only instructions/explanations localise.

English concepts:
- fold / crease;
- fold left/right/up/down;
- diagonal fold;
- corner;
- punch/hole;
- cut/notch;
- unfold/open paper;
- same distance from fold line.

Hindi should prefer simple wording such as `कागज़ मोड़ा गया`, `छेद`, `कट`, `मोड़ की रेखा`, `कागज़ खोलें`.

Punjabi should prefer simple wording such as `ਕਾਗਜ਼ ਮੋੜਿਆ ਗਿਆ`, `ਛੇਦ`, `ਕੱਟ`, `ਮੋੜ ਦੀ ਲਾਈਨ`, `ਕਾਗਜ਼ ਖੋਲ੍ਹੋ`.

Localization must not change geometry, fold order, option order, answer, IDs or fingerprints.

## 15. Delivery checkpoints

### PFC-CP0 — design/foundation
- freeze semantic types;
- fold/reflection geometry;
- polygon split/provenance;
- cut model;
- inverse-unfold solver;
- validators/rejection fixtures.

### PFC-CP1 — executable discovery
- implement all core representation families;
- target at least 800 deterministic discovery questions;
- independent solver for every candidate;
- mobile review export;
- source/taxonomy gap audit;
- determine natural permanent QL boundaries.

### PFC-CP2 — permanent allocation + English runtime
- allocate from `SPA-QL-035` only after CP1;
- target 80 unique semantic questions per permanent QL unless evidence justifies otherwise;
- exact answer-position balance per QL;
- chapter-wide semantic deduplication;
- retained learner-review pack.

### PFC-CP3 — Hindi/Punjabi + Question Studio
- simple HI/PA localization;
- semantic parity proof;
- learner review;
- product-owner approval;
- standard Spatial Question Studio integration;
- no chapter-specific downstream store;
- manual generated-item approval retained;
- no automatic student publication.

## 16. Source/exam-readiness audit

Before permanent allocation, classify evidence at minimum for SSC, Banking, Punjab state exams and Railway if retained by the family target.

Record:
- observed wording;
- fold count;
- fold orientation/order;
- cut/hole type;
- whether intermediate fold diagrams are shown;
- option representation;
- difficulty;
- uncovered representation gaps.

Do not claim saturation because the engine can generate many variants.

## 17. Non-interference

- No changes to `SPA-QL-001..034` authorities/content.
- PFC remains isolated under Spatial.
- Existing P0/FGC regressions stay green.
- No text chapter imports PFC.
- SVG is never answer authority.
- No PFC Question Bank write before standard Question Studio integration.
- No automatic publication.

## 18. Completion definition

PFC-001 is complete only when:

1. fold/cut engine is deterministic and independently solvable;
2. discovery covers approved taxonomy;
3. source-gap audit has no high-value blocker;
4. permanent QLs are allocated from `SPA-QL-035` onward;
5. English runtime is unique, balanced, reviewed and frozen;
6. Hindi/Punjabi are simple, parity-checked, reviewed and frozen;
7. Question Studio integration is green;
8. learner-facing product-owner review is approved;
9. existing Spatial chapters remain unchanged;
10. generated items still require normal manual approval.

## 19. Immediate implementation target

Implement `PFC-CP0` only before bulk discovery.

The first proof must demonstrate:

- one axial fold + point hole;
- two perpendicular folds + point hole;
- one diagonal fold + point hole;
- axial + diagonal fold order;
- one boundary notch;
- one multi-cut example;
- exact inverse-unfold coordinates;
- actual affected-layer coverage;
- deterministic replay;
- answer derived without option index.
