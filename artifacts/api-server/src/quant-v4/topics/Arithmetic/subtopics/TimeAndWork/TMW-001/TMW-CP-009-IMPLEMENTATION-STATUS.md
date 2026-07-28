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

## Final exact-head validation

Final head: `66988906a15a2a2e12b5a7cc5c00dec4ec3b42da`

- 18 QLs × 50 seeds = 900 deterministic runtime cases — PASS;
- 338 distinct rendered stems;
- 18 QLs × 12 seeds = 216 structural/editorial cases — PASS;
- 54 review rows — PASS;
- three distinct mathematical states per QL;
- all four answer positions represented;
- invalid packages: 0;
- option uniqueness failures: 0;
- staged/cyclic CP-010 ownership leaks: 0;
- ambiguous target or initial-state failures: 0;
- malformed or unbalanced MathJax: 0;
- ASCII fractional-time outputs: 0;
- fractional-time MathJax occurrences in the hosted review corpus: 41;
- standard-working brevity failures: 0;
- repeated terminal equalities: 0;
- negative-command trap failures: 0;
- internal misconception-ID learner leaks: 0;
- unresolved placeholders: 0;
- cross-QL normalised stem collisions: 0.

Evidence artifact:

- workflow: `30338613958`;
- artifact ID: `8680132518`;
- digest: `sha256:904891a83a5a44cb768c9cf12ff68cc6a1fa2f235a4910e1d789aa4b59c8bf37`.

## Editorial decisions

- literal `\(...\)` remains the Quant V4 generator contract;
- any future conversion to `$...$` or display-block delimiters belongs to the ExamTree presentation renderer, not to canonical QL output;
- integer times remain plain text while fractional times use forms such as `\(18\frac{1}{3}\;\text{hours}\)`;
- standard reciprocal-rate working and the LCM exam shortcut are both retained.

## Next gate

PR #281 remains draft and unmerged until the regenerated 54-question fractional-time pack is approved.

## Workflow boundary

No Question Studio routing, Question Bank write, localisation, test assembly or public student delivery has been added. Every generated candidate remains `publiclyPublishable: false`.
