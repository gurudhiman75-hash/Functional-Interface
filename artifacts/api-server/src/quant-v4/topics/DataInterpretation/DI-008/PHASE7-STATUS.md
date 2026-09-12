# DI-008 Arithmetic DI Phase 7

Status: `RUNTIME_VERIFIED_REVIEW_PENDING`

Scope:
- Banking Prelims and Banking Mains only.
- Five linked questions per shared product-economics dataset.
- Mixed percentage, ratio, average, profit/loss and revenue-contribution arithmetic.
- Prelims keeps direct single-product forms where appropriate.
- Mains requires multi-product aggregation/weighting before solving.
- Five options in both profiles.
- Deterministic seeded generation and materially separate independent verification.

Verified proof (`Quant V4 DI arithmetic P7`, run `34112637774`):
- 200 generated sets across 100 seeds × 2 banking profiles.
- 1,000 linked questions.
- 200 deterministic replay checks.
- 1,000 independent verification checks.
- 5,000 option checks / 1,000 five-option child checks.
- 100 cross-profile shared-stimulus checks.
- 1,000 learner-surface checks.
- 100 distinct stimuli.
- all five configured growth rates exercised: 10%, 20%, 25%, 40%, 50%.
- all five configured profit rates exercised: 10%, 20%, 25%, 40%, 50%.
- 500/500 Mains multi-product aggregation checks.
- 300/300 Prelims direct-task checks.
- every product index occupied every primary task role in both profiles.
- every task/profile reached all answer positions A-E.
- permanent 100-seed × 2-profile option-collision scan: zero failures.
- patch hygiene: PASS.

Defect repaired during proof:
- `DI-008-PHASE7-99 / BANKING_MAINS` produced equal revenue groups, so the correct and reversed ratios both simplified to `1:1`, while two pair-total distractors both simplified to `1:2`.
- The task now includes genuine profit-ratio, previous-period-unit-ratio and weighted-average-selling-price-ratio misconception paths. Equal-revenue states remain valid; no random filler or state exclusion was introduced.

Lifecycle lock remains unchanged:
- Question Studio discovery: OFF
- Question Bank: NOT_STORED
- Test eligibility: INELIGIBLE
- Public publication: false
- Permanent QLs: not allocated
- Localization: not started

Next gate is human/source editorial review and eventual permanent-contract allocation, not student publication.
