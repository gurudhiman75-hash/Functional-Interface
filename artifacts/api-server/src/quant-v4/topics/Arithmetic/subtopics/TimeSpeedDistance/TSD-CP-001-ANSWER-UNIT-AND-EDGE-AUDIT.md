# TSD-CP-001 Answer-Unit and Edge Audit

**Checkpoint:** `TSD-CP-001 — Uniform Motion, Units and Proportionality`  
**Decision:** `NATURAL_UNIT_EDGES_WITHOUT_NEW_AUTHORITIES`  
**Permanent QLs:** 0  
**Frozen solve modes:** 0  
**Publication eligibility:** disabled

## Purpose

This audit examined whether the provisional English runtime represented the natural answer-unit forms already supported by the canonical solver, without manufacturing artificial variants merely to increase unit counts.

The review boundary remains:

- 32 original source candidates;
- 25 provisional mathematical authorities;
- 23 learner-facing modes;
- two internal QA modes;
- 69 learner-facing review rows;
- three rows per learner authority.

No new mathematical authority was created.

## Governing decision

A new authority is justified only when the learner must perform a materially different mathematical task. Merely requesting an answer in another natural unit is a representation state inside the existing authority.

Therefore:

- natural non-canonical outputs were added where they occur in ordinary exam questions;
- canonical direct-formula surfaces were retained where additional output units would only duplicate the existing conversion authorities;
- clock-deadline speed remains in km/h because that is the natural road-travel and clock context;
- answer-unit coverage is now deterministic in the review exporter rather than dependent on random seed alignment.

## Natural unit edges added

### Mixed-unit speed

`speedFromMixedUnits` now exports exactly one review row in each of:

- km/h;
- m/s;
- m/min.

The learner must convert distance and time into the units that naturally produce the requested speed unit before dividing.

### Speed from pace

`speedFromPace` now exports:

- two minutes-per-kilometre to km/h rows;
- one seconds-per-kilometre to m/s row.

The m/s route explicitly teaches:

`Speed = 1000 metres ÷ seconds taken for one kilometre`

It does not reuse the `60 ÷ minutes per kilometre` shortcut.

### Pace from speed

`paceFromSpeed` now exports:

- two km/h to minutes/km rows;
- one m/s to seconds/km row.

The seconds/km route explicitly teaches:

`Seconds per kilometre = 1000 metres ÷ speed in m/s`

Its distractors diagnose copying the speed number, multiplying instead of dividing, and using 60 instead of the 1000 metres in one kilometre.

### Distance from pace and time

`distanceFromPaceAndTime` now exports:

- two kilometre-answer rows;
- one metre-answer row.

The metre route first finds distance in kilometres and then visibly applies:

`kilometres × 1000 = metres`

A dedicated distractor preserves the correct kilometre number but attaches the metre label without conversion. Its learner explanation explicitly states that the kilometre result must be multiplied by 1000.

### Distance conversion scale

The three `convertDistanceUnit` review rows deliberately cover:

- kilometre scale;
- metre-centimetre scale;
- millimetre scale.

### Time conversion scale

The three `convertTimeUnit` review rows deliberately cover:

- hour-minute scale;
- second-hour scale;
- minute-day scale.

## Canonical surfaces deliberately retained

The following direct-formula authorities retain their canonical answer surfaces:

- `distanceFromSpeedAndTime` → metres;
- `speedFromDistanceAndTime` → m/s;
- `timeFromDistanceAndSpeed` → seconds.

This is intentional. The chapter already has dedicated unit-conversion and mixed-unit authorities. Creating direct-distance-in-km, direct-time-in-hours and similar rows here would duplicate the same mathematics rather than reveal a missing learner task.

`requiredUniformSpeedForDeadline` remains in km/h because road distance in kilometres combined with clock times naturally produces km/h. An m/s deadline variant would be artificial at this checkpoint.

## Unit-aware options and explanations

The old generic pace distractor path assumed minutes/km and kilometre outputs. It was replaced with a dedicated unit-aware option package.

The learner-facing explanations now distinguish:

- seconds/km from minutes/km;
- m/s from km/h;
- kilometres from metres;
- a missing output conversion from a reversed division;
- using 60 when the relevant one-kilometre distance is 1000 metres.

The final option-refinement layer preserves these dedicated pace distractors rather than replacing them with generic scalar offsets.

## Executable proof

`answer-unit-edge-proof.ts` verifies:

- authority count remains 25;
- learner-mode count remains 23;
- review count remains 69;
- exact review quotas for all six audited unit families;
- km/h, m/s and m/min mixed-speed coverage;
- seconds/km to m/s working with `1000 ÷ seconds`;
- m/s to seconds/km working with `1000 ÷ speed`;
- kilometre-to-metre output conversion with `× 1000`;
- explicit omitted-output-conversion distractor and diagnosis;
- day-scale and millimetre-scale conversion rows;
- canonical direct-formula answer surfaces remain unchanged;
- deadline answers remain km/h;
- no duplicated unit nouns such as `km/h kilometres`;
- four unique options and an aligned answer key for every review row.

The general runtime proof continues to exercise 25 authorities across 60 seeds each, for 1,500 deterministic candidates.

## Lifecycle boundary

This audit does not approve publication.

The chapter remains:

- `UNREVIEWED`;
- `NOT_STORED` in Question Bank;
- `INELIGIBLE` for tests;
- not publicly publishable;
- without permanent `TSD-QL-*` identifiers.

## Remaining before permanent IDs

1. complete the final merge/split review of the 23 learner authorities;
2. complete manual English approval;
3. allocate permanent IDs only after explicit approval.
