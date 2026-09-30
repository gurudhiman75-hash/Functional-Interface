# Data Interpretation Stem Clarity Audit V1

Audit date: 2026-09-30

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

## Finding: localized candidate stems included solving directions

Several newly added Hindi/Punjabi candidate stems for DI-004 single-/three-series and DI-011 through DI-014 described steps such as finding a missing value first, adding selected values, or calculating an average. These are now phrased as direct questions. The stem tests require a question form and reject the procedural wording; working steps remain in the explanations.

## Follow-up: stems still sounded templated

Review feedback found that removing procedural directions was not enough: many Hindi/Punjabi stems still repeated literal, formula-like phrases. The revised DI-004 single-/three-series and DI-011–DI-014 templates use shorter question forms and more idiomatic wording for totals, comparisons, ratios, and chart references while preserving the data and requested operation. The user approved the revised wording on 2026-09-30 after an exam-style cross-check. This records approval of the candidate wording; the existing publication and production gates remain closed. The already-frozen DI-004 permanent two-series release is unchanged.

## Follow-up: localized stems still directed rounding

The chapter-wide multilingual pass found that frozen Hindi/Punjabi stem variants in DI-001, DI-003, DI-009 and DI-010 still explicitly asked for nearest-whole percentages or numbers. These variants now ask for approximate values in direct question form. Answer calculations, integer output contracts and the existing frozen scope remain unchanged. Regression checks reject nearest-whole rounding instructions in the localized stems.

## Audit boundary

This pass checked generated wording and mathematical answerability in source and deterministic samples and cross-checked stem structure against SSC-style exam examples. Revised DI-004 single-/three-series and DI-011–DI-014 Hindi/Punjabi surfaces have user approval for wording. This approval does not authorize Question Bank, scored-test, mock, public/student publication, or production release.
