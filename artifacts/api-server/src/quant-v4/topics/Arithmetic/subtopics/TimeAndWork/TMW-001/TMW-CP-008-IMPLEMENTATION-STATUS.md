# TMW-CP-008 Implementation Status

**Branch:** `feat/tmw-cp008`  
**Base:** approved CP-007 merge `43e98ae182974b5abf8c8e0a57e27693dbe5e4b9`  
**Maturity:** English runtime-proof candidate  
**Publication:** disabled

## Implemented

- 13 need-based English QLs (`TMW-QL-144`–`TMW-QL-156`);
- exact contribution engine for count × efficiency × days × hours;
- fixed-pool share, inverse-pool and residual-payment solving;
- staged join/leave/handoff payment;
- explicit fraction-based payment;
- inverse efficiency/time recovery;
- mixed-category payment allocation;
- piece-rate, extra-output bonus and accepted-net-output payment;
- deterministic misconception-labelled four-option packages;
- realistic exam-style stems and four-tier learner explanations;
- 39-row mathematically distinct review export;
- focused proof and structural/editorial audit.

## Local validation

- 13 QLs × 50 seeds = 650 deterministic runtime cases — PASS;
- 13 QLs × 12 seeds = 156 structural/editorial cases — PASS;
- 39 review rows — PASS;
- all four answer positions represented;
- invalid packages: 0;
- option uniqueness failures: 0;
- non-integral money/time/efficiency answers: 0;
- currency inconsistencies: 0;
- unitless money options: 0;
- internal misconception-ID learner leaks: 0;
- malformed MathJax: 0;
- ownership leaks into partnership: 0;
- cross-QL normalised stem collisions: 0.

## Next gate

Open a draft PR, run exact-head GitHub Actions, inspect the hosted 39-question artefact and keep the PR unmerged pending user approval.
