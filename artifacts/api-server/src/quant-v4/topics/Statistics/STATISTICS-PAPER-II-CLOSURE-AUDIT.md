# Statistics Paper II Closure Audit

**Audit date:** 2026-09-30  
**Target:** Quant V4 Statistics on `New-main`  
**Overall status:** Implementation mapped across all syllabus areas; not yet ready for chapter closure.

## Implemented foundation

STAT-001 through STAT-014 are merged. The original permanent contracts cover STAT-QL-001 through STAT-QL-175. Controlled-review depth additions extend STAT-QL-176 through STAT-QL-200 across STAT-007 and STAT-011 through STAT-014. Package-level workflows for STAT-004 through STAT-014 passed. The STAT-001, STAT-002, and original STAT-003 package checks also passed.

The review-only lifecycle remains in force: Question Bank writes, test/mock eligibility, localization, public publication, and production release are disabled.

## Coverage and remaining depth

| Paper II area | Current owner | Audit finding |
|---|---|---|
| Collection, classification, presentation | STAT-004; DI-009/DI-010 for specified chart tasks | Ownership is explicit: STAT-004 handles collection, classification, tabulation and raw frequency tables. DI-001/002 own table-based DI; DI-003 grouped bars; DI-004 line charts; DI-005 pie charts; DI-009 histograms; DI-010 frequency polygons; DI-011 mixed charts. STAT-004 does not duplicate those chart-reading or construction tasks. |
| Central tendency and partition values | STAT-001, STAT-003, STAT-005 | Raw and selected frequency/grouped measures plus quartiles, deciles, and percentiles have owners. |
| Dispersion | STAT-002, STAT-003, STAT-005 | Standard deviation and selected absolute/relative measures have owners. |
| Moments, skewness, kurtosis | STAT-006 | Foundation contracts are present. |
| Correlation and regression | STAT-007 | Correlation, simple and multiple regression, association, and three-variable partial/multiple correlation are present. |
| Probability | STAT-008 | Core event rules, conditional probability, independence, total probability, and Bayes have contracts. |
| Random variables and distributions | STAT-009 | Common named distributions and discrete joint-distribution foundations are present. |
| Sampling theory | STAT-010 | Core designs, errors, sampling distribution, standard error, and a stated sample-size method are present. |
| Statistical inference | STAT-011 | Point-estimation foundations now include known-σ mean and Wald proportion interval construction plus upper-tailed Z and chi-square critical-value decisions, and a decision from a supplied p-value. Two-sample/small-sample intervals, p-values, broader test families, power, and sample-size planning remain deferred. |
| Analysis of variance | STAT-012 | One-way foundation plus replicated 2×2 interaction sum-of-squares/F calculation, interaction interpretation, Tukey-style follow-up, and classical assumptions. Broader layouts, diagnostics, and robust alternatives remain open. |
| Time series | STAT-013 | Trend can be fitted from raw coded-time observations by least squares; raw-data centered four-quarter moving averages, adjusted quarterly indices, additive seasonal forecasts, and multiplicative deseasonalization are also covered. Other decomposition and forecasting extensions remain open. |
| Index numbers | STAT-014 | Weighted price relatives, multi-period Laspeyres basket, three-link chain index, rebasing a multi-period series, and a Marshall-Edgeworth price index now supplement the foundation; broader index families remain open. |

## Review and validation notes

- STAT-004's registry marks its 15 English contracts as certified and English-review approved. Its representative `REVIEW.md` previously said permanent QL numbering was not assigned; that stale metadata is corrected in this change.
- The representative review files for STAT-005 through STAT-014 are still marked as awaiting editorial approval. Structural checks found four options, a keyed answer, and an explanation for each listed question, with no duplicate stems within each file. This is not a substitute for editorial approval or full mathematical/content review.
- The STAT-003 restoration workflow's deterministic proof passed, but its Question Studio integration step stopped at an unrelated GEO-IND-001 content-closure failure. STAT-007 multiple regression, STAT-011 inference depth, STAT-012 replicated ANOVA, STAT-013 time-series depth, and STAT-014 multi-period index updates all passed their package checks, shared-profile and learner-surface checks, plus the 220-section Quant simulation. Unrelated failures in older audit runs should not be treated as current blockers.

## Closure gates

1. Chart ownership is mapped to DI-001–005, DI-009–011; confirm the DI chapter's exhaustive audit remains aligned with this boundary and avoid duplicate STAT contracts.
2. Continue depth review for remaining STAT-011 through STAT-014 gaps: broader inference families and diagnostics, additional ANOVA layouts/diagnostics, advanced time-series decomposition/forecasting, and additional index-number methods; document accepted scope limits.
3. Complete editorial and mathematical review of the representative generated questions and explanations.
4. The latest Statistics depth wave passed its focused and Quant-wide integration checks; rerun them when further content changes are made.
5. Keep learner-facing lifecycle paths locked until their separate approval and validation.
