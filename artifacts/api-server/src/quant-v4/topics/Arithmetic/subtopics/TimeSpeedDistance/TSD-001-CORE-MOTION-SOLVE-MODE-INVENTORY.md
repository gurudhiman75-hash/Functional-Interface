# ExamTree Quant V4 — TSD-001 Core Motion Solve-Mode Inventory

**Chapter:** Time, Speed & Distance  
**Inventory status:** open executable-discovery baseline  
**Candidate count in this annex:** 199  
**Permanent/frozen count:** 0

This annex is not a quota. Each candidate must survive source saturation, executable generation, independent verification, merge/split review, cross-CP collision review and human editorial review.

## TSD-CP-001 — Uniform Motion, Units and Proportionality

**Package:** `TSD-001`  
**Ownership:** One body or one uniform motion state. The governing inference is the exact relation among distance, speed and duration, including unit conversion and proportionality. No segmented journey, relative-motion event or moving medium.  
**Dependencies:** shared exact rational/unit foundation.  
**Collision guard:** overall average speed belongs to CP-002; schedule consequences of speed change belong to CP-003; pure percentage manipulation belongs to Percentage.  
**Open candidates:** 32

1. `findDistanceFromSpeedAndTime`
2. `findSpeedFromDistanceAndTime`
3. `findTimeFromDistanceAndSpeed`
4. `convertKmphToMps`
5. `convertMpsToKmph`
6. `convertDistanceUnit`
7. `convertTimeUnit`
8. `convertCompoundSpeedUnit`
9. `findSpeedInRequestedUnit`
10. `findDistanceWithFractionalDuration`
11. `findDurationWithFractionalDistance`
12. `findArrivalClockTime`
13. `findDepartureClockTime`
14. `findElapsedTimeAcrossClockBoundary`
15. `compareDistancesAtEqualTime`
16. `compareTimesAtEqualDistance`
17. `compareSpeedsAtEqualTime`
18. `findDistanceRatioFromSpeedAndTimeRatios`
19. `findSpeedRatioFromDistanceAndTimeRatios`
20. `findTimeRatioFromDistanceAndSpeedRatios`
21. `findUnknownDistanceByDirectProportion`
22. `findUnknownTimeByDirectProportion`
23. `findUnknownSpeedByInverseProportion`
24. `findTimeAfterSpeedChangeForSameDistance`
25. `findSpeedChangeFromTimeChangeForSameDistance`
26. `findSpeedFromPace`
27. `findPaceFromSpeed`
28. `findDistanceFromPaceAndTime`
29. `findRequiredUniformSpeedForDeadline`
30. `findUniformSpeedFromTwoEquivalentTrips`
31. `classifyMotionStateAsPossibleUniqueOrIndeterminate`
32. `verifyUniformMotionClaim`

## TSD-CP-002 — Segmented Journeys and Average-Speed Reconstruction

**Package:** `TSD-001`  
**Ownership:** One traveller or vehicle moves through two or more distance/time segments. The governing authority is total distance divided by total elapsed travel time and inverse reconstruction of hidden segments.  
**Dependencies:** CP-001.  
**Collision guard:** direct equal-distance/equal-time average-speed learner templates already owned by Average are shared-engine authorities, not duplicate QLs; stoppage/schedule effects belong to CP-003.  
**Open candidates:** 34

1. `findAverageSpeedFromTwoSegments`
2. `findAverageSpeedFromMultipleSegments`
3. `findAverageSpeedForEqualDistances`
4. `findAverageSpeedForEqualTimes`
5. `findAverageSpeedForUnequalDistances`
6. `findAverageSpeedForUnequalTimes`
7. `findAverageSpeedFromDistanceFractions`
8. `findAverageSpeedFromTimeFractions`
9. `findAverageSpeedFromDistanceRatio`
10. `findAverageSpeedFromTimeRatio`
11. `findAveragePaceFromSegmentPaces`
12. `findUnknownSegmentSpeedFromOverallAverage`
13. `findUnknownSegmentTimeFromOverallAverage`
14. `findUnknownSegmentDistanceFromOverallAverage`
15. `findUnknownDistanceFractionFromOverallAverage`
16. `findUnknownTimeFractionFromOverallAverage`
17. `findReturnSpeedFromOutwardSpeedAndOverallAverage`
18. `findOutwardSpeedFromReturnSpeedAndOverallAverage`
19. `findOneWayDistanceFromRoundTripTimeAndSpeeds`
20. `findRoundTripTimeFromOneWayDistanceAndSpeeds`
21. `findTotalDistanceFromAverageSpeedAndTotalTime`
22. `findSegmentDistanceFromTotalDistanceTimeAndSpeeds`
23. `findSegmentTimeFromTotalDistanceAndSpeeds`
24. `findDistanceRatioFromAverageAndSegmentSpeeds`
25. `findTimeRatioFromAverageAndSegmentSpeeds`
26. `findRequiredRemainingSpeedForTargetAverage`
27. `findDistanceCoveredAtEachSpeedFromTotalDistanceAndTime`
28. `findTimeSpentAtEachSpeedFromTotalDistanceAndAverage`
29. `compareCandidateAverageSpeeds`
30. `findAverageSpeedAfterRouteReversal`
31. `findAverageSpeedWithMixedUnits`
32. `reconstructSegmentedJourneyFromTable`
33. `classifyAverageSpeedStateAsPossibleUniqueOrMultiple`
34. `verifyAverageSpeedClaim`

