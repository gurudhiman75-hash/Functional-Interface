# MEN-CP-011 — Phase 2B Unit and Representation Coverage

## Status

```text
Checkpoint:                 MEN-CP-011
Phase:                      PHASE-2B
Measurement authority:      MEN-CP011-PHASE2B-UNIT-REPRESENTATION-V1
Physical-state authority:   MEN-CP011-PHASE2A-STATE-POOL-V1
Permanent QLs:              0
Question Studio:            disabled
Question Bank:              NOT_STORED
Test eligibility:           INELIGIBLE
Public publication:         false
```

Phase 2B expands the four already-approved hollow-pipe representations across common and mixed unit systems. It does not add new surface-area, open-container, joined-solid or shell families.

## Measurement profiles

Every generated question selects one of four explicit profiles:

```text
RADIAL_CM_LENGTH_CM_TO_CM3
  radial dimensions: cm
  pipe length:       cm
  volume answer:     cm³

RADIAL_M_LENGTH_M_TO_M3
  radial dimensions: m
  pipe length:       m
  volume answer:     m³

RADIAL_CM_LENGTH_M_TO_CM3
  radial dimensions: cm
  pipe length:       m
  calculation unit:  cm
  volume answer:     cm³
  conversion factor: h × 100

RADIAL_M_LENGTH_CM_TO_CM3
  radial dimensions: m
  pipe length:       cm
  calculation unit:  cm
  volume answer:     cm³
  conversion factor: radial area × 100² = × 10,000
```

For inverse-radius questions, the answer remains in the stated radial unit. Thus the final profile may calculate in centimetres and convert the recovered radius back to metres.

## Representation matrix

The existing reasoning representations remain unchanged:

- outer and inner radii;
- outer and inner diameters;
- outer radius and wall thickness;
- inverse inner radius from material volume.

The 48-record review gate requires every representation to appear exactly three times in every measurement profile:

```text
4 representations × 4 profiles × 3 records = 48 records
```

This closes unit-representation coverage without falsely creating new QLs for presentation-only changes.

## Exact conversion authority

All dimensions are converted to one calculation unit before applying:

```text
V = πh(R² − r²)
```

Required invariants:

- metre-to-centimetre length conversion uses ×100;
- radial metre-to-centimetre conversion is applied before squaring;
- radial area conversion therefore uses ×10,000;
- volume options remain exact under the declared π policy;
- inverse questions reconstruct a positive physical radius and return it in the requested unit;
- diagram, stem, options, worked solution and verifier use the same profile.

## Unit-specific misconceptions

Mixed-unit direct-volume questions include one exact unit trap:

```text
[OMITTED_MIXED_LENGTH_CONVERSION]
[USED_LINEAR_UNIT_CONVERSION_FOR_AREA]
```

The first omits the ×100 conversion of a metre length when radii are in centimetres. The second applies only one linear factor of 100 to metre-based radial measurements instead of the squared area factor 10,000.

## Review proof

The Phase 2B batch retains all Phase 2A requirements:

- 48 unique physical states;
- no exact duplicate stems;
- no exact duplicate stem-option packages;
- normalized stem repetition no greater than three;
- A/B/C/D totals of 12 each;
- four distinct prototype answer-position sequences;
- approved prompt-safe and solution-specific diagrams;
- separated learner and admin surfaces;
- lifecycle locks.

It adds:

- 12 records from every measurement profile;
- 24 mixed-unit records;
- three records for every representation/profile cell;
- explicit conversion steps in both admin and learner explanations;
- unit-aware distractor and trap-code alignment.

## Closed blocker

After the Phase 2B proof, the following blocker is removed:

```text
UNIT_REPRESENTATION_COVERAGE_INCOMPLETE
```

## Remaining blockers

```text
CHAPTER_COVERAGE_INCOMPLETE
PERMANENT_QLS_UNALLOCATED
MANUAL_ENGLISH_REVIEW_PENDING
```

The next phase must add missing CP-011 reasoning families such as curved-area exposure, annular ends, open containers, hollow cubes/cuboids and shells. Permanent QLs remain prohibited until chapter-wide coverage and manual English review are complete.
