# TRG-002 Rendered Solution-Diagram Review Guide

This checkpoint is a **visual QA layer**, not a new mathematical authority.

The canonical spatial state remains authoritative for coordinates and semantic quantities. The exact answer remains authoritative for the solved target. The SVG renderer consumes only the validated diagram spec plus already-resolved exact annotations.

## Review surface

- exact annotation authority: `solution-diagram-annotations.ts`
- annotation gate: `solution-diagram-annotations.test.ts`
- SVG renderer: `diagram-review-svg.ts`
- 13-strategy gallery generator: `runtime-proof-diagram-review.ts`
- gallery structural gate: `runtime-proof-diagram-review.test.ts`

The gallery deliberately uses **solution diagrams only**. It does not opt any proof QL into a stem diagram.

## Measurement-annotation policy

The renderer is not allowed to decide what a length means or calculate a display value from screen coordinates.

Every annotation plan explicitly provides:

- permanent QL identity;
- canonical endpoint pair;
- semantic source;
- role (`GIVEN`, `TARGET_SOLVED`, `MOVEMENT`, `EYE_HEIGHT`);
- placement;
- optional student-facing symbol.

Allowed current semantic sources are:

- exact answer;
- canonical object height;
- canonical horizontal distance;
- canonical movement distance;
- canonical eye height.

Solved target labels must use the **exact answer** source. They therefore remain explanation-stage content only.

QL-012 is intentionally different: its target is an angle, so the solved value remains on the canonical angle marker instead of being duplicated as a length annotation.

## Current representative strategy anchors

| Strategy | Permanent QL |
|---|---|
| SINGLE_ELEVATION | TRG-002-QL-001 |
| SINGLE_DEPRESSION | TRG-002-QL-015 |
| SHADOW | TRG-002-QL-025 |
| LADDER | TRG-002-QL-036 |
| GUY_WIRE | TRG-002-QL-045 |
| TWO_OBSERVATIONS_SAME_SIDE | TRG-002-QL-049 |
| OBSERVER_MOVES_CLOSER | TRG-002-QL-056 |
| OBSERVER_MOVES_FARTHER | TRG-002-QL-061 |
| OBSERVER_HEIGHT | TRG-002-QL-073 |
| OPPOSITE_SIDE_OBSERVATIONS | TRG-002-QL-078 |
| BUILDING_TO_BUILDING | TRG-002-QL-083 |
| ELEVATION_AND_DEPRESSION | TRG-002-QL-088 |
| RIVER_WIDTH | TRG-002-QL-092 |

The gate requires this set to equal the actual set of strategies represented by the active 20-QL proof. If proof coverage changes, the review gallery must change too.

## Canonical target integrity

`canonical-target-verifier.ts` now checks that the semantic `canonicalSpatialState.requested` quantity reconstructs the exact answer for every proof QL.

This systemic gate was added after self-review caught four target-state drifts:

- QL-036: ladder builder defaulted to sight-line/ladder length although the question asks how high the ladder reaches; current target is `OBJECT_HEIGHT(wall-1)`.
- QL-056: current target is tower-to-near/final horizontal distance.
- QL-065: current target is tower-to-far/original horizontal distance.
- QL-068: current target is near-to-far point separation.

The delivery wrapper now refuses to emit a solution diagram if requested-target verification fails.

## Manual review checklist

For every representative rendered card, inspect all of the following.

### 1. Geometry truth

- vertical objects appear vertical;
- ground/reference horizontals appear horizontal;
- sight lines connect the correct observer eye/ground point to the intended target;
- same-side and opposite-side point ordering is visually correct;
- movement direction matches the stem;
- ladder/wire/shadow segment is attached to the correct endpoints.

### 2. Angle placement

- elevation angle arc is at the observer/reference point, not at the object top;
- depression angle is measured from an eye-level horizontal;
- the arc opens toward the correct sight line;
- multi-observation diagrams show every required observation angle;
- angle text does not overlap the sight line or point label.

### 3. Measurement and label readability

- every displayed measurement belongs to the intended canonical segment;
- given values agree with the stem/canonical state;
- solved target labels agree with the exact answer;
- the 1.5 m observer eye-height annotation remains legible in QL-073;
- symbolic point labels are not clipped;
- point labels do not collide with measurement labels;
- labels do not hide angle markers;
- no `NaN`, `undefined`, `Infinity` or unresolved identifier appears.

### 4. Viewport / proportions

- every important endpoint lies comfortably inside the frame;
- long horizontal scenes do not flatten vertical geometry beyond usefulness;
- tall objects do not push angle/measurement text outside the frame;
- two-building/opposite-side diagrams retain enough whitespace to read both observations;
- eye-level references remain visible when eye height is small relative to the scene.

### 5. Pedagogical usefulness

- the figure makes the solution setup easier to follow;
- it does not introduce a second or contradictory geometry model;
- it does not imply that a stem diagram was supplied when it was not;
- solved target values appear only at solution stage;
- it is worth showing in the explanation rather than being decorative.

## Automatic structural checks targeted

`solution-diagram-annotations.test.ts` targets:

- explicit plans for all 20 proof QLs;
- at least one exact annotation per QL;
- unique annotation IDs and resolved endpoints;
- non-empty finite labels;
- all length-target QLs expose a `TARGET_SOLVED` label sourced from the exact answer;
- QL-012 keeps its angle target on the angle marker;
- QL-036 solved target sits on the wall vertical;
- QL-073 exposes the canonical 1.5 m eye height.

`runtime-proof-diagram-review.test.ts` targets:

- exactly 13 distinct representative strategies;
- representative strategy set equals active proof strategy set;
- active question, canonical-target, diagram-policy and annotation validation before rendering;
- SVG root/strategy metadata;
- all segments, angle markers and angle labels emitted;
- every planned solution annotation emitted with its exact label;
- no `NaN`, `undefined` or `Infinity` strings;
- no script content;
- exactly 13 gallery cards;
- explicit statement that stem diagrams are not automatically emitted and values are not inferred by the renderer.

These checks **do not replace human visual inspection** for overlap, aesthetics or pedagogical clarity.

## Deliberate current limitation

Not every numeric given is yet a first-class semantic field in every legacy proof state. Examples include the original line-of-sight input in QL-023 and ladder length in QL-036.

The solution diagram therefore labels only measurements that can be sourced exactly and semantically from current canonical/question authority. It does **not** reverse-engineer missing givens from floating-point screen geometry or parse them back out of stem text.

If production review decides those givens must also appear, the correct next step is to add first-class exact `givenMeasurements`/diagram-fact metadata to the QL state—not to teach the renderer to guess.

## Execution truth

The annotation, renderer, gallery and gates are committed as review tooling. A rendered visual PASS is **not claimed** until the TypeScript path is actually executed and the generated gallery is inspected.
