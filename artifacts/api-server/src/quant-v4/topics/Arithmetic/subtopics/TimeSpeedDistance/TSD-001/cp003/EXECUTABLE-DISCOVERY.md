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

Merged as one provisional authority:

- faster/slower fixed-route time gain or loss;
- direct/original/hidden distance reconstructed from two speeds and a time gap;
- original/changed/hidden speed reconstructed from a fixed-route time difference;
- late-start, unplanned-stop and repair/recovery-speed representations;
- slow/fast initial-segment remaining-speed representations;
- fixed-distance/fixed-time regular-stop total-time representations;
- walking/riding time and distance allocation representations.

These share the same hidden state, governing equation and learner operation.

## Important split decisions

Kept distinct because the answer contract or inverse problem changes materially:

- usual speed from an early/late pair vs route distance from an early/late pair;
- stop count from total delay vs delay from regular stops;
- stoppage duration vs overall speed vs running speed;
- speed-change point distance vs fraction of route at changed speed;
- start-time shift vs combined arrival shift vs schedule buffer;
- breakdown duration vs general recovery speed.

## First executable solver slice

Six high-frequency authorities are already implemented with exact rational solving and independent verification:

1. `timeGainLossFromSpeedChange`
2. `distanceFromSpeedTimeDifference`
3. `usualSpeedFromEarlyLatePair`
4. `distanceFromEarlyLatePair`
5. `requiredRecoverySpeedAfterLostTime`
6. `requiredRemainingSpeedAfterPartialRoute`

The proof suite checks known exact cases, unit contracts, impossible states and tamper rejection.

## Next executable slice

The next implementation should cover the stoppage/schedule cluster:

- stoppage duration from running and overall speed;
- overall speed including stops;
- running speed from overall speed and stops;
- stop count/delay;
- repeated travel-rest cycles;
- total time with regular stops.

After that, implement speed-change-point, departure/arrival-shift and walking/riding allocation authorities, followed by generation/editorial layers and only then merge/split freeze review.
