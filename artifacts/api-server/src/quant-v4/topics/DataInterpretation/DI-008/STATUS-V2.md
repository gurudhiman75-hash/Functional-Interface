# DI-008 Arithmetic Data Interpretation — V2 Review

Status: MULTILINGUAL_FROZEN · CONTROLLED_QUESTION_STUDIO_REVIEW

## Why V2 exists

The Phase-7 DI-008 arithmetic engine is mathematically sound and already passed large deterministic verification, but its learner surface is too narrow for final banking-exam closure:

- only 5 task families
- no Easy questions
- generic Product A–E labels
- one fixed business context
- one stem surface per task
- every Prelims question is Medium and every Mains question is Hard
- forced shortcut/trap explanation fields

V2 keeps the verified exact arithmetic model and rebuilds the content layer.

## V2 learner contract

- Banking Prelims and Banking Mains only
- one shared five-row business dataset per set
- five linked questions per set
- exact difficulty mix: 1 Easy + 2 Medium + 2 Hard
- 12 task families
- three stem surfaces per task family
- six standard business contexts with 24 natural item labels each (144 learner-facing objects total)
- five unique options per question
- misconception-owned distractors
- simple question-specific worked explanations
- no forced shortcut/trap sections
- Banking Prelims stays mostly direct or single-item at Medium level
- Banking Mains Medium/Hard requires aggregation or weighting across multiple rows

## Task families

Easy:
1. UNIT_INCREASE
2. REVENUE_AMOUNT

Medium:
3. PERCENT_CHANGE
4. PROFIT_AMOUNT
5. PROFIT_PERCENT
6. REVENUE_SHARE
7. PROFIT_RATIO
8. AVERAGE_PROFIT

Hard:
9. COMBINED_PERCENT_CHANGE
10. COMBINED_PROFIT_PERCENT
11. GROUP_REVENUE_RATIO
12. WEIGHTED_AVERAGE_SELLING_PRICE

## Context variety

- stationery wholesale
- packaged foods
- sports goods
- electronic accessories
- household items
- office supplies

## Verification proof

Local V2 stress proof:

- 320 generated sets across 160 seeds × 2 banking profiles
- 1,600 linked questions
- 320 deterministic replay checks
- 1,600 independent verification checks
- 8,000 option checks
- 160 cross-profile shared-dataset checks
- 160 Prelims single-item Medium arithmetic checks
- 640 Mains aggregate/weighted Medium/Hard checks
- all 12 task families exercised
- all 6 contexts exercised
- all 144 configured learner-facing object labels exercised (24/24 in every context)
- all 3 stem variants exercised for every task family
- every task/profile reached answer positions A–E
- 160 distinct shared mathematical states
- 317 distinct five-question order signatures

## Lifecycle

- reviewStatus: ENGLISH_REVIEW_APPROVED
- Question Studio discoverable: true, CONTROLLED_REVIEW only
- Question Bank: NOT_STORED
- Question Bank writable: false
- test eligible: false
- mock-test eligible: false
- publicly publishable: false
- automatic student publication: false
- production release authorized: false
- permanent QLs: DI-QL-085 through DI-QL-096
- localization: HI_PA_FROZEN

Hindi/Punjabi editorial review is approved. Question Studio now supports en/hi/pa in CONTROLLED_REVIEW; Question Bank, tests, mocks, public/student delivery and production release remain closed.


## Permanent English review promotion

- permanent ownership: DI-QL-085 through DI-QL-096
- one permanent QL per V2 task family
- canonical problem: DI-CP-008
- Question Studio: discoverable in CONTROLLED_REVIEW
- Question Bank: NOT_STORED / writes disabled
- tests and mocks: INELIGIBLE
- public/student publication: disabled
- production release: not authorized
- localization: HI_PA_FROZEN

The shared Quant V4 Question Studio adapter routes DI-008 explicitly and the integration proof exercises all 12 permanent QLs, deterministic replay, five-option shape, semantic arithmetic-table stimulus, lifecycle locks, and explicit QL routing.


## Hindi/Punjabi frozen multilingual authority V1

- locales: hi-IN and pa-IN
- 12/12 permanent QLs localized
- 144/144 object labels localized in both scripts
- structured stem generation; no blind whole-question translation
- question-specific worked explanations localized from verified arithmetic state
- numeric table values, options, correct index and canonical answers remain identical to English
- Roman-letter leakage blocked on learner-facing localized surfaces
- localized Question Studio activation: CONTROLLED_REVIEW authorized
