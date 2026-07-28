# PNL-CP-002 Dynamic Candidate Runtime

## Status

All 34 frozen English QLs in `PNL-CP-002` are implemented as deterministic, review-only dynamic candidates.

```text
QL range:             PNL-QL-037 through PNL-QL-070
QL count:             34
Seeds per QL:         24
Generated packages:   816
Runtime mode:         DYNAMIC_CANDIDATE
```

## Coverage

The runtime dispatches the frozen CP-002 inventory across the existing exact Profit & Loss solvers for:

- direct and reverse marked-price, discount, selling-price and discount-amount relations;
- successive discounts, equivalent discounts and missing-discount inverses;
- single-versus-successive offer comparison;
- markup-discount profit/loss calibration and target inverses;
- buy-X-get-Y promotions and effective unit price;
- flat and percentage cashback;
- flat and percentage coupons, eligibility thresholds and cashback caps;
- discount fractions and paid-to-marked ratios;
- minimum-spend offer comparison and coupon-order optimisation;
- table, caselet, statement, algebraic and data-sufficiency presentations.

## Seed-sweep proof

The permanent workflow generated and validated every QL across 24 seeds:

```text
Easy:     144
Medium:   264
Hard:     408
Total:    816
```

The proof checks:

- all 34 contiguous QLs are exposed;
- deterministic replay of stem, answer and option order;
- seed-driven stem and answer diversity;
- exact solver execution with exact paise handling;
- four unique options with one keyed answer and three misconception labels;
- complete dynamic Editorial V2 interpolation with no unresolved prose placeholders;
- difficulty-constrained QL selection;
- English-only enforcement;
- explicit Question Bank, test and publication safety.

## Exact-money boundary

Buy-X-get-Y effective-unit-price parameters are generated so the paid total divides exactly across all units received. This prevents fractional-paise outputs while preserving meaningful bundle diversity.

## Safety contract

Every emitted package remains:

```text
runtimeMode: DYNAMIC_CANDIDATE
reviewStatus: UNREVIEWED_DYNAMIC_CANDIDATE
questionBankStatus: NOT_STORED
testEligibility: INELIGIBLE
publiclyPublishable: false
```

This runtime proof does not yet add CP-002 to the shared Question Studio dynamic routing list. That integration remains a separate release gate.
