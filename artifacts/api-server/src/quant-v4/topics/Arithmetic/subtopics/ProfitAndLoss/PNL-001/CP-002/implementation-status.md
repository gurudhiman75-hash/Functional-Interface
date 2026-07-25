# PNL-CP-002 Implementation Status

Status: FREEZE CANDIDATE
Count policy: DISCOVERED, NOT QUOTA-DRIVEN
Stable QL range: PNL-QL-037 through PNL-QL-068

## Coverage

CP-002 covers marked-price and discount forward/reverse relations, discount amounts, successive and equivalent discounts, missing discounts, markup-discount-profit calibration, required markup/discount inverses, buy-X-get-Y, cashback, coupons, eligibility thresholds, cashback caps and bases, mixed-offer comparisons, fraction/ratio forms, and table/caselet/statement/algebraic representations.

## Structural parity

- Task registry: 32
- English: 32
- Hindi: 32
- Punjabi: 32

## Editorial contract

- Use direct exam-style asks.
- Do not use generic classroom wording such as “What was the result of the transaction?”
- Use approved profit/loss endings where applicable.
- Distractors must map to identifiable misconceptions; arbitrary plus/minus offsets are prohibited.

## Runtime proof and verification

`pnl-cp-002.test.ts` covers representative direct, inverse, promotion, coupon, cashback, cap, fraction, ratio and calibration cases.

`cp002-independent-verifier.ts` recomputes conditional-promotion results and rejects mode/result mismatches.

The final mixed-offer runtime includes minimum-spend coupon versus discount comparison and flat-coupon ordering where the percentage base changes.

## Completion audit

See `completion-audit.md` for solve-mode, representation, multilingual, ownership and QL-depth findings.

## Deferred gate

Node/esbuild execution and repository TypeScript/build checks remain deferred to the consolidated PNL integration pass. Reopen CP-002 if those checks fail.

## Reopen rule

Reopen only for a runtime/test defect or a genuinely distinct reference-book/PYQ mode. Otherwise CP-002 is complete for implementation sequencing.
