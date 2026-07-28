# PNL-001 Transformation Matrix

Status: ACTIVE DISCOVERY
Count policy: OPEN ENDED

This matrix is a gap-discovery instrument. Rows are concept families; columns are transformation dimensions. A checked cell means the dimension must be reviewed, not that coverage is already complete.

## Legend

- FWD: forward
- REV: reverse
- MID: missing intermediate
- CPL: coupled inverse
- AMT: amount
- PCT: percentage/rate
- PRC: price
- RAT: ratio/fraction
- QTY: count/weight/quantity
- CMP: comparison/classification

## Matrix

| Family | FWD | REV | MID | CPL | AMT | PCT | PRC | RAT | QTY | Single | Aggregate | Sequential | Partial | Fraud | Table/Caselet |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| Fundamental CP/SP | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |  | ✓ |  |  |  |  | ✓ |
| Margin on SP vs profit on CP | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |  | ✓ | ✓ |  |  |  | ✓ |
| MP and discount | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |  | ✓ |
| Successive discounts | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |  |  | ✓ |
| Promotions/rebates/cashback | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |  | ✓ |
| Markup-discount-profit chain | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |  | ✓ | ✓ | ✓ |  |  | ✓ |
| Equal-CP article systems | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |  | ✓ |  | ✓ |  | ✓ |
| Equal-SP article systems | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |  | ✓ |  | ✓ |  | ✓ |
| Mixed aggregate inventory | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |  | ✓ |  | ✓ |  | ✓ |
| Damaged/free/unsold stock | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |  | ✓ |  | ✓ |  | ✓ |
| Sequential trade chain | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |  |  |  | ✓ |  |  | ✓ |
| False selling measure | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| False buying + selling measure | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| Dimensional fraud | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |  | ✓ | ✓ | ✓ |
| Effective cost/overhead | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |  | ✓ |
| Recovery and break-even | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |  | ✓ |

## Required transformation questions per concept node

For every ontology node, discovery must answer:

1. What variables may be given?
2. What semantic may be unknown?
3. Which quantity is the percentage base?
4. Is the operation additive, multiplicative, ratio-based, or equation-based?
5. Does reversing the relation require a different solver?
6. Does changing the unknown create a materially different misconception set?
7. Can the same mathematics appear under aggregate, partial, or sequential topology?
8. Does a quantity ledger change the reasoning?
9. Does the answer require money, rate, ratio, count, weight, quantity, or classification?
10. Is there an authentic exam-style table, statement, data-sufficiency, or caselet form?

## Initial mandatory gap register

The following transformations are not considered closed by current V2 evidence:

- profit amount and loss amount as first-class direct and reverse modes;
- amount + rate → CP/SP;
- CP:SP ratio ↔ profit/loss rate;
- profit margin on SP ↔ profit percentage on CP;
- missing one discount from equivalent discount;
- reverse buy-X-get-Y quantity;
- promotion comparison with different eligibility conditions;
- reverse count/quantity from aggregate target result;
- damaged, stolen, free, and unsold inventory variants;
- false buying measure combined with false selling measure;
- reverse target fraud requirement;
- false length/area/volume and dimensional scaling;
- partial-sale recovery from remaining stock;
- break-even quantity rather than only break-even price;
- commission placement before cost versus after realization;
- statement sufficiency and multi-row commercial caselets.

## Split rules

A candidate must be split into separate solve modes when any of these changes:

- percentage base;
- unknown semantic;
- transaction topology;
- independent verifier;
- equation structure;
- quantity ledger requirement;
- distractor misconception family;
- explanation path.

A candidate should be merged when differences are only object name, surface story, number range, or wording.

## Closure rule

No row may be marked exhausted until all relevant columns are either:

- represented by a verified solve mode;
- explicitly rejected as mathematically redundant;
- deferred with a documented ownership reason; or
- shown by source audit to be non-exam-relevant.

The matrix remains editable until the final freeze-readiness audit.