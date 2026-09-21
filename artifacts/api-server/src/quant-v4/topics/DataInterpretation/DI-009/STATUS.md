# DI-009 Histogram — Permanent English Controlled Review

`APPROVED_CONTROLLED_REVIEW_P1` — the user-approved DI-009 histogram package has been promoted to permanent English Question Studio review authority. Question Bank writes, test/mock eligibility, public publication and automatic student publication remain disabled.

## Permanent authority

- Release: `DI-009-PERMANENT-ENGLISH-REVIEW-P1`
- Canonical problem: `DI-CP-009`
- Question Studio runtime: `DI009_PERMANENT_ENGLISH_REVIEW_P1`
- Permanent QLs: `DI-QL-001` through `DI-QL-013`
- Question Studio discovery: enabled in `CONTROLLED_REVIEW`
- English editorial status: `ENGLISH_REVIEW_APPROVED`
- Localization: `HI_PA_REVIEW_CANDIDATE`

## Architecture contract

DI-009 keeps the original-DI data-first architecture while the no-decimal learner policy advances question logic:
- question logic: `DI-009-QUESTION-LOGIC-V3`
- set/stimulus contract remains `DI-009-SET-CONTRACT-V3`
- arithmetic authority: `EXACT_SOURCE_WITH_EXPLICIT_WHOLE_ROUNDING`
- presentation authority is `DATA_INTERPRETATION_SHARED_VISUALS`
- `Di009Stimulus` stores semantic histogram data only
- no SVG or other presentation markup is stored in the question set
- Question Studio and review exports render the histogram through `DataInterpretation/visuals/histogram-svg.ts`

## Permanent QL ownership

- `DI-QL-001` direct class frequency
- `DI-QL-002` total frequency
- `DI-QL-003` combined range total
- `DI-QL-004` above-boundary total
- `DI-QL-005` below-boundary total
- `DI-QL-006` range ratio
- `DI-QL-007` class share of total
- `DI-QL-008` frequency difference between classes
- `DI-QL-009` modal class identification
- `DI-QL-010` median class identification
- `DI-QL-011` kth-observation class
- `DI-QL-012` approximate grouped mean from histogram
- `DI-QL-013` approximate grouped mode from histogram

## Question engine

The approved V2 engine remains unchanged in scope:
- 13 histogram task families
- 5-question mixed sets with 1 Easy + 2 Medium + 2 Hard
- 5–9 continuous equal-width classes
- six controlled distribution shapes
- cumulative-frequency, grouped mean and grouped mode reasoning
- misconception-owned distractors
- beginner-readable question-specific explanations

## Shared histogram presentation

The accepted-for-now visual remains presentation-only:
- balanced multicolour contiguous bars
- horizontal reading guides
- one horizontal baseline
- no vertical y-axis spine or y-axis tick lines
- no downward class-boundary ticks
- centered class-interval labels
- headroom above the tallest bar
- no bar-value labels

The presentation can be refined later without changing question semantics or permanent QL ownership.

## Lifecycle locks

- `questionStudioDiscoverable: true` via the permanent Question Studio adapter
- `questionStudioMode: CONTROLLED_REVIEW`
- `questionBankStatus: NOT_STORED`
- `questionBankWritable: false`
- `testEligibility: INELIGIBLE`
- `testEligible: false`
- `mockTestEligible: false`
- `publiclyPublishable: false`
- `automaticStudentPublication: false`
- `productionReleaseAuthorized: false`
- Hindi/Punjabi localization is a review candidate; manual localized approval remains required before multilingual Question Studio activation

## Proof

The promotion keeps the 240-set / 1,200-question deterministic and independent-verification matrix, separately validates the shared renderer, and adds a Question Studio integration gate covering all 13 permanent QLs, deterministic fixed-seed previews, semantic-stimulus purity, shared-renderer usage, and lifecycle locks.


## Hindi/Punjabi localization candidate V1

- locales: hi-IN and pa-IN
- 13/13 permanent QLs localized
- 6/6 approved histogram contexts localized
- chart title, axes, unit and accessibility description localized
- question stems and explanations rebuilt from structured task evidence
- required working tables localized
- histogram bins/frequencies, options, correct index and answers remain identical to English
- DI-009 QL routing narrowed to DI-QL-001 through DI-QL-013
- permanent grouped-mode generation now retries deterministically only when the first histogram cannot support the grouped-mode formula, preserving valid first-seed outputs while making DI-QL-013 total for fixed-seed requests
- localized Question Studio activation: NOT AUTHORIZED pending human review
- learner-facing numeric values are integer-only: percentage, grouped-mean and grouped-mode results use an explicit nearest-whole instruction; class intervals use integer midpoints; working tables and histogram axis labels contain no decimals
