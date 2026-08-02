# TSD-CP-001 Equivalent-Speed Representation Decision

**Checkpoint:** `TSD-CP-001 — Uniform Motion, Units and Proportionality`  
**Decision status:** `IMPLEMENTED_AND_EXECUTABLY_PROVED`  
**Permanent QLs:** 0  
**Frozen solve modes:** 0  
**Publication eligibility:** disabled

## Decision

Equivalent-speed option sets are a **representation variant** of the existing provisional authority:

- provisional authority: `TSD-CP001-DISC-004`;
- solve mode: `convertSpeedUnit`;
- governing rule: `UNIT_CONVERSION`.

They are **not** a new mathematical authority and do not create a twenty-sixth provisional solve mode.

Example:

`25 m/s = 90 km/h = 1500 m/min`

The learner task still consists of converting one physical speed between units. The only difference is the answer surface:

- scalar surface — select one converted value;
- equivalent-set surface — select one equality containing three correct unit representations.

## Merge/split rationale

A separate authority was rejected because it would duplicate all mathematical dependencies of `convertSpeedUnit`:

- the same canonical unit-conversion function;
- the same exact rational arithmetic;
- the same independent verifier route;
- the same factors `5/18`, `18/5` and `60`;
- the same misconception family.

The representation variant differs only in:

- stem wording;
- option structure;
- answer text;
- explanation emphasis.

Therefore the correct architecture is one mathematical authority with multiple learner representations.

## Runtime contract

Equivalent-set candidates use deliberate exact states rather than accidental random alignment:

1. `90 km/h = 25 m/s = 1500 m/min`;
2. `54 km/h = 15 m/s = 900 m/min`;
3. `72 km/h = 20 m/s = 1200 m/min`.

The canonical option order is:

`m/s = km/h = m/min`

The learner working must show:

1. conversion of the supplied speed to m/s;
2. `m/s × 18/5 = km/h`;
3. `m/s × 60 = m/min`;
4. the final three-unit equality.

## Review composition

The complete CP-001 review remains 69 rows across 23 learner authorities.

For `convertSpeedUnit`, the three review rows are deliberately composed as:

- two scalar speed-conversion rows;
- one equivalent-speed option-set row.

This prevents the representation variant from displacing ordinary conversion questions while ensuring it is always manually reviewed.

## Distractor contract

The equivalent-set row uses three distinct misconception families:

1. wrong km/h conversion factor;
2. multiplying the km/h number by `60` as though it were already m/s;
3. copying the same numeric value into every unit without conversion.

The mixed-scale trap must be explained explicitly:

> The km/h number was multiplied by 60 as though it were already m/s. Convert to m/s first, then multiply by 60.

Generic wording such as “units were mixed” is insufficient.

## Executable proof

`equivalent-speed-representation-proof.ts` proves:

- provisional authority count remains 25;
- learner-facing authority count remains 23;
- review row count remains 69;
- `convertSpeedUnit` review contains exactly two scalar rows and one equivalent-set row;
- every equivalent option contains m/s, km/h and m/min;
- the correct option is a three-unit equality;
- working contains both `18/5` and `× 60`;
- all four options receive value-specific analysis;
- the precise mixed-scale learner diagnosis is retained;
- 600 deterministic speed-conversion candidates contain both surfaces;
- the exact `25 m/s = 90 km/h = 1500 m/min` case is generated;
- permanent QL count remains zero.

## Safety boundary

This decision does not permit:

- permanent QL allocation;
- manual English freeze;
- Hindi or Punjabi generation;
- Question Studio routing;
- Question Bank storage;
- mock-test eligibility;
- public delivery.

## Remaining CP-001 work

1. final answer-unit and edge audit;
2. final merge/split review of the 23 learner authorities;
3. manual English approval;
4. permanent ID allocation only after explicit approval.
