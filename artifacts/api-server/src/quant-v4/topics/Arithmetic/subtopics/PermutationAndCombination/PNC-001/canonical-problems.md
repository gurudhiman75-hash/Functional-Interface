# PNC-001 Canonical-Problem Discovery

## Active CPs

| CP | Name | Current implemented QLs | Status |
|---|---|---:|---|
| `PNC-CP-001` | Fundamental Counting Principle, Case Partition & Factorial Reasoning | 58 | Runtime proof |
| `PNC-CP-002` | Unrestricted Ordered Arrangements of Distinct Objects | 8 | Runtime proof |
| `PNC-CP-003` | Unrestricted Unordered Selection of Distinct Objects | 8 | Runtime proof |
| `PNC-CP-004` | Repeated Objects, Word Arrangements & Multisets | 8 | Runtime proof |
| **Current package snapshot** |  | **82** |  |

The current active IDs are `PNC-QL-001` through `PNC-QL-082`. These values describe the reviewed checkpoint and are not final CP or package sizes.

## CP-001 scope currently represented

- addition and multiplication counting principles;
- disjoint cases and simple complement;
- exact missing-factor recovery;
- factorial definition, identities, cancellation and bounded inverse reasoning.

## CP-002 scope currently represented

- arranging all distinct objects;
- arranging `r` from `n` distinct objects without repetition;
- ranked awards and distinct-office assignment;
- bounded recovery of either permutation parameter.

## CP-003 scope currently represented

- direct unordered selection of distinct objects;
- committee, team, pair and triple applications;
- bounded recovery of combination parameters;
- complementary-index symmetry.

## CP-004 scope currently represented

- direct multiset arrangements with one, two or three repeated categories;
- word and non-word repeated-object contexts;
- fixing a unique or repeated object in one position;
- identifying the identical-swap overcount factor;
- bounded recovery of one repeated multiplicity.

CP-004 is separate because it changes the identity policy: exchanging identical objects does not create a new outcome. It therefore requires explicit multiplicity state, exact denominator correction, multiset-specific evidence and independent unique-string enumeration. It remains inside `PNC-001` because the shared exact-counting runtime is still coherent and reviewable.

## Candidate coverage backlog

The following remain candidates for fresh review, not pre-created CPs:

- digit, number, code and password formation;
- repetition-allowed strings;
- together/apart/block restrictions;
- positional, relative-order, alternation and gap constraints;
- category-constrained selection and committee casework;
- circular arrangements;
- grouping and distribution;
- mixed advanced counting systems.

A candidate receives a CP ID only after reference/PYQ review shows that it needs a distinct solver, evidence, validator or explanation authority. Its QL count is determined by actual coverage need and stopped at semantic saturation.
