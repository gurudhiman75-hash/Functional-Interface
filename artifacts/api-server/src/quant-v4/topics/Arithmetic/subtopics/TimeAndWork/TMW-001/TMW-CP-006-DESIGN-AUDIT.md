# TMW-CP-006 — Workforce, Days, Hours and Work-Quantity Equivalence
## Ownership and Solve-Contract Audit

**Branch:** `feat/tmw-cp006`  
**Base:** approved CP-005 merge `2ca06ecb1b3b6521659f1a704cf452e3bd9d31c9`  
**Status:** implementation ownership baseline; counts are discovered, not quotas  
**Publication:** disabled

## Canonical invariant

For homogeneous resources working at a constant per-resource efficiency,

\[
W=N\times D\times H\times E
\]

where `W` is work or output, `N` is the worker/machine count, `D` is the number of days or shifts, `H` is hours per day/shift and `E` is per-resource efficiency. Any omitted factor is treated as unchanged, not silently set to a new value.

## Ownership boundary

CP-006 owns homogeneous workforce or machine-count equivalence, schedule variance, work-quantity scaling and resource-time accounting. It does not own:

- direct one-agent rate/time mapping already owned by CP-001;
- simultaneous named-agent rate aggregation owned by CP-002;
- one-off joins/leaves after partial progress owned by CP-004;
- repeating alternating schedules owned by CP-005;
- heterogeneous worker or machine categories owned by CP-007;
- wage distribution owned by CP-008.

## Merge and delegation decisions

The 35 blueprint candidates are not 35 permanent QLs.

- worker-count modes with optional hours, efficiency, work quantity or machine wording merge into one resource-count contract;
- day modes with optional hours/work changes merge into one required-days contract;
- changed-hours and changed-efficiency variants remain within their corresponding unknown-variable contracts;
- new deadline after a workforce change is a required-days instance;
- machine count and worker count are context variations of homogeneous resource count;
- machine output and ordinary work quantity share one work/output contract;
- equivalent man-days and machine-hours share one equivalent-resource-time contract;
- `findWorkforceChangeAfterPartialProgress` remains in CP-004 because its governing topology is a one-off staged event.

## Current distinct contracts

1. required homogeneous resource count from two equivalent project states;
2. required days from two equivalent project states;
3. required daily hours from two equivalent project states;
4. unknown relative efficiency from equivalent project states;
5. work or output quantity from resources, days, hours and efficiency;
6. work-quantity ratio between two project states;
7. additional workers required to meet a deadline;
8. workers removable for an allowed delay;
9. original workforce reconstructed from a changed schedule;
10. remaining days inferred from actual progress;
11. extra workers inferred from planned versus actual progress;
12. percentage of work completed from resource-hours;
13. percentage schedule delay after a workforce reduction;
14. overtime hours per day required to retain a deadline;
15. number of shifts required for a production target;
16. work ratio derived from changing physical dimensions;
17. workers required after physical work dimensions change;
18. days required after physical work dimensions change;
19. resource-stock duration after a population change;
20. revised completion time after absenteeism;
21. completion time under batch workforce additions;
22. equivalent worker-days or machine-hours.

These contracts provisionally map to `TMW-QL-106` through `TMW-QL-127`. The range becomes stable only after runtime proof, source-gap review and merge/split audit.

## Mandatory invariants

- direct and inverse factors must be assigned by the equation, not by memorised arrows;
- changed work quantity must appear explicitly in the numerator or denominator;
- hours and efficiency factors may not be dropped;
- answers asking for added/removed workers must not report the final total;
- actual-progress questions must distinguish completed and remaining work;
- percentages must be converted to exact rational multipliers;
- physical dimensions contribute only through the declared work model;
- absenteeism changes the active count, not each worker's rate;
- batch additions use an arithmetic-series resource total;
- every retained QL must have an independent invariant check;
- no Question Studio, Question Bank, test assembly or student routing is enabled.
