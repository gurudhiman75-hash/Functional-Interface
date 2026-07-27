# TMW-CP-006 Implementation Status

**Branch:** `feat/tmw-cp006`  
**Base:** approved CP-005 chapter base `2ca06ecb1b3b6521659f1a704cf452e3bd9d31c9`  
**Maturity:** English runtime-proof candidate  
**Publication:** disabled

## Implemented

- 22 current English-owned QLs (`TMW-QL-106`–`TMW-QL-127`);
- exact rational `W = N × D × H × E` equivalence engine;
- deterministic valid-state-first parameter generation;
- worker, clerk, painter, machine and production-line contexts;
- added/removed/original workforce reconstruction;
- actual-progress and deadline recovery;
- resource-hour percentages and schedule delay;
- overtime and shift-production targets;
- physical-dimension work scaling;
- resource-stock duration and absenteeism;
- batch workforce arithmetic series;
- equivalent worker-days and machine-hours;
- canonical solver plus independent invariant verification;
- misconception-labelled four-option packages;
- formula-led, contextual English explanations;
- 66-row structured review export;
- focused runtime and editorial audits.

## Proof surface

- deterministic runtime proof: 22 QLs × 50 seeds = 1,100 cases;
- structural/editorial audit: 22 QLs × 12 seeds = 264 cases;
- all four correct-answer positions required;
- integral discrete-count enforcement;
- added-versus-total workforce guard;
- MathJax and placeholder validation;
- cross-QL stem and explanation collision checks;
- dimensional-label visibility guard;
- worker-day/machine-hour unit guard;
- stock-conclusion rejection;
- English-only runtime enforcement.

## Workflow boundary

No Question Studio route, Question Bank write, test assembly, localisation or public student delivery has been added. Every generated candidate remains `publiclyPublishable: false`.

## Current gate

Keep PR #226 in draft until the exact-head workflow passes and the generated 66-question review pack receives user approval.
