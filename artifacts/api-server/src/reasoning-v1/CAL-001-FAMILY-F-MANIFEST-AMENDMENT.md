# Reasoning V1 Manifest Amendment — Family F

## Amendment proposed for merge

Upon merge, add a sixth reasoning family:

```text
Family F — Numerical and Temporal Reasoning
REAS-CAL   Calendar
REAS-CLK   Clock
```

## Phase placement

```text
Phase 2B — Self-contained numerical/temporal chapters
1. CAL-001 Calendar
2. CLK-001 Clock
```

## Ownership and dependency

- `CAL-001` owns Gregorian calendar arithmetic, day/date relations, leap and century rules, calendar repetition, period boundaries, and weekday frequency.
- `CLK-001` owns clock-hand, striking-clock, faulty-clock and mirror-time authorities.
- Calendar has no dependency on Clock.
- Clock may reuse a spatial analog-clock renderer without moving either chapter into the spatial family.

## Package and option policy

- Calendar package: `CAL-001`
- Clock package: `CLK-001`
- Default delivery: four-option, single-correct MCQ
- Option uniqueness: semantic, not string-based
- Distractors: named misconception methods with reproducible derivations

## Publication and localisation lifecycle

Merging this family amendment does not activate either chapter. Each package independently requires:

1. source audit;
2. foundation proof;
3. prototype discovery;
4. merge/split, inverse and gap audit;
5. English human freeze;
6. Hindi human freeze;
7. Punjabi human freeze;
8. multilingual parity proof;
9. Question Studio integration review;
10. separate Question Bank, test-eligibility and publication approvals.

Until those gates pass, permanent QLs remain unallocated and all delivery flags remain false.
