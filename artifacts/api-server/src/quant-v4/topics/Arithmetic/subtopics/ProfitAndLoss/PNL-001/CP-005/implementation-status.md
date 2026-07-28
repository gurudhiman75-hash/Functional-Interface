# PNL-CP-005 Implementation Status

Status: FREEZE CANDIDATE

Count policy: DISCOVERED, NOT QUOTA-DRIVEN

Stable QL range: `PNL-QL-121` through `PNL-QL-149`

## Ownership remapping

The legacy blueprint assigned marked-price questions to CP-005. That mathematical ownership is already exhaustively implemented in CP-002. Equal-selling-price questions are owned by CP-003. CP-005 therefore owns the next non-duplicative exam family: dishonest trade through false weight, short quantity, false count, false measure, buying heavy, selling light, and combined price-quantity manipulation.

## Structural parity

- Task registry: 29 entries
- English: 29 entries
- Hindi: 29 entries
- Punjabi: 29 entries
- Multilingual explanation patterns: 29 entries with English, Hindi and Punjabi paths

## Runtime coverage

- False quantity at a quoted price to actual result
- Declared profit/loss plus false quantity to actual rate
- Target actual rate to required delivered quantity
- Target actual rate and false quantity to required charge
- Buying heavy and selling light
- Markup, discount and false quantity combination
- Required markup for target actual rate
- Required discount for target actual rate
- Price increase/decrease combined with short delivery
- Customer effective overcharge due to short delivery
- Actual and declared rates to false quantity
- Actual rate and false quantity to declared rate
- Actual rate, charge and false quantity to true cost price
- Actual amount, charge and false quantity to true cost price
- Dual-cheating target inverses for received and delivered quantity
- Customer effective price per true quantity
- Comparison of two deceptive schemes

## Representation coverage

- Direct word problems
- False count
- False metre
- Table comparison
- Caselet
- Statement selection
- Data sufficiency
- Algebraic inverse

Representation variants reuse existing mathematical solvers and do not inflate solve-mode discovery.

## Engineering evidence

- `dishonest-trade-solver.ts`
- `dishonest-trade-advanced-solver.ts`
- `cp005-independent-verifier.ts`
- `pnl-cp-005.test.ts`
- `cp-005-structural-audit.ts`
- `distractor-contract.md`
- `explanation-patterns.multilingual.json`

## Editorial contract

- Actual profit or loss is measured against the cost of the quantity actually delivered.
- Dealer profit and customer overcharge are treated as different answer semantics.
- Price and quantity changes are composed multiplicatively, never added as percentages.
- Distractors must map to identifiable misconceptions.
- Arbitrary `answer ± constant` distractors are prohibited.

## Deferred execution gate

Node, TypeScript and esbuild execution remains deferred to the consolidated PNL integration pass. CP-005 must reopen if that pass exposes a compile, exact-paise or assertion defect.

## Reopen rule

Reopen only for a runtime/test defect or a genuinely distinct source-backed dishonest-trade mode. Adulteration and mixture questions remain outside this CP unless ownership is explicitly changed.
