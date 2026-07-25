# PNL-CP-006 Completion Audit

Status: FREEZE CANDIDATE

## Final discovered scope

Stable QL range: `PNL-QL-150` through `PNL-QL-186`.

- Task registry: 37 entries
- English question library: 37 entries
- Hindi question library: 37 entries
- Punjabi question library: 37 entries
- Multilingual explanation patterns: 37 entries
- Count policy: discovered, not quota-driven

## Owned concept coverage

CP-006 covers commercial questions in which purchase price is not the complete cost base or in which recovery must cover fixed, variable, overhead or earlier-loss components.

Implemented families:

1. Flat repairs, transport, installation, packaging and related expenses.
2. Percentage overhead on purchase price.
3. Mixed flat and percentage overhead with an explicit overhead base.
4. Effective cost to selling price at a profit or loss rate.
5. Selling price and effective cost to profit/loss amount and percentage.
6. Maximum allowable expense for a target commercial result.
7. Reverse total expense and reverse overhead-rate forms.
8. Manufacturing material, labour, prime-cost overhead, packaging and scrap recovery.
9. Wastage-adjusted usable-output cost with and without scrap recovery.
10. Break-even quantity from fixed cost and unit contribution.
11. Target-profit quantity.
12. Break-even selling price per unit.
13. Reverse fixed cost and reverse variable cost from break-even data.
14. Required unit price for a fixed quantity and target absolute profit.
15. Break-even revenue from contribution-margin ratio and the inverse ratio form.
16. Weighted multi-product sales-mix break-even bundles.
17. Margin-of-safety amount and percentage.
18. Recovery after one earlier loss or several prior recoveries.
19. Profit rate required on reduced capital after a loss.
20. Commission deducted from realization outside a trader-chain topology.
21. Required gross selling price after commission for a target result.

## Direct and inverse audit

- Effective cost has forward component addition and reverse expense/overhead forms.
- Manufacturing has total-cost and unit-cost answer semantics.
- Break-even has quantity, price, fixed-cost, variable-cost, revenue and contribution-ratio unknowns.
- Recovery has break-even and target-result forms.
- Commission has forward net-result and inverse gross-price forms.
- Loss recovery has an explicit reduced-base inverse.

No remaining inverse is mathematically distinct without crossing into another CP's ownership.

## Representation audit

Included delivery forms:

- direct numerical;
- reverse/missing value;
- table;
- caselet;
- statement selection;
- algebraic expression;
- data sufficiency.

Representation QLs reuse the appropriate runtime identity and do not inflate the solve-mode inventory.

## Structural audit

`cp-006-structural-audit.ts` checks:

- contiguous IDs from 150 through 186;
- registry/English/Hindi/Punjabi/explanation count parity;
- identical ID sets;
- exact placeholder parity across all three languages;
- equality between required variables and visible stem placeholders;
- minimum explanation depth in all languages.

## Runtime and verification

Runtime files:

- `foundation/effective-cost-recovery-solver.ts`
- `foundation/effective-cost-advanced-solver.ts`

Independent verification:

- `foundation/cp006-independent-verifier.ts`

Representative proof:

- `pnl-cp-006.test.ts`

The proof covers flat and percentage overhead, target expense, wastage, manufacturing with scrap, all major break-even inverses, contribution-margin revenue, product mix, margin of safety, multi-recovery targets, reduced-capital recovery and commission-adjusted realization.

## Distractor audit

`distractor-contract.md` permits only identifiable misconception families, including wrong percentage base, omitted overhead, ignored wastage/scrap, contribution confusion, failure to round quantity upward, wrong margin-of-safety base, symmetric gain/loss assumptions and gross/net commission confusion.

Arbitrary nearby numerical offsets are prohibited.

## Source and ownership reconciliation

The final inventory was checked against:

- `concept-ontology.md` effective-cost, overhead and recovery nodes;
- `reference-pattern-ledger.md` ECR-001 through ECR-006;
- the exhaustive discovery axes for direction, unknown semantic, base, topology and representation.

Ownership exclusions:

- direct CP/SP difference and two-rate price-difference inverses remain in CP-001;
- remaining inventory, damaged stock and unsold quantity remain in CP-003;
- intermediary chain commission remains in CP-004;
- false quantity and measure manipulation remain in CP-005;
- marked-price discounts and promotions remain in CP-002.

## Deferred execution gate

The container could not clone GitHub because outbound DNS was unavailable. The source files, proof and executable structural audit are committed, but repository TypeScript/Node execution must be confirmed by PR CI or the consolidated PNL integration pass.

A compile, runtime or structural failure must reopen CP-006.

## Freeze decision

No meaningful uncovered CP-006 solve mode remains after effective-cost, manufacturing, wastage, contribution, break-even, recovery, commission, inverse, answer-semantic, representation, multilingual, explanation and distractor audits.

Reopen only for:

- an execution defect;
- a placeholder or translation defect found in rendered review;
- or a genuinely distinct source-backed SSC, Banking or Punjab exam pattern.
