# DI-007 Missing Data Interpretation — Hindi/Punjabi Localization Review V1

Status: HI_PA_REVIEW_CANDIDATE · HUMAN APPROVAL PENDING

## Source authority

- English P2 authority: DI-QL-073 through DI-QL-084.
- DI-QL-073 uses VISIBLE_ROW_COMBINED_TOTAL; the retired DIRECT_VISIBLE_VALUE family is not localizable or runnable.
- Hindi locale: hi-IN.
- Punjabi locale: pa-IN.

## Coverage

- 12 permanent QLs.
- 6 table contexts.
- 30 row labels.
- all 5 missing-value recovery modes:
  - column total
  - column average
  - combined total
  - total ratio
  - total difference
- all three stem variants per QL.
- Banking Prelims and Banking Mains.

## Localization method

Learner-facing text is rebuilt from structured stimulus/evidence, not translated from final English strings. Localized fields include:

- title and instruction;
- row labels;
- both column labels and measures;
- units;
- aggregate recovery condition;
- stems;
- worked explanations.

Numeric values, hidden-cell position, recovery mode, answer, options, correct index and canonical arithmetic remain identical to English P2.

## Review safeguards

- Hindi/Punjabi learner surfaces may not leak Roman text.
- Recovery-condition mode and numeric authority must remain identical to English.
- DI-QL-073 must remain VISIBLE_ROW_COMBINED_TOTAL.
- Every Easy route requires arithmetic.
- Exactly one hidden cell remains.
- Five unique Banking options remain unchanged.
- Deterministic replay is required.
- Hindi/Punjabi remain Question Studio locked pending human approval.
- Question Bank/tests/mocks/publication/production remain locked.

## Next gate

Human review of the generated Hindi/Punjabi section in the standard DI-007 review artifact is required before HI_PA_FROZEN and multilingual Question Studio CONTROLLED_REVIEW.
