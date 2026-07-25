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
- Buy-X-get-Y promotion to equivalent discount
- Buy-X-get-Y promotion to effective unit price
- Flat cashback to effective price
- Percentage cashback to effective price
- Percentage discount followed by a flat coupon to effective price
- Discount offer versus cashback offer comparison

## Current QL discovery set

PNL-QL-037 through PNL-QL-056 are runtime-backed discovery QLs. They do not define the eventual size of CP-002.

## Editorial rules carried forward from CP-001 review

- Use direct exam-style asks rather than generic phrases such as “What was the result of the transaction?”
- Approved profit/loss endings include “Find the profit or loss incurred”, “Calculate the profit or loss made by the retailer”, “Find the profit or loss percentage”, and “Calculate the percentage gain or loss” where semantically appropriate.
- Distractors must map to identifiable misconceptions. Arbitrary plus/minus offsets are prohibited.
- Typical discount distractors should reflect wrong percentage bases, treating discount percentages as additive amounts, adding successive discounts directly, reversing retained-value multipliers, confusing marked price with selling price, or treating cashback as an immediate bill reduction when the question distinguishes the two.

## Pending discovery

- Three or more successive discounts as explicit representation and inverse forms
- Coupon-order semantics and minimum-spend conditions
- Cashback calculated on billed price versus paid price
- Fraction, ratio, algebraic and statement presentations
- Table and caselet forms
- Hindi and Punjabi libraries after English semantic coverage stabilises
- Independent verifier and CP-specific runtime proof

## Exit rule

CP-002 may be frozen only after direct/reverse symmetry, promotion ownership, marked-price-profit calibration, reference-book reconciliation, QL-depth and realistic-distractor audits show no meaningful uncovered mode.
