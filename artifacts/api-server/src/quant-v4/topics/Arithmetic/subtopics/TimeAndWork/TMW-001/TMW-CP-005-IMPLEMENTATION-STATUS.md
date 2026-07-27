# TMW-CP-005 Implementation Status

**Branch:** `feat/tmw-cp005`  
**Base:** merged CP-004 chapter base `700d1d9cc585ae4151b41267fb3b25658c5a2aee`  
**Maturity:** English runtime-proof candidate under post-review exact-head validation  
**Publication:** disabled

## Implemented

- 24 current human-owned QLs (`TMW-QL-082`–`TMW-QL-105`);
- exact repeating-cycle and final-turn engine;
- arbitrary starting phase;
- zero-rate rest segments;
- signed destructive segments;
- inverse unknown rate/time reconstruction;
- exact-boundary and within-segment completion;
- periodic physical-output schedules;
- deterministic parameter generation;
- canonical solver plus independent verification;
- misconception-labelled four-option packages;
- inline MathJax explanations;
- 72-row review export;
- focused proof and structural/editorial audit scripts.

## Original exact-head evidence

- runtime proof: 24 QLs × 50 seeds = 1,200 cases — PASS;
- all four correct-answer positions represented;
- 283 distinct rendered stems;
- invalid packages: 0;
- unresolved placeholders: 0;
- duplicate options: 0;
- localisation rejected;
- candidate publication remains disabled.

## Post-review corrections

- fixed incorrect `3th` ordinal output through a general ordinal formatter;
- simplified all first explanation points;
- expanded completion explanations with actual cycle substitution, full-cycle work, remaining work and final-turn derivation;
- expanded inverse explanations with known duration, known work, remaining work and recovered rate;
- added dedicated exact-boundary working without a false partial-turn step;
- added explicit final-block fraction working;
- improved named-worker wording in three-agent and arbitrary-start stems;
- added regression checks for ordinal grammar, explanation jargon and missing derivation steps.

## Workflow boundary

No Question Studio route, Question Bank write, test assembly integration, student delivery or localisation has been added. Every generated candidate remains `publiclyPublishable: false`.

The 72 review rows are deterministic samples used to audit the generator; they are not themselves approved Question Bank records.

## Current gate

Pass exact-head GitHub Actions and inspect the regenerated 72-row evidence under the strengthened audit. After that, CP-005 may be merged into the isolated TMW chapter base. Question Bank ingestion remains a later chapter-integration and approval gate.
