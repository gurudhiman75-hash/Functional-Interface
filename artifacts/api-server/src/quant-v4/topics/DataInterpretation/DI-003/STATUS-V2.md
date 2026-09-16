# DI-003 Grouped Bar Interpretation — V2 Review Candidate

Status: `REVIEW_ONLY_V2`

DI-003 V2 rebuilds the learner-facing grouped-bar layer while leaving the existing Phase-2 runtime unchanged. The older checkpoint was mathematically sound but too narrow for closure: it had only five Medium/Hard tasks, one fixed annual-sales context, no Easy layer, and forced shortcut/trap explanation fields.

## V2 question library

Easy:
- `DIRECT_BAR_VALUE`
- `HIGHEST_CATEGORY_FOR_SERIES`
- `LOWEST_CATEGORY_FOR_SERIES`

Medium:
- `CROSS_SERIES_DIFFERENCE`
- `COMBINED_CATEGORY_TOTAL`
- `WITHIN_SERIES_DIFFERENCE`
- `CATEGORY_RATIO_WITHIN_SERIES`
- `SERIES_AVERAGE`

Hard:
- `COMBINED_CATEGORY_RATIO`
- `PERCENT_CHANGE_WITHIN_SERIES`
- `CATEGORY_SHARE_OF_SERIES_TOTAL`
- `TOTAL_SERIES_PERCENT_EXCESS`

Every generated set contains five distinct families with exactly 1 Easy + 2 Medium + 2 Hard.

## Stimulus breadth

V2 rotates across six generic exam-safe contexts:
- annual sales
- monthly production
- test selections
- library issues
- ticket sales
- package dispatch

Each chart has five categories and two visible series. No local city names are used.

## Explanation and distractor policy

- simple question-specific explanations
- worked tables on multi-step families where they improve readability
- no forced shortcut/trap boilerplate
- misconception-owned distractors with controlled fallback only when a state collapses an otherwise valid distractor
- learner-facing blocked terms: `associated`, `shortcut`, `trap`, `common trap`

## Shared grouped-bar visual

`DataInterpretation/visuals/grouped-bar-svg.ts` is the proposed presentation authority:
- two stable series colours
- white canvas
- horizontal reading guides only
- no vertical axis spine
- no vertical/boundary ticks
- one horizontal baseline
- no bar-value labels
- explicit legend
- centred category labels
- accessible title/description
- chart scale explicitly labels every generated bar height

## Review proof target

The dedicated V2 qualification runs 120 seeds for each profile: 240 sets / 1,200 questions with deterministic replay, independent verification, 4/5-option profile checks, cross-profile semantic parity, all 12 task families, all three stem surfaces per family, answer-position coverage, six-context coverage, visual structural checks and lifecycle locks.

## Lifecycle

V2 remains review-only:
- Question Studio discovery: false
- Question Bank status: `NOT_STORED`
- Question Bank writable: false
- test eligibility: `INELIGIBLE`
- test eligible: false
- mock-test eligible: false
- public publication: false
- automatic student publication: false
- production release authorization: false

No permanent QLs are allocated. Promotion requires explicit human approval of the generated V2 review artifact.
