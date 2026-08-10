# SPA-FND-001 — Spatial Primitive Library V2

## Status

`IMPLEMENTED_AWAITING_EXACT_HEAD_PROOF`

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

Every primitive declares and proves:

- stable primitive ID and category;
- open/closed/composite/point topology;
- polygon side count where applicable;
- enclosed-region count;
- interior-intersection count;
- quarter-turn rotation period;
- vertical, horizontal and 180-degree symmetry;
- orientation and reflection sensitivity;
- safe inner-container capability;
- fill capability;
- intended usage roles and exam tags;
- a canonical language-neutral `SpatialScene`.

Declared symmetry and quarter-turn period are recomputed from canonical geometry by the existing spatial transform/equivalence engine. Canonical scene fingerprints must be unique across all 33 primitive IDs.

## Architectural boundary

This slice does **not** yet expand the FCL property authority or generate new permanent questions. It establishes reusable visual vocabulary for later FCL, FAN, FSR and other non-verbal chapters.

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

## Required proof status

`PASS_SPA_FND_001_PRIMITIVE_LIBRARY_V2`
