# PNL-001 Exhaustive Discovery and Implementation Plan

Status: ACTIVE DISCOVERY
Branch: `feat/pnl-001-exhaustive-discovery`

## Governing rule

PNL-001 will not use a predetermined QL count, solve-mode count, or equal per-CP quota. Counts are outputs of exhaustive coverage discovery. They may be frozen only after concept, transformation, reference-pattern, inverse-form, answer-semantic, distractor, explanation and delivery-format gap audits are clean.

The earlier root blueprint is a seed reference only. Its fixed 10-CP/500-QL structure is not authoritative.

## Ownership boundaries

### Owned by PNL-001
- Cost price, selling price, marked price and effective cost
- Profit/loss amount, rate, ratio and margin transformations
- Markup, discount, rebate, cashback and promotional-equivalent reduction where the core ask is commercial price transformation
- Aggregate results across articles, lots, inventory and sales segments
- Sequential trade and supply-chain transactions
- Dishonest weight, measure, quantity and combined price-quantity fraud
- Overheads, repairs, transport, commission and recovery where the core reasoning is effective cost or net realization
- Break-even and no-profit-no-loss forms embedded in commercial transactions
- Hard mixed commercial caselets whose dominant reasoning is Profit & Loss

### Not owned by PNL-001
- Partnership and time-weighted profit sharing: Ratio/Partnership package
- Adulteration and mixture replacement: Mixture & Alligation package
- Pure GST/tax computation without a Profit & Loss dependency: separate tax/GST ownership
- Interest, depreciation and appreciation as primary concepts: their own packages

## Discovery axes

Every concept family must be crossed against the following axes before it can be considered exhausted:

1. Direction: forward, reverse, missing intermediate, coupled inverse
2. Given basis: CP, SP, MP, effective cost, profit/loss amount, ratio, difference, quantity
3. Unknown semantic: amount, percentage, price, ratio, count, weight, quantity, discount, markup, commission
4. Transaction topology: single, repeated, aggregate, sequential, partial inventory, mixed lot
5. Percentage base: CP, SP, MP, effective cost, billed quantity, delivered quantity
6. Representation: arithmetic, ratio, fraction, algebraic equation, table, statement set, caselet
7. Constraint: equal CP, equal SP, equal profit amount, equal loss amount, target overall result, no-profit-no-loss
8. Composition: one-stage, successive, nested, mixed profit/loss, price-plus-quantity interaction
9. Delivery form: direct question, comparison, missing value, data sufficiency, statement-based, mini-DI
10. Difficulty mechanism: visible formula, hidden base, reverse chain, coupled equations, irrelevant data, multiple constraints

## Seed concept families

These are discovery seeds, not a final solve-mode registry.

### A. Fundamental price relations
- CP/SP to profit or loss amount
- CP/SP to rate
- Amount and base to rate
- CP plus rate to SP
- SP plus rate to CP
- Price ratio to rate and reverse
- Profit/loss expressed as fraction of CP or SP
- Profit margin on SP versus markup on CP
- Difference between two selling conditions

### B. Marked price and reductions
- MP and discount to SP
- SP and discount to MP
- MP and SP to discount
- Successive discounts and equivalent discount
- Fixed rebate plus percentage discount
- Buy-X-get-Y effective discount
- Cashback/coupon/promotion with eligibility constraints
- Reverse missing discount, rebate, MP or quantity

### C. Markup-discount-profit calibration
- CP to MP to SP to net result
- Required markup for target profit after discount
- Required discount for target profit/loss
- Required MP for target realization
- Inverse CP from MP, discount and result
- Multiple successive markups/discounts
- Commission or overhead inserted before or after sale

### D. Multiple articles and aggregate result
- Equal CP, unequal rates
- Equal SP, unequal rates
- Unequal CP/SP with overall result
- One gain and one loss
- Same gain/loss percentage special cases
- Same profit/loss amount at different rates
- Partial inventory sold under different conditions
- Remaining stock and target overall result
- Damaged, free or unsold items
- Find count, quantity, rate or price from aggregate result

### E. Sequential transactions
- A to B to C forward chain
- Reverse original CP or intermediate price
- Mixed gain/loss stages
- Missing stage rate
- Commission-bearing intermediary
- Same object sold repeatedly
- Supply-chain net result versus individual trader result

### F. Dishonest trade
- False weight while selling at stated cost
- False weight with markup/discount
- False buying measure and false selling measure
- Quantity inflation/short delivery
- False length, area or volume
- Price fraud plus quantity fraud
- Reverse target fraud requirement
- Absolute shortage plus percentage price change

