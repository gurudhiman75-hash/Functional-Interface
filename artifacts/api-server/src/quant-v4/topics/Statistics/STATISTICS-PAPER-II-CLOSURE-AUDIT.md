# Statistics Paper II Closure Audit

**Audit date:** 2026-09-29  
**Target:** Quant V4 Statistics on `New-main`  
**Overall status:** Implementation mapped across all syllabus areas; not yet ready for chapter closure.

## Implemented foundation

STAT-001 through STAT-014 are merged. Their permanent contracts cover STAT-QL-001 through STAT-QL-175 and are routed for SSC CGL Tier II and JSO Paper II. Package-level workflows for STAT-004 through STAT-014 passed. The STAT-001, STAT-002, and original STAT-003 package checks also passed.

The review-only lifecycle remains in force: Question Bank writes, test/mock eligibility, localization, public publication, and production release are disabled.

## Coverage and remaining depth

| Paper II area | Current owner | Audit finding |
|---|---|---|
| Collection, classification, presentation | STAT-004; DI-009/DI-010 for specified chart tasks | Data collection and tabulation are covered. The boundary for chart selection and construction beyond the DI-owned histogram/frequency-polygon tasks is not explicitly resolved. |
| Central tendency and partition values | STAT-001, STAT-003, STAT-005 | Raw and selected frequency/grouped measures plus quartiles, deciles, and percentiles have owners. |
| Dispersion | STAT-002, STAT-003, STAT-005 | Standard deviation and selected absolute/relative measures have owners. |
| Moments, skewness, kurtosis | STAT-006 | Foundation contracts are present. |
| Correlation and regression | STAT-007 | Correlation, simple regression, association, and three-variable partial/multiple correlation are present. Multiple regression remains an explicit syllabus gap. |
| Probability | STAT-008 | Core event rules, conditional probability, independence, total probability, and Bayes have contracts. |
| Random variables and distributions | STAT-009 | Common named distributions and discrete joint-distribution foundations are present. |
| Sampling theory | STAT-010 | Core designs, errors, sampling distribution, standard error, and a stated sample-size method are present. |
| Statistical inference | STAT-011 | Foundation only. Broader estimator applications, confidence-interval construction, and test decisions are explicitly deferred. |
| Analysis of variance | STAT-012 | Foundation only. Replicated two-way designs, interaction decomposition, post-hoc comparisons, assumptions, and diagnostics remain deferred. |
| Time series | STAT-013 | Foundation only. Its design says trend coefficients are supplied, so fitting a trend from raw data and other listed extensions remain open. |
| Index numbers | STAT-014 | Foundation only. Weighted average-of-relatives variants and broader multi-period basket/base/chain work remain open. |

## Review and validation notes

- STAT-004's registry marks its 15 English contracts as certified and English-review approved. Its representative `REVIEW.md` previously said permanent QL numbering was not assigned; that stale metadata is corrected in this change.
- The representative review files for STAT-005 through STAT-014 are still marked as awaiting editorial approval. Structural checks found four options, a keyed answer, and an explanation for each listed question, with no duplicate stems within each file. This is not a substitute for editorial approval or full mathematical/content review.
- The STAT-003 restoration workflow's deterministic proof passed, but its Question Studio integration step stopped at an unrelated GEO-IND-001 content-closure failure. The latest broad Quant real-exam-simulation workflow also fails on a DSF-001 specificity assertion, outside Statistics; STAT-014's package-specific workflow and Question Studio adapter check passed.

## Closure gates

1. Resolve ownership for the remaining chart-selection/construction concepts.
2. Extend the named syllabus areas above or explicitly document their accepted scope limits.
3. Complete editorial and mathematical review of the representative generated questions and explanations.
4. Rerun the relevant Statistics and Quant integration checks after the unrelated GEO/DSF blockers are resolved.
5. Keep learner-facing lifecycle paths locked until their separate approval and validation.
