# TMW-CP-007 — Heterogeneous Workers and Machine Equivalence
## Ownership and Solve-Contract Audit

**Branch:** `feat/tmw-cp007`  
**Base:** approved CP-006 merge `0dd90420c48ef4ca9c62ce9a0f70b54780b75eff`  
**Status:** implementation ownership baseline; counts were discovered rather than fixed as a quota  
**Publication:** disabled

## Canonical invariant

For categories with different per-unit efficiencies,

\[
r_{group}=\sum_k n_ke_k
\]

where `n_k` is the count of category `k` and `e_k` is that category's exact per-unit rate. Work, output and time are then derived from

\[
W=r_{group}t.
\]

Category replacement preserves capacity only when the removed and added weighted rates are equal.

## Ownership boundary

CP-007 owns heterogeneous category equivalence and weighted linear systems involving people, machines, printers or production lines. It does not own:

- one named agent or one homogeneous group, owned by CP-001;
- ordinary simultaneous named-agent rate addition without category-count equivalence, owned by CP-002;
- simple efficiency/time comparison without heterogeneous category structure, owned by CP-003;
- workforce-days-hours scaling with one homogeneous efficiency, owned by CP-006;
- payment distribution, owned by CP-008;
- staged joins/leaves or cyclic schedules, owned by CP-004 and CP-005.

## Blueprint merge and delegation decisions

The blueprint listed 24 candidate modes. They are not 24 permanent QLs.

- men/women, men/children, women/children, skilled/unskilled and machine-type efficiency comparisons merge into one two-category equivalence contract;
- three-category ratio reconstruction remains distinct because it chains two equivalence statements and returns an ordered triple ratio;
- equivalent-category count and replacement count merge because both solve `n_Ae_A=n_Be_B` with the same answer and distractor contract;
- target-time category count and missing-category count merge into one rate-gap contract;
- worker replacement and machine replacement are context variants of the same capacity exchange;
- mixed crew time, mixed group rate and mixed output remain distinct because their requested unknowns and inverse/direct traps differ;
- equivalent machine-hours from a mixed group is retained as mixed-to-standard conversion; homogeneous machine-hours remain CP-006;
- minimum integer composition and fixed-total integer composition remain separate because one is an optimisation problem and the other is a determined linear system;
- crew composition from two output facts and category rates from three weighted facts remain separate linear-system topologies;
- category contribution fraction remains CP-007 only when no payment is involved; wage allocation belongs to CP-008;
- crew composition for a deadline is covered by the unknown-category-count rate-gap contract;
- generic “integer solution under constraints” is retained only for fixed headcount plus weighted-rate equations.

## Retained solve contracts

1. `TMW-QL-128` — two-category per-unit efficiency ratio from equivalent groups;
2. `TMW-QL-129` — ordered three-category efficiency ratio;
3. `TMW-QL-130` — mixed-group completion time;
4. `TMW-QL-131` — equivalent or replacement category count;
5. `TMW-QL-132` — unknown category count for a target time;
6. `TMW-QL-133` — two-category composition from two output facts;
7. `TMW-QL-134` — one category rate from three weighted-group equations;
8. `TMW-QL-135` — heterogeneous group rate;
9. `TMW-QL-136` — completion time after a category replacement or group change;
10. `TMW-QL-137` — mixed-machine or mixed-group output;
11. `TMW-QL-138` — mixed contribution expressed in standard-category resource-time;
12. `TMW-QL-139` — minimum positive-integer category composition for an exact rate;
13. `TMW-QL-140` — unknown category solo time from a mixed-group time;
14. `TMW-QL-141` — category contribution fraction;
15. `TMW-QL-142` — work-rate comparison of two heterogeneous groups;
16. `TMW-QL-143` — category composition from fixed total count and combined rate.

## Parameter policy

- generate declared category efficiencies and valid integer category counts first;
- derive work, time, output, ratios and replacement counts from those states;
- never select unrelated ratios and then hope the resulting people or machine counts are integral;
- solve three-equation systems exactly with rational arithmetic and verify independently;
- require positive integer answers for all count, count-pair and standard-resource-time contracts;
- treat workers and machines as context variants only when the mathematical and answer contracts are identical.

## Mandatory misconception coverage

- category rates assumed equal;
- equivalent group-count ratio not inverted;
- weighted category rates not summed;
- known-category contribution omitted;
- total count reported instead of the requested additional/equivalent count;
- replacement efficiency ratio reversed;
- rate/time inversion missed;
- contribution based on raw headcount alone;
- ordered pair or ratio reversed;
- exact integer constraints ignored.

## Safety boundary

No Question Studio route, Question Bank write path, test assembly, localisation or public student delivery is enabled. Every generated package remains `publiclyPublishable: false`.
