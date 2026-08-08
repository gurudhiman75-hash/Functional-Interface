# SPA-FND-001 — FCL-001 Figure Classification Proof

## Status

`IMPLEMENTED_AWAITING_EXACT_HEAD_CI`

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

## Editorial proof

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

## Required exact-head status

```text
PASS_SPA_FND_001_FCL_001_PROOF
```
