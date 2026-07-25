# PNL-001 Library Authority Map

Status: ACTIVE DISCOVERY

## Authority order

1. PNL-001 V4 discovery artifacts on `feat/pnl-001-exhaustive-discovery`
2. Current Quant V4 runtime contracts and package conventions
3. Source-backed SSC, Banking and Punjab exam patterns from uploaded books/PYQs
4. Quant V2 Profit & Loss families, generators, validators and audit tooling
5. The root `PNL_001_PROFIT_LOSS_BLUEPRINT.md` as historical seed material only

The root blueprint is not authoritative where it fixes CP or QL counts, duplicates root/foundation runtime files, assigns Partnership to PNL, assumes immediate multilingual production readiness, or uses approximate decimal rates in place of exact arithmetic.

## Owned by PNL-001

- CP, SP, MP and effective-cost relations
- Profit/loss amount, percentage, ratio and selling-price margin transformations
- Discount, successive discount, fixed rebate and commercial promotion equivalence
- Markup-discount-profit calibration
- Multi-article, lot, inventory and aggregate result problems
- Sequential trade and supply-chain price transformations
- Dishonest weight, measure, quantity and combined price-quantity fraud
- Repairs, transport, packaging, manufacturing components and commission where the dominant reasoning is effective cost or net realization
- Recovery, no-profit-no-loss and break-even forms embedded in commercial transactions
- Mixed commercial caselets where Profit & Loss is the dominant reasoning system

## Conditionally owned

### Coupons, cashback and promotions

Owned when the primary task is effective price, effective discount, realization or profit/loss. Deferred when the task is mainly consumer-policy interpretation unrelated to arithmetic transformation.

### Commission

Owned when commission changes effective cost or net realization in a Profit & Loss problem. Separate commission-only calculation should not inflate PNL coverage.

### Wastage and usable output

Owned when wastage changes effective unit cost or required selling price. Mixture composition and replacement remain outside PNL.

### GST and tax

Owned only when tax is a secondary ledger component and the dominant unknown remains profit, loss, effective cost or net realization. Pure GST, tax-inclusive price reconstruction and input-credit reasoning belong to a tax/GST package.

## Explicit exclusions

| Pattern | Owner | PNL decision |
|---|---|---|
| Partnership and time-weighted profit sharing | Ratio/Partnership | REJECTED |
| Adulteration, replacement and mixture ratio | Mixture & Alligation | REJECTED |
| Pure GST/tax calculations | GST/Tax | DEFERRED |
| Interest, depreciation and appreciation as primary concept | Respective packages | REJECTED |
| Ratio-only distribution with no commercial price ledger | Ratio | REJECTED |

## Reusable V2 sources

### Canonical family registry

`artifacts/api-server/src/quant-v2/canonical/profit-loss-types.ts`

Use for candidate discovery and evidence. Do not inherit its answer-semantic limits or assume each family equals one final solve mode.

### Procedural scenarios

`artifacts/api-server/src/lib/quant-scenarios/profit-loss-scenarios.ts`

Use only as low-level examples of direct CP/SP percentage, discount, successive discount and dishonest-weight mechanics. These scenarios are too narrow and use floating-point/approximate rate choices, so they are not V4 runtime authority.

### Motif scope and frameworks

`artifacts/api-server/src/lib/motifs/quant/profit-loss.ts`

Use for conceptual primitives, hidden structures and distractor families. Its motif list is intentionally broad but incomplete for exhaustive V4 coverage.

### Independent solver and audit tooling

- `artifacts/api-server/src/quant-v2/validators/profit-loss-independent-solver.ts`
- `artifacts/api-server/src/quant-v2/devtools/profit-loss-large-audit.ts`
- `artifacts/api-server/src/quant-v2/devtools/pyq-gap-audit.ts`

Mine validation ideas, degeneracy checks, option consistency, realism checks, multilingual leakage checks and stress-preview patterns. Reimplement against V4 package contracts rather than importing V2 runtime directly.

## Rules for inheriting a V2 family

A V2 family may become a V4 solve mode only after all checks pass:

1. PNL owns the dominant reasoning.
2. It is mathematically distinct rather than a cosmetic stem variation.
3. Its percentage base and answer semantic are explicit.
4. Forward and reverse verification can be defined.
5. Exact arithmetic can replace approximate floating-point behavior.
6. It supports realistic exam-style stems and authentic misconception distractors.
7. It does not duplicate another family under different naming.
8. Missing inverse or answer-semantic variants are recorded rather than silently ignored.

## Current authority decisions

- `pl_gst_after_discount`: DEFERRED pending dominant-reasoning split.
- `pl_tax_inclusive_back_calc`: DEFERRED to GST/Tax.
- `pl_profit_after_commission_tax`: SPLIT_REQUIRED into commission-owned PNL forms and tax-owned forms.
- `pl_multi_condition_inverse_absolute`: SPLIT_REQUIRED by unknown semantic and equation topology.
- `pl_partial_inventory_allocation`: SPLIT_REQUIRED into forward aggregation and reverse missing-segment families.
- `pl_manufacturing_breakdown`: SPLIT_REQUIRED into component-cost and usable-output/wastage ledgers.
- `pl_cashback_coupon_discount`: SPLIT_REQUIRED because coupon, cashback and threshold eligibility have different timing and price semantics.

## Count policy

Neither this authority map nor the candidate registry establishes a final CP, solve-mode or QL count. Counts remain open until the reference-pattern ledger, transformation matrix, direct/reverse audit, answer-semantic audit and QL-depth audit are complete.
