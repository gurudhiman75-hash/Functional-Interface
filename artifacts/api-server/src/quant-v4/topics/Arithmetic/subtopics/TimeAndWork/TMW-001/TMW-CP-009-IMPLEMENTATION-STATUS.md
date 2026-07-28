# TMW-CP-009 Implementation Status

**Branch:** `feat/tmw-cp009`  
**Base:** approved CP-008 merge `3c43bcccedd9e8a57f1cc1d26077e29a69763343`  
**Maturity:** English runtime-proof candidate  
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
- 54-row mathematically distinct review export;
- focused proof and structural/editorial audit.

## Local validation

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
- malformed MathJax: 0;
- standard-working brevity failures: 0;
- negative-command trap failures: 0;
- internal misconception-ID learner leaks: 0;
- unresolved placeholders: 0;
- cross-QL normalised stem collisions: 0.

## Next gate

Open a draft PR, run exact-head GitHub Actions, inspect the hosted 54-question artefact and keep the PR unmerged pending user approval.

## Workflow boundary

No Question Studio routing, Question Bank write, localisation, test assembly or public student delivery has been added. Every generated candidate remains `publiclyPublishable: false`.
