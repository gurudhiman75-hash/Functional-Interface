# TSD-CP-001 Source and Exam-Pattern Saturation Audit

**Checkpoint:** `TSD-CP-001 — Uniform Motion, Units and Proportionality`  
**Status:** source-saturation pass complete; edge audit remains open  
**Permanent QLs:** 0  
**Frozen solve modes:** 0  
**Publication:** disabled

## 1. Sources reviewed

The audit used the project's uploaded quantitative aptitude references, including:

- SSC-oriented mathematics guides and solved-question collections;
- quantitative aptitude notes covering direct distance-speed-time and unit conversion;
- RS Aggarwal-style solved examples and previous-exam questions;
- Arun Sharma's Time, Speed and Distance theory and proportionality treatment;
- the approved ExamTree TSD blueprint and ownership boundaries.

The runtime implements recurring mathematical and presentation patterns. It does not copy source questions.

## 2. Source patterns confirmed

### Direct motion

- metres with seconds;
- kilometres with hours;
- km/h converted before a metre/second calculation;
- decimal or fractional speed and distance;
- fractional minutes;
- minutes plus seconds;
- hours plus minutes.

### Mixed units

- metres and minutes, answer in km/h;
- metres and minutes-plus-seconds, answer in km/h;
- kilometres and hours-plus-minutes, answer in m/min;
- mixed outputs in km/h, m/s and m/min;
- standard `m/s × 18/5` learner working where appropriate.

### Proportionality

- at the same speed, distance is directly proportional to time;
- at the same speed, time is directly proportional to distance;
- for the same distance, speed is inversely proportional to time.

### Comparison and ratio

- distance ratio for equal time;
- speed ratio for equal time;
- inverse time ratio for equal distance;
- distance, speed and time ratios from two supplied component ratios.

### Representation

Equivalent-speed option sets using km/h, m/s and m/min were found. They retain the same unit-conversion mathematics.

Decision: keep this as a cross-cutting representation candidate. Do not create a new permanent authority solely for option-combination wording during this pass.

## 3. Executed runtime decisions

### Restored learner authorities

1. `distanceByProportion`
   - known distance and time;
   - new time;
   - same speed explicit;
   - derived speed hidden.

2. `timeByProportion`
   - known distance and time;
   - new distance;
   - same speed explicit;
   - derived speed hidden.

3. `speedByProportion`
   - known speed and time;
   - new time;
   - same distance explicit;
   - unnecessary distance value hidden.

### Added as state coverage

- compound minutes-and-seconds duration;
- compound hours-and-minutes duration;
- decimal kilometres converted to metres;
- km/h supplied for a direct SI calculation;
- fractional minute duration;
- decimal speed;
- requested mixed-unit speed in km/h, m/s and m/min.

These remain state variants because the answer target and governing equation do not change.

### Retained as internal QA

- `classifyUniformMotionState`;
- `verifyUniformMotionClaim`.

They remain part of solver/verifier proof but are excluded from learner review.

## 4. Ownership decisions

Not CP-001 gaps:

- average speed and segmented journeys → CP-002 or shared Average authority;
- rests, stoppages and early/late arrival → CP-003;
- meeting and pursuit → CP-004;
- circular tracks → CP-006;
- trains → CP-007 and CP-008;
- boats and streams → CP-009;
- races → CP-010;
- staged walking-riding journeys → CP-002 or CP-003 according to the governing inference.

## 5. Executable evidence

The dedicated source-saturation proof requires:

- 23 learner-facing authorities;
- two internal QA authorities;
- 69 learner-review rows;
- generated minutes-plus-seconds states;
- generated hours-plus-minutes states;
- decimal or fractional states;
- direct km/h-to-SI composition;
- decimal-kilometre direct states;
- mixed outputs in km/h, m/s and m/min;
- the standard m/s-to-km/h route;
- non-redundant same-speed and same-distance proportionality stems.

The hosted review was manually inspected after generation. Corrections made from that inspection include:

- simple exam-style direct speed and time options;
- ordinary fractions instead of mixed-number notation;
- removal of repeated conversion lines;
- standard m/s-to-km/h working instead of formal fractional-hour working;
- simple proportionality distractors without awkward mixed values.

## 6. Current boundary

- provisional mathematical authorities: 25;
- learner-facing authorities: 23;
- internal QA authorities: 2;
- review examples per learner authority: 3;
- learner-review rows: 69;
- permanent QLs: 0;
- frozen solve modes: 0.

These remain provisional discovery counts, not a freeze.

## 7. Remaining CP-001 audit work

1. noon, midnight and next-day clock-boundary saturation;
2. direct answer-unit audit beyond current SI and mixed-speed states;
3. final equivalent-speed representation decision;
4. final merge/split audit of the 23 learner authorities;
5. manual English approval;
6. permanent IDs only after explicit approval.
