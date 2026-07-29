# PNL-001 QL-070 Data-Sufficiency Correction

## Corrected contract

- The lead states only the decision target and contains no cost price, marked price or target rate.
- Statement I supplies cost price and the target profit/loss condition.
- Statement II supplies marked price.
- Neither statement alone is sufficient; both together determine the discount.

## Authoritative source alignment

- English is generated through a QL-specific override in the legacy Editorial V2 builder.
- Hindi and Punjabi are generated through QL-specific native entries in the multilingual normalizer.
- The ordinary `MP_CP_TARGET_RATE_TO_DISCOUNT` explanation used by direct-calculation QL-049 remains unchanged.
- Committed English, Hindi and Punjabi Editorial V2 libraries are regenerated from their authorities and checked for exact parity.

## Updated surfaces

English, Hindi and Punjabi Editorial V2 sources, question-language templates, task-registry variables, CP-002 dynamic generation, compressed canonical review data, Question Studio integration, English editorial audit and permanent lead-insufficiency regressions.

## Proof obligations

- The visible lead must contain no rupee amount or percentage before Statement I.
- Statement I must carry cost price plus the target profit/loss condition.
- Statement II must carry marked price.
- The keyed answer and correct option must be `Both statements together are required`.
- Dynamic and canonical-review packages must preserve review-only lifecycle metadata.

## Safety boundary

Runtime publication status remains unchanged: dynamic candidates are unreviewed, not stored, test-ineligible and non-public; canonical review remains review-only.
