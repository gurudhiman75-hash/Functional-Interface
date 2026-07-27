# TMW-CP-005 — Alternating and Periodic Work Schedules
## Ownership and Solve-Contract Audit

**Branch:** `feat/tmw-cp005`  
**Base:** merged CP-004 chapter base `700d1d9cc585ae4151b41267fb3b25658c5a2aee`  
**Status:** approved English runtime-proof ownership baseline; counts are discovered, not quotas  
**Publication:** disabled

## Ownership

CP-005 owns schedules that repeat, alternate, cycle or activate agents periodically. A one-off join, exit or handoff remains CP-004. Workforce/day/hour equivalence remains CP-006. Pipes remain CP-009/010.

The canonical cycle model is:

\[
W_{\text{cycle}}=\sum_i r_i\Delta t_i
\]

After complete cycles, every full segment before the final active segment in the last incomplete cycle must be applied before the final partial segment is solved. The runtime may not assume that the final segment or cycle is complete, and the explanation may not divide all post-cycle remaining work by the last worker's rate when earlier segments of the final cycle have already contributed work.

## Current distinct solve contracts

1. two-agent alternation starting with A;
2. two-agent alternation starting with B;
3. repeating multi-day blocks;
4. repeating three-agent cycle;
5. completion day plus terminal fraction;
6. work after full cycles;
7. remaining work after full cycles;
8. terminal worker;
9. starting worker from completion condition;
10. unknown rate from alternating completion;
11. unknown solo time from alternating completion;
12. helper active every nth day;
13. worker resting every nth day;
14. weekday/weekend or holiday pattern;
15. unequal repeating shift durations;
16. two-days-on, one-day-off pattern;
17. periodic destructive work;
18. repeated join/leave cycle;
19. full-cycle count for a target fraction;
20. completion from an arbitrary cycle phase;
21. exact-boundary completion;
22. completion within a multi-day cycle segment;
23. output under a periodic machine schedule;
24. required unknown cycle rate for a deadline.

These contracts map to `TMW-QL-082` through `TMW-QL-105`. They are not a quota.

## Mandatory invariants

- starting phase is explicit;
- zero-rate rest periods are preserved;
- destructive work uses a negative signed rate;
- unequal segment durations are multiplied by their own rates;
- exact-boundary completion adds no extra segment;
- all complete segments before the final active segment are applied first;
- final partial work is divided only by the currently active rate;
- inverse questions count the exact total duration of each cycle position;
- output schedules do not reuse whole-work fraction wording;
- all formulas and worked steps retain literal inline MathJax delimiters;
- ordinal suffixes are grammatically correct;
- explanation openings use student-facing language rather than internal solver terminology;
- no Question Studio, Question Bank, test assembly or student routing is enabled.
