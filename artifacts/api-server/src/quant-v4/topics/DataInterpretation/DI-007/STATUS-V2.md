# DI-007 Missing Data Interpretation — V2 Review

Status: ENGLISH_REVIEW_APPROVED · CONTROLLED_REVIEW

## Why V2 exists

The Phase-6 DI-007 implementation has a sound deterministic arithmetic core, but its learner surface is too narrow for final banking-exam closure:

- only 5 task families
- no Easy questions
- one generic accounts context
- generic Series A / Series B learner wording
- one fixed five-year presentation
- one stem surface per task
- forced shortcut/trap explanation fields

V2 preserves the exact recovery mathematics and rebuilds the content layer.

## V2 learner contract

- banking-only: Banking Prelims and Banking Mains
- genuine missing-table DI with exactly one hidden value
- five rows and two context-specific series
- additional aggregate condition used to reconstruct the hidden value
- five linked questions per set
- exact difficulty mix: 1 Easy + 2 Medium + 2 Hard
- 12 task families
- three stem surfaces per task family
- five unique options per question
- simple question-specific worked explanations
- misconception-owned distractors
- no forced shortcut/trap sections
- no generic Series A / Series B wording on the learner surface

## Task families

Easy:
1. DIRECT_VISIBLE_VALUE
2. VISIBLE_ROW_DIFFERENCE

Medium:
3. RECOVER_MISSING_VALUE
4. HIDDEN_ROW_COMBINED_TOTAL
5. MISSING_TO_PAIRED_RATIO
6. B_TOTAL_AS_PERCENT_OF_A_TOTAL
7. MISSING_SHARE_OF_B_TOTAL
8. VISIBLE_TWO_ROW_B_TOTAL

Hard:
9. MISSING_AS_PERCENT_OF_PAIRED_A
10. COMBINED_HIDDEN_VISIBLE_SHARE_OF_B_TOTAL
11. HIDDEN_VS_VISIBLE_B_PERCENT_EXCESS
12. HIDDEN_ROW_TO_VISIBLE_ROW_TOTAL_RATIO

## Context variety

- bank branch applications received / approved
- insurance policies: new / renewed
- factory output: Line A / Line B
- course enrolment: Group A / Group B
- online orders: Channel A / Channel B
- book issues: Section A / Section B

## Missing-value recovery modes

Banking Prelims:
- column total
- column average
- combined total of both series

Banking Mains additionally:
- ratio of second-series total to first-series total
- difference between the two series totals

## Lifecycle

- reviewStatus: ENGLISH_REVIEW_APPROVED
- Question Studio discoverable: true
- Question Bank: NOT_STORED
- Question Bank writable: false
- test eligible: false
- mock-test eligible: false
- publicly publishable: false
- automatic student publication: false
- production release authorized: false

Permanent ownership allocated: DI-QL-073 through DI-QL-084. Question Studio is enabled only in CONTROLLED_REVIEW; Question Bank, tests, mocks, public/student delivery and production release remain locked.
