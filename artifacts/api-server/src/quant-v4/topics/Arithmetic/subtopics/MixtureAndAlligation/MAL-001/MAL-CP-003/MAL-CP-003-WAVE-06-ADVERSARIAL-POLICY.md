# MAL-CP-003 Wave 06 — Adversarial, Exactness and Distractor Policy

Status: **open-discovery hardening authority**.

This wave does not allocate permanent QLs, freeze solve modes, or enable delivery.

## Exactness policy

1. Canonical mathematics uses exact rational arithmetic.
2. Valid-state generation must construct exact states first.
3. A rounded final quantity must not be used as exact inverse evidence.
4. Rounding is allowed only when the question explicitly declares it and only at the final display boundary.
5. Ratios remain exact, reduced and orientation-sensitive.

## Rejected inverse evidence

The solver must reject:

- final original quantity not strictly below its initial value when a positive replacement occurred;
- retained fractions without an exact rational nth root when an exact removal quantity or vessel capacity is requested;
- operation-count evidence with no exact integer match in the declared domain;
- a valid count that lies outside the declared operation domain;
- non-positive final ratio parts;
- stage removals equal to or exceeding vessel volume;
- malformed unequal-stage and vector-stage sequences;
- component states that do not conserve vessel volume.

## Monotonic uniqueness

For a valid stage-retention factor `0 < r < 1`, the sequence

```text
Q, Qr, Qr², Qr³, ...
```

is strictly decreasing. Therefore an exact positive final quantity can correspond to at most one positive integer operation count for fixed `Q` and `r`. The declared maximum operation count remains part of the generation contract.

## Misconception authorities

Distractors must be traceable to a specific learner error rather than arbitrary nearby numbers. The current authority includes:

- applying only one stage;
- subtracting `n × removed quantity` linearly;
- exponentiating the removed fraction rather than the retained fraction;
- reporting the complement component;
- reversing the requested ratio;
- failing to reduce a ratio;
- using one operation too many or too few;
- treating total retention as a one-stage retention factor;
- reporting the removed quantity as vessel capacity.

## Freeze status

```text
Permanent QLs: 0
Frozen solve modes: 0
Question Studio exposure: disabled
Question Bank eligibility: disabled
Test eligibility: disabled
Public publication: disabled
Freeze readiness: false
```
