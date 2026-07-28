# TMW-CP-011 Implementation Status

**Branch:** `feat/tmw-cp011`  
**Base:** approved CP-010 merge `b6f79c28f54bacc3e0b24b87fec45395b679540b`  
**Maturity:** English runtime-proof candidate  
**Publication:** disabled

## Implemented

- 19 need-based English QLs (`TMW-QL-193` through `TMW-QL-211`);
- arithmetic and geometric variable-rate totals, completion and inverses;
- threshold-switch total, completion, change-point, post-rate and rate-change tasks;
- varying-crew total and completion;
- combined variable-agent output;
- signed positive/negative variable output;
- explicit daily-rate table completion;
- deadline adjustment for a variable schedule;
- exact rational sequence and terminal-partial-day engine;
- independent explicit accumulation and bounded inverse verification;
- misconception-labelled four-option construction;
- teacher-style English presentation;
- 57-row distinct-state review export;
- focused proof and strengthened editorial audit.

## Local validation before PR

- 19 QLs × 50 seeds = 950 deterministic runtime cases — PASS;
- 412 distinct stems;
- all four answer positions for every QL;
- six context families;
- geometric multipliers `1/2`, `3/2` and `2`;
- arithmetic increase and decrease states;
- threshold learning and fatigue states;
- positive and negative recovered threshold changes;
- 19 QLs × 12 seeds = 228 structural/editorial cases — PASS;
- 57 review rows with three distinct mathematical states per QL — PASS;
- fractional discrete targets/options: 0;
- answer/unknown leakage into givens: 0;
- invalid packages, option failures, MathJax failures, negative trap commands, mechanical wording, internal-ID leaks and cross-QL stem collisions: 0.

## Hosted-review correction

The first hosted review artefact exposed three fractional `TMW-QL-196` distractor labels whose `\\frac` expressions were outside the canonical inline MathJax delimiters. The mathematical values and answer keys were correct, but the learner rendering was not production-safe.

The source now:

- emits every fractional daily rate-change value through literal inline MathJax `\\(...\\)`;
- applies the same formatter to correct answers and misconception-driven distractors;
- strips valid MathJax blocks and rejects any remaining raw `\\frac` in runtime validation;
- repeats that raw-fraction rejection across the structural/editorial corpus audit.

The focused correction reran the complete 950-case runtime proof and 228-case audit successfully. A new permanent exact-head workflow and hosted review artefact are required before this branch can be presented for approval.

## Current gate

Final exact-head GitHub Actions, hosted-artifact inspection and user review remain required before merge. The exact tested head, workflow and artefact digest will be recorded in PR evidence without changing the tested branch afterwards.
