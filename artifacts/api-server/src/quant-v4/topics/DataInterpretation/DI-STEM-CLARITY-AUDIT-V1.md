# Data Interpretation Stem Clarity Audit V1

Audit date: 2026-09-29

Scope: learner-facing generated stems and explanations across DI-001–DI-014, with a focused regression pass on rounded answers and histogram total-frequency wording.

## Finding: rounded answers were phrased inconsistently

Some DI-001, DI-003, DI-009 and DI-010 stem variants told learners to round to the nearest whole percent or whole number. Other variants for the same task asked for an approximate answer. This made the requested answer precision depend on the selected wording surface.

The affected generated variants now ask for an approximate result and no longer direct the learner to round. Their explanations show the approximate result without repeating a rounding instruction. Numeric answer generation and answer keys are unchanged.

## Histogram total-frequency example

For class frequencies `35, 45, 35, 65, 55, 45, 35, 45, 35`, the total is `395`.

- `395` is the sum of all nine class frequencies.
- `65` is the largest single class frequency.
- `330` is the total with the largest class omitted: `395 − 65`.
- `360` is the total with a class of frequency `35` omitted: `395 − 35`.

So the reviewer's answer and calculation are mathematically consistent. The former stem variant “Find the total frequency represented by the histogram” was valid but less direct than the other variants. It has been replaced with explicit overall-count wording that names the histogram classes or observations. A regression now checks that the answer equals the sum of all generated class frequencies and that the stem clearly asks for the overall count.

## Regression coverage

- DI-001, DI-003, DI-009 and DI-010 tests reject explicit nearest-whole rounding instructions in generated stems.
- Rounded percentage and grouped-statistic stems must signal approximation.
- DI-009 checks the total-frequency answer against an independent sum of the visible class frequencies.
- Existing answer-index, independent-verification, deterministic-replay, option and chart checks remain in place.

## Audit boundary

This pass checked generated wording and mathematical answerability in source and deterministic samples. It does not claim an independent human comparison against a representative bank of current SSC/Banking previous-year questions. DI-004's Hindi/Punjabi pack still requires human review before freeze. DI-011–DI-014 remain English-only and still need a separate Hindi/Punjabi localization and review pass.
