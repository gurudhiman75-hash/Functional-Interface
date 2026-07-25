# PNL-CP-005 Explanation Quality Audit

Status: PASS FOR FREEZE CANDIDATE

## Coverage

- QL range: `PNL-QL-121` through `PNL-QL-149`
- English reasoning paths: 29
- Hindi reasoning paths: 29
- Punjabi reasoning paths: 29
- Missing explanation IDs: 0

## Quality rules

Each explanation must:

1. identify the cost of the quantity actually delivered;
2. keep quoted charge separate from actual cost;
3. state the correct percentage base;
4. compose price and quantity changes multiplicatively;
5. distinguish declared result from actual result;
6. distinguish dealer profit from customer overcharge;
7. show the reversal step in inverse questions;
8. explain both buying and selling quantity factors in dual-cheating questions;
9. preserve the order markup → discount → delivered quantity in combined questions;
10. explain why a table, statement or data-sufficiency item has enough information.

## Human-authored variation

The 29 paths are not copies of one generic formula. They use task-specific reasoning such as:

- delivered-cost comparison;
- target-revenue reversal;
- received-stock sale count;
- marked-price recovery;
- retained-price multiplier;
- effective full-measure customer price;
- scheme-by-scheme comparison;
- statement sufficiency and algebraic multiplier recovery.

## Prohibited explanation defects

- Saying that percentage shortage equals percentage profit without changing the base.
- Adding declared profit and shortage percentages.
- Treating the full nominal quantity as the dealer's actual cost after short delivery.
- Ignoring extra quantity received during purchase.
- Calling customer overcharge the dealer's profit percentage.
- Giving only a final formula with no identification of revenue and actual cost.
- Reusing English commercial terms inside Hindi or Punjabi prose except runtime direction tokens handled by localisation.

## Decision

The explanation library is structurally complete and conceptually aligned with the CP-005 solvers. Runtime rendering remains part of the consolidated PNL integration gate.
