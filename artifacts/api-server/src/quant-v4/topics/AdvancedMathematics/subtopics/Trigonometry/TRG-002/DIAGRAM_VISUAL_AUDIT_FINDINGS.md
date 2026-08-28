# TRG-002 Representative Solution-Diagram Visual Audit

Status: **13 represented strategies reviewed statically / renderer fixes implemented / executable rendered PASS not claimed**

## Scope

This review covers the 13 diagram strategies currently represented by the 20-QL proof. `BROKEN_TREE` is intentionally excluded because the broken-object family is not yet implemented in the proof and remains mandatory for the 48-QL MVP.

Reviewed anchors:

- SINGLE_ELEVATION — QL-001
- SINGLE_DEPRESSION — QL-015
- SHADOW — QL-025
- LADDER — QL-036
- GUY_WIRE — QL-045
- TWO_OBSERVATIONS_SAME_SIDE — QL-049
- OBSERVER_MOVES_CLOSER — QL-056
- OBSERVER_MOVES_FARTHER — QL-061
- OBSERVER_HEIGHT — QL-073
- OPPOSITE_SIDE_OBSERVATIONS — QL-078
- BUILDING_TO_BUILDING — QL-083
- ELEVATION_AND_DEPRESSION — QL-088
- RIVER_WIDTH — QL-092

## Findings

### 1. Movement direction was visually ambiguous — FIXED

The spatial state correctly contained `fromGroundPointId`, `toGroundPointId` and `direction`, but the diagram projection previously reduced movement to generic `AUXILIARY` geometry. The review renderer therefore had no semantic reason to draw a direction marker, making move-closer and move-farther scenes visually too similar.

Foundation remediation:

- `Trg002DiagramSegment.kind` now includes `MOVEMENT`.
- canonical movement projects to a `MOVEMENT` segment with the original `from -> to` endpoints.
- the Phase-5 movement gate locks far→near for closer and near→far for farther.
- the SVG review renderer draws a direction marker on `MOVEMENT` segments.

### 2. QL-078 full-separation label collided with tower base — FIXED

In the symmetric opposite-side 45° scene, the midpoint of the full observer-separation segment is exactly the tower base. The old `BELOW` measurement position therefore competed with the tower-base point label.

Renderer remediation:

- the semantic annotation remains bound to the full left-observer → right-observer separation;
- only the visual text position is deterministically nudged horizontally away from the central tower-base label;
- the mathematical source and canonical endpoints are unchanged.

### 3. QL-088 solved-height label crossed the eye-level reference — FIXED

The midpoint of the target tower height coincides with the observer's horizontal eye level in the current symmetric 45° construction. The old left-side placement put the solved-height text directly on that dashed reference.

Renderer remediation:

- the solved target remains sourced from the exact answer and bound to target-base → target-top;
- the visual text position is shifted to the outside of the target tower, clear of the eye-level segment.

## Other reviewed strategies

No additional blocking geometry defect was found in the representative static review of:

- single elevation;
- single depression;
- shadow;
- ladder;
- guy wire;
- same-side two-observation ordering;
- observer-height geometry;
- building-to-building sight line;
- river-width geometry.

A known non-blocking rendering characteristic remains: ladder/wire/shadow scenes can contain two semantic segments on the same endpoints (e.g. sight line + ladder). This can produce a double stroke in the review renderer. It does not change geometry or mathematical meaning and is deferred to renderer polish rather than blocking the 48-QL content expansion.

## Execution truth

This is a static/code-driven visual audit of the active canonical specifications and renderer. It is **not** a claim that the TypeScript gallery was executed in this environment.

Still not claimed:

- strict TypeScript compile;
- runtime gate execution;
- GitHub Actions pass;
- browser-rendered 13-card gallery PASS.

The execution container could not resolve `github.com`, so a repository clone/runtime execution was not available here.

## Expansion decision

The two blocking visual semantics defects and the one label-layout defect found by this review are now remediated. The 20-QL proof is therefore suitable as the **architecture/input basis for controlled 48-QL MVP expansion**, while execution evidence, browser-rendered inspection and human review remain mandatory before freeze or activation.
