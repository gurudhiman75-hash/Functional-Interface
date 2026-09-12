# LP-009 — Source and Saturation Audit

Status: **English editorial review approved V2; `LP-QL-033`–`LP-QL-036` permanently allocated and English frozen V1. Runtime remains review-only. Localization, Question Bank admission, test eligibility and publication remain locked.**

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
| Permanent QLs | `LP-QL-033`–`LP-QL-036` |
| English freeze | `LP_009_ENGLISH_FREEZE_V1` |
| Caselet shape | six named entities × six ordered months, or six named persons × six ordered years |
| Month forms | birth month, interview month, course starting month and review-meeting month |
| Year forms | same-date/month birth-year records with oldest-to-youngest ordering |
| Clue families | direct value, before, between, adjacent, exclusion and second-position (year form) |
| Difficulty | Easy direct completion; Medium mixed direct/order/exclusion chain; Hard limited direct anchors with layered order, adjacency, exclusion and year-position deductions |
| Languages | English frozen review surface only |
| Runtime | `REVIEW_ONLY` |

Every rendered child repeats the complete entity list, all six values and every clue in a natural exam-style setup. Year-based setups explicitly state that the years are ordered and that no age calculation is required.

## Permanent QL allocation and English freeze V1 — 2026-09-10

The approved English review surface is now bound to four permanent solve authorities:

| Permanent QL | Authority |
|---|---|
| `LP-QL-033` | `VALUE_TO_ENTITY_LOOKUP` |
| `LP-QL-034` | `ENTITY_TO_VALUE_LOOKUP` |
| `LP-QL-035` | `ORDERED_PAIR_MATCH` |
| `LP-QL-036` | `ORDERED_POSITION_ENTITY_LOOKUP` |

The merge/split rationale, lifecycle locks and freeze contract are recorded in `LP-009-PERMANENT-QL-ALLOCATION-AND-ENGLISH-FREEZE-V1.md`. Month/year contexts remain parameters inside these authorities rather than separate permanent identities. The next available LP identity after this allocation is `LP-QL-037`.

`lp-009-permanent-freeze.ts` is the executable allocation authority and `lp-009-permanent-freeze.test.ts` is the freeze regression guard.

## English editorial approval V2 — 2026-09-09

Human review approved the learner-facing LP-009 explanation style after the generic-answer issue was remediated. The accepted contract is recorded in `LP-009-ENGLISH-EDITORIAL-APPROVAL-V2.md` and is inherited unchanged by English Freeze V1.

Explanations must permanently retain the following behavior on the English review surface:

- enter direct values first;
- apply each remaining clue explicitly rather than saying only to "use the clues";
- state the concrete effect of the clue on the named entities;
- show the progressively narrowed candidate table after each meaningful deduction;
- complete the unique schedule only after the deduction chain is visible;
- answer the specific child query from the relevant completed row or rows.

`lp-009-explanation-quality-v2.test.ts` remains a regression guard for this approved editorial requirement.

## Boundary with earlier checkpoints

LP-007 is the variable/preference assignment authority. LP-008 is the month-and-date authority with four months and two dates per month. LP-009 covers the two remaining source-backed single-axis scheduling forms: month-based and year-based schedules. It does not add day/date pairs, cities, centres or local place names.

## Freeze verification obligations

- generate 100 deterministic caselets and 400 child questions;
- cover all eight scenario templates, both calendar modes and all six clue families;
- prove one hidden assignment with an independent exhaustive solver;
- prove every displayed clue is necessary through the existing saturation proof;
- keep four unique options and balance the correct answer position `25 / 25 / 25 / 25` for every permanent QL;
- verify every child is standalone and repeats the full setup and clue list;
- verify month wording uses the listed calendar order and year wording does not require arithmetic;
- retain clue-by-clue progressive explanations under the approved V2 contract;
- keep the Question Studio route review-only and non-persistent;
- keep localization, Question Bank, test/mock and publication gates closed.

The executable source proof is `lp-009.test.ts`; English freeze coverage is in `lp-009-permanent-freeze.test.ts`; explanation-quality coverage is in `lp-009-explanation-quality-v2.test.ts`; route and lifecycle coverage is in `lp-009-question-studio.test.ts`; difficulty structure is checked by `difficulty-calibration.test.ts`.

## Lifecycle boundary

Permanent allocation does not make LP-009 a production-delivery package. The current boundary is:

```text
permanent QLs:                 LP-QL-033..036
English freeze:                FROZEN V1
Question Studio:               REVIEW_ONLY
Hindi/Punjabi localization:    NOT_STARTED
Question Bank:                 NOT_STORED
test eligibility:              INELIGIBLE
mock-test eligibility:         false
public publication:            false
automatic student publication: false
```
