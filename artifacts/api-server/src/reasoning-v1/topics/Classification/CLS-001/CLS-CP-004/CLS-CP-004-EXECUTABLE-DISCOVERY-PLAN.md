# CLS-CP-004 — Number-Property Classification

Status: `EXECUTABLE_DISCOVERY_IN_PROGRESS`

This checkpoint owns classification-final questions whose answer is one complete displayed number and whose common rule is a conventional property of each number independently.

No permanent QL or solve-contract identity is allocated by this document.

## 1. Source boundary

The chapter source audit records recurring forms for:

- prime/composite classification;
- perfect squares and cubes;
- divisibility and parity;
- digit composition;
- digit sum and product;
- reversal properties;
- powers and near-powers;
- source-backed special-number classes.

The eligible rule universe is deliberately bounded. Arbitrary curve fitting, polynomial interpolation and post-hoc arithmetic stories are prohibited.

Full uploaded-book saturation remains open because File Library retrieval was unavailable when this wave began.

## 2. Temporary source controls

| Prototype | Discovery purpose |
|---|---|
| `CLS-CP004-PROT-001` | exact digit-count outlier |
| `CLS-CP004-PROT-002` | odd/even parity outlier |
| `CLS-CP004-PROT-003` | prime/composite class outlier |
| `CLS-CP004-PROT-004` | perfect-square status outlier |
| `CLS-CP004-PROT-005` | perfect-cube status outlier |
| `CLS-CP004-PROT-006` | divisibility by one declared conventional divisor |
| `CLS-CP004-PROT-007` | exact positive-divisor-count outlier |
| `CLS-CP004-PROT-008` | all-even/all-odd/mixed digit-composition outlier |
| `CLS-CP004-PROT-009` | exact digit-sum outlier |
| `CLS-CP004-PROT-010` | exact non-zero digit-product outlier |
| `CLS-CP004-PROT-011` | palindromic-number status outlier |
| `CLS-CP004-PROT-012` | bounded near-square/near-cube class outlier |
| `CLS-CP004-PROT-013` | triangular-number status outlier |

## 3. Bounded rule universe

```text
DIGIT_COUNT
PARITY
PRIMALITY_CLASS
PERFECT_SQUARE_STATUS
PERFECT_CUBE_STATUS
DIVISIBLE_BY_3
DIVISIBLE_BY_4
DIVISIBLE_BY_5
DIVISIBLE_BY_6
DIVISIBLE_BY_7
DIVISIBLE_BY_8
DIVISIBLE_BY_9
DIVISIBLE_BY_10
DIVISIBLE_BY_11
DIVISIBLE_BY_12
DIVISOR_COUNT
DIGIT_PARITY_COMPOSITION
DIGIT_SUM
DIGIT_PRODUCT
PALINDROME_STATUS
NEAR_POWER_CLASS
TRIANGULAR_STATUS
```

Rules are evaluated on positive integers from the governed finite domain only.

## 4. Acceptance invariant

```text
one admitted rule-value supports optionCount - 1 displayed numbers
exactly one number has a different value
and no admitted rule identifies another outlier
```

Audit outcomes:

```text
UNIQUE
AMBIGUOUS
NO_VALID_RULE
```

Only `UNIQUE` states are emitted.

Multiple admitted descriptions may coexist only when they agree on the same answer.

## 5. Ownership boundary

CP-004 owns:

- selecting one differently classified standalone number;
- conventional digit-local or number-theoretic properties;
- bounded special-number membership.

It excludes:

- a relation between two or more numbers inside each option — `CLS-CP-005`;
- source-to-target number rule transfer — Numeric Analogy;
- next or missing term — Number Series;
- grid or matrix completion — Missing Number;
- arbitrary algebraic fitting;
- open-ended discovery of an unstated rule universe.

## 6. Locale policy

The first wave is English discovery. Numeric states can later be shared across locales, but stems and explanations require independent Hindi and Punjabi editorial review before freeze.

## 7. Lifecycle locks

```text
Permanent CP-004 QLs:          0
Frozen CP-004 solve contracts: 0
Question Studio exposure:      disabled
Question Bank storage:         disabled
Test eligibility:              disabled
Public publication:            disabled
```