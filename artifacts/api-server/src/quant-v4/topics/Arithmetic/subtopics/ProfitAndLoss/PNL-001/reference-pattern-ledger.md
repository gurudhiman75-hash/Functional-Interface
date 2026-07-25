# PNL-001 Reference Pattern Ledger

Status: ACTIVE DISCOVERY
Count policy: OPEN ENDED

## Purpose

This ledger records source-backed Profit & Loss patterns without converting source frequency into a fixed solve-mode or QL quota. A pattern is admitted only when it changes mathematical reasoning, answer semantics, transaction topology, percentage base, inverse structure, or delivery form.

## Evidence classes

- `V2_FAMILY`: existing Quant V2 canonical family.
- `V2_SCENARIO`: existing procedural scenario or motif.
- `LEGACY_BLUEPRINT`: earlier PNL design; useful only as a seed.
- `REFERENCE_BOOK`: uploaded/reference-book pattern.
- `PYQ_SSC`, `PYQ_BANKING`, `PYQ_PUNJAB`: verified previous-year pattern.
- `DERIVED_SYMMETRY`: mathematically required direct/reverse counterpart.
- `GAP_INFERENCE`: required by ontology or transformation audit but not yet source-confirmed.

## Admission states

- `OBSERVED`: source pattern recorded.
- `NORMALIZED`: cosmetic variants merged into one semantic pattern.
- `SPLIT_REQUIRED`: one source family contains multiple solve modes.
- `EVIDENCE_PENDING`: ontology-backed candidate awaiting book/PYQ evidence.
- `DEFERRED`: belongs partly or wholly to another chapter.
- `REJECTED`: not owned by PNL-001.

## Seed pattern ledger

