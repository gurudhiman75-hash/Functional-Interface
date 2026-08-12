# TRG-002 Rendered Solution-Diagram Review Guide

This checkpoint is a **visual QA layer**, not a new mathematical authority.

The canonical spatial state remains authoritative for coordinates, answer reconstruction and diagram projection. The review renderer consumes the validated `Trg002DiagramSpec` only.

## Review surface

- SVG renderer: `diagram-review-svg.ts`
- 13-strategy gallery generator: `runtime-proof-diagram-review.ts`
- structural gate: `runtime-proof-diagram-review.test.ts`

The gallery deliberately uses **solution diagrams only**. It does not opt any proof QL into a stem diagram.

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

### 3. Label readability

- symbolic point labels are not clipped;
- point labels do not collide with one another;
- point labels do not hide angle markers;
- strategy caption is unobtrusive and review-only;
- no `NaN`, `undefined`, `Infinity` or unresolved identifier appears.

### 4. Viewport / proportions

- every important endpoint lies comfortably inside the frame;
- long horizontal scenes do not flatten vertical geometry beyond usefulness;
- tall objects do not push angle text outside the frame;
- two-building/opposite-side diagrams retain enough whitespace to read both observations;
- eye-level references remain visible when eye height is small relative to the scene.

### 5. Pedagogical usefulness

- the figure makes the solution setup easier to follow;
- it does not introduce a second or contradictory geometry model;
- it does not imply that a stem diagram was supplied when it was not;
- it does not reveal an answer during the question stage;
- it is worth showing in the explanation rather than being decorative.

## Automatic structural checks already targeted

`runtime-proof-diagram-review.test.ts` checks:

- exactly 13 distinct representative strategies for the current proof;
- representative strategy set equals active proof strategy set;
- active question validation and diagram-policy validation before rendering;
- SVG root/strategy metadata;
- all diagram segments are emitted;
- all angle markers and angle labels are emitted;
- no `NaN`, `undefined` or `Infinity` strings;
- no script content;
- exactly 13 gallery cards;
- gallery explicitly states that stem diagrams are not automatically emitted.

These checks **do not replace human visual inspection** for overlap, aesthetics or pedagogical clarity.

## Important limitation discovered at this checkpoint

The current canonical `Trg002DiagramSpec` carries:

- points;
- structural segments;
- angle markers;
- symbolic point labels.

It does **not yet carry a first-class dimension/measurement annotation model** for labeling given lengths, movement distances, eye heights or final computed target values on the solution figure.

That is acceptable for the current structural review, but it may be too weak for production-quality pedagogical solution diagrams. The visual review must decide whether to add a controlled solution-annotation layer before the 48-QL MVP.

Any such annotation layer must be driven by question/canonical-state data and disclosure policy; it must not be inferred independently by the SVG renderer.

## Execution truth

The renderer/gallery/gate are committed as review tooling. A rendered visual PASS is **not claimed** until the TypeScript path is actually executed and the generated gallery is inspected.
