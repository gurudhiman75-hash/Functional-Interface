# LP-010 — Source and Saturation Audit

Status: review-only English implementation. Permanent QL allocation, localization, Question Bank admission, test eligibility and publication remain locked.

## Source coverage

| Uploaded source | Relevant evidence | LP-010 use |
|---|---|---|
| `reasoning_aggarwal.pdf` / `reasoning_aggarwal(1).pdf` | puzzle chapter pp. 241–242: Type 3 Day Based scheduling | ordered day schedules, person-to-day lookup, before/between relations and case elimination |
| `reasoning_aggarwal.pdf` / `reasoning_aggarwal(1).pdf` | Example 12 on pp. 241–242 | six people assigned to three days × two times, morning/evening anchors, immediate-before, same-time and chronological ordering |
| `reasoning_aggarwal.pdf` / `reasoning_aggarwal(1).pdf` | pp. 242–243: month, year and month/date forms | establishes LP-010 as the remaining day-and-time scheduling form after LP-008 and LP-009 |

No source wording is copied. The uploaded book is used for puzzle-family boundaries, day/time slot structure, clue families, query projections and progressive table-solving conventions.

## Implemented authority

| Field | Value |
|---|---|
| Package | `LP-010` |
| Checkpoint | `LP-CP-010` |
| Candidate QLs | `LP-QL-037`–`LP-QL-040` |
| Caselet shape | six named people × three named days × two times per day |
| Chronology | day 1 early time → day 1 later time → day 2 early time → day 2 later time → day 3 early time → day 3 later time |
| Clue families | direct slot, day-only, time-only, before, between, immediately before, same time, same day and day exclusion |
| Child queries | person-to-slot, slot-to-person, correct pair matching and immediate-next lookup |
| Difficulty | Easy five direct placements; Medium direct + partial day/time + relation + exclusion; Hard at most one direct slot with layered partial, gap, immediate, same-day/time and exclusion deductions |
| Languages | English review only |
| Runtime | `REVIEW_ONLY` |

Every child repeats all six people, all three days, both times, the six chronological slots and every clue. Explanations follow the approved LP-009 V2 contract from the start: use one exact clue at a time, state its consequence, show the surviving candidate table, then read the specific child answer from the unique final schedule.

## Boundary with earlier checkpoints

LP-002 is a four-person multi-attribute day-and-location assignment puzzle. LP-008 is month-and-date scheduling. LP-009 covers single-axis month and year scheduling. LP-010 is specifically the source-backed day-and-time schedule in which six chronological positions are formed by three days and two times per day. It does not introduce city/location objects and it does not overlap the separate Floor/Flat chapter.

## Verification obligations

- generate 100 deterministic caselets and 400 standalone child questions;
- cover all six scenario profiles and all nine clue families;
- prove exactly one hidden assignment with an independent exhaustive solver;
- prove every displayed clue is necessary;
- keep four unique options and balance correct answer positions for all four QLs;
- verify Easy/Medium/Hard differ by deduction structure rather than vocabulary or larger numbers;
- verify every child repeats the complete setup and clue list;
- verify explanations contain clue-specific progressive tables and no generic answer-only filler;
- keep the Question Studio route review-only and non-persistent.

Executable proof is `lp-010.test.ts`; Question Studio route coverage is `lp-010-question-studio.test.ts`; chapter difficulty coverage is extended in `difficulty-calibration.test.ts`.
