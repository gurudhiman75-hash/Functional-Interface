# SPA-FND-001 — Gap Authority and Runtime Remediation V1

## Status

`PASS_RUNTIME_CAPABILITY_SCALE_VALIDATED_QUESTION_SYNTHESIS_PENDING`

This checkpoint continues the source-saturation audit on PR #708 and closes the **runtime capability** gaps identified for `FAN-001`, `FCL-001` and `FSR-001` without allocating permanent QLs or activating Question Studio.

Implementation head validated by the dedicated workflow:

`fcc519eafb12c10e72510b3925e7cc7b65122f9c`

Baseline remains Production Scale V2 exact head:

`caff1d753358a0a9b12e8c892c391adbb007eab8`

## Why this phase is separate from question readiness

The source audit found nineteen mechanisms outside the previous production-synthesis families. This phase proves that the shared spatial runtime can represent and validate those mechanisms at scale.

It does **not** claim that learner-facing stems, distractors, option sets or explanations for those nineteen gaps are already exam-ready. Their authority therefore carries two separate maturity fields:

```text
runtimeStatus:         RUNTIME_CAPABILITY_SCALE_VALIDATED
learnerQuestionStatus: QUESTION_SYNTHESIS_PENDING
permanentQlId:         null
```

## Audited gap coverage

```text
FAN gaps: 5
FCL gaps: 6
FSR gaps: 8
Total:   19
```

Every source-backed gap from `SPA-FND-001-SOURCE-SATURATION-AUDIT-V1` has an exact provisional runtime-authority entry.

## Reusable capability layer

The nineteen gaps are implemented through twelve shared capabilities rather than nineteen one-off generators:

1. selected-node rigid transform;
2. selected-node non-rigid scale;
3. multi-element position cycling;
4. hierarchy / inside-outside transfer;
5. fill-state mutation;
6. count mutation through addition/removal;
7. node substitution;
8. rotation-orbit equivalence;
9. generalized relation evaluation;
10. centered subfigure transform relation;
11. composable multi-operation pipelines;
12. alternating operation pipelines.

The original `transformScene` rigid-transform contract was **not weakened**. Non-rigid scale is implemented only as an explicit selected-node gap-runtime operation, so existing foundation assumptions remain intact.

## Gap-to-runtime examples

### FAN

- independent component rotations use different pivots/directions for separate elements;
- cyclic movement permutes several elements rather than moving one marker;
- enlargement/reduction uses selected-node scale;
- inside/outside transfer moves a component across the container boundary;
- compound analogy pipelines combine reflection, movement, fill and count mutation.

### FCL

- rotational equivalence uses a canonical quarter-turn orbit fingerprint;
- general count relations work across role-labelled elements;
- relative-size relations compare geometry extents;
- relative position supports cardinal and diagonal sectors;
- fill oddities track both amount and location;
- internal mirror/rotation relations compare centered subfigure scenes.

### FSR

- reflection/inversion can operate as a repeated series rule;
- independent component rotations can progress in opposite directions;
- general movement supports arbitrary component translation;
- count series can add and remove multiple elements;
- fill-state progression can alternate;
- nodes can be replaced by different geometry classes;
- multi-element permutation can cycle across phases;
- alternating rule phases can compose rotation and shading.

## Runtime scale proof

Workflow:

`Validate SPA-FND-001 Gap Runtime Remediation V1`

Run:

`31661048295` — PASS

Artifact:

```text
Name:   spa-gap-runtime-remediation-v1-evidence
ID:     9166194248
Digest: sha256:33de7a7a3662d912bef98760fd3d6b176d48f06dfb78dc849520b4927171791f
```

Marker:

`PASS_SPA_FND_001_GAP_RUNTIME_REMEDIATION_V1`

Scale result:

```text
Requested per gap: 100
Audited gaps:       19
Total accepted:   1900

FAN: 500
FCL: 600
FSR: 800
```

Every gap produced exactly 100 unique deterministic runtime candidates.

Capability exercise counts:

```text
SELECTED_RIGID_TRANSFORM           900
SELECTED_SCALE                     200
POSITION_CYCLE                     200
HIERARCHY_TRANSFER                 200
FILL_STATE_MUTATION                400
COUNT_MUTATION                     300
NODE_SUBSTITUTION                  100
ROTATION_ORBIT_EQUIVALENCE         100
GENERAL_RELATION_EVALUATION        400
SUBFIGURE_TRANSFORM_RELATION       100
PIPELINE_COMPOSITION               800
ALTERNATING_PIPELINE               100
```

## Proof gates passed

- exact 19-gap identity;
- every representative semantic proof passes;
- all generated `SpatialScene` objects validate;
- 1,900 unique content fingerprints;
- 1,900 unique delivery fingerprints;
- deterministic replay from the same seed prefix;
- alternate seed divergence for every gap;
- all twelve reusable capabilities exercised;
- strict API-server build passes;
- Production Authority V1 revalidation passes;
- Source Saturation Audit V1 revalidation passes;
- evidence artifact upload succeeds.

## What remains unproven

This checkpoint intentionally does **not** prove:

- four-option learner-question uniqueness for the nineteen gap families;
- exam-realistic stems;
- distractor quality and misconception coverage;
- student-friendly explanations;
- mobile presentation quality for representative new gap questions;
- production question-scale capacity for these gap families;
- Banking exam saturation;
- Punjab-state exam saturation;
- Hindi or Punjabi realization.

The previous source-scope locks remain in force: Banking and Punjab-state eligibility are not established by this runtime proof.

## Lifecycle lock

```text
Permanent QLs:                0
Discovery frozen:             false
English human freeze:         false
Question Studio discovery:    false
Question Bank writes:         false
Mock-test eligibility:        false
Public publication:           false
Hindi/Punjabi generation:     false
API/database schema changes:  none
```

No registry, API, database or student-facing route was activated.

## Next gate

`SPATIAL_GAP_QUESTION_SYNTHESIS_AND_EDITORIAL_V1`

That phase should convert the surviving nineteen runtime-backed mechanisms into **learner-question candidates**, with chapter-appropriate solver evidence, four-option distractor contracts, representative SVG review, English stems and student-friendly explanations. Only after that phase should the normalized learner archetypes be reconsidered for permanent QL allocation.
