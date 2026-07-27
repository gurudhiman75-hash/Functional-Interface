# TMW-CP-006 Implementation Status

**Branch:** `feat/tmw-cp006`  
**Base:** approved CP-005 chapter base `2ca06ecb1b3b6521659f1a704cf452e3bd9d31c9`  
**Maturity:** English runtime-proof candidate, user-reviewed and explanation-polished  
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
- modular learner explanations with key rule, givens, standard method, shortcut and actual-option trap;
- 66-row structured review export;
- focused runtime and editorial audits.

## Explanation contract

Every candidate now exposes:

1. a learner-facing key rule;
2. the governing inline-MathJax formula;
3. explicit generated givens;
4. the complete standard worked solution;
5. a solve-mode-specific exam-speed shortcut;
6. a common-trap explanation tied to an actual shuffled distractor;
7. a contextual conclusion.

The familiar MDH/W rule is generalised as `NDHE/W` for homogeneous resources. Specialised shortcuts cover worker-days, observed progress, person-days, active workforce percentage, dimensional products, production shifts, AP daily additions and equivalent resource-time.

## Proof surface

- deterministic runtime proof: 22 QLs × 50 seeds = 1,100 cases;
- structural/editorial audit: 22 QLs × 12 seeds = 264 cases;
- all four correct-answer positions required;
- integral discrete-count enforcement;
- added-versus-total workforce guard;
- MathJax and placeholder validation;
- explicit-givens and shortcut-presence guards;
- actual-option trap mapping and correct-option rejection;
- MDH/W variable-definition guard;
- person-days shortcut guard;
- AP daily-grid guard;
- AP `d` notation and contextual resource-time unit guards;
- dollar-delimiter rejection to preserve the Quant V4 `\(...\)` MathJax standard;
- cross-QL stem and explanation collision checks;
- dimensional-label visibility guard;
- worker-day/machine-hour unit guard;
- stock-conclusion rejection;
- English-only runtime enforcement.

## Review result

The user rated the 66-question set production-ready and approved its mathematical, exam-style and distractor quality. The requested explanation enhancements have been implemented and independently re-audited.

## Workflow boundary

No Question Studio route, Question Bank write, test assembly, localisation or public student delivery has been added. Every generated candidate remains `publiclyPublishable: false`.

## Current gate

Run the final exact-head workflow after documentation updates, then merge PR #226 into the isolated TMW chapter base.
