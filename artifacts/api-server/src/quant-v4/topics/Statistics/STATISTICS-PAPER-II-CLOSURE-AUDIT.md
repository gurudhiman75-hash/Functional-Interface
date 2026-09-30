# Statistics Paper II Closure Audit

**Audit date:** 2026-09-30  
**Target:** Quant V4 Statistics on `New-main`  
**Overall status:** Implementation mapped across all syllabus areas; not yet ready for chapter closure.

## Implemented foundation

STAT-001 through STAT-014 are merged. The original permanent contracts cover STAT-QL-001 through STAT-QL-175. Controlled-review depth additions extend STAT-QL-176 through STAT-QL-208 across STAT-007 and STAT-011 through STAT-014. Package-level workflows for STAT-004 through STAT-014 passed. The STAT-001, STAT-002, and original STAT-003 package checks also passed.

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
| Statistical inference | STAT-011 | Point-estimation foundations now include known-σ mean and Wald proportion interval construction plus upper-tailed Z and chi-square critical-value decisions, and a decision from a supplied p-value. Two-sample/small-sample intervals, calculated p-values, broader test families, power, and sample-size planning remain deferred. |
| Analysis of variance | STAT-012 | One-way calculation from raw data; additive randomized-block F calculation; replicated 2×2 interaction SS/F; interaction interpretation and the unreplicated limitation; Tukey-style follow-up; classical assumptions and residual variance diagnosis. Repeated measures, mixed models and robust alternatives remain outside this foundation pass. |
| Time series | STAT-013 | Trend can be fitted from raw coded-time observations by least squares; raw-data centered four-quarter moving averages, adjusted quarterly indices, additive seasonal forecasts, and multiplicative deseasonalization are also covered. Ratio-to-moving-average seasonal estimation, multiplicative seasonal forecasting, additive adjustment and even-length semi-average trend fitting now complete this classical foundation pass. Advanced stochastic forecasting and other decomposition methods remain outside this pass. |
| Index numbers | STAT-014 | Weighted price relatives, multi-period Laspeyres basket, three-link chain index, rebasing a multi-period series, and a Marshall-Edgeworth price index now supplement the foundation; broader index families remain open. |

## Review and validation notes

- STAT-004's registry marks its 15 English contracts as certified and English-review approved. Its representative `REVIEW.md` previously said permanent QL numbering was not assigned; that stale metadata is corrected in this change.
- The user approved STAT-011 earlier and STAT-012, STAT-013, and STAT-007 representative reviews on 2026-09-30. The STAT-012 and STAT-013 candidates include QL201–208. STAT-007 and STAT-009 were approved on 2026-09-30. Question diversity and pool expansion are deferred by the user to a later pass. Remaining representative reviews for STAT-005, STAT-006, STAT-008, STAT-010, and STAT-014 await editorial approval. Structural checks found four options, a keyed answer, and an explanation for each listed question, with no duplicate stems within each file.
- The STAT-003 restoration workflow's deterministic proof passed, but its Question Studio integration step stopped at an unrelated GEO-IND-001 content-closure failure. STAT-007 multiple regression, STAT-011 inference depth, STAT-012 replicated ANOVA, STAT-013 time-series depth, and STAT-014 multi-period index updates all passed their package checks, shared-profile and learner-surface checks, plus the 220-section Quant simulation. Unrelated failures in older audit runs should not be treated as current blockers.

## Closure gates

1. Chart ownership is mapped to DI-001–005, DI-009–011; confirm the DI chapter's exhaustive audit remains aligned with this boundary and avoid duplicate STAT contracts.
2. Continue depth review for remaining STAT-011 through STAT-014 gaps: broader inference families and diagnostics, advanced ANOVA layouts and alternatives, advanced time-series decomposition/forecasting, and additional index-number methods; document accepted scope limits.
3. Complete editorial and mathematical review of the remaining representative generated questions and explanations; STAT-007 and STAT-009 are approved.
4. The latest Statistics depth wave passed its focused and Quant-wide integration checks; rerun them when further content changes are made.
5. Keep learner-facing lifecycle paths locked until their separate approval and validation.
