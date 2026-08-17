# TMW-CP-009 — Pipes and Cisterns: Core Signed-Rate Systems
## Ownership and Solve-Contract Audit

**Branch:** `feat/tmw-cp009`  
**Base:** approved CP-008 merge `3c43bcccedd9e8a57f1cc1d26077e29a69763343`  
**Status:** implementation ownership baseline; QL count discovered through merge/split and gap audits  
**Publication:** disabled

## Canonical invariant

For simultaneously operating pipes,

\[
r_{net}=\sum r_{in}-\sum r_{out}-\sum r_{leak}.
\]

The target must be declared before interpreting the sign:

- positive net rate raises the level;
- negative net rate lowers the level;
- zero net rate leaves the level unchanged.

For physical flow,

\[
V=q_{net}t.
\]

For a partially filled tank,

\[
L_f=L_0+r_{net}t.
\]

## Ownership boundary

CP-009 owns simultaneous inlets, outlets and leaks whose active set does not change during the stated interval. It does not own:

- delayed opening, closing or repair events, owned by CP-010;
- alternating or periodic pipe schedules, owned by CP-010;
- arbitrary non-uniform flow sequences, owned by CP-011;
- generic worker-rate questions with no tank/flow semantics, owned by CP-001/002;
- hydraulic pressure or physical-fluid-mechanics modelling.

## Blueprint merge and split decisions

The blueprint listed 28 candidate modes. They are not 28 permanent QLs.

- two, three and many positive inlets merge into one positive-inlet completion contract;
- one or many inlets plus one or many outlets merge by target direction into mixed-fill and mixed-empty contracts;
- “all pipes together” is covered by those simultaneous completion contracts;
- fraction filled and fraction emptied in a fixed interval share one signed level-change contract;
- missing-inlet questions merge regardless of the number of known pipes;
- missing outlet, leak, one pipe from a combined result, and normal-versus-leaky completion facts merge into one missing-negative-component contract;
- inlet-time and outlet-time inverse recovery remain separate because the unknown sign and distractor equations differ;
- tank capacity, physical flow, physical time and flow-unit conversion remain separate because their answer units and renderer contracts differ;
- time to fill and time to empty from an initial level merge into one boundary-time contract parameterised by the target boundary;
- reduced efficiency and blockage percentage remain separate because one returns a ratio and the other a percentage loss;
- net direction and boundary feasibility remain separate because one is a sign classification and the other requires a time-window comparison.

## Retained solve contracts

1. `TMW-QL-157` — fill time from two or more positive inlets;
2. `TMW-QL-158` — fill time from simultaneous mixed pipes with net inflow;
3. `TMW-QL-159` — empty time from simultaneous mixed pipes with net outflow;
4. `TMW-QL-160` — net fraction filled or emptied in a stated duration;
5. `TMW-QL-161` — missing inlet solo time from a signed combined result;
6. `TMW-QL-162` — missing outlet or leak solo time from a signed combined result;
7. `TMW-QL-163` — number of identical inlet pipes for a target time;
8. `TMW-QL-164` — tank capacity from physical flow and time;
9. `TMW-QL-165` — physical flow rate from capacity and time;
10. `TMW-QL-166` — physical completion time from capacity and net flow;
11. `TMW-QL-167` — conversion between litres per minute and litres per hour;
12. `TMW-QL-168` — time from a partial initial level to full or empty;
13. `TMW-QL-169` — final level after a fixed simultaneous-flow interval;
14. `TMW-QL-170` — ratio of two tank capacities from flow-time facts;
15. `TMW-QL-171` — reduced pipe efficiency ratio from changed filling time;
16. `TMW-QL-172` — blockage percentage from changed filling time;
17. `TMW-QL-173` — net level direction under simultaneous pipes;
18. `TMW-QL-174` — whether a full/empty boundary is reached within a time window.

## Parameter policy

- generate valid pipe solo times and signed states first;
- derive net rate, completion time, level change and missing-component facts exactly;
- keep final-level states strictly within tank boundaries;
- generate physical capacities and flow rates with exact unit-compatible arithmetic;
- require the target state—full, empty, changed fraction, final level or feasibility—to be explicit in every stem;
- never rely on an unstated convention about overflow, emptying or a pipe changing state.

## Mandatory misconception coverage

- adding pipe completion times instead of rates;
- ignoring other simultaneously open pipes;
- adding outlet/leak magnitude as inflow;
- using times directly as rates;
- ignoring the stated duration;
- ignoring the initial or remaining level;
- assigning a known pipe the wrong sign;
- reversing identical-pipe count and time;
- reversing the volume–flow–time relation;
- leaving flow units unconverted or applying 60 backwards;
- reversing a requested capacity or efficiency ratio;
- treating efficiency and filling time as directly proportional;
- reporting remaining efficiency instead of blockage loss;
- deciding direction from pipe count rather than rates;
- failing to compare boundary time with the available window.

## Safety boundary

No Question Studio route, Question Bank write path, localisation, test assembly or public student delivery is enabled. Every generated package remains `publiclyPublishable: false`.
