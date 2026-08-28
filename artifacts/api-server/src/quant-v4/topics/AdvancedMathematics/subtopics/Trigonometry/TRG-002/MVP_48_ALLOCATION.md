# TRG-002 48-QL MVP Allocation

Status: **MVP permanent-ID selection locked — implementation in progress**

The Phase-0 ledger remains authoritative. The MVP uses exactly 12 permanent QLs from each CP: the existing 5 proof anchors plus 7 additional permanent roles per CP.

## TRG-CP-007 — 12 QLs

Existing proof: `001, 007, 012, 015, 023`

Add for MVP: `002, 005, 009, 014, 018, 020, 024`

Coverage after expansion:
- height from elevation: 001,002,005
- distance from elevation: 007,009
- clean angle recovery: 012,014
- height from depression: 015,018
- distance from depression: 020
- reverse/combined single observation: 023,024

## TRG-CP-008 — 12 QLs

Existing proof: `025, 030, 033, 036, 045`

Add for MVP: `028, 032, 035, 038, 041, 043, 048`

Coverage after expansion:
- shadow to height: 025,028
- height to shadow: 030,032
- changed shadow: 033,035
- ladder: 036,038
- broken tree/pole: **041,043**
- guy wire/mast: 045,048

Broken-object geometry is mandatory at this checkpoint; it may not be substituted with another ladder/wire role.

## TRG-CP-009 — 12 QLs

Existing proof: `049, 056, 061, 065, 068`

Add for MVP: `052, 055, 058, 064, 067, 069, 071`

Coverage after expansion:
- same-side systems: 049,052,055
- move closer: 056,058
- move farther: 061,064
- original distance: 065,067
- movement/separation: 068,069
- controlled comparative/two-object form: **071**

## TRG-CP-010 — 12 QLs

Existing proof: `073, 078, 083, 088, 092`

Add for MVP: `076, 081, 086, 091, 094, 095, 096`

Coverage after expansion:
- observer/eye-height correction: 073,076
- opposite-side observations: 078,081
- building-to-building: 083,086
- elevation + depression: 088,091
- river/horizontal separation: 092,094
- composite vertical-object relations: **095,096**

Composite vertical-object geometry is mandatory at this checkpoint and must use the same canonical-state/solution-diagram authority as the rest of TRG-002.

## MVP totals

- CP007: 12
- CP008: 12
- CP009: 12
- CP010: 12
- total: **48 permanent English QLs**

## Architecture locks

Every added QL must preserve:
- Phase-0 locked family/range;
- exact standard-angle mathematics;
- canonical spatial state before prose;
- independent requested-target reconstruction;
- four mathematically unique options;
- misconception-driven distractors;
- solution diagram REQUIRED;
- stem diagram OPTIONAL and never automatic;
- diagram disclosure AFTER_ATTEMPT;
- inactive Question Studio/Test Builder/public status.

The 20 proof QLs remain unchanged permanent anchors. The MVP layer extends them; it does not renumber or replace them.
