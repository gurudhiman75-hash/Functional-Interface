# PNL-CP-005 Dynamic Runtime Plan

## Scope

`PNL-CP-005` owns dishonest trade through false weight, short quantity, heavy buying measures, light selling measures and combined price–quantity manipulation.

```text
QL range:     PNL-QL-121 through PNL-QL-149
QL count:     29
Language:     English dynamic candidate first
Runtime mode: DYNAMIC_CANDIDATE
```

This work is standalone chapter implementation. It must not alter Question Studio, shared generation routing, admin routes or capability metadata.

## Exact solver ownership

### Core dishonest-trade solver

`foundation/dishonest-trade-solver.ts` owns:

1. `FALSE_QUANTITY_AT_QUOTED_PRICE_TO_RESULT`
2. `DECLARED_RATE_FALSE_QUANTITY_TO_ACTUAL_RATE`
3. `TARGET_RATE_TO_DELIVERED_QUANTITY`
4. `TARGET_RATE_AND_FALSE_QUANTITY_TO_QUOTED_SP`
5. `BUY_HEAVY_SELL_LIGHT_TO_ACTUAL_RATE`
6. `MARKUP_DISCOUNT_FALSE_QUANTITY_TO_ACTUAL_RATE`
7. `TARGET_RATE_FALSE_QUANTITY_DISCOUNT_TO_MARKUP`
8. `TARGET_RATE_FALSE_QUANTITY_MARKUP_TO_DISCOUNT`
9. `PRICE_CHANGE_AND_SHORT_QUANTITY_TO_ACTUAL_RATE`
10. `SHORT_QUANTITY_TO_CUSTOMER_OVERCHARGE_RATE`
11. `ACTUAL_AND_DECLARED_RATE_TO_FALSE_QUANTITY`
12. `ACTUAL_RATE_AND_FALSE_QUANTITY_TO_DECLARED_RATE`

### Advanced dishonest-trade solver

`foundation/dishonest-trade-advanced-solver.ts` owns:

1. `ACTUAL_RATE_FALSE_QUANTITY_AND_QUOTED_SP_TO_COST_PRICE`
2. `ACTUAL_AMOUNT_FALSE_QUANTITY_AND_QUOTED_SP_TO_COST_PRICE`
3. `BUY_HEAVY_SELL_LIGHT_TARGET_TO_DELIVERED_QUANTITY`
4. `BUY_HEAVY_SELL_LIGHT_TARGET_TO_RECEIVED_QUANTITY`
5. `FALSE_QUANTITY_TO_EFFECTIVE_PRICE_PER_TRUE_QUANTITY`
6. `COMPARE_TWO_DISHONEST_SCHEMES`

## Generation rules

1. Generate the physical quantities and true cost first.
2. Use quantity ratios whose denominators keep delivered-cost money exact to the paise.
3. For target/inverse QLs, generate a valid forward case first and hide the requested variable.
4. Avoid accidental no-change cases whenever an inverse request requires a declared profit or loss direction.
5. For markup/discount inverses, derive the target result from a valid forward case so the recovered rate remains admissible.
6. For buy-heavy/sell-light inverses, derive the target rate from generated received and delivered quantities.
7. Scheme comparisons must produce both FIRST and SECOND winners across the seed sweep.
8. Customer-overcharge questions must always use delivered quantity below true quantity.
9. False-count and false-metre representations must retain their physical-unit wording.

## Representation obligations

- `PNL-QL-143`: false count;
- `PNL-QL-144`: false metre;
- `PNL-QL-145`: table;
- `PNL-QL-146`: caselet;
- `PNL-QL-147`: statement evaluation;
- `PNL-QL-148`: data sufficiency;
- `PNL-QL-149`: algebraic representation.

These QLs must not be flattened into generic paragraph-only questions.

## Answer contracts

The runtime needs explicit handling for:

- money;
- directed profit/loss percentages;
- profit/loss amount plus percentage;
- delivered or received quantity;
- markup or discount percentage;
- customer overcharge percentage;
- effective price per true quantity;
- scheme comparison and difference;
- statement option;
- data-sufficiency class.

## Misconception contracts

Distractors should model:

- using nominal cost instead of delivered cost;
- dividing profit by the billed amount;
- adding price and quantity percentages directly;
- reversing a percentage by subtraction rather than division;
- ignoring the heavy-buying side;
- ignoring the light-selling side;
- calculating discount or markup on the wrong price base;
- treating customer overcharge as the same percentage as short quantity.

## Proof gate

The permanent proof must generate all 29 QLs across at least 24 seeds:

```text
29 QLs × 24 seeds = 696 packages
```

It must verify contiguous ownership, deterministic replay, seed-driven variation, exact solver recomputation, forward consistency of inverse modes, exact paise handling, four unique misconception-labelled options, representation preservation, resolved Editorial V2 placeholders, English-only enforcement and explicit review-only safety.
