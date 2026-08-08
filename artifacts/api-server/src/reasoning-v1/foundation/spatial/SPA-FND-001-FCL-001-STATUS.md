# SPA-FND-001 — FCL-001 Figure Classification Proof

## Status

`EXACT_HEAD_PROOF_PASSED`

This proof wave is stacked on the approved FAN-001 visual-remediation head. It remains prototype evidence only and does not allocate permanent QLs.

## Proof corpus

```text
Chapter:        FCL-001 Figure Classification
Questions:      8
Correct slots:  A2 / B2 / C2 / D2
Answer sequence: A B C D A B C D
Adjacent repeated correct slots: 0
```

## Property coverage

1. outer/inner structural relationship;
2. segment count versus inner polygon side count;
3. marker position relative to arrow direction;
4. inner/outer orientation relationship;
5. shading and odd/even count parity;
6. marker position opposite the segment group;
7. fixed shape-cycle relationship;
8. arrow direction aligned with segment-group side.

## Ambiguity control

For every question, the solver evaluates the complete approved FCL property authority. A question is accepted only when:

- the intended property is satisfied by exactly three figures;
- exactly one figure violates it;
- no second approved property also creates a three-versus-one split;
- all four semantic states are distinct;
- all four rendered scenes are distinct;
- every rendered scene matches its state metadata and visible role counts.

A negative regression fixture proves that a quartet with two valid separating properties is rejected.

## Visual and editorial review

The complete eight-question review artifact was inspected manually. The odd figure is visually supported in every question, arrow and marker layers remain visible, count segments are legible, and no answer depends on drawing quality or accidental spacing.

The shading/count question includes both valid forms of the rule—open with an even count and shaded with an odd count—so it cannot be solved by shading alone. Orientation explanations use student-facing directions instead of internal quarter-turn codes.

## Validated proof

```text
Implementation head: 253ae84c0b41a66a6dcc450f449332118cfae776
Status head:         be28b9bd221dcc76eb596371d1d422756eb6c417
Workflow:            Validate SPA-FND-001 FCL-001 proof
Run:                 31251308380 — PASS
Artifact:            spa-fcl-001-editorial-review
Artifact ID:         9020085614
Digest:              sha256:f1b905168554cf32c603314fb145774fded27c5365a1f1aeba04cd04fbb36187
Status:              PASS_SPA_FND_001_FCL_001_PROOF
```

Passed proof layers:

```text
PASS_SPA_FND_001_FOUNDATION_RUNTIME
PASS_SPA_FND_001_MIRROR_WATER_PROOF
PASS_SPA_FND_001_WAVE_03_PERCEPTUAL_REMEDIATION
PASS_SPA_FND_001_FAN_001_VISUAL_REMEDIATION
PASS_SPA_FND_001_FCL_001_PROOF
```

## Editorial proof artifact

The workflow generates deterministic JSON and responsive HTML containing:

- four option scenes;
- hidden answer;
- common-property explanation;
- per-question property vector;
- uniqueness and scene-integrity diagnostics;
- learner observation, rule, application and check.

## Lifecycle lock

```text
Permanent QLs:                0
Question Studio discovery:    false
Question Bank writes:         false
Mock-test eligibility:        false
Public publication:           false
API/database schema changes:  none
```
