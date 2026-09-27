# DI-004 Line Graph — Hindi/Punjabi Localization Review V1

Status: HI_PA_REVIEW_CANDIDATE · HUMAN APPROVAL PENDING

## Source authority

- English authority: DI-QL-109 through DI-QL-120.
- 12 approved task families.
- Easy floor remains arithmetic-only.
- Hindi locale: hi-IN.
- Punjabi locale: pa-IN.

## Coverage

- 6 scenario families.
- 72 configured series pairs / 144 source entity labels.
- 12 permanent QLs.
- all three stem surfaces per QL.
- SSC CGL Tier I and Banking Prelims.
- six plotted periods and two-series line semantics preserved.
- monthly period answers/options localized into native month names.

## Localization method

Learner-facing text is rebuilt from structured line/evidence state rather than translated from completed English strings. Localized surfaces include title, instruction, period labels, series names, y-axis label, unit label, stems, categorical period answers/options, explanations and working-table headers.

Numeric plotted values, answer index, difficulty, task ownership and canonical arithmetic remain identical to English.

## Wording policy

- Learner-facing stems do not instruct the learner to round to the nearest whole number/percent.
- Approximate wording is used where the underlying engine returns whole-number percentage or average answers.
- Roman learner-surface leakage is prohibited in Hindi/Punjabi.
- Hindi learner surfaces may not use banned DI terminology such as स्तंभ.
- Hindi and Punjabi cross-script leakage is prohibited.

## Safeguards

- Easy routes must still require arithmetic.
- Medium routes remain derived/comparison tasks.
- Hard routes retain at least three worked steps.
- deterministic replay is required.
- Hindi/Punjabi remain Question Studio locked pending human approval.
- Question Bank/tests/mocks/publication/production remain locked.

## Next gate

Human review of the generated Hindi/Punjabi pack is required before HI_PA_FROZEN and multilingual Question Studio CONTROLLED_REVIEW.
