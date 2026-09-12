# LP-007 — Source and Saturation Audit

Status: review-only English implementation. Permanent QL allocation, localization, Question Bank admission, test eligibility and publication remain locked.

## Source coverage

| Uploaded source | Relevant evidence | LP-007 use |
|---|---|---|
| `reasoning_aggarwal.pdf` / `reasoning_aggarwal(1).pdf` | pp. 243–244: Type 4 Variable Puzzle; five people, one different variable each, direct and either/or statements, negative preference and a completed solution table | one-to-one variable assignment, direct/either-or/exclusion clue families, four projections from one solved caselet |
| `reasoning_aggarwal.pdf` / `reasoning_aggarwal(1).pdf` | pp. 240–241: logical-puzzle method—record definite information, narrow possibilities and complete the table | direct-entry, candidate-narrowing and completion stages in every explanation |

The variable puzzle is kept separate from LP-006's day/study-area/city synthesis. LP-002 and LP-006 already cover day-based scheduling; LP-007 covers the source's distinct variable/preference family.

## Implemented authority

| Field | Value |
|---|---|
| Package | `LP-007` |
| Checkpoint | `LP-CP-007` |
| Candidate QLs | `LP-QL-025`–`LP-QL-028` |
| Caselet shape | five named people × five named choices |
| Clue families | direct person-choice, either/or choice, exclusion |
| Difficulty | Easy direct completion; Medium mixed narrowing; Hard one direct anchor with layered either/or and exclusions |
| Languages | English review only |
| Runtime | `REVIEW_ONLY` |

Every rendered child repeats the complete people list, complete choice list and all clues in a natural exam-style paragraph. No machine-style `People:` or `Values:` blocks are emitted. Explanations show the direct table, a narrowed candidate table, and the completed one-to-one table where the difficulty requires it.

## Verification obligations

- generate 100 deterministic caselets and 400 child questions;
- cover all six scenario templates and all three clue families;
- prove one hidden assignment with an independent exhaustive solver;
- prove every displayed clue is necessary;
- keep four unique options and balance the correct answer position;
- verify all children are standalone and repeat the full setup and clue list;
- keep the Question Studio route review-only and non-persistent.

The executable proof is `lp-007.test.ts`; difficulty structure is checked by `difficulty-calibration.test.ts`.
