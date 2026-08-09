# SPA-FND-001 — FCL-001 Figure Classification Proof

## Status

`AMBIGUITY_REMEDIATION_IMPLEMENTED_AWAITING_EXACT_HEAD_CI`

The earlier deterministic proof was technically green but failed a second human ambiguity review. Its "unique property" check covered only the finite programmed property authority, while several quartets contained simpler raw-feature 3-to-1 shortcuts. That proof is superseded.

This remediation remains stacked on the approved FAN-001 visual-remediation head. It is prototype evidence only and allocates no permanent QLs.

## Corrective architecture

- audits 31 raw, paired and derived nuisance descriptors;
- rejects any unintended 3-to-1 distribution before rendering;
- distinguishes uniqueness inside the approved property authority from broader nuisance-feature screening;
- fixes arrow/segment alignment by mapping `UP` to `TOP` and `DOWN` to `BOTTOM`;
- removes the binary shading/parity rule because a four-option 3-to-1 question necessarily exposes a simpler shading or parity shortcut;
- replaces the arbitrary four-shape cycle with the directly inferable rule that the inner polygon has exactly one more side than the outer polygon;
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
2. segment count is one less than inner-polygon sides;
3. marker lies on the arrow side;
4. inner and outer shapes point in the same direction;
5. segment count is one less than outer-polygon sides;
6. marker lies opposite the segment group;
7. inner polygon has exactly one more side than outer polygon;
8. arrow points toward the segment group.

## Ambiguity boundary

Every quartet must pass both:

```text
UNIQUE_WITHIN_APPROVED_PROPERTY_AUTHORITY
NO_UNINTENDED_3_TO_1_NUISANCE_FEATURE
```

Audited descriptors include raw shapes, orientations, marker, arrow, shading, segment count and segment side; raw feature pairs; shape equality; orientation equality; marker/arrow and marker/segment relations; arrow/segment alignment and opposition; count parity; inner/outer polygon count relations; polygon presence; side parity; side-count comparison; and total-side parity.

A negative regression fixture reproduces the former marker-position shortcut and proves it is rejected.

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
PASS_SPA_FND_001_FCL_001_AMBIGUITY_REMEDIATION
```
