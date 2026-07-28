# TMW-CP-010 — Staged, Cyclic and Level-Based Pipe Operations
## Ownership and Solve-Contract Audit

**Branch:** `feat/tmw-cp010`  
**Base:** approved CP-009 merge `54b200820c0d352744bb0d56ab02c4530dcc4cc5`  
**Status:** English runtime-proof ownership baseline; counts discovered through merge/split and gap audits  
**Publication:** disabled

## Canonical state model

CP-010 extends the CP-009 signed-flow foundation. During one stage, the active set is fixed and

\[
L_{j+1}=L_j+r_j\Delta t_j.
\]

For a finite event schedule,

\[
L_f=L_0+\sum_j r_j\Delta t_j.
\]

For a repeating schedule,

\[
\Delta L_{cycle}=\sum_j r_j\Delta t_j,
\]

followed by exact segment-by-segment replay of the terminal cycle. Every generated level and every intermediate fixed-stage level must remain in the physical interval \([0,1]\).

## Ownership boundary

CP-010 owns pipe activity that changes because of time, a discrete event, a repeating schedule, an arbitrary cycle phase, a level threshold or an automatic controller. It excludes:

- one unchanged simultaneous pipe set, owned by CP-009;
- non-constant arithmetic/geometric or day-by-day productivity sequences, owned by CP-011;
- fluid pressure, pipe diameter and hydraulic-mechanics models;
- hidden stochastic failures or schedules that are not finite and deterministic.

## Blueprint consolidation

The blueprint listed 28 candidates. They reduce to 18 materially distinct QLs:

- delayed outlet, inlet or leak activation merges into one delayed-activation ledger;
- delayed closure and leak repair merge into one delayed-deactivation ledger;
- staggered openings and closings merge into one multi-event schedule contract;
- interrupted operation remains separate because idle time changes elapsed time but not level;
- partial initial level plus schedule remains separate from an empty/full start;
- final level remains separate because the answer is a state, not completion time;
- threshold switching and automatic upper/lower control remain separate topologies;
- opening-time and closing-time inverses merge into one event-time reconstruction contract;
- final-stage rate, physical tank capacity and deadline adjustment remain separate inverse answer contracts;
- alternating, general periodic and arbitrary-start cycles remain separate because cycle extraction differs;
- complete-cycle count, terminal segment and exact first boundary time remain separate answer semantics.

## Retained QLs

1. `TMW-QL-175` — completion after delayed activation;
2. `TMW-QL-176` — completion after delayed deactivation or repair;
3. `TMW-QL-177` — completion with multiple staggered events;
4. `TMW-QL-178` — interrupted-flow completion including idle time;
5. `TMW-QL-179` — partial initial level with staged operation;
6. `TMW-QL-180` — final level after a complete staged schedule;
7. `TMW-QL-181` — completion after a level-threshold switch;
8. `TMW-QL-182` — event time reconstructed from final completion;
9. `TMW-QL-183` — required final-stage net rate;
10. `TMW-QL-184` — physical capacity from staged litre flows;
11. `TMW-QL-185` — alternating-pipe completion;
12. `TMW-QL-186` — periodic multi-segment completion;
13. `TMW-QL-187` — automatic lower/upper level-control completion;
14. `TMW-QL-188` — repeating-cycle completion from an arbitrary starting phase;
15. `TMW-QL-189` — complete cycles before the terminal cycle;
16. `TMW-QL-190` — terminal active segment;
17. `TMW-QL-191` — exact first full/empty event time under a cycle;
18. `TMW-QL-192` — schedule-change adjustment required for a deadline.

## Required generation and verification policy

- generate exact valid schedules first;
- declare initial level, target boundary and starting cycle phase explicitly;
- use event-ledger solving plus materially separate exact timeline replay;
- stop at the first boundary crossing, including a fractional terminal segment;
- distinguish cycles completed before the terminal cycle from the terminal cycle itself;
- cap routine cycle-count answers at ten in the English review corpus;
- require directional deadline answers such as “2 hours earlier” or “3 hours later”;
- keep all non-integer times in canonical inline MathJax;
- reject semantic duplicate options for exact segment-end completion.

## Safety boundary

No Question Studio route, Question Bank write path, localisation, test assembly or public student delivery is enabled. Every generated package remains `publiclyPublishable: false`.
