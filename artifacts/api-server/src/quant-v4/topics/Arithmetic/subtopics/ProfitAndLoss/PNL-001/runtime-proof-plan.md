# PNL-001 Representative Runtime Proof Plan

Status: READY AFTER DISCOVERY REVIEW

## Governing rule

This plan does not define a QL quota. It selects the smallest currently known set of semantic mechanisms needed to prove the runtime architecture. New evidence may add or split mechanisms before or during implementation.

## Runtime mechanisms that must be proven

### 1. Exact money and rational-rate arithmetic

Required capabilities:
- money stored as integer minor units;
- rates represented exactly as rational values or normalized basis points where exact;
- no use of approximate constants such as 33.33 when the intended value is one third;
- controlled formatting only at the output boundary;
- forward and reverse calculations must round-trip exactly for generated domains.

Representative semantic modes:
- `PNL-SM-003` — CP and SP to profit percentage;
- `PNL-SM-011` — SP and profit percentage to CP;
- `PNL-SM-013` — profit amount and percentage to CP.

### 2. Single-transaction price ledger

Required capabilities:
- distinguish CP, SP, MP, profit amount, loss amount and discount amount;
- preserve the percentage base explicitly;
- validate semantic sign and answer label.

Representative semantic modes:
- `PNL-SM-001` — CP and SP to profit amount;
- `PNL-SM-004` — CP and SP to loss percentage;
- `PNL-SM-103` — MP and SP to discount percentage.

### 3. Percentage-base conversion

Required capabilities:
- convert markup on CP to margin on SP and reverse;
- prevent CP-base and SP-base distractors from being accidentally accepted;
- expose the base in reasoning metadata.

Representative semantic modes:
- `PNL-SM-017` — profit as fraction of SP to profit percentage on CP;
- `PNL-SM-018` — profit percentage on CP to profit margin on SP.

These remain source-review candidates but the runtime must support the distinction.

### 4. Multiplier chain

Required capabilities:
- ordered markup and discount operations;
- successive discounts;
- reverse missing multiplier;
- independent forward substitution after solving.

Representative semantic modes:
- `PNL-SM-105` — successive discounts to equivalent discount;
- `PNL-SM-106` — missing successive discount;
- `PNL-SM-202` — CP, markup and discount to SP;
- `PNL-SM-204` — target result to discount percentage.

### 5. Ratio representation

Required capabilities:
- normalize CP:SP ratios;
- convert between ratio and percentage without decimal drift;
- produce ratio answers in lowest terms.

Representative semantic modes:
- `PNL-SM-015` — CP:SP ratio to result percentage;
- `PNL-SM-016` — result percentage to CP:SP ratio.

### 6. Aggregate and inventory ledger

Required capabilities:
- track total CP, total SP and quantities by segment;
- support equal-CP and equal-SP reconstruction;
- solve reverse missing-rate and missing-quantity equations;
- distinguish damaged, unsold and free units from sold units.

Representative semantic modes:
- `PNL-SM-302` — equal-SP mixed rates;
- `PNL-SM-304` — partial inventory forward aggregate;
- `PNL-SM-305` — missing segment rate;
- `PNL-SM-307` — damaged or unsold stock recovery.

### 7. Sequential transaction chain

Required capabilities:
- each seller's SP becomes the next buyer's CP;
- support forward, reverse and missing-stage solving;
- track individual trader result separately from whole-chain price movement;
- insert commission at the correct stage.

Representative semantic modes:
- `PNL-SM-401` — forward chain;
- `PNL-SM-402` — reverse original CP;
- `PNL-SM-403` — missing stage rate;
- `PNL-SM-404` — commission-bearing intermediary.

### 8. Price-quantity fraud ledger

Required capabilities:
- compare charged revenue against cost of actual delivered quantity;
- support false buying and false selling measures;
- solve reverse target quantity;
- handle dimensional scaling separately for length, area and volume.

