# PNL-CP-006 Explanation Quality Audit

Status: FREEZE CANDIDATE

## Coverage

- QL range: `PNL-QL-150` through `PNL-QL-186`
- English explanations: 37
- Hindi explanations: 37
- Punjabi explanations: 37
- Missing explanation IDs: 0

## Quality rules verified

1. Every QL has a dedicated explanation pattern rather than a generic CP-001 fallback.
2. Explanations identify the correct commercial base: purchase price, effective cost, prime cost, usable output, unit contribution, actual revenue, remaining capital or net realization.
3. Forward and inverse modes use different reasoning paths.
4. Break-even quantity explanations explicitly require whole-unit or whole-bundle ceiling semantics.
5. Manufacturing explanations distinguish gross production cost, scrap recovery and net unit cost.
6. Commission explanations distinguish gross selling price from net recovery.
7. Recovery-after-loss explanations identify the reduced post-loss capital as the new percentage base.
8. Table, caselet, statement, algebraic and data-sufficiency QLs have representation-specific reasoning.
9. Hindi and Punjabi explanations preserve the same mathematical sequence as English without copying English commercial terminology unnecessarily.
10. No explanation relies on arbitrary option elimination or answer-only wording.

## Human-authorship safeguards

- Sentence openings and reasoning verbs vary across the QLs.
- Each explanation names the operation that changes the commercial base.
- Closely related QLs such as break-even quantity, fixed-cost inverse and variable-cost inverse are not explained with identical text.
- Amount and percentage semantics are kept distinct.

## Reopen rule

Reopen the explanation library if rendered review shows repetitive phrasing, mistranslated percentage bases, unresolved structured variables or a runtime mode without a dedicated explanation path.
