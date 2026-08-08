# SPA-FND-001 — FAN-001 Figure Analogy Proof

## Status

`VISUAL_REMEDIATION_IMPLEMENTED_AWAITING_EXACT_HEAD_CI`

The first FAN proof passed deterministic state tests but failed manual visual review because the old rotation authority moved only the marker and arrow while leaving shape orientation and segment placement fixed. That proof result is superseded and must not be treated as editorial approval.

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

## Required exact-head status

```text
PASS_SPA_FND_001_FAN_001_VISUAL_REMEDIATION
```

The workflow must also rerun the foundation, Wave 02 and remediated Wave 03 proof layers.

## Lifecycle lock

```text
Permanent QLs:                0
Question Studio discovery:    false
Question Bank writes:         false
Mock-test eligibility:        false
Public publication:           false
API/database schema changes:  none
```
