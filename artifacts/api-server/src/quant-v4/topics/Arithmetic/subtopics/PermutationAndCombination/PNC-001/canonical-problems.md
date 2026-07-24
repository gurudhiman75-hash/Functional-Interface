# PNC-001 Canonical-Problem Discovery

## Active CPs

| CP | Name | Current implemented QLs | Status |
|---|---|---:|---|
| `PNC-CP-001` | Fundamental Counting Principle, Case Partition & Factorial Reasoning | 58 | Runtime proof |
| `PNC-CP-002` | Unrestricted Ordered Arrangements of Distinct Objects | 8 | Runtime proof |
| **Current package snapshot** |  | **66** |  |

The current active IDs are `PNC-QL-001` through `PNC-QL-066`. These values describe the reviewed checkpoint and are not final CP or package sizes.

## CP-001 scope currently represented

- addition and multiplication counting principles;
- disjoint cases and simple complement;
- exact missing-factor recovery;
- factorial definition and `0! = 1! = 1`;
- factorial cancellation;
- bounded factorial and factorial-quotient inverse reasoning.

## CP-002 scope currently represented

- arranging all distinct objects in ordered positions;
- arranging `r` objects from `n` distinct objects without repetition;
- ranked awards and distinct-office assignment as `nPr` applications;
- bounded exact recovery of either `n` or `r` from a permutation target.

CP-002 is separate because it introduces order-sensitive object/slot state, no-repetition selection, exact `nPr` authority and permutation-specific validation. It remains in package `PNC-001` because the shared exact-counting runtime is still coherent and reviewable.

## Candidate coverage backlog

The following remain candidates for fresh review, not pre-created CPs:

- basic combinations and direct unordered selection;
- digit, number, code and password formation;
- word, letter and repeated-object arrangements;
- selection followed by ordered roles when structurally beyond current `nPr` forms;
- together/apart/block restrictions;
- positional, relative-order, alternation and gap constraints;
- category-constrained selection;
- circular arrangements;
- grouping and distribution;
- mixed advanced counting systems.

A candidate receives a CP ID only after reference/PYQ review shows that it needs a distinct solver, evidence, validator or explanation authority. Its QL count is determined by actual coverage need and stopped at semantic saturation.