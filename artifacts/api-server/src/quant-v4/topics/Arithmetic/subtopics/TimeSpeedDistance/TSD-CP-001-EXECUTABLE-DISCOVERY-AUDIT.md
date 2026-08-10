# TSD-CP-001 — Executable Discovery and Merge/Split Audit

**Checkpoint:** `TSD-CP-001 — Uniform Motion, Units and Proportionality`  
**Package:** `TSD-001`  
**Audit date:** 31 July 2026  
**Status:** `PROVISIONAL_EXECUTABLE_DISCOVERY`  
**Source candidates:** 32  
**Provisional authorities after first merge/split pass:** 25  
**Permanent QLs:** 0  
**Frozen solve modes:** 0  
**Question Studio / Question Bank / tests / publication:** disabled

## 1. Decision

The 32 blueprint entries are not treated as 32 Question Languages. The first mathematical and answer-contract audit retains 25 provisional authorities.

A candidate is merged when it differs only by numeric form, fractionality, source/target unit direction or a special state of the same proportional equation. It remains separate when the requested semantic, answer kind, evidence topology, inverse direction or misconception map changes materially.

The provisional IDs `TSD-CP001-DISC-*` are discovery handles only. They must never be exposed as permanent `TSD-QL-*` IDs.

## 2. Merge decisions

### 2.1 Fractional values are state coverage, not new authorities

- `findDistanceWithFractionalDuration` merges into `distanceFromSpeedAndTime`.
- `findDurationWithFractionalDistance` merges into `timeFromDistanceAndSpeed`.

The hidden equation and requested semantic are unchanged. Fractional and mixed-number answers remain mandatory edge coverage for the retained authorities.

### 2.2 Speed conversion is one bidirectional authority

The following merge into `convertSpeedUnit`:

- `convertKmphToMps`;
- `convertMpsToKmph`;
- `convertCompoundSpeedUnit`.

Conversion direction and source/target unit are generated state. The learner still performs one dimensional speed conversion.

Distance-unit and time-unit conversion remain separate because their answer dimensions and common errors differ.

### 2.3 Mixed-unit reconstruction remains separate

`findSpeedInRequestedUnit` becomes `speedFromMixedUnits` rather than merging into direct speed.

It requires the learner to normalize distance and time dimensions before applying the speed relation, so its evidence topology and distractor map differ from a same-unit direct speed question.

### 2.4 Comparative ratios and actual-value proportions remain separate

The three ratio-answer authorities remain distinct:

- distance ratio from speed and time ratios;
- speed ratio from distance and time ratios;
- time ratio from distance and speed ratios.

The three actual-value proportional reconstruction authorities also remain distinct:

- distance by proportion;
- time by proportion;
- speed by proportion.

The following candidate variants merge into those actual-value authorities:

- same-distance time after a speed change → `timeByProportion`;
- speed from a same-distance time change → `speedByProportion`;
- uniform speed from equivalent trips → `speedByProportion`.

Answer kind and inverse direction distinguish the three retained authorities.

### 2.5 Clock-time targets remain separate

Arrival, departure and elapsed-time-across-boundary remain three authorities because they have different target directions and boundary traps:

- addition and day rollover;
- inverse subtraction and previous-day rollover;
- elapsed duration across midnight.

### 2.6 Pace remains a reciprocal motion representation

The following remain separate:

- speed from pace;
- pace from speed;
- distance from pace and duration.

Pace is not merely a display unit: it reverses the rate relation and has a distinct misconception map.

### 2.7 Non-numeric reasoning remains separate

- state classification remains a classification-answer authority;
- claim verification remains a boolean/statement authority.

They are not wording variants of direct numeric reconstruction.

## 3. Provisional authority inventory

| Discovery ID | Solve mode | Answer kind | Source candidates |
|---|---|---|---|
| DISC-001 | distance from speed and time | distance | direct distance; fractional duration |
| DISC-002 | speed from distance and time | speed | direct speed |
| DISC-003 | time from distance and speed | time | direct time; fractional distance |
| DISC-004 | speed-unit conversion | speed | km/h↔m/s and compound speed units |
| DISC-005 | distance-unit conversion | distance | distance conversion |
| DISC-006 | time-unit conversion | time | time conversion |
| DISC-007 | speed from mixed units | speed | requested-unit speed reconstruction |
| DISC-008 | arrival clock time | clock time | arrival target |
| DISC-009 | departure clock time | clock time | departure target |
| DISC-010 | elapsed clock time | time | clock-boundary duration |
| DISC-011 | distances at equal time | ratio | equal-time distance comparison |
| DISC-012 | times at equal distance | ratio | equal-distance time comparison |
| DISC-013 | speeds at equal time | ratio | equal-time speed comparison |
| DISC-014 | distance ratio | ratio | speed-ratio × time-ratio |
| DISC-015 | speed ratio | ratio | distance-ratio ÷ time-ratio |
| DISC-016 | time ratio | ratio | distance-ratio ÷ speed-ratio |
| DISC-017 | distance by proportion | distance | unknown distance |
| DISC-018 | time by proportion | time | unknown time; same-distance speed change |
| DISC-019 | speed by proportion | speed | unknown speed; time change; equivalent trips |
| DISC-020 | speed from pace | speed | pace reciprocal |
| DISC-021 | pace from speed | pace | inverse pace target |
| DISC-022 | distance from pace and time | distance | pace-led journey |
| DISC-023 | required speed for deadline | speed | departure/deadline window |
| DISC-024 | classify uniform-motion state | classification | unique/consistent/indeterminate/impossible |
| DISC-025 | verify uniform-motion claim | boolean | exact claim verification |

## 4. Executable result

The provisional registry permanently checks that:

- all 32 blueprint candidates are recognized;
- every source candidate is dispositioned exactly once;
- all 25 provisional IDs are unique;
- all 25 solve modes are unique;
- no `TSD-QL-*` ID is allocated;
- every authority remains `PROVISIONAL` and non-publishable.

The initial canonical solver proof exercises every provisional authority with exact rational values. It covers direct and inverse motion, unit normalization, midnight rollover, comparisons, ratios, actual-value proportions, pace, deadline speed, state classification and claim verification. A materially separate verifier checks dimensional equality, identity reconstruction and cross-products for all 25 routes and rejects a deliberately tampered canonical answer.

## 5. Still required before QL freeze

This audit does not prove saturation. Each provisional authority must still pass:

1. source-backed state-family expansion;
2. valid-state-first deterministic parameter generation;
3. materially independent equation or reconstruction verification;
4. misconception-labelled option generation and admissibility;
5. all four answer positions;
6. edge and boundary coverage;
7. stem, context and explanation diversity;
8. cross-authority collision audit;
9. three-state-per-authority human review;
10. explicit merge/split reconsideration after generated evidence.

Only after those gates may provisional authorities receive permanent contiguous `TSD-QL-*` IDs.
