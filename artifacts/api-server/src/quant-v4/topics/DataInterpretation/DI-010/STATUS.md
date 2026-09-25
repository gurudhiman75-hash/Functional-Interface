# DI-010 Frequency Polygon — Multilingual Frozen Controlled Review

`MULTILINGUAL_FROZEN_CONTROLLED_REVIEW` — DI-010 no-decimal frequency-polygon questions are approved in English, Hindi and Punjabi for controlled Question Studio review.

## Authority

- Release: `DI-010-PERMANENT-ENGLISH-REVIEW-P2`
- Canonical problem: `DI-CP-010`
- Question Studio runtime: `DI010_PERMANENT_MULTILINGUAL_REVIEW_V1`
- Permanent QLs: `DI-QL-014` through `DI-QL-026`
- Question Studio discovery: enabled in `CONTROLLED_REVIEW`
- English editorial status: `ENGLISH_REVIEW_APPROVED`
- Localization: `HI_PA_FROZEN`

## Certified P2 task families

Easy: construction property, contextual class-frequency reading, modal class, class interval from class mark.

Medium: total frequency, consecutive-range total, frequency difference, class share of total, histogram bar-height translation.

Hard: zero closing endpoints, range ratio, grouped mean, median class.

## Presentation

The question state remains semantic-only. `DataInterpretation/visuals/frequency-polygon-svg.ts` is the shared presentation authority and keeps straight class-mark segments, zero-frequency closing endpoints and non-leaking labels.

## Lifecycle locks

- `questionStudioDiscoverable: true` in controlled-review mode only
- `questionBankStatus: NOT_STORED`
- `questionBankWritable: false`
- `testEligibility: INELIGIBLE`
- `testEligible: false`
- `mockTestEligible: false`
- `publiclyPublishable: false`
- `automaticStudentPublication: false`
- `productionReleaseAuthorized: false`

Promotion to controlled Question Studio review does not authorize Question Bank writes, tests, mocks, public publication or automatic student publication.


## No-decimal English review revision P2

- question logic: `DI-010-QUESTION-LOGIC-P3`
- arithmetic authority: `EXACT_SOURCE_WITH_EXPLICIT_WHOLE_ROUNDING`
- class widths use integer class marks
- percentage questions explicitly use nearest whole percent
- grouped-mean questions explicitly use nearest whole number
- median explanations use an integer observation position
- answers, options, explanation tables and visible polygon labels contain no decimal values

## Hindi/Punjabi frozen multilingual authority V1

- locales: hi-IN and pa-IN
- 13/13 permanent QLs localized
- 6/6 approved frequency-polygon contexts localized
- chart title, instruction, axes, unit and accessibility description localized
- stems and explanations rebuilt from structured task evidence
- grouped-mean and median working tables localized
- construction-property text options localized while preserving correct-option identity
- numeric/symbolic options and answers remain identical to English
- localized Question Studio activation: CONTROLLED_REVIEW authorized
