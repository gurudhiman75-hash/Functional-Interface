# DSF-CP-018 — Reasoning Hindi/Punjabi Localization Review

Date: 2026-10-01

Status: **REVIEW-ONLY localization expansion**

## Scope

This checkpoint extends the normal DSF Question Studio review surface to Hindi and Punjabi for the seven reasoning lanes introduced through CP012/CP013:

1. Ranking & Order
2. Direction Sense
3. Blood Relations
4. Inequality
5. Seating Arrangement
6. Coding-Decoding
7. Calendar

The four legacy Quant lanes continue to use the already approved CP008–CP010 localization route.

The ten newer Quant expansion lanes from CP011 remain English-only until the next localization wave.

## Architecture

Localization is generated from structured DS metadata rather than free-form machine translation.

The CP018 localizer uses:

- lane identity;
- solve mode;
- context identity;
- structured Statement I / II records;
- sufficiency semantic class;
- proof target-answer sets;
- preserved correct index and canonical semantic answer.

Learner-facing Hindi/Punjabi text is rebuilt from those authorities.

## Safety boundary

CP018 remains Question Studio review-only:

- Question Studio discoverable: true
- review persistence: true
- Question Bank writable: false
- scored test eligible: false
- mock-test eligible: false
- publicly publishable: false
- automatic learner publication: false
- human language review required: true

No previously approved CP010 localized production scope is rewritten.

## Executable proof

`reasoning-localization-v1.test.ts` validates all seven reasoning lanes in both Hindi and Punjabi.

For each language/lane it checks:

- deterministic generation;
- semantic-class parity against English;
- correct-index parity against English;
- five-option DS contract;
- exactly two statements;
- language-aware Question Studio identity;
- no common English learner-prose leakage;
- review-only lifecycle locks.

Current CP018 direct sample: **70 localized questions** plus corresponding English controls.

## Remaining localization work

The following CP011 Quant expansion lanes still need native Hindi/Punjabi review surfaces:

- Average
- Ages
- Profit, Loss & Discount
- Simple & Compound Interest
- Time & Work / Pipes & Cisterns
- Time, Speed & Distance / Trains / Boats
- Mixture & Alligation
- Mensuration 2D & 3D
- Ratio / Percentage / Number System enrichment
- Algebra enrichment

Final DSF multilingual closure must not be claimed until those ten lanes are localized and audited.