### G. Effective cost and recovery
- Repairs, transport, packaging and installation
- Manufacturing cost breakdown
- Wastage and usable-output cost
- Commission deducted from realization
- Required SP after earlier loss
- Recovery across remaining quantity
- CP from difference between selling prices at two rates
- Break-even and no-profit-no-loss quantity/price

### H. Commercial mixed forms
- Tables and mini-caselets
- Multi-condition inverse questions
- Comparison of offers or sellers
- Statement sufficiency
- Missing-value commercial ledgers
- Mixed absolute and percentage changes

## Existing reusable evidence

Quant V2 already contains a substantial seed family registry including direct/reverse CP-SP, marked-price and discount triangles, successive discounts, target-profit calibration, equal-SP and aggregate cases, partial inventory, sequential supply chains, dishonest-dealer variants, promotions, overheads, recovery and multi-condition inverse forms.

These V2 families must be mined for mathematical coverage, but they must not be copied blindly. Each family will be reviewed for:
- correct chapter ownership;
- whether it is a true solve mode or merely a stem variation;
- missing inverse and answer-semantic variants;
- exact arithmetic suitability;
- realistic SSC/Banking/Punjab exam expression;
- multilingual feasibility.

## Implementation checkpoints

### PNL-DISC-001 — Authority and source audit
- Inspect all existing V2 Profit & Loss families, scenarios, motifs, audits and adapters.
- Inspect Quant V4 Percentage, Average and Mensuration architecture for current runtime conventions.
- Build cross-chapter ownership and exclusion map.
- Record source-backed exam patterns from uploaded references and PYQs.

Exit: no unresolved ownership conflict blocks discovery.

### PNL-DISC-002 — Open solve-mode registry
- Create a machine-readable candidate registry.
- Assign stable semantic IDs without freezing total count.
- Record concept family, transformation, topology, base, unknown, answer semantic, verifier and evidence.
- Mark each candidate as SEED, VERIFIED, SPLIT_REQUIRED, MERGE_REQUIRED, DEFERRED or REJECTED.

Exit: all known concept nodes and source patterns map to at least one reviewed candidate.

### PNL-RUNTIME-001 — Representative runtime proof
Build shared exact-arithmetic runtime for:
- money and rational rates;
- price ledger;
- quantity ledger;
- aggregate transaction ledger;
- sequential transaction chain;
- independent forward/reverse verification;
- semantic answer validation;
- distractor and explanation contracts.

Implement only enough representative QLs to prove every major runtime mechanism. This is not a quota milestone.

### PNL-CP implementation
Implement concept families in dependency order. A CP remains open while new meaningful modes are discovered. CP boundaries may be revised when audits show mixed ownership or hidden reasoning differences.

Recommended dependency order:
1. fundamental price relations;
2. marked price and reductions;
3. markup-discount-profit calibration;
4. multiple articles and aggregate result;
5. sequential transactions;
6. dishonest trade;
7. effective cost, recovery and hard commercial caselets.

### PNL-GAP-001 — Exhaustiveness audit
Audit every implemented family against:
- concept ontology;
- discovery-axis matrix;
- V2 family registry;
- uploaded books;
- SSC, Banking and Punjab PYQs;
- direct/reverse symmetry;
- answer-semantic completeness;
- hard mixed forms.

Any meaningful gap reopens discovery and implementation.

### PNL-QL-DEPTH-001 — QL sufficiency audit
For each verified solve mode, determine the QLs required for materially distinct:
- stem archetypes;
- answer semantics;
- difficulty mechanisms;
- distractor misconception sets;
- explanation paths;
- delivery formats;
- contextual constraints.

No QL is added merely to reach a target count.

### PNL-FREEZE-CANDIDATE
Only now report the discovered totals for CPs, solve modes and QLs. Counts remain revisable until automated and manual review close all meaningful gaps.

## Required discovery artifacts

- `library-authority-map.md`
- `concept-ontology.md`
- `solve-mode-candidates.library.json`
- `solve-mode-evidence.md`
- `transformation-matrix.md`
- `reference-pattern-ledger.md`
- `coverage-gap-register.md`
- `implementation-plan.md`
- `freeze-readiness-report.md`

## Immediate next work

1. Mine V2 families and scenarios into the candidate registry.
2. Remove Partnership and other misowned patterns.
3. Split semantic solve modes from cosmetic scenario variants.
4. Identify missing inverse, quantity, ratio and answer-semantic forms.
5. Draft the first machine-readable open solve-mode registry.
6. Only then begin the representative V4 runtime proof.
