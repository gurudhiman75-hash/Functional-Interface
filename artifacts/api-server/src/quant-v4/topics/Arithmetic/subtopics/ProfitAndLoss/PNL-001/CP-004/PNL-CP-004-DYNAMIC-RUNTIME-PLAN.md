# PNL-CP-004 Dynamic Runtime Plan

## Scope

`PNL-CP-004` covers successive transactions, trader chains, buyer-side expenses and seller-side commission.

```text
QL range:     PNL-QL-095 through PNL-QL-120
QL count:     26
Language:     English dynamic candidate first
Runtime mode: DYNAMIC_CANDIDATE
```

The frozen inventory is solver-complete. Dynamic implementation must preserve the existing QL count and discover no artificial count expansion.

## Exact solver ownership

### Transaction-chain solver

`foundation/transaction-chain-solver.ts` owns:

1. `INITIAL_CP_AND_STAGES_TO_FINAL_SP`
2. `FINAL_SP_AND_STAGES_TO_INITIAL_CP`
3. `INITIAL_CP_AND_STAGES_TO_INTERMEDIATE_PRICE`
4. `STAGES_TO_OVERALL_RATE`
5. `INITIAL_FINAL_KNOWN_STAGES_TO_MISSING_RATE`
6. `EQUAL_RATE_N_STAGE_TO_FINAL_SP`
7. `CHAIN_TO_STAGE_LEDGER`

### Transaction-fee solver

`foundation/transaction-fee-solver.ts` owns:

1. `BUYER_EXPENSE_THEN_RATE_TO_SP`
2. `GROSS_SP_AND_COMMISSION_TO_NET_RECEIPT`
3. `NET_TARGET_AND_COMMISSION_TO_GROSS_SP`
4. `MIDDLE_TRADER_NET_RESULT`

## QL allocation

| QL | Mode | Dynamic answer |
|---|---|---|
| 095 | Initial price + two stages | Final selling price |
| 096 | Initial price + three stages | Final selling price |
| 097 | Final price + two stages | Initial cost price |
| 098 | Final price + three stages | Initial cost price |
| 099 | Chain with stopping stage | Intermediate price |
| 100 | Stage factors only | Overall profit/loss rate |
| 101 | Three explicit stages | Overall profit/loss rate |
| 102 | Known start/end + missing profit stage | Missing profit rate |
| 103 | Known start/end + missing loss stage | Missing loss rate |
| 104 | Repeated equal-rate stages | Final selling price |
| 105 | Stage ledger + selected trader | Selected stage amount |
| 106 | Complete ledger | Largest absolute stage result |
| 107 | Purchase + buyer expense + target rate | Required selling price |
| 108 | Gross sale + commission | Net receipt |
| 109 | Required net + commission | Required gross sale |
| 110 | Purchase + expense + gross sale + commission | Net profit/loss rate |
| 111 | Complete ledger | Stage-wise amounts |
| 112 | Complete chain | Original-owner to final-buyer rate |
| 113 | Mixed-direction reverse chain | Initial cost price |
| 114 | Complete ledger + two selected stages | Difference between stage prices |
| 115 | Transaction table | Final selling price |
| 116 | Trader-chain caselet | Selected trader result |
| 117 | Statement evaluation | Correct overall-rate statement |
| 118 | Algebraic forward/reverse chain | Missing rate |
| 119 | Data sufficiency | Sufficiency classification |
| 120 | Expense-and-commission caselet | Middle trader net result |

## Representation obligations

Dynamic generation must retain authentic presentation for:

- `PNL-QL-115`: table;
- `PNL-QL-116`: caselet;
- `PNL-QL-117`: statement set;
- `PNL-QL-118`: algebraic model;
- `PNL-QL-119`: data sufficiency;
- `PNL-QL-120`: caselet.

These QLs must not be flattened into ordinary paragraph-only questions.

## Parameter rules

1. Generate transaction multipliers from exact rational percentages.
2. Choose initial prices that keep every stage result exact to the paise.
3. For reverse chains, generate the initial price first and derive the final price before presenting the inverse task.
4. For missing-rate QLs, generate the missing stage first, derive the final price and then hide that rate.
5. For commission inverses, choose retained fractions that produce an exact gross amount.
6. Ledger questions must derive all requested amounts from one canonical ledger result.
7. Mixed profit/loss stages must include both directions across the seed sweep.
8. No generated stage may use a loss rate of 100% or more.

## Dynamic answer and distractor contracts

The runtime requires separate answer handling for:

- money;
- percentage with direction;
- stage identifier plus amount;
- ordered stage-wise ledger text;
- statement option;
- data-sufficiency option.

Distractors must be tied to CP-004 misconceptions:

- adding signed rates instead of multiplying stage factors;
- applying every rate to the original price;
- reversing a percentage by subtraction instead of division;
- ignoring buyer expense;
- calculating commission on net receipt instead of gross price;
- comparing gross receipt with purchase price instead of net receipt with effective cost;
- choosing the largest percentage rather than the largest rupee stage amount.

## Proof gate

The permanent proof should generate all 26 QLs across at least 24 seeds:

```text
26 QLs × 24 seeds = 624 packages
```

It must verify:

- contiguous 26-QL ownership;
- deterministic replay;
- seed-driven stem and answer variation;
- canonical solver and independent recomputation agreement;
- exact paise handling;
- four unique options with three misconception labels;
- structured representation preservation;
- no unresolved Editorial V2 placeholders;
- English-only enforcement;
- `NOT_STORED`, test-ineligible and non-public safety.

## Release sequence

1. implement and prove the standalone CP-004 runtime;
2. merge the runtime without changing shared Question Studio behaviour;
3. add CP-004 to the dynamic Question Studio dispatcher in a separate routing PR;
4. keep CP-005, CP-003 and CP-006 rejected until their own runtimes pass equivalent proofs.
