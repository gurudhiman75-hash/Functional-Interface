# TSD-CP-007 — Source Saturation and Merge/Split Audit

**Checkpoint:** TSD-CP-007  
**Package:** TSD-002  
**Status:** FINAL MERGE/SPLIT CANDIDATE — PRODUCT OWNER REVIEW REQUIRED BEFORE QL ALLOCATION  
**Discovery candidates reviewed:** 33  
**Retained learner authorities:** 11  
**Permanent QLs allocated:** 0  
**Next available QL:** TSD-QL-084

## Boundary

CP007 owns a finite-length train interacting with a stationary point or stationary finite-length object when front/rear event semantics are essential. Moving observers or another train move to CP008. A train front simply travelling an ordinary gap to a target, with train length irrelevant, remains generic CP001 distance-time motion.

## Source-saturation evidence

The audit deliberately sampled recent and historical official-paper reproductions plus stable aptitude banks. The purpose is not to copy stems; it is to confirm learner invariants and wording families.

| Source pattern | Evidence observed | Authority implication |
| --- | --- | --- |
| Pole + platform, recover speed | SSC GD Constable 2026 official-paper reproduction: pole time and 500 m platform time used to recover speed | Retain paired point/object-time speed authority; do not create separate pole/platform QLs |
| Pole + bridge, recover train length | SSC Selection Post 2025 official-paper reproduction: pole time plus 300 m bridge time used to recover train length | Retain paired point/object-time train-length authority |
| Pole + tunnel, recover speed/object state | SSC Selection Post 2019 reproduction and IBPS RRB Clerk-style train/tunnel examples | Tunnel is a wording skin over the same finite-object crossing geometry |
| Direct platform/bridge/tunnel crossing | SSC/MP Police/HTET/RRB-style official-paper reproductions repeatedly use L_train + L_object | Keep one finite-fixed-object crossing authority; merge platform/bridge/tunnel variants |
| Stationary person + platform | SSC Selection Post 2024 and NBCC JE 2022 reproductions use a stationary person exactly like a pole | Merge stationary person into fixed-point crossing |
| Contiguous bridge + platform | SSC CHSL 2019 reproduction asks travel from bridge start through adjacent platform end | Keep as a representation using one effective fixed length, not a standalone authority |
| Fixed-spacing telephone/telegraph poles | DSSSB JE 2019 and RRB NTPC-style reproductions ask speed/count with equal pole spacing and n-1 gaps | Retain fixed-spacing point-count authority with endpoint convention guard |
| Data sufficiency over train length | IndiaBIX train DS bank uses pole/man plus platform observations to decide sufficiency | Keep DS as an internal QA/assessment layer until ordinary authorities are frozen |
| Event wording: enter tunnel / completely exit | UGC NET and multiple tunnel examples distinguish entering, full passage, and rear-clear events | Retain one event-timeline authority and a separate full-occupancy authority where L_object - L_train is essential |

## Merge/split result

### Retained learner authorities — 11

1. `fixedPointCrossingTime`
2. `finiteFixedObjectCrossingTime`
3. `trainLengthFromPointCrossing`
4. `trainSpeedFromPointCrossing`
5. `fixedObjectLengthFromCrossingEvidence`
6. `trainLengthFromPointAndObjectTimes`
7. `trainSpeedFromPointAndObjectTimes`
8. `fixedObjectLengthDifferenceFromCrossingTimes`
9. `fullOccupancyDuration`
10. `trainCrossingEventTimeline`
11. `fixedSpacingPointCount`

### Merged into retained authorities — 12

Stationary-person crossing merges into fixed-point crossing. Bridge/tunnel direct crossing merge into finite-object crossing. Bridge/tunnel/object-length inverses merge into one fixed-object-length authority. Rear-clear timing merges into complete crossing. Bridge full-occupancy and its inverse object-length form merge into full occupancy. Engine-to-rear observer timing merges into fixed-point crossing. Entry/exit clock-time projection merges into event timeline. Pole-spacing inverse merges into fixed-spacing counting.

### Cross-checkpoint holds — 2

- `findTimeForFrontToReachObject` → CP001 unless finite-length boundary events are essential.
- `findPartialPlatformCoveredInGivenTime` → CP001 unless a front/rear crossing boundary is essential.

### Representation holds — 4

- `findCrossingTimeForTwoFixedObjects`
- `findPartialTrainLengthPassedInGivenTime`
- `findTrainLengthRatioFromCrossingTimes`
- `reconstructTrainCrossingFromTimeline`

These remain useful source/stem families but do not consume standalone learner QLs.

### Internal QA — 4

- semantic-error detection
- UNIQUE/MULTIPLE/IMPOSSIBLE state classification
- claim verification
- data sufficiency

## Important semantic guard

There are three distances that must never be conflated:

- point crossing: `L_train`
- complete finite-object crossing from front entry to rear clear: `L_train + L_object`
- interval for which the whole train is inside/on a longer object: `L_object - L_train`, valid only when `L_object > L_train`

This distinction is a first-class generator and explanation requirement, not an editorial afterthought.

## Decision

The original 33 candidates are source-saturated enough for ownership review, but they do **not** justify 33 learner QLs. The current final merge/split candidate is **11 learner authorities**. No QL IDs should be allocated and nothing should be exposed in Question Studio until product-owner approval of this boundary.
