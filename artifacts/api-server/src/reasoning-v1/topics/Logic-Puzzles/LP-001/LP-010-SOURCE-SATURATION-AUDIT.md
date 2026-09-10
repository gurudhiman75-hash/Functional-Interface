# LP-010 — Source and Saturation Audit

Status: English Question Studio review candidate. Question Studio owns the normal review and downstream workflow; LP-010 does not add a separate admission or publication pipeline.

## Source coverage

| Uploaded source | Relevant evidence | LP-010 use |
|---|---|---|
| `reasoning_aggarwal.pdf` / `reasoning_aggarwal(1).pdf` | puzzle chapter pp. 241–242: Type 3 Day Based scheduling | ordered day schedules, person-to-day lookup, before/between relations and case elimination |
| `reasoning_aggarwal.pdf` / `reasoning_aggarwal(1).pdf` | Example 12 on pp. 241–242 | six people assigned to three days × two positions per day, same-time/immediate-order relations and chronological reasoning |
| `reasoning_aggarwal.pdf` / `reasoning_aggarwal(1).pdf` | pp. 242–243: month, year and month/date forms | establishes LP-010 as the remaining day-and-time scheduling form after LP-008 and LP-009 |

No source wording is copied. The uploaded book is used for puzzle-family boundaries, day/time scheduling structure, clue families, query projections and progressive table-solving conventions.

## Implemented authority

| Field | Value |
|---|---|
| Package | `LP-010` |
| Checkpoint | `LP-CP-010` |
| Candidate QLs | `LP-QL-037`–`LP-QL-040` |
| Caselet shape | six named people × three named days × two day-time slots per day |
| Time-layout variety | controlled rotation across 2, 4, 5 and 6 unique clock times per six-slot caselet |
| Chronology | day 1 first slot → day 1 second slot → day 2 first slot → day 2 second slot → day 3 first slot → day 3 second slot |
| Clue families | direct slot, day-only, exact-time, before, between, immediately before, same time, same day and day exclusion |
| Child queries | person-to-slot, slot-to-person, correct pair matching and immediate-next lookup |
| Difficulty | Easy four direct placements + one ordering deduction; Medium direct + partial day/time + relation + exclusion; Hard at most one direct slot with layered partial, gap, immediate, same-day/time and exclusion deductions |
| Languages | English review candidate |
| Runtime | `REVIEW_ONLY` |

The clock-time model intentionally avoids a single fixed pair across the whole chapter. A deterministic 100-caselet proof contains an equal 25/25/25/25 distribution of caselets with 2, 4, 5 and 6 unique clock times. Thus some real-exam-style caselets keep a repeated morning/afternoon pair, while others use partly repeated schedules and others use five or six distinct times. Exact-time clue wording is generated from the actual listed slot times, and a same-time clue is available only when that caselet really contains repeated clock times.

Every child repeats all six people, all three days, the complete six-slot day/time domain and every clue. Wording is intentionally simple and exam-like: people are directly described as scheduled on days/times, without artificial object labels, city/centre fields or solver jargon. Explanations use one clue at a time, state the actual deduction, show a progressive candidate table, and then read the requested answer from the completed schedule.

## Boundary with earlier checkpoints

LP-002 is a four-person multi-attribute day-and-location assignment puzzle. LP-008 is month-and-date scheduling. LP-009 covers single-axis month and year scheduling. LP-010 is specifically the source-backed day-and-time schedule in which six ordered positions are formed by three days and two positions per day. It does not introduce city/location objects and it does not overlap the separate Floor/Flat chapter.

## Verification obligations

- generate 100 deterministic caselets and 400 standalone child questions;
- cover all six scenario profiles and all nine clue families;
- cover 2-, 4-, 5- and 6-unique-time layouts in controlled balance;
- prove exactly one hidden assignment with an independent exhaustive solver;
- prove every displayed clue is necessary;
- prevent one explicit clock time from dominating the clue list;
- keep four unique options and balance correct answer positions for all four QLs;
- verify Easy/Medium/Hard differ by deduction structure rather than vocabulary or larger numbers;
- verify every child repeats the complete setup and clue list;
- verify explanations contain clue-specific progressive tables and no generic answer-only or solver-count filler;
- expose the approved implementation through the shared Question Studio path rather than a separate LP-specific release workflow.

Executable proof is `lp-010.test.ts`. After English review, the package should be connected to the existing shared Logic Puzzle Question Studio adapter, which already owns generation/review lifecycle handling.
