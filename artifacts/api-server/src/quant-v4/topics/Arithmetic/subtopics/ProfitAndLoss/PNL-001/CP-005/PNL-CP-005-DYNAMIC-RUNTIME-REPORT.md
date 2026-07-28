# PNL-CP-005 Dynamic Runtime Report

## Status

`PNL-CP-005` now has a standalone English `DYNAMIC_CANDIDATE` runtime for every frozen QL from `PNL-QL-121` through `PNL-QL-149`.

```text
QL count:                 29
Seeds per QL:             24
Validated packages:       696
Easy packages:             24
Medium packages:          192
Hard packages:            480
Runtime mode:              DYNAMIC_CANDIDATE
Question Bank status:     NOT_STORED
Test eligibility:         INELIGIBLE
Publicly publishable:     false
```

## Implemented coverage

The runtime covers:

- false weight and short quantity;
- false count and false metre;
- declared versus actual profit or loss;
- target delivered quantity and quoted-price inverses;
- heavy buying and light selling measures;
- combined markup, discount and quantity manipulation;
- recovered markup and discount;
- recovered declared rate and true cost;
- customer overcharge and effective true-quantity price;
- dishonest-scheme comparison;
- table, caselet, statement, data-sufficiency and algebraic presentations.

## Runtime architecture

- `cp005-dynamic-cases.ts` owns deterministic parameter generation and exact core/advanced solver requests.
- `cp005-dynamic-runtime.ts` owns answer mapping, dynamic Editorial V2 binding, misconception options, traceability, inverse-forward consistency and safety metadata.
- `cp005-dynamic-runtime.test.ts` owns the 29-QL × 24-seed proof and representation checks.

## Defects and quality boundaries found during proof

### Zero-direction inverse boundary

A declared-loss rate combined with one short-quantity ratio could produce exactly no profit and no loss. That result is invalid for inverse modes requiring an explicit profit or loss direction.

The recovered-quantity and recovered-declared-rate family now starts from a declared-profit forward case, preventing the zero-direction boundary while retaining profit/loss coverage elsewhere in CP-005.

### Semantic answer-domain enforcement

The following QLs now have explicit generation constraints matching their frozen answer semantics:

- `PNL-QL-127` always remains an actual-profit heavy-buy/light-sell question;
- `PNL-QL-143` always remains a false-count profit question;
- `PNL-QL-146` always remains a caselet profit question;
- `PNL-QL-141` uses exact quantity/price pairs so effective true-quantity price remains exact to the paise.

These contracts are asserted across every seed in the permanent proof.

## Proof obligations passed

The permanent proof verifies:

- contiguous ownership of all 29 frozen QLs;
- deterministic replay for identical seeds;
- seed-driven stem and answer variation;
- exact canonical solver recomputation;
- forward consistency of target and inverse modes;
- exact paise handling;
- semantic profit-only QL domains;
- four unique options with three labelled misconceptions;
- false-count, false-metre, table, caselet, statement, data-sufficiency and algebraic preservation;
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