# TMW-CP-009 Implementation Status

**Branch:** `feat/tmw-cp009`  
**Base:** approved CP-008 merge `3c43bcccedd9e8a57f1cc1d26077e29a69763343`  
**Maturity:** English runtime-proof candidate under final approval  
**Publication:** disabled

## Implemented

- 18 need-based English QLs (`TMW-QL-157`–`TMW-QL-174`);
- exact signed reciprocal-rate engine for inlets, outlets and leaks;
- positive-inlet, mixed-fill and mixed-empty completion;
- fraction changed in a fixed interval;
- missing inlet and missing outlet/leak reconstruction;
- identical-pipe count;
- physical capacity, flow, time and flow-unit conversion;
- partial initial level and final level;
- tank-capacity comparison;
- reduced efficiency and blockage percentage;
- net direction and time-window boundary feasibility;
- valid-state-first deterministic generation;
- independent invariant verification;
- bounded misconception-labelled four-option packages;
- realistic exam-style stems and four-tier learner explanations;
- reciprocal-rate standard method plus positive-inlet LCM shortcut;
- canonical MathJax rendering for every fractional time;
- 54-row mathematically distinct review export;
- focused proof and structural/editorial audit.

## Validation contract

- 18 QLs × 50 seeds = 900 deterministic runtime cases;
- 18 QLs × 12 seeds = 216 structural/editorial cases;
- 54 review rows with three distinct mathematical states per QL;
- all four answer positions required;
- invalid packages, option uniqueness failures and CP-010 ownership leaks must remain zero;
- ambiguous target or initial-state failures must remain zero;
- malformed MathJax and unbalanced delimiters must remain zero;
- raw ASCII fractional-time output must remain zero across stems, options, answers, explanations and conclusions;
- every non-integer TIME answer must contain canonical inline MathJax and `\\frac`;
- standard-working brevity and repeated terminal equalities must remain zero;
- negative-command traps and learner-facing internal-ID leaks must remain zero;
- unresolved placeholders and cross-QL normalised stem collisions must remain zero.

## Editorial decisions

- literal `\\(...\\)` remains the Quant V4 generator contract;
- any future conversion to `$...$` or display-block delimiters belongs to the ExamTree presentation renderer, not to the canonical QL output;
- integer times remain plain text while fractional times use forms such as `\\(18\\frac{1}{3}\\;\\text{hours}\\)`;
- standard reciprocal-rate working and the LCM exam shortcut are both retained.

## Next gate

Run final exact-head GitHub Actions, inspect the regenerated 54-question artefact and keep PR #281 unmerged until the revised pack is approved.

## Workflow boundary

No Question Studio routing, Question Bank write, localisation, test assembly or public student delivery has been added. Every generated candidate remains `publiclyPublishable: false`.
