# TSD-CP-003 — Executable Discovery Checkpoint

**Checkpoint:** `TSD-CP-003 — Speed Changes, Schedules, Early-Late Arrival and Stops`  
**Package:** `TSD-001`  
**Blueprint authority:** `TSD-END-TO-END-DESIGN-BLUEPRINT.md`  
**Source inventory:** `TSD-001-CORE-MOTION-SOLVE-MODE-INVENTORY.md`  
**Status:** `EXECUTABLE_DISCOVERY_IN_PROGRESS`  
**Permanent QLs:** `0`  
**English freeze:** `UNFROZEN`  
**Question Studio / Question Bank / tests / public delivery:** locked

## Discovery result

The 35 source candidates are mapped exactly once into 24 provisional mathematical authorities:

- 22 learner-facing authorities;
- 2 internal QA authorities;
- no permanent QL allocation;
- no cross-CP relative-motion, train, circular or medium-motion authority leakage.

This count is provisional and may change after source saturation, full executable generation, merge/split review and cross-CP collision review.

## Important merge decisions

Merged as one provisional authority where the hidden state and governing operation are genuinely shared:

- faster/slower fixed-route time gain or loss;
- direct/original/hidden distance reconstructed from two speeds and a time gap;
- original/changed/hidden speed reconstructed from a fixed-route time difference;
- late-start and unplanned-stop recovery-speed representations;
- slow/fast initial-segment remaining-speed representations;
- fixed-distance/fixed-time regular-stop total-time representations;
- walking/riding time and distance allocation representations.

## Important split decisions

Kept distinct because the answer contract or inverse problem changes materially:

- usual speed from an early/late pair vs route distance from an early/late pair;
- recovery speed after lost time vs lost-time/repair duration from recovery evidence;
- stop count from total delay vs delay from regular stops;
- stoppage duration vs overall speed vs running speed;
- speed-change point distance vs fraction of route at changed speed;
- start-time shift vs combined arrival shift vs schedule buffer.

A self-review caught `findRepairTimeFromRequiredRecoverySpeed` initially grouped under the speed-answer recovery authority. It is now correctly owned by `lostTimeDurationFromScheduleRecovery`, whose answer kind is `TIME`. The registry proof explicitly guards this boundary.

## Exact learner foundation complete

All 22 learner-facing provisional authorities now have exact rational solving and independent verification:

1. `timeGainLossFromSpeedChange`
2. `distanceFromSpeedTimeDifference`
3. `speedFromFixedRouteTimeDifference`
4. `usualSpeedFromEarlyLatePair`
5. `distanceFromEarlyLatePair`
6. `scheduledArrivalTimeFromActualSpeed`
7. `requiredRecoverySpeedAfterLostTime`
8. `requiredRemainingSpeedAfterPartialRoute`
9. `stoppageDurationFromRunningAndOverallSpeed`
10. `overallSpeedIncludingStops`
11. `runningSpeedFromOverallSpeedAndStops`
12. `numberOfStopsFromOverallDelay`
13. `delayFromRegularStops`
14. `restTimeInRepeatedTravelRestCycle`
15. `totalTimeWithRegularStops`
16. `speedChangePointDistance`
17. `fractionOfRouteAtChangedSpeed`
18. `lostTimeDurationFromScheduleRecovery`
19. `startTimeShiftForSameArrival`
20. `arrivalShiftFromDepartureAndSpeedChanges`
21. `walkingRidingAllocation`
22. `scheduleBuffer`

The exact proof exercises 24 cases across the 22 learner modes, including additional representation coverage for fixed-route speed reconstruction and walking/riding allocation. It also requires:

- 24 tampered-answer rejections;
- 15 impossible or invalid-state rejections;
- exact source ownership of all 35 discovery candidates;
- answer-contract guards for the recovery-time/recovery-speed split;
- zero permanent QLs;
- English `UNFROZEN`;
- Question Bank `NOT_STORED`;
- tests `INELIGIBLE`;
- public delivery disabled.

Latest dedicated CI status: `PASS` on exact head `bb8fbfd9ed1fd6d6a74217ba5c8f210e1fc44f4a`.

## Next implementation phase

The next phase is deterministic learner-generation and source saturation, not QL freezing:

1. parameter factories for all 22 learner authorities;
2. deterministic seeded generation with realistic SSC/banking/Punjab-exam values;
3. concise exam-like English stems;
4. four unique options with method-derived distractors;
5. independent misconception/option recomputation;
6. student-friendly 6–7-step explanations with option-specific feedback;
7. difficulty calibration and context plausibility;
8. multi-seed diversity/source-saturation proofs;
9. cross-CP collision review and final merge/split review.

Only after those gates pass may CP-003 authority counts or English-freeze status be considered for approval.
