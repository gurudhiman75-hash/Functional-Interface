# PNL-CP-001 Completion Audit

Status: FREEZE CANDIDATE

## Scope

CP-001 owns fundamental single-article price relations before marked price, discount, aggregate inventory, sequential trade, dishonest trade or overhead reasoning begins.

## Discovered coverage

The implemented runtime and QL libraries cover:

- CP and SP to profit/loss amount;
- CP and rate to profit/loss amount;
- CP and amount to SP;
- SP and amount to CP;
- CP and SP to profit/loss rate;
- CP and rate to SP;
- SP and rate to CP;
- amount and rate to CP;
- amount and CP to rate;
- CP:SP ratio to rate;
- rate to CP:SP ratio;
- profit margin on SP to profit percentage on CP;
- profit percentage on CP to margin on SP;
- profit/loss as a fraction of CP;
- profit/loss as a fraction of SP;
- rate to amount fraction;
- difference between selling prices under two rates;
- reverse CP from selling-price difference;
- second profit/loss rate from two selling conditions;
- no-profit-no-loss;
- arithmetic, ratio, fraction, comparison and algebraic-statement presentations.

## Runtime contracts

The CP uses exact rational arithmetic and integer-paise money. Reverse modes are defined independently and can be checked by forward substitution. Profit/loss rates declare CP or effective cost as the base, while margin modes explicitly use SP.

## Library parity

- English QLs: 36
- Hindi QLs: 36
- Punjabi QLs: 36
- Registry entries: 36
- Stable range: `PNL-QL-001` through `PNL-QL-036`

The three language libraries use the same IDs and placeholder contracts.

## Ownership exclusions

The following remain outside CP-001:

- marked price and discount;
- successive discounts and promotions;
- multiple articles and inventory aggregation;
- sequential traders;
- dishonest weights and measures;
- overhead, recovery and manufacturing-cost ledgers.

## Freeze decision

No meaningful internal transformation gap remains in the fundamental price-relation matrix. CP-001 is therefore a freeze candidate at the discovered 36 QLs. This is not a quota-derived count.

The CP must be reopened if book/PYQ reconciliation reveals a mathematically distinct fundamental transformation, answer semantic or exam delivery pattern. Cosmetic contexts alone do not justify expansion.

## Deferred execution

The Node/esbuild runtime proof has been updated but execution remains deferred by project decision. CP-001 cannot be merged as production-ready until that proof and repository TypeScript build pass.
