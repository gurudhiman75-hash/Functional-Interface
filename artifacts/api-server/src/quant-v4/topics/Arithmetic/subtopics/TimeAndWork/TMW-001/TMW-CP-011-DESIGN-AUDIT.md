# TMW-CP-011 — Variable and Non-Uniform Productivity
## Ownership and Solve-Contract Audit

**Branch:** `feat/tmw-cp011`  
**Base:** approved CP-010 merge `b6f79c28f54bacc3e0b24b87fec45395b679540b`  
**Publication:** disabled

## Ownership

CP-011 owns productivity that changes according to an explicitly defined non-constant rule: arithmetic progression, geometric progression, one-time threshold switch, displayed day-wise schedule, changing crew size, combined variable sequences or signed variable output.

It does not own:

- constant rates, owned by CP-001/002;
- one fixed join/leave event in ordinary work, owned by CP-005;
- fixed staged or cyclic pipe schedules, owned by CP-010;
- wage allocation, owned by CP-008;
- unbounded continuous growth, calculus models or exotic recurrences.

## Discovery result

The blueprint listed 24 candidate solve modes. They were not treated as 24 QLs. The first executable wave produced 16 passing contracts, but a manual gap audit found three missing answer/extraction authorities. The final need-based inventory is 19 QLs:

1. `TMW-QL-193` — total output from arithmetic daily rates;
2. `TMW-QL-194` — exact completion time from arithmetic daily rates;
3. `TMW-QL-195` — first-day output from an arithmetic total;
4. `TMW-QL-196` — arithmetic daily increase/decrease from a total;
5. `TMW-QL-197` — total output from geometric daily rates;
6. `TMW-QL-198` — exact completion time from geometric daily rates;
7. `TMW-QL-199` — first-day output from a geometric total;
8. `TMW-QL-200` — geometric multiplier from a total;
9. `TMW-QL-201` — exact completion time after one threshold rate switch;
10. `TMW-QL-202` — unknown threshold/change day;
11. `TMW-QL-203` — unknown post-threshold rate;
12. `TMW-QL-204` — total output with varying crew count by day;
13. `TMW-QL-205` — combined output of two variable-rate agents;
14. `TMW-QL-206` — signed net output from positive and negative variable sequences;
15. `TMW-QL-207` — exact completion time from an explicit daily-rate table;
16. `TMW-QL-208` — equal daily adjustment required for a variable-schedule deadline;
17. `TMW-QL-209` — total output after one threshold rate switch;
18. `TMW-QL-210` — exact completion time with varying crew count by day;
19. `TMW-QL-211` — increase/decrease in rate after a threshold switch.

## Merge and split decisions

- fixed daily increase and fixed daily decrease are arithmetic-sequence parameters, not separate QLs;
- fixed percentage increase and decrease are geometric-multiplier parameters;
- cumulative output after a stated number of days merges into the direct total contract for the relevant sequence family;
- terminal partial day merges into each completion-time authority;
- fatigue, learning, machine breakdown and one-time piecewise wording share the threshold-switch engine;
- new post-switch rate and change in rate remain separate because their answer semantics and distractors differ;
- varying crew total and varying crew completion remain separate because completion requires per-day extraction plus a terminal fraction;
- explicit rate-table completion remains separate from crew completion because its extraction path omits worker-rate multiplication;
- combined-agent and signed-net totals remain separate because omission and sign misconceptions differ.

## Canonical mathematics

Arithmetic daily rates:

\[
r_d=a+(d-1)c,
\qquad
S_n=\frac{n}{2}[2a+(n-1)c].
\]

Geometric daily rates:

\[
r_d=aq^{d-1},
\qquad
S_n=a(1+q+\cdots+q^{n-1}).
\]

Threshold switch:

\[
S=r_1t_s+r_2(n-t_s).
\]

Terminal partial day:

\[
T=k+\frac{W-S_k}{r_{k+1}}.
\]

Changing crew:

\[
S=\sum_d N_d r.
\]

Signed variable output:

\[
S_{net}=S_{positive}-S_{negative}.
\]

## Exactness and verifier policy

- all rates, totals, multipliers and terminal fractions use reduced rational arithmetic;
- canonical formulas are checked by explicit day-by-day accumulation;
- inverse arithmetic parameters are checked by bounded enumeration;
- geometric multiplier recovery is checked against a declared finite multiplier domain;
- threshold day recovery requires exactly one admissible integer day;
- every completion target is integral in its discrete context;
- all count/output options are integral;
- all generated daily rates remain positive where required;
- every completion question reaches the target during, not after, the declared terminal day.

## Safety boundary

No Question Studio route, Question Bank write path, localisation, test assembly or public delivery is enabled. Every package remains `publiclyPublishable: false`.
