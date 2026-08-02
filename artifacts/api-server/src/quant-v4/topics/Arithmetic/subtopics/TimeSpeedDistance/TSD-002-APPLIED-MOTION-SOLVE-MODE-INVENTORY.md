# ExamTree Quant V4 — TSD-002 Applied Motion Solve-Mode Inventory

**Chapter:** Time, Speed & Distance  
**Inventory status:** open executable-discovery baseline  
**Candidate count in this annex:** 218  
**Permanent/frozen count:** 0

This annex is not a quota. Each candidate must survive source saturation, executable generation, independent verification, merge/split review, cross-CP collision review and human editorial review.

## TSD-CP-007 — Train Crossing Fixed Objects, Platforms, Bridges and Tunnels

**Package:** `TSD-002`  
**Ownership:** A finite-length train crosses a fixed point or fixed-length object. The essential distance is determined by front/rear event semantics.  
**Dependencies:** CP-001.  
**Collision guard:** moving observers or another train belong to CP-008; ordinary vehicle motion with negligible length remains CP-001/003.  
**Open candidates:** 33

1. `findTrainCrossingTimeForPole`
2. `findTrainCrossingTimeForStationaryPerson`
3. `findTrainCrossingTimeForPlatform`
4. `findTrainCrossingTimeForBridge`
5. `findTrainCrossingTimeForTunnel`
6. `findTrainLengthFromPoleTimeAndSpeed`
7. `findTrainSpeedFromLengthAndPoleTime`
8. `findPlatformLengthFromCrossingTime`
9. `findBridgeLengthFromCrossingTime`
10. `findTunnelLengthFromCrossingTime`
11. `findTrainLengthFromPoleAndPlatformTimes`
12. `findTrainSpeedFromPoleAndPlatformTimes`
13. `findPlatformLengthFromPoleAndPlatformTimes`
14. `findDifferenceOfPlatformLengthsFromCrossingTimes`
15. `findCrossingTimeForTwoFixedObjects`
16. `findTimeForFrontToReachObject`
17. `findTimeForRearToClearObject`
18. `findDurationTrainFullyOccupiesPlatform`
19. `findDurationTrainFullyOccupiesBridge`
20. `findTimeBetweenEngineAndRearPassingObserver`
21. `findPartialTrainLengthPassedInGivenTime`
22. `findPartialPlatformCoveredInGivenTime`
23. `findTrainEntryOrExitClockTime`
24. `findUnknownEventTimeFromEntryExitTimeline`
25. `findNumberOfPolesPassedAtFixedSpacing`
26. `findSpacingBetweenPolesFromPassCount`
27. `findObjectLengthFromTrainOccupancyDuration`
28. `findTrainLengthRatioFromCrossingTimes`
29. `reconstructTrainCrossingFromTimeline`
30. `detectCrossingEventSemanticError`
31. `classifyFixedObjectTrainStateAsPossibleUniqueOrMultiple`
32. `verifyFixedObjectCrossingClaim`
33. `solveFixedObjectTrainDataSufficiency`

## TSD-CP-008 — Train-Train Relative Motion and Station Systems

**Package:** `TSD-002`  
**Ownership:** At least one finite-length train interacts with another moving body, another train, stations or a multi-event crossing schedule.  
**Dependencies:** CP-004, CP-005 and CP-007.  
**Collision guard:** single train against fixed geometry belongs to CP-007; sound/whistle propagation is outside Quant TSD.  
**Open candidates:** 37

1. `findCrossingTimeForOppositeDirectionTrains`
2. `findCrossingTimeForSameDirectionTrains`
3. `findOvertakeTimeForTrains`
4. `findRelativeSpeedFromTrainCrossing`
5. `findUnknownTrainLengthFromCrossing`
6. `findUnknownTrainSpeedFromCrossing`
7. `findSumOfTrainLengthsFromCrossing`
8. `findLengthRatioFromCrossingTimes`
9. `findSpeedRatioFromCrossingTimes`
10. `findTrainCrossingTimeForMovingPersonSameDirection`
11. `findTrainCrossingTimeForMovingPersonOppositeDirection`
12. `findTrainSpeedFromTwoMovingObservers`
13. `findObserverSpeedFromTrainCrossingTimes`
14. `findMeetingTimeBetweenStations`
15. `findStationDistanceFromDepartureAndMeetingData`
16. `findTrainMeetingPointBetweenStations`
17. `findStaggeredTrainDepartureMeetingTime`
18. `findDepartureDelayFromMeetingState`
19. `findPostMeetingTimesToStations`
20. `findSpeedRatioFromPostMeetingTrainTimes`
21. `findStationDistanceFromPostMeetingTrainTimes`
22. `findTimeGapBetweenPassingTwoObservers`
23. `findTimeGapBetweenTwoTrainCrossings`
24. `findUnknownPlatformLengthUsingTwoTrains`
25. `findUnknownTrainLengthUsingCommonPlatform`
26. `findDualPlatformOrBridgeState`
27. `findTrainOvertakeClockTime`
28. `findTrainMeetingClockTime`
29. `findCrossingAfterOneTrainStops`
30. `findCrossingAfterOneTrainChangesSpeed`
31. `findSequenceOfTrainCrossings`
32. `findMaximumOrCompleteOverlapDuration`
33. `reconstructTrainNetworkCaselet`
34. `detectContradictoryTrainStatements`
35. `classifyTrainSystemAsPossibleUniqueOrMultiple`
36. `verifyTrainSystemClaim`
37. `solveTrainSystemDataSufficiency`

