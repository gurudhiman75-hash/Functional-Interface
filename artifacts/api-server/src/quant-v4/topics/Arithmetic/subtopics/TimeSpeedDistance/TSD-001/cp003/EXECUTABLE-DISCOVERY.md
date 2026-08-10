# TSD-CP-003 — Executable Discovery and Accepted Post-Overlap Candidate

**Checkpoint:** `TSD-CP-003 — Speed Changes, Schedules, Early-Late Arrival and Stops`  
**Package:** `TSD-001`  
**Blueprint authority:** `TSD-END-TO-END-DESIGN-BLUEPRINT.md`  
**Source inventory:** `TSD-001-CORE-MOTION-SOLVE-MODE-INVENTORY.md`  
**Current status:** `POST_OVERLAP_EXAM_READINESS_REVIEW`  
**Permanent QLs:** `0`  
**English freeze:** `UNFROZEN`  
**Question Studio / Question Bank / tests / public delivery:** locked

## 1. Broad discovery boundary

The authoritative CP-003 inventory contains 35 source candidates. Executable discovery deliberately keeps a broad runtime surface so no source-backed representation disappears before ownership review:

- 24 provisional mathematical discovery authorities;
- 22 learner-facing discovery modes;
- 2 internal QA authorities;
- exact source accounting for all 35 candidates;
- no permanent QL allocation.

The broad discovery registry is evidence and generation coverage, not the final learner-authority boundary.

## 2. Exact learner foundation

All 22 learner discovery modes have exact rational solving and materially independent verification. Coverage includes:

- fixed-route speed/time gain-loss and inverse reconstruction;
- early/late schedule pairs;
- scheduled arrival and recovery speed;
- remaining speed after a partial route;
- stoppage/running/overall-speed systems;
- regular-stop count, delay and travel-rest cycles;
- speed-change-point distance and route fraction;
- lost-time/repair recovery duration;
- departure/arrival shifts and schedule buffer;
- walking/riding time-distance allocation.

The discovery solver proof covers 24 exact cases across the 22 learner modes, plus tampered-answer rejection, impossible-state rejection and answer-contract guards.

## 3. Deterministic learner generation

Every learner discovery mode has:

- deterministic parameter factories;
- exam-facing English stems;
- exact four-option construction;
- three method-derived wrong answers with structured wrong-working provenance;
- option-specific learner feedback;
- six-step worked explanations;
- context and representation saturation;
- provisional difficulty labels;
- stable language IDs and mathematical fingerprints.

The discovery runtime proof exercises 40 seeds per learner discovery mode:

- `22 × 40 = 880` generated learner questions;
- all four answer positions reached for every mode;
- exact wrong-working recomputation for every distractor;
- lifecycle locks retained.

The old discovery editorial sample contained 66 rows: three per discovery mode. It is no longer the accepted CP-003 review corpus because ownership and exam-readiness review have now removed one trivial learner family and strengthened diversity requirements.

## 4. Ownership audit and first exam-readiness decision

Every learner discovery mode was compared with the finalized CP-001/002 authority registry and then inspected for learner value.

Final candidate disposition at this gate:

- **10** genuinely new CP-003 learner authority candidates retained;
- **2** discovery modes merged into another new CP-003 authority;
- **9** discovery modes retained as CP-003 representation extensions of existing CP-001/002 authorities;
- **1** discovery mode rejected as a standalone learner authority;
- **0** permanent QLs allocated.

The two within-CP003 merges are:

- `distanceFromEarlyLatePair` → `distanceFromSpeedTimeDifference`;
- `startTimeShiftForSameArrival` → `timeGainLossFromSpeedChange`.

The nine prior-authority representation families are:

