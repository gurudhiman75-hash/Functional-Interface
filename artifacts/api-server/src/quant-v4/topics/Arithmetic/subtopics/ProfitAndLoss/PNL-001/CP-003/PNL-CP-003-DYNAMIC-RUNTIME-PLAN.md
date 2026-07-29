# PNL-CP-003 Dynamic Runtime Plan

## Scope

`PNL-CP-003` covers multiple articles, weighted inventory groups, partial stock, damaged/spoiled recovery and aggregate profit/loss.

```text
QL range:     PNL-QL-071 through PNL-QL-094
QL count:     24
Language:     English dynamic candidate first
Runtime mode: DYNAMIC_CANDIDATE
Proof target: 24 QLs × 24 seeds = 576 packages
```

This is standalone chapter implementation. It must not modify Question Studio, shared generation routing, admin routes or capability metadata.

## Exact solver ownership

### Core inventory solver

`foundation/inventory-solver.ts` owns:

1. `MULTIPLE_LOTS_TO_OVERALL_RESULT`
2. `EQUAL_SP_TWO_ARTICLES_TO_OVERALL_RATE`
3. `EQUAL_CP_TWO_ARTICLES_TO_OVERALL_RATE`
4. `PARTIAL_INVENTORY_TO_OVERALL_RESULT`
5. `DAMAGED_STOCK_REQUIRED_RATE_ON_REMAINDER`
6. `FREE_UNITS_AND_SOLD_UNITS_TO_RESULT`

### Advanced inventory solver

`foundation/inventory-advanced-solver.ts` owns:

1. `GROUP_RATES_TO_OVERALL_RESULT`
2. `UNKNOWN_GROUP_RATE_FOR_TARGET`
3. `UNKNOWN_GROUP_QUANTITY_FOR_TARGET`
4. `UNSOLD_STOCK_REQUIRED_UNIT_PRICE`
5. `UNSOLD_STOCK_REQUIRED_RATE`
6. `SPOILED_STOCK_REQUIRED_RECOVERY`
7. `EQUAL_SP_EQUAL_RATES_SPECIAL`
8. `EQUAL_SP_ONE_RATE_FROM_OVERALL`
9. `TOTAL_CP_AND_OVERALL_RATE_TO_TOTAL_SP`
10. `TOTAL_SP_AND_OVERALL_RATE_TO_TOTAL_CP`
11. `RECOVERY_FRACTION_TO_OVERALL_RESULT`

## Generation rules

1. Generate all weighted groups as exact quantities, unit costs and unit prices/rates.
2. Aggregate answers must be derived from total money, never from averaging percentages.
3. Equal-selling-price cases must use compatible selling prices and rates so reverse costs remain exact to the paise.
4. Unknown group rate and quantity QLs must start from a complete forward inventory; the target is derived, then the requested variable is hidden.
5. Unsold-stock price/rate QLs must first generate the intended remaining-unit price and derive the overall target from the full inventory.
6. Damaged/spoiled recovery QLs must choose quantities and target recoveries that divide exactly per remaining/spoiled unit.
7. Reverse total-cost QLs must generate total cost first, derive total selling price and then present the inverse task.
8. Data-sufficiency QL-092 must vary among statement-one, statement-two, either and both-together classes while keeping the underlying inventory mathematically valid.
9. No inverse case may accidentally become indeterminate or require a negative quantity/recovery.

## Representation obligations

- `PNL-QL-071`: lot table;
- `PNL-QL-074`: partial-inventory table;
- `PNL-QL-077`: weighted-group table;
- `PNL-QL-078`: known-group table;
- `PNL-QL-079`: fixed-group table;
- `PNL-QL-080` and `081`: sold-group tables;
- `PNL-QL-088`: dedicated inventory table;
- `PNL-QL-089`: caselet;
- `PNL-QL-090`: statement evaluation;
- `PNL-QL-091`: algebraic model;
- `PNL-QL-092`: data sufficiency.

## Answer contracts

The runtime requires explicit answer handling for:

- directed profit/loss percentage;
- overall profit/loss amount;
- money totals and per-unit prices;
- unknown group rate;
- unknown quantity;
- required rate on remaining stock;
- statement option;
- data-sufficiency class.

## Misconception contracts

Distractors should model:

- averaging group rates instead of weighting money;
- ignoring unsold/damaged/spoiled recovery;
- applying the overall target only to remaining stock;
- including free units in purchase cost;
- assuming equal selling prices imply equal cost prices;
- cancelling equal profit and loss rates;
- reversing a commercial rate by subtraction instead of division.

## Proof gate

The permanent proof must verify:

- contiguous ownership of all 24 QLs;
- deterministic replay;
- seed-driven stem and answer variation;
- exact canonical recomputation;
- independent multiple-lot verification;
- forward consistency for every inverse family;
- exact paise and whole-quantity handling;
- four unique misconception-labelled options;
- structured representation preservation;
- no unresolved Editorial V2 placeholders;
- English-only enforcement;
- explicit `NOT_STORED`, test-ineligible and non-public safety.
