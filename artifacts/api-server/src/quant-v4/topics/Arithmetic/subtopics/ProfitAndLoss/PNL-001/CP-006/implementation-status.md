# PNL-CP-006 Implementation Status

Status: ACTIVE DISCOVERY AND IMPLEMENTATION

Branch: `feat/pnl-001-cp006-effective-cost-recovery`

Count policy: OPEN ENDED UNTIL GAP AUDIT

Current discovery range: `PNL-QL-150` through `PNL-QL-163`

## Ownership

CP-006 owns effective cost, commercial recovery and break-even reasoning where purchase price alone is not the complete cost base.

Included:

- repairs, transport, packaging, installation and other flat overheads;
- overhead expressed as a percentage of purchase price;
- selling price or result measured on effective cost;
- maximum allowable expense for a target result;
- wastage-adjusted usable-output cost;
- fixed cost, variable cost, contribution and break-even quantity;
- quantity required for a target absolute profit;
- break-even selling price per unit;
- recovery after an earlier loss;
- inverse effective cost from total recovery and result rate.

Excluded to avoid duplication:

- plain remaining-stock or damaged-stock recovery already owned by CP-003;
- intermediary commission in a trader chain already owned by CP-004;
- false weight and short quantity owned by CP-005;
- marked-price promotion semantics owned by CP-002.

## Implemented runtime modes

1. Flat expense components to effective cost
2. Purchase price plus percentage overhead to effective cost
3. Effective cost and profit/loss rate to selling price
4. Purchase price, expenses and selling price to overall result
5. Selling price and target result to maximum allowable expense
6. Wastage to effective cost per usable unit
7. Wastage and target result to required unit selling price
8. Fixed and variable costs to break-even quantity
9. Fixed and variable costs plus target profit to required quantity
10. Fixed cost and quantity to break-even selling price per unit
11. Earlier loss plus a second purchase to required later selling price
12. Total recovery and result rate to effective cost

## Current QLs

The first English discovery set contains 14 runtime-backed QLs. This count is not frozen and is not a quota.

Hindi and Punjabi are intentionally deferred until the English solve-mode inventory stabilises.

## Runtime proof

`pnl-cp-006.test.ts` contains representative assertions for:

- flat and percentage overheads;
- profit rate on effective cost;
- maximum allowable expense;
- wastage-adjusted unit cost and target selling price;
- break-even quantity;
- target-profit quantity;
- break-even unit selling price;
- recovery after an earlier loss;
- inverse effective cost.

Repository-level execution remains pending for the consolidated test/build pass.

## Pending discovery

- manufacturing cost breakdown with multiple percentage bases;
- flat plus percentage overhead combinations and their inverses;
- break-even revenue and contribution-margin percentage;
- unknown fixed cost, variable cost, unit contribution or target revenue;
- multiple-product weighted contribution mix;
- recovery after several prior sales or losses;
- effective-cost questions with retained scrap or by-product value;
- commission or recovery deductions outside a trader chain;
- table, caselet, statement, algebraic and data-sufficiency representations;
- independent verifier and misconception-driven distractor contract;
- multilingual parity;
- reference-book and PYQ reconciliation.

## Exit rule

CP-006 may be frozen only after direct/reverse symmetry, percentage-base, wastage, contribution, recovery, representation, explanation, distractor, multilingual and source-pattern audits show no meaningful uncovered mode.