| Pattern key | Normalized pattern | Evidence | State | Notes |
|---|---|---|---|---|
| PNL-RP-FND-001 | CP and SP to profit/loss amount | V2_FAMILY + DERIVED_SYMMETRY | SPLIT_REQUIRED | Profit amount and loss amount need separate semantics. |
| PNL-RP-FND-002 | CP and SP to profit/loss percentage | V2_FAMILY | SPLIT_REQUIRED | Profit and loss branches require base-aware validation. |
| PNL-RP-FND-003 | CP and rate to SP | V2_FAMILY | SPLIT_REQUIRED | Profit and loss directions are distinct. |
| PNL-RP-FND-004 | SP and rate to CP | V2_FAMILY | SPLIT_REQUIRED | Reverse denominator differs for gain and loss. |
| PNL-RP-FND-005 | CP:SP ratio to gain/loss rate | GAP_INFERENCE | EVIDENCE_PENDING | Mandatory ratio transformation. |
| PNL-RP-FND-006 | Profit as percent of SP versus percent of CP | GAP_INFERENCE | EVIDENCE_PENDING | Margin/markup distinction is absent from V2 semantics. |
| PNL-RP-DIS-001 | MP and discount to SP | V2_FAMILY + V2_SCENARIO | NORMALIZED | Direct discount triangle. |
| PNL-RP-DIS-002 | MP and SP to discount amount/rate | V2_FAMILY | SPLIT_REQUIRED | Amount and percentage answers must not share one mode. |
| PNL-RP-DIS-003 | SP and discount to MP | DERIVED_SYMMETRY | EVIDENCE_PENDING | Reverse discount triangle. |
| PNL-RP-DIS-004 | Successive discounts to final SP/equivalent discount | V2_FAMILY + V2_SCENARIO | SPLIT_REQUIRED | Final amount and equivalent-rate answers differ. |
| PNL-RP-DIS-005 | Missing one successive discount | GAP_INFERENCE | EVIDENCE_PENDING | Coupled inverse. |
| PNL-RP-DIS-006 | Buy-X-get-Y effective reduction | V2_FAMILY | SPLIT_REQUIRED | Forward effective discount and reverse quantity forms differ. |
| PNL-RP-DIS-007 | Cashback/coupon/fixed rebate | V2_FAMILY | SPLIT_REQUIRED | Eligibility and order of operations require explicit topology. |
| PNL-RP-CAL-001 | CP → markup → MP → discount → SP → result | V2_FAMILY | SPLIT_REQUIRED | Forward result, target calibration and inverse unknowns are separate. |
| PNL-RP-CAL-002 | Required markup for target profit after discount | V2_FAMILY | OBSERVED | Forward calibration. |
| PNL-RP-CAL-003 | Required discount for target result | V2_FAMILY | OBSERVED | Reverse discount calibration. |
| PNL-RP-CAL-004 | Required MP for target result | V2_FAMILY | OBSERVED | Reverse marked-price calibration. |
| PNL-RP-AGG-001 | Two articles sold at same SP with gain/loss | V2_FAMILY | SPLIT_REQUIRED | Equal rate, unequal rate and inverse forms differ. |
| PNL-RP-AGG-002 | Aggregate result across unequal CP/SP | V2_FAMILY | SPLIT_REQUIRED | Overall amount, rate and missing segment need separate modes. |
| PNL-RP-AGG-003 | Partial inventory under multiple rates | V2_FAMILY | SPLIT_REQUIRED | Forward allocation and reverse count/rate forms differ. |
| PNL-RP-AGG-004 | Damaged, stolen, free or unsold units | GAP_INFERENCE | EVIDENCE_PENDING | Requires quantity ledger. |
| PNL-RP-SEQ-001 | A→B→C forward chain | V2_FAMILY | NORMALIZED | Explicit transaction continuity required. |
| PNL-RP-SEQ-002 | Reverse original CP/intermediate price | V2_FAMILY | SPLIT_REQUIRED | Unknown location changes equation path. |
| PNL-RP-SEQ-003 | Missing stage gain/loss rate | DERIVED_SYMMETRY | EVIDENCE_PENDING | Coupled inverse. |
| PNL-RP-FRD-001 | False selling weight at stated cost price | V2_FAMILY + V2_SCENARIO | OBSERVED | Profit base is cost of delivered quantity. |
| PNL-RP-FRD-002 | Price change plus false quantity | V2_FAMILY | SPLIT_REQUIRED | Price and quantity multipliers interact. |
| PNL-RP-FRD-003 | False buying measure and false selling measure | GAP_INFERENCE | EVIDENCE_PENDING | Requires dual quantity ledger. |
| PNL-RP-FRD-004 | False length, area or volume | GAP_INFERENCE | EVIDENCE_PENDING | Dimensional scaling must be explicit. |
| PNL-RP-FRD-005 | Reverse fraud requirement for target gain | DERIVED_SYMMETRY | EVIDENCE_PENDING | Solve for weight/measure/price change. |
| PNL-RP-ECR-001 | Repairs, transport, packaging or installation in effective cost | V2_FAMILY | SPLIT_REQUIRED | Per-item and lot-level overhead allocation differ. |
| PNL-RP-ECR-002 | Manufacturing-cost breakdown | V2_FAMILY | SPLIT_REQUIRED | Usable-output and wastage variants need separate ledgers. |
| PNL-RP-ECR-003 | Commission deducted from realization | V2_FAMILY | SPLIT_REQUIRED | Commission placement before/after target must be explicit. |
| PNL-RP-ECR-004 | Recovery after earlier loss from remaining stock | V2_FAMILY + GAP_INFERENCE | SPLIT_REQUIRED | Price, rate and quantity unknowns differ. |
| PNL-RP-ECR-005 | CP from difference between SPs at two rates | V2_FAMILY | OBSERVED | Difference equation. |
| PNL-RP-ECR-006 | Break-even/no-profit-no-loss price or quantity | V2_FAMILY + DERIVED_SYMMETRY | SPLIT_REQUIRED | Price and quantity answers are different modes. |
| PNL-RP-MIX-001 | Multi-condition inverse commercial caselet | V2_FAMILY | SPLIT_REQUIRED | Must split by equation topology and unknown semantic. |
| PNL-RP-MIX-002 | Table/mini-DI commercial ledger | GAP_INFERENCE | EVIDENCE_PENDING | Delivery form can introduce multi-row reasoning. |
| PNL-RP-MIX-003 | Statement sufficiency | GAP_INFERENCE | EVIDENCE_PENDING | Delivery-form family, not a formula clone. |
| PNL-RP-XCH-001 | Partnership/time-weighted profit sharing | LEGACY_BLUEPRINT | REJECTED | Owned by Ratio/Partnership. |
| PNL-RP-XCH-002 | Pure GST/tax reconstruction | V2_FAMILY | DEFERRED | Include only when P&L is the dominant dependency. |

## Evidence-completion rule

A pattern may become `VERIFIED` only after:

1. mathematical identity and percentage base are explicit;
2. chapter ownership is resolved;
3. direct/reverse counterparts are checked;
4. answer semantics are enumerated;
5. at least one runtime verifier is identified;
6. source evidence or a documented symmetry proof exists;
7. cosmetic variants are merged and hidden reasoning differences are split.

This ledger remains open until reference books and SSC, Banking and Punjab PYQs have been reconciled.