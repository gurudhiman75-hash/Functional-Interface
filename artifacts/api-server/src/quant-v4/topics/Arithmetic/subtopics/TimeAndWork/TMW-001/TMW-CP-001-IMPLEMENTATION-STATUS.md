# TMW-CP-001 Implementation Status

**Branch:** `feat/tmw-cp001`  
**Base:** TMW-001 design commit `962abc89cfc482f1ece079c0b45f39e76b40abb3`  
**Maturity:** initial English runtime-proof slice  
**Publication:** disabled

## Implemented

- exact reduced rational arithmetic;
- typed `TMW-001` / `TMW-CP-001` contracts;
- deterministic SHA-256-backed parameter selection;
- 12 initial human-owned QL contracts (`TMW-QL-001`–`TMW-QL-012`);
- direct work–rate–time and reciprocal-rate solving;
- independent equation-based verification;
- formula-led English explanations;
- four-option construction;
- mathematical fingerprints;
- non-publishable generation packages;
- deterministic proof script covering 12 QLs × 20 seeds = 240 cases.

## Current solve contracts

1. work from rate and time;
2. rate from work and time;
3. time from work and rate;
4. one-day work from completion time;
5. completion time from one-day work;
6. completed fraction after a given time;
7. completed percentage after a given time;
8. time for a target fraction;
9. time for a target percentage;
10. remaining fraction after a given time;
11. remaining percentage after a given time;
12. physical output from unit rate and time.

These are the first implementation slice, not the final CP inventory or a quota. CP-001 remains open for the remaining design-baseline modes and source-backed gap discovery.

## Required before CP-001 saturation

- execute TypeScript compile and the dedicated proof script in CI/local checkout;
- correct any compile/runtime defects found by execution;
- implement the remaining CP-001 ownership modes;
- replace generic option perturbations with solve-mode-specific misconception builders;
- expand context diversity and exam-language review;
- add structured review export;
- run exact/normalised stem and explanation duplicate audits;
- add formula/MathJax audit;
- perform source gap audit;
- freeze English only after human review.

## Safety

- no generation-engine routing;
- no Question Studio exposure;
- no Question Bank write path;
- no test assembly integration;
- Hindi and Punjabi intentionally rejected at runtime;
- every generated candidate is `publiclyPublishable: false`.
