# PNC-001 Canonical Problems

## Fixed package ownership map

`PNC-001 — Counting Foundations, Basic Permutations & Basic Combinations` owns six agreed CP boundaries:

1. `PNC-CP-001 — Fundamental Counting Principle & Case Partition`
2. `PNC-CP-002 — Distinct Linear Permutations & Positional Assignments`
3. `PNC-CP-003 — Basic Combinations & Direct Selection Applications`
4. `PNC-CP-004 — Digit, Number, Code & Password Formation`
5. `PNC-CP-005 — Word, Letter & Multiset Arrangements`
6. `PNC-CP-006 — Selection-Then-Arrangement & Role Assignment`

QL counts, solve modes and difficulty distributions inside these CPs are need-based.

## Current implementation state

| CP | Current represented scope | Current QLs | Status |
|---|---|---:|---|
| `PNC-CP-001` | counting principles, case partition, complement, factor recovery and supporting factorial reasoning | 58 | Runtime proof |
| `PNC-CP-002` | unrestricted ordered arrangements and inverse `nPr` tasks | 8 | Runtime proof |
| `PNC-CP-003` | unrestricted unordered selection, inverse `nCr` and symmetry | 8 | Runtime proof |
| `PNC-CP-004` | digit/number/code formation, leading zero, repetition, parity, divisibility, threshold, mixed stages and one-pair pattern | 12 | Runtime proof |
| `PNC-CP-005` | repeated-object and multiset arrangements | 8 | Partial CP runtime proof |
| `PNC-CP-006` | selection followed by arrangement or role assignment | 0 | Pending |
| **Current package snapshot** |  | **94** |  |

Current IDs are `PNC-QL-001` through `PNC-QL-094`. IDs reflect admission order, not CP order.

## Current CP-004 represented scope

- numbers from non-zero digits without repetition;
- zero-inclusive numbers with leading-zero correction;
- repetition-allowed codes versus repetition-allowed numbers;
- even and odd number formation through last-digit cases;
- divisibility by 5 through ending-0 and ending-5 cases;
- controlled thousand-threshold prefixes;
- fixed-pattern alphanumeric codes;
- bounded recovery of a repetition-allowed code alphabet;
- length-four codes with multiplicity pattern `2,1,1`.

## Current CP-005 represented scope

- direct multiset arrangements with one, two or three repeated categories;
- word and non-word repeated-object contexts;
- fixing a unique or repeated object in one position;
- identifying the identical-swap overcount factor;
- bounded recovery of one repeated multiplicity.

CP-004 and CP-005 may receive additional QLs only when they add a material distinction inside their fixed ownership boundaries.

## Second package roadmap

`PNC-002 — Restricted Arrangements, Grouping & Advanced Selection` owns:

- `PNC-CP-007 — Together, Apart & Block Restrictions`;
- `PNC-CP-008 — Position, Relative Order, Alternation & Gap Constraints`;
- `PNC-CP-009 — Conditional Selection from Categories`;
- `PNC-CP-010 — Circular Arrangements & Rotational Symmetry`;
- `PNC-CP-011 — Grouping & Distribution`;
- `PNC-CP-012 — Mixed Advanced Counting Systems`.

These CP boundaries are fixed, while their implementation volumes and runtime contracts remain need-based.
