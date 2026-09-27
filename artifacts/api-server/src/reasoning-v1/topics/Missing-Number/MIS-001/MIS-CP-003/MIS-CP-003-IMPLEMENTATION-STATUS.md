# MIS-CP-003 Implementation Status

Status: **EXECUTABLE PROTOTYPE / ENGLISH REVIEW CANDIDATE**

## Blueprint scope implemented

CP003 covers square, cube and small power relationships with controlled mental arithmetic:

| Candidate | Provisional semantic family |
|---|---|
| MIS-CAND-016 | square a single input |
| MIS-CAND-017 | a² + b |
| MIS-CAND-018 | a² − b |
| MIS-CAND-019 | a² + b² |
| MIS-CAND-020 | a² − b² |
| MIS-CAND-021 | ab + a² |
| MIS-CAND-022 | ab + b² |
| MIS-CAND-023 | cube a single input |
| MIS-CAND-024 | (a ± b)² with controlled positive difference |
| MIS-CAND-025 | (a ± b)³ with controlled positive difference |

The final two are provisional interpretations of the blueprint's broader small perfect-square and perfect-cube relationship families. Source saturation may merge, split or replace them before permanent QL allocation.

## Design choices

- Basic a² / b² variants are normalized into one unary square authority rather than displaying an irrelevant second number.
- Basic cube questions are unary for the same reason.
- Compound power families use both displayed inputs.
- Results are positive integers no greater than 999.
- Input ranges are intentionally small enough for Reasoning-style mental calculation.
- Negative, decimal and unwieldy outputs are rejected.
- Difference contexts require a positive meaningful base.
- Two evidence groups are preferred; a third is added only if ambiguity remains.

## Validation

The CP003 audit targets:

~~~text
10 candidates × 80 deterministic seeds = 800 generated questions
~~~

It verifies:

- deterministic replay;
- independent solver agreement;
- exactly one surviving normalized CP003 semantic rule;
- unary/binary arity integrity;
- plus/minus context coverage for structured square/cube families;
- four unique options;
- exactly one correct answer;
- misconception-grounded distractors;
- numeric diversity;
- balanced answer positions;
- Easy and Medium coverage;
- friendly step-by-step explanations.

## Explanation standard

Learner-facing explanations follow the approved style:

1. say that the same rule is used in every row;
2. describe the rule in simple words;
3. work through Row 1;
4. confirm the same rule on the next row;
5. apply it to the row containing ?;
6. finish with `So, ? = ...`.

Compound square/cube calculations show intermediate arithmetic instead of compressing everything into one formula.

## Question Studio

MIS-001 now exposes CP001, CP002 and CP003 through one review-only package.

Current state:

- provisional candidates across CP001-CP003: 25;
- permanent QLs: 0;
- source saturation: incomplete;
- merge/split audit: incomplete;
- localization: not started;
- Question Bank writes: blocked;
- mock/test/public release: blocked.

## Next checkpoint

After English review approval, continue to **MIS-CP-004 — Consecutive and structured-number relationships**.
