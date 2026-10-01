# DSF-CP-019 — Quant Hindi/Punjabi Localization Expansion

Date: 2026-10-01

Status: **Wave 01 — review-only**

## Wave 01 localized lanes

1. Average
2. Ages
3. Profit, Loss & Discount
4. Simple & Compound Interest

Hindi and Punjabi learner text is rebuilt from structured DS metadata and source statement families. The source solver, canonical sufficiency class, correct option index and proof state remain unchanged.

## Lifecycle boundary

This wave is available only in normal Question Studio review:

- Question Studio discoverable: true
- review persistence: true
- human language review required: true
- Question Bank writable: false
- test eligible: false
- mock-test eligible: false
- publicly publishable: false
- automatic learner publication: false

The older CP010 approved multilingual production scope is not retroactively changed.

## Executable proof

`quant-localization-wave-01-v1.test.ts` checks Hindi and Punjabi against English controls for all four lanes.

Direct audit surface:

- 4 lanes
- 2 localized languages
- 8 localized questions per lane/language
- 64 localized questions
- 64 corresponding English controls
- semantic-class parity
- correct-index parity
- two-statement / five-option contract
- English prose leakage guard
- review-only lifecycle locks

## Remaining CP011 Quant localization

The following six lanes remain English-only after Wave 01:

- Time & Work / Pipes & Cisterns
- Time, Speed & Distance / Trains / Boats
- Mixture & Alligation
- Mensuration 2D & 3D
- Ratio / Percentage / Number System enrichment
- Algebra enrichment

Do not claim full DSF multilingual closure until these six lanes are localized and audited.
