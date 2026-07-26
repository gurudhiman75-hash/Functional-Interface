# TMW-CP-001 Design and Ownership Audit

**Checkpoint:** `TMW-CP-001 — Fundamental Work–Rate–Time Mapping`  
**Status:** current English ownership discovery complete; implementation remains non-publishable  
**Date:** 26 July 2026

## Ownership decision

CP-001 owns single-rate and uniform-group questions with no independent-agent combination and no schedule transition. The governing state is one uniform rate acting over one duration, with direct, inverse, part–whole, comparison, conversion or uniform-rate-change recovery.

## Accepted solve contracts

1. work from rate and time;
2. rate from work and time;
3. time from work and rate;
4. one-unit work from completion time;
5. completion time from one-unit work;
6. completed fraction after a stated time;
7. completed percentage after a stated time;
8. time for a target fraction;
9. time for a target percentage;
10. remaining fraction after a stated time;
11. remaining percentage after a stated time;
12. physical output from unit rate and time;
13. whole work from a known part and its fraction;
14. whole completion time from a part-completion fact;
15. equivalent output across time-unit blocks;
16. work difference at equal time;
17. time difference for unequal work at a common rate;
18. required uniform rate for a deadline;
19. delay caused by a uniform rate reduction;
20. time saved by a uniform rate increase.

These are discovered task contracts, not a quota.

## Baseline merge and clarification decisions

The original chapter blueprint listed 22 provisional CP-001 modes. The implementation audit made three corrections:

- `findUnitRateFromOutputAndTime` is mathematically and structurally identical to `findRateFromWorkAndTime`; it is represented through scenario variation rather than a second QL.
- `findTimeFromOutputAndUnitRate` is identical to `findTimeFromWorkAndRate`; it is likewise merged.
- `recoverWholeWorkFromPartAndTime` was under-specified because a part and elapsed time alone cannot determine the whole. It is replaced by the valid contract `recoverWholeWorkFromPartAndFraction`.

This reduces the provisional list to 20 materially distinct solve contracts without losing exam coverage.

## Boundary decisions

The following remain outside CP-001:

- simultaneous independent agents: CP-002;
- efficiency-ratio and percentage-comparison systems: CP-003;
- joins, leaves, handoffs and partial-stage transitions: CP-004;
- repeating or alternating schedules: CP-005;
- workforce–days–hours scaling: CP-006;
- heterogeneous worker categories: CP-007;
- contribution-based wages: CP-008;
- pipes, outlets and leaks: CP-009/010;
- non-uniform daily rate sequences: CP-011.

## Explanation ownership

Every accepted solve contract has its own contextual opening. Formula selection is tied to the actual target:

- `W = rt` for direct work, rate and time;
- `r = 1/T` for reciprocal work;
- part ÷ fraction for whole recovery;
- source-output ÷ source-time × target-time for conversion;
- like-basis comparison before subtraction;
- fixed-work rate-change reconstruction for delay or saving.

Generic CP-level filler is not accepted.

## Current validation evidence

An isolated strict TypeScript compile and execution produced:

- 20 QLs (`TMW-QL-001`–`TMW-QL-020`);
- 20 solve contracts;
- 50 deterministic proof seeds per QL;
- 1,000 generated proof cases;
- deterministic replay equality;
- all four answer positions represented;
- 619 distinct rendered stems;
- zero invalid packages.

A separate 240-case structural audit found:

- unresolved placeholders: 0;
- malformed inline-MathJax delimiter groups: 0;
- generic explanation phrase hits: 0;
- option-contract failures: 0;
- exact cross-QL stem duplicate groups: 0;
- normalised cross-QL stem collisions: 0;
- exact cross-QL explanation duplicate groups: 0.

A 60-row review export was also generated locally, with three seeds per QL and every row valid.

## Verdict

`TMW-CP-001` is a **runtime-proof candidate for current English ownership**. It is not yet frozen or publishable because repository CI and manual exam-language review are still required.
