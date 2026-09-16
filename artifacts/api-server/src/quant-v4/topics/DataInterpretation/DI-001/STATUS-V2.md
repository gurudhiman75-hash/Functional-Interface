# DI-001 Table Interpretation — V2 Review Candidate

Status: `REVIEW_ONLY_V2`

DI-001 V2 rebuilds the foundational table layer without changing or promoting the existing Phase-0 generator. The V2 engine reuses the deterministic Phase-0 mathematical table state, then applies a broader question contract and cleaner learner-facing language for human review.

## V2 task library

Easy:
- `DIRECT_SELECTED`
- `TOTAL_APPLICANTS`
- `LARGEST_SELECTED`

Medium:
- `DIFFERENCE_SELECTED`
- `PERCENTAGE_SELECTED`
- `RATIO_APPLICANTS`
- `AVERAGE_SELECTED`

Hard:
- `OVERALL_SELECTION_PERCENTAGE`
- `SELECTED_TO_NOT_SELECTED_RATIO`
- `SELECTION_RATE_DIFFERENCE`

Each generated set contains five distinct task families with exactly 1 Easy + 2 Medium + 2 Hard.

## Quality changes from Phase 0

- ten active task families instead of five fixed questions
- genuine multi-step Hard questions rather than only direct table arithmetic
- three stem surfaces per task family
- generic centre labels only; no local city names
- misconception-owned distractors with deterministic option shuffling
- simple question-specific explanations
- working tables on multi-step Hard tasks where they improve readability
- blocked learner-facing wording for `associated`, `shortcut`, `trap`, and `common trap`
- independent answer recomputation
- SSC CGL Tier I four-option and Banking Prelims five-option profiles

## Review proof target

The dedicated V2 proof runs 120 seeds for each profile: 240 sets / 1,200 questions, deterministic replay, independent verification, task-frequency checks, answer-position coverage, stem-surface coverage, mathematical-state diversity, cross-profile semantic parity, and lifecycle checks.

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
