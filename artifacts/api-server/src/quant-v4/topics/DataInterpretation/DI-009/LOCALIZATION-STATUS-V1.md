# DI-009 Histogram — Hindi/Punjabi Localization Review V1

Status: HI_PA_FROZEN · CONTROLLED_QUESTION_STUDIO_REVIEW

## Scope

- English authority remains DI-QL-001 through DI-QL-013.
- Hindi locale: hi-IN.
- Punjabi locale: pa-IN.
- All 13 permanent histogram task families localized.
- All six approved histogram contexts localized.
- Histogram title, instruction, x-axis label, y-axis label, unit and accessibility description localized.
- Question stems are generated from structured task evidence rather than blind whole-string replacement.
- Question-specific explanations and required working tables are localized.
- Histogram bins, frequencies, class width, distribution shape, options, correct index and canonical answer remain identical to English.

## Routing correction

DI-009 now recognizes only its owned permanent QLs DI-QL-001 through DI-QL-013. It no longer treats every DI-QL-* identifier as a DI-009 request.

## Review safeguards

- Roman-letter learner-surface leakage is prohibited in Hindi/Punjabi.
- Visible histogram text rendered by the shared visual layer is checked for native-script parity.
- At least three stem surfaces per permanent QL are exercised in both locales.
- Deterministic replay is required.
- Numeric/arithmetic parity with the approved English authority is required.
- Learner-facing numeric values are integer-only. Percentage, grouped-mean and grouped-mode questions explicitly use nearest-whole answers; working tables and histogram axis labels contain no decimals.
- Question Studio supports English, Hindi and Punjabi in CONTROLLED_REVIEW.
- Question Bank remains NOT_STORED.
- Tests and mocks remain INELIGIBLE.
- Public/student publication remains disabled.
- Production release remains unauthorized.

## Next gate

Question Bank, tests, mocks, public/student publication and production release remain closed. Any widening beyond controlled Question Studio review requires a later explicit release decision.
