# PNC-001 Canonical-Problem Discovery

## Active CP

| CP | Name | Current implemented QLs | Status |
|---|---|---:|---|
| `PNC-CP-001` | Fundamental Counting Principle, Case Partition & Factorial Reasoning | 58 | Runtime proof |

The current QLs are `PNC-QL-001` through `PNC-QL-058`. This range records the implemented checkpoint; it is not a fixed final size for CP-001.

## CP-001 scope currently represented

- multiplication principle for sequential independent choices;
- addition principle for mutually exclusive alternatives;
- disjoint case partition;
- one-condition complementary counting;
- recovery of a missing stage count from an exact product;
- direct factorial evaluation;
- the `0! = 1! = 1` identity inside small exact expressions;
- consecutive factorial cancellation;
- recovery of an argument from an exact factorial target;
- recovery of an argument from a two-factor factorial quotient.

CP-001 teaches the foundational counting arithmetic without yet introducing full `nPr` or `nCr` state. Every explanation identifies the operation, exposes solver-owned intermediate evidence and states why the construction is valid.

## Candidate coverage backlog

The following families are candidates for future review, not pre-created CPs:

- distinct linear permutations and positional assignment;
- basic combinations and direct selection applications;
- digit, number, code and password formation;
- word, letter and repeated-object arrangements;
- selection followed by ordered roles;
- together/apart/block restrictions;
- positional, relative-order, alternation and gap constraints;
- category-constrained selection;
- circular arrangements;
- grouping and distribution;
- mixed advanced counting systems.

A candidate receives a CP ID only after reference/PYQ review shows that it needs a distinct solver, evidence, validator or explanation authority. Its QL count is determined by actual coverage need and stopped at semantic saturation.