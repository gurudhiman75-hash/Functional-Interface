# TRG-002 48-QL MVP AI Editorial Status

Status: **48-QL AI/EDITORIAL REMEDIATION PASS — TRG-002 WORKFLOW PASS — REPRESENTATIVE RUNTIME VISUAL PASS — APP/UI + HUMAN REVIEW PENDING**

## Scope and boundary

`TRG-002 — Heights & Distances Applications` has 48 permanent English MVP QLs, 12 per CP. The active delivery surface is `mvp-final-editorial-runtime.ts`.

- AI/editorial remediation: complete for the current 48-QL candidate.
- human reviewed: **0 / 48**.
- production freeze eligible: **NO**.
- Question Studio/Test Builder/storage/public/localization activation: **OFF**.

The self-review deliberately reopened the earlier editorial PASS and found real weaknesses. Those findings were remediated and regression-locked before restoring the current AI/editorial PASS status. A subsequent review of the actual generated 48-question artifact found additional presentation-only defects; those have also been corrected without changing canonical answers or spatial state.

## Self-review remediation

Student-facing/editorial fixes include:

- QL-007: friendlier exact-value presentation instead of generator-like `√3/3` wording;
- QL-024: natural grammar plus a genuine trig-based third distractor;
- QL-043: fallen part explicitly makes 45° with the ground, with stronger misconception provenance;
- QL-049: 30° is explicitly assigned to the farther point and 60° to the nearer point;
- QL-067: diversified to a 45°/30° exact system and explicitly collinear geometry; its subtraction distractor now uses conventional positive-first surd notation;
- QL-069: diversified to a 45°/60° moving-observer exact system;
- QL-071: observation point and both tower feet are explicitly stated collinear and same-side;
- QL-073: half-metre final answers/options are displayed as natural decimals rather than `/2` fractions;
- QL-076: half-metre building heights and distractors are displayed naturally as decimals such as 13.5 m;
- QL-081: Hard explanation derives `x=3y`, solves the unequal opposite-side system, and no longer repeats the same exact value in the final equality;
- QL-083: horizontal distance between the feet of the two buildings is stated explicitly from canonical state;
- QL-092: arbitrary multiple distractors replaced by genuine trig misconceptions;
- QL-095: composite mast answer is displayed conventionally as `k(√3−1)` instead of a negative-first linear surd;
- QL-096: Hard explanation explicitly shows rationalisation of `1/(√3-1)`.

Difficulty is currently locked as Medium for QL-052/055/058/061/064/095 and Hard for QL-096.

## Diagram teaching-aid standard

The shared TRG-002 diagram contract now provides:

- visible angle arcs between the horizontal reference ray and sight line;
- degree labels associated with those arcs rather than floating at the corner;
- first-class right-angle markers at relevant ground/vertical intersections;
- separate `arcLane` values for distinct angles sharing one vertex, so composite 45°/60° figures use nested non-overlapping arcs;
- exact semantic side/height/movement labels from canonical state;
- solution diagrams REQUIRED, stem diagrams OPTIONAL/not automatic, disclosure AFTER_ATTEMPT.

Representative final-artifact inspection confirmed ordinary elevation, ladder, broken-object, opposite-side and composite figures. QL-095/096 specifically show separate nested 45° and 60° arcs and a clear base right-angle marker.

This is **representative runtime visual evidence**, not a per-seed or real-app/browser approval. Generated questions therefore emit:

- `runtimeSpecVisualInspection: NOT_ASSERTED_PER_INSTANCE`;
- `representativeRuntimeVisualEvidence: EXTERNAL_REVIEW_ARTIFACT`;
- `representativeVisualReviewScope: ONE_DESIGNATED_REVIEW_INSTANCE_PER_QL`;
- `appUiRenderedInspection: PENDING`;
- `humanReviewSubstituted: false`.

## Actual execution evidence

Workflow: `.github/workflows/trg-002-mvp48-verification.yml`.

Latest observed successful post-audit remediation run:

- run: **31820489042**
- head: `0a0b0fbe72bd053252d7dd05c33721a9aab522d2`
- artifact id: **9226750393**
- conclusion: **success**

Passed:

- targeted TypeScript compile;
- 576 canonical cases;
- 2,400 sweep cases;
- exact solution-label gate;
- difficulty regression gate;
- all 14 locked diagram-strategy representatives;
- high-risk projection gate;
- expanded 576-case final-editorial regression gate including student-facing presentation locks;
- actual-runtime 48-QL HTML/JSON export;
- artifact verification and upload.

Artifact: `trg-002-mvp48-runtime-review`.

## Remaining gate

Before production freeze or 48→96 expansion under the current plan:

1. inspect the solution presentation in the real ExamTree/browser UI wrapper;
2. complete human review of the 48 questions;
3. explicitly approve the next expansion.
