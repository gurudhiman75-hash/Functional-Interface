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

Review feedback found that removing procedural directions was not enough: many Hindi/Punjabi stems still repeated literal, formula-like phrases. The revised DI-004 single-/three-series and DI-011–DI-014 templates use shorter question forms and more idiomatic wording for totals, comparisons, ratios, and chart references while preserving the data and requested operation. These revised stems remain candidates pending another user review. The already-frozen DI-004 permanent two-series release is unchanged.

The subsequent chapter scan found four English DI-012 stems that began with “After recovering…” or “After solving…”, and one DI-006 stem that appended “after resolving all stated relations.” These directions are now removed from the questions; the recovery work stays in the explanations. The DI-011 pie-chart/table prompt also no longer adds a stiff “according to the table” clause where the paired display already supplies that context. Regression checks cover these wording rules.

## Exam-style spot check (2026-09-30)

A limited comparison was made against publicly available SSC CGL and Banking DI materials:

- SSC CGL Tier I, 20 July 2023 Shift 2, uses a separate direction to read the pie chart, followed by a direct question: “What is the difference between the funds … acquired by the school from donation and those from government agencies?” [Paper copy](https://cdn-images.prepp.in/public/image/SSC_CGL_2023_Tier_1_Shift_2_Question_Paper_with_Answer_Key_PDF_English_July_20_2023_1_46_3e1e8fbcff723636a6d459786209987b.pdf).
- SSC CGL Tier II, 26 October 2023 Shift 1, asks directly for “the difference between the average production” for the named flavours and years. [Question record](https://prepp.in/question/a-toffee-company-prepares-toffee-of-two-different-65e05950d5a684356e94000a).
- Banking-style DI sets also separate directions from the individual asks; examples use direct forms such as “Find the average…” and “What is the ratio…”. The available sample was a practice quiz, not an official SBI/IBPS paper. [SBI PO/Clerk practice quiz, 16 October 2023](https://www.bankersadda.com/quantitative-aptitude-quiz-for-sbi-po-clerk-prelims-2023-16th-october/).

This spot check supports keeping data-set directions in the chart/table presentation and phrasing the question itself as a concise ask. It is a limited style comparison, not a representative linguistic study or proof of official authorship. It informed the DI-011 pie/table edits and the DI-012 direct variable-value wording in this revision.

## Audit boundary

The wording checks and answerability checks cover deterministic source samples; the external comparison above is a limited spot check rather than a representative bank-wide comparison. Revised DI-004 single-/three-series and DI-011–DI-014 Hindi/Punjabi surfaces remain review candidates and require another review before freeze.
