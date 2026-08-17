# TMW-CP-006 Implementation Status

**Branch:** `feat/tmw-cp006`  
**Base:** approved CP-005 chapter base `2ca06ecb1b3b6521659f1a704cf452e3bd9d31c9`  
**Final reviewed head:** `51c3559ba7118cbdb240fb0a5ebb15a8a923d609`  
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

## Final exact-head proof

Workflow `30281245182` passed on final head `51c3559ba7118cbdb240fb0a5ebb15a8a923d609`.

- deterministic runtime proof: 22 QLs × 50 seeds = 1,100 cases — PASS;
- structural/editorial audit: 22 QLs × 12 seeds = 264 cases — PASS;
- review export: 66 rows — PASS;
- all four correct-answer positions represented;
- integral discrete-count enforcement — PASS;
- added-versus-total workforce guard — PASS;
- explicit-givens and shortcut-presence guards — PASS;
- actual-option trap mapping and correct-option rejection — PASS;
- MDH/W variable-definition guard — PASS;
- person-days shortcut guard — PASS;
- AP daily-grid guard — PASS;
- AP `d` notation and contextual resource-time unit guards — PASS;
- dollar-delimiter rejection preserving `\(...\)` — PASS;
- cross-QL stem and explanation collision checks — PASS;
- exact-head CP-001, CP-002, CP-003 and CP-005 regressions — PASS.

Evidence artifact:

- artifact ID: `8658897465`;
- digest: `sha256:e45ba125fda4984fdbfa750b04a291b0094786bd4b96fb427bbb05dc61e7ee77`.

## Review result

The user rated the 66-question set production-ready and approved its mathematical, exam-style and distractor quality. The requested explanation enhancements have been implemented and independently re-audited.

## Workflow boundary

No Question Studio route, Question Bank write, test assembly, localisation or public student delivery has been added. Every generated candidate remains `publiclyPublishable: false`.

## Final gate

Approved for merge into the isolated TMW chapter base.
