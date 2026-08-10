# TSD-CP-001 — English Authority Freeze

**Canonical problem:** `TSD-CP-001 — Uniform Motion, Units and Proportionality`  
**Freeze decision:** `APPROVED`  
**Permanent QL range:** `TSD-QL-001` through `TSD-QL-023`  
**Next available TSD QL:** `TSD-QL-024`  
**Question Bank / tests / public delivery:** disabled

## Final merge/split result

The original 32 source candidates remain exhaustively dispositioned into 25 mathematical authorities.

- 23 authorities are learner-facing and receive permanent QL IDs.
- 2 authorities remain internal QA and do not receive learner QL IDs:
  - `classifyUniformMotionState`;
  - `verifyUniformMotionClaim`.

No learner authority should be merged further:

- direct distance, speed and time have different unknowns and different option/error contracts;
- speed, distance and time conversions have different unit domains;
- mixed-unit speed requires a two-sided unit-normalization contract;
- arrival, departure and elapsed clock problems have different temporal directions;
- equal-time/equal-distance comparisons and component-ratio inversions have different cancellation or inversion rules;
- the three proportionality authorities reconstruct different unknowns;
- speed, pace and pace-derived distance are reciprocal but not interchangeable tasks;
- deadline speed combines a clock interval with a distance-to-speed reconstruction.

No learner authority should be split further:

- fractional values, compound times, mixed units, equivalent-speed option sets, noon/midnight/next-day cases and natural answer-unit edges are representation states inside their owning authority;
- the answer-unit audit found no new independent learner operation;
- direct equal-value variations do not change the governing inference.

## Permanent mapping

| Permanent QL | Frozen solve mode |
|---|---|
| TSD-QL-001 | `distanceFromSpeedAndTime` |
| TSD-QL-002 | `speedFromDistanceAndTime` |
| TSD-QL-003 | `timeFromDistanceAndSpeed` |
| TSD-QL-004 | `convertSpeedUnit` |
| TSD-QL-005 | `convertDistanceUnit` |
| TSD-QL-006 | `convertTimeUnit` |
| TSD-QL-007 | `speedFromMixedUnits` |
| TSD-QL-008 | `arrivalClockTime` |
| TSD-QL-009 | `departureClockTime` |
| TSD-QL-010 | `elapsedClockTime` |
| TSD-QL-011 | `compareDistancesAtEqualTime` |
| TSD-QL-012 | `compareTimesAtEqualDistance` |
| TSD-QL-013 | `compareSpeedsAtEqualTime` |
| TSD-QL-014 | `distanceRatioFromSpeedAndTimeRatios` |
| TSD-QL-015 | `speedRatioFromDistanceAndTimeRatios` |
| TSD-QL-016 | `timeRatioFromDistanceAndSpeedRatios` |
| TSD-QL-017 | `distanceByProportion` |
| TSD-QL-018 | `timeByProportion` |
| TSD-QL-019 | `speedByProportion` |
| TSD-QL-020 | `speedFromPace` |
| TSD-QL-021 | `paceFromSpeed` |
| TSD-QL-022 | `distanceFromPaceAndTime` |
| TSD-QL-023 | `requiredUniformSpeedForDeadline` |

## English approval boundary

The approved review contains 69 questions: three distinct mathematical, stem and teaching states for each of the 23 learner authorities.

Approval requires and the executable proof enforces:

- valid canonical and independently verified answers;
- four unique options and exactly one keyed answer;
- complete intermediate working;
- a full four-tier explanation;
- one correct-option explanation and three value-specific wrong-option diagnoses;
- no trivial matching-unit direct-distance multiplication;
- explicit journey reconstruction for proportionality;
- noon, midnight and next-day clock coverage;
- natural unit-edge coverage without artificial authority creation;
- no internal QA question in the learner review;
- no unresolved placeholder, generic engine phrase or malformed MathJax.

## Immutability and delivery boundary

The permanent QL mapping is frozen. A future wording or presentation improvement may not silently change the mathematical authority.

The freeze does **not** enable production delivery:

- English records remain review artifacts, not Question Bank rows;
- Hindi and Punjabi localization has not started;
- test eligibility remains `INELIGIBLE`;
- `publiclyPublishable` remains `false`;
- Question Studio registration remains disabled.
