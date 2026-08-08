# SPA-FND-001 — FAN-001 Figure Analogy Proof

## Status

`IMPLEMENTED_AWAITING_EXACT_HEAD_CI`

This proof wave is stacked on the approved Wave 03 Mirror/Water remediation head. It remains prototype evidence only and does not allocate permanent QLs.

## Proof corpus

```text
Chapter:        FAN-001 Figure Analogy
Questions:      10
Correct slots:  A3 / B3 / C2 / D2
Adjacent repeated correct slots: 0
```

## Rule coverage

1. 90° clockwise rotation;
2. 180° rotation;
3. vertical reflection;
4. marker movement;
5. segment addition;
6. segment deletion;
7. inner-shape substitution;
8. shading inversion;
9. inner/outer exchange;
10. compound rotation plus shading inversion.

## Ambiguity control

For every A→B pair, the solver applies the complete approved rule authority and requires exactly one matching rule before the question can be packaged. The same proven rule is then independently applied to C.

Questions are rejected when:

- no approved rule explains A→B;
- more than one approved rule explains A→B;
- a distractor is invalid for C;
- two option states are semantically equal;
- two rendered option scenes are semantically equal;
- the correct option is missing after deterministic shuffling.

## Editorial proof

The workflow generates deterministic JSON and responsive HTML containing:

- A, B and C scenes;
- four answer scenes;
- rule and misconception ownership;
- hidden answer;
- observation, rule, application and check explanation;
- review and solver evidence.

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
PASS_SPA_FND_001_FAN_001_PROOF
```
