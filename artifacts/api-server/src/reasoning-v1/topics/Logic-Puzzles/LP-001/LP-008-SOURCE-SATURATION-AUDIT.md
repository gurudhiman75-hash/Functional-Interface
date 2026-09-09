# LP-008 — Source and Saturation Audit

Status: review-only English implementation. Permanent QL allocation, localization, Question Bank admission, test eligibility and publication remain locked.

## Source coverage

| Uploaded source | Relevant evidence | LP-008 use |
|---|---|---|
| `reasoning_aggarwal.pdf` / `reasoning_aggarwal(1).pdf` | pp. 240–242: logical-puzzle method and the month/date scheduling family | one-to-one calendar slots, chronological relations and table-led deduction |
| `reasoning_aggarwal.pdf` / `reasoning_aggarwal(1).pdf` | pp. 242–243: Type 3 month-and-date puzzle convention | four months with two dates per month, date/month lookups, same-month and same-date links, before/between relations and exclusions |
| `reasoning_aggarwal.pdf` / `reasoning_aggarwal(1).pdf` | pp. 243–244: Type 4 variable puzzle boundary | confirms that variable/preference assignments belong to LP-007, while LP-008 remains a calendar schedule authority |

No source wording is copied. The uploaded book is used for puzzle-family conventions, question-stem projections and table-based explanation style.

## Implemented authority

| Field | Value |
|---|---|
| Package | `LP-008` |
| Checkpoint | `LP-CP-008` |
| Candidate QLs | `LP-QL-029`–`LP-QL-032` |
| Caselet shape | eight named people × four named months × two dates per month |
| Clue families | direct date/month, same month, same date, before, between and month exclusion |
| Difficulty | Easy direct completion; Medium mixed narrowing; Hard limited direct anchors with relational and exclusion deductions |
| Languages | English review only |
| Runtime | `REVIEW_ONLY` |

Every rendered child repeats the complete people list, all eight dates and every clue in a natural exam-style setup. Explanations enter direct assignments first, then apply the remaining clues and show progressively narrowed candidate tables before the final row lookup.

## Boundary with earlier checkpoints

LP-006 is the advanced four-person day/study-area/city synthesis. LP-007 is the five-person variable/preference assignment. LP-008 is a separate month-and-date calendar family from the uploaded source: it tests date/month mapping and calendar relations without adding city, centre or local-place objects.

## Verification obligations

- generate 100 deterministic caselets and 400 child questions;
- cover all six scenario templates and all six clue families;
- prove one hidden assignment with an independent exhaustive solver;
- prove every displayed clue is necessary;
- keep four unique options and balance the correct answer position;
- verify all children are standalone and repeat the full setup and clue list;
- keep the Question Studio route review-only and non-persistent.

The executable proof is `lp-008.test.ts`; route and lifecycle coverage is in `lp-008-question-studio.test.ts`; difficulty structure is checked by `difficulty-calibration.test.ts`.
