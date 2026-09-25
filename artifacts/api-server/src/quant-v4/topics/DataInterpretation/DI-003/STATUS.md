# DI-003 Grouped Bar Interpretation

Status: PERMANENT ENGLISH CONTROLLED REVIEW

## Authority

- Release: `DI-003-PERMANENT-ENGLISH-REVIEW-P2`
- Canonical problem: `DI-CP-003`
- Question Studio runtime: `DI003_PERMANENT_ENGLISH_REVIEW_P2`
- Permanent QLs: `DI-QL-037` through `DI-QL-048`
- Question Studio discovery: enabled in `CONTROLLED_REVIEW`
- English editorial status: `ENGLISH_REVIEW_APPROVED`
- Localization: `HI_PA_REVIEW_CANDIDATE`

## Approved V2 learner surface

- Representation: grouped bar chart with two visible series and five categories
- 12 permanent task families
- Set mix: exactly 1 Easy + 2 Medium + 2 Hard
- SSC CGL Tier I: 4 options
- Banking Prelims: 5 options
- Shared grouped-bar renderer separated from semantic question state
- Misconception-owned distractors with dedicated percentage plausibility audit
- Simple question-specific explanations; multi-step tasks may include working tables

## Qualification evidence

The approved V2 checkpoint is guarded by deterministic/diversity/independent verification across 240 sets / 1,200 questions, visual structural checks, percentage-distractor plausibility proof, legacy DI-003 regression, Question Studio integration proof, API build and patch hygiene.

## Lifecycle locks

Controlled review does **not** authorize downstream publication:

- `questionBankStatus: NOT_STORED`
- `questionBankWritable: false`
- `testEligibility: INELIGIBLE`
- `testEligible: false`
- `mockTestEligible: false`
- `publiclyPublishable: false`
- `automaticStudentPublication: false`
- `productionReleaseAuthorized: false`
- manual approval remains required for any later widening of authority


## No-decimal English review revision P2

- question logic: `DI-003-QUESTION-LOGIC-V3`
- arithmetic authority: `EXACT_SOURCE_WITH_EXPLICIT_WHOLE_ROUNDING`
- percentage increase uses explicit nearest-whole-percent wording
- category share uses explicit nearest-whole-percent wording
- total-series percentage excess uses explicit nearest-whole-percent wording
- series average remains exact with the certified source pools
- answers, options, explanations, working tables and visible chart labels contain no decimal learner values
- shared grouped-bar accessibility description is now localizable

## Hindi/Punjabi localization candidate V1

- locales: hi-IN and pa-IN
- 12/12 permanent QLs localized
- 6/6 approved grouped-bar contexts localized
- chart title, instruction, category labels, series labels, vertical axis, unit and accessibility description localized
- stems and explanations rebuilt from structured task evidence
- useful multi-step working tables localized
- category answers/options localized while preserving correct-option identity
- numeric/ratio/percentage options retain English-authority semantics
- localized Question Studio activation: NOT AUTHORIZED pending human review
