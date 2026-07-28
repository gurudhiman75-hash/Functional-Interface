# PNL-CP-004 Explanation Quality Audit

Status: FREEZE CANDIDATE

## Coverage

`explanation-patterns.library.json` contains one authored explanation pattern for every QL from `PNL-QL-095` through `PNL-QL-120`.

- English patterns: 26
- Hindi patterns: 26
- Punjabi patterns: 26
- Missing QL patterns: 0
- Generic CP-001 fallback dependence: 0 for CP-004 review content

## Quality rules

- Each explanation identifies the correct percentage base for the current transaction.
- Forward-chain explanations describe successive multiplication rather than additive percentages.
- Reverse-chain explanations explicitly undo stages in reverse order.
- Missing-rate explanations isolate the unknown commercial multiplier.
- Ledger explanations distinguish rate comparison from rupee-amount comparison.
- Expense questions add expense to purchase price before computing the result.
- Commission questions distinguish gross selling price from net receipt.
- Data-sufficiency explanations test whether the stated information uniquely fixes the required chain.

## Human-authorship audit

The entries are not copies of a single formula sentence. Wording and emphasis vary by task: forward progression, reverse recovery, intermediate stopping point, stage ledger, commission deduction, net-receipt inversion, algebraic isolation and statement sufficiency each use a distinct explanation approach.

## Multilingual audit

Hindi and Punjabi explanations preserve the same mathematical sequence as English while using natural commercial terminology. They are not structural placeholders or English text wrapped in translated labels.
