# PNL-CP-006 Implementation Status

Status: FREEZE CANDIDATE

Branch: `feat/pnl-001-cp006-effective-cost-recovery`

Count policy: DISCOVERED, NOT QUOTA-DRIVEN

Stable QL range: `PNL-QL-150` through `PNL-QL-186`

## Structural parity

- Task registry: 37
- English: 37
- Hindi: 37
- Punjabi: 37
- Multilingual explanation patterns: 37

## Ownership

CP-006 owns effective cost, manufacturing and wastage-adjusted cost, contribution and break-even, commercial recovery, and commission-adjusted realization where purchase price alone is not the complete commercial base.

Included:

- repairs, transport, packaging, installation and other flat expenses;
- overhead as a percentage of purchase price or purchase plus flat expenses;
- forward and reverse effective-cost relations;
- profit/loss measured on effective cost;
- manufacturing material, labour, prime-cost overhead, packaging and scrap recovery;
- wastage-adjusted usable-output cost;
- fixed cost, variable cost, unit contribution and break-even quantity;
- target-profit quantity and selling price;
- reverse fixed-cost and variable-cost forms;
- contribution-margin ratio and break-even revenue;
- weighted multi-product break-even mix;
- margin of safety;
- recovery after earlier losses or prior recoveries;
- recovery percentage on reduced capital;
- commission deducted from realization and inverse gross-price calibration outside a trader chain.

Excluded to avoid duplication:

- basic CP/SP and selling-price-difference identities owned by CP-001;
- remaining stock, damaged stock and inventory quantity recovery owned by CP-003;
- commission-bearing intermediary chains owned by CP-004;
- dishonest quantity or measure owned by CP-005;
- marked-price discounts and promotions owned by CP-002.

## Runtime

Core solver:

- `foundation/effective-cost-recovery-solver.ts`

Advanced solver:

- `foundation/effective-cost-advanced-solver.ts`

Independent verifier:

- `foundation/cp006-independent-verifier.ts`

Representative proof:

- `pnl-cp-006.test.ts`

## Editorial and QA artifacts

- `distractor-contract.md`
- `explanation-patterns.multilingual.json`
- `explanation-quality-audit.md`
- `cp-006-structural-audit.ts`
- `completion-audit.md`

## Representation coverage

Direct, inverse, table, caselet, statement, algebraic and data-sufficiency forms are present. Representation variants reuse established solver identities.

## Source reconciliation

Coverage was checked against the PNL concept ontology, exhaustive discovery plan and reference-pattern ledger ECR-001 through ECR-006. No unresolved owned pattern remains.

## Execution status

Repository cloning was blocked in the execution container by unavailable outbound DNS. Tests and structural audits are committed but must be executed by PR CI or the consolidated PNL integration pass.

## Reopen rule

Reopen only for a compile/runtime failure, a rendered multilingual defect, or a genuinely distinct source-backed SSC, Banking or Punjab examination mode.
