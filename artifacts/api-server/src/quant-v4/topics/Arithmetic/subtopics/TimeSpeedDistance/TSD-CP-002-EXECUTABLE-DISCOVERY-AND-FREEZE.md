# TSD-CP-002 — Executable Discovery and English Freeze

**Canonical problem:** `TSD-CP-002 — Segmented Journeys and Average-Speed Reconstruction`  
**Package:** `TSD-001`  
**Freeze decision:** `APPROVED`  
**Permanent QL range:** `TSD-QL-024` through `TSD-QL-037`  
**Next available TSD QL:** `TSD-QL-038`  
**Question Bank / tests / public delivery:** disabled

## Ownership

CP-002 owns one traveller or vehicle moving through at least two distance/time segments where the essential calculation is:

`overall average speed = total distance ÷ total travelling time`

It also owns inverse reconstruction of an unknown segment, equal-distance outward/return systems, distance/time share reconstruction, target-average recovery and comparison of complete segmented plans.

It does not own:

- direct one-segment motion, units, clocks or elementary proportionality — CP-001;
- stoppages, scheduled arrival, early/late consequences or speed-change time gains — CP-003;
- another independently moving body — later relative-motion checkpoints;
- train length, stream speed, race handicap or moving-surface mechanics — later packages.

## Source disposition

The open inventory supplied 34 source candidates. Executable discovery freezes them into 16 mathematical authorities:

- 14 learner-facing authorities;
- 2 internal QA authorities.

Every source candidate has exactly one owner. No source candidate is uncovered or multiply owned.

Internal QA authorities remain:

- `classifyAverageSpeedState`;
- `verifyAverageSpeedClaim`.

They test solver/verifier behaviour but receive no learner QL.

## Merge decisions

The following are representations of `averageSpeedFromSegments`, not separate authorities:

- two-segment and multi-segment routes;
- equal-distance and equal-time routes;
- unequal distances or unequal times;
- distance fractions, time fractions and ratios;
- route reversal;
- mixed units;
- table/log presentation.

These forms all reduce to the same essential operation after the segments are normalized: add total distance, add actual travelling time, divide once.

The following candidate pairs/groups were also merged because they share one invariant and differ only by the requested field:

- distance share and time share → `unknownSegmentShareFromAverage`;
- first/second segment distance or time → `segmentAllocationFromTotalsAndSpeeds`;
- distance ratio and time ratio → `segmentRatioFromAverageAndSpeeds`;
- outward or return unknown speed → `unknownRoundTripLegSpeedFromAverage`.

## Split decisions

The 14 learner authorities remain separate because each changes the essential unknown, weighting rule or invariant:

1. `averageSpeedFromSegments`
2. `averagePaceFromSegments`
3. `unknownSegmentSpeedFromAverage`
4. `unknownSegmentTimeFromAverage`
5. `unknownSegmentDistanceFromAverage`
6. `unknownSegmentShareFromAverage`
7. `unknownRoundTripLegSpeedFromAverage`
8. `oneWayDistanceFromRoundTripData`
9. `roundTripTimeFromOneWayDistance`
10. `totalDistanceFromAverageAndTime`
11. `segmentAllocationFromTotalsAndSpeeds`
12. `segmentRatioFromAverageAndSpeeds`
13. `requiredRemainingSpeedForTargetAverage`
14. `compareSegmentedJourneyPlans`

Average pace is not merged into average speed because its learner contract weights minutes per kilometre rather than kilometres per hour. Equal-distance round trips retain their harmonic invariant. Segment allocation is a simultaneous-equation system, while ratio reconstruction and target-average recovery have different requested objects and distractor families.

## Permanent mapping

| Permanent QL | Frozen solve mode |
|---|---|
| TSD-QL-024 | `averageSpeedFromSegments` |
| TSD-QL-025 | `averagePaceFromSegments` |
| TSD-QL-026 | `unknownSegmentSpeedFromAverage` |
| TSD-QL-027 | `unknownSegmentTimeFromAverage` |
| TSD-QL-028 | `unknownSegmentDistanceFromAverage` |
| TSD-QL-029 | `unknownSegmentShareFromAverage` |
| TSD-QL-030 | `unknownRoundTripLegSpeedFromAverage` |
| TSD-QL-031 | `oneWayDistanceFromRoundTripData` |
| TSD-QL-032 | `roundTripTimeFromOneWayDistance` |
| TSD-QL-033 | `totalDistanceFromAverageAndTime` |
| TSD-QL-034 | `segmentAllocationFromTotalsAndSpeeds` |
| TSD-QL-035 | `segmentRatioFromAverageAndSpeeds` |
| TSD-QL-036 | `requiredRemainingSpeedForTargetAverage` |
| TSD-QL-037 | `compareSegmentedJourneyPlans` |

## English freeze

The frozen review contains 42 English questions: three distinct mathematical, stem and teaching states for every learner authority.

The review explicitly covers:

- equal-distance, multi-segment and mixed-unit average-speed forms;
- distance-weighted average pace;
- inverse speed, time and distance reconstruction;
- distance-share and time-share reconstruction;
- outward and return inverse harmonic forms;
- one-way distance and complete round-trip time;
- total-distance reconstruction;
- both distance and time segment allocation;
- both distance and time ratio reconstruction;
- target-average remaining-speed recovery;
- Plan A, Plan B and exact-tie comparisons.

Every frozen question has:

- an exact canonical answer;
- a materially separate independent verifier;
- four unique options with exactly one correct choice;
- complete intermediate working;
- three distinct teaching openings per authority;
- one correct-option reason and three value-specific misconception diagnoses;
- balanced MathJax delimiters;
- natural singular/plural units;
- no internal QA or engine/governance wording.

## Delivery boundary

Permanent mathematical IDs and English wording are frozen, but delivery remains disabled:

- Question Bank status: `NOT_STORED`;
- test eligibility: `INELIGIBLE`;
- public publication: `false`;
- Hindi and Punjabi localization: not started;
- Question Studio registration: not enabled.
