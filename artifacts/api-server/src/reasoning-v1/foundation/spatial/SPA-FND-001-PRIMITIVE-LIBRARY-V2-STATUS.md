# SPA-FND-001 — Spatial Primitive Library V2

## Status

`PRIMITIVE_LIBRARY_V2_IMPLEMENTATION_PROOF_PASSED`

This foundation slice expands the spatial visual vocabulary before FSR-001 and before production-scale FCL synthesis.

## Scope

```text
Canonical primitives: 33
Closed shapes:         9
Open figures:          7
Line structures:       7
Partitioned figures:   5
Internal symbols:      5
```

The authority contains exam-usable closed shapes, open directional figures, line/spoke structures, partitioned figures and reusable internal symbols.

## Semantic contract

Every primitive provides machine-readable semantics for:

- stable primitive ID and category;
- open/closed/composite/point topology;
- polygon side count where applicable;
- enclosed-region count;
- branch-junction count;
- true-crossing count, separately from T/Y/arrow junctions;
- free-terminal count on open stroke paths;
- quarter-turn rotation period;
- vertical, horizontal and 180-degree symmetry;
- orientation sensitivity;
- standard-axis (vertical/horizontal) reflection sensitivity;
- safe inner-container capability;
- fill capability;
- intended usage roles and exam tags;
- a canonical language-neutral `SpatialScene`.

The old `interiorIntersectionCount` member is retained only as a V2 compatibility field and is validated against branch-junction count. Production reasoning must use the explicit connectivity authority so a T/Y/arrow branch junction, a true crossing and a two-arm polyline bend cannot be conflated.

In the descendant retrofit proof, a continuous V/chevron bend has zero branch junctions and two free terminals; arrow/T/Y figures have one branch junction and three free terminals. This refinement changes semantic authority only and does not alter the 33 reviewed canonical geometries.

Declared symmetry and quarter-turn period are recomputed from canonical geometry by the existing spatial transform/equivalence engine. Canonical scene fingerprints must be unique across all 33 primitive IDs.

## Primitive inventory

Closed shapes:

`CIRCLE`, `TRIANGLE`, `SQUARE`, `RECTANGLE`, `DIAMOND`, `PENTAGON`, `HEXAGON`, `TRAPEZIUM`, `SEMICIRCLE`.

Open figures:

`L_SHAPE`, `T_SHAPE`, `V_SHAPE`, `U_SHAPE`, `Z_SHAPE`, `CHEVRON_RIGHT`, `ZIGZAG`.

Line structures:

`PLUS`, `X_CROSS`, `PARALLEL_PAIR`, `TRIPLE_PARALLEL`, `THREE_SPOKE`, `SIX_SPOKE`, `ARROW_RIGHT`.

Partitioned figures:

`SQUARE_DIAGONAL_DIVIDED`, `SQUARE_CROSS_DIVIDED`, `CIRCLE_DIAMETER`, `CIRCLE_CROSS_DIVIDED`, `TRIANGLE_MEDIAN_DIVIDED`.

Internal symbols:

`DOT`, `RING`, `TICK_DIAGONAL`, `SMALL_CROSS`, `FOUR_POINT_STAR`.

## Validated implementation proof

```text
Head:        9fbb72d45bb1b3af390d8bbe15cde60a26916a77
Workflow:    Validate SPA-FND-001 Primitive Library V2
Run:         31373245829 — PASS
Artifact:    spa-fnd-001-primitive-library-v2-review
Artifact ID: 9056910653
Digest:      sha256:6efe41f78f3f209de9693d2a68faf731d39ade052eff29af9ae96c51325d9551
Status:      PASS_SPA_FND_001_PRIMITIVE_LIBRARY_V2
```

Passed regression layers:

```text
PASS_SPA_FND_001_FOUNDATION_RUNTIME
PASS_SPA_FND_001_MIRROR_WATER_PROOF
PASS_SPA_FND_001_WAVE_03_PERCEPTUAL_REMEDIATION
PASS_SPA_FND_001_FAN_001_VISUAL_REMEDIATION
PASS_SPA_FND_001_FCL_001_AMBIGUITY_PRESENTATION_REMEDIATION
PASS_SPA_FND_001_PRIMITIVE_LIBRARY_V2
```

## Manual visual review

All 33 canonical primitives were inspected as rendered figures by category and again at approximately 100-pixel mobile scale.

Confirmed:

- closed shapes remain distinct and recognizable;
- open figures retain their intended orientation cues;
- line/spoke structures remain legible at mobile scale;
- partition lines terminate cleanly at their containing boundaries;
- dot, ring, tick, cross and star symbols remain usable as small internal marks;
- square/diamond and full-size/internal-symbol pairs remain intentionally distinguishable by geometry/usage role;
- no primitive requires a new renderer node kind;
- the descendant connectivity refinement changes semantics only, not canonical geometry.

## Descendant chapter consumption

`SPA-FND-001-PRIMITIVE-RETROFIT-FCL-V2-STATUS.md` proves that the same authority is consumable by earlier chapters through reusable primitive instantiation:

```text
MIR/WAT V2 pool: 17
FAN V2 pool:     18
FCL V2 pool:     33
```

It also extends FCL to 20 controlled prototype families while preserving all earlier regression proofs.

## Architectural boundary

Existing `SpatialNode` kinds remain unchanged: line, circle, polygon, polyline and arc are sufficient to compose V2. This avoids a rendering-schema migration.

## Lifecycle lock

```text
Permanent QLs:                0
Question Studio discovery:    false
Question Bank writes:         false
Mock-test eligibility:        false
Public publication:           false
API/database schema changes:  none
```

The historical Primitive Library V2 proof remains valid; the descendant retrofit branch reruns it with the additional terminal semantics. Merge, Question Studio activation, production synthesis and release remain unauthorized.