- `scheduledArrivalTimeFromActualSpeed` → `arrivalClockTime`;
- `requiredRecoverySpeedAfterLostTime` → `requiredUniformSpeedForDeadline`;
- `requiredRemainingSpeedAfterPartialRoute` → `requiredRemainingSpeedForTargetAverage`;
- `stoppageDurationFromRunningAndOverallSpeed` → `unknownSegmentTimeFromAverage`;
- `overallSpeedIncludingStops` → `averageSpeedFromSegments`;
- `runningSpeedFromOverallSpeedAndStops` → `unknownSegmentSpeedFromAverage`;
- `speedChangePointDistance` → `segmentAllocationFromTotalsAndSpeeds`;
- `fractionOfRouteAtChangedSpeed` → `unknownDistanceShareFromAverageSpeed`;
- `walkingRidingAllocation` → `segmentAllocationFromTotalsAndSpeeds`.

The nine representation families map to eight distinct prior authority targets because both speed-change-point and walking/riding allocation belong to `segmentAllocationFromTotalsAndSpeeds`.

### Rejected learner authority

`scheduleBuffer` is retained as discovery evidence but rejected from the learner-authority candidate set. Its generated task is simply:

`scheduled duration − planned duration = buffer`.

That operation adds no distinct motion equation and is materially below the expected SSC/banking TSD depth. It therefore must not consume a learner authority or permanent QL.

## 5. Candidate authority counts through CP-003

Accepted authority candidates through this checkpoint are now:

- 38 finalized prior learner authorities;
- 10 new CP-003 learner authority candidates;
- **48 learner authority candidates total**;
- 4 prior internal authorities + 2 CP-003 internal authorities = 6 internal;
- **54 accepted mathematical authority candidates total**.

The rejected `scheduleBuffer` discovery family is tracked separately and is not included in accepted authority counts.

## 6. Accepted editorial review corpus

The accepted review is regenerated deterministically from the runtime. For every accepted discovery family, selection now requires:

- three different learner stems;
- three different mathematical fingerprints;
- three different answers.

Expected accepted corpus:

- **21 accepted discovery families**;
- **63 learner rows**;
- **18 represented authority targets**;
- 10 new CP-003 authority targets;
- 9 prior-authority representation families mapped to 8 distinct CP-001/002 targets;
- 30 rows from the ten retained native CP-003 discovery modes;
- 6 rows from the two within-CP003 merged discovery modes;
- 27 prior-authority representation rows.

Three targets intentionally receive six CP-003 review rows because they absorb another family:

- `timeGainLossFromSpeedChange`;
- `distanceFromSpeedTimeDifference`;
- `segmentAllocationFromTotalsAndSpeeds`.

The remap changes authority ownership metadata only. It does not mutate the approved CP-001/002 frozen English inventory.

## 7. Blind-review remediations already applied

The first blind review found and corrected real learner-facing weaknesses:

- slower-speed stems that incorrectly said the speed “increases” now say “decreases” and ask for extra time;
- same-arrival departure-shift stems now explicitly say **earlier** or **later** according to the generated state;
- combined departure/speed-change arrival questions explicitly ask for the **magnitude** of the shift because the answer contract is unsigned duration;
- repeated answer pools were broadened for recovery speed, changed-route share, lost-time reconstruction and same-arrival shift;
- an awkward `1/8 hour` regular-stop profile was removed;
- commuter/human-heavy contexts were replaced with plausible bus/car/van/coach/taxi route contexts;
- same-arrival shift distractors gained a collision-safe, explicit average-times wrong method, preserving method-derived option quality when another wrong method numerically equals the correct answer.

## 8. Lifecycle locks

The checkpoint remains non-releasable:

- permanent QLs: `0`;
- English: `UNFROZEN`;
- difficulty: `EDITORIAL_CALIBRATION_REQUIRED`;
- Question Studio: locked;
- Question Bank: `NOT_STORED`;
- tests: `INELIGIBLE`;
- public delivery: `false`.

## 9. Remaining gate

Before final merge/split approval or QL allocation:

1. pass the strengthened whole-runtime and 63-row answer-diverse review proofs;
2. blind-review all 63 accepted rows for SSC/banking/Punjab exam realism, explanation clarity and distractor quality;
3. calibrate difficulty from actual operations and number complexity;
4. explicitly approve the nine prior-authority representation extensions without reopening or mutating frozen CP-001/002 English;
5. only then finalize CP-003 ownership, allocate permanent QLs and consider English freeze.
