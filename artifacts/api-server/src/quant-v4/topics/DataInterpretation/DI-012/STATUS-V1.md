# DI-012 Advanced Variable / Multi-Missing DI — V1 Review Candidate

Status: ENGLISH_REVIEW_CANDIDATE · CONTROLLED_REVIEW

## Purpose
DI-012 closes the second P0 gap from the DI exhaustiveness audit: advanced missing-data sets whose unknown structure is richer than DI-007's one-hidden-cell model.

## Recovery models
1. SINGLE_X_TOTAL
2. X_Y_SUM_DIFFERENCE
3. X_Y_RATIO_TOTAL
4. TWO_MISSING_COLUMN_TOTALS
5. MISSING_RATE
6. AVERAGE_CONSTRAINED
7. CHAINED_RECOVERY

The learner-visible table contains x and, where applicable, y. The additional condition is sufficient to recover every unknown without hidden semantic information.

## Question families
Easy:
- RECOVER_X
- RECOVER_Y

Medium:
- UNKNOWN_SUM
- UNKNOWN_DIFFERENCE
- UNKNOWN_RATIO
- RECOVERED_ROW_TOTAL
- RECOVERED_COLUMN_TOTAL

Hard:
- RECOVERED_SHARE_OF_TOTAL
- CROSS_ROW_RATIO_AFTER_RECOVERY
- COMBINED_RECOVERED_PERCENT

Each set emits exactly 1 Easy + 2 Medium + 2 Hard questions.

## Profiles
- Banking Prelims
- Banking Mains

## Verification
V1 stress proof:
- 350 deterministic sets
- 1,750 linked questions
- all 7 recovery models exercised
- all 10 task families exercised
- deterministic replay
- independent recovery of x/y from learner-visible table + condition
- five unique options
- answer/index parity
- no decimal answers
- exact difficulty balance

## Lifecycle
- Question Studio discoverable: true
- mode: CONTROLLED_REVIEW
- English only
- Question Bank: NOT_STORED
- writes disabled
- tests/mocks: INELIGIBLE
- public/student publication: disabled
- production release: not authorized
- manual approval required

Localization and production promotion remain separate approval gates.
