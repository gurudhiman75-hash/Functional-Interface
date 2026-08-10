# TSD-CP-003 — Executable Discovery and Post-Overlap Candidate

**Checkpoint:** `TSD-CP-003 — Speed Changes, Schedules, Early-Late Arrival and Stops`  
**Package:** `TSD-001`  
**Blueprint authority:** `TSD-END-TO-END-DESIGN-BLUEPRINT.md`  
**Source inventory:** `TSD-001-CORE-MOTION-SOLVE-MODE-INVENTORY.md`  
**Current status:** `POST_OVERLAP_AUTHORITY_CANDIDATE_REVIEW`  
**Permanent QLs:** `0`  
**English freeze:** `UNFROZEN`  
**Question Studio / Question Bank / tests / public delivery:** locked

## 1. Discovery boundary retained for source coverage

The authoritative CP-003 inventory contains 35 source candidates. Executable discovery deliberately keeps a broad runtime surface so no source-backed representation disappears before ownership review:

- 24 provisional mathematical discovery authorities;
- 22 learner-facing discovery modes;
- 2 internal QA authorities;
- exact source ownership of all 35 candidates;
- no permanent QL allocation.

The broad discovery registry is not the final QL boundary.

## 2. Exact learner foundation complete

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

The solver proof covers 24 exact cases across the 22 learner modes, with additional representation/target variants, tampered-answer rejection, impossible-state rejection and recovery-time/recovery-speed contract guards.

## 3. Deterministic learner generation complete

The runtime now provides, for every learner discovery mode:

- deterministic parameter factories;
- exam-natural English stems;
- exact four-option construction;
- three method-derived wrong answers with structured wrong-working provenance;
- option-specific learner feedback;
- six-step worked explanations;
- context and representation saturation;
- provisional difficulty labels;
- stable language IDs and mathematical fingerprints.

The runtime proof exercises 40 seeds per learner discovery mode:

- `22 × 40 = 880` generated learner questions;
- all four answer positions reached for every mode;
- exactly balanced answer positions across the sweep;
- at least three stem states and three mathematical states per mode;
- exact wrong-working recomputation for every distractor;
- lifecycle locks retained.

The editorial sample contains 66 rows: three distinct questions for each of the 22 discovery modes.

## 4. Cross-checkpoint overlap audit complete

After generation, every learner discovery mode was compared against the finalized CP-001/002 authority registry.

Result:

- **11** genuinely new CP-003 learner authority candidates retained;
- **2** discovery modes merged into another new CP-003 authority;
- **9** discovery modes absorbed as CP-003 representation extensions of existing CP-001/002 authorities;
- **0** learner source candidates dropped.

The two within-CP003 merges are:

- `distanceFromEarlyLatePair` → `distanceFromSpeedTimeDifference`;
- `startTimeShiftForSameArrival` → `timeGainLossFromSpeedChange`.

The nine prior-authority representations are:

- `scheduledArrivalTimeFromActualSpeed` → `arrivalClockTime`;
- `requiredRecoverySpeedAfterLostTime` → `requiredUniformSpeedForDeadline`;
- `requiredRemainingSpeedAfterPartialRoute` → `requiredRemainingSpeedForTargetAverage`;
- `stoppageDurationFromRunningAndOverallSpeed` → `unknownSegmentTimeFromAverage`;
- `overallSpeedIncludingStops` → `averageSpeedFromSegments`;
- `runningSpeedFromOverallSpeedAndStops` → `unknownSegmentSpeedFromAverage`;
- `speedChangePointDistance` → `segmentAllocationFromTotalsAndSpeeds`;
- `fractionOfRouteAtChangedSpeed` → `unknownDistanceShareFromAverageSpeed`;
- `walkingRidingAllocation` → `segmentAllocationFromTotalsAndSpeeds`.

This produces a candidate authority count through CP-003 of:

- 38 finalized prior learner authorities;
- 11 new CP-003 learner authority candidates;
- **49 learner authority candidates total**;
- 4 prior internal authorities + 2 CP-003 internal authorities = 6 internal;
- **55 mathematical authority candidates total**.

These are authority counts, not permanent QL allocations.

## 5. Post-overlap editorial review mapping

The 66 generated learner rows are preserved unchanged and remapped to their true mathematical authority owner.

The remapped review therefore represents:

- 20 authority targets in total;
- 11 new CP-003 authority targets;
- 9 existing CP-001/002 authority targets receiving CP-003 representation-extension content;
- 33 rows generated directly from the 11 retained CP-003 modes;
- 6 rows from the two merged CP-003 discovery modes;
- 27 rows representing existing CP-001/002 authorities.

The remap changes ownership metadata only. It does not change stems, options, answer keys, explanations, fingerprints or the approved CP-001/002 frozen English corpus.

## 6. Lifecycle locks

The checkpoint deliberately remains non-releasable:

- permanent QLs: `0`;
- English: `UNFROZEN`;
- difficulty: `EDITORIAL_CALIBRATION_REQUIRED`;
- Question Studio: locked;
- Question Bank: `NOT_STORED`;
- tests: `INELIGIBLE`;
- public delivery: `false`.

## 7. Next gate

Before final merge/split approval or QL allocation:

1. calibrate difficulty against SSC, Banking and Punjab-state exam expectations;
2. blind-review the 66-row post-overlap corpus for exam realism, explanation clarity and distractor quality;
3. make an explicit editorial decision on whether `scheduleBuffer` is strong enough to remain a standalone learner authority;
4. approve or reject the nine prior-authority representation extensions without mutating the existing frozen CP-001/002 inventory;
5. only then finalize CP-003 authority ownership and allocate permanent QLs.
