# LP-009 — Source and Saturation Audit

Status: review-only English implementation. Permanent QL allocation, localization, Question Bank admission, test eligibility and publication remain locked.

## Source coverage

| Uploaded source | Relevant evidence | LP-009 use |
|---|---|---|
| `reasoning_aggarwal.pdf` / `reasoning_aggarwal(1).pdf` | pp. 240–241: logical-puzzle method and scheduling-puzzle family | one-to-one ordered schedules, definite entries first, elimination through secondary statements and table-led deduction |
| `reasoning_aggarwal.pdf` / `reasoning_aggarwal(1).pdf` | pp. 241–242: Type 3 scheduling puzzles, especially Month Based Example 13 | six named persons, six named months, before/between relations, exclusions and case-based ordering |
| `reasoning_aggarwal.pdf` / `reasoning_aggarwal(1).pdf` | pp. 242–243: Year Based Examples 14–15 | distinct ordered birth years, older/younger interpretation, adjacent/between restrictions and second-oldest position lookup |
| `reasoning_aggarwal.pdf` / `reasoning_aggarwal(1).pdf` | p. 243: Month-and-Date boundary already represented by LP-008 | keeps LP-009 on the single-axis month and year forms rather than duplicating the two-date calendar authority |

No source wording is copied. The uploaded book is used for puzzle-family boundaries, question-stem projections, clue variety and the progressive table explanation style.

## Implemented authority

| Field | Value |
|---|---|
| Package | `LP-009` |
| Checkpoint | `LP-CP-009` |
| Candidate QLs | `LP-QL-033`–`LP-QL-036` |
| Caselet shape | six named entities × six ordered months, or six named persons × six ordered years |
| Month forms | birth month, interview month, course starting month and review-meeting month |
| Year forms | same-date/month birth-year records with oldest-to-youngest ordering |
| Clue families | direct value, before, between, adjacent, exclusion and second-position (year form) |
| Difficulty | Easy direct completion; Medium mixed direct/order/exclusion chain; Hard limited direct anchors with layered order, adjacency, exclusion and year-position deductions |
| Languages | English review only |
| Runtime | `REVIEW_ONLY` |

Every rendered child repeats the complete entity list, all six values and every clue in a natural exam-style setup. Year-based setups explicitly state that the years are ordered and that no age calculation is required. Explanations enter direct values first, apply each remaining clue in turn, show the shrinking candidate table and then complete the unique schedule.

## Boundary with earlier checkpoints

LP-007 is the variable/preference assignment authority. LP-008 is the month-and-date authority with four months and two dates per month. LP-009 covers the two remaining source-backed single-axis scheduling forms: month-based and year-based schedules. It does not add day/date pairs, cities, centres or local place names.

## Verification obligations

- generate 100 deterministic caselets and 400 child questions;
- cover all eight scenario templates, both calendar modes and all six clue families;
- prove one hidden assignment with an independent exhaustive solver;
- prove every displayed clue is necessary;
- keep four unique options and balance the correct answer position for every QL;
- verify every child is standalone and repeats the full setup and clue list;
- verify month wording uses the listed calendar order and year wording does not require arithmetic;
- keep the Question Studio route review-only and non-persistent.

The executable proof is `lp-009.test.ts`; route and lifecycle coverage is in `lp-009-question-studio.test.ts`; difficulty structure is checked by `difficulty-calibration.test.ts`.
