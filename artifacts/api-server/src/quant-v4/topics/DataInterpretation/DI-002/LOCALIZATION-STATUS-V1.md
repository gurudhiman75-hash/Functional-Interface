# DI-002 Advanced Table — Hindi/Punjabi Localization Review V1

Status: HI_PA_FROZEN · CONTROLLED_QUESTION_STUDIO_REVIEW

## Source authority

- English authority: DI-QL-097 through DI-QL-108.
- 12 approved non-trivial task families.
- Easy floor remains arithmetic-only.
- Hindi locale: hi-IN.
- Punjabi locale: pa-IN.

## Coverage

- 6 scenario families.
- 144 configured source row labels.
- 12 permanent QLs.
- all three stem surfaces per QL.
- SSC CGL Tier I and Banking Prelims.
- exactly one missing Applicants entry retained in every table.

## Localization method

Learner-facing text is rebuilt from structured table/evidence state rather than translated from completed English strings. Localized surfaces include title, instruction, row header, column names, row labels, stems, explanations and working-table headers.

Numeric table values, hidden-row index, answer, options, correct index, difficulty, task ownership and canonical arithmetic remain identical to English.

## Safeguards

- Roman learner-surface leakage is prohibited in Hindi/Punjabi.
- Hindi learner surfaces may not use banned DI terminology such as स्तंभ.
- retired trivial families remain unavailable.
- Easy routes must still require arithmetic.
- Medium routes remain derived/aggregate.
- Hard routes retain at least three worked steps.
- deterministic replay is required.
- Hindi/Punjabi are enabled in Question Studio CONTROLLED_REVIEW.
- Question Bank/tests/mocks/publication/production remain locked.

## Next gate

Question Bank, tests, mocks, public/student publication and production release remain closed. Any widening beyond Question Studio CONTROLLED_REVIEW requires a separate explicit release decision.
