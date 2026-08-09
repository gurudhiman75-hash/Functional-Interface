# SPA-FND-001 — FCL-001 Figure Classification Proof

## Status

`AMBIGUITY_AND_PRESENTATION_REMEDIATION_IMPLEMENTED_AWAITING_EXACT_HEAD_CI`

The earlier deterministic proof was technically green but failed human ambiguity review. A first nuisance audit then passed while still missing coarse marker groupings and leaving irrelevant controls visible. Both earlier proof claims are superseded.

This remediation remains stacked on the approved FAN-001 visual-remediation head. It is prototype evidence only and allocates no permanent QLs.

## Corrective architecture

- audits 42 raw, coarse, paired and derived descriptors;
- audits only features actually visible in the question;
- rejects unintended 3-to-1 distributions before rendering;
- uses property-specific presentation profiles, hiding irrelevant marker, arrow, shading and count controls;
- renders count quantities as detached dots rather than minus/equality-like bars;
- fixes arrow/segment alignment through explicit `UP→TOP`, `RIGHT→RIGHT`, `DOWN→BOTTOM`, `LEFT→LEFT` mapping;
- removes the binary shading/parity rule and arbitrary shape cycle;
- replaces them with inferable polygon-side relations;
- evaluates A, B, C and D explicitly in every learner explanation.

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

The authority covers raw values, top/bottom and left/right marker halves, marker diagonals, arrow and segment axes, orientation axes, rotation-sensitive shape families, raw pairs, shape and orientation equality, marker/arrow and marker/segment relations, arrow/segment alignment and opposition, count parity and bands, polygon presence, side parity, side comparison, signed side difference and total-side parity.

Negative fixtures reproduce the former exact-marker and diagonal shortcuts and prove they are rejected when the marker is visible.

## Lifecycle lock

```text
Permanent QLs:                0
Question Studio discovery:    false
Question Bank writes:         false
Mock-test eligibility:        false
Public publication:           false
API/database schema changes:  none
```

## Required exact-head status

```text
PASS_SPA_FND_001_FCL_001_AMBIGUITY_PRESENTATION_REMEDIATION
```
