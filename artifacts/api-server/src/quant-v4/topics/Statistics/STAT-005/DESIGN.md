# STAT-005 — Partition Values and Dispersion

## Purpose and ownership

STAT-005 extends the Statistics foundation with quartiles, deciles, percentiles, and selected absolute and relative measures of dispersion. It does not clone STAT-001 raw median/mode, STAT-002 standard-deviation transformations, or STAT-003 mean/median/mode from frequency distributions. STAT-005's partition-position contracts and other dispersion measures are separate semantic skills.

The 16 permanent contracts use STAT-QL-036 through STAT-QL-051. Each supports SSC CGL Tier II and JSO. All items remain English-only controlled-review candidates; no Question Bank writes, test/mock eligibility, public publication, localization, or production release are enabled.

## Formula conventions

- Raw observations: partition position is `k(n + 1) / m`; interpolate linearly between adjacent ordered observations when the position is fractional. The stem states this convention.
- Discrete frequency distributions: use nearest rank `ceil(kN / m)` and cumulative frequency. The stem states this convention.
- Grouped continuous distributions: use target position `kN / m` and interpolation `L + [(target − cf_before) / f] × h` in the containing class.
- Range is `largest − smallest`; coefficient of range is `(largest − smallest) / (largest + smallest)`.
- Quartile deviation is `(Q3 − Q1) / 2`; its coefficient is `(Q3 − Q1) / (Q3 + Q1)`.
- Mean deviation items state whether deviations are measured about the arithmetic mean or median.
- Coefficient of variation uses the stated population standard deviation and arithmetic mean: `σ / x̄ × 100`.

Formula conventions are shown in the question whenever multiple textbook conventions could otherwise change the result. Percentages are rounded to two decimal places only where needed for display; no rounded value is used as an input to another calculation.

## Deliberate exclusions

- Standard deviation calculation and transformations remain with STAT-002. STAT-005 only uses a supplied mean and population standard deviation to form the coefficient of variation.
- Frequency mean, median, mode and grouped central-tendency interpolation remain with STAT-003.
- Reading a chart or extracting values from a supplied histogram/frequency polygon remains with DI-009/DI-010.
- Sampling theory is a later Statistics ownership group; this package only uses explicit rank conventions for partition values.
- Moments, skewness, kurtosis, correlation, regression, probability, distributions, inference, ANOVA, time series and index numbers retain separate blueprint ownership.

## Table stems render each frequency table once, with one Markdown header row.

## Proof requirements

`partition-dispersion.test.ts` sweeps all 16 contracts, both supported profiles, and 25 deterministic seeds per contract/profile. It checks replay stability, unique options, answer-index consistency, independent recomputation from stored state, and lifecycle locks. The Question Studio integration proof checks all 16 permanent QLs under the JSO profile.
