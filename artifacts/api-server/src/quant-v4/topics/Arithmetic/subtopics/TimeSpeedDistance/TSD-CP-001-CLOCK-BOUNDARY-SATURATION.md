# TSD-CP-001 Clock-Boundary Saturation

## Status

`PROVISIONAL_ENGLISH_CLOCK_BOUNDARY_REVIEW_READY`

This audit records the learner-facing clock coverage added to the provisional English runtime for `TSD-CP-001`.

It does **not** allocate permanent QL IDs, freeze solve modes, enable Question Studio or Question Bank writes, or make any question test-eligible or publicly publishable.

## Authority decision

No new solve mode was created.

The following are representation and edge states inside the existing clock authorities:

- `arrivalClockTime`;
- `departureClockTime`;
- `elapsedClockTime`.

The three learner tasks remain mathematically distinct, but noon, midnight and next-day rollover do not create separate authorities.

## Saturated review states

Each clock authority exports exactly three mathematically distinct review states:

1. **Exact noon**
   - departure: `10:45 AM`;
   - duration: `75 minutes`;
   - arrival: `12:00 PM`;
   - teaching point: `12:00 PM` is noon, not midnight.

2. **Exact midnight**
   - departure: `10:30 PM`;
   - duration: `90 minutes`;
   - arrival: `12:00 AM next day`;
   - teaching point: midnight is `12:00 AM` and changes the calendar day.

3. **Later next-day arrival**
   - departure: `11:20 PM`;
   - duration: `185 minutes`;
   - arrival: `2:25 AM next day`;
   - teaching point: split the interval at midnight and preserve the `next day` label.

This produces nine clock review rows in total: three states for each of the three authorities.

## Learner-working contract

### Arrival time

The explanation must:

1. state that the clock moves forward;
2. split the duration into complete hours and remaining minutes;
3. show the intermediate clock time after adding the hours;
4. add the remaining minutes;
5. explain the noon, midnight or next-day boundary;
6. state the final arrival time with the correct AM/PM and day label.

### Departure time

The explanation must:

1. state that the clock moves backward from arrival;
2. split the duration into complete hours and remaining minutes;
3. show the intermediate clock time after subtracting the hours;
4. subtract the remaining minutes;
5. explain movement backward through noon or midnight;
6. state the correct departure time and calendar day.

### Elapsed time

The explanation must:

1. count the complete chronological interval rather than compare clock numerals;
2. split next-day journeys at `12:00 AM`;
3. show the time before midnight;
4. show the time after midnight, or explicitly state that it is zero for an exact-midnight arrival;
5. add the two parts;
6. interpret the total in minutes and, where useful, hours and minutes.

## Option-quality contract

Arrival and departure questions use three meaningful wrong paths:

- copying the given clock time without calculating;
- applying the opposite operation;
- keeping the correct-looking clock digits but assigning the wrong AM/PM or calendar day.

Elapsed-time questions use:

- leaving out one hour;
- counting one extra hour;
- adding an extra 30 minutes that do not occur in the interval.

Every wrong option is explained using its displayed value. Generic `ARITHMETIC_OFFSET`, `DIVISION_ERROR` or unexplained rollover labels are forbidden from the learner-facing clock review.

## CI hardening discovered during this phase

The workflow now uses `set -o pipefail` before piping proof output through `tee`. A failing Node proof can no longer be hidden by a successful logging process.

The fail-fast audit also corrected earlier internal-runtime issues:

- classification/boolean answer text is aligned with the keyed option;
- arithmetic assertions apply only to calculational authorities;
- conversion distractor diversity remains explicit;
- exact-midnight elapsed questions always receive four distinct options.

These corrections do not change the 23 learner / 2 internal authority boundary.

## Exact proof boundary

The clock-boundary proof requires:

- clock authorities: `3`;
- clock review rows: `9`;
- exact-noon rows: `3`;
- exact-midnight rows: `3`;
- later-next-day rows: `3`;
- boundary-faithful arrival/departure traps: `6`;
- explicit extra-30-minute elapsed traps: `3`;
- minimum boundary explanation depth: `9` learner-facing lines per row;
- permanent QLs: `0`.

## Hosted-artifact audit

The exact-head 69-row review artifact was inspected directly.

Clock-specific results:

- clock rows: `9`;
- valid clock rows: `9`;
- noon states: `3`;
- midnight states: `3`;
- later-next-day states: `3`;
- duplicate options: `0`;
- answer-key mismatches: `0`;
- ambiguous noon/midnight wording: `0`;
- missing next-day labels: `0`;
- generic division-error wording on elapsed clocks: `0`;
- internal-mode leakage: `0`.

## Remaining CP-001 work

1. equivalent-speed representation decision;
2. final answer-unit and edge audit;
3. final merge/split review of the 23 learner authorities;
4. manual English approval;
5. permanent QL allocation only after approval.