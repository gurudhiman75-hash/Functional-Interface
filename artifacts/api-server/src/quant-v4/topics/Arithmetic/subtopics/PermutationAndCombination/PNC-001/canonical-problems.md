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

## Current reviewed implementation state

| CP | Current represented scope | Current QLs | Status |
|---|---|---:|---|
| `PNC-CP-001` | counting principles, case partition, complement, factor recovery and supporting factorial reasoning | 58 | Reviewed / saturated |
| `PNC-CP-002` | unrestricted ordered arrangements and inverse `nPr` tasks | 8 | Reviewed / saturated |
| `PNC-CP-003` | unrestricted unordered selection, inverse `nCr` and symmetry | 8 | Reviewed / saturated |
| `PNC-CP-004` | digit/number/code formation, leading zero, repetition, parity, divisibility, threshold, mixed stages and one-pair pattern | 12 | Reviewed / saturated for basic formation |
| `PNC-CP-005` | multiset arrangements, fixed-position multiplicity, overcount/inverse multiplicity and dictionary rank | 10 | Reviewed / evidence-backed saturation |
| `PNC-CP-006` | select a group, then assign roles or arrange the selected group; role multiplier and bounded inverse directions | 10 | Reviewed / saturated |
| **Current package snapshot** |  | **106** | **Eligible for English freeze review** |

Current IDs are `PNC-QL-001` through `PNC-QL-106`. IDs reflect admission order, not CP order.

## CP-004 represented scope

- numbers from non-zero digits without repetition;
- zero-inclusive numbers with leading-zero correction;
- repetition-allowed codes versus repetition-allowed numbers;
- even and odd number formation through last-digit cases;
- divisibility by 5 through ending-0 and ending-5 cases;
- controlled leading-threshold prefixes;
- fixed-pattern alphanumeric codes;
- bounded recovery of a repetition-allowed code alphabet;
- length-four codes with multiplicity pattern `2,1,1`.

## CP-005 represented scope

- direct multiset arrangements with one, two or three repeated categories;
- word and non-word repeated-object contexts;
- fixing a unique or repeated object in one position;
- identifying the identical-swap overcount factor;
- bounded recovery of one repeated multiplicity;
- dictionary rank for a distinct-letter word;
- dictionary rank for a repeated-letter word with multiset correction.

Partial letter selection/arrangement remains deferred because no current evidence proves a CP-005-specific contract distinct from CP-006 or later packages.

## CP-006 represented scope

- committee selection followed by one, two or three distinct appointments;
- shortlist selection followed by ranked awards;
- selecting objects or people and arranging every selected item;
- explicit `nCs × sPk` stage evidence;
- explicit `nCs × s! = nPs` bridge evidence;
- role-assignment multiplier `sPk` after a fixed selection;
- bounded unique recovery of the original pool, selected-group size or role count.

All six PNC-001 boundaries have reviewed runtime coverage. The package is eligible for explicit English freeze review but remains unpublished and unintegrated.

## Second package roadmap

`PNC-002 — Restricted Arrangements, Grouping & Advanced Selection` owns:

- `PNC-CP-007 — Together, Apart & Block Restrictions`;
- `PNC-CP-008 — Position, Relative Order, Alternation & Gap Constraints`;
- `PNC-CP-009 — Conditional Selection from Categories`;
- `PNC-CP-010 — Circular Arrangements & Rotational Symmetry`;
- `PNC-CP-011 — Grouping & Distribution`;
- `PNC-CP-012 — Mixed Advanced Counting Systems`.

These CP boundaries are fixed, while their implementation volumes and runtime contracts remain need-based.