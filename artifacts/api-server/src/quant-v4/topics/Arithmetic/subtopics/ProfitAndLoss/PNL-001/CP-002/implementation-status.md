# PNL-CP-002 Implementation Status

Status: ACTIVE DISCOVERY AND IMPLEMENTATION
Count policy: OPEN ENDED

## Implemented runtime-backed modes

- Marked price and discount percentage to selling price
- Marked price and selling price to discount percentage
- Selling price and discount percentage to marked price
- Marked price and discount percentage to discount amount
- Marked price and discount amount to discount percentage
- Marked price and discount amount to selling price
- Successive discounts to final selling price
- Successive discounts to a single equivalent discount
- Known discount and equivalent discount to missing successive discount
- Single discount versus successive discounts, including the better offer and rupee difference
- Cost price, markup and discount to selling price and profit/loss result
- Marked price, cost price and target profit/loss rate to required discount
- Cost price, discount and target profit/loss rate to required markup
- Buy-X-get-Y to equivalent discount and effective unit price
- Flat and percentage cashback to effective price
- Discount followed by a flat coupon
- Discount offer versus cashback offer comparison
- Three or more successive discounts to final selling price
- Minimum-spend coupon eligibility and effective price
- Discount followed by a percentage coupon
- Percentage cashback with a maximum cap
- Cashback calculated on original marked price after discount
- Discount fraction to discount percentage
- Paid-price to marked-price ratio to discount percentage

## Current QL discovery set

PNL-QL-037 through PNL-QL-063 are runtime-backed discovery QLs: 27 English entries. This count remains open and does not define the final size of CP-002.

## Editorial rules carried forward from CP-001 review

- Use direct exam-style asks rather than generic phrases such as “What was the result of the transaction?”
- Approved profit/loss endings include “Find the profit or loss incurred”, “Calculate the profit or loss made by the retailer”, “Find the profit or loss percentage”, and “Calculate the percentage gain or loss” where semantically appropriate.
- Distractors must map to identifiable misconceptions. Arbitrary plus/minus offsets are prohibited.
- Typical discount distractors should reflect wrong percentage bases, treating successive discounts as additive, reversing retained-value multipliers, ignoring coupon eligibility or cashback caps, confusing billed price with effective cost, and applying cashback to the wrong base.

## Runtime proof

`pnl-cp002-runtime-proof.test.ts` covers:

- equivalent successive discounts
- buy-X-get-Y equivalence
- three-stage successive discounts
- coupon eligibility and ineligibility
- capped cashback
- cashback on original marked price after discount
- fraction and ratio discount conversions

Execution remains deferred until the repository-level test/build pass, consistent with the current PNL workflow.

## Pending discovery and completion work

- Mixed-offer comparison where eligibility differs by minimum spend
- Table, caselet and statement/data-sufficiency forms
- Hindi and Punjabi parity
- CP-specific independent verifier beyond example assertions
- Placeholder, duplicate, semantic and QL-depth audits
- Reference-book and PYQ reconciliation

## Exit rule

CP-002 may be frozen only after direct/reverse symmetry, promotion ownership, marked-price-profit calibration, reference-book reconciliation, QL-depth, multilingual parity and realistic-distractor audits show no meaningful uncovered mode.
