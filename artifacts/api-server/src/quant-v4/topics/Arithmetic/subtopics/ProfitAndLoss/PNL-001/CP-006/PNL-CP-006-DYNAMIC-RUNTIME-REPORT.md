# PNL-CP-006 Dynamic Runtime Report

## Status

`PNL-CP-006` now has a standalone English `DYNAMIC_CANDIDATE` runtime for every frozen QL from `PNL-QL-150` through `PNL-QL-186`.

```text
QL count:                 37
Seeds per QL:             24
Validated packages:       888
Easy packages:             72
Medium packages:          288
Hard packages:            528
Runtime mode:              DYNAMIC_CANDIDATE
Question Bank status:     NOT_STORED
Test eligibility:         INELIGIBLE
Publicly publishable:     false
```

## Implemented coverage

The runtime covers:

- flat and percentage overheads;
- effective cost and inverse allowable expense;
- wastage-adjusted unit cost and required unit selling price;
- manufacturing cost, factory overhead and scrap recovery;
- break-even quantity, fixed cost, variable cost and unit price;
- target-profit quantity and selling price;
- contribution-margin ratio and break-even revenue;
- multi-product fixed-mix break-even bundles;
- margin of safety amount and percentage;
- prior-recovery and final-recovery planning;
- recovery percentage after a capital loss;
- commission-adjusted net realization and gross-price inversion;
- table, caselet, statement, algebraic and data-sufficiency presentations.

## Runtime architecture

- `cp006-dynamic-cases.ts` owns deterministic parameter generation and exact core/advanced solver requests.
- `cp006-dynamic-runtime.ts` owns answer mapping, Editorial V2 binding, options, traceability, forward consistency and safety metadata.
- `cp006-dynamic-runtime.test.ts` owns the 37-QL × 24-seed proof and structured-representation checks.

The runtime uses the canonical effective-cost recovery and advanced effective-cost solvers. Inverse cases are generated from valid forward commercial models wherever possible.

## Defects found during proof

### QL-155 allowable-expense result mapping

The canonical solver returns `maximumExpense`, while the initial package wrapper expected `maximumAllowableExpense`. The answer mapping, editorial alias and forward verifier were aligned to the canonical result without changing the solver contract.

### QL-165 answer diversity

A fixed expense pool produced the same recovered total-expense answer across the proof seeds. The inverse is now generated from a seeded exact percentage of purchase price, preserving exact money while creating genuine answer variation.

### QL-169 wastage-and-scrap diversity

All three original presets simplified to an effective unit cost of ₹100. Two exact presets were changed so the seed family now includes ₹100, ₹120 and ₹150 unit costs, with no fractional-paise division.

### QL-178 prior-recovery result mapping

The canonical advanced solver returns `priorRecoveryTotal`, while the package wrapper used `priorRecoverySum`. Context and forward verification were aligned to the canonical field.

### QL-184 statement binding

The structured statement block required a dynamic `statements` list in the rendering context. The runtime now binds all three loss-recovery statements explicitly and preserves `Statement 2 only` as the correct conceptual answer.

## Proof obligations passed

The permanent proof verifies:

- contiguous ownership of all 37 frozen QLs;
- deterministic replay for identical seeds;
- seed-driven stem and answer variation;
- exact canonical solver recomputation;
- forward consistency for allowable-expense, overhead, break-even, recovery and commission inverses;
- exact paise and positive whole-quantity handling;
- four unique options with three labelled misconceptions;
- table, caselet, statement, algebraic and data-sufficiency preservation;
- no unresolved Editorial V2 prose placeholders;
- English-only enforcement;
- explicit `NOT_STORED`, test-ineligible and non-public safety.

## Integration boundary

This implementation does **not** modify:

- Question Studio;
- the shared generation engine;
- admin routes;
- Question Studio capability metadata;
- public or test eligibility.

The complete Profit & Loss chapter should undergo a separate 186-QL standalone dynamic completeness audit before any Question Studio wiring decision.