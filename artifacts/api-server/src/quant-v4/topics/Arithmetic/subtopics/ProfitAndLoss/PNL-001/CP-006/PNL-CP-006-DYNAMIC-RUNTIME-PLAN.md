# PNL-CP-006 Dynamic Runtime Plan

## Scope

`PNL-CP-006` owns effective cost, overhead, manufacturing and wastage cost, contribution and break-even, commercial recovery, margin of safety and commission-adjusted realization outside trader chains.

```text
QL range:     PNL-QL-150 through PNL-QL-186
QL count:     37
Language:     English dynamic candidate first
Runtime mode: DYNAMIC_CANDIDATE
Proof target: 37 QLs × 24 seeds = 888 packages
```

This is standalone chapter implementation. It must not modify Question Studio, shared generation routing, admin routes or capability metadata.

## Exact solver ownership

### Core effective-cost and recovery solver

`foundation/effective-cost-recovery-solver.ts` owns:

1. `FLAT_COMPONENTS_TO_EFFECTIVE_COST`
2. `PURCHASE_AND_OVERHEAD_RATE_TO_EFFECTIVE_COST`
3. `EFFECTIVE_COST_AND_RATE_TO_SELLING_PRICE`
4. `PURCHASE_EXPENSES_AND_SP_TO_RESULT`
5. `SP_TARGET_RATE_TO_MAX_EXPENSE`
6. `WASTAGE_TO_EFFECTIVE_UNIT_COST`
7. `WASTAGE_AND_TARGET_RATE_TO_UNIT_SP`
8. `FIXED_VARIABLE_COST_TO_BREAK_EVEN_QUANTITY`
9. `FIXED_VARIABLE_COST_AND_TARGET_PROFIT_TO_QUANTITY`
10. `FIXED_COST_QUANTITY_TO_BREAK_EVEN_SP`
11. `EARLIER_LOSS_TO_REQUIRED_NEXT_SP`
12. `TOTAL_RECOVERY_AND_RATE_TO_EFFECTIVE_COST`

### Advanced effective-cost solver

`foundation/effective-cost-advanced-solver.ts` owns:

1. `MIXED_FLAT_PERCENT_OVERHEAD_TO_EFFECTIVE_COST`
2. `EFFECTIVE_COST_AND_PURCHASE_TO_TOTAL_EXPENSE`
3. `PURCHASE_FLAT_AND_EFFECTIVE_COST_TO_OVERHEAD_RATE`
4. `MANUFACTURING_COMPONENTS_TO_UNIT_COST`
5. `WASTAGE_SCRAP_TO_EFFECTIVE_UNIT_COST`
6. `BREAK_EVEN_QUANTITY_TO_FIXED_COST`
7. `BREAK_EVEN_QUANTITY_TO_VARIABLE_COST`
8. `FIXED_VARIABLE_QUANTITY_TARGET_PROFIT_TO_SP`
9. `FIXED_COST_AND_CM_RATIO_TO_BREAK_EVEN_REVENUE`
10. `FIXED_COST_AND_BREAK_EVEN_REVENUE_TO_CM_RATIO`
11. `MULTI_PRODUCT_MIX_TO_BREAK_EVEN_BUNDLES`
12. `ACTUAL_AND_BREAK_EVEN_REVENUE_TO_MARGIN_OF_SAFETY`
13. `TOTAL_COST_PRIOR_RECOVERIES_TARGET_TO_FINAL_RECOVERY`
14. `LOSS_RATE_TO_REQUIRED_RECOVERY_RATE_ON_REMAINING_CAPITAL`
15. `EFFECTIVE_COST_GROSS_SP_COMMISSION_TO_RESULT`
16. `EFFECTIVE_COST_TARGET_RATE_COMMISSION_TO_GROSS_SP`

## Generation rules

1. Generate effective cost from purchase and expense components before deriving selling price or inverse expense limits.
2. Wastage and manufacturing presets must produce exact paise per usable/output unit.
3. Break-even quantities must be positive whole numbers; inverse fixed and variable costs must be generated from a valid contribution model first.
4. Target-profit quantities and unit prices must use totals exactly divisible by unit contribution or quantity.
5. Contribution-margin ratios must be positive and below 100%; break-even revenue must remain exact to the paise.
6. Product-mix bundles must have positive contribution for every product and both exact and ceiling break-even cases across the seed sweep.
7. Margin-of-safety inputs must keep actual revenue at or above break-even revenue.
8. Commission inverse cases must use retained fractions producing exact gross prices.
9. Overhead inverses must preserve the selected base: purchase price or purchase plus flat expenses.
10. Data-sufficiency QL-186 must vary statement-one, statement-two, either and both-together classes.

## Representation obligations

- `PNL-QL-182`: manufacturing table;
- `PNL-QL-183`: multi-product break-even caselet;
- `PNL-QL-184`: statement evaluation;
- `PNL-QL-185`: algebraic overhead reconstruction;
- `PNL-QL-186`: data sufficiency.

## Answer contracts

The runtime requires explicit answer handling for:

- effective cost and total expense;
- unit cost and unit selling price;
- directed profit/loss amount and percentage;
- maximum allowable expense;
- break-even/target quantity;
- fixed cost, variable cost and contribution-margin ratio;
- break-even revenue and margin of safety;
- required final recovery;
- required recovery percentage after loss;
- commission-adjusted gross selling price;
- statement option and data-sufficiency class.

## Misconception contracts

Distractors should model:

- ignoring expenses in effective cost;
- calculating overhead on the wrong base;
- dividing cost by original instead of usable output;
- dividing fixed cost by selling price instead of contribution;
- omitting target profit from required contribution;
- using revenue instead of contribution-margin ratio;
- comparing gross rather than net recovery after commission;
- applying equal loss and recovery percentages to different bases.

## Proof gate

The permanent proof must verify:

- contiguous ownership of all 37 QLs;
- deterministic replay;
- seed-driven stem and answer variation;
- exact canonical recomputation;
- forward consistency for inverse modes;
- exact paise and whole-quantity handling;
- four unique misconception-labelled options;
- structured representation preservation;
- no unresolved Editorial V2 placeholders;
- English-only enforcement;
- explicit `NOT_STORED`, test-ineligible and non-public safety.
