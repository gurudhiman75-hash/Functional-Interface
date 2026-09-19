# DI-008 Hindi/Punjabi Localization — Review Candidate V1

Status: HI_PA_REVIEW_CANDIDATE · NOT QUESTION-STUDIO-ACTIVE

## Scope

- English authority remains DI-QL-085 through DI-QL-096.
- Hindi locale: hi-IN.
- Punjabi locale: pa-IN.
- All 12 permanent DI-008 task families localized.
- All 144 learner-facing object labels localized into Devanagari and Gurmukhi.
- Table title, instruction, row label and column labels localized.
- Question stems are generated from structured task/evidence, not blind string replacement.
- Worked explanations are rebuilt from the verified numeric state in the selected locale.
- Options, correct index, canonical answer and arithmetic table values are unchanged from English.

## Review safeguards

- Roman-letter learner-surface leakage is prohibited in Hindi/Punjabi.
- All three stem variants are required for every permanent QL in both locales.
- Deterministic replay is required.
- Numeric/arithmetic parity with the approved English authority is required.
- Question Studio remains English-only until localized editorial approval.
- Question Bank remains NOT_STORED.
- Tests and mocks remain INELIGIBLE.
- Public/student publication remains disabled.
- Production release remains unauthorized.

## Object pool

Six contexts × 24 labels = 144 source objects.

The localization proof sweeps the DI-008 source generator and requires all 144 source labels to have both Hindi and Punjabi native-script surfaces.

## Next gate

Human editorial review of Hindi/Punjabi sample output. Only after explicit approval should the localized surfaces be frozen and exposed in controlled Question Studio review.
