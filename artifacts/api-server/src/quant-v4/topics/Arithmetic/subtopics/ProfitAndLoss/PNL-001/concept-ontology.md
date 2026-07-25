# PNL-001 Concept Ontology

Status: ACTIVE DISCOVERY
Count policy: OPEN ENDED

## Rule

This ontology defines concept ownership and discovery coverage. It does not freeze canonical-problem, solve-mode, or QL totals. New nodes must be added whenever references, PYQs, audits, or implementation expose materially distinct reasoning.

## 1. Price entities and ledgers

### 1.1 Core prices
- Cost price (CP)
- Selling price (SP)
- Marked/list price (MP)
- Effective cost after overheads
- Net realization after commission, rebate, cashback, or deductions
- Unit cost and unit selling price
- Total cost and total realization

### 1.2 Amount entities
- Profit amount
- Loss amount
- Discount amount
- Markup amount
- Rebate/cashback amount
- Overhead amount
- Commission amount
- Recovery amount

### 1.3 Rate entities
- Profit percentage on CP
- Loss percentage on CP
- Profit margin on SP
- Markup percentage on CP
- Discount percentage on MP
- Effective discount
- Net commercial change
- Commission rate
- Short-delivery or excess-measure rate

### 1.4 Quantity entities
- Bought quantity
- Billed quantity
- Delivered quantity
- Sold quantity
- Remaining quantity
- Damaged, stolen, spoiled, free, or unsold quantity
- True and false weight/measure
- Usable output after wastage

## 2. Fundamental relation families

- CP and SP to profit/loss amount
- CP and SP to profit/loss rate
- Amount and base to rate
- CP and rate to SP
- SP and rate to CP
- Amount and rate to CP/SP
- CP:SP ratio to rate
- Rate to CP:SP ratio
- Fractional or ratio expression of gain/loss
- Percentage on CP versus margin on SP
- Same transaction expressed through amount, ratio, fraction, or percentage
- Difference between selling prices under two gain/loss conditions
- No-profit-no-loss price

## 3. Marked price, discount, and promotion families

- MP and discount to SP
- SP and discount to MP
- MP and SP to discount amount/rate
- Successive discounts
- Equivalent discount
- Missing one discount in a successive chain
- Fixed rebate plus percentage discount
- Coupon, cashback, or threshold promotion
- Buy-X-get-Y and free-unit effective reduction
- Quantity-linked promotion
- Comparison of offers
- Reverse MP, discount, rebate, quantity, or eligibility threshold

## 4. Markup-discount-profit calibration

- CP to markup to MP
- MP to discount to SP
- Full CP → MP → SP → result chain
- Net profit/loss after markup and discount
- Required markup for target profit
- Required discount for target profit/loss
- Required MP for target realization
- Inverse CP from MP, discount, and result
- Inverse markup from CP, discount, and result
- Multiple markups and/or discounts
- Commission or overhead inserted before sale
- Commission deducted after sale
- Fixed plus percentage commercial adjustments

## 5. Multiple-article and aggregate systems

- Equal CP, different rates
- Equal SP, different rates
- Unequal CP and SP with aggregate result
- One gain and one loss
- Same gain/loss percentage special cases
- Same profit/loss amount at different rates
- Multiple lots with weighted results
- Partial inventory sold at different rates
- Remaining stock required for target result
- Damaged, spoiled, stolen, free, or unsold stock
- Find unknown count, quantity, rate, CP, or SP from aggregate result
- Break-even quantity or selling condition
- Repeated equal-price articles
- Aggregate result with mixed answer semantics

## 6. Sequential transaction systems

- A→B→C forward chain
- Reverse original CP
- Reverse intermediate price
- Mixed gain/loss stages
- Missing stage rate
- Commission-bearing intermediary
- Repeated sale of the same object
- Supply-chain total result versus individual trader result
- Multi-stage chain with fixed charges
- Chain comparison and coupled inverse forms

## 7. Dishonest trade and measure manipulation

- False weight while selling at stated cost
- False weight with price markup or discount
- False buying measure
- False selling measure
- False buying and selling measures together
- Short delivery and quantity inflation
- False length, area, or volume
- Dimensional scaling fraud
- Price fraud plus quantity fraud
- Absolute shortage plus percentage price change
- Reverse false measure for target profit
- Reverse stated price for target profit
- Unit-cost verification against delivered quantity

## 8. Effective cost, overhead, and recovery

- Repairs, transport, packaging, loading, installation
- Manufacturing cost breakdown
- Fixed and variable cost components
- Wastage and usable-output cost
- Commission deducted from realization
- Required SP after overhead
- Required SP after an earlier loss
- Recovery from remaining quantity
- Recovery after damaged or unsold stock
- CP from difference between selling prices at two rates
- Break-even price, rate, or quantity
- No-profit-no-loss after mixed charges

## 9. Representation and delivery forms

Every owned concept must be checked for:
- direct numerical question;
- reverse or missing-value question;
- ratio/fraction form;
- algebraic equation form;
- comparison form;
- table or ledger form;
- statement-based form;
- data sufficiency;
- mini-DI or caselet;
- multi-condition inverse form.

## 10. Difficulty mechanisms

Difficulty is determined by reasoning, not cosmetic number size:
- visible single-step relation;
- hidden percentage base;
- reverse multiplier;
- successive transformations;
- mixed amount and percentage data;
- aggregate weighting;
- quantity-price interaction;
- coupled equations;
- irrelevant information;
- semantic ambiguity between CP-base profit and SP-base margin;
- multi-ledger reconstruction.

## 11. Ownership exclusions

- Partnership/time-weighted profit sharing → Ratio/Partnership
- Mixture/adulteration/replacement as the primary idea → Mixture & Alligation
- Pure GST/tax computation without P&L dependency → tax/GST ownership
- Interest, depreciation, appreciation as primary concepts → respective packages

## 12. Exhaustion condition

A concept node remains open until direct, reverse, answer-semantic, topology, representation, difficulty, distractor, explanation, and source-pattern audits show no meaningful uncovered variant.