## TSD-CP-003 — Speed Changes, Schedules, Early-Late Arrival and Stops

**Package:** `TSD-001`  
**Ownership:** The route is fixed or partly fixed, while speed, departure time, stoppage or schedule changes create a gain/loss in arrival time.  
**Dependencies:** CP-001 and CP-002.  
**Collision guard:** delayed-start pursuit belongs to CP-004 when another moving body is essential; periodic multi-stage schedules beyond one governing schedule system belong to CP-012.  
**Open candidates:** 35

1. `findTimeSavedFromSpeedIncrease`
2. `findDelayFromSpeedDecrease`
3. `findDistanceFromTwoSpeedsAndTimeDifference`
4. `findOriginalSpeedFromPercentChangeAndTimeDifference`
5. `findChangedSpeedFromTimeDifference`
6. `findOriginalDistanceFromSpeedChangeAndTimeDifference`
7. `findUsualSpeedFromEarlyLatePair`
8. `findDistanceFromEarlyLatePair`
9. `findScheduledArrivalTimeFromActualSpeed`
10. `findRequiredSpeedAfterLateStart`
11. `findRequiredSpeedAfterUnplannedStop`
12. `findRequiredRemainingSpeedAfterSlowInitialSegment`
13. `findRequiredRemainingSpeedAfterFastInitialSegment`
14. `findStoppageDurationFromRunningAndOverallSpeed`
15. `findOverallSpeedIncludingStops`
16. `findRunningSpeedFromOverallSpeedAndStops`
17. `findNumberOfStopsFromOverallDelay`
18. `findDelayFromRegularStops`
19. `findRestTimeInRepeatedTravelRestCycle`
20. `findTotalTimeWithStopsAfterFixedDistance`
21. `findTotalTimeWithStopsAfterFixedTime`
22. `findDistanceCoveredBeforeSpeedChange`
23. `findFractionOfRouteAtChangedSpeed`
24. `findSpeedChangePointFromArrivalDifference`
25. `findBreakdownDurationFromArrivalDelay`
26. `findRepairTimeFromRequiredRecoverySpeed`
27. `findStartTimeShiftForSameArrival`
28. `findArrivalShiftFromDepartureAndSpeedChanges`
29. `findWalkingRidingTimeSplit`
30. `findWalkingRidingDistanceSplit`
31. `findScheduleBuffer`
32. `findHiddenDistanceFromTimeGap`
33. `findHiddenSpeedFromArrivalDifference`
34. `classifyScheduleStateAsPossibleUniqueOrMultiple`
35. `verifyEarlyLateOrStopClaim`

## TSD-CP-004 — Straight-Line Relative Motion, Meeting and Pursuit

**Package:** `TSD-001`  
**Ownership:** Two or more bodies move on one line until a first meeting, crossing, catch-up or specified separation. Relative speed and initial gap are the central invariants.  
**Dependencies:** CP-001.  
**Collision guard:** train body lengths belong to CP-007/008; repeated endpoint turnarounds and post-meeting reconstruction belong to CP-005; closed tracks belong to CP-006.  
**Open candidates:** 33

1. `findRelativeSpeedOppositeDirections`
2. `findRelativeSpeedSameDirection`
3. `findMeetingTimeFromInitialSeparation`
4. `findInitialSeparationFromMeetingTime`
5. `findRelativeSpeedFromMeetingTime`
6. `findIndividualSpeedFromRelativeSpeedAndOtherSpeed`
7. `findCatchUpTimeFromHeadStartDistance`
8. `findHeadStartDistanceFromCatchUpTime`
9. `findDelayedStartCatchUpTime`
10. `findStartDelayFromCatchUpState`
11. `findFasterSpeedFromCatchUpState`
12. `findSlowerSpeedFromCatchUpState`
13. `findSeparationAfterMovingApart`
14. `findInitialGapFromLaterSeparation`
15. `findMeetingPointDistanceSplit`
16. `findSpeedRatioFromMeetingPoint`
17. `findMeetingPointFromSpeedRatio`
18. `findUnknownStartPointGap`
19. `findMeetingClockTime`
20. `findDepartureClockTimeFromMeetingState`
21. `findPursuitTimeWithOneRest`
22. `findCatchUpAfterVariableStart`
23. `findMeetingAfterOneBodyPassesCheckpoint`
24. `findRelativeDistanceCoveredInGivenTime`
25. `findTimeUntilSpecifiedSeparation`
26. `findSpeedNeededToAvoidOrCauseMeeting`
27. `findTwoPursuerMeetingOrder`
28. `findIntermediatePointMeetingState`
29. `findRelativeMotionStateFromTimeline`
30. `findRelativeMotionStateFromDiagram`
31. `classifyRelativeMotionStateAsPossibleUniqueOrMultiple`
32. `verifyMeetingOrPursuitClaim`
33. `solveRelativeMotionDataSufficiency`