## TSD-CP-009 — Motion in a Medium: Boats, Streams and One-Dimensional Wind

**Package:** `TSD-002`  
**Ownership:** Ground speed is the signed sum of a body's speed relative to a medium and the one-dimensional medium speed.  
**Dependencies:** CP-001, CP-002 and CP-004.  
**Collision guard:** two-dimensional shortest-path/shortest-time river crossing, vector wind drift and trigonometric headings are advanced holds owned jointly with Trigonometry; fluid mechanics is excluded.  
**Open candidates:** 39

1. `findDownstreamSpeed`
2. `findUpstreamSpeed`
3. `findStillWaterSpeed`
4. `findStreamSpeed`
5. `findDownstreamTime`
6. `findUpstreamTime`
7. `findDistanceFromUpstreamAndDownstreamTimes`
8. `findDistanceFromEqualDistanceTimeDifference`
9. `findStillWaterSpeedFromEqualDistanceTimes`
10. `findStreamSpeedFromEqualDistanceTimes`
11. `findUpstreamDownstreamSpeedRatio`
12. `findUpstreamDownstreamTimeRatio`
13. `findStillWaterSpeedFromTimeRatio`
14. `findStreamSpeedFromTimeRatio`
15. `findRoundTripTimeInStream`
16. `findRoundTripAverageSpeedInStream`
17. `findUnknownLegDistanceInStream`
18. `findUnknownLegSpeedInStream`
19. `findDistanceDifferenceAtEqualTime`
20. `findTimeDifferenceForUnequalDistances`
21. `findBoatCatchUpTimeInStream`
22. `findMeetingTimeForOppositeDirectionBoats`
23. `findMeetingPointForTwoBoats`
24. `findRaftOrFloatingObjectSpeed`
25. `findRaftTravelTime`
26. `findBoatCatchFloatingObjectTime`
27. `findDroppedObjectRecoveryDistance`
28. `findTurnaroundTimeToRecoverFloatingObject`
29. `findSwimmerSpeedAlongStream`
30. `findAircraftGroundSpeedWithTailwind`
31. `findAircraftGroundSpeedWithHeadwind`
32. `findStillAirSpeed`
33. `findWindSpeed`
34. `findAircraftRoundTripTime`
35. `findCurrentChangeFromTwoTrips`
36. `validateStillSpeedGreaterThanCurrent`
37. `classifyMediumMotionStateAsPossibleUniqueOrMultiple`
38. `verifyBoatStreamOrWindClaim`
39. `solveMediumMotionDataSufficiency`

## TSD-CP-010 — Races, Leads, Handicaps and Comparative Finishes

**Package:** `TSD-002`  
**Ownership:** Competitors cover a declared race distance and the target is a lead, finish gap, handicap, dead heat or transitive race comparison.  
**Dependencies:** CP-001 and CP-004.  
**Collision guard:** general circular meetings belong to CP-006; work/output contests belong to Time & Work.  
**Open candidates:** 34

1. `findDistanceLeadAtFinish`
2. `findTimeLeadAtFinish`
3. `findSpeedRatioFromDistanceLead`
4. `findSpeedRatioFromTimeLead`
5. `findRaceLengthFromDistanceLead`
6. `findRaceLengthFromTimeLead`
7. `findWinnerTimeFromLead`
8. `findLoserTimeFromLead`
9. `findHeadStartForDeadHeat`
10. `findStartDelayForDeadHeat`
11. `findDistanceHandicapForDeadHeat`
12. `findTimeHandicapForDeadHeat`
13. `findSpeedHandicapForDeadHeat`
14. `convertDistanceLeadToTimeLead`
15. `convertTimeLeadToDistanceLead`
16. `findAversusCLeadFromAversusBAndBversusC`
17. `findThreeRunnerFinishOrder`
18. `findThreeRunnerFinishGaps`
19. `findDeadHeatCalibration`
20. `findTwoStageRaceComparison`
21. `findRaceOutcomeAfterSpeedChange`
22. `findRaceOutcomeAfterRest`
23. `findRaceOutcomeWithStaggeredStarts`
24. `findTrackLengthFromFinishGap`
25. `findRunnerSpeedFromTwoRaceOutcomes`
26. `findChangedLeadAfterRaceLengthChange`
27. `findChangedLeadAfterSpeedChange`
28. `findWinnerMarginAsPercent`
29. `findAnimalLeapSpeedRatio`
30. `findRelayLegTimeOrDistance`
31. `detectImpossibleRaceLeadState`
32. `classifyRaceStateAsPossibleUniqueOrMultiple`
33. `verifyRaceClaim`
34. `solveRaceDataSufficiency`

