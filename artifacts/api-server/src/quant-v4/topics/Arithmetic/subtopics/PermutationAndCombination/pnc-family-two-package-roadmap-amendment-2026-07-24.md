# P&C Family Roadmap Amendment — Two Packages, Twelve CPs

> Date: 2026-07-24  
> Authority: supersedes any later wording that removed the agreed package or CP ownership map.  
> It does **not** restore fixed QL totals, QL ranges, difficulty quotas or advance solve-mode inventories.

## 1. Correct governance distinction

The following family architecture is fixed:

- exactly two planned packages for the end-to-end P&C family;
- six canonical-problem ownership boundaries in each package;
- continuous family CP IDs `PNC-CP-001` through `PNC-CP-012`;
- Probability remains separate.

The following remain need-based:

- number of QLs in each CP;
- final family QL count and terminal QL ID;
- solve modes and explanation strategies required inside each CP;
- difficulty distribution;
- implementation checkpoint size;
- whether a CP requires one or several runtime-proof branches.

Thus, CP ownership is roadmap-fixed while content volume and runtime contracts are evidence-driven.

## 2. Fixed package and CP map

### `PNC-001 — Counting Foundations, Basic Permutations & Basic Combinations`

1. `PNC-CP-001 — Fundamental Counting Principle & Case Partition`
2. `PNC-CP-002 — Distinct Linear Permutations & Positional Assignments`
3. `PNC-CP-003 — Basic Combinations & Direct Selection Applications`
4. `PNC-CP-004 — Digit, Number, Code & Password Formation`
5. `PNC-CP-005 — Word, Letter & Multiset Arrangements`
6. `PNC-CP-006 — Selection-Then-Arrangement & Role Assignment`

### `PNC-002 — Restricted Arrangements, Grouping & Advanced Selection`

7. `PNC-CP-007 — Together, Apart & Block Restrictions`
8. `PNC-CP-008 — Position, Relative Order, Alternation & Gap Constraints`
9. `PNC-CP-009 — Conditional Selection from Categories`
10. `PNC-CP-010 — Circular Arrangements & Rotational Symmetry`
11. `PNC-CP-011 — Grouping & Distribution`
12. `PNC-CP-012 — Mixed Advanced Counting Systems`

## 3. Ownership comparison against current implementation

| CP | Agreed ownership | Current state after correction |
|---|---|---|
| `PNC-CP-001` | counting principles and case partition | implemented; factorial reasoning retained as supporting foundation |
| `PNC-CP-002` | distinct linear permutations and ordered positions | implemented |
| `PNC-CP-003` | basic combinations and direct selection | implemented |
| `PNC-CP-004` | digit/number/code/password formation | pending implementation |
| `PNC-CP-005` | word/letter/multiset arrangements | partially implemented through direct repeated-object, fixed-position, overcount and inverse motifs |
| `PNC-CP-006` | selection then arrangement and role assignment | pending |
| `PNC-CP-007`–`012` | second-package restricted/advanced families | pending |

## 4. Correction of prior misclassification

The eight multiset QLs currently using `PNC-QL-075` through `PNC-QL-082` belong to `PNC-CP-005`, not `PNC-CP-004`.

The implementation is reclassified accordingly:

- companion libraries use `cp005` filenames;
- registry and language entries own `PNC-CP-005`;
- tests and reports identify CP-005;
- `PNC-CP-004` remains available for the agreed digit/number/code/password family.

QL IDs are not renumbered. IDs reflect admission order, not CP order, and remain continuous and immutable.

## 5. Implementation sequence

The next implementation checkpoint is `PNC-CP-004 — Digit, Number, Code & Password Formation`.

Its QL count and solve-mode set will be chosen from actual coverage needs. The CP boundary itself is not optional or subject to rediscovery because it is part of the agreed family roadmap.

After CP-004 reaches runtime proof, remaining work in package `PNC-001` is:

- complete any still-material CP-005 word-arrangement gaps such as distinct-letter subsets or simple curated rank/together forms where they belong within the agreed scope;
- implement CP-006;
- run a package-level saturation and freeze-readiness audit before starting `PNC-002`.
