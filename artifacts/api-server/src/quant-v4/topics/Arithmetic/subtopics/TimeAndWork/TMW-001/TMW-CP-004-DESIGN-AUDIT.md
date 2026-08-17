# TMW-CP-004 — Partial Work and Staged Participation
## Ownership and Solve-Contract Audit

**Branch:** `feat/tmw-cp004`  
**Base:** merged CP-003 chapter base `a06987271066d173a774f6104e81229c28d2add9`  
**Status:** implementation ownership baseline; counts are discovered, not quotas  
**Publication:** disabled

## Ownership rule

CP-004 owns non-repeating phase sequences in which the active workers, signed rates, daily hours, efficiency, workforce size or work status changes at one or more stated events.

For phase \(j\):

\[
W_j=r_j\Delta t_j
\]

and the state ledger is:

\[
W_{remaining}=1-\sum_j W_j
\]

Only the rate active during a phase may be applied to that phase. Every event is defined at the end of one completed interval and before the next interval begins.

## Current distinct solve contracts

1. remaining work after an initial phase;
2. work completed before an event;
3. total time for a two-agent handoff;
4. total time when a team starts and one worker leaves;
5. total time when one worker starts and another joins;
6. total time with two staggered joins;
7. total time with two staggered exits;
8. total time with both a join and a leave event;
9. join time recovered from final completion;
10. leave time recovered from final completion;
11. unknown initial-phase duration;
12. unknown final-phase duration;
13. replacement worker rate;
14. replacement worker full-work time;
15. completion with an idle interval;
16. completion after a mid-project daily-hours change;
17. completion after a mid-project efficiency change;
18. completion after a destructive process activates;
19. event time at a specified completed fraction;
20. required remaining rate for a deadline;
21. workers added after partial progress;
22. workers removed after partial progress;
23. delay caused by a worker leaving;
24. time saved when a worker joins.

These are discovered task contracts, not a quota.

## Consolidation and exclusions

- repeating join/leave patterns belong to CP-005;
- pure workforce/day/hour equivalence without a partial-progress event belongs to CP-006;
- heterogeneous worker-category equivalence belongs to CP-007;
- pipes and tank-level events belong to CP-009/010;
- a single uniform rate change with no phase ledger remains in CP-001;
- simultaneous rate aggregation with no event remains in CP-002.

`findTimeAfterWorkHandoff` and `findHandoffSequenceCompletion` are represented by the two-agent handoff and multi-event stage-ledger contracts rather than wording-only duplicates. `findRequiredAdditionalAgentRateAfterDelay` is covered by replacement-rate and required-remaining-rate inverses. `findMissingAgentTimeFromStagedCompletion` is represented by the join-time, leave-time and unknown-phase-duration inverses.

## State and explanation requirements

- store every phase duration and active rate explicitly;
- preserve exact completed work between phases;
- never apply a later rate retroactively;
- signed adverse work is subtracted only after activation;
- idle time contributes elapsed time but zero work;
- workforce additions/removals ask for the change, not the final workforce, unless explicitly stated;
- explanations must show the phase ledger before the final inversion;
- all mathematical lines must retain literal `\(...\)` delimiters;
- all generated candidates remain `publiclyPublishable: false`.

## Saturation gate

CP-004 may be frozen only after deterministic proof, independent phase-equation verification, option-contract audits, event-boundary audits, exact-head CI, multi-seed editorial review and user approval of the generated-question pack.
