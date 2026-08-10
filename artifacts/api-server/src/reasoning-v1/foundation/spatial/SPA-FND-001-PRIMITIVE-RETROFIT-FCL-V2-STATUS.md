# SPA-FND-001 — Primitive Retrofit + FCL V2 Expansion

## Status

`RETROFIT_FCL_V2_IMPLEMENTATION_AND_VISUAL_PROOF_PASSED`

This slice consumes Spatial Primitive Library V2 from earlier spatial checkpoints and expands FCL-001 beyond the original four-shape vocabulary. It is additive descendant evidence: the approved historical MIR/WAT, FAN and remediated FCL proof corpora remain intact and continue to run as regression gates.

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

Mirror/Water correct transforms are independently recomputed from the source primitive scene. FAN A→B and C→answer transforms are independently recomputed with the shared geometry engine. Every option set contains four unique semantic scene fingerprints.

## Connectivity refinement discovered during self-review

The first green retrofit artifact was not accepted as final. Manual review exposed two semantic/editorial weaknesses:

- a bend inside one continuous chevron path must not be treated like a multi-branch junction;
- internal implementation categories such as “line structure” and “open figure” are not sufficiently reliable learner-visible classification rules.

The descendant authority therefore distinguishes:

```text
branch junctions  = separate stroke branches meeting at a point
true crossings    = meeting points where stroke paths continue through
free terminals    = visible unjoined ends of open stroke paths
```

Representative locked semantics:

```text
Chevron:     junctions 0 / crossings 0 / free terminals 2
Arrow:       junctions 1 / crossings 0 / free terminals 3
T shape:     junctions 1 / crossings 0 / free terminals 3
Plus:        junctions 1 / crossings 1 / free terminals 4
Six-spoke:   junctions 1 / crossings 1 / free terminals 6
```

## FCL-001 V2 expansion

The original remediated eight FCL families remain intact. Twelve primitive-native families are added:

1. even-sided polygon;
2. vertical symmetry;
3. horizontal symmetry;
4. 180-degree symmetry;
5. 90-degree symmetry;
6. three-or-more-branch junction present;
7. true crossing present;
8. partitioned figure;
9. unchanged after 180° but changed after 90°;
10. exactly two free line ends;
11. closed shape;
12. straight-sided polygon.

```text
Existing FCL families:          8
Primitive-native FCL families: 12
Total prototype families:      20
Correct slots in new set:      A3 / B3 / C3 / D3
```

The weak first-pass `LINE_STRUCTURE` and `OPEN_FIGURE` families are superseded and must not be treated as accepted prototype rules.

## Human ambiguity contract

Each FCL V2 quartet is audited across visible descriptors including category, topology, polygon presence, exact side count, side parity, enclosed regions, branch junctions, true crossings, free-terminal count, quarter-turn period, vertical/horizontal/180-degree symmetry, orientation/reflection sensitivity, containment and fill capability.

A secondary 3-to-1 pattern is acceptable only when its minority is the **same intended odd option**. Any visible 3-to-1 descriptor that points to a different option rejects the quartet.

This distinguishes a harmless reinforcing clue from a genuinely competing answer.

## Validated implementation proof

```text
Implementation head: 80f77cd0398d08ac4f255e085f7826b6d306f44d
Workflow:            Validate SPA-FND-001 Primitive Retrofit FCL V2
Run:                 31413323791 — PASS
Artifact:            spa-primitive-retrofit-fcl-v2-review
Artifact ID:         9072432197
Digest:              sha256:20cb9998209815ddb96c1ccc0fef20437acf1b702b772b6bffe1e165b3dc0a4e
Status:              PASS_SPA_FND_001_PRIMITIVE_RETROFIT_FCL_V2
```

Passed layers:

```text
PASS_SPA_FND_001_FOUNDATION_RUNTIME
PASS_SPA_FND_001_MIRROR_WATER_PROOF
PASS_SPA_FND_001_WAVE_03_PERCEPTUAL_REMEDIATION
PASS_SPA_FND_001_FAN_001_VISUAL_REMEDIATION
PASS_SPA_FND_001_FCL_001_AMBIGUITY_PRESENTATION_REMEDIATION
PASS_SPA_FND_001_PRIMITIVE_LIBRARY_V2
PASS_SPA_FND_001_PRIMITIVE_RETROFIT_FCL_V2
```

## Manual visual review

The regenerated artifact was inspected as MIR, WAT, FAN and FCL contact sheets and the FCL set was checked again at approximately 75-pixel option size.

Confirmed:

- all four MIR primitive transforms reflect the complete source figure and distinguishing marker vertically;
- all four WAT primitive transforms reflect the complete source figure and distinguishing marker horizontally;
- all six FAN A→B and C→answer transformations remain visually coherent;
- all twelve new FCL quartets remain legible at small option size;
- the branch-junction question visibly contrasts arrow/T/Y branch meetings against a two-arm chevron bend;
- the half-turn-only question uses rectangle, hexagon and parallel lines against a quarter-turn-symmetric plus;
- the two-free-terminal question uses zigzag/L/Z against a three-terminal T;
- no reviewed quartet exposes a simpler visible 3-to-1 pattern pointing to a different answer;
- learner-facing evidence uses visible geometric language rather than internal category names.

## Lifecycle lock

```text
Permanent QLs:                0
Question Studio discovery:    false
Question Bank writes:         false
Mock-test eligibility:        false
Public publication:           false
API/database schema changes:  none
```

This status record is documentation-only relative to the validated implementation head. Its resulting branch head must pass the same full workflow before the slice is presented as exact-head complete. Merge, production synthesis, localisation and FSR activation remain unauthorized.
