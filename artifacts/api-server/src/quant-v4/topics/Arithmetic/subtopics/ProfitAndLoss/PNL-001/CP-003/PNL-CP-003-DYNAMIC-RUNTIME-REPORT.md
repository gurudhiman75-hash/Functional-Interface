# PNL-CP-003 Dynamic Runtime Report

## Status

`PNL-CP-003` now has a standalone English `DYNAMIC_CANDIDATE` runtime for every frozen QL from `PNL-QL-071` through `PNL-QL-094`.

```text
QL count:                 24
Seeds per QL:             24
Validated packages:       576
Easy packages:             24
Medium packages:          192
Hard packages:            360
Runtime mode:              DYNAMIC_CANDIDATE
Question Bank status:     NOT_STORED
Test eligibility:         INELIGIBLE
Publicly publishable:     false
```

## Implemented coverage

The runtime covers:

- multiple inventory lots and weighted group rates;
- equal-selling-price and equal-cost-price articles;
- partial and unsold inventory;
- damaged and spoiled stock recovery;
- free-unit inventory;
- unknown group rate and quantity inverses;
- required unit price and rate on remaining stock;
- equal-selling-price special and inverse cases;
- total cost/total selling forward and reverse relations;
- recovery fractions;
- table, caselet, statement, algebraic and data-sufficiency presentations.

## Runtime architecture

- `cp003-dynamic-cases.ts` owns deterministic parameter generation and exact inventory solver requests.
- `cp003-dynamic-runtime.ts` owns answer mapping, dynamic Editorial V2 binding, misconception options, traceability, independent/forward consistency and safety metadata.
- `cp003-dynamic-runtime.test.ts` owns the 24-QL × 24-seed proof and representation checks.

The runtime uses the canonical core and advanced inventory solvers. Multiple-lot results are independently checked through `cp003-independent-verifier.ts`.

## Defects found during proof

### Damaged-stock exact-money boundary

One damaged-stock preset produced a target recovery that did not divide exactly across the good units. The canonical money layer therefore had to truncate a fractional paise.

The preset was replaced with an exact-dividing recovery, and all generated per-unit money answers are now asserted to remain exact to the paise.

### Indeterminate unknown group quantity

A randomly generated fixed group could have the same commercial rate as the unknown group. In that case, changing the unknown quantity did not change the aggregate rate, making the inverse indeterminate.

`PNL-QL-079` now uses forward-built, rate-separated presets with a uniquely recoverable positive whole-number quantity.

### Equal-selling-price inverse foundation defect

The canonical `EQUAL_SP_ONE_RATE_FROM_OVERALL` solver mixed ratio and percentage scales. It calculated the known article's normalised cost as:

```text
100 / (100 ± rate)
```

while the rest of the derivation uses a common selling price normalised to 100. The correct normalised cost is:

```text
10000 / (100 ± rate)
```

This shared foundation defect was corrected in `foundation/inventory-advanced-solver.ts`. The QL-084 seed sweep now recovers the hidden equal rate across both direction orders.

## Proof obligations passed

The permanent proof verifies:

- contiguous ownership of all 24 frozen QLs;
- deterministic replay for identical seeds;
- seed-driven stem and answer variation;
- exact canonical solver recomputation;
- independent multiple-lot verification;
- forward consistency for damaged, unsold, spoiled, unknown-group and reverse-total modes;
- exact paise and whole-quantity handling;
- four unique options with three labelled misconceptions;
- table, caselet, statement, algebraic and data-sufficiency preservation;
- no unresolved Editorial V2 placeholders;
- English-only enforcement;
- explicit `NOT_STORED`, test-ineligible and non-public safety.

## Integration boundary

This implementation does **not** modify:

- Question Studio;
- the shared generation engine;
- admin routes;
- Question Studio capability metadata;
- public or test eligibility.

No further Profit & Loss runtime will be wired before the complete chapter is implemented and audited.