## TSD-CP-011 — Escalators, Moving Walkways, Conveyors and Rotational Translation

**Package:** `TSD-002`  
**Ownership:** A person/object moves relative to a moving surface, or rotational motion is translated into linear distance/time through circumference.  
**Dependencies:** CP-001 and shared Mensuration circumference helper.  
**Collision guard:** gear mechanics, pulley dynamics and belt geometry are excluded; pure circle measurement belongs to Mensuration.  
**Open candidates:** 35

1. `findStationaryEscalatorStepCount`
2. `findEscalatorSpeedInStepsPerTime`
3. `findPersonStepRateOnEscalator`
4. `findTimeOnMovingEscalator`
5. `findStepsWalkedOnMovingEscalator`
6. `findTotalStepsFromTwoEscalatorObservations`
7. `findEscalatorSpeedFromUpAndDownObservations`
8. `findPersonSpeedFromUpAndDownObservations`
9. `findStoppedEscalatorTime`
10. `findEscalatorDirectionFromObservations`
11. `findStateAfterEscalatorDirectionReversal`
12. `findTwoPeopleStepRateRelation`
13. `findMovingWalkwayTravelTimeSameDirection`
14. `findMovingWalkwayTravelTimeOppositeDirection`
15. `findWalkingSpeedFromWalkwayTimes`
16. `findWalkwaySpeedFromTravelTimes`
17. `findWalkwayLength`
18. `findTimeSavedByMovingWalkway`
19. `findConveyorTransferTime`
20. `findObjectSpeedOnConveyor`
21. `findWalkingSpeedRelativeToConveyor`
22. `findWheelDistanceFromRevolutions`
23. `findWheelRevolutionsFromDistance`
24. `findWheelCircumferenceFromDistanceAndRevolutions`
25. `findWheelRadiusOrDiameterFromMotion`
26. `findLinearSpeedFromWheelRpm`
27. `findWheelRpmFromLinearSpeed`
28. `findTwoWheelRevolutionRatio`
29. `findRevolutionCountDifference`
30. `findPartialEscalatorOrWalkwayState`
31. `findStopStartEscalatorSchedule`
32. `detectNetSpeedFeasibilityError`
33. `classifyMovingSurfaceStateAsPossibleUniqueOrMultiple`
34. `verifyEscalatorWalkwayOrWheelClaim`
35. `solveMovingSurfaceDataSufficiency`

## TSD-CP-012 — Variable, Periodic, Multi-Stage and Essential Motion Synthesis

**Package:** `TSD-002`  
**Ownership:** Rates vary by an explicit sequence or periodic schedule, or at least two previously proven TSD authorities are independently essential to the learner contract.  
**Dependencies:** all earlier CPs as needed.  
**Collision guard:** a hard single-engine question with decorative secondary evidence remains in its original CP; unrestricted continuous acceleration belongs to Physics.  
**Open candidates:** 40

1. `findDistanceForArithmeticSpeedSequence`
2. `findTimeForArithmeticSpeedSequence`
3. `findUnknownTermInSpeedSequence`
4. `findDistanceForAlternatingSpeeds`
5. `findTimeForAlternatingSpeeds`
6. `findDistanceForPeriodicSpeedCycle`
7. `findExactTerminalPartialCycleTime`
8. `findTravelRestPeriodicCompletionTime`
9. `findDistanceRemainingAfterVariableSpeeds`
10. `findRequiredFinalSegmentSpeed`
11. `findRequiredFinalSegmentTime`
12. `findUnknownStageBoundary`
13. `findUnknownScheduleParameter`
14. `findRouteTimeWithTerrainDependentSpeeds`
15. `findPolygonTrackTimeWithSideDependentSpeeds`
16. `findSquareOrRectangleTrackMeetingWithSideSpeeds`
17. `findMultiModalWalkCycleRideTime`
18. `findMultiModalDistanceSplit`
19. `chooseMinimumTimeRoute`
20. `findSpeedPlanForDeadline`
21. `findDeparturePlanForDeadline`
22. `findCompleteItineraryFromPartialEvidence`
23. `findMissingMotionSegment`
24. `findMotionStateFromDistanceTimeTable`
25. `findMotionStateFromSpeedTimeTable`
26. `findMotionStateFromDiagramAndText`
27. `findMotionStateFromSharedCaselet`
28. `findTrainPlusScheduleSynthesis`
29. `findBoatPlusPursuitSynthesis`
30. `findCircularRaceSynthesis`
31. `findEscalatorPlusScheduleSynthesis`
32. `findTwoEngineInverseState`
33. `findMinimumFeasibleSpeed`
34. `findMaximumFeasibleDelay`
35. `findCompleteValidParameterSet`
36. `findCountOfValidMotionStates`
37. `detectContradictoryMultiStageState`
38. `classifySynthesisStateAsUniqueMultipleOrImpossible`
39. `verifyMultiStageMotionClaim`
40. `solveMultiStageMotionDataSufficiency`
