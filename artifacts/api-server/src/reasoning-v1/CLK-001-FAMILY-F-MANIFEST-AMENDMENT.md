# Reasoning V1 Manifest Amendment — Family F

**Authority:** `CLK-001-CLOCKS-MASTER-END-TO-END-DESIGN-V2.md` only.

## Family and packages

```text
Family F — Numerical and Temporal Reasoning
REAS-CAL   Calendar
REAS-CLK   Clocks
```

## Phase placement

```text
Phase 2B — Self-contained numerical/temporal chapters
1. CAL-001 Calendar
2. CLK-001 Clocks
```

## Package and delivery policy

- Calendar package: `CAL-001`
- Clocks package: `CLK-001`
- Default delivery: four-option, single-correct MCQ
- Option uniqueness: exact semantic value plus visibly distinct option rendering
- Distractors: named, reproducible misconception methods
- Locales: `en-IN`, `hi-IN`, `pa-IN`, each independently human-reviewed

## Ownership boundary

- Ordinary clock-hand movement, angle arithmetic, textual/numeric vertical mirror time, faulty clocks and striking clocks belong to `CLK-001`.
- Vertically or horizontally reflected clock-diagram selection belongs to `MIR-001`.
- Numeric water-image time is excluded under the continuous real-clock model.
- General circular motion of people or vehicles belongs to Time, Speed and Distance.
- Bells or alarms ringing together at fixed intervals belong to Number System/LCM.
- Date and weekday arithmetic belongs to `CAL-001`.

## Lifecycle

This amendment permits controlled implementation but does not activate delivery. The following remain required independently:

1. source-saturation audit;
2. executable checkpoint discovery;
3. solver and verifier proof;
4. merge/split, inverse, boundary and gap audits;
5. English human freeze;
6. Hindi human freeze;
7. Punjabi human freeze;
8. multilingual parity proof;
9. Question Studio integration review;
10. separate Question Bank, test-eligibility and publication approvals.

Until those gates pass, permanent QLs remain unallocated and all delivery flags remain false.
