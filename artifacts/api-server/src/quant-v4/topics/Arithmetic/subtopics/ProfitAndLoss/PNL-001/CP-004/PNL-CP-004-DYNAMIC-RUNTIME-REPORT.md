# PNL-CP-004 Dynamic Runtime Report

## Status

`PNL-CP-004` now has a standalone English `DYNAMIC_CANDIDATE` runtime for every frozen QL from `PNL-QL-095` through `PNL-QL-120`.

```text
QL count:                 26
Seeds per QL:             24
Validated packages:       624
Medium packages:          216
Hard packages:            408
Runtime mode:              DYNAMIC_CANDIDATE
Question Bank status:     NOT_STORED
Test eligibility:         INELIGIBLE
Publicly publishable:     false
```

## Implemented coverage

The runtime covers:

- two-stage and three-stage forward transaction chains;
- reverse recovery of the original price;
- intermediate transaction prices;
- complete-chain profit or loss rates;
- missing profit and missing loss stages;
- repeated equal-rate transfers;
- selected-stage and complete trader ledgers;
- buyer-side expenses before resale;
- gross selling price, commission and net receipt relations;
- middle-trader net results after both expense and commission;
- table, caselet, statement, algebraic and data-sufficiency presentations.

## Runtime architecture

- `cp004-dynamic-cases.ts` owns deterministic parameter generation and exact solver requests.
- `cp004-dynamic-runtime.ts` owns answer mapping, dynamic Editorial V2 binding, distractors, traceability, validation and safety metadata.
- `cp004-dynamic-runtime.test.ts` owns the 26-QL × 24-seed proof and structured-representation checks.

The runtime routes only through the canonical transaction-chain and transaction-fee solvers. Forward, reverse and commission results are also checked through `cp004-independent-verifier.ts`.

## Defect found during proof

The first seed sweep found that an arbitrary commission rate could make a generated middle-trader net target impossible to reverse to an exact paise gross amount.

The generator now uses a 20% commission for that inverse family. The retained fraction is therefore `4/5`, and all generated net targets are exact multiples of four paise. Other direct commission families continue to vary across the allowed commission set.

## Proof obligations passed

The final permanent workflow verifies:

- contiguous ownership of all 26 frozen QLs;
- deterministic replay for identical seeds;
- seed-driven stem variation for every QL;
- seed-driven answer variation except the intentionally fixed statement-evaluation key;
- exact canonical solver recomputation;
- independent forward, reverse and commission verification;
- exact paise handling;
- four unique options with three labelled misconceptions;
- table, caselet, statement, algebraic and data-sufficiency preservation;
- no unresolved prose placeholders;
- English-only enforcement;
- explicit `NOT_STORED`, test-ineligible and non-public safety.

## Integration boundary

This implementation does **not** modify:

- Question Studio;
- the shared generation engine;
- admin routes;
- Question Studio capability metadata;
- public or test eligibility.

Chapter integration will be considered only after the complete Profit & Loss chapter is implemented and audited.