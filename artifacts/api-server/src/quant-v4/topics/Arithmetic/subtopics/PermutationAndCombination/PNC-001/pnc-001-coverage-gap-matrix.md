# PNC-001 Need-Based Coverage-Gap Matrix

> **Review date:** 2026-07-24  
> **Current active CP before this decision:** `PNC-CP-001 — Fundamental Counting Principle & Case Partition`  
> **Current active QLs before this decision:** `PNC-QL-001` through `PNC-QL-048`  
> **Decision:** Extend the existing CP with factorial reasoning; do not create a new CP or reserve a fixed final count.

## 1. Evidence reviewed

The review compared:

- the current 48 active QLs and five implemented solve modes;
- the uploaded ExamTree P&C design artifact;
- uploaded SSC quantitative-aptitude notes;
- the uploaded Disha SSC Mathematics Guide P&C chapter;
- the uploaded Arun Sharma P&C theory section.

The references consistently place factorial reasoning immediately after the addition/multiplication principles and before unrestricted permutation/combination applications. Repeated evidence includes:

- `0! = 1` and `1! = 1`;
- direct factorial evaluation;
- the recurrence `n! = n(n-1)!`;
- cancellation such as `6!/4!`;
- factorials as the exact foundation for `nPr` and `nCr`.

## 2. Coverage matrix

| Candidate family | Current QL coverage | Reference evidence | Runtime distinction | Decision |
|---|---|---|---|---|
| Addition/multiplication counting principles | Strong | Strong | Already implemented | No expansion now |
| Disjoint cases and simple complement | Strong | Moderate | Already implemented | No expansion now |
| Missing stage factor | Present | Moderate | Already implemented | No expansion now |
| Direct factorial value | Missing | Strong | Exact factorial operation and evidence | Admit |
| `0!`/`1!` inside a small factorial expression | Missing | Strong | Unit-factorial identity plus exact expression evaluation | Admit |
| Consecutive factorial quotient/cancellation | Missing | Strong | Factorial quotient, exact cancellation and range-product evidence | Admit |
| Shifted quotient such as `(n+1)!/n!` or `(n+2)!/n!` | Missing | Strong | Requires transformed numerator/denominator evidence | Admit |
| Recover `n` from `n! = target` | Missing | Moderate | Inverse bounded factorial search | Admit |
| Recover `n` from `n!/(n-k)! = target` | Missing | Moderate | Inverse bounded quotient search with exact-match validation | Admit |
| Unrestricted `nPr` arrangements | Missing | Strong | New order/slot state and permutation authority | Defer pending separate gap review |
| Basic `nCr` selections | Missing | Strong | New unordered-selection state and combination authority | Defer pending separate gap review |
| Repeated letters, digits, circular, restrictions, grouping | Missing | Strong but structurally later | Materially different solvers/validators | Defer |

## 3. CP ownership decision

Factorial reasoning belongs in the existing CP because it is foundational arithmetic for the same counting model and does not yet introduce ordered-slot or unordered-selection state.

The CP title is amended to:

```text
PNC-CP-001 — Fundamental Counting Principle, Case Partition & Factorial Reasoning
```

A new CP is not justified at this point.

## 4. QL admission decision

Ten QLs are admitted because the review found ten materially distinct stem/solve directions across four new runtime contracts:

1. direct `n!` evaluation;
2. predecessor factorial evaluation;
3. `0! + n!`;
4. `n! - 1!`;
5. direct numeric factorial quotient;
6. `(n+1)!/n!`;
7. `(n+2)!/n!`;
8. recover `n` from `n!`;
9. recover `n` from `(n+1)!`;
10. recover `n` from a consecutive factorial quotient.

The resulting IDs are `PNC-QL-049` through `PNC-QL-058`. This is the admitted checkpoint set, not a fixed CP ceiling.

## 5. Solve-mode decision

Only four new modes are justified:

- `evaluateFactorialValue`;
- `evaluateFactorialUnitExpression`;
- `simplifyFactorialQuotient`;
- `recoverFactorialArgument`;
- `recoverFactorialQuotientArgument`.

The final two inverse operations remain separate because their search domain, evidence, validation and misconception patterns differ.

No permutation, combination, multiset, digit or circular solve mode is declared in advance.

## 6. Stop condition

This factorial extension stops when:

- the admitted directions above are implemented end to end;
- formula and independent verification agree;
- exact duplicate and placeholder audits are clean;
- new factorial proposals collapse into existing mathematical fingerprints or cosmetic paraphrases.

The next chapter decision must repeat this evidence-led gap review.