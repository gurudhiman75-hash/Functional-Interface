# PNL-001 Coverage Gap Register

Status: OPEN
Freeze impact: BLOCKING

## Rule

A gap stays open until it is either implemented, merged with a proven equivalent mode, deferred with an ownership decision, or rejected with mathematical and product justification. Closing a gap never freezes the chapter count; later reference or PYQ audits may reopen discovery.

## Priority definitions

- `P0`: architecture or ownership blocker.
- `P1`: major exam-relevant reasoning gap.
- `P2`: important inverse, answer-semantic or topology gap.
- `P3`: delivery-form or depth gap to resolve before freeze.

## Open gaps

| Gap ID | Priority | Area | Missing coverage | Required action | Status |
|---|---:|---|---|---|---|
| PNL-GAP-001 | P0 | Sources | Uploaded books and PYQs not yet reconciled | Build source index and map every observed pattern | OPEN |
| PNL-GAP-002 | P0 | Ownership | GST/tax boundaries need final cross-chapter decision | Admit only P&L-dominant mixed modes | OPEN |
| PNL-GAP-003 | P1 | Fundamentals | Profit/loss amount direct and reverse forms are incomplete | Split amount answers from rate answers | OPEN |
| PNL-GAP-004 | P1 | Fundamentals | CP:SP ratio to rate and reverse ratio construction | Add ratio transformation candidates and evidence | OPEN |
| PNL-GAP-005 | P1 | Percentage base | Margin on SP versus profit rate on CP | Add cross-base conversion family and verifier | OPEN |
| PNL-GAP-006 | P2 | Fundamentals | Difference between selling conditions with unknown CP/SP/rate | Split by unknown and equation structure | OPEN |
| PNL-GAP-007 | P1 | Discounts | Reverse SP and discount to MP | Add inverse triangle mode | OPEN |
| PNL-GAP-008 | P1 | Discounts | Missing discount in a successive-discount chain | Add coupled inverse mode | OPEN |
| PNL-GAP-009 | P2 | Promotions | Reverse Buy-X-get-Y quantity/count forms | Add quantity-answer modes | OPEN |
| PNL-GAP-010 | P2 | Promotions | Coupon, rebate and cashback operation ordering | Define explicit eligibility and ledger topologies | OPEN |
| PNL-GAP-011 | P1 | Calibration | Multiple successive markups/discounts | Add chained calibration candidates | OPEN |
| PNL-GAP-012 | P1 | Aggregate | Damaged, stolen, free and unsold stock | Build acquired/sold/remaining quantity ledger | OPEN |
| PNL-GAP-013 | P1 | Aggregate | Missing count, rate, CP or SP from target overall result | Split reverse aggregate modes | OPEN |
| PNL-GAP-014 | P2 | Aggregate | Same profit/loss amount under different rates | Verify inverse variants and answer semantics | OPEN |
| PNL-GAP-015 | P1 | Sequential | Missing intermediate price and missing stage rate | Split reverse chain modes | OPEN |
| PNL-GAP-016 | P2 | Sequential | Commission-bearing intermediary | Define gross/net transfer continuity | OPEN |
| PNL-GAP-017 | P1 | Fraud | False buying and false selling measures together | Add dual-side quantity ledger | OPEN |
| PNL-GAP-018 | P1 | Fraud | Reverse target fraud requirement | Solve for false weight, price change or measure | OPEN |
| PNL-GAP-019 | P1 | Fraud | False length, area and volume | Add dimensional scaling families | OPEN |
| PNL-GAP-020 | P2 | Fraud | Absolute shortage mixed with percentage price change | Separate absolute and relative quantity transformations | OPEN |
| PNL-GAP-021 | P1 | Effective cost | Wastage and usable-output effective unit cost | Build production/output ledger | OPEN |
| PNL-GAP-022 | P2 | Effective cost | Fixed versus percentage commission and placement | Split net-realization modes | OPEN |
| PNL-GAP-023 | P1 | Recovery | Partial-sale recovery across remaining quantity | Split target price, rate and quantity unknowns | OPEN |
| PNL-GAP-024 | P1 | Break-even | Break-even quantity and mixed fixed cost | Add revenue-cost equation modes | OPEN |
| PNL-GAP-025 | P2 | Answers | Count, quantity, weight and dimension answer semantics absent from V2 | Extend V4 semantic-answer design | OPEN |
| PNL-GAP-026 | P2 | Exactness | Decimal approximations such as 33.33 need rational representation | Use exact fractions/rates in runtime | OPEN |
| PNL-GAP-027 | P3 | Delivery | Table and mini-DI commercial ledgers | Define shared-data delivery contract | OPEN |
| PNL-GAP-028 | P3 | Delivery | Statement sufficiency | Define sufficiency solver and option semantics | OPEN |
| PNL-GAP-029 | P3 | Editorial | Human-authored stem and explanation diversity standards | Define audits before QL expansion | OPEN |
| PNL-GAP-030 | P3 | Multilingual | Hindi/Punjabi authoring and exposure policy | Keep blocked until natural localization passes review | OPEN |

## Closure evidence required

Each closed item must record:

- final semantic candidate IDs;
- mathematical relation and percentage base;
- independent verifier;
- ownership decision;
- source evidence or symmetry proof;
- representative QL requirements;
- tests and audits that guard regressions.

## Current checkpoint decision

`PNL-DISC-001` is not complete because the repository evidence has been mined but the uploaded reference/PYQ reconciliation remains open. However, the internal concept and transformation discovery is mature enough to proceed to a first open semantic registry expansion while source reconciliation continues in parallel.