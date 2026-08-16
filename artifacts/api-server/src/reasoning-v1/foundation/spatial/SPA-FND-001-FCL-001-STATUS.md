# SPA-FND-001 — FCL-001 Figure Classification Proof

## Status

`AMBIGUITY_AND_PRESENTATION_REMEDIATION_PROOF_PASSED`

The earlier deterministic proof was technically green but failed human ambiguity review. A first nuisance audit then passed while still missing coarse marker groupings and leaving irrelevant controls visible. Both earlier proof claims are superseded by this implementation.

This remediation remains stacked on the approved FAN-001 visual-remediation head. It is prototype evidence only and allocates no permanent QLs.

## Corrective architecture

- audits 42 raw, coarse, paired and derived descriptors;
- audits only features actually visible in the question;
- rejects unintended 3-to-1 distributions before rendering;
- uses property-specific presentation profiles, hiding irrelevant marker, arrow, shading and count controls;
- renders count quantities as detached dots rather than minus/equality-like bars;
- maps arrow direction to diagram side explicitly through `UP→TOP`, `RIGHT→RIGHT`, `DOWN→BOTTOM`, `LEFT→LEFT`;
- scales inner figures to 70% only inside triangular FCL containers, preventing boundary crossings without changing the FAN renderer;
- removes the binary shading/parity rule and arbitrary shape cycle;
- replaces them with inferable polygon-side relations;
- evaluates A, B, C and D explicitly in every learner explanation;
- uses dot terminology consistently in student-facing explanations.

## Remediated proof corpus

```text
Chapter:         FCL-001 Figure Classification
Questions:       8
Correct slots:   A2 / B2 / C2 / D2
Answer sequence: A B C D A B C D
```

Property coverage:

1. outer and inner shapes are different;
2. dot count is one less than inner-polygon sides;
3. marker lies on the arrow side;
4. inner and outer shapes point in the same direction;
5. dot count is one less than outer-polygon sides;
6. marker lies opposite the dot group;
7. inner polygon has exactly one more side than outer polygon;
8. arrow points toward the dot group.

## Ambiguity boundary

Every quartet must pass both:

```text
UNIQUE_WITHIN_APPROVED_PROPERTY_AUTHORITY
NO_UNINTENDED_VISIBLE_3_TO_1_NUISANCE_FEATURE
```

The authority covers raw values, top/bottom and left/right marker halves, marker diagonals, arrow and dot-group axes, orientation axes, rotation-sensitive shape families, raw pairs, shape and orientation equality, marker/arrow and marker/dot relations, arrow/dot alignment and opposition, count parity and bands, polygon presence, side parity, side comparison, signed side difference and total-side parity.

Negative fixtures reproduce the former exact-marker and diagonal shortcuts and prove they are rejected when the marker is visible.

## Validated implementation proof

```text
Head:        8d09f54f847df976f1c9075bb62de12cce03ee93
Workflow:    Validate SPA-FND-001 FCL-001 proof
Run:         31303622135 — PASS
Artifact:    spa-fcl-001-editorial-review
Artifact ID: 9035256545
Digest:      sha256:8ea5dcb35b29a4ae52bd77725f374af76340451983abd9d20cb64641b31f97f5
Status:      PASS_SPA_FND_001_FCL_001_AMBIGUITY_PRESENTATION_REMEDIATION
```

Passed proof layers:

```text
PASS_SPA_FND_001_FOUNDATION_RUNTIME
PASS_SPA_FND_001_MIRROR_WATER_PROOF
PASS_SPA_FND_001_WAVE_03_PERCEPTUAL_REMEDIATION
PASS_SPA_FND_001_FAN_001_VISUAL_REMEDIATION
PASS_SPA_FND_001_FCL_001_AMBIGUITY_PRESENTATION_REMEDIATION
```

## Manual visual review

The complete eight-question artifact was inspected at desktop scale and at a 180-pixel mobile-like option size. The review confirmed:

- no inner figure crosses its outer boundary;
- dots remain legible and separate from mathematical operator symbols;
- marker, arrow and dot-group relations remain visible at mobile scale;
- each intended odd figure is supported without a simpler competing 3-to-1 visible pattern;
- all option-by-option explanations match the rendered figures.

## Additive Primitive Library V2 expansion

A later descendant branch keeps these eight remediated families intact and adds twelve primitive-native families, bringing the controlled FCL prototype authority to **20 families**.

Added learner-visible relationships cover:

- even-sided polygons;
- vertical, horizontal, 180° and 90° symmetry;
- branch junctions;
- true crossings;
- partitioned figures;
- 180°-but-not-90° rotational symmetry;
- exactly two free line ends;
- closed shapes;
- straight-sided polygons.

The descendant ambiguity audit adds primitive topology, side count/parity, region count, branch-junction count, true-crossing count, free-terminal count, rotation period and symmetry properties. As with this remediation, an unintended 3-to-1 visual feature pointing to a **different** option rejects the quartet.

Manual descendant review explicitly rejected the first-pass internal-category rules `LINE_STRUCTURE` and `OPEN_FIGURE`; they are superseded by visible geometric rules and are not part of the accepted V2 prototype set.

The additive evidence is recorded in `SPA-FND-001-PRIMITIVE-RETROFIT-FCL-V2-STATUS.md`. This does not change the historical status or approval meaning of the eight-question remediation above.

## Lifecycle lock

```text
Permanent QLs:                0
Question Studio discovery:    false
Question Bank writes:         false
Mock-test eligibility:        false
Public publication:           false
API/database schema changes:  none
```

This proof does not authorize permanent checkpoint allocation, Question Studio activation, localisation rollout, merge or release.
