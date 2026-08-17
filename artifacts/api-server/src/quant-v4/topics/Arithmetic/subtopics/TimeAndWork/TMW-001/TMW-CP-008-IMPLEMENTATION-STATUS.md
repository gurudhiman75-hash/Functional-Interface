# TMW-CP-008 Implementation Status

**Branch:** `feat/tmw-cp008`  
**Base:** approved CP-007 merge `43e98ae182974b5abf8c8e0a57e27693dbe5e4b9`  
**Maturity:** English runtime-proof candidate under final review  
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
- Indian Rupee formatting with Indian comma grouping;
- deterministic misconception-labelled four-option packages;
- realistic exam-style stems and complete learner explanations;
- expanded substitution and arithmetic steps for every solve contract;
- diagnostic option-specific common-trap prose;
- 39-row mathematically distinct review export;
- focused proof and structural/editorial audit.

## Validation contract

- 13 QLs × 50 seeds = 650 deterministic runtime cases;
- 13 QLs × 12 seeds = 156 structural/editorial cases;
- 39 review rows with three distinct mathematical states per QL;
- all four answer positions required;
- invalid packages, option uniqueness failures and non-integral discrete answers must remain zero;
- currency mismatches, unitless money options and incorrect Indian grouping must remain zero;
- explanations must contain at least three standard-working lines;
- “Do not choose Option X” trap commands are rejected;
- learner-facing internal misconception-ID leaks are rejected;
- malformed MathJax, partnership ownership leaks and cross-QL stem collisions are rejected.

## Next gate

Run exact-head GitHub Actions, inspect the regenerated 39-question artefact and keep PR #258 unmerged pending approval of the revised pack.
