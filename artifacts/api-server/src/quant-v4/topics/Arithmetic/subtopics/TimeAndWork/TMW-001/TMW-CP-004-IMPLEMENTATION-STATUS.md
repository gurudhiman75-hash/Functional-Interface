# TMW-CP-004 Implementation Status

**Branch:** `feat/tmw-cp004`  
**Base:** merged CP-003 chapter base `a06987271066d173a774f6104e81229c28d2add9`  
**Maturity:** local runtime-proof candidate awaiting exact-head CI  
**Publication:** disabled

## Implemented

- 24 current human-owned QLs (`TMW-QL-058`–`TMW-QL-081`);
- exact phase-ledger arithmetic;
- non-repeating joins, exits, handoffs and idle intervals;
- inverse join/leave and phase-duration reconstruction;
- daily-hours and efficiency changes after partial progress;
- later activation of a destructive rate;
- deadline-rate and post-progress workforce inverses;
- delay and early-completion comparisons;
- valid-state-first deterministic parameter generation;
- canonical solver plus independent phase-equation verification;
- formula-led explanations with inline MathJax delimiters;
- misconception-labelled four-option packages;
- mathematical fingerprints;
- 72-row review export;
- focused runtime proof and structural/editorial audit scripts.

## Local evidence

- runtime proof: 24 QLs × 50 seeds = 1,200 cases — PASS;
- structural/editorial audit: 24 QLs × 12 seeds = 288 cases — PASS;
- all correct-answer positions represented;
- 285 distinct rendered stems;
- invalid packages, unresolved placeholders, malformed/unwrapped math, option failures, control characters and cross-QL collisions: 0.

## Workflow boundary

The runtime generates candidate questions only. It has no Question Studio exposure, Question Bank write path, test assembly integration, student delivery path or localisation. Hindi and Punjabi are intentionally rejected and every candidate remains `publiclyPublishable: false`.

```text
runtime → Question Studio candidate → automated and human approval
→ Question Bank → test assembly → student test
```

## Current gate

Run exact-head GitHub Actions, inspect the uploaded evidence and obtain user approval of the generated-question review pack before merging CP-004 into the isolated TMW chapter base.

## CI synchronization

PR #201 is open. This branch synchronization commit was issued so the newly added focused CP-004 workflow can be discovered and run against the exact feature head.
