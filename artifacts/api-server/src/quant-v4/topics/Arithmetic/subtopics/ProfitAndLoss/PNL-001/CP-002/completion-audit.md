# PNL-CP-002 Completion Audit

Status: FREEZE CANDIDATE

## Discovered scope

Stable QL range: PNL-QL-037 through PNL-QL-068.

- Task registry: 32 entries
- English: 32 entries
- Hindi: 32 entries
- Punjabi: 32 entries
- Count policy: discovered, not quota-driven

## Solve-mode coverage

The CP covers direct and inverse marked-price/discount relations, discount amount forms, two and three-plus successive discounts, equivalent and missing discounts, offer comparison, markup-discount-profit calibration, required markup/discount inverses, buy-X-get-Y, flat and percentage cashback, capped cashback, flat and percentage coupons, minimum-spend eligibility, cashback-base distinctions, fraction and ratio forms, and mixed-offer eligibility comparison.

## Representation coverage

The library includes direct word problems, inverse forms, comparison questions, table selection, caselet, statement and algebraic presentations. These representation entries reuse existing mathematical solvers and do not inflate the solve-mode count.

## Editorial audit

- Direct exam-style asks are used.
- Generic classroom wording such as “What was the result of the transaction?” is prohibited.
- Profit/loss prompts use the approved forms where applicable.
- Distractors must correspond to identifiable misconceptions: wrong percentage base, additive successive discounts, reversed retained multipliers, ignored eligibility/caps, billed-versus-effective price confusion, wrong cashback base, or wrong coupon order.

## Structural audit

- Registry IDs are contiguous from PNL-QL-037 to PNL-QL-068.
- English, Hindi and Punjabi libraries have structural parity.
- Required variables are registered per QL.
- Promotion semantics distinguish immediate discount, billed amount, later cashback, coupon eligibility and effective cost.
- Table/caselet/statement entries do not introduce duplicate solver modes.

## Runtime proof

Representative tests cover direct discounts, equivalent and missing successive discounts, markup-discount calibration, buy-X-get-Y, coupons, cashback comparisons and caps, three-stage discounts, and fraction/ratio conversions.

The CP-specific verifier recomputes conditional-promotion results and rejects mode or result mismatches.

## Ownership boundary

Included: marked price, discount, successive discounts, markup-discount calibration, retail promotions, coupons and cashback.

Excluded: multiple-article inventory, sequential trade, dishonest trade, effective-cost overhead/recovery and pure tax/GST ownership.

## Deferred execution gate

The Node/esbuild proof and repository TypeScript/build checks remain deferred to the consolidated PNL integration pass. This CP must reopen if execution exposes a defect.

## Freeze decision

No meaningful uncovered CP-002 solve mode remains after the direct/reverse, promotion-semantics, conditional-eligibility, representation and QL-depth audits. Reopen only for a test failure or a genuinely distinct reference-book/PYQ pattern.
