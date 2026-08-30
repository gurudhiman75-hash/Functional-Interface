# Geometry Diagram Quality Remediation V1 — Status

**Authority:** Composite Geometry Revision 3  
**Scope:** shared Geometry SVG renderer + Source Gap Remediation Wave 1  
**Lifecycle:** `DISCOVERY`  
**Permanent QLs:** `0`  
**Frozen solve modes:** `0`  
**Question Studio / Question Bank / test / public:** locked

## Why this remediation exists

Visual review of the first Wave-1 HTML exposed a renderer-quality gap that semantic fingerprints alone could not catch:

- some construction lines ended too early and looked like short connectors rather than true bisectors/tangents;
- visually stated intersections/contact points were not always geometrically faithful to the drawn circle/line topology;
- point labels used one fixed offset and could crowd lines, marks or nearby labels;
- angle labels used one fixed radial position;
- angle arcs existed, but there was no renderer-level QA proving that required target/given angle signs were present and readable.

The prior diagrams remain valid discovery evidence, but the first HTML is superseded for visual review by the V2 renderer export.

## Shared renderer V2

`EXAMTREE_GEOMETRY_SVG_V2` adds:

- explicit segment extent: `SEGMENT | RAY | LINE`;
- explicit `PRIMARY | CONSTRUCTION` visual role;
- optional construction extension length;
- collision-aware point-label placement across eight candidate directions;
- collision-aware angle-label placement across multiple radii/offsets;
- renderer instrumentation with label bounding boxes and collision scores;
- explicit `data-angle-sign="true"` on every angle arc;
- wider viewBox accounting for extended rays/lines;
- consistent 12px system-font text and centered label anchoring.

Visual-only label placement fields do not alter theorem semantics.

## Wave-1 diagram corrections

### Circumcentre identification

- A, B, C, M and N are now placed so M and N are true visual midpoints.
- The two displayed perpendicular bisectors are true visual perpendiculars.
- Their construction rays visibly pass through and intersect at O.
- The circumcircle is still not drawn, so the answer is not explicitly disclosed.
- midpoint and right-angle marks remain visible because they are supplied facts.

### Angle in a semicircle

- A and B are true opposite endpoints of the drawn diameter.
- P now lies exactly on the drawn circle.
- PA and PB meet exactly at P.
- the target angle has a visible arc and `x` label.
- no `90°` value or right-angle square is semantically disclosed in the stem.

### Angle between two tangents

- A and B lie exactly on the circle.
- PA and PB now touch the circle at A and B with visual radius–tangent perpendicularity.
- `124°` and target `x` each have a visible angle arc.
- no derived right-angle squares or equal-tangent marks are added.

### Tangent–chord

- T, A and B lie exactly on the same circle.
- PT is drawn as a ray beginning at the contact point T.
- PT is visually tangent to the circle at T.
- the supplied `38°` and target `x` each have a visible angle arc.
- point/angle labels are collision-positioned rather than fixed-offset.

## Anti-leak refinement

The visual-review rule is refined:

> semantic incidences explicitly stated in the stem (on-circle, intersection, tangency, collinearity, perpendicular-bisector construction) should be visually faithful. Anti-leak protection forbids adding **unstated semantic answer marks/values**; it does not require intentionally breaking stated topology merely to stop pixel measurement.

`notToScale = true` remains mandatory for Geometry V1 learner diagrams.

## New QA

The Wave-1 proof now rejects:

- visually disconnected on-circle points;
- false tangent contact;
- false displayed perpendicular construction;
- short construction segments where a ray is required;
- missing angle arcs/labels for supplied or target angles;
- text-label collisions with other labels or core geometry;
- any loss of lifecycle locks.

The renderer outputs instrumented label boxes and collision scores so text-placement QA is deterministic rather than manual-only.

## Gate result

```text
diagramRendererV2                = implemented
wave1ExactVisualTopology         = required
wave1AngleSignCoverage           = required
wave1LabelCollisionQA            = required
sourceSaturationClaimAllowed     = false
permanentQlAllocationAllowed     = false
solveModeFreezeAllowed           = false
questionStudioActivationAllowed  = false
questionBankWriteAllowed         = false
testEligibilityAllowed           = false
publicPublicationAllowed         = false
```