## TSD-CP-005 — Return, Turnaround, Repeated Linear Meetings and Post-Meeting Systems

**Package:** `TSD-001`  
**Ownership:** Motion on a bounded line continues after the first meeting or includes return, endpoint turnaround, shuttle or post-meeting arrival evidence.  
**Dependencies:** CP-004.  
**Collision guard:** closed-loop modular motion belongs to CP-006; timetable-heavy train systems belong to CP-008.  
**Open candidates:** 31

1. `findSpeedRatioFromPostMeetingArrivalTimes`
2. `findPostMeetingArrivalTimeFromSpeedRatio`
3. `findTotalDistanceFromPostMeetingTimes`
4. `findSpeedsFromPostMeetingTimesAndDistance`
5. `findMeetingPointFromPostMeetingTimes`
6. `findSecondMeetingTimeAfterEndpointTurnaround`
7. `findSecondMeetingPointAfterEndpointTurnaround`
8. `findNthMeetingTimeOnLine`
9. `findNthMeetingPointOnLine`
10. `findRepeatedMeetingCountInTimeWindow`
11. `findMeetingAfterOneTravellerTurnsBack`
12. `findMeetingAfterBothTurnAtEndpoints`
13. `findShuttleMeetingTime`
14. `findShuttleDistanceCovered`
15. `findReturnJourneyMeetingPoint`
16. `findMeetingPointShiftAfterSpeedChange`
17. `findSpeedChangeFromMeetingPointShift`
18. `findStartDelayFromMeetingPoint`
19. `findStaggeredDepartureMeetingPoint`
20. `findIntermediateStartPointFromMeetingData`
21. `findEndpointRestTimeFromNextMeeting`
22. `findTimeBetweenFirstAndSecondMeetings`
23. `findDistanceBetweenEndpointsFromRepeatedMeetings`
24. `findRouteReversalScheduleParameter`
25. `findPassThenCatchAfterTurnaround`
26. `findMeetingAtSpecifiedCheckpoint`
27. `reconstructCompleteLinearItinerary`
28. `detectContradictoryMeetingStatements`
29. `classifyPostMeetingStateAsPossibleUniqueOrMultiple`
30. `verifyPostMeetingClaim`
31. `solvePostMeetingDataSufficiency`

## TSD-CP-006 — Circular and Closed-Track Motion

**Package:** `TSD-001`  
**Ownership:** Bodies move on a closed track where positions are interpreted modulo track length and questions concern laps, meetings, overtakes, distinct points or return to start.  
**Dependencies:** CP-001 and shared gcd/lcm helpers.  
**Collision guard:** straight races belong to CP-010; side-dependent polygon schedules belong to CP-012 unless the track is uniform.  
**Open candidates:** 34

1. `findCircularFirstMeetingTimeSameDirection`
2. `findCircularFirstMeetingTimeOppositeDirections`
3. `findFirstOvertakeTime`
4. `findLapDifferenceAfterTime`
5. `findMeetingCountInTimeWindow`
6. `findOvertakeCountInTimeWindow`
7. `findNthMeetingTime`
8. `findNthOvertakeTime`
9. `findDistinctMeetingPointCount`
10. `findMeetingPointLocation`
11. `findCircularMeetingPointFromSpeedRatio`
12. `findCircularSpeedRatioFromMeetingPoint`
13. `findTrackLengthFromMeetingTime`
14. `findRunnerSpeedFromMeetingCount`
15. `findTimeBothReturnToStart`
16. `findFirstSimultaneousStartPointReturn`
17. `findThreeRunnerSimultaneousReturn`
18. `findThreeRunnerFirstCommonMeeting`
19. `findPairwiseMeetingScheduleForThreeRunners`
20. `findMeetingWithInitialArcGap`
21. `findInitialArcGapFromMeetingTime`
22. `findMeetingWithStaggeredStarts`
23. `findStartDelayFromCircularMeeting`
24. `findMeetingAfterDirectionReversal`
25. `findMeetingWithLapRest`
26. `findNumberOfCompletedLaps`
27. `findLocationAfterGivenTime`
28. `findFirstMeetingAtStartingPoint`
29. `distinguishMeetingAnywhereVsAtStart`
30. `distinguishTotalMeetingsVsDistinctPoints`
31. `reconstructCircularMotionFromCheckpointTable`
32. `classifyCircularStateAsPossibleUniqueOrMultiple`
33. `verifyCircularTrackClaim`
34. `solveCircularTrackDataSufficiency`
