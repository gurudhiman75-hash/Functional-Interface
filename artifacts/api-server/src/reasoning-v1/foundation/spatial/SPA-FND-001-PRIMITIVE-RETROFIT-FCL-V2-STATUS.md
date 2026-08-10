# SPA-FND-001 — Primitive Retrofit + FCL V2 Expansion

## Status

`IMPLEMENTED_AWAITING_EXACT_HEAD_PROOF`

This slice consumes Spatial Primitive Library V2 from earlier spatial checkpoints and expands FCL-001 beyond the original four-shape vocabulary.

## Previous-checkpoint library enhancement

A reusable primitive-instance layer now scales, positions and quarter-turn-rotates canonical V2 primitives without introducing a new `SpatialNode` type.

Chapter pools:

```text
MIR/WAT eligible V2 primitives: 17
FAN eligible V2 primitives:     18
FCL eligible V2 primitives:     33
```

Additional controlled proof examples:

```text
MIR-001 primitive examples: 4
WAT-001 primitive examples: 4
FAN-001 primitive examples: 6
```

These are additive enhancement proofs. They do not replace or invalidate the previously approved MIR/WAT/FAN corpora.

Mirror/Water correct transforms are independently recomputed from the source primitive scene. FAN A→B and C→answer transforms are independently recomputed with the shared geometry engine. Every option set must contain four unique semantic scene fingerprints.

## FCL-001 V2 expansion

The original remediated eight FCL families remain intact. Twelve primitive-native families are added:

1. even-sided polygon;
2. vertical symmetry;
3. horizontal symmetry;
4. 180-degree symmetry;
5. 90-degree symmetry;
6. stroke junction present;
7. true crossing present;
8. partitioned figure;
9. line structure;
10. open figure;
11. closed shape;
12. polygon.

```text
Existing FCL families:          8
Primitive-native FCL families: 12
Total prototype families:      20
```

Correct slots for the new twelve are balanced A3/B3/C3/D3.

## Human ambiguity contract

Each FCL V2 quartet is audited across visible descriptors including category, topology, polygon presence, exact side count, side parity, enclosed regions, junctions, true crossings, quarter-turn period, vertical/horizontal/180-degree symmetry, orientation/reflection sensitivity, containment and fill capability.

A secondary 3-to-1 pattern is acceptable only when its minority is the **same intended odd option**. Any visible 3-to-1 descriptor that points to a different option rejects the quartet.

This explicitly distinguishes harmless reinforcing clues from a genuinely competing answer.

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

`PASS_SPA_FND_001_PRIMITIVE_RETROFIT_FCL_V2`
