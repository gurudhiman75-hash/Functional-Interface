# SPA-FND-001 — FAN-001 Figure Analogy Proof

## Status

`EXACT_HEAD_VISUAL_REMEDIATION_PASSED`

The first FAN proof passed deterministic state tests but failed manual visual review because the old rotation authority moved only the marker and arrow while leaving shape orientation and segment placement fixed. That original proof result is superseded and must not be treated as editorial approval.

## Corrective architecture

- figure state now stores outer-shape orientation, inner-shape orientation and segment-group anchor;
- complete rotations transform shape orientation, marker, arrow and segment placement together;
- reflections transform every visible component about the declared axis;
- compound rotation plus shading uses the same complete-scene geometry before changing fill;
- the renderer uses explicit layers so shaded inner figures cannot hide the arrow;
- count segments sit outside the main figure to avoid collisions;
- every geometric A→B pair is independently compared with the shared affine transformation engine;
- non-geometric rules use strict state-field and visual-role delta contracts;
- an explicit negative test rejects the former marker-and-arrow-only “rotation” defect.

## Remediated proof corpus

```text
Chapter:        FAN-001 Figure Analogy
Questions:      10
Correct slots:  A3 / B3 / C2 / D2
Adjacent repeated correct slots: 0
```

Rule coverage:

1. complete 90° clockwise rotation;
2. complete 180° rotation;
3. complete vertical reflection;
4. marker-only movement;
5. segment addition;
6. segment deletion;
7. inner-shape substitution;
8. shading inversion with arrow visibility preserved;
9. inner/outer exchange;
10. complete rotation plus shading inversion.

## Validated remediation proof

```text
Implementation head: f4de5af835ca859f7ee3dc589dc2196736bf9d9e
Final PR head:       e4c30c2e3a697738f0f3f8b98163e05d2fc528c6
Workflow:            Validate SPA-FND-001 FAN-001 proof
Final run:           31248700365 — PASS
Artifact:            spa-fan-001-editorial-review
Artifact ID:         9019307625
Digest:              sha256:90241653b94347cc515d45be15c09349b7f05ed9c5ad55beb5d62974e4f2b7d1
Status:              PASS_SPA_FND_001_FAN_001_VISUAL_REMEDIATION
```

Passed proof layers:

```text
PASS_SPA_FND_001_FOUNDATION_RUNTIME
PASS_SPA_FND_001_MIRROR_WATER_PROOF
PASS_SPA_FND_001_WAVE_03_PERCEPTUAL_REMEDIATION
PASS_SPA_FND_001_FAN_001_VISUAL_REMEDIATION
```

The regenerated HTML was manually inspected as a 10-question contact sheet. All ten A→B transformations and correct C→answer applications were visually consistent. The earlier malformed rotation pattern no longer appears.

## Additive Primitive Library V2 enhancement

A later descendant branch preserves this approved 10-question FAN baseline and adds an 18-primitive eligibility pool plus six controlled primitive-native analogy examples.

The six examples exercise complete:

- 90° rotation;
- 180° rotation;
- vertical reflection;
- horizontal reflection;

across open figures, arrows, partitioned figures and polygons. For every example, A→B and C→correct-answer are independently recomputed using the shared affine geometry engine and all four answer scenes must remain semantically unique.

The descendant enhancement is proof of reusable visual vocabulary, not a replacement for the approved FAN corpus. Its evidence is recorded in `SPA-FND-001-PRIMITIVE-RETROFIT-FCL-V2-STATUS.md`.

## Lifecycle lock

```text
Permanent QLs:                0
Question Studio discovery:    false
Question Bank writes:         false
Mock-test eligibility:        false
Public publication:           false
API/database schema changes:  none
```
