# TRG-001 QL Allocation Ledger

Status: **Phase 0 allocation lock**. This reserves every production English QL ID and its mathematical family. Individual runtime stem/template implementations are a later phase.

Package target: **144 English QLs**.

## TRG-CP-001 — Right-Triangle Ratios, Reciprocals & Side Recovery

| QL range | Count | Locked family |
|---|---:|---|
| `TRG-001-QL-001...004` | 4 | Side-role recognition relative to a named acute angle |
| `TRG-001-QL-005...008` | 4 | Direct trig ratio from given sides |
| `TRG-001-QL-009...012` | 4 | Missing side by Pythagoras, then target trig ratio |
| `TRG-001-QL-013...016` | 4 | Side recovery from a given trig ratio |
| `TRG-001-QL-017...022` | 6 | Derive all/selected ratios from one known ratio |
| `TRG-001-QL-023...024` | 2 | Reciprocal/comparison forms |

Total: **24**.

## TRG-CP-002 — Standard Angles & Exact Evaluation

| QL range | Count | Locked family |
|---|---:|---|
| `TRG-001-QL-025...028` | 4 | Single standard exact value |
| `TRG-001-QL-029...032` | 4 | Reciprocal-function standard values |
| `TRG-001-QL-033...037` | 5 | Products and quotients of standard values |
| `TRG-001-QL-038...040` | 3 | Powers/squared standard values |
| `TRG-001-QL-041...044` | 4 | Sums and differences |
| `TRG-001-QL-045...046` | 2 | Mixed exact standard-value expressions |
| `TRG-001-QL-047...048` | 2 | Finite equation/comparison/domain forms |

Total: **24**.

## TRG-CP-003 — Angle Measures, Complementary Relations & Reduction

| QL range | Count | Locked family |
|---|---:|---|
| `TRG-001-QL-049...052` | 4 | Degree ↔ radian exact conversion |
| `TRG-001-QL-053...058` | 6 | Complementary-function relations |
| `TRG-001-QL-059...063` | 5 | `90°/180°` reduction forms |
| `TRG-001-QL-064...066` | 3 | `270°/360°` reduction forms |
| `TRG-001-QL-067...069` | 3 | Quadrant sign/reference-angle reasoning |
| `TRG-001-QL-070...072` | 3 | Mixed periodic/reduction exact evaluation |

Total: **24**.

## TRG-CP-004 — Fundamental Identities & Expression Simplification

| QL range | Count | Locked family |
|---|---:|---|
| `TRG-001-QL-073...076` | 4 | `sin² + cos² = 1` family |
| `TRG-001-QL-077...079` | 3 | `sec² - tan² = 1` family |
| `TRG-001-QL-080...082` | 3 | `cosec² - cot² = 1` family |
| `TRG-001-QL-083...086` | 4 | Reciprocal and quotient identities |
| `TRG-001-QL-087...091` | 5 | Rational-expression simplification |
| `TRG-001-QL-092...095` | 4 | Evaluate expression from one given ratio |
| `TRG-001-QL-096` | 1 | Expression equivalence/identity recognition |

Total: **24**.

## TRG-CP-005 — Derived Ratios, Algebraic Relations & Controlled Equations

| QL range | Count | Locked family |
|---|---:|---|
| `TRG-001-QL-097...100` | 4 | Derived ratio/expression from known `sin/cos/tan` |
| `TRG-001-QL-101...104` | 4 | `sec(theta) ± tan(theta)` relations |
| `TRG-001-QL-105...108` | 4 | `cosec(theta) ± cot(theta)` relations |
| `TRG-001-QL-109...112` | 4 | `sin(theta) ± cos(theta)` relations |
| `TRG-001-QL-113...116` | 4 | `a sin(theta) = b cos(theta)` ratio relations |
| `TRG-001-QL-117...120` | 4 | Controlled finite standard-angle equations |

Total: **24**.

## TRG-CP-006 — Mixed Exam Expressions & Controlled Applications

| QL range | Count | Locked family |
|---|---:|---|
| `TRG-001-QL-121...126` | 6 | Mixed identity expressions |
| `TRG-001-QL-127...130` | 4 | Controlled angle-sum/difference applications |
| `TRG-001-QL-131...133` | 3 | Controlled double-angle applications |
| `TRG-001-QL-134...137` | 4 | Standard-value series/products |
| `TRG-001-QL-138...139` | 2 | Simple maximum/minimum forms |
| `TRG-001-QL-140...141` | 2 | Triangle area through `1/2 ab sin C` |
| `TRG-001-QL-142...144` | 3 | Equivalence/verification/composite exam forms |

Total: **24**.

# Package reconciliation

| CP | QLs |
|---|---:|
| TRG-CP-001 | 24 |
| TRG-CP-002 | 24 |
| TRG-CP-003 | 24 |
| TRG-CP-004 | 24 |
| TRG-CP-005 | 24 |
| TRG-CP-006 | 24 |
| **TRG-001 total** | **144** |

## Allocation rules

- These ranges are reserved and contiguous.
- Later runtime implementation may refine solve-mode names and stem variants inside a locked family, but moving QLs across CPs or changing counts requires an explicit design-lock amendment.
- Cosmetic context changes alone do not justify extra QLs.
- Every QL must eventually receive a distinct mathematical/question-language role within its allocated family.
- Production activation remains false throughout implementation until the later approval gate.