Representative semantic modes:
- `PNL-SM-501` — short weight at stated CP;
- `PNL-SM-502` — price plus weight fraud;
- `PNL-SM-503` — reverse target delivered quantity;
- `PNL-SM-504` — false buying and selling measures;
- `PNL-SM-505`, `PNL-SM-506`, `PNL-SM-507` — dimensional fraud proofs.

### 9. Effective-cost and recovery ledger

Required capabilities:
- assemble overhead components exactly once;
- distinguish gross sale value from net realization after commission;
- divide total production cost over usable output;
- combine earlier loss with later recovery;
- solve break-even quantity.

Representative semantic modes:
- `PNL-SM-601` — overhead-adjusted result;
- `PNL-SM-603` — manufacturing cost per unit;
- `PNL-SM-604` — wastage-adjusted usable-unit cost;
- `PNL-SM-605` — recovery after earlier loss;
- `PNL-SM-607` — break-even remaining quantity.

## Proposed foundation modules

```text
foundation/
  types.ts
  rational.ts
  money.ts
  ledgers.ts
  math.ts
  solver.ts
  independent-verifier.ts
  parameter-generator.ts
  distractor-builder.ts
  reasoning-graph.ts
  explanation-renderer.ts
  validator.ts
  coverage-auditor.ts
  library.ts
  pipeline.ts
```

## Core data contracts

### Rational

```ts
type Rational = {
  numerator: bigint;
  denominator: bigint;
};
```

All rationals must be normalized, denominator-positive and reduced by GCD.

### Money

```ts
type Money = {
  minorUnits: bigint;
  currency: "INR";
};
```

The chapter's exam contexts use rupees, but arithmetic remains in paise. Display formatting is separate from solving.

### Price ledger

```ts
type PriceLedger = {
  costPrice?: Money;
  markedPrice?: Money;
  sellingPrice?: Money;
  effectiveCost?: Money;
  grossRealization?: Money;
  netRealization?: Money;
};
```

### Quantity ledger

```ts
type QuantityLedger = {
  nominalQuantity?: Rational;
  purchasedQuantity?: Rational;
  deliveredQuantity?: Rational;
  usableQuantity?: Rational;
  damagedQuantity?: Rational;
  unsoldQuantity?: Rational;
};
```

### Transaction stage

```ts
type TransactionStage = {
  buyerId: string;
  sellerId: string;
  inputPrice: Money;
  outputPrice: Money;
  rate?: Rational;
  rateKind?: "PROFIT" | "LOSS" | "MARKUP" | "DISCOUNT" | "COMMISSION";
  percentageBase?: string;
};
```

## Validation invariants

1. Profit percentage uses the declared cost base.
2. Discount percentage uses marked price unless a different commercial base is explicit.
3. Aggregate percentage uses total CP, not average of rates unless equal-base proof permits it.
4. Fraud profit compares billed revenue with cost of delivered quantity.
5. Sequential stages satisfy `previous.outputPrice === next.inputPrice`.
6. Effective cost components are included once and only once.
7. Generated reverse questions pass forward substitution.
8. Count and quantity answers satisfy integrality or permitted rational-unit rules.
9. All options share the same answer semantic and unit.
10. Explanation steps use the same ledger and percentage base as the solver.

## Initial implementation order

1. Rational and money primitives.
2. Price ledger and fundamental forward/reverse solver.
3. Multiplier-chain solver.
4. Aggregate/inventory ledger.
5. Sequential transaction chain.
6. Quantity-fraud and dimensional-measure solver.
7. Effective-cost and recovery solver.
8. Semantic answer formatter, distractor builder and explanations.
9. Independent verifier and coverage auditor.
10. Representative QLs selected from distinct mechanisms.

## Exit criteria for PNL-RUNTIME-001

The checkpoint closes only when:
- every listed runtime mechanism has at least one executable proof;
- every reverse proof passes independent forward substitution;
- exact arithmetic has no uncontrolled floating-point dependency;
- answer semantic, unit and percentage base are validated;
- no representative QL exists merely to satisfy a count;
- newly discovered mechanisms are either added or explicitly deferred with ownership evidence